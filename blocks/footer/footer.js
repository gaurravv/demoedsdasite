import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment — dual-fetch: local (/content/footer) then DA/EDS (metadata path)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment || !fragment.firstElementChild) {
    fragment = await loadFragment('/footer');
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label the top-level sections so CSS can lay them out
  const sectionClasses = ['footer-brand', 'footer-nav', 'footer-social', 'footer-legal'];
  [...footer.children].forEach((section, i) => {
    if (sectionClasses[i]) section.classList.add(sectionClasses[i]);
  });

  // brand link is a plain wordmark, not an EDS button
  const brandLink = footer.querySelector('.footer-brand a.button');
  if (brandLink) {
    brandLink.className = '';
    const container = brandLink.closest('.button-container');
    if (container) container.className = '';
  }

  // resolve fragment-relative image paths (images/x.svg) to the content root
  footer.querySelectorAll('img[src^="images/"]').forEach((img) => {
    img.setAttribute('src', `/content/${img.getAttribute('src')}`);
  });

  block.append(footer);
}
