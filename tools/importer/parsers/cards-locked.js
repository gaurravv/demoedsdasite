/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-locked. Base: cards.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/magazine.html
 * Structure: 2 columns. First row = block name. Each subsequent row is a card:
 * [image | text content (title, description, Read More CTA)].
 * The instances selector matches each individual `.teaser.cmp-teaser--secure`; this
 * parser aggregates all sibling secure teasers into a single cards block and replaces
 * only the first (removing the rest) so the block renders once.
 */
export default function parse(element, { document }) {
  // Collect all sibling secure teaser cards so they aggregate into one block.
  let cardEls = [];
  const parent = element.parentElement;
  if (parent) {
    cardEls = Array.from(parent.querySelectorAll(':scope > .teaser.cmp-teaser--secure, :scope > .cmp-teaser--secure'));
  }
  if (cardEls.length === 0) cardEls = [element];

  const cells = [];

  cardEls.forEach((card) => {
    const img = card.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
    const title = card.querySelector('.cmp-teaser__title, h2, h3, [class*="title"]');
    const description = card.querySelector('.cmp-teaser__description, [class*="description"], p');
    const actionEl = card.querySelector('.cmp-teaser__action-container, [class*="action"]');

    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    // "Read More" CTA — preserve as a link if present, else as its text/element.
    if (actionEl) {
      const actionLink = actionEl.querySelector('a');
      textCell.push(actionLink || actionEl);
    }

    cells.push([img || '', textCell.length ? textCell : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-locked', cells });
  element.replaceWith(block);

  // Remove the other aggregated cards so the block is not duplicated.
  cardEls.forEach((card) => {
    if (card !== element && card.parentElement) card.remove();
  });
}
