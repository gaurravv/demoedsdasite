/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-callout. Base: hero.
 * Source: admiral.com side-by-side callouts:
 *   - home: .sub-hero-banner--person-infront-house (scam warning, single CTA button)
 *   - home: .sub-hero-banner--admiral-app (app promo, two app-store image links)
 *   - magazine: .hero-banner (mini car-insurance CTA)
 * Library convention: Hero = 1 column, 3 rows (name / image / title+text+CTA).
 * Handles: image in .image / .hero-banner__image; single or multiple CTA links
 * (text buttons and/or app-store image links).
 */
export default function parse(element, { document }) {
  // Leading image (the side illustration/photo).
  const image = element.querySelector('.image img, .hero-banner__image img')
    || element.querySelector(':scope > img')
    || element.querySelector('img');

  // Text content lives in .copy / .hero-banner__copy / .hero-background.
  const copy = element.querySelector('.copy, .hero-banner__copy, .hero-background') || element;

  const headings = Array.from(copy.querySelectorAll('h1, h2, h3'));
  const paragraphs = Array.from(copy.querySelectorAll('p'))
    .filter((p) => !p.closest('.buttons, .buttons__flex, .app-icons'));

  // CTA / badge links: text buttons and app-store links (which wrap images).
  const ctaLinks = Array.from(
    copy.querySelectorAll('a.button, .buttons a, .buttons__flex a, .app-icons a'),
  );

  if (headings.length === 0 && paragraphs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (image) cells.push([image]);

  const contentCell = [];
  headings.forEach((h) => contentCell.push(h));
  paragraphs.forEach((p) => contentCell.push(p));
  ctaLinks.forEach((a) => contentCell.push(a));
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-callout', cells });
  element.replaceWith(block);
}
