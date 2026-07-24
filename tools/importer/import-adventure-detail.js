/* eslint-disable */
/* global WebImporter */

import carouselGalleryParser from './parsers/carousel-gallery.js';
import columnsSpecParser from './parsers/columns-spec.js';
import tabsDetailParser from './parsers/tabs-detail.js';
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'carousel-gallery': carouselGalleryParser,
  'columns-spec': columnsSpecParser,
  'tabs-detail': tabsDetailParser,
};

const PAGE_TEMPLATE = {
  "name": "adventure-detail",
  "description": "Adventure detail page with title, hero image, activity metadata (price, duration, difficulty), description body, and image gallery.",
  "urls": [
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/climbing-new-zealand.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/bali-surf-camp.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/beervana-portland.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/colorado-rock-climbing.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/cycling-southern-utah.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/cycling-tuscany.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/downhill-skiing-wyoming.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/gastronomic-marais-tour.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/napa-wine-tasting.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/riverside-camping-australia.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/ski-touring-mont-blanc.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/surf-camp-costa-rica.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/tahoe-skiing.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/west-coast-cycling.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/whistler-mountain-biking.html",
    "https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/yosemite-backpacking.html"
  ],
  "blocks": [
    {
      "name": "carousel-gallery",
      "instances": [
        ".carousel.cmp-carousel--mini",
        ".carousel.panelcontainer.cmp-carousel--mini"
      ]
    },
    {
      "name": "columns-spec",
      "instances": [
        ".contentfragment.cmp-contentfragment--elements"
      ]
    },
    {
      "name": "tabs-detail",
      "instances": [
        ".tabs.panelcontainer"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1-hero-carousel",
      "name": "Hero Image Carousel",
      "selector": [
        ".carousel.cmp-carousel--mini",
        ".carousel.panelcontainer.cmp-carousel--mini"
      ],
      "style": null,
      "blocks": [
        "carousel-gallery"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2-title",
      "name": "Adventure Title",
      "selector": ".cmp-layout-container--fixed .title.cmp-title--underline:has(#title-f8517d742e)",
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".title.cmp-title--underline:has(#title-f8517d742e)"
      ]
    },
    {
      "id": "section-3-activity-spec-panel",
      "name": "Activity Spec Panel + Share",
      "selector": ".contentfragment.cmp-contentfragment--elements:has(#contentfragment-71006a1398)",
      "style": null,
      "blocks": [
        "columns-spec"
      ],
      "defaultContent": [
        ".title:has(#title-d7d1b86df7)",
        ".sharing"
      ]
    },
    {
      "id": "section-4-tabbed-body",
      "name": "Tabbed Description Body",
      "selector": ".tabs.panelcontainer:has(#tabs-3e2a3c8c36)",
      "style": null,
      "blocks": [
        "tabs-detail"
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
