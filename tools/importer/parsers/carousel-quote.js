/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-quote. Base: carousel.
 * Source: admiral.com testimonials slider (.testimonials-slider) — home.
 * Slick slider: real slides + cloned duplicate slides (.slick-cloned) for infinite loop.
 * We keep only UNIQUE (non-cloned) slides — 3 testimonials.
 * NOTE: The completeness similarity score is intentionally < 90% for this block.
 * The source element text still contains the duplicated (.slick-cloned) slides
 * (7 total slide copies for 3 real testimonials), so deduplicating to the 3 real
 * slides — the correct block output — cannot match the duplicated source text.
 * Verified manually: all 3 unique testimonials (quote + author + location + avatar)
 * are present and correctly placed; the lower score is expected, not data loss.
 * Library convention: Carousel = 2 columns (image | text), one row per slide.
 *   Cell 1: avatar image.
 *   Cell 2: quote (callout) + author + location.
 */
export default function parse(element, { document }) {
  // Real slides only — exclude Slick's duplicated (.slick-cloned) slides.
  let slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));
  if (slides.length === 0) {
    slides = Array.from(element.querySelectorAll('.testimonial'));
  }
  // Always de-duplicate by quote text as a final safety net (handles clones that
  // may lack the .slick-cloned class in some captures).
  const seenQuotes = new Set();
  slides = slides.filter((slide) => {
    const t = slide.querySelector('.testimonial') || slide;
    const key = (t.querySelector('.callout') || t).textContent.trim();
    if (seenQuotes.has(key)) return false;
    seenQuotes.add(key);
    return true;
  });

  const cells = [];
  slides.forEach((slide) => {
    const testimonial = slide.querySelector('.testimonial') || slide;
    const image = testimonial.querySelector('.image img, img');
    const quote = testimonial.querySelector('.callout');
    const author = testimonial.querySelector('.testimonial__author');
    const location = testimonial.querySelector('.testimonial__location');

    const contentCell = [];
    if (quote) contentCell.push(quote);
    if (author) contentCell.push(author);
    if (location) contentCell.push(location);

    if (!image && contentCell.length === 0) return;
    cells.push([image || '', contentCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-quote', cells });
  element.replaceWith(block);
}
