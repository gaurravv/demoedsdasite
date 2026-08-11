/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Admiral site-wide cleanup.
 *
 * Scope: removes all non-authorable site chrome so the import contains only
 * the page-level content authors would create/edit. Every selector below was
 * verified against the captured DOM in migration-work/cleaned.html and
 * migration-work/pages/<template>/cleaned.html (home, car-insurance-landing,
 * magazine-article, resources-hub, help-support).
 *
 * Key DOM facts driving this transformer:
 *  - The authorable content lives inside #block-admiral-annie-content.
 *  - That content root is nested inside div.dialog-off-canvas-main-canvas,
 *    which ALSO wraps the header, breadcrumbs and footer. So we must NOT
 *    remove the off-canvas wrapper itself (it is the parent of the content) —
 *    instead we lift the content root out of the wrapper and drop the wrapper.
 *  - The cookie chrome (#teconsent, #consent-banner incl. the TrustArc iframe)
 *    and the Genesys chat widgets (#genesys-thirdparty, #genesys-messenger,
 *    which carry iframes) are body-level siblings, OUTSIDE the content root.
 *  - #schema-videoobject (the embed-video block target on home) CONTAINS an
 *    <iframe>. We therefore never blanket-remove <iframe>; the only unwanted
 *    iframes live inside the Genesys / consent containers we remove by id.
 *  - Duplicate/non-authorable content INSIDE the content root: slick carousel
 *    clones (.slick-cloned, home ×4) and mobile off-canvas slide-in panels
 *    (.slide-in-content, help-support ×5 / car-insurance ×1).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

// Non-authorable content that sits INSIDE #block-admiral-annie-content and
// would otherwise confuse block parsing / duplicate content. Removed before
// block parsing so parsers only see the real, single copy of each component.
// Verified in captured DOM:
//   .slick-cloned         -> slick-carousel cloned/duplicate slides (home)
//   .slide-in-content     -> hidden mobile off-canvas slide-in duplicate panels
//                            (help-support contact drawers, car-insurance)
const DUPLICATE_CONTENT_SELECTORS = [
  '.slick-cloned',
  '.slide-in-content',
];

// Site chrome / non-authorable elements. These are body-level or off-canvas
// siblings of the content root, or breadcrumbs/header/footer within the
// off-canvas wrapper. All verified present in captured DOM.
const SITE_CHROME_SELECTORS = [
  // Cookie consent (TrustArc): icon, banner, and its iframe live under these ids
  '#teconsent',
  '#consent-banner',
  // Emergency messaging bar
  '#block-emergencymessaging',
  // Site header / mega-nav
  'header.main',
  // Breadcrumbs (container + inner list)
  '#block-admiral-annie-breadcrumbs',
  '.breadcrumbs',
  // Footer
  'footer',
  // Genesys chat widgets (contain their own iframes)
  '#genesys-thirdparty',
  '#genesys-messenger',
  // Empty hidden spacer div that sits between breadcrumbs and content root
  '.hidden',
];

// Safe leftover elements to strip site-wide. Deliberately excludes <iframe>
// because #schema-videoobject (embed-video block) contains a legitimate one;
// the only unwanted iframes are inside the Genesys/consent containers removed
// above. Scripts/styles are removed defensively for the live-DOM run.
const LEFTOVER_SELECTORS = [
  'script',
  'style',
  'noscript',
  'link',
];

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Scope the import to the content root: if #block-admiral-annie-content
    // exists, lift it to be the sole child of `element` so everything outside
    // it (header, breadcrumbs, footer, cookie/genesys siblings, off-canvas
    // wrapper) is dropped in one step. This is done before block parsing so
    // parsers only ever search within the authorable content.
    const contentRoot = element.querySelector('#block-admiral-annie-content');
    if (contentRoot) {
      element.replaceChildren(contentRoot);
    }

    // Remove any remaining site chrome (also handles the case where the
    // content root was not found and we fall back to selector-based removal).
    WebImporter.DOMUtils.remove(element, SITE_CHROME_SELECTORS);

    // Remove duplicate/non-authorable content inside the content root so it
    // does not interfere with block matching.
    WebImporter.DOMUtils.remove(element, DUPLICATE_CONTENT_SELECTORS);
  }

  if (hookName === TransformHook.afterTransform) {
    // Final safety net: re-run chrome removal in case any of it survived
    // block parsing, then strip leftover non-authorable elements.
    WebImporter.DOMUtils.remove(element, SITE_CHROME_SELECTORS);
    WebImporter.DOMUtils.remove(element, LEFTOVER_SELECTORS);
  }
}
