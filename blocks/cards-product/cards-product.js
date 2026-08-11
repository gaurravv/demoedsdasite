import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Map a product href to the icon modifier slug used in cards-product.css.
 * The Admiral "product pods" grid renders a fixed set of brand product icons
 * (circular dark-blue tiles). The icons are not part of the authored content
 * (the icon cell is empty), so we attach them by href, mirroring the source
 * site's per-product CSS-background approach.
 */
const ICON_BY_HREF = {
  '/car-insurance': 'car',
  '/home-insurance': 'home',
  '/pet-insurance': 'pet',
  '/multicover-insurance': 'multicover',
  '/multicar-insurance': 'multicar',
  '/van-insurance': 'van',
  '/travel-insurance': 'travel',
  '/loans/personal-loans': 'loans',
  '/learner-driver-insurance': 'learner',
  '/home-insurance/landlord': 'landlord',
  '/car-insurance/temporary-car-insurance': 'temp-car',
  '/breakdown-cover': 'breakdown',
};

function iconSlug(href) {
  if (!href) return null;
  // normalise: strip origin + trailing slash + query/hash
  let path = href;
  try {
    path = new URL(href, window.location.origin).pathname;
  } catch (e) { /* href already a path */ }
  path = path.replace(/\/$/, '');
  return ICON_BY_HREF[path] || null;
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    // The authored card is: [icon cell (empty)] [label cell -> a[href]label]
    const link = row.querySelector('a[href]');
    if (!link) return;

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const tile = document.createElement('a');
    tile.className = 'cards-product-item';
    tile.href = link.getAttribute('href');

    const icon = document.createElement('span');
    icon.className = 'cards-product-icon';
    const slug = iconSlug(tile.getAttribute('href'));
    if (slug) icon.classList.add(`cards-product-icon-${slug}`);
    icon.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'cards-product-text';
    text.textContent = link.textContent.trim();

    tile.append(icon, text);
    li.append(tile);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
