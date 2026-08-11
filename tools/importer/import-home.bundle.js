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

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > a.product-grid__item, a.product-grid__item"));
    const cells = [];
    items.forEach((item) => {
      const href = item.getAttribute("href");
      const icon = item.querySelector(".product-grid__icon img, img");
      const labelEl = item.querySelector(".product-grid__text");
      const labelText = labelEl ? labelEl.textContent.trim() : item.textContent.trim();
      const link = document.createElement("a");
      if (href) link.setAttribute("href", href);
      link.textContent = labelText;
      const imageCell = icon || "";
      cells.push([imageCell, link]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  var VIMEO_URL = "https://player.vimeo.com/video/1113186489";
  function parse3(element, { document }) {
    const iframe = element.querySelector("iframe");
    let src = iframe && iframe.getAttribute("src");
    if (!src || src.trim() === "") src = VIMEO_URL;
    const link = document.createElement("a");
    link.setAttribute("href", src);
    link.textContent = src;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-callout.js
  function parse4(element, { document }) {
    const image = element.querySelector(".image img, .hero-banner__image img") || element.querySelector(":scope > img") || element.querySelector("img");
    const copy = element.querySelector(".copy, .hero-banner__copy, .hero-background") || element;
    const headings = Array.from(copy.querySelectorAll("h1, h2, h3"));
    const paragraphs = Array.from(copy.querySelectorAll("p")).filter((p) => !p.closest(".buttons, .buttons__flex, .app-icons"));
    const ctaLinks = Array.from(
      copy.querySelectorAll("a.button, .buttons a, .buttons__flex a, .app-icons a")
    );
    if (headings.length === 0 && paragraphs.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    headings.forEach((h) => contentCell.push(h));
    paragraphs.forEach((p) => contentCell.push(p));
    ctaLinks.forEach((a) => contentCell.push(a));
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-callout", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse5(element, { document }) {
    let items = Array.from(
      element.querySelectorAll(
        ":scope > .grid__cell .pod, :scope .grid__cell .pod, :scope > a.sub-hero-banner, :scope a.sub-hero-banner.product-pod-style, :scope > a.pod--magazine, :scope a.pod--magazine"
      )
    );
    if (items.length === 0) {
      if (element.matches("a.sub-hero-banner, .pod, a.pod--magazine")) {
        items = [element];
      } else {
        items = Array.from(element.querySelectorAll(".pod, a.sub-hero-banner, a.pod--magazine"));
      }
    }
    items = items.filter((el, i) => items.indexOf(el) === i);
    const cells = [];
    items.forEach((item) => {
      const cardHref = item.tagName === "A" ? item.getAttribute("href") : null;
      const image = item.querySelector(".image img, img");
      const textScope = item.querySelector(".copy") || item;
      const heading = textScope.querySelector("h2, h3, h4");
      const time = textScope.querySelector("time");
      const paragraphs = Array.from(textScope.querySelectorAll("p")).filter((p) => !p.querySelector("time"));
      const moreLink = item.querySelector("a.more-link, .more-link");
      const contentCell = [];
      if (heading) {
        if (cardHref) {
          const link = document.createElement("a");
          link.setAttribute("href", cardHref);
          const h = document.createElement((heading.tagName || "h3").toLowerCase());
          link.textContent = heading.textContent.trim();
          h.append(link);
          contentCell.push(h);
        } else {
          contentCell.push(heading);
        }
      }
      if (time) {
        const p = document.createElement("p");
        p.textContent = time.textContent.trim();
        contentCell.push(p);
      }
      paragraphs.forEach((p) => contentCell.push(p));
      if (moreLink && !cardHref) contentCell.push(moreLink);
      if (!image && contentCell.length === 0) return;
      cells.push([image || "", contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-award.js
  function parse6(element, { document }) {
    const image = element.querySelector(".image img") || element.querySelector(":scope img") || element.querySelector("img");
    const textWrap = element.querySelector(".text") || element;
    const headings = Array.from(textWrap.querySelectorAll("h1, h2, h3"));
    const paragraphs = Array.from(textWrap.querySelectorAll("p"));
    if (headings.length === 0 && paragraphs.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    headings.forEach((h) => contentCell.push(h));
    paragraphs.forEach((p) => contentCell.push(p));
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-award", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-quote.js
  function parse7(element, { document }) {
    let slides = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned)"));
    if (slides.length === 0) {
      slides = Array.from(element.querySelectorAll(".testimonial"));
    }
    const seenQuotes = /* @__PURE__ */ new Set();
    slides = slides.filter((slide) => {
      const t = slide.querySelector(".testimonial") || slide;
      const key = (t.querySelector(".callout") || t).textContent.trim();
      if (seenQuotes.has(key)) return false;
      seenQuotes.add(key);
      return true;
    });
    const cells = [];
    slides.forEach((slide) => {
      const testimonial = slide.querySelector(".testimonial") || slide;
      const image = testimonial.querySelector(".image img, img");
      const quote = testimonial.querySelector(".callout");
      const author = testimonial.querySelector(".testimonial__author");
      const location = testimonial.querySelector(".testimonial__location");
      const contentCell = [];
      if (quote) contentCell.push(quote);
      if (author) contentCell.push(author);
      if (location) contentCell.push(location);
      if (!image && contentCell.length === 0) return;
      cells.push([image || "", contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-quote", cells });
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

  // tools/importer/import-home.js
  var parsers = {
    "hero-promo": parse,
    "cards-product": parse2,
    "embed-video": parse3,
    "hero-callout": parse4,
    "cards-teaser": parse5,
    "hero-award": parse6,
    "carousel-quote": parse7
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Admiral homepage",
    urls: ["https://www.admiral.com/"],
    blocks: [
      { name: "hero-promo", instances: [".hero-banner"] },
      { name: "cards-product", instances: [".product-grid"] },
      { name: "embed-video", instances: ["#schema-videoobject"] },
      { name: "hero-callout", instances: [".sub-hero-banner--person-infront-house", ".sub-hero-banner--admiral-app"] },
      { name: "cards-teaser", instances: ["#product-pods-5856 .grid"] },
      { name: "hero-award", instances: [".custom-banner.dark-blue"] },
      { name: "carousel-quote", instances: [".testimonials-slider"] }
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
  var import_home_default = {
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
  return __toCommonJS(import_home_exports);
})();
