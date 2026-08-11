/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo. Base: hero.
 * Source: admiral.com hero banners (.hero-banner) — home, car-insurance, resources, help-support.
 * Library convention: Hero = 1 column, 3 rows (name / background image / title+subheading+CTA).
 * Handles: 0, 1 or 2 CTAs; optional h1 page title above the copy heading; optional subheading.
 */
export default function parse(element, { document }) {
  // Background image: prefer the dedicated hero image container, else first standalone image.
  const bgImage = element.querySelector('.hero-banner__image img')
    || element.querySelector(':scope > img')
    || element.querySelector('img');

  // Headings (page title h1 and/or copy heading h2/h3), in document order.
  const headings = Array.from(element.querySelectorAll('h1, h2, h3'));

  // Body paragraphs (exclude any that live inside a CTA container).
  const paragraphs = Array.from(element.querySelectorAll('p'))
    .filter((p) => !p.closest('.buttons, .buttons__flex, .app-icons'));

  // CTA links: prefer explicit button containers; fall back to standalone .button links.
  let ctaLinks = Array.from(element.querySelectorAll('.buttons a, .buttons__flex a'));
  if (ctaLinks.length === 0) {
    ctaLinks = Array.from(element.querySelectorAll('a.button'));
  }

  // Empty-block guard.
  if (headings.length === 0 && paragraphs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  headings.forEach((h) => contentCell.push(h));
  paragraphs.forEach((p) => contentCell.push(p));
  ctaLinks.forEach((a) => contentCell.push(a));
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
