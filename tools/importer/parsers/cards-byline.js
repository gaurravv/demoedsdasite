/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-byline. Base: cards.
 * Source: admiral.com article byline (.story__meta) — magazine (single card).
 * Avatar image + author name + date/read-time text + share links.
 * Library convention: Cards = 2 columns (image | text), one row per card.
 *   Cell 1: avatar image.
 *   Cell 2: author name, date/read-time, share links.
 */
export default function parse(element, { document }) {
  const avatar = element.querySelector('.magazine-story__meta-avatar, img');

  const author = element.querySelector('.story__meta-author');
  const date = element.querySelector('.story__meta-date');
  // Share links (email link has a real href; social ones are placeholders).
  const shareLinks = Array.from(element.querySelectorAll('.story__social a'));

  const contentCell = [];
  if (author) contentCell.push(author);
  if (date) contentCell.push(date);
  shareLinks.forEach((a) => contentCell.push(a));

  if (!avatar && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[avatar || '', contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-byline', cells });
  element.replaceWith(block);
}
