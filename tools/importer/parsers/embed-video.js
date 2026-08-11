/* eslint-disable */
/* global WebImporter */
/**
 * Parser for embed-video. Base: embed.
 * Source: admiral.com TV advert (#schema-videoobject) — home.
 * The iframe src was empty in the scrape (deferred/consent-blocked). The real Vimeo
 * URL was recovered from metadata (media.video.embedUrl).
 * Library convention: Embed (video) = 1 column, 2 rows (name / URL link).
 * Emit the Vimeo URL as the embed link.
 */
const VIMEO_URL = 'https://player.vimeo.com/video/1113186489';

export default function parse(element, { document }) {
  // Prefer a real iframe src if present; otherwise fall back to the recovered Vimeo URL.
  const iframe = element.querySelector('iframe');
  let src = iframe && iframe.getAttribute('src');
  if (!src || src.trim() === '') src = VIMEO_URL;

  const link = document.createElement('a');
  link.setAttribute('href', src);
  link.textContent = src;

  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
