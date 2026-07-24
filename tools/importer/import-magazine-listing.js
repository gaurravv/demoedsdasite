/* eslint-disable */
/* global WebImporter */

import heroPromoParser from './parsers/hero-promo.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import cardsLockedParser from './parsers/cards-locked.js';
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'hero-promo': heroPromoParser,
  'cards-teaser': cardsTeaserParser,
  'cards-locked': cardsLockedParser,
};

const PAGE_TEMPLATE = {
  "name": "magazine-listing",
  "description": "Magazine landing page with featured article, article card list, and members-only teasers.",
  "urls": [
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/magazine.html"
  ],
  "blocks": [
    {
      "name": "hero-promo",
      "instances": [
        "main .teaser.cmp-teaser--featured"
      ]
    },
    {
      "name": "cards-teaser",
      "instances": [
        "main .image-list.list .cmp-image-list"
      ]
    },
    {
      "name": "cards-locked",
      "instances": [
        "main .teaser.cmp-teaser--secure"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1-title-featured",
      "name": "Page Title + Featured Article",
      "selector": [
        "main .title:has(#title-e83f9afeef)",
        "main .teaser.cmp-teaser--featured"
      ],
      "style": null,
      "blocks": [
        "hero-promo"
      ],
      "defaultContent": [
        "main .title:has(#title-e83f9afeef)"
      ]
    },
    {
      "id": "section-2-all-articles",
      "name": "All Articles",
      "selector": [
        "main .title:has(#title-0f80375ce9)",
        "main .image-list.list"
      ],
      "style": null,
      "blocks": [
        "cards-teaser"
      ],
      "defaultContent": [
        "main .title.cmp-title--underline:has(#title-0f80375ce9)"
      ]
    },
    {
      "id": "section-3-members-only",
      "name": "Members Only",
      "selector": [
        "main .title:has(#title-59d441f861)",
        "main .text:has(#text-bb7bdee5e8)",
        "main .teaser.cmp-teaser--secure"
      ],
      "style": null,
      "blocks": [
        "cards-locked"
      ],
      "defaultContent": [
        "main .title.cmp-title--underline:has(#title-59d441f861)",
        "main .text:has(#text-bb7bdee5e8)"
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
