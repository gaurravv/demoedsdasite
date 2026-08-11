/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base: cards.
 * Source: admiral.com product grid (.product-grid) — home (12 items).
 * Each card is an <a.product-grid__item> wrapping an icon (SVG img) + a product label span.
 * The whole card links to the product page.
 * Library convention: Cards = 2 columns (image | text), one row per card.
 *   Cell 1: product icon image.
 *   Cell 2: product label as a link (whole-card link preserved on the label).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > a.product-grid__item, a.product-grid__item'));

  const cells = [];
  items.forEach((item) => {
    const href = item.getAttribute('href');
    const icon = item.querySelector('.product-grid__icon img, img');
    const labelEl = item.querySelector('.product-grid__text');
    const labelText = labelEl ? labelEl.textContent.trim() : item.textContent.trim();

    // Build a link that wraps the product label so the whole card is clickable.
    const link = document.createElement('a');
    if (href) link.setAttribute('href', href);
    link.textContent = labelText;

    const imageCell = icon || '';
    cells.push([imageCell, link]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
