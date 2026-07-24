/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/faqs.html
 * Structure: 2 columns. First row = block name. Each subsequent row is an accordion
 * item: [title | content].
 * Note: appears on faqs.html (coverage gap); about-us.html has no accordion.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));
  const cells = [];

  items.forEach((item) => {
    // Title: prefer the dedicated title span, fall back to header/button text.
    const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__header, h3, h4, [class*="title"]');
    // Content: the expandable panel body. Prefer inner rich text, fall back to panel.
    const contentEl = item.querySelector('.cmp-accordion__panel .cmp-text, .cmp-accordion__panel .text, .cmp-accordion__panel, [class*="panel"]');

    if (!titleEl && !contentEl) return;

    const titleCell = titleEl ? titleEl.textContent.trim() : '';
    const contentCell = contentEl || '';
    cells.push([titleCell, contentCell]);
  });

  // Empty-block guard: nothing extracted.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
