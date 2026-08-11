/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-bio. Base: cards.
 * Source: admiral.com author bio pod (.story__expert) — magazine (single card).
 * Avatar image + author name (h3) + role (h3) + bio paragraph(s) + optional share links.
 * Library convention: Cards = 2 columns (image | text), one row per card.
 *   Cell 1: avatar image.
 *   Cell 2: name, role, bio, share links.
 */
export default function parse(element, { document }) {
  const avatar = element.querySelector('.magazine-story__meta-avatar, .story__expert-meta img, img');

  // Name + role live in .story__expert-meta as headings.
  const metaHeadings = Array.from(element.querySelectorAll('.story__expert-meta h3, h3'));
  // Bio paragraphs (keep inline links intact).
  const paragraphs = Array.from(element.querySelectorAll('p'));
  const shareLinks = Array.from(element.querySelectorAll('.story__social a'));

  const contentCell = [];
  metaHeadings.forEach((h) => contentCell.push(h));
  paragraphs.forEach((p) => contentCell.push(p));
  shareLinks.forEach((a) => contentCell.push(a));

  if (!avatar && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[avatar || '', contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-bio', cells });
  element.replaceWith(block);
}
