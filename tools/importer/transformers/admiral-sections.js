/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Admiral section breaks + section-metadata styling.
 *
 * Data model: in this project the section styling is carried on the block
 * entries in tools/importer/page-templates.json — each styled block has a
 * `section` property ("dark", "accent-light" or "accent") alongside its
 * `instances` selectors — rather than a top-level `template.sections` array.
 * This transformer therefore reads `payload.template.blocks[].section`.
 *
 * Verified section targets (from captured DOM + page-templates.json):
 *   car-insurance-landing:
 *     #basic-18928 -> dark          #basic-18930 -> dark
 *     #basic-18610 -> accent-light  #basic-17125 -> accent-light
 *   help-support:
 *     #basic-18374 .bg-fino -> accent
 * The home / magazine-article / resources-hub templates have no styled blocks,
 * so this transformer is a no-op for them.
 *
 * DOM facts:
 *   - Content lives under #block-admiral-annie-content > div > [section divs].
 *   - car-insurance targets ARE those top-level section divs.
 *   - help-support's styled element (.bg-fino) is nested one level inside its
 *     top-level section div (#basic-18374); we climb to that section div so the
 *     <hr> breaks land at the top level of the content flow.
 *
 * Output per styled section (in document order): a leading <hr>, the section
 * content, a "Section Metadata" block table (Style = <value>), and a trailing
 * <hr>, so the styled content sits in its own EDS section with the metadata
 * applied. Adjacent <hr> insertions are de-duplicated so two neighbouring
 * styled sections share a single divider.
 *
 * Runs in afterTransform only (block parsers run between the hooks and must
 * see the original content; section breaks are a final structural step).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

const CONTENT_ROOT_SELECTOR = '#block-admiral-annie-content';

/**
 * Climb from a resolved styled element up to its top-level section container:
 * the ancestor-or-self that is a direct child of the wrapper div sitting
 * directly under the content root (i.e. anchor.parentElement.parentElement is
 * the content root). Falls back gracefully when the content root is absent.
 */
function resolveSectionAnchor(el, contentRoot) {
  if (!contentRoot) return el;
  let anchor = el;
  while (
    anchor.parentElement
    && anchor.parentElement !== contentRoot
    && anchor.parentElement.parentElement !== contentRoot
  ) {
    anchor = anchor.parentElement;
  }
  return anchor;
}

function isHr(node) {
  return node && node.nodeType === 1 && node.tagName === 'HR';
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  if (!template || !Array.isArray(template.blocks)) return;

  const doc = (payload && payload.document) || element.ownerDocument;
  const contentRoot = element.querySelector(CONTENT_ROOT_SELECTOR);

  // Collect the styled section anchors in document order, de-duplicated.
  const seen = new Set();
  const targets = [];
  template.blocks
    .filter((block) => block && block.section && Array.isArray(block.instances))
    .forEach((block) => {
      block.instances.forEach((selector) => {
        element.querySelectorAll(selector).forEach((el) => {
          const anchor = resolveSectionAnchor(el, contentRoot);
          if (anchor && !seen.has(anchor)) {
            seen.add(anchor);
            targets.push({ anchor, style: block.section });
          }
        });
      });
    });

  if (targets.length === 0) return;

  // Order anchors by document position so reverse processing is deterministic.
  targets.sort((a, b) => {
    const pos = a.anchor.compareDocumentPosition(b.anchor);
    // eslint-disable-next-line no-bitwise
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    // eslint-disable-next-line no-bitwise
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  // Process in reverse document order: sibling insertions never invalidate the
  // still-pending (earlier) anchors, and the adjacent-<hr> guards keep two
  // neighbouring styled sections sharing a single divider.
  for (let i = targets.length - 1; i >= 0; i -= 1) {
    const { anchor, style } = targets[i];
    const parent = anchor.parentElement;
    if (!parent) continue;

    // Section Metadata block applied to this styled section.
    const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
      name: 'Section Metadata',
      cells: { Style: style },
    });
    anchor.after(sectionMetadata);

    // Trailing <hr> to close the styled section (unless one already follows).
    if (!isHr(sectionMetadata.nextElementSibling)) {
      sectionMetadata.after(doc.createElement('hr'));
    }

    // Leading <hr> to open the styled section, unless the anchor is the first
    // child or already preceded by an <hr>.
    if (anchor.previousElementSibling && !isHr(anchor.previousElementSibling)) {
      parent.insertBefore(doc.createElement('hr'), anchor);
    }
  }
}
