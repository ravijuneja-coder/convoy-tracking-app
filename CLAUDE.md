# Project Rules for Claude

## Source of Truth

`designSystem.md` and the connected Figma file (`DesignSystem-June`) are the source of truth for all UI decisions.

Before making any UI changes:
1. Read `designSystem.md` in full.
2. Follow all design tokens, component rules, and accessibility guidelines defined there.

---

## Design System Compliance

**Always:**
- Replace hardcoded colors with design system tokens (`Surface/Primary`, `color/text/primary`, etc.)
- Replace hardcoded spacing with design system spacing tokens
- Replace hardcoded typography with named text styles (`text/text-md/regular`, `Button-md`, etc.)
- Follow the 4-layer token chain: `component` > `mapped` > `alias` > `global`

**Never:**
- Hardcode hex color values
- Hardcode font sizes, weights, or line-heights
- Hardcode spacing/padding pixel values
- Create custom visual styles not defined in the design system
- Use `global/*` or `Alias/*` tokens directly in UI — always go through `mapped/*` or `component/*`

---

## Existing Codebase

This is an existing application. When updating UI:
- Preserve all existing functionality
- Preserve business logic, API integrations, routing, and state management
- Only update styling and UI structure when required by the task

---

## Component Usage

Before creating a new component:
1. Check `designSystem.md` section 6 (Components & Variants) for an existing equivalent
2. Reuse existing design system components — never recreate them locally
3. Only override exposed component properties (Label text, Boolean toggles) — do not detach components

---

## Color Migration

When hardcoded colors are found, map them to the closest design system token and document which token was chosen. Reference:
- `Surface/Primary` — primary brand surface
- `color/text/primary` — body and heading text
- `color/background/surface` — page/card background
- `color/icon/default` — default icon color
- `color/background/action/primary` — primary button background
- `Input/Surface/Default` — input field background

---

## Accessibility

Always:
- Maintain WCAG AA contrast (4.5:1 body text, 3:1 large text)
- Preserve focus ring visibility — never set `outline: none` without a replacement
- Preserve keyboard navigation and tab order
- Preserve all `aria-*` labels, `role` attributes, and `aria-describedby` associations
- Never convey state through color alone — pair with icon or text

---

## Output Requirements

For every UI change, provide:
1. What changed and why
2. List of affected files
3. Design system tokens used (by name)
4. Confirmation that functionality is unchanged
5. Any accessibility considerations
