# RTP Demo Hub — Permanent Build Memory

## Product intent
This is a high-fidelity demo hub for real-time payments, merchant acquiring, bill payments, rewards, cashback, and agentic bill-pay journeys across Southeast Asia.

The goal is not to build a generic CRUD demo. The goal is to build a premium, realistic, mobile-first payments showcase that feels like a production-grade wallet or banking app.

## Design benchmark
All consumer-facing mobile flows must feel inspired by premium fintech and payments apps such as:
- Touch 'n Go eWallet
- GCash
- Maya
- GrabPay
- BPI mobile patterns
- modern Thai wallet / banking app patterns

This does NOT mean copying brand assets or cloning screens. It means the product should match their quality bar for:
- spacing
- hierarchy
- information density
- confirmation UX
- success states
- payment flow compression
- card layout quality
- iconography
- polish

## Non-negotiable UX principles
1. Mobile-first always. Every app screen must look like a well-designed phone UI, not a desktop card shrunk into a phone frame.
2. No raw debug tables in end-user flows.
3. No plain text dumps as confirmation or receipt screens.
4. Every screen must have strong visual hierarchy, proper spacing, and clear primary CTA.
5. Remove redundant steps. Payment flows should be as short as possible.
6. Static QR and dynamic QR are different flows and must remain separate.
7. Offers, loyalty, cashback, and rewards are distinct experiences and must not be merged unless explicitly configured.
8. Success screens must feel like real payment success screens: strong success iconography, amount, merchant or biller, timestamp, and next actions.
9. The uploaded logo from theme studio must render correctly in the in-app header if present.
10. Theme studio changes must propagate consistently to demo screens.

## Screen quality rules
- Use an 8pt spacing system.
- Safe area aware top and bottom spacing.
- Consistent card radius, elevation, borders, and typography.
- Use realistic icon containers and list cells.
- Use one strong primary CTA per screen.
- Avoid unnecessary secondary buttons unless they support a real payment action.
- Avoid giant empty areas caused by bad layout constraints.
- Never stretch tiny content into oversized blank screens.

## Payment flow rules
### Static QR
Target flow:
1. Scan / merchant detected
2. Merchant + amount on one screen
3. Slide or tap to pay
4. Processing state
5. Payment success
6. Receipt details / share

Rules:
- Merge confirm merchant and enter amount into one screen.
- Remove separate confirm payment screen.
- Success screen must show status icon, amount, merchant, payment rail, timestamp, and receipt CTA.
- Receipt screen must be UI-rich, not text-heavy.

### Dynamic QR
Target flow:
1. Scan invoice-aware QR
2. Invoice summary
3. Optional separate offer screen IF configured
4. Pay
5. Processing
6. Success
7. Receipt

Rules:
- Dynamic QR must show invoice-aware information.
- Offer / cashback flow must be separate from base dynamic QR payment.
- Never auto-merge cashback and loyalty unless configuration explicitly says combined flow.

### Loyalty / rewards / cashback
Treat as separate modules:
- Direct discount
- Cashback
- Loyalty points earn
- Loyalty points redeem

Rules:
- Do not show random rewards wallet preview unless the chosen flow requires it.
- If cashback is selected, success screen must explicitly show cashback earned.
- If direct discount is selected, payment review must show original amount, discount, final payable amount.
- If loyalty earn is selected, success screen must show points earned.
- If redemption is selected, payment review must show points used and remaining payable.

### Bill payments
Target flow:
1. Bill inbox / bill categories / due items
2. Bill details page
3. Pay CTA (preferably inline or slider-to-pay)
4. Processing
5. Success
6. Bill receipt / payment history detail

Rules:
- Bill summary and quick details must look like designed UI cards, not plain text blocks.
- Remove unnecessary confirm payment screen.
- Prefer slider-to-pay or direct pay CTA from details screen.
- “Paid bill receipts” should instead be “Payment history” or “Past payments”.
- Past payment detail pages should look like transaction detail screens.

### Agentic bill pay
Rules:
- Must feel like a polished assistant + payments interface, not a clunky chatbot.
- Use chat only where it adds value.
- Structured bill cards, confirmation chips, inline pay actions, and suggested prompts should be used.
- Avoid over-chatting. Focus on getting to payment quickly.

## Theme studio requirements
- Uploaded logo must render in app header and preview surfaces.
- Theme tokens should include at least: primary, secondary, accent, background, surface, text primary, text secondary, success, warning.
- Typography and corner radius changes should propagate consistently.
- Device preview should reflect theme updates live.

## Engineering constraints
- Use reusable screen components for headers, amount cards, merchant cards, success states, receipt sections, and action bars.
- Separate flow configuration from UI rendering.
- Avoid hardcoded mixed logic that merges flows accidentally.
- Build modular flow state machines for static QR, dynamic QR, bill pay, rewards, cashback, and agentic payments.
- Add robust fallback assets for logo rendering.
- Validate uploaded asset URL / object path before render.

## Definition of done
A flow is done only if:
- it looks polished on a phone viewport
- it has no redundant step
- it reflects the selected scenario exactly
- it has a realistic processing state
- it has a premium success screen
- it has a usable receipt / transaction detail view
- theme changes correctly propagate
- no placeholder or broken asset is visible
