# Feytom Website Taxonomy & Claude Build Brief

**Document status:** Website source of truth, version 1.0  
**Company:** Feytom LLC  
**Customer-facing brand:** Feytom  
**Pronunciation:** Fei-tom  
**Market:** United States, nationwide  
**Recommended first release:** B2B product catalog with request-a-quote conversion  
**Primary tagline:** Built for the Work.

---

## 1. Purpose of this document

This document is the canonical taxonomy, content model, design reference and implementation brief for building the Feytom website with Claude or another AI coding assistant. It defines what is confirmed, what is recommended, what must remain unpublished until verified, and how the website should be organized.

Claude should treat statements marked **Confirmed** as approved project facts, **Recommended** as the default implementation direction, **Pending** as a required business decision, and **Restricted** as information that must not be invented or published without evidence.

### Operating rule for Claude

1. Build from the information in this document and the referenced brand assets.
2. Do not invent prices, inventory levels, working-load limits, certifications, shipping promises, addresses, telephone numbers, email addresses, customer logos, testimonials or legal policies.
3. Where a required value is pending, use a clearly labeled configuration value or CMS field; never display fake placeholder information on a production page.
4. Use the customer-facing name **Feytom** in marketing copy. Use **Feytom LLC** in the footer, legal notices, policies, quotes, invoices and formal company references.
5. Treat the four products in this document as initial seed content, not an exhaustive future catalog.

## 2. Executive project taxonomy

| Domain | Confirmed truth | Website implication |
|---|---|---|
| Entity | Feytom LLC is the registered US company. | Legal footer and formal forms use Feytom LLC. |
| Brand | Feytom, pronounced Fei-tom. | Add pronunciation only where useful, such as About or brand metadata; do not overuse it. |
| Position | Rugged cargo-securement, warehouse and industrial supply partner. | Visual and verbal system should feel work-ready, technical and dependable. |
| Service area | Entire United States. | Use “Serving customers across the United States”; do not claim delivery times. |
| Initial offer | Chains, lashing belts and industrial rope. | Launch with one main category and three product families. |
| Conversion | Bulk quantities; contact for pricing and availability. | Use request-a-quote as the primary conversion until commerce data is approved. |
| Brand promise | Dependable sourcing, clear product information and straightforward service. | Prioritize specifications, availability inquiries and practical copy. |
| Safety | WLLs, load limits and certifications require manufacturer verification. | No unsupported technical or compliance claims may appear. |

## 3. Brand foundation

### 3.1 Purpose

Feytom exists to make dependable cargo-securement and industrial products easier for US transportation, warehouse and material-handling operators to source and understand.

### 3.2 Positioning statement

For transportation, warehouse and industrial teams that need work-ready cargo-securement supplies, Feytom is a practical nationwide supply partner offering clearly presented products, responsive quoting and dependable sourcing. Unlike vague commodity listings, Feytom communicates specifications directly and avoids claims that have not been verified.

### 3.3 Brand attributes

- Rugged
- Industrial
- Dependable
- Direct
- Specific
- Practical
- Work-ready
- Safety-conscious

### 3.4 Value pillars

1. **Dependable sourcing:** Products selected for real transportation, warehouse and industrial work.
2. **Clear specifications:** Dimensions, material, grade and packaging are easy to scan and compare.
3. **Straightforward service:** Quote and availability requests are simple, with no unnecessary marketing friction.
4. **Responsible claims:** Safety and performance language is published only when supported by manufacturer documentation.

### 3.5 Messaging hierarchy

**Primary brand line:** Built for the Work.  
**Supporting campaign line:** Secure the Load. Keep Work Moving.  
**Supporting capability line:** Work-Ready Supply.  
**Technical trust line:** Dependable by Specification.

**Approved company description:**

> Feytom supplies chains, lashing belts, ropes and industrial essentials for transportation, warehouse and material-handling operations across the United States. We focus on dependable sourcing, clear product information and straightforward service.

### 3.6 Voice and language rules

Use short sentences, useful nouns, active verbs and concrete specifications. Sound confident without sounding inflated. Prefer “2 in x 328 ft roll” over “premium long-length solution.” Prefer “Request pricing and availability” over “Unlock your industrial potential.”

**Use:** dependable, work-ready, cargo securement, industrial supply, clear specifications, request a quote, bulk quantities, pricing and availability.  
**Avoid unless documented:** certified, guaranteed, safest, strongest, best-in-class, OSHA-approved, DOT-approved, rated capacity, working-load limit, unbreakable, immediate nationwide delivery.

## 4. Audience taxonomy

### Primary audiences

| Audience | Core need | Proof they need | Primary action |
|---|---|---|---|
| Fleet and trucking operators | Securement products in practical sizes and quantities. | Grade, dimensions, packaging and availability. | Request a quote. |
| Warehouse and distribution teams | Dependable supplies for handling and securing loads. | Clear use cases, product specifications and bulk options. | Ask about availability. |
| Industrial procurement teams | A credible supplier and clean purchasing information. | Formal company identity, product sheets and responsive quoting. | Submit an RFQ. |
| Material-handling operations | Products suited to operational use. | Material, format, packaging and responsible safety notes. | Contact sales. |

### Secondary audiences

- Towing and recovery operations, where the product is appropriate and manufacturer documentation supports the application.
- Marine and general industrial users for polyethylene rope.
- Distributors or resellers seeking bulk quantities.
- Safety, compliance and operations reviewers who need product documentation.

### Buyer questions the website must answer

1. What does Feytom supply?
2. What are the exact dimensions, grade, material and packaging?
3. Is the product available in bulk?
4. Does Feytom serve my US location?
5. How do I request pricing or submit a purchase requirement?
6. Where can I obtain verified technical and safety documentation?

## 5. Product taxonomy

### 5.1 Launch catalog hierarchy

```text
Products
└── Cargo Securement
    ├── Lashing
    │   └── Cargo Lashing Belt
    ├── Chains
    │   ├── Grade 70 Trucker's Chain
    │   └── Grade 43 High-Test Chain
    └── Rope
        └── Heavy-Duty PE Rope
```

Do not publish empty future categories. The broader terms “warehouse supplies,” “material-handling supplies” and “industrial essentials” may be used in positioning copy, but only populated product families should appear in live catalog navigation.

### 5.2 Controlled vocabulary

| Field | Allowed launch values |
|---|---|
| Primary category | Cargo Securement |
| Product family | Lashing; Chains; Rope |
| Packaging | Roll; Bag; Drum |
| Availability mode | Quote required; Contact for availability |
| Market | United States |
| Customer type | Business / B2B |
| Status | Draft; Active; Temporarily unavailable; Archived |

### 5.3 Initial product records

#### Cargo Lashing Belt

- **Slug:** `cargo-lashing-belt-2in-328ft`
- **Category / family:** Cargo Securement / Lashing
- **Short description:** Heavy-duty cargo-lashing belt for securing loads during transportation, warehouse handling and industrial operations.
- **Width:** 2 inches
- **Length:** 328 feet per roll (100 m)
- **Product marking:** 3T
- **Packaging:** Roll
- **Availability copy:** Bulk quantities available. Request pricing and availability.
- **Restricted claim:** Do not interpret “3T” as a certified working-load limit without manufacturer documentation.

#### Grade 70 Trucker's Chain

- **Slug:** `grade-70-truckers-chain-5-16in-20ft`
- **Category / family:** Cargo Securement / Chains
- **Short description:** Grade 70 transport chain for cargo securement, trucking and heavy-duty industrial applications.
- **Chain grade:** Grade 70
- **Diameter:** 5/16 inch
- **Length:** Approximately 20 feet (6 m)
- **Packaging:** Bag
- **Availability copy:** Bulk quantities available. Request pricing and availability.
- **Restricted claim:** Do not publish WLL, breaking strength, finish, hook type or regulatory compliance until documented.

#### Grade 43 High-Test Chain

- **Slug:** `grade-43-high-test-chain-5-16in-551ft`
- **Category / family:** Cargo Securement / Chains
- **Short description:** Durable Grade 43 high-test chain for general cargo securement, warehouse operations, industrial use and material handling.
- **Chain grade:** Grade 43
- **Diameter:** 5/16 inch
- **Length:** Approximately 551 feet per drum (168 m)
- **Packaging:** Drum
- **Availability copy:** Bulk quantities available. Request pricing and availability.
- **Restricted claim:** Do not publish WLL, breaking strength, finish or regulatory compliance until documented.

#### Heavy-Duty PE Rope

- **Slug:** `heavy-duty-pe-rope-3-8in-502ft`
- **Category / family:** Cargo Securement / Rope
- **Short description:** Strong, lightweight polyethylene rope for cargo handling, securing loads, warehouse operations, marine use and general industrial applications.
- **Material:** Polyethylene (PE)
- **Diameter:** 3/8 inch
- **Length:** Approximately 502 feet per roll (153 m)
- **Packaging:** Roll
- **Availability copy:** Bulk quantities available. Request pricing and availability.
- **Restricted claim:** Do not publish tensile strength, WLL, UV resistance, construction or marine certification until documented.

### 5.4 Product content model

Every product page should support the following fields. Fields marked `required` must be present before a record can be active.

```yaml
product:
  id: required-stable-id
  status: draft | active | temporarily_unavailable | archived
  name: required
  slug: required
  eyebrow: optional-short-category-label
  primary_category: required
  product_family: required
  short_description: required
  long_description: optional
  applications: []
  specifications:
    - label: required
      value: required
      source_status: confirmed | manufacturer_verified | pending
  packaging:
    type: required
    units_per_case: pending
    case_dimensions: pending
    shipping_weight: pending
  commerce:
    mode: request_quote
    sku: pending
    price: null
    minimum_order_quantity: pending
    inventory_status: contact_for_availability
  safety:
    general_note: required
    working_load_limit: null
    breaking_strength: null
    certifications: []
    manufacturer_document_url: null
  media:
    hero_image: pending
    gallery: []
    spec_sheet: pending
    alt_text: required-when-image-added
  seo:
    title: required
    description: required
    canonical_url: generated
  related_products: []
```

## 6. Website goals and conversion model

### Primary goal

Turn qualified US business visitors into product-specific quote and availability inquiries.

### Secondary goals

- Establish Feytom as a credible, work-ready industrial supply brand.
- Make the initial product range easy to understand and compare.
- Give procurement teams a clean path to submit quantities and requirements.
- Create a scalable content structure for future products and verified technical documents.

### Recommended launch model

Launch as a **catalog + RFQ website**, not a transactional ecommerce store. Prices, taxes, shipping rules, inventory, returns and payment infrastructure are not yet approved. Product pages should use “Request a Quote” and “Check Pricing & Availability” instead of “Add to Cart.”

## 7. Information architecture and routes

### 7.1 Primary navigation

1. Products
2. Industries
3. Resources
4. About
5. Contact
6. Request a Quote - visually emphasized action

### 7.2 Recommended sitemap

```text
/
/products
/products/cargo-securement
/products/cargo-securement/lashing
/products/cargo-securement/chains
/products/cargo-securement/rope
/products/cargo-securement/lashing/cargo-lashing-belt-2in-328ft
/products/cargo-securement/chains/grade-70-truckers-chain-5-16in-20ft
/products/cargo-securement/chains/grade-43-high-test-chain-5-16in-551ft
/products/cargo-securement/rope/heavy-duty-pe-rope-3-8in-502ft
/industries
/industries/transportation-trucking
/industries/warehouse-distribution
/industries/industrial-material-handling
/resources
/resources/product-safety
/about
/request-a-quote
/contact
/privacy
/terms
/shipping-returns
/404
```

At launch, family pages may be implemented as filtered states on `/products/cargo-securement` rather than separate indexable pages if content is too thin. Do not create low-value SEO pages with duplicated copy.

## 8. Page taxonomy and content requirements

### 8.1 Home

**Purpose:** Establish the category, show the product range and drive quote requests.

**Required modules:**

1. Utility line: “Serving transportation, warehouse and industrial operations across the United States.”
2. Hero: headline “Built for the Work.”; supporting copy; primary CTA “Explore Products”; secondary CTA “Request a Quote.”
3. Product-family cards: Lashing, Chains and Rope.
4. Featured products: all four launch products.
5. Value-pillar strip: Dependable sourcing; Clear specifications; Straightforward service.
6. Industry/application section: Transportation & trucking; Warehouse & distribution; Industrial & material handling.
7. Safety/documentation callout: technical claims are confirmed against manufacturer documentation.
8. Closing RFQ panel.

### 8.2 Product index

**Purpose:** Let buyers scan, filter and reach product details.

**Required elements:** breadcrumb; H1; short category introduction; family filters; product grid; compact specification highlights; quote CTA; no empty filters.

### 8.3 Category or family page

**Purpose:** Explain a coherent product family and list matching products.

**Required elements:** breadcrumb; H1; practical introduction; relevant product cards; application context; general safety note; RFQ CTA.

### 8.4 Product detail page

**Purpose:** Give procurement and operations users enough verified detail to inquire confidently.

**Required modules:**

1. Breadcrumb and category label.
2. Product name and short description.
3. Product image or approved industrial placeholder.
4. Key specification block.
5. Primary CTA “Request Pricing & Availability.”
6. Applications list, written as possible uses rather than certification claims.
7. Packaging and bulk-quantity note.
8. Safety and technical-documentation note.
9. Download area only when an approved spec sheet exists.
10. Related products from the same family or category.

**Persistent safety note:**

> Load limits, working-load limits and safety certifications must be confirmed against the manufacturer’s technical documentation before use. A product marking alone may not establish a certified working-load limit.

### 8.5 Industries

Use applications to organize buyer relevance, not to imply that every product is approved for every use. Each industry page should link only to appropriate products and repeat the technical-documentation caveat where safety could be inferred.

### 8.6 Resources / Product Safety

Explain how Feytom handles specifications and documentation. Provide approved product sheets and manufacturer documents when available. Do not provide generalized rigging, tie-down or load-calculation instructions without qualified technical review.

### 8.7 About

Include legal identity, pronunciation, nationwide focus, purpose, approach and service principles. Do not invent a founding year, founder story, employee count, warehouse network or owned manufacturing capability.

### 8.8 Request a Quote

Use a short, accessible form with these fields:

- Name - required
- Company - required
- Work email - required
- Phone - optional
- Product - required, controlled product selector plus “Multiple products / other requirement”
- Quantity - required free-text or unit-aware value
- Delivery ZIP code or city/state - required
- Needed-by date - optional; label as requested date, not guaranteed delivery date
- Requirements / notes - optional
- File upload - optional, only if secure storage and file policy are implemented
- Consent checkbox and privacy notice - required where legally appropriate

After submission, show a confirmation state and send the inquiry to an approved business inbox or CRM. Until that integration exists, the form must not pretend that submission succeeded.

### 8.9 Contact

Display only verified contact channels. Include service area, response expectation only if approved, and a route to the RFQ form.

### 8.10 Legal and policy pages

Privacy, terms, shipping and returns content require owner-approved legal/business text before public launch. Claude may scaffold route templates but must label them `noindex` and keep them out of production navigation until approved.

## 9. Component taxonomy

### Global components

- Utility bar
- Site header and responsive navigation
- Logo lockup
- Primary and secondary buttons
- Breadcrumbs
- Site footer with legal company name
- Cookie/consent interface only if required by the implemented analytics stack

### Content components

- Industrial hero
- Section intro
- Product-family card
- Product card
- Specification list
- Application chips or list
- Trust/value-pillar row
- Safety note callout
- Quote CTA panel
- Resource/download card
- Accordion for secondary details
- Empty, loading, success and error states

### Form components

- Text input, email input, telephone input
- Product selector
- Quantity input
- Location input
- Date input
- Text area
- File upload if enabled
- Consent checkbox
- Inline validation
- Submission status message

### Component states

Every interactive component needs default, hover, focus-visible, active, disabled, loading, error and success states where relevant. Focus must remain visible against all backgrounds.

## 10. Visual identity and design tokens

### 10.1 Logo decision gate

Three routes exist. A final selection is still pending.

1. **Open Loadlock - recommended implementation default:** strongest distinctive F construction and most complete logo suite. Use until the owner selects another route.
2. **Loadlock Badge:** compact equipment-badge character; useful for tags, workwear, trucks and small placements.
3. **Interlock:** two angular linked shapes; most abstract and expandable.

Do not combine symbols from different routes on one site. Once selected, use one route consistently. Keep the legal suffix “LLC” out of the marketing logo unless a future approved lockup adds it.

### 10.2 Color tokens

```css
:root {
  --feytom-navy: #102A43;
  --feytom-orange: #F36C21;
  --feytom-iron: #20272D;
  --feytom-steel: #7A8793;
  --feytom-galvanized: #DCE2E7;
  --feytom-sand: #F4F1EA;
  --feytom-white: #FFFFFF;

  --color-bg: var(--feytom-white);
  --color-bg-subtle: var(--feytom-sand);
  --color-text: var(--feytom-iron);
  --color-text-muted: #52616D;
  --color-heading: var(--feytom-navy);
  --color-border: var(--feytom-galvanized);
  --color-action: var(--feytom-orange);
  --color-action-text: #FFFFFF;
  --color-focus: #0067B1;
}
```

Signal Orange is an action and identification color, not a large background default. Use navy, iron, sand and white for most surfaces. Verify contrast for every text/background pairing; use dark text on orange when white text fails at a given size.

### 10.3 Typography

- **Display / headings:** Barlow Condensed Bold
- **Body / information:** Inter Regular and Inter SemiBold
- **Operational fallback:** Arial Narrow Bold for display; Arial for body
- Self-host or use a reliable font delivery method with `font-display: swap`.
- Use condensed display type for short, forceful headings; never use it for long body copy.

Suggested responsive type scale:

```css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.375rem;
--text-2xl: clamp(1.75rem, 3vw, 2.5rem);
--text-hero: clamp(2.75rem, 7vw, 5.75rem);
```

### 10.4 Shape, line and imagery language

- Use paired orange diagonal “load straps” as a recurring graphic device.
- Favor strong horizontal rules, clipped corners, restrained industrial grid patterns and generous spacing.
- Use modest corner radii, approximately 2-6 px; avoid soft, bubbly UI styling.
- Use real product photography when available: neutral industrial lighting, visible material detail, honest scale and clean work environments.
- Avoid generic construction-worker stock photos, sparks-for-drama imagery, unsafe load scenes, fake certifications and imagery that suggests Feytom manufactures products unless confirmed.

### 10.5 Spacing and layout

Use an 8 px base spacing system. Recommended content maximum width: 1200-1280 px. Product-detail text should remain narrower for readability. Cards should align to a consistent grid and product specifications should be scannable without horizontal scrolling.

## 11. Asset manifest

All paths below are relative to the project workspace. Use SVG for website logos where possible and PNG only when the target surface cannot use SVG.

### Open Loadlock - implementation default

- `output/feytom-brand-identity/logos/Feytom_Loadlock_Primary_FullColor.svg`
- `output/feytom-brand-identity/logos/Feytom_Loadlock_Primary_Reversed.svg`
- `output/feytom-brand-identity/logos/Feytom_Loadlock_Primary_OneColor_Dark.svg`
- `output/feytom-brand-identity/logos/Feytom_Loadlock_Icon_FullColor.svg`
- `output/feytom-brand-identity/logos/Feytom_Social_Avatar_1024.png`

### Loadlock Badge alternative

- `output/feytom-brand-identity/logos/loadlock-badge-variation/Feytom_Loadlock_Badge_Primary_FullColor.svg`
- `output/feytom-brand-identity/logos/loadlock-badge-variation/Feytom_Loadlock_Badge_Primary_Reversed.svg`
- `output/feytom-brand-identity/logos/loadlock-badge-variation/Feytom_Loadlock_Badge_Icon_FullColor.svg`

### Interlock alternative

- `output/feytom-brand-identity/logos/interlock-variation/Feytom_Interlock_Primary_FullColor.svg`
- `output/feytom-brand-identity/logos/interlock-variation/Feytom_Interlock_Primary_Reversed.svg`
- `output/feytom-brand-identity/logos/interlock-variation/Feytom_Interlock_Icon_FullColor.svg`

### Reference, packaging and documents

- Logo comparison: `output/feytom-brand-identity/previews/Feytom_Three_Logo_Comparison.png`
- Packaging applications: `output/feytom-brand-identity/previews/Feytom_Packaging_Applications.png`
- Brand guidelines: `output/pdf/Feytom_Loadlock_Brand_Guidelines.pdf`
- Editable packaging labels: `output/feytom-brand-identity/packaging/`
- Product spec template: `output/feytom-brand-identity/document-templates/Feytom_Product_Spec_Sheet_Template.docx`

## 12. Content and SEO taxonomy

### Page metadata pattern

- **Home title:** Feytom | Cargo Securement & Industrial Supply
- **Home description:** Work-ready chains, lashing belts and industrial rope for transportation, warehouse and material-handling operations across the United States. Request pricing and availability.
- **Product title pattern:** `[Product Name] | Feytom`
- **Product description pattern:** `[Verified size/grade/material] [product family] for [approved applications]. Request bulk pricing and availability from Feytom.`

### Structured data

Use `Organization` on the site, `WebSite` on the home page, `BreadcrumbList` on interior pages and `Product` on product pages. Do not add `Offer`, price, availability, aggregate rating, review or shipping properties unless supported by real data. Organization address, telephone and social profiles must remain absent until verified.

### URL and heading rules

- Lowercase kebab-case URLs.
- One descriptive H1 per page.
- Heading levels must not skip.
- Use human-readable link text, not “click here.”
- Add canonical URLs, XML sitemap and robots controls.
- Noindex incomplete legal pages, internal search states and staging environments.

## 13. Accessibility requirements

Target WCAG 2.2 AA in design and implementation.

- Full keyboard operation and visible focus indicators.
- “Skip to content” link.
- Semantic landmarks and correct heading order.
- Minimum 44 x 44 CSS px target size for primary touch controls where practical.
- Form labels remain visible; placeholders are not labels.
- Errors identify the field and explain how to fix it.
- Status messages are announced to assistive technology.
- Product images have specific alt text; decorative strap graphics use empty alt text.
- Color never carries meaning alone.
- Respect `prefers-reduced-motion`.
- Tables, if used for specifications, have appropriate headers and remain readable on mobile.

## 14. Responsive and performance requirements

### Responsive behavior

- Mobile-first implementation.
- Navigation collapses without hiding the quote action.
- Product cards stack to one column on small screens, then two and three columns as space permits.
- Specification pairs stack cleanly; do not require horizontal swiping.
- Product-detail CTA remains easy to reach but does not cover content.
- Test at 320 px, 375 px, 768 px, 1024 px and a wide desktop viewport.

### Performance baseline

- Optimize and size all raster images; prefer AVIF/WebP with safe fallbacks.
- Use SVG logos and decorative devices.
- Avoid autoplay video and heavy animation.
- Prevent layout shift by reserving image dimensions.
- Keep third-party scripts minimal.
- Aim for strong Core Web Vitals and a fast experience on ordinary mobile connections.

## 15. Functional and integration requirements

### Required for MVP

- Content-driven product catalog.
- Product and family filtering.
- Product-specific RFQ links that preselect the product.
- Server-validated quote form with spam protection.
- Submission delivery to an approved destination.
- Success, validation failure and system-error states.
- Basic privacy-conscious analytics after consent/legal review.
- Editable content source: local data files or a CMS selected for the owner’s workflow.

### Recommended analytics events

- `view_product`
- `select_product_family`
- `start_quote`
- `submit_quote`
- `quote_error`
- `download_spec_sheet`
- `contact_click`

Do not send personally identifiable form values into analytics.

### Security and privacy

- Validate and sanitize all server inputs.
- Rate-limit form endpoints and use bot mitigation.
- Keep secrets in environment configuration, never client code.
- Restrict uploaded file types and size if uploads are enabled.
- Define retention, access and deletion rules for quote inquiries.
- Publish privacy and terms content before collecting production submissions.

## 16. Claude implementation brief

Claude should choose a maintainable, accessible stack that fits the deployment environment specified by the owner. If no stack is provided, create a static-first, component-based site with server-side form handling and product data separated from presentation. Do not hard-code products repeatedly across pages.

### Recommended repository model

```text
src/
├── components/
│   ├── global/
│   ├── product/
│   ├── content/
│   └── forms/
├── content/
│   ├── products/
│   ├── categories/
│   ├── industries/
│   └── pages/
├── layouts/
├── pages-or-routes/
├── styles/
│   ├── tokens
│   ├── typography
│   └── global
├── assets/
│   ├── logos/
│   ├── products/
│   └── graphics/
└── lib/
    ├── validation/
    ├── seo/
    └── analytics/
```

### Build sequence

1. Create brand tokens and base typography.
2. Install the selected logo route; default to Open Loadlock pending a final decision.
3. Define product and category schemas with validation.
4. Add the four seed product records.
5. Build global shell, navigation, footer and route structure.
6. Build home, product index, category and product-detail templates.
7. Build industry, About, Resources, Product Safety, Contact and RFQ pages.
8. Connect the form to an approved destination and implement honest failure states.
9. Add metadata, structured data and sitemap controls.
10. Test accessibility, responsiveness, content restrictions and performance.

### Non-negotiable build checks

- No invented business facts or safety claims.
- No price or cart interface in the MVP.
- Every quote CTA passes product context into the form.
- All four products are generated from one data source.
- The footer says Feytom LLC.
- The primary tagline is “Built for the Work.”
- Color and typography match the defined brand system.
- Product safety note appears on relevant product and resource pages.
- The site works without hover and with keyboard-only navigation.
- Forms do not claim success unless the server confirms delivery.

## 17. Master prompt to give Claude

```text
You are building the production website for Feytom LLC, customer-facing as Feytom (pronounced Fei-tom), a rugged cargo-securement, warehouse and industrial supply brand serving the United States.

Use the attached “Feytom Website Taxonomy & Claude Build Brief” as the canonical source of truth. Implement the recommended B2B catalog + request-a-quote MVP. Follow its sitemap, product schema, component taxonomy, copy rules, design tokens, accessibility requirements and acceptance criteria.

Important constraints:
- Do not invent contact details, locations, prices, inventory, delivery promises, certifications, working-load limits, customer claims, legal policies or manufacturer facts.
- Use Feytom in marketing copy and Feytom LLC in legal/footer contexts.
- Use “Built for the Work.” as the primary tagline.
- Use the Open Loadlock SVG suite as the temporary master logo route unless I explicitly select Loadlock Badge or Interlock.
- Build all four launch products from one validated content/data source.
- Treat the experience as catalog + RFQ, not ecommerce.
- Any pending business value must be a clearly named configuration/CMS field and must not appear as fake production content.

Before coding, return: (1) assumptions, (2) proposed stack and why, (3) route map, (4) content/data schema, (5) asset mapping, and (6) a phased implementation plan. Then implement in small verifiable milestones. For every milestone, run relevant tests and report what remains pending.
```

## 18. Acceptance criteria

### Brand and content

- The site clearly communicates what Feytom supplies and whom it serves within the first screen.
- All approved brand colors, typography and logo rules are implemented consistently.
- Copy is direct, specific and free of unsupported superlatives.
- Pronunciation, legal name and nationwide US focus are accurate.

### Catalog

- All four initial products are present with the confirmed specifications in this document.
- Product family and category navigation works.
- No unsupported WLL, certification, construction, finish or performance data is published.
- Each product has a clear quote/availability path.

### UX and accessibility

- Primary journeys work on mobile and desktop.
- Navigation, filters, accordions and forms work by keyboard.
- Focus, validation, error and success states are clear.
- Images, headings, landmarks and form labels are accessible.

### Technical and operations

- Product content is not duplicated across templates.
- Metadata, canonical links, sitemap and structured data are valid.
- The quote endpoint is protected, validated and connected to an approved destination.
- Staging is blocked from indexing.
- There are no broken links, console errors or false success states.

## 19. Pending decisions and launch-readiness register

| Priority | Decision or input | Owner action | Publication rule |
|---|---|---|---|
| Critical | Select final logo route. | Choose Open Loadlock, Loadlock Badge or Interlock. | Use Open Loadlock only as temporary default. |
| Critical | Approve domain and production hosting. | Provide domain, registrar/DNS access and deployment preference. | Do not guess a public URL. |
| Critical | Verify business contact details. | Approve email, telephone and any public address. | Omit until verified. |
| Critical | Select RFQ delivery destination. | Approve inbox, CRM or form service. | No production form without confirmed delivery. |
| Critical | Approve privacy and terms. | Obtain owner/legal review. | Do not collect production inquiries before required notices exist. |
| Critical | Verify manufacturer technical data. | Supply spec sheets/certificates for each product. | Do not publish WLLs, capacities or certifications until verified. |
| High | Confirm product SKUs and order units. | Assign identifiers, MOQ and case information. | SKU/MOQ may remain absent at launch. |
| High | Approve product photography. | Supply or commission accurate product images. | Use clearly generic, non-misleading placeholders only in development. |
| High | Define shipping, returns and service policies. | Approve nationwide scope, exclusions and terms. | Do not promise timelines or coverage details. |
| Medium | Choose content ownership model. | Decide local files vs. CMS and name approvers. | Use structured local content for MVP if undecided. |
| Medium | Approve analytics and consent approach. | Choose tool, events and retention. | Use no analytics by default. |
| Medium | Confirm social profiles. | Supply verified URLs. | Omit social icons until supplied. |

## 20. Source hierarchy and change control

When sources conflict, use this order:

1. Owner-approved written decisions made after this document.
2. Verified manufacturer technical documentation for product and safety data.
3. This taxonomy and build brief.
4. Feytom brand guidelines and production asset files.
5. Initial product-list PDF.
6. Draft copy, mockups and development placeholders.

Record material decisions in a changelog with date, owner, old value and new value. Changes to legal identity, product technical data, safety claims, contact data, pricing, policies or logo route require explicit approval before production publication.

---

## Appendix A. Seed product data

```yaml
products:
  - id: feytom-clb-2-328
    status: active
    name: Cargo Lashing Belt
    slug: cargo-lashing-belt-2in-328ft
    primary_category: Cargo Securement
    product_family: Lashing
    short_description: Heavy-duty cargo-lashing belt for securing loads during transportation, warehouse handling and industrial operations.
    specifications:
      - { label: Width, value: 2 inches, source_status: confirmed }
      - { label: Length, value: 328 feet per roll (100 m), source_status: confirmed }
      - { label: Product marking, value: 3T, source_status: confirmed }
      - { label: Packaging, value: Roll, source_status: confirmed }
    commerce: { mode: request_quote, inventory_status: contact_for_availability }

  - id: feytom-g70-516-20
    status: active
    name: Grade 70 Trucker's Chain
    slug: grade-70-truckers-chain-5-16in-20ft
    primary_category: Cargo Securement
    product_family: Chains
    short_description: Grade 70 transport chain for cargo securement, trucking and heavy-duty industrial applications.
    specifications:
      - { label: Chain grade, value: Grade 70, source_status: confirmed }
      - { label: Diameter, value: 5/16 inch, source_status: confirmed }
      - { label: Length, value: Approximately 20 feet (6 m), source_status: confirmed }
      - { label: Packaging, value: Bag, source_status: confirmed }
    commerce: { mode: request_quote, inventory_status: contact_for_availability }

  - id: feytom-g43-516-551
    status: active
    name: Grade 43 High-Test Chain
    slug: grade-43-high-test-chain-5-16in-551ft
    primary_category: Cargo Securement
    product_family: Chains
    short_description: Durable Grade 43 high-test chain for general cargo securement, warehouse operations, industrial use and material handling.
    specifications:
      - { label: Chain grade, value: Grade 43, source_status: confirmed }
      - { label: Diameter, value: 5/16 inch, source_status: confirmed }
      - { label: Length, value: Approximately 551 feet per drum (168 m), source_status: confirmed }
      - { label: Packaging, value: Drum, source_status: confirmed }
    commerce: { mode: request_quote, inventory_status: contact_for_availability }

  - id: feytom-per-38-502
    status: active
    name: Heavy-Duty PE Rope
    slug: heavy-duty-pe-rope-3-8in-502ft
    primary_category: Cargo Securement
    product_family: Rope
    short_description: Strong, lightweight polyethylene rope for cargo handling, securing loads, warehouse operations, marine use and general industrial applications.
    specifications:
      - { label: Material, value: Polyethylene (PE), source_status: confirmed }
      - { label: Diameter, value: 3/8 inch, source_status: confirmed }
      - { label: Length, value: Approximately 502 feet per roll (153 m), source_status: confirmed }
      - { label: Packaging, value: Roll, source_status: confirmed }
    commerce: { mode: request_quote, inventory_status: contact_for_availability }
```

## Appendix B. Global safety content

Use this exact note until verified product-specific technical documentation allows a more precise statement:

> Load limits, working-load limits and safety certifications must be confirmed against the manufacturer’s technical documentation before use. A product marking alone may not establish a certified working-load limit.

This note is a publication safeguard, not a substitute for manufacturer instructions, applicable regulations, inspection procedures or qualified operational judgment.
