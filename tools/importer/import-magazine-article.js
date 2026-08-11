/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsBylineParser from './parsers/cards-byline.js';
import cardsBioParser from './parsers/cards-bio.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import heroCalloutParser from './parsers/hero-callout.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/admiral-cleanup.js';
import sectionsTransformer from './transformers/admiral-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-byline': cardsBylineParser,
  'cards-bio': cardsBioParser,
  'cards-teaser': cardsTeaserParser,
  'hero-callout': heroCalloutParser,
};

// TRANSFORMER REGISTRY (cleanup before parse, sections after)
const transformers = [cleanupTransformer, sectionsTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: "magazine-article",
  description: "Editorial long-form article: title header, article-contents jump list, author byline with share links, hero image, rich-text body with H2 sections, author bio, share block, related-articles cards, and product CTA.",
  urls: ["https://www.admiral.com/magazine/guides/motor/10-ways-to-make-your-car-last-longer"],
  blocks: [
      {
          "name": "cards-byline",
          "instances": [
              ".story__meta"
          ]
      },
      {
          "name": "cards-bio",
          "instances": [
              ".story__expert"
          ]
      },
      {
          "name": "cards-teaser",
          "instances": [
              ".views-element-container .grid"
          ]
      },
      {
          "name": "hero-callout",
          "instances": [
              ".hero-banner"
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
