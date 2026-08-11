/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-steps. Base: columns.
 * Source: admiral.com claims "steps" grid (#basic-18933 .grid--badges) — car-insurance.
 * Three .grid__cell columns; each holds a step badge image (a mobile + a desktop variant),
 * an H3 title and a description paragraph (which may contain inline links).
 * Library convention: Columns = one row with as many cells as columns (here 3).
 *   Each cell: step badge image + title + description.
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > .grid__cell, .grid__cell'));

  const rowCells = columns.map((col) => {
    const cellContent = [];

    // Keep a single badge image per column (desktop variant preferred; source ships
    // both a mobile and a desktop badge for responsive CSS — they are the same step).
    const desktopBadge = col.querySelector('.badge--lrg img, [class*="desktop"] img');
    const badge = desktopBadge || col.querySelector('.badge img, img');
    if (badge) cellContent.push(badge);

    const heading = col.querySelector('h2, h3, h4');
    if (heading) cellContent.push(heading);

    // Description paragraphs (preserve inline links).
    Array.from(col.querySelectorAll('p')).forEach((p) => cellContent.push(p));

    return cellContent.length ? cellContent : '';
  }).filter((c) => c !== '' || columns.length === 0);

  if (rowCells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single row, one cell per column.
  const cells = [rowCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-steps', cells });
  element.replaceWith(block);
}
