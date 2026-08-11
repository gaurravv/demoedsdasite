/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-teaser. Base: cards.
 * Source: admiral.com teaser card grids — several shapes across pages:
 *   - home  #product-pods-5856 .grid       → .grid__cell > .pod.pod--product (image, h3, p, more-link)
 *   - car   #basic-14598 .grid / #basic-18934 .grid → .pod.pod--product.clearfix (image, h3, p, more-link)
 *   - car   #basic-17124 .product-pod-style → a.sub-hero-banner.product-pod-style (image, copy>h3/p)  [whole-card link]
 *   - magazine .views-element-container .grid → a.pod.pod--magazine (image, time, h3)  [whole-card link]
 *   - resources #basic-16349 .product-pod-style → a.sub-hero-banner.product-pod-style (image, copy>h3/p) [whole-card link]
 * Library convention: Cards = 2 columns (image | text), one row per card.
 *   Cell 1: card image.
 *   Cell 2: title (h3), description (p / time), optional "more" link.
 * When the card itself is a link (<a>) the whole-card href is re-applied to the title.
 */
export default function parse(element, { document }) {
  // Collect card items. The selector may resolve to a grid container OR a single
  // product-pod-style card (union selectors in page-templates use both shapes).
  let items = Array.from(
    element.querySelectorAll(
      ':scope > .grid__cell .pod, :scope .grid__cell .pod, '
      + ':scope > a.sub-hero-banner, :scope a.sub-hero-banner.product-pod-style, '
      + ':scope > a.pod--magazine, :scope a.pod--magazine',
    ),
  );

  // Fallback: the element itself is a single card (e.g. selector matched one .product-pod-style).
  if (items.length === 0) {
    if (element.matches('a.sub-hero-banner, .pod, a.pod--magazine')) {
      items = [element];
    } else {
      items = Array.from(element.querySelectorAll('.pod, a.sub-hero-banner, a.pod--magazine'));
    }
  }

  // De-duplicate (a card could match more than one selector branch).
  items = items.filter((el, i) => items.indexOf(el) === i);

  const cells = [];
  items.forEach((item) => {
    // Whole-card link href, if the card element is itself an anchor.
    const cardHref = item.tagName === 'A' ? item.getAttribute('href') : null;

    const image = item.querySelector('.image img, img');

    // Text container: .copy for sub-hero-banner cards, otherwise the card itself.
    const textScope = item.querySelector('.copy') || item;
    const heading = textScope.querySelector('h2, h3, h4');
    const time = textScope.querySelector('time');
    const paragraphs = Array.from(textScope.querySelectorAll('p'))
      .filter((p) => !p.querySelector('time'));
    // Explicit "read more" style link inside the card body.
    const moreLink = item.querySelector('a.more-link, .more-link');

    const contentCell = [];

    if (heading) {
      if (cardHref) {
        // Whole-card link: wrap the heading text in a link so the card stays clickable.
        const link = document.createElement('a');
        link.setAttribute('href', cardHref);
        const h = document.createElement((heading.tagName || 'h3').toLowerCase());
        link.textContent = heading.textContent.trim();
        h.append(link);
        contentCell.push(h);
      } else {
        contentCell.push(heading);
      }
    }

    if (time) {
      const p = document.createElement('p');
      p.textContent = time.textContent.trim();
      contentCell.push(p);
    }

    paragraphs.forEach((p) => contentCell.push(p));
    if (moreLink && !cardHref) contentCell.push(moreLink);

    // Skip genuinely empty cards.
    if (!image && contentCell.length === 0) return;

    cells.push([image || '', contentCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
