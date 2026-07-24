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

  // tools/importer/import-content-page.js
  var import_content_page_exports = {};
  __export(import_content_page_exports, {
    default: () => import_content_page_default
  });

  // tools/importer/parsers/cards-team.js
  function parse(element, { document }) {
    const isContributor = (n) => n && n.nodeType === 1 && n.matches && n.matches("section.cmp-experience-fragment--contributor, section.experiencefragment.cmp-experience-fragment--contributor");
    let first = element;
    while (isContributor(first.previousElementSibling)) {
      first = first.previousElementSibling;
    }
    if (first !== element) {
      return;
    }
    const cardEls = [];
    let cur = first;
    while (isContributor(cur)) {
      cardEls.push(cur);
      cur = cur.nextElementSibling;
    }
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector(".image img, .cmp-image__image, img");
      const titles = Array.from(card.querySelectorAll(".cmp-title__text, .title .cmp-title h3, .title .cmp-title h5, h3, h5"));
      const name = titles.find((t) => t.tagName === "H3") || titles[0];
      const role = titles.find((t) => t.tagName === "H5") || (titles[1] && titles[1] !== name ? titles[1] : null);
      const socialLinks = Array.from(card.querySelectorAll(".cmp-buildingblock--btn-list a.cmp-button, .buildingblock a.cmp-button, a.cmp-button"));
      const textCell = [];
      if (name) textCell.push(name);
      if (role && role !== name) textCell.push(role);
      socialLinks.forEach((a) => textCell.push(a));
      cells.push([img || "", textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-team", cells });
    first.replaceWith(block);
    cardEls.forEach((card) => {
      if (card !== first && card.parentElement) card.remove();
    });
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-accordion__item"));
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__header, h3, h4, [class*="title"]');
      const contentEl = item.querySelector('.cmp-accordion__panel .cmp-text, .cmp-accordion__panel .text, .cmp-accordion__panel, [class*="panel"]');
      if (!titleEl && !contentEl) return;
      const titleCell = titleEl ? titleEl.textContent.trim() : "";
      const contentCell = contentEl || "";
      cells.push([titleCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
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

  // tools/importer/import-content-page.js
  var parsers = {
    "cards-team": parse,
    "accordion-faq": parse2
  };
  var PAGE_TEMPLATE = {
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
  var import_content_page_default = {
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
  return __toCommonJS(import_content_page_exports);
})();
