/**
 * hero-callout — Admiral "sub-hero-banner" promo.
 * Two variants share one block:
 *  - light ice-blue rounded box with a single pill CTA (adds `.no-image`)
 *  - blue app-download banner with app-store badge links (adds `.app`)
 */
export default function decorate(block) {
  const appleLink = block.querySelector('a[href*="apps.apple.com"]');
  const googleLink = block.querySelector('a[href*="play.google.com"]');

  // --- App-download banner variant -------------------------------------
  if (appleLink || googleLink) {
    block.classList.add('app');

    // The Apple badge image is imported as a stray left-cell picture; the
    // Apple link itself is empty. Move the badge into its link so it renders
    // as a proper app-store badge (Google badge is already inside its link).
    const strayPicture = [...block.querySelectorAll('picture')]
      .find((p) => !p.closest('a'));
    if (strayPicture && appleLink && !appleLink.querySelector('picture')) {
      appleLink.textContent = '';
      appleLink.append(strayPicture);
    }

    // Group both badge links into a single horizontal row inside the copy.
    const copyCell = block.querySelector('h1, h2, h3, h4, h5, h6')?.parentElement
      || block.querySelector(':scope > div > div');
    const badges = document.createElement('div');
    badges.className = 'app-badges';
    const labels = new Map([[appleLink, 'Download on the App Store'], [googleLink, 'Get it on Google Play']]);
    [appleLink, googleLink].filter(Boolean).forEach((a) => {
      a.classList.remove('button');
      if (!a.getAttribute('aria-label') && !a.textContent.trim()) {
        a.setAttribute('aria-label', labels.get(a));
      }
      const img = a.querySelector('img');
      if (img && !img.getAttribute('alt')) img.setAttribute('alt', labels.get(a));
      const wrapper = a.closest('p');
      badges.append(a);
      if (wrapper && !wrapper.textContent.trim() && !wrapper.querySelector('picture, img')) {
        wrapper.remove();
      }
    });
    if (copyCell) copyCell.append(badges);

    // Drop any now-empty rows/cells (e.g. the old left image cell).
    [...block.querySelectorAll(':scope > div')].forEach((row) => {
      if (!row.textContent.trim() && !row.querySelector('picture, img')) row.remove();
    });
    return;
  }

  // --- Light rounded-box variant ---------------------------------------
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }
}
