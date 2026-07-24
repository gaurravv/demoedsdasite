/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section boundaries.
 *
 * Inserts an EDS section break (<hr>) before each section (except the first)
 * defined for the current template in page-templates.json, and — when a
 * section declares a `style` — appends a Section Metadata block for it.
 *
 * Driven entirely by payload.template.sections (source: page-templates.json),
 * so it is template-agnostic. Section selectors may be a single string or an
 * array of strings; the first matching element locates the start of a section.
 *
 * All WKND templates currently declare `style: null` on every section, so no
 * Section Metadata blocks are emitted for them; the logic is retained so that
 * styled sections added later are handled automatically.
 *
 * Runs in afterTransform only (block parsing must complete first).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

/**
 * Resolve the first DOM element that starts a section, given its selector
 * (string or array of strings). Returns null when nothing matches.
 */
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

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Process in reverse so inserted <hr>/metadata don't shift earlier lookups.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const start = findSectionStart(element, section.selector);
    if (!start) continue;

    // Section Metadata block for sections that declare a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      // Place metadata at the end of the section (before the next boundary).
      start.parentElement.insertBefore(metaBlock, start.nextSibling);
    }

    // Insert a section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      start.parentElement.insertBefore(hr, start);
    }
  }
}
