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

  // tools/importer/import-magazine-listing.js
  var import_magazine_listing_exports = {};
  __export(import_magazine_listing_exports, {
    default: () => import_magazine_listing_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
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

  // tools/importer/parsers/cards-locked.js
  function parse3(element, { document }) {
    let cardEls = [];
    const parent = element.parentElement;
    if (parent) {
      cardEls = Array.from(parent.querySelectorAll(":scope > .teaser.cmp-teaser--secure, :scope > .cmp-teaser--secure"));
    }
    if (cardEls.length === 0) cardEls = [element];
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
      const title = card.querySelector('.cmp-teaser__title, h2, h3, [class*="title"]');
      const description = card.querySelector('.cmp-teaser__description, [class*="description"], p');
      const actionEl = card.querySelector('.cmp-teaser__action-container, [class*="action"]');
      const textCell = [];
      if (title) textCell.push(title);
      if (description) textCell.push(description);
      if (actionEl) {
        const actionLink = actionEl.querySelector("a");
        textCell.push(actionLink || actionEl);
      }
      cells.push([img || "", textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-locked", cells });
    element.replaceWith(block);
    cardEls.forEach((card) => {
      if (card !== element && card.parentElement) card.remove();
    });
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

  // tools/importer/import-magazine-listing.js
  var parsers = {
    "hero-promo": parse,
    "cards-teaser": parse2,
    "cards-locked": parse3
  };
  var PAGE_TEMPLATE = {
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
  var import_magazine_listing_default = {
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
  return __toCommonJS(import_magazine_listing_exports);
})();
