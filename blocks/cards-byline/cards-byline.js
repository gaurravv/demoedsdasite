import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-byline-card-image';
      else div.className = 'cards-byline-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  // Tag a trailing paragraph of share links so it can be styled as an icon row.
  ul.querySelectorAll('.cards-byline-card-body').forEach((body) => {
    const shareP = [...body.querySelectorAll('p')].find(
      (p) => p.querySelector('a') && !p.textContent.trim(),
    );
    if (shareP) shareP.classList.add('cards-byline-share');
  });
  block.textContent = '';
  block.append(ul);
}
