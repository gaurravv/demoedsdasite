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
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-teaser-card-image';
      } else {
        div.className = 'cards-teaser-card-body';
        // Wrap trailing description text (after the title link) in a span so it
        // can be truncated to a single line like the source WKND image-list.
        div.querySelectorAll('p').forEach((p) => {
          const link = p.querySelector('a');
          if (!link) return;
          let node = link.nextSibling;
          const desc = document.createElement('span');
          desc.className = 'cards-teaser-card-description';
          while (node) {
            const next = node.nextSibling;
            desc.append(node);
            node = next;
          }
          if (desc.textContent.trim()) p.append(desc);
        });
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
