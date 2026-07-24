/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import heroPromoParser from './parsers/hero-promo.js';
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-teaser': cardsTeaserParser,
  'hero-promo': heroPromoParser,
};

const PAGE_TEMPLATE = {
  "name": "home",
  "description": "Homepage with hero carousel, featured article teaser, article list, promo banner, and adventure list.",
  "urls": [
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en.html"
  ],
  "blocks": [
    {
      "name": "carousel-hero",
      "instances": [
        ".carousel.cmp-carousel--hero"
      ]
    },
    {
      "name": "cards-teaser",
      "instances": [
        ".cmp-layout-container--fixed:has(#title-c2d2b28d00) .image-list .cmp-image-list",
        ".cmp-layout-container--fixed:has(#title-ca6ac0fe65) .image-list .cmp-image-list"
      ]
    },
    {
      "name": "hero-promo",
      "instances": [
        ".cmp-teaser--hero.cmp-teaser--imagebottom"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1-hero-carousel",
      "name": "Hero Carousel",
      "selector": ".carousel.cmp-carousel--hero",
      "style": null,
      "blocks": [
        "carousel-hero"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2-recent-articles",
      "name": "Recent Articles",
      "selector": ".cmp-layout-container--fixed:has(#title-c2d2b28d00)",
      "style": null,
      "blocks": [
        "cards-teaser"
      ],
      "defaultContent": [
        ".cmp-title--underline:has(#title-c2d2b28d00)",
        ".button.cmp-button--primary:has(#button-2e6d32893a)"
      ]
    },
    {
      "id": "section-3-next-adventures-heading",
      "name": "Next Adventures heading",
      "selector": ".cmp-title--underline:has(#title-971080d74b)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".cmp-title--underline:has(#title-971080d74b)"
      ]
    },
    {
      "id": "section-4-climbing-new-zealand-promo",
      "name": "Climbing New Zealand Promo Teaser",
      "selector": ".cmp-teaser--hero.cmp-teaser--imagebottom",
      "style": null,
      "blocks": [
        "hero-promo"
      ],
      "defaultContent": []
    },
    {
      "id": "section-5-adventures-list",
      "name": "Where do you want to go? (Adventures list)",
      "selector": ".cmp-layout-container--fixed:has(#title-ca6ac0fe65)",
      "style": null,
      "blocks": [
        "cards-teaser"
      ],
      "defaultContent": [
        "#title-ca6ac0fe65",
        ".button.cmp-button--primary:has(#button-b6562c963d)"
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
