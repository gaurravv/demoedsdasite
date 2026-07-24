/* eslint-disable */
/* global WebImporter */

import heroIntroParser from './parsers/hero-intro.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'hero-intro': heroIntroParser,
  'cards-teaser': cardsTeaserParser,
};

const PAGE_TEMPLATE = {
  "name": "adventures-listing",
  "description": "Adventures landing page with intro, filterable tabbed category list, and adventure card grid.",
  "urls": [
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures.html"
  ],
  "blocks": [
    {
      "name": "hero-intro",
      "instances": [
        ".teaser.cmp-teaser--hero"
      ]
    },
    {
      "name": "cards-teaser",
      "instances": [
        "#tabs-b4210c6ff3-item-4b59a3dfcf-tabpanel .image-list .cmp-image-list"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1-page-title",
      "name": "Page Title",
      "selector": ".cmp-layout-container--fixed:has(#title-e8e3276d1e)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".title:has(#title-e8e3276d1e)"
      ]
    },
    {
      "id": "section-2-intro-promo",
      "name": "Intro Promo",
      "selector": ".teaser.cmp-teaser--hero",
      "style": null,
      "blocks": [
        "hero-intro"
      ],
      "defaultContent": []
    },
    {
      "id": "section-3-current-adventures",
      "name": "Current Adventures",
      "selector": ".cmp-layout-container--fixed:has(#title-dffa0ffaf3)",
      "style": null,
      "blocks": [
        "cards-teaser"
      ],
      "defaultContent": [
        ".title.cmp-title--underline:has(#title-dffa0ffaf3)"
      ]
    }
  ]
};

const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [wkndSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformer) => {
    try {
      transformer(hookName, element, enhancedPayload);
    } catch (e) {
      console.warn(`Transformer failed on hook "${hookName}": ${e.message}`);
    }
  });
}

function findBlocksOnPage(document, template) {
  const found = [];
  (template.blocks || []).forEach((block) => {
    (block.instances || []).forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) {
        console.warn(`No elements found for block "${block.name}" with selector "${selector}"`);
        return;
      }
      const section = (template.sections || []).find((s) => (s.blocks || []).includes(block.name));
      elements.forEach((element) => {
        found.push({
          name: block.name,
          selector,
          element,
          section: section ? section.id : null,
        });
      });
    });
  });
  return found;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) {
        return;
      }
      try {
        parsers[block.name](block.element, { document, url, params });
      } catch (e) {
        console.warn(`Parser "${block.name}" failed: ${e.message}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

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
