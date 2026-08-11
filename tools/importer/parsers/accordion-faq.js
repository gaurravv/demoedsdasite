/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: admiral.com FAQ accordions (.faqs) — car-insurance (multiple instances per page).
 * Each item is .pod.pod--faq with an H3 question (.js-toggle-content) and a .hide answer container.
 * Library convention: Accordion = 2 columns (title | content), one row per item.
 *   Cell 1: question header.
 *   Cell 2: answer content (paragraphs, lists, etc.).
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll(':scope > .pod--faq, :scope .pod--faq, :scope > .pod'));
  if (items.length === 0) {
    items = element.matches('.pod--faq, .pod') ? [element] : Array.from(element.querySelectorAll('.pod'));
  }
  items = items.filter((el, i) => items.indexOf(el) === i);

  const cells = [];
  items.forEach((item) => {
    const question = item.querySelector('.js-toggle-content, h2, h3, h4');
    // Answer body: the .hide container's inner content, else everything after the heading.
    const answerWrap = item.querySelector('.hide');

    let answerContent = [];
    if (answerWrap) {
      // Use the inner wrapper's children if it has a single content div, else the wrapper itself.
      const inner = answerWrap.querySelector(':scope > div') || answerWrap;
      answerContent = Array.from(inner.childNodes);
    } else {
      // Fallback: siblings of the question inside the item.
      answerContent = Array.from(item.children).filter(
        (c) => c !== question && !c.classList.contains('hide-toggle'),
      );
    }

    if (!question && answerContent.length === 0) return;

    const questionCell = question || '';
    const answerCell = answerContent.length ? answerContent : '';
    cells.push([questionCell, answerCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
