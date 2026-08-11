/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPromoParser from './parsers/hero-promo.js';
import cardsSupportParser from './parsers/cards-support.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/admiral-cleanup.js';
import sectionsTransformer from './transformers/admiral-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-promo': heroPromoParser,
  'cards-support': cardsSupportParser,
};

// TRANSFORMER REGISTRY (cleanup before parse, sections after)
const transformers = [cleanupTransformer, sectionsTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: "help-support",
  description: "Support/informational page: hero intro, rich-text guidance with H2/H3 sub-headings and external resource links, contact-us card list, and 'more support' teaser cards grid.",
  urls: ["https://www.admiral.com/help-support-hub/money-worries/money-management"],
  blocks: [
      {
          "name": "section-more-support",
          "instances": [
              "#basic-18374 .bg-fino"
          ],
          "section": "accent"
      },
      {
          "name": "hero-promo",
          "instances": [
              ".hero-banner"
          ]
      },
      {
          "name": "cards-support",
          "instances": [
              "#basic-18374 .grid"
          ]
      }
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    // Skip section-* entries — those are section-metadata styling, not parseable blocks.
    if (blockDef.name.startsWith('section-')) return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
