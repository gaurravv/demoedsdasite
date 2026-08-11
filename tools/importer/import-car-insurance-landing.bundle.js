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

  // tools/importer/import-car-insurance-landing.js
  var import_car_insurance_landing_exports = {};
  __export(import_car_insurance_landing_exports, {
    default: () => import_car_insurance_landing_default
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

  // tools/importer/parsers/embed-review.js
  var TRUSTPILOT_URL = "https://www.trustpilot.com/review/www.admiral.com";
  function parse2(element, { document }) {
    const existing = element.querySelector('a[href*="trustpilot.com"], a');
    let href = existing && existing.getAttribute("href");
    if (!href || href.trim() === "") href = TRUSTPILOT_URL;
    const link = document.createElement("a");
    link.setAttribute("href", href);
    link.textContent = href;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-review", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document }) {
    let items = Array.from(element.querySelectorAll(":scope > .grid__cell .pod, :scope .grid__cell .pod, :scope > .pod"));
    if (items.length === 0) {
      items = element.matches(".pod") ? [element] : Array.from(element.querySelectorAll(".pod"));
    }
    items = items.filter((el, i) => items.indexOf(el) === i);
    const cells = [];
    items.forEach((item) => {
      const heading = item.querySelector("h2, h3, h4");
      const paragraphs = Array.from(item.querySelectorAll("p"));
      const contentCell = [];
      if (heading) contentCell.push(heading);
      paragraphs.forEach((p) => contentCell.push(p));
      if (contentCell.length === 0) return;
      cells.push([contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse4(element, { document }) {
    let items = Array.from(element.querySelectorAll(":scope > .pod--faq, :scope .pod--faq, :scope > .pod"));
    if (items.length === 0) {
      items = element.matches(".pod--faq, .pod") ? [element] : Array.from(element.querySelectorAll(".pod"));
    }
    items = items.filter((el, i) => items.indexOf(el) === i);
    const cells = [];
    items.forEach((item) => {
      const question = item.querySelector(".js-toggle-content, h2, h3, h4");
      const answerWrap = item.querySelector(".hide");
      let answerContent = [];
      if (answerWrap) {
        const inner = answerWrap.querySelector(":scope > div") || answerWrap;
        answerContent = Array.from(inner.childNodes);
      } else {
        answerContent = Array.from(item.children).filter(
          (c) => c !== question && !c.classList.contains("hide-toggle")
        );
      }
      if (!question && answerContent.length === 0) return;
      const questionCell = question || "";
      const answerCell = answerContent.length ? answerContent : "";
      cells.push([questionCell, answerCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-cover.js
  function parse5(element, { document }) {
    const tabs = element.querySelector(".tabs") || element;
    const labels = Array.from(tabs.querySelectorAll(".tabs-nav .tabs-nav__btn, .tabs-nav__btn"));
    const panels = Array.from(tabs.querySelectorAll(".tab-content-wrap > .tab-content, .tab-content"));
    const introNodes = [];
    const tabsWrapper = tabs.closest(".wrapper");
    element.querySelectorAll(":scope > .wrapper").forEach((w) => {
      if (w === tabsWrapper || w.contains(tabs)) return;
      const container = w.querySelector(":scope > .container") || w;
      Array.from(container.querySelectorAll("h1, h2, h3, h4, p")).forEach((n) => introNodes.push(n));
    });
    const cells = [];
    const count = Math.max(labels.length, panels.length);
    for (let i = 0; i < count; i += 1) {
      const labelEl = labels[i];
      const panelEl = panels[i];
      let labelCell = "";
      if (labelEl) {
        const span = labelEl.querySelector("span");
        const p = document.createElement("p");
        p.textContent = (span ? span.textContent : labelEl.textContent).trim();
        labelCell = p;
      }
      let panelCell = "";
      if (panelEl) {
        panelEl.querySelectorAll("table tr").forEach((tr) => {
          if (tr.querySelectorAll("td, th").length === 0) tr.remove();
        });
        const inner = panelEl.querySelector(":scope > .container") || panelEl;
        const content = Array.from(inner.childNodes);
        panelCell = content.length ? content : panelEl;
      }
      if (i === 0 && introNodes.length) {
        panelCell = Array.isArray(panelCell) ? [...introNodes, ...panelCell] : [...introNodes, panelCell];
      }
      if (!labelCell && (!panelCell || Array.isArray(panelCell) && panelCell.length === 0)) continue;
      cells.push([labelCell, panelCell]);
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-cover", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-compare.js
  function parse6(element, { document }) {
    const rows = Array.from(element.querySelectorAll("tr")).filter((tr) => tr.querySelectorAll("td, th").length > 0);
    const cells = [];
    rows.forEach((tr) => {
      const rowCells = Array.from(tr.children).filter((c) => c.tagName === "TD" || c.tagName === "TH");
      const outRow = rowCells.map((cell) => {
        const tick = cell.querySelector(".badge--tick");
        const cross = cell.querySelector(".badge--cross");
        const image = cell.querySelector("img");
        if (tick) return "\u2713";
        if (cross) return "";
        if (image) {
          const alt = (image.getAttribute("alt") || "").trim();
          if (alt) {
            const p = document.createElement("p");
            p.textContent = alt;
            return p;
          }
          return image;
        }
        const content = Array.from(cell.childNodes);
        if (content.length === 0) return "";
        const elements = content.filter((n) => n.nodeType === 1);
        if (elements.length === 1 && content.length === 1) return elements[0];
        return content;
      });
      if (outRow.length) cells.push(outRow);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "table-compare", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse7(element, { document }) {
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

  // tools/importer/parsers/quote-expert.js
  function parse8(element, { document }) {
    const content = element.querySelector(".column.content, .content") || element;
    const attribution = content.querySelector("h2, h3, h4");
    const quotation = content.querySelector("p");
    if (!quotation && !attribution) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (quotation) {
      const q = document.createElement("p");
      q.innerHTML = quotation.innerHTML;
      cells.push([q]);
    }
    if (attribution) {
      const cite = document.createElement("p");
      const em = document.createElement("em");
      em.textContent = attribution.textContent.trim();
      cite.append(em);
      cells.push([cite]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "quote-expert", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-steps.js
  function parse9(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > .grid__cell, .grid__cell"));
    const rowCells = columns.map((col) => {
      const cellContent = [];
      const desktopBadge = col.querySelector('.badge--lrg img, [class*="desktop"] img');
      const badge = desktopBadge || col.querySelector(".badge img, img");
      if (badge) cellContent.push(badge);
      const heading = col.querySelector("h2, h3, h4");
      if (heading) cellContent.push(heading);
      Array.from(col.querySelectorAll("p")).forEach((p) => cellContent.push(p));
      return cellContent.length ? cellContent : "";
    }).filter((c) => c !== "" || columns.length === 0);
    if (rowCells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-steps", cells });
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

  // tools/importer/import-car-insurance-landing.js
  var parsers = {
    "hero-promo": parse,
    "embed-review": parse2,
    "cards-feature": parse3,
    "accordion-faq": parse4,
    "tabs-cover": parse5,
    "table-compare": parse6,
    "cards-teaser": parse7,
    "quote-expert": parse8,
    "columns-steps": parse9
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    name: "car-insurance-landing",
    description: "Insurance product landing page: hero with quote CTAs, quick-links, feature cards ('why choose'), rich-text explainers, cover-comparison table, optional-extras teaser cards, related-product cards, quote-requirements accordions, expert quote, claims steps columns, useful-guides cards, FAQ accordions, and other-options link list.",
    urls: ["https://www.admiral.com/car-insurance"],
    blocks: [
      {
        "name": "section-quicklinks",
        "instances": [
          "#basic-18928"
        ],
        "section": "dark"
      },
      {
        "name": "section-do-i-need",
        "instances": [
          "#basic-18610"
        ],
        "section": "accent-light"
      },
      {
        "name": "section-quote-requirements",
        "instances": [
          "#basic-17125"
        ],
        "section": "accent-light"
      },
      {
        "name": "section-experts",
        "instances": [
          "#basic-18930"
        ],
        "section": "dark"
      },
      {
        "name": "hero-promo",
        "instances": [
          ".hero-banner"
        ]
      },
      {
        "name": "embed-review",
        "instances": [
          ".trustpilot-widget"
        ]
      },
      {
        "name": "cards-feature",
        "instances": [
          "#basic-18609 .grid"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          ".faqs"
        ]
      },
      {
        "name": "tabs-cover",
        "instances": [
          "#basic-15950"
        ]
      },
      {
        "name": "table-compare",
        "instances": [
          "#basic-15950 table.table"
        ]
      },
      {
        "name": "cards-teaser",
        "instances": [
          "#basic-17124 .product-pod-style",
          "#basic-14598 .grid",
          "#basic-18934 .grid"
        ]
      },
      {
        "name": "quote-expert",
        "instances": [
          ".quote-box"
        ]
      },
      {
        "name": "columns-steps",
        "instances": [
          "#basic-18933 .grid--badges"
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
  var import_car_insurance_landing_default = {
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
  return __toCommonJS(import_car_insurance_landing_exports);
})();
