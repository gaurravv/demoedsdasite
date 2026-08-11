/* eslint-disable */
/* global WebImporter */
/**
 * Parser for quote-expert. Base: quote (no library convention — inferred from source
 * HTML and the local block decorator blocks/quote-expert/quote-expert.js).
 * Source: admiral.com expert quote (.quote-box) — car-insurance.
 *   .column.icon    → decorative quotation-mark SVG (dropped; purely stylistic)
 *   .column.content → h3 attribution (name + role) + p quotation text
 * The decorator maps: first child cell = quotation, second child cell = attribution.
 * Library structure: 1 column, 2 rows — row 1 quotation, row 2 attribution.
 */
export default function parse(element, { document }) {
  const content = element.querySelector('.column.content, .content') || element;
  const attribution = content.querySelector('h2, h3, h4');
  const quotation = content.querySelector('p');

  if (!quotation && !attribution) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 1: the quotation text (decorator styles the first cell as the quote).
  if (quotation) {
    const q = document.createElement('p');
    q.innerHTML = quotation.innerHTML;
    cells.push([q]);
  }
  // Row 2: the attribution (name + role). Emphasise so the decorator can wrap it in <cite>.
  if (attribution) {
    const cite = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = attribution.textContent.trim();
    cite.append(em);
    cells.push([cite]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote-expert', cells });
  element.replaceWith(block);
}
