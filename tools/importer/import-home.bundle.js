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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
      const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
      const description = slide.querySelector('.cmp-teaser__description, [class*="description"], p');
      const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.cmp-button, a[class*="action"]');
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      if (cta) textCell.push(cta);
      cells.push([img || "", textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
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

  // tools/importer/parsers/hero-promo.js
  function parse3(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const pretitle = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');
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
    if (pretitle) contentCell.push(pretitle);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
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

  // tools/importer/import-home.js
  var parsers = {
    "carousel-hero": parse,
    "cards-teaser": parse2,
    "hero-promo": parse3
  };
  var PAGE_TEMPLATE = {
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
  var import_home_default = {
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
  return __toCommonJS(import_home_exports);
})();
