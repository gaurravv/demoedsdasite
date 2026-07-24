/* eslint-disable */
/* global WebImporter */

import cardsTeamParser from './parsers/cards-team.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'cards-team': cardsTeamParser,
  'accordion-faq': accordionFaqParser,
};

const PAGE_TEMPLATE = {
  "name": "content-page",
  "description": "Simple content page with title and rich text body (About Us, FAQs).",
  "urls": [
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/about-us.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/faqs.html"
  ],
  "blocks": [
    {
      "name": "cards-team",
      "instances": [
        "section.cmp-experience-fragment--contributor:has(.cmp-experiencefragment--stacey-roswells), section.cmp-experience-fragment--contributor:has(.cmp-experiencefragment--jake-hammer), section.cmp-experience-fragment--contributor:has(.cmp-experiencefragment--ian-provo), section.cmp-experience-fragment--contributor:has(.cmp-experiencefragment--jacob-wester)",
        "section.cmp-experience-fragment--contributor:has(.cmp-experiencefragment--sofia-sjoeberg), section.cmp-experience-fragment--contributor:has(.cmp-experiencefragment--justin-barr), section.cmp-experience-fragment--contributor:has(.cmp-experiencefragment--kumar-selveraj)"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        ".accordion.panelcontainer .cmp-accordion"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1-page-title",
      "name": "About Us Page Title",
      "selector": ".title:has(#title-9b21773b1d)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".title:has(#title-9b21773b1d)"
      ]
    },
    {
      "id": "section-2-our-contributors",
      "name": "Our Contributors",
      "selector": ".cmp-title--underline:has(#title-f9f617a322)",
      "style": null,
      "blocks": [
        "cards-team"
      ],
      "defaultContent": [
        ".cmp-title--underline:has(#title-f9f617a322)",
        ".text:has(#text-e5578214d4)"
      ]
    },
    {
      "id": "section-3-wknd-guides",
      "name": "WKND Guides",
      "selector": ".cmp-title--underline:has(#title-439468b079)",
      "style": null,
      "blocks": [
        "cards-team"
      ],
      "defaultContent": [
        ".cmp-title--underline:has(#title-439468b079)",
        ".text:has(#text-7e8f28d193)"
      ]
    },
    {
      "id": "section-4-faqs-accordion",
      "name": "FAQs Accordion (coverage gap)",
      "selector": [
        ".accordion.panelcontainer .cmp-accordion",
        ".accordion.panelcontainer"
      ],
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
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
