/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-detail. Base: tabs.
 * Source: https://publish-p133255-e1921317.adobeaemcloud.com/us/en/adventures/climbing-new-zealand.html
 * Structure: 2 columns. First row = block name. Each subsequent row is a tab:
 * [label (Overview / Itinerary / What to Bring) | rich tab content].
 */
export default function parse(element, { document }) {
  const labels = Array.from(element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li'));
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));
  const cells = [];

  panels.forEach((panel, i) => {
    // Pair each panel with its label. Prefer id-based matching, fall back to index.
    let labelEl = labels[i] || null;
    const panelId = panel.id ? panel.id.replace('-tabpanel', '') : null;
    if (panelId) {
      const matched = labels.find((l) => l.id && l.id.replace('-tab', '') === panelId);
      if (matched) labelEl = matched;
    }

    const label = labelEl ? labelEl.textContent.trim() : '';

    // Tab content: prefer the inner rich content, fall back to the panel body.
    const contentEl = panel.querySelector('.cmp-contentfragment__elements, .contentfragment, .cmp-contentfragment') || panel;

    if (!label && !contentEl) return;
    cells.push([label, contentEl]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-detail', cells });
  element.replaceWith(block);
}
