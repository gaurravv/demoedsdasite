/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPromoParser from './parsers/hero-promo.js';
import embedReviewParser from './parsers/embed-review.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import tabsCoverParser from './parsers/tabs-cover.js';
import tableCompareParser from './parsers/table-compare.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import quoteExpertParser from './parsers/quote-expert.js';
import columnsStepsParser from './parsers/columns-steps.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/admiral-cleanup.js';
import sectionsTransformer from './transformers/admiral-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-promo': heroPromoParser,
  'embed-review': embedReviewParser,
  'cards-feature': cardsFeatureParser,
  'accordion-faq': accordionFaqParser,
  'tabs-cover': tabsCoverParser,
  'table-compare': tableCompareParser,
  'cards-teaser': cardsTeaserParser,
  'quote-expert': quoteExpertParser,
  'columns-steps': columnsStepsParser,
};

// TRANSFORMER REGISTRY (cleanup before parse, sections after)
const transformers = [cleanupTransformer, sectionsTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: "car-insurance-landing",
  description: "Insurance product landing page: hero with quote CTAs, quick-links, feature cards ('why choose'), rich-text explainers, cover-comparison table, optional-extras teaser cards, related-product cards, quote-requirements accordions, expert quote, claims steps columns, useful-guides cards, FAQ accordions, and other-options link list.",
  urls: ["https://www.admiral.com/car-insurance"],
  blocks: [
      {
          "name": "section-quicklinks",
          "instances": [
              "#basic-18928"
          ],
          "section": "dark"
      },
      {
          "name": "section-do-i-need",
          "instances": [
              "#basic-18610"
          ],
          "section": "accent-light"
      },
      {
          "name": "section-quote-requirements",
          "instances": [
              "#basic-17125"
          ],
          "section": "accent-light"
      },
      {
          "name": "section-experts",
          "instances": [
              "#basic-18930"
          ],
          "section": "dark"
      },
      {
          "name": "hero-promo",
          "instances": [
              ".hero-banner"
          ]
      },
      {
          "name": "embed-review",
          "instances": [
              ".trustpilot-widget"
          ]
      },
      {
          "name": "cards-feature",
          "instances": [
              "#basic-18609 .grid"
          ]
      },
      {
          "name": "accordion-faq",
          "instances": [
              ".faqs"
          ]
      },
      {
          "name": "tabs-cover",
          "instances": [
              "#basic-15950"
          ]
      },
      {
          "name": "table-compare",
          "instances": [
              "#basic-15950 table.table"
          ]
      },
      {
          "name": "cards-teaser",
          "instances": [
              "#basic-17124 .product-pod-style",
              "#basic-14598 .grid",
              "#basic-18934 .grid"
          ]
      },
      {
          "name": "quote-expert",
          "instances": [
              ".quote-box"
          ]
      },
      {
          "name": "columns-steps",
          "instances": [
              "#basic-18933 .grid--badges"
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
