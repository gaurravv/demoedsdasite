/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures.html
 * Structure: 1 column. Row 1 = block name. Row 2 = background image. Row 3 = content
 * (title, subheading; no CTA for this intro variant).
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
  const description = element.querySelector('.cmp-teaser__description, [class*="description"], p');
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.cmp-button');

  // Empty-block guard.
  if (!heading && !description && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: background image (1-column cell).
  if (img) cells.push([img]);

  // Row 3: content cell holding title, subheading, and optional CTA.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
