# Asha Verma — Health & Life Insurance Guidance

A static, mobile-first website for Asha Verma, an insurance agent serving Lucknow and nearby areas, Uttar Pradesh.

No build step. No frameworks. No database. Host it on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or a plain web server).

## Pages

| URL | Purpose |
| --- | --- |
| `/` | Homepage: hero, services, why Asha, how it works, benefits, about, FAQ, contact form |
| `/health-insurance-lucknow/` | Health insurance guidance page |
| `/life-insurance-lucknow/` | Life insurance guidance page |
| `/privacy-policy/` | Privacy policy (draft placeholders marked for review) |
| `/terms-disclosures/` | Terms and disclosures (draft placeholders marked for review) |

## Run locally

From the project root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Use a local server. Opening `index.html` directly from the filesystem will not resolve the folder-style links.

## Files

```
index.html
health-insurance-lucknow/index.html
life-insurance-lucknow/index.html
privacy-policy/index.html
terms-disclosures/index.html
assets/css/style.css      # all styles, mobile-first, no dependencies
assets/js/main.js         # nav toggle, form validation, email send, WhatsApp handoff
assets/img/favicon.svg
robots.txt
sitemap.xml
```

## Contact links

| Item | Value |
| --- | --- |
| Phone | `tel:+918299012290` |
| WhatsApp | `https://wa.me/918299012290` |
| Main WhatsApp message | Prefilled enquiry text, URL-encoded |
| Health message | Prefilled health insurance text, URL-encoded |
| Life message | Prefilled life insurance text, URL-encoded |

Test every WhatsApp link on a phone and on a desktop browser before launch.

## Consultation form

The form validates the inputs, then sends the enquiry to Asha by email through [Formspree](https://formspree.io). The visitor can then send the same message on WhatsApp.

| Item | Value |
| --- | --- |
| Formspree endpoint | `https://formspree.io/f/xzedgywk` (in `index.html` and `assets/js/main.js`) |
| Receives the email | `vasha7895@gmail.com` (the address linked to the Formspree account) |
| Send timeout | 15 seconds, then an error with a WhatsApp fallback link |

- It never shows a fake success message. The success panel appears only after Formspree returns HTTP 200.
- If the email send fails, the form stays on screen, an error appears under the button, and a link offers the same message on WhatsApp.
- The website stores nothing. Formspree delivers the email; check its privacy policy.
- The visitor presses **Send on WhatsApp** as the second step, so Asha also gets the enquiry on the mobile number.
- The bar at the bottom of the screen hides while the form has focus, so it never covers the keyboard.

Fields: name, **mobile number (required)**, preferred contact method, insurance requirement (health, life, both), optional message, consent.

The form must never collect Aadhaar numbers, bank details, medical records, or passwords.

### Changing the email address or endpoint

1. Log in at [formspree.io](https://formspree.io) and open the form settings to change the destination inbox, or create a new form to get a new endpoint URL.
2. Replace `https://formspree.io/f/xzedgywk` in `index.html` (the `action` attribute) and in `assets/js/main.js` (`FORM_ENDPOINT`).
3. Send one test enquiry and confirm it arrives in the inbox. The free plan allows 50 submissions a month; upgrade if you expect more.

## Before launch checklist

1. **Confirm the site URL.** The site is set to `https://asha-verma.vercel.app`. If you rename the Vercel project or add a domain later, update it in `robots.txt`, `sitemap.xml`, and the `canonical`, Open Graph, and JSON-LD tags on every page (search for `asha-verma.vercel.app`).
2. **Verify professional details.** Add qualifications, registration number, insurer affiliations, languages, and consultation hours to the About section only after they are confirmed. The commented block is in `index.html`.
3. **Review the draft pages.** `privacy-policy/` and `terms-disclosures/` carry a visible `Draft — review before launch` notice with the open items. Remove the notice once each item is confirmed.
4. **Compliance review.** Check the site against IRDAI advertising rules, your insurer's requirements, and Indian privacy law before publishing.
5. **Test the consultation form end to end.** Fill it in on a phone and on a desktop. Confirm the enquiry arrives at `vasha7895@gmail.com` and that the WhatsApp button opens a message with the same details.
6. **Check the Formspree plan.** The free plan allows 50 submissions a month. Watch the inbox for Formspree quota warnings.
7. **Test contact links.** WhatsApp and click-to-call on iOS, Android, and desktop.
8. **Test the layout** at 320, 375, 390, 430, 768, 1024, and 1440 px. Check for horizontal scrolling, clipped text, and covered content.
9. **Accessibility pass.** Keyboard navigation, visible focus, form labels, and screen reader output.

## Deploying to Vercel

1. Go to [vercel.com/new](https://vercel.com/new), log in with GitHub or email.
2. Choose **Upload** (drag and drop) and drop this whole folder. Framework preset: **Other**. Build command and output directory: leave empty.
3. Project name: `asha-verma`. Deploy. The site is live at `https://asha-verma.vercel.app`.
4. Every later update: drag the folder again in the Vercel dashboard, or connect a GitHub repository for automatic deploys.

Note: Vercel's free **Hobby** plan is licensed for personal, non-commercial use. If that is a concern, the same folder also deploys free on **Netlify Drop** or **Cloudflare Pages**, both of which allow commercial sites.

## Google Search Console setup

1. Add the property in [Google Search Console](https://search.google.com/search-console) using the **URL prefix** method: `https://asha-verma.vercel.app/`.
2. Verify ownership with the HTML tag method. Add the tag to the `<head>` of every page, or use a domain-level DNS record so all pages are covered.
3. Submit `https://asha-verma.vercel.app/sitemap.xml` under **Sitemaps**.
4. Open **URL Inspection** and request indexing for `/`, `/health-insurance-lucknow/`, and `/life-insurance-lucknow/`.
5. Check **Pages** (indexing report) weekly. Fix any page that is excluded or has a crawl error.
6. Set up an email alert for critical issues under **Settings → Notifications**.

## Google Business Profile guidance

Eligibility depends on Google's rules for the business category and service area. Confirm the rules before you create a profile.

1. Create or claim a profile at [business.google.com](https://business.google.com/).
2. Use the business name exactly as it is used elsewhere. Do not add keyword suffixes to the name.
3. Choose the most accurate category, for example `Insurance agency`.
4. Set **Service area** to Lucknow and nearby areas. A home-based or service-area business can hide the street address if Google's rules allow it.
5. Add the phone number `+91 82990 12290` so it matches the website.
6. Add the website URL as the canonical domain.
7. Do not post fake reviews, fake photos, or an address you do not operate from. Do not post content that promises guaranteed claims or guaranteed returns.
8. Ask real customers for reviews yourself. Never buy or fabricate reviews.
9. Keep the profile's hours and contact details in sync with the website.

## Content rules used on this site

- Short sentences, familiar words, one idea per sentence.
- Active voice and direct instructions.
- The same term for the same concept.
- No claims about guaranteed savings, guaranteed claims, unlimited cover, or guaranteed returns.
- No invented qualifications, customer numbers, testimonials, or insurer affiliations.
- Every benefits section states that benefits, exclusions, limits, and conditions vary by policy.

This is controlled-English guidance, not a claim of formal ASD-STE100 compliance.

## Accessibility and performance notes

- Semantic HTML, one `h1` per page, logical heading order.
- Skip link, visible focus indicators, labelled form controls, `aria-expanded` on the menu.
- FAQ uses native `<details>` elements, so it works without JavaScript.
- CSS and JS are small and unminified for review; minify them at deploy time if your host does not.
- Inter loads with `preconnect` and `display=swap`; a system font stack is the fallback, so text stays readable if the font request fails.
- `prefers-reduced-motion` disables transitions and smooth scrolling.
