/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-team. Base: cards.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/about-us.html
 * Structure: 2 columns. First row = block name. Each subsequent row is a team member
 * card: [circular photo | name (heading), role, social links].
 * The instances selector matches each `section.cmp-experience-fragment--contributor`.
 * This parser aggregates a contiguous run of sibling contributor sections into a
 * single cards block, replacing the first and removing the rest.
 */
export default function parse(element, { document }) {
  // Gather the contiguous run of contributor sections starting at `element`.
  const isContributor = (n) =>
    n && n.nodeType === 1 && n.matches && n.matches('section.cmp-experience-fragment--contributor, section.experiencefragment.cmp-experience-fragment--contributor');

  // Walk backwards to find the first of the contiguous run.
  let first = element;
  while (isContributor(first.previousElementSibling)) {
    first = first.previousElementSibling;
  }
  // Only the first element of a run performs aggregation; others bail (already consumed).
  if (first !== element) {
    return;
  }

  // Collect the contiguous run forward from `first`.
  const cardEls = [];
  let cur = first;
  while (isContributor(cur)) {
    cardEls.push(cur);
    cur = cur.nextElementSibling;
  }

  const cells = [];
  cardEls.forEach((card) => {
    const img = card.querySelector('.image img, .cmp-image__image, img');
    const titles = Array.from(card.querySelectorAll('.cmp-title__text, .title .cmp-title h3, .title .cmp-title h5, h3, h5'));
    const name = titles.find((t) => t.tagName === 'H3') || titles[0];
    const role = titles.find((t) => t.tagName === 'H5') || (titles[1] && titles[1] !== name ? titles[1] : null);
    const socialLinks = Array.from(card.querySelectorAll('.cmp-buildingblock--btn-list a.cmp-button, .buildingblock a.cmp-button, a.cmp-button'));

    const textCell = [];
    if (name) textCell.push(name);
    if (role && role !== name) textCell.push(role);
    socialLinks.forEach((a) => textCell.push(a));

    cells.push([img || '', textCell.length ? textCell : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  first.replaceWith(block);

  // Remove the remaining aggregated sections.
  cardEls.forEach((card) => {
    if (card !== first && card.parentElement) card.remove();
  });
}
