/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-adventures-listing.js
  var import_adventures_listing_exports = {};
  __export(import_adventures_listing_exports, {
    default: () => import_adventures_listing_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = element.querySelector('.cmp-teaser__description, [class*="description"], p');
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a.cmp-button");
    if (!heading && !description && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (img) cells.push([img]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-image-list__item, li"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, .cmp-image__image, img");
      const titleLink = item.querySelector('.cmp-image-list__item-title-link, a[class*="title-link"]');
      const titleText = item.querySelector('.cmp-image-list__item-title, [class*="item-title"]');
      const description = item.querySelector('.cmp-image-list__item-description, [class*="description"]');
      const textCell = [];
      if (titleLink) {
        textCell.push(titleLink);
      } else if (titleText) {
        textCell.push(titleText);
      }
      if (description) textCell.push(description);
      cells.push([img || "", textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Site header experience fragment (nav + language nav + search)
        "header.cmp-experiencefragment--header",
        ".cmp-experiencefragment--header",
        "header",
        // Site footer experience fragment
        "footer.cmp-experiencefragment--footer",
        ".cmp-experiencefragment--footer",
        "footer",
        // Standalone navigation / language navigator / search (if surfaced outside header on any template)
        ".cmp-navigation--header",
        "nav.cmp-navigation",
        ".cmp-languagenavigation--header",
        "nav.cmp-languagenavigation",
        ".search.cmp-search--header",
        "section.cmp-search",
        // Breadcrumb chrome (Adobe Core Components)
        ".breadcrumb",
        ".cmp-breadcrumb",
        "nav.cmp-breadcrumb",
        // Share / social sidebar widget
        ".sharing",
        ".cmp-sharing"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        "style"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function findSectionStart(scope, selector) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      if (!sel) continue;
      let el = null;
      try {
        el = scope.querySelector(sel);
      } catch (e) {
        el = null;
      }
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const start = findSectionStart(element, section.selector);
      if (!start) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        start.parentElement.insertBefore(metaBlock, start.nextSibling);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        start.parentElement.insertBefore(hr, start);
      }
    }
  }

  // tools/importer/import-adventures-listing.js
  var parsers = {
    "hero-intro": parse,
    "cards-teaser": parse2
  };
  var PAGE_TEMPLATE = {
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
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: section ? section.id : null
          });
        });
      });
    });
    return found;
  }
  var import_adventures_listing_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_adventures_listing_exports);
})();
