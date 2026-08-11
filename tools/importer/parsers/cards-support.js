/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-support. Base: cards (no-images variant).
 * Source: admiral.com "more support" grid (#basic-18374 .grid) — help-support.
 * Each card is .grid__cell > .pod.pod--product with an H3 + description paragraph + a "more" link.
 * No image.
 * Library convention: Cards (no images) = 1 column, one row per card;
 *   the single cell holds heading + description + CTA link.
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll(':scope > .grid__cell .pod, :scope .grid__cell .pod, :scope > .pod'));
  if (items.length === 0) {
    items = element.matches('.pod') ? [element] : Array.from(element.querySelectorAll('.pod'));
  }
  items = items.filter((el, i) => items.indexOf(el) === i);

  const cells = [];
  items.forEach((item) => {
    const heading = item.querySelector('h2, h3, h4');
    const paragraphs = Array.from(item.querySelectorAll('p'));
    const moreLink = item.querySelector('a.more-link, .more-link, a');

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-support', cells });
  element.replaceWith(block);
}
