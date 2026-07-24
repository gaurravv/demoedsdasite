/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. WKND is built on Adobe Core Components; header, footer,
 * navigation, language navigator and search are supplied by experience
 * fragments and are auto-populated on the EDS side (nav.js / footer.js), not
 * authored per page. The breadcrumb, share/social sidebar and "up next"
 * related-content widgets are likewise generated chrome.
 *
 * Selector sources (captured DOM / page-templates.json):
 *   - <header class="experiencefragment cmp-experiencefragment--header">   cleaned.html:5
 *       (contains cmp-navigation, cmp-languagenavigation and cmp-search — all removed with the header)
 *   - <footer class="experiencefragment cmp-experiencefragment--footer">   cleaned.html:572
 *   - .sharing  — adventure-detail section-3 defaultContent in page-templates.json
 *                 ("Activity Spec Panel + Share")
 *   - .cmp-breadcrumb / .breadcrumb — Adobe Core Components breadcrumb chrome
 *   - .cmp-tabs / related "up next" teasers are page content and are NOT removed here.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. The <header> XF wraps navigation,
    // language navigator and search, so removing it clears all of those.
    WebImporter.DOMUtils.remove(element, [
      // Site header experience fragment (nav + language nav + search)
      'header.cmp-experiencefragment--header',
      '.cmp-experiencefragment--header',
      'header',
      // Site footer experience fragment
      'footer.cmp-experiencefragment--footer',
      '.cmp-experiencefragment--footer',
      'footer',
      // Standalone navigation / language navigator / search (if surfaced outside header on any template)
      '.cmp-navigation--header',
      'nav.cmp-navigation',
      '.cmp-languagenavigation--header',
      'nav.cmp-languagenavigation',
      '.search.cmp-search--header',
      'section.cmp-search',
      // Breadcrumb chrome (Adobe Core Components)
      '.breadcrumb',
      '.cmp-breadcrumb',
      'nav.cmp-breadcrumb',
      // Share / social sidebar widget
      '.sharing',
      '.cmp-sharing',
    ]);

    // Strip leftover non-content elements safely.
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'style',
    ]);
  }
}
