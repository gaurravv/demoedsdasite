/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-award. Base: hero.
 * Source: admiral.com dark award banner (.custom-banner.dark-blue) — home.
 * Award badge image (.image img) + heading + text. NO call-to-action.
 * Library convention: Hero = 1 column, 3 rows (name / image / title+text).
 */
export default function parse(element, { document }) {
  // Award badge / logo image.
  const image = element.querySelector('.image img')
    || element.querySelector(':scope img')
    || element.querySelector('img');

  // Text block (.text) holds heading + description.
  const textWrap = element.querySelector('.text') || element;
  const headings = Array.from(textWrap.querySelectorAll('h1, h2, h3'));
  const paragraphs = Array.from(textWrap.querySelectorAll('p'));

  if (headings.length === 0 && paragraphs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (image) cells.push([image]);

  const contentCell = [];
  headings.forEach((h) => contentCell.push(h));
  paragraphs.forEach((p) => contentCell.push(p));
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-award', cells });
  element.replaceWith(block);
}
