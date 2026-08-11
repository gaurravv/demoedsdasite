import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const picture = row.querySelector('picture');
    const headings = [...row.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    const paragraphs = [...row.querySelectorAll('p')];

    // Meta row: square avatar (left) + author name / role stacked (right).
    const meta = document.createElement('div');
    meta.className = 'cards-bio-meta';
    if (picture) {
      const avatar = document.createElement('div');
      avatar.className = 'cards-bio-avatar';
      avatar.append(picture);
      meta.append(avatar);
    }
    headings.forEach((h, i) => {
      h.classList.add(i === 0 ? 'cards-bio-name' : 'cards-bio-role');
      meta.append(h);
    });

    // Body: full-width descriptive bio paragraph(s).
    const body = document.createElement('div');
    body.className = 'cards-bio-body';
    paragraphs.forEach((p) => body.append(p));

    if (meta.children.length) li.append(meta);
    if (body.children.length) li.append(body);
    ul.append(li);
  });

  // Optimise the avatar image.
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
