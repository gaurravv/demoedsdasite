/* eslint-disable */
/* global WebImporter */
/**
 * Parser for embed-review. Base: embed.
 * Source: admiral.com Trustpilot widget (.trustpilot-widget) — car-insurance.
 * The widget contains an anchor to the Trustpilot profile.
 * Library convention: Embed (video/social) = 1 column, 2 rows (name / URL link).
 * Emit the Trustpilot profile URL as the embed link.
 */
const TRUSTPILOT_URL = 'https://www.trustpilot.com/review/www.admiral.com';

export default function parse(element, { document }) {
  const existing = element.querySelector('a[href*="trustpilot.com"], a');
  let href = existing && existing.getAttribute('href');
  if (!href || href.trim() === '') href = TRUSTPILOT_URL;

  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.textContent = href;

  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-review', cells });
  element.replaceWith(block);
}
