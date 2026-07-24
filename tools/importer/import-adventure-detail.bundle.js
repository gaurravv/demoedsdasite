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

  // tools/importer/import-adventure-detail.js
  var import_adventure_detail_exports = {};
  __export(import_adventure_detail_exports, {
    default: () => import_adventure_detail_default
  });

  // tools/importer/parsers/carousel-gallery.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".image img, .cmp-image__image, img");
      if (!img) return;
      cells.push([img, ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-spec.js
  function parse2(element, { document }) {
    const elements = Array.from(element.querySelectorAll(".cmp-contentfragment__element"));
    const cells = [];
    elements.forEach((el) => {
      const labelEl = el.querySelector('.cmp-contentfragment__element-title, dt, [class*="element-title"]');
      const valueEl = el.querySelector('.cmp-contentfragment__element-value, dd, [class*="element-value"]');
      const label = labelEl ? labelEl.textContent.trim() : "";
      const value = valueEl ? valueEl.textContent.trim() : "";
      if (!label && !value) return;
      cells.push([label, value]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-spec", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-detail.js
  function parse3(element, { document }) {
    const labels = Array.from(element.querySelectorAll(".cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li"));
    const panels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    const cells = [];
    panels.forEach((panel, i) => {
      let labelEl = labels[i] || null;
      const panelId = panel.id ? panel.id.replace("-tabpanel", "") : null;
      if (panelId) {
        const matched = labels.find((l) => l.id && l.id.replace("-tab", "") === panelId);
        if (matched) labelEl = matched;
      }
      const label = labelEl ? labelEl.textContent.trim() : "";
      const contentEl = panel.querySelector(".cmp-contentfragment__elements, .contentfragment, .cmp-contentfragment") || panel;
      if (!label && !contentEl) return;
      cells.push([label, contentEl]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-detail", cells });
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

  // tools/importer/import-adventure-detail.js
  var parsers = {
    "carousel-gallery": parse,
    "columns-spec": parse2,
    "tabs-detail": parse3
  };
  var PAGE_TEMPLATE = {
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
  var import_adventure_detail_default = {
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
  return __toCommonJS(import_adventure_detail_exports);
})();
