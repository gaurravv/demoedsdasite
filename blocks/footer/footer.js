import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer as a fragment. A `footer` metadata override wins; otherwise prefer
  // /content/footer for content-tree layouts (migrated pages served under /content/)
  // and fall back to /footer at the site root for a standard DA/EDS deploy. The dev
  // server may proxy the bare /footer path to a stale published site, so pages under
  // /content/ resolve /content/footer first (mirrors blocks/header/header.js).
  const footerMeta = getMetadata('footer');
  let footerPath = '/footer';
  if (footerMeta) {
    footerPath = new URL(footerMeta, window.location).pathname;
  } else if (window.location.pathname.startsWith('/content/')) {
    footerPath = '/content/footer';
  }
  let fragment = await loadFragment(footerPath);
  if (!fragment || !fragment.firstElementChild) {
    fragment = await loadFragment(footerPath === '/content/footer' ? '/footer' : '/content/footer');
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label the top-level sections so CSS can lay them out
  const sectionClasses = ['footer-explore', 'footer-social', 'footer-legal', 'footer-fca'];
  [...footer.children].forEach((section, i) => {
    if (sectionClasses[i]) section.classList.add(sectionClasses[i]);
  });

  // Explore: the H2 heading followed by the 5 link column <ul>s (EDS wraps them in a
  // .default-content-wrapper). Move the column lists into a grid container so the
  // heading spans above a responsive column grid (5 columns on desktop, collapsing
  // to fewer/stacked on narrow viewports via CSS).
  const explore = footer.querySelector('.footer-explore');
  if (explore) {
    const columns = document.createElement('div');
    columns.className = 'footer-columns';
    explore.querySelectorAll('ul').forEach((col) => {
      col.classList.add('footer-column');
      columns.append(col);
    });
    explore.append(columns);
  }

  // Social: the label plus the icon-link row (the <p> holding the profile img links).
  const social = footer.querySelector('.footer-social');
  if (social) {
    const links = [...social.querySelectorAll('p')].find((p) => p.querySelector('img'));
    if (links) links.classList.add('footer-social-links');

    // Inline the social SVGs so they inherit the link color (currentColor) and
    // recolor on hover — an <img>-embedded SVG can't be recolored via CSS `color`,
    // so it would render black-on-navy. The <img> tags stay in the plain-HTML
    // fragment as a no-JS fallback; here we upgrade them to inline <svg>.
    await Promise.all([...social.querySelectorAll('img[src$=".svg"]')].map(async (img) => {
      try {
        const resp = await fetch(img.src);
        if (!resp.ok) return;
        const svg = new DOMParser()
          .parseFromString(await resp.text(), 'image/svg+xml')
          .querySelector('svg');
        if (!svg) return;
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const link = img.closest('a');
        const label = img.getAttribute('alt');
        if (link && label && !link.getAttribute('aria-label')) {
          link.setAttribute('aria-label', label);
        }
        img.replaceWith(svg);
      } catch (e) {
        // leave the <img> fallback in place
      }
    }));
  }

  block.append(footer);
}
