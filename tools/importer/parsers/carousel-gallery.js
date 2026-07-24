/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-gallery. Base: carousel.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/climbing-new-zealand.html
 * Structure: 2 columns. First row = block name. Each subsequent row is an image-only
 * slide: [image | ''] (no text content for this gallery variant).
 */
export default function parse(element, { document }) {
  // Slides are carousel items; exclude the actions/indicators controls.
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.image img, .cmp-image__image, img');
    if (!img) return;
    // Image-only gallery: second cell intentionally empty to preserve 2-column shape.
    cells.push([img, '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-gallery', cells });
  element.replaceWith(block);
}
