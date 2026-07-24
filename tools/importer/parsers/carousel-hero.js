/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en.html
 * Structure: 2 columns. First row = block name. Each subsequent row is a slide:
 * [image | heading, description, CTA link].
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = slide.querySelector('.cmp-teaser__description, [class*="description"], p');
    const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.cmp-button, a[class*="action"]');

    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (cta) textCell.push(cta);

    cells.push([img || '', textCell.length ? textCell : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
