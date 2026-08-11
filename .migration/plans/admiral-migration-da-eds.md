# Admiral.com — Homepage + Key Pages Migration Plan (DA Authoring + EDS Delivery)

## Overview
Run a test migration of **https://www.admiral.com/** into AEM Edge Delivery Services using **Document Authoring (DA)** as the content source and **EDS** for delivery. Scope is the **homepage plus a few key representative pages** (a lightweight, multi-template proof-of-concept rather than the full site). The migration covers **content structure, design & styling, navigation & footer, and visual validation**.

## Goals & Scope
- **Pages** — the homepage plus 2–4 representative key pages (e.g. a product/quote landing page and a content/support page) to exercise more than one template.
- **Content structure** — sections, blocks, and default content authored into DA-ready HTML.
- **Design & styling** — extract source design tokens and per-block CSS so migrated pages visually match admiral.com.
- **Navigation & footer** — instrument the header/nav and footer as EDS fragments (shared across all pages).
- **Visual validation** — compare each migrated page against the original and iterate to close gaps.
- **Delivery** — upload/publish migrated pages to DA (admin.da.live) and confirm they render via EDS.

## Assumptions & Notes
- Scope is **homepage + a few key pages**. I'll propose the specific key pages after the homepage and a quick URL scan, and confirm the shortlist with you before migrating them.
- **Forms are out of scope.** The Forms migration plugin will **not** be enabled. Any quote/lead forms encountered will be captured structurally as static content (placeholder blocks/links) rather than converted to Adaptive Form JSON.
- Target project type will be confirmed as a **DA project** during setup.
- Publishing to DA/EDS requires the Adobe credentials opt-in in Settings → LLM Permissions; if a publish step returns 401/403 I'll pause and ask you to enable it (no token needed in chat).

## Checklist

### Phase 0 — Setup & Discovery
- [ ] Confirm project type and DA content source (org/repo), and Block Library endpoint (project-expert)
- [ ] Quick URL scan of admiral.com to identify candidate key pages (url-discovery)
- [ ] Propose a shortlist of key pages (homepage + 2–4 others) and confirm with you
- [ ] Inventory available EDS blocks to inform content modeling (block-inventory)

### Phase 1 — Per-Page Analysis
- [ ] Scrape the homepage and each confirmed key page (content, metadata, images, cleaned HTML)
- [ ] Analyze page structure: sections, content sequences, block variants (page-analysis)
- [ ] Map DOM selectors to block variants in page-templates.json (block-mapping-manager)
- [ ] Create/reuse block variants with similarity matching across pages (block-variant-manager)
- [ ] Capture any forms as static placeholder content (no Adaptive Form conversion)

### Phase 2 — Import Infrastructure & Content Import
- [ ] Generate block parsers and page transformers (import-infrastructure)
- [ ] Build and bundle the import script (import-script)
- [ ] Run the import to produce DA-ready HTML for the homepage + key pages (content-import)

### Phase 3 — Design & Styling
- [ ] Extract site-level design tokens (colors, typography, spacing) from admiral.com
- [ ] Apply per-block CSS to match the source design (complete-design-expert)

### Phase 4 — Navigation & Footer
- [ ] Instrument header/navigation (desktop, mobile, megamenu) as an EDS fragment (navigation-orchestrator)
- [ ] Build the footer fragment from the source site (footer-orchestrator)

### Phase 5 — Validation & Iteration
- [ ] Score imported pages for content completeness vs. source (import-validation)
- [ ] Visually critique each page against the original and fix gaps (visual-critique)
- [ ] Preview and verify rendering in the local EDS dev server (preview-import)

### Phase 6 — Publish to DA / EDS Delivery
- [ ] Upload migrated pages to Document Authoring (admin.da.live) source API
- [ ] Preview/publish via admin.hlx.page and confirm EDS delivery renders correctly
- [ ] Summarize results: pages migrated, validation scores, and any follow-ups

## Deliverables
- Homepage + a few key pages migrated as DA-ready content with matching design, nav, and footer
- Reusable block variants and import infrastructure covering the migrated pages
- Validation report (content completeness + visual comparison)
- Pages live in DA and rendering through EDS delivery

---
*Forms are excluded from this test migration per your decision. Execution requires switching to Execute mode. On approval, I'll begin with Phase 0 (project setup + a quick URL scan), then propose the key-page shortlist for your confirmation before migrating.*
