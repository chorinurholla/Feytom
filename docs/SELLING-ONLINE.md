# Selling online — the staged plan, and what the client must supply

**Decision D26, 17 August 2026.** The client wants customers to buy and pay on
the website. This reverses §6 of the brief, which chose catalog + RFQ precisely
because pricing, tax, shipping and returns were unapproved. Those things are now
on the critical path rather than deferred.

**Approach chosen:** staged. Publish prices, take payment against a quote, add
parcel checkout later. **Freight items stay quote-only.**

---

## Why not simply add a cart

One calculation decides the shape of this. Estimated shipped weights, from
published material densities:

| Product | Est. shipped weight | Ships as |
|---|---|---|
| Grade 70 chain, 5/16 in x 20 ft | 24–26 lb | Parcel |
| Heavy-Duty PE rope, 3/8 in x 502 ft | 19–23 lb | Parcel |
| Cargo lashing belt, 2 in x 328 ft | 19–24 lb | Parcel |
| **Grade 43 chain, 5/16 in x 551 ft drum** | **530–590 lb** | **LTL freight** |

> These are **estimates, not client figures.** The site itself still shows
> "Shipping weight: Not yet confirmed" for all four products — and those are
> exactly the numbers a checkout needs in order to price delivery. The pending
> item became a blocking one the moment the client asked to sell online.

Three products are parcels. One is roughly a quarter of a ton and needs an LTL
quote with a freight class, a destination and accessorials such as liftgate and
residential delivery. No flat-rate table survives that mix, and a checkout that
quotes ground shipping on a 550 lb pallet loses money on every order.

## The model that is built

```
published price  →  request a quote  →  delivered total confirmed
                 →  payment link  →  paid by card
```

It is a genuine buy-and-pay route for how bulk buyers actually order, and it
never displays a number that is not the number. What it is not is a
browse-and-add-to-cart store; that is stage 2.

## What is built now

| | |
|---|---|
| `commerce.price` | The old `z.null()` lock is **replaced, not removed**. A bare number is still refused: a price needs an amount, a currency, the **unit it buys** (`per: roll` vs `per: foot` differ by orders of magnitude here), what it **excludes**, a source, and an effective date. |
| `commerce.fulfilment` | Required on every product: `parcel` or `freight`. It decides which action the page offers. |
| Schema rule | A `freight` product **cannot** be `buy_online`. Setting it fails the build with "delivery must be quoted, not calculated". |
| Schema rule | `buy_online` without a price fails the build. |
| `PriceBlock` | Price, the exclusions line, and either a buying route or the freight notice. |
| Launch guard | `PUBLIC_SHOW_PRICES` alone fails: publishing a price is an invitation to buy, so approved **terms of sale and a returns policy** must exist behind it. On a live build it also requires the privacy notice — taking an order means taking personal data. |
| YAML date handling | `effectiveFrom: 2026-08-17` unquoted is parsed by YAML as a *Date object*, not a string. Both forms are accepted and normalised, rather than leaving a trap for the next editor. |

Prices are **off** until `PUBLIC_SHOW_PRICES` and `PUBLIC_SALE_TERMS_APPROVED`
are both set. With them off, the site reads exactly as it did before. The
freight notice shows either way, because it is a fact about the product rather
than a consequence of pricing.

## What the client must supply

Nothing below is a development task, and all of it blocks going live with prices.

**To publish prices**

1. **Unit price per product**, with the unit it buys — per roll, per bag, per
   drum. State whether it excludes delivery and sales tax (it should).
2. **Terms of sale** — owner or legal approved. Currently a `noindex` scaffold.
3. **Returns and refunds policy** — same. Currently a `noindex` scaffold.
4. **Privacy notice** — already outstanding, now doubly required.

**To take payment**

5. **A Stripe account** (or PayPal — tell me which), and who receives payouts.
6. Who issues quotes and payment links, and from which inbox.

**To move to stage 2, parcel checkout**

7. **Confirmed shipping weights and dimensions** per product, packed.
8. **Case quantities and minimum order quantities.**
9. **A shipping policy** — carriers, service levels, coverage, cut-off times.
10. **Sales tax registration.** Selling nationwide can create obligations in many
    states under economic-nexus rules. Software (Stripe Tax) calculates it;
    **registering and remitting is the client's legal obligation.** Worth an
    accountant's hour before the first order, not after.
    *This is not tax advice and I am not qualified to give it.*

## What this change affects elsewhere

Recorded per §28 change control:

- **§6 of the brief** — "catalog + RFQ, not a transactional store" is superseded.
- **The do-not-use list** — "no price UI" no longer applies. "No Add to Cart"
  still does, until stage 2.
- **Content guard** — the `price` and `cart` keyword rules remain. Prices live in
  structured schema fields, not in prose, so the rules still catch a `$` figure
  written into copy.
- **Structured data** — §12 forbade `Offer`, `price` and `availability` because no
  real data existed. Once prices are published an `Offer` block becomes both
  legitimate and valuable for search. Not yet implemented; it should be added at
  the same time prices go live, and only for parcel products.
- **B2B reality** — fleet buyers want purchase orders, net terms and often hold a
  resale exemption certificate. Card checkout serves the walk-up buyer. The quote
  path is not a fallback; it is probably the majority of revenue, and it stays.

## Stage 2, when the logistics data exists

Parcel checkout for the three parcel SKUs: cart, Stripe Checkout, Stripe Tax,
live carrier rates from confirmed weights, order records, fulfilment emails.
The freight drum stays quote-only. Stage 3, full commerce with inventory and
returns handling, only if order volume justifies the running cost.
