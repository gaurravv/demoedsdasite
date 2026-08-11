/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards (no-images variant).
 * Source: admiral.com "why choose us" stat tiles (#basic-18609 .grid) — car-insurance.
 * Each tile is .grid__cell > .pod.pod--product with an H3 stat + a paragraph. No image, no link.
 * Library convention: Cards (no images) = 1 column, one row per card;
 *   the single cell holds heading + description.
 */
export default function parse(element, { document }) {
  // One card per .pod inside the grid cells.
  let items = Array.from(element.querySelectorAll(':scope > .grid__cell .pod, :scope .grid__cell .pod, :scope > .pod'));
  if (items.length === 0) {
    items = element.matches('.pod') ? [element] : Array.from(element.querySelectorAll('.pod'));
  }
  items = items.filter((el, i) => items.indexOf(el) === i);

  const cells = [];
  items.forEach((item) => {
    const heading = item.querySelector('h2, h3, h4');
    const paragraphs = Array.from(item.querySelectorAll('p'));

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
