/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-cover. Base: tabs.
 * Source: admiral.com cover comparison tabs (#basic-15950) — car-insurance.
 * Outer tab switcher (.tabs) with .tabs-nav__btn labels and matching .tab-content panels.
 * Two tabs: "Comprehensive cover" / "Third party cover"; each panel holds a comparison table.
 * Library convention: Tabs = 2 columns (label | content), one row per tab.
 *   Cell 1: tab label.
 *   Cell 2: full panel content (heading + comparison table).
 */
export default function parse(element, { document }) {
  const tabs = element.querySelector('.tabs') || element;
  const labels = Array.from(tabs.querySelectorAll('.tabs-nav .tabs-nav__btn, .tabs-nav__btn'));
  const panels = Array.from(tabs.querySelectorAll('.tab-content-wrap > .tab-content, .tab-content'));

  // Intro copy (heading + description) that precedes the tab switcher inside the
  // block wrapper. It is not part of any tab panel, so preserve it by prepending
  // it into the first tab's content cell (keeps all source text within the block).
  const introNodes = [];
  const tabsWrapper = tabs.closest('.wrapper');
  element.querySelectorAll(':scope > .wrapper').forEach((w) => {
    if (w === tabsWrapper || w.contains(tabs)) return;
    const container = w.querySelector(':scope > .container') || w;
    Array.from(container.querySelectorAll('h1, h2, h3, h4, p')).forEach((n) => introNodes.push(n));
  });

  const cells = [];
  const count = Math.max(labels.length, panels.length);
  for (let i = 0; i < count; i += 1) {
    const labelEl = labels[i];
    const panelEl = panels[i];

    // Label text (the button wraps a <span>).
    let labelCell = '';
    if (labelEl) {
      const span = labelEl.querySelector('span');
      const p = document.createElement('p');
      p.textContent = (span ? span.textContent : labelEl.textContent).trim();
      labelCell = p;
    }

    // Panel content: the inner container's children (heading + table), else the panel itself.
    let panelCell = '';
    if (panelEl) {
      // Sanitize any nested tables: helix-importer's createTable runs a colspan
      // pass over EVERY <tr> in the produced block table (including nested ones),
      // and crashes on rows that contain no cells. The source comparison table has
      // a stray empty <tr>, so remove cell-less rows first.
      panelEl.querySelectorAll('table tr').forEach((tr) => {
        if (tr.querySelectorAll('td, th').length === 0) tr.remove();
      });
      const inner = panelEl.querySelector(':scope > .container') || panelEl;
      const content = Array.from(inner.childNodes);
      panelCell = content.length ? content : panelEl;
    }

    // Prepend the block intro copy into the first tab's content cell.
    if (i === 0 && introNodes.length) {
      panelCell = Array.isArray(panelCell)
        ? [...introNodes, ...panelCell]
        : [...introNodes, panelCell];
    }

    if (!labelCell && (!panelCell || (Array.isArray(panelCell) && panelCell.length === 0))) continue;
    cells.push([labelCell, panelCell]);
  }

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-cover', cells });
  element.replaceWith(block);
}
