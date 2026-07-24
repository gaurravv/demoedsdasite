/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-teaser. Base: cards.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures.html
 * Structure: 2 columns. First row = block name. Each subsequent row is a card:
 * [image | title (linked heading), description].
 * The instances selector matches the `.cmp-image-list` (a <ul>); each `<li>` item is a card.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-image-list__item, li'));
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image-list__item-image img, .cmp-image__image, img');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link, a[class*="title-link"]');
    const titleText = item.querySelector('.cmp-image-list__item-title, [class*="item-title"]');
    const description = item.querySelector('.cmp-image-list__item-description, [class*="description"]');

    const textCell = [];
    // Preserve the title as a link when available; heading style comes from cards CSS.
    if (titleLink) {
      // Keep the link but ensure it wraps the title text.
      textCell.push(titleLink);
    } else if (titleText) {
      textCell.push(titleText);
    }
    if (description) textCell.push(description);

    cells.push([img || '', textCell.length ? textCell : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
