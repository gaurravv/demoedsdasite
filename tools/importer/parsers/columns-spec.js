/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-spec. Base: columns.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/climbing-new-zealand.html
 * Structure: 2 columns. First row = block name. Each subsequent row is a spec key/value
 * pair: [label | value] (Activity, Adventure Type, Trip Length, Group Size, Difficulty, Price).
 */
export default function parse(element, { document }) {
  const elements = Array.from(element.querySelectorAll('.cmp-contentfragment__element'));
  const cells = [];

  elements.forEach((el) => {
    const labelEl = el.querySelector('.cmp-contentfragment__element-title, dt, [class*="element-title"]');
    const valueEl = el.querySelector('.cmp-contentfragment__element-value, dd, [class*="element-value"]');

    const label = labelEl ? labelEl.textContent.trim() : '';
    const value = valueEl ? valueEl.textContent.trim() : '';
    if (!label && !value) return;

    cells.push([label, value]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-spec', cells });
  element.replaceWith(block);
}
