# Full Site Migration to AEM Edge Delivery Services

## Overview
Migrate a full website to AEM Edge Delivery Services (EDS), including page **content**, **design/styling**, **navigation (header)**, and **footer**. The migration will discover the site's page templates, analyze representative pages, build reusable import infrastructure, import content, apply matching design, and instrument header/footer.

> **Blocking input needed:** The **website URL** has not yet been provided. Execution cannot begin until you paste the full URL (e.g. `https://www.example.com`). Everything below is ready to run the moment the URL is supplied.

## Confirmed Scope
- **Type:** Full site
- **Includes:** Content, Design/styling, Navigation, Footer
- **Target:** AEM Edge Delivery Services (this project repo)

## Migration Phases

### Phase 1 — Discovery & Scope
- Discover all URLs (via sitemap or crawl).
- Group similar pages into **page templates** (e.g. home, article, product, landing).
- Produce a site catalog + scope report (page counts, template list, block inventory).
- Confirm which representative pages to migrate per template.

### Phase 2 — Page Analysis
- For each template, analyze a representative page: sections, content sequences, authoring decisions, and required block variants.
- Survey existing EDS blocks for reuse; identify new block variants needed.

### Phase 3 — Import Infrastructure
- Generate/refresh `page-templates.json` with DOM selectors per block variant.
- Generate block **parsers** and page **transformers** for each template.
- Build the bundled import script.

### Phase 4 — Content Import
- Run the import for representative pages per template.
- Verify imported content renders correctly in local preview.

### Phase 5 — Design & Styling
- Extract design tokens (colors, typography, spacing) from the original site.
- Apply site-level design and per-block CSS to match the original.
- Visually verify each block/section against the source.

### Phase 6 — Navigation (Header)
- Instrument the site header/nav (desktop + mobile, megamenu if present).
- Validate nav structure against source screenshots.

### Phase 7 — Footer
- Migrate footer structure and content.
- Validate appearance and behavior against source.

### Phase 8 — Verification & Handoff
- Full-page and full-site visual critique vs. original.
- Fix styling/content discrepancies.
- Summarize migrated templates, blocks, and any manual follow-ups.

## Checklist
- [ ] **Provide the website URL** (required before any execution)
- [ ] Confirm any auth/staging access needs for the site
- [ ] Phase 1: Discover URLs and catalog page templates → scope report
- [ ] Confirm representative pages per template
- [ ] Phase 2: Analyze representative page per template (sections, blocks, variants)
- [ ] Phase 3: Generate page templates, parsers, transformers, and import script
- [ ] Phase 4: Import content for representative pages and verify in preview
- [ ] Phase 5: Extract design tokens and apply site + block styling
- [ ] Phase 6: Instrument and validate header/navigation
- [ ] Phase 7: Migrate and validate footer
- [ ] Phase 8: Full-site visual critique, fixes, and summary

## Open Questions / Decisions
- **Website URL** — needed to start (blocking).
- **Templates to prioritize** — after discovery, confirm which templates/pages to migrate first.
- **Commerce pages** — if the site has product/listing pages, an optional commerce workflow can be enabled to handle them specially.

## Notes
- Execution requires switching from Plan mode to **Execute mode**.
- Once the URL is provided, I'll begin with Phase 1 (discovery) and share the scope report before importing content.
