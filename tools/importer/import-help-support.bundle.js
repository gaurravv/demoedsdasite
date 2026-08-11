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

  // tools/importer/import-help-support.js
  var import_help_support_exports = {};
  __export(import_help_support_exports, {
    default: () => import_help_support_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".hero-banner__image img") || element.querySelector(":scope > img") || element.querySelector("img");
    const headings = Array.from(element.querySelectorAll("h1, h2, h3"));
    const paragraphs = Array.from(element.querySelectorAll("p")).filter((p) => !p.closest(".buttons, .buttons__flex, .app-icons"));
    let ctaLinks = Array.from(element.querySelectorAll(".buttons a, .buttons__flex a"));
    if (ctaLinks.length === 0) {
      ctaLinks = Array.from(element.querySelectorAll("a.button"));
    }
    if (headings.length === 0 && paragraphs.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    headings.forEach((h) => contentCell.push(h));
    paragraphs.forEach((p) => contentCell.push(p));
    ctaLinks.forEach((a) => contentCell.push(a));
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-support.js
  function parse2(element, { document }) {
    let items = Array.from(element.querySelectorAll(":scope > .grid__cell .pod, :scope .grid__cell .pod, :scope > .pod"));
    if (items.length === 0) {
      items = element.matches(".pod") ? [element] : Array.from(element.querySelectorAll(".pod"));
    }
    items = items.filter((el, i) => items.indexOf(el) === i);
    const cells = [];
    items.forEach((item) => {
      const heading = item.querySelector("h2, h3, h4");
      const paragraphs = Array.from(item.querySelectorAll("p"));
      const moreLink = item.querySelector("a.more-link, .more-link, a");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      paragraphs.forEach((p) => contentCell.push(p));
      if (moreLink) contentCell.push(moreLink);
      if (contentCell.length === 0) return;
      cells.push([contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-support", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/admiral-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  var DUPLICATE_CONTENT_SELECTORS = [
    ".slick-cloned",
    ".slide-in-content"
  ];
  var SITE_CHROME_SELECTORS = [
    // Cookie consent (TrustArc): icon, banner, and its iframe live under these ids
    "#teconsent",
    "#consent-banner",
    // Emergency messaging bar
    "#block-emergencymessaging",
    // Site header / mega-nav
    "header.main",
    // Breadcrumbs (container + inner list)
    "#block-admiral-annie-breadcrumbs",
    ".breadcrumbs",
    // Footer
    "footer",
    // Genesys chat widgets (contain their own iframes)
    "#genesys-thirdparty",
    "#genesys-messenger",
    // Empty hidden spacer div that sits between breadcrumbs and content root
    ".hidden"
  ];
  var LEFTOVER_SELECTORS = [
    "script",
    "style",
    "noscript",
    "link"
  ];
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const contentRoot = element.querySelector("#block-admiral-annie-content");
      if (contentRoot) {
        element.replaceChildren(contentRoot);
      }
      WebImporter.DOMUtils.remove(element, SITE_CHROME_SELECTORS);
      WebImporter.DOMUtils.remove(element, DUPLICATE_CONTENT_SELECTORS);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, SITE_CHROME_SELECTORS);
      WebImporter.DOMUtils.remove(element, LEFTOVER_SELECTORS);
    }
  }

  // tools/importer/transformers/admiral-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  var CONTENT_ROOT_SELECTOR = "#block-admiral-annie-content";
  function resolveSectionAnchor(el, contentRoot) {
    if (!contentRoot) return el;
    let anchor = el;
    while (anchor.parentElement && anchor.parentElement !== contentRoot && anchor.parentElement.parentElement !== contentRoot) {
      anchor = anchor.parentElement;
    }
    return anchor;
  }
  function isHr(node) {
    return node && node.nodeType === 1 && node.tagName === "HR";
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    if (!template || !Array.isArray(template.blocks)) return;
    const doc = payload && payload.document || element.ownerDocument;
    const contentRoot = element.querySelector(CONTENT_ROOT_SELECTOR);
    const seen = /* @__PURE__ */ new Set();
    const targets = [];
    template.blocks.filter((block) => block && block.section && Array.isArray(block.instances)).forEach((block) => {
      block.instances.forEach((selector) => {
        element.querySelectorAll(selector).forEach((el) => {
          const anchor = resolveSectionAnchor(el, contentRoot);
          if (anchor && !seen.has(anchor)) {
            seen.add(anchor);
            targets.push({ anchor, style: block.section });
          }
        });
      });
    });
    if (targets.length === 0) return;
    targets.sort((a, b) => {
      const pos = a.anchor.compareDocumentPosition(b.anchor);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
    for (let i = targets.length - 1; i >= 0; i -= 1) {
      const { anchor, style } = targets[i];
      const parent = anchor.parentElement;
      if (!parent) continue;
      const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
        name: "Section Metadata",
        cells: { Style: style }
      });
      anchor.after(sectionMetadata);
      if (!isHr(sectionMetadata.nextElementSibling)) {
        sectionMetadata.after(doc.createElement("hr"));
      }
      if (anchor.previousElementSibling && !isHr(anchor.previousElementSibling)) {
        parent.insertBefore(doc.createElement("hr"), anchor);
      }
    }
  }

  // tools/importer/import-help-support.js
  var parsers = {
    "hero-promo": parse,
    "cards-support": parse2
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    name: "help-support",
    description: "Support/informational page: hero intro, rich-text guidance with H2/H3 sub-headings and external resource links, contact-us card list, and 'more support' teaser cards grid.",
    urls: ["https://www.admiral.com/help-support-hub/money-worries/money-management"],
    blocks: [
      {
        "name": "section-more-support",
        "instances": [
          "#basic-18374 .bg-fino"
        ],
        "section": "accent"
      },
      {
        "name": "hero-promo",
        "instances": [
          ".hero-banner"
        ]
      },
      {
        "name": "cards-support",
        "instances": [
          "#basic-18374 .grid"
        ]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_help_support_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
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
  return __toCommonJS(import_help_support_exports);
})();
