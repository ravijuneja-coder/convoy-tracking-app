# Design System — Source of Truth

> **Source:** Figma file `DesignSystem-June` (`hfE3Rt4lFE5ol5lqBYHjRT`)  
> **Last synced:** 2026-06-15  
> **Library key:** `lk-1387e77228ae0d9adf7e36f0e95fe98278bd8a865e430b5c32b9965e6f603294f5fde57b53681ad30586ab10eeec95d2271c6d9d7003371f5d72e5f201760a60`

---

## Table of Contents

1. [Design Token Architecture](#1-design-token-architecture)
2. [Color Tokens](#2-color-tokens)
3. [Typography Tokens & Text Styles](#3-typography-tokens--text-styles)
4. [Spacing & Layout Tokens](#4-spacing--layout-tokens)
5. [Component Tokens](#5-component-tokens)
6. [Components & Variants](#6-components--variants)
7. [Icon System](#7-icon-system)
8. [Design Patterns](#8-design-patterns)
9. [Accessibility Guidelines](#9-accessibility-guidelines)
10. [Usage Rules](#10-usage-rules)

---

## 1. Design Token Architecture

The design system uses a **4-layer token chain**. Always reference the most specific layer available; never hardcode raw values.

```
global  →  alias  →  mapped  →  component
```

| Layer | Collection Name | Purpose |
|---|---|---|
| `global` | `global` | Raw primitive values (hex colors, px sizes) — never use directly in UI |
| `alias` | `Alias` | Semantic aliases grouping globals by intent (e.g. `Color/Info/50`) |
| `mapped` | `Mapped` | Role-based tokens consumed by the UI (e.g. `Surface/Primary`, `Icon/Default`) |
| `component` | `Components` | Component-scoped tokens (e.g. `Button/Primary/Surface`) |
| `responsive` | `Responsive` | Viewport-aware float tokens for padding/spacing |

**Rule:** When building a component, bind to `component/*` tokens first. For one-off surfaces, use `mapped/*`. Never bind directly to `global/*` or `Alias/*` values.

---

## 2. Color Tokens

### 2.1 Global Palette (Primitives)

These are raw color definitions. Do not use in UI — reference through mapped tokens.

| Token | Ramp |
|---|---|
| `color/white` | Pure white |
| `color/black` | Pure black |
| `color/red/50–900` | Red scale: 50, 100, 200, 300, 400, 500, 700, 800, 900 |
| `color/blue/50` | Blue (lightest) |
| `color/info/50` (alias) | Alias for info blue tint |

### 2.2 Alias Color Tokens

Defined in the `Alias` variable collection. Maps primitives to semantic intent.

| Token Path | Intent |
|---|---|
| `Color/Info/50` | Info background tint |
| `Color/Info/100` | Info light |
| `Color/Info/700` | Info strong |
| `Color/Info/900` | Info inverse / dark |

### 2.3 Mapped Color Tokens (Role-Based)

These are the primary tokens to use in UI design. Defined in the `Mapped` variable collection.

#### Surface
| Token | Usage |
|---|---|
| `Surface/Primary` | Primary action surface (brand color background) |
| `Surface/Primary-hover` | Hovered state of primary surface |

#### Icon
| Token | Usage |
|---|---|
| `Icon/Default` | Default icon color |
| `Icon/Info` | Informational icon |
| `Icon/Error` | Error/danger icon |
| `Icon/Warning` | Warning icon |
| `Icon/Success` | Success/confirmation icon |
| `Icon/Disabled` | Disabled icon — low contrast, non-interactive |

#### Text (via `mapped` collection)
| Token | Usage |
|---|---|
| `color/text/primary` | Primary body and heading text |
| `color/text/value-on-input` | Value text inside inputs |
| `color/focus` | Focus ring color |

#### Background
| Token | Usage |
|---|---|
| `color/background/surface` | Page/card surface background |
| `color/background/action/primary` | Primary action background (default) |
| `color/background/action/primary-hover` | Primary action background (hover) |
| `color/background/action/primary-active` | Primary action background (active/pressed) |

#### Icon (via `mapped` collection)
| Token | Usage |
|---|---|
| `color/icon/default` | Default icon |
| `color/icon/action` | Actionable icon (clickable) |
| `color/icon/info` | Info icon |
| `color/icon/error` | Error icon |
| `color/icon/success` | Success icon |
| `color/icon/white` | Icon on dark/colored surface |

### 2.4 Gradient Styles

| Style Name | Usage |
|---|---|
| `Gradients/Colors Of Sky` | Decorative sky-themed gradient |
| `Gradients/Socialive` | Social/vibrant gradient (use for social CTAs only) |

---

## 3. Typography Tokens & Text Styles

### 3.1 Text Styles (DesignSystem-June)

Named styles defined in the `text/` hierarchy. Apply these to text layers — do not manually set font values.

#### Body Text

| Style | Scale | Weights Available |
|---|---|---|
| `text/text-xs/*` | Extra small | `regular`, `medium`, `semibold`, `bold` |
| `text/text-sm/*` | Small | `regular`, `medium`, `semibold`, `bold` |
| `text/text-md/*` | Medium (base body) | `regular`, `medium`, `semibold`, `bold` |

#### Lead Text

| Style | Scale | Weights Available |
|---|---|---|
| `lead-text/lead-text-xs/*` | Extra small lead | `bold` |
| `lead-text/lead-text-md/*` | Medium lead | `bold` |

#### Table Styles

| Style | Usage |
|---|---|
| `Table/head` | Table column headers |
| `Table/body` | Table row data |
| `Table/body/action` | Actionable text within table cells (links, buttons) |

### 3.2 Button Text Styles

Apply button-specific text styles to all button labels. Never use body text styles inside buttons.

| Style | Usage |
|---|---|
| `Button-sm` | Small buttons |
| `Button-md` | Medium buttons (default) |
| `Button-lg` | Large buttons |

### 3.3 Input Text Styles

| Style | Usage |
|---|---|
| `Input Label` | All field label text |

### 3.4 Font Size Tokens (global floats)

| Token | Size |
|---|---|
| `font/size/xs` | Extra small (~12px) |
| `font/size/sm` | Small (~14px) |
| `font/size/md` | Medium / base (~16px) |
| `font/size/lg` | Large (~18px) |
| `font/size/xl` | Extra large (~20px) |
| `font/size/4xl` | 4× extra large (display) |

---

## 4. Spacing & Layout Tokens

### 4.1 Responsive Padding Tokens

Defined in the `Responsive` variable collection. These adapt to viewport/context.

| Token | Usage |
|---|---|
| `Padding/Input-x` | Horizontal padding inside text inputs |
| `Padding/Input-y` | Vertical padding inside text inputs |

### 4.2 Usage Pattern

Spacing should be applied via component tokens wherever possible. For layout gaps between components, use global spacing scale tokens. Do not use hardcoded pixel values.

---

## 5. Component Tokens

### 5.1 Button Tokens

| Token | Type | Usage |
|---|---|---|
| `Button/p-x` | FLOAT | Horizontal padding |
| `Button/p-y` | FLOAT | Vertical padding |
| `Button/Radius` | FLOAT | Border radius |
| `Button/Primary/Surface` | COLOR | Filled primary background (default) |
| `Button/Primary/Surface-hover` | COLOR | Filled primary background (hover) |
| `Button/Primary/Border` | COLOR | Primary button border |
| `Button/Primary/Text` | COLOR | Primary button label color |
| `Button/Primary/Icon` | COLOR | Primary button icon color |
| `Button/Outline/surface` | COLOR | Outline button background |
| `Button/Outline/border` | COLOR | Outline button border |
| `Button/Outline/text` | COLOR | Outline button label color |
| `Button/Outline/Icon` | COLOR | Outline button icon color |

### 5.2 Input Tokens

| Token | Type | Usage |
|---|---|---|
| `Input/Surface/Default` | COLOR | Input background |
| `Input/Border/Color/Hover` | COLOR | Border color on hover |
| `Input/Border/Radius/Radius` | FLOAT | Input corner radius |
| `Input/Text/Default` | COLOR | Entered value text |
| `Input/Text/Placeholder` | COLOR | Placeholder text |
| `Input/Text/Hint` | COLOR | Hint/helper text below input |
| `Input/Label/Heading` | COLOR | Field label text |
| `Input/Label/Description` | COLOR | Field sub-label / description text |
| `Input/Icon/Default` | COLOR | Inline icon color |

---

## 6. Components & Variants

### 6.1 Button

**Component key:** `2548baa5c8ba3a890ad67cd9af1d5fe11f5a9478`  
**Page:** `Button` (node `722:8367`)

#### Variant Properties

| Property | Values |
|---|---|
| `Style` | `Filled`, `Outline` |
| `Color` | `Primary` |
| `State` | `Default`, `Hover`, `Focus`, `Disabled` |
| `Only Icon` | `True`, `False` |

#### Component Properties

| Property | Type | Default |
|---|---|---|
| Label | Text | `"Button"` |
| Left Icon | Boolean | `false` |
| Right Icon | Boolean | `false` |
| Icon Only | Boolean | `false` |

#### Token Bindings

```
bg        → Button/Primary/Surface          (default)
           Button/Primary/Surface-hover     (hover)
text      → Button/Primary/Text
border    → Button/Primary/Border
icon      → Button/Primary/Icon
radius    → Button/Radius
padding-x → Button/p-x
padding-y → Button/p-y
gap       → spacing/2
disabled-bg   → color/surface/disabled
disabled-text → color/text/disabled
focus-ring    → outer stroke, color/Primary/300
```

#### Sizes (icon-only variants)

| Variant | Width | Height |
|---|---|---|
| With label | 137px | 56px |
| Icon Only | 80px | 52px |

#### Usage Rules

- Use **Filled/Primary** for primary calls-to-action (one per view).
- Use **Outline/Primary** for secondary actions.
- Never place two Filled/Primary buttons side-by-side at the same hierarchy level.
- Disabled buttons must have `opacity` reduced and `cursor: not-allowed` — do not change the color token; let the `Disabled` state token handle it.
- Focus ring must always be visible for keyboard accessibility.

---

### 6.2 Button Social

**Component key:** `adcbcfaf4e940c2572fb97d9dff5660c62fcff6d`  
**Page:** `Social & Payment Button` (node `895:35143`)

Used for social login/authentication flows (e.g. Google, Apple, WeChat). Treat as a variant of the base Button but with social branding constraints.

---

### 6.3 Text Input

**Component set:** `Text Input`  
**Page:** `Text Input` (node `954:33684`)

#### States

| State | Description |
|---|---|
| `Empty` | No value, default border |
| `Hovered` | Cursor over field, border changes to `Input/Border/Color/Hover` |
| `Focused` | Active input, focus ring applied |
| `Typing` | Value being entered |
| `Filled` | Has a value, not focused |
| `Disabled` | Non-interactive, reduced opacity |
| `Disabled - Filled` | Has value but non-interactive |
| `Error` | Validation failed — red border + error message |
| `Error - Filled` | Has value + validation error |

#### Input Add-on Types

Available as sub-components (`_Input Add-on`) per size:

| Type | Sizes |
|---|---|
| `Icon` | LG, MD, SM |
| `Text` | LG, MD, SM |
| `Time Button` | LG, MD, SM |
| `Calendar Button` | LG, MD, SM |
| `Chevron down` | LG, MD, SM |
| `Stepper` | LG, MD, SM |
| `Flag` | LG, MD, SM |
| `Avatar` | LG, MD, SM |
| `Payment` | LG, MD, SM |
| `Search` | LG, MD, SM |

#### Sub-components

| Component | Sizes | Usage |
|---|---|---|
| `Input Label` | `MD`, `SM`, `Size3` | Field label above input |
| `Hint` | `MD`, `SM` | Helper text below input |
| `Error Message` | `MD`, `SM` | Error text below input |

#### Token Bindings

```
bg          → Input/Surface/Default
border      → Input/Border/Color/Hover (on hover)
border-radius → Input/Border/Radius/Radius
text-value  → Input/Text/Default
placeholder → Input/Text/Placeholder
hint-text   → Input/Text/Hint
label       → Input/Label/Heading
description → Input/Label/Description
icon        → Input/Icon/Default
error-text  → color/text/error
```

#### Also Available

- **Text Input Floating Label** — label animates from placeholder position to above field on focus. Use in dense forms where vertical space is limited.
- **Select Floating Label** (`ded980c000111c0d1f70042f2719380f5b137f68`) — same pattern for select/dropdown fields.

---

### 6.4 Divider

**Component set:** `Divider`  
**Page:** `Divider` (node `1161:62567`)

#### Variant Properties

| Property | Values |
|---|---|
| `Direction` | `Horizontal`, `Vertical` |
| `Show Text` | `None`, `Center`, `Left`, `Right`, `Top`, `Bottom` |
| `Top Padding` | `0`, `16`, `32` |
| `Bottom Padding` | `0`, `16`, `32` |

#### Sizes

| Direction | Dimension |
|---|---|
| Horizontal (no text) | 320×1px |
| Horizontal (with text) | 320×20px |
| Vertical | 1×320px |

#### Also Available

- **Dropmenu Divider** (`5ffe78cc98dd535a3b967d538041a02791e124c0`) — thinner, for dropdown/menu separators.

#### Usage Rules

- Use `Top Padding=16` / `Bottom Padding=16` as the default for section dividers.
- Use `Show Text=None` unless a contextual label (e.g. "or", section name) is required.
- Vertical dividers are for inline separators (e.g. toolbar groups, split panels).

---

### 6.5 Tooltip

**Component set:** `Tooltip`  
**Page:** `Tooltip` (node `1161:72687`)  
**Component key:** `beb96f012625aaa536bc51d65557670debbaa578`

#### Variant Properties

| Property | Values |
|---|---|
| `Arrow` | `None`, `Top`, `Bottom`, `Left`, `Right` |
| `Align` | `None`, `Top`, `Center`, `Bottom`, `Left`, `Right` |
| `Color` | `Dark`, `White` |
| `Fixed` | `True`, `False` |

#### Component Properties

| Property | Type | Description |
|---|---|---|
| Label | Text | Tooltip text content |
| Show Arrow | Boolean | Toggle directional arrow |

#### Token Chain

```
bg     → global/grey-900 → alias/neutral-900 → mapped/surface-inverse → component/tooltip/bg
text   → global/white → mapped/text-inverse → component/tooltip/text/color
arrow  → aliases tooltip/bg (always matches)
radius → global/4px → radius/sm → component/tooltip/radius
px/py  → global/6–8px → spacing/xs-sm → component/tooltip/padding/*
font   → global/12px → font/size/xs → component/tooltip/font/size
```

#### Placement Variants (from Icon with Tooltip sub-component)

`Top - None`, `Top - Center`, `Top - Left`, `Top - Right`,  
`Bottom - None`, `Bottom - Center`, `Bottom - Left`, `Bottom - Right`,  
`Left - Center`, `Right - Center`

#### Usage Rules

- Default to `Color=Dark` (`bg = grey-900`). Use `White` only on dark surfaces.
- `Fixed=True` expands width to a multiline-ready 280px container; use for longer labels.
- `Fixed=False` is auto-width for short single-line labels.
- Never use tooltips to convey critical information — they are invisible to keyboard/screen-reader users unless triggered by focus. Pair with `aria-describedby`.

---

### 6.6 Additional Components (Library Inventory)

The following components exist in the design system library and should be used from source — do not recreate them.

| Component | Key | Description |
|---|---|---|
| `Modal Footer` | `49301f6fd758fb35bca474197e62f1d809f1abfd` | Footer actions for modals |
| `Drawer Footer` | `f63a98bea48ed47158e8de44676ad7d38f9afa37` | Footer actions for drawers |
| `Popover Footer` | `5c9ad02aa9e62f64abfeecd638e477543a344981` | Footer actions for popovers |
| `Form Section Header` | `c58cf68b32872148fc1ca71e2309b4272ce2e9b3` | Section heading in forms |
| `Form Section Label` | `df8ce1cd26494199c88db4b52335a3682044f7da` | Label row within form sections |
| `Table Cell` | `548962e007189829f5802259cf453d18be9b0e57` | Individual table cells |
| `Radio` | `07dd68123f6e193ddab7f6cbbe908d988e1c94a0` | Radio button component |
| `Paragpraph` | `1c898e85d0f5d006566cb664601950fc0b381c91` | Paragraph text with spacing |
| `Select Floating Label` | `ded980c000111c0d1f70042f2719380f5b137f68` | Dropdown with floating label |
| `Measure Line` | `3f4941c91cd70d014f33a1eab93bc3d9d18d563e` | Annotation spacing line |
| `wechat` | `23b605a0f9b91c9a7e5bf38f9a699718757494fc` | WeChat social icon/button |
| `text-solid` | `35efccd839ea45d7cdcd72d1946e1b978c53f07e` | Rich text / WYSIWYG editor |
| `Dropmenu Divider` | `5ffe78cc98dd535a3b967d538041a02791e124c0` | Menu separator |

---

## 7. Icon System

**Library name:** `Icon`  
**Library key:** `lk-a3f90455bda0483fc04d1d619599c8002dffb44035889029622909df46769886db2f75c13344c65dffe405ecf557ec1aa8b2e68e4a9530afb4eb0d242cdd14e4`

### Icon Styles

| Style | Key | Usage |
|---|---|---|
| `fill_icon` | `48e09704ccb2a760a7920eba45f344df64f86e85` | Filled icon style |
| `line_icon` | `c263dd72dccf97d7f98b7520a8794980b77b2eeb` | Line/outline icon style |

### Icon Naming Convention

Icons follow a semantic naming pattern:

```
{On/Regular/Outline}_{descriptor}[_{variant}]
```

Examples:
- `On_button` — button icon (line)
- `On_button_fill` — button icon (filled)
- `On_button_light` — button icon (light weight)
- `On_button_duotone` — button icon (duotone)
- `On_button_duotone_line` — button icon (duotone line)

### Icon Pages in Design File

| Page | Node ID | Contains |
|---|---|---|
| `Icons` | `857:23516` | Primary icon set |
| `Other Icons` | `41858:124945` | Extended/supplementary icons |

### Icon Usage Rules

- Match icon style to context: use `fill` for active/selected states, `line` for inactive.
- Use `color/icon/*` mapped tokens to color icons — never hardcode hex on icon layers.
- Icons embedded in inputs must use `Input/Icon/Default` token.
- Icons in buttons inherit from `Button/Primary/Icon` or `Button/Outline/Icon`.

---

## 8. Design Patterns

### 8.1 Form Layout

```
┌─────────────────────────────┐
│  [Form Section Header]      │  ← component/Form Section Header
│                             │
│  [Input Label / Size=MD]    │  ← Input/Label/Heading
│  [Text Input / State=Empty] │  ← 320px wide, MD size
│  [Hint / Size=MD]           │  ← Input/Text/Hint
│                             │
│  [Divider / Top=16 Bot=16]  │  ← section separator
│                             │
│  [Modal Footer]             │  ← Cancel | Confirm
└─────────────────────────────┘
```

- Inputs are 320px wide at default.
- Stack inputs vertically with 24px gap between fields.
- Place field labels above inputs (not inline) using the `Input Label` component.
- Error messages replace hint text — never show both simultaneously.

### 8.2 Button Hierarchy

```
Primary action  →  Filled / Primary / Default
Secondary       →  Outline / Primary / Default
Destructive     →  (use Danger type from extended library if available)
Icon-only       →  Only Icon=True variant, with Tooltip on hover
```

### 8.3 Tooltip Trigger Pattern

Pair `Icon with Tooltip` composite component for icon buttons that lack visible labels:

```
[Icon Button] + [Tooltip / Position=Top-Center / Fixed=False]
```

Show tooltip on `hover` and `focus`. Hide on `blur` and `Escape` key.

### 8.4 State Communication

| Situation | Component State | Token Used |
|---|---|---|
| Invalid field | Error / Error-Filled | `color/text/error`, `color/icon/error` |
| Incomplete/neutral | Empty / Hovered / Focused | `Input/Border/Color/Hover` |
| Success validation | (use success helper text) | `color/text/success`, `color/icon/success` |
| Non-interactive | Disabled / Disabled-Filled | `Icon/Disabled`, `color/text/disabled` |

### 8.5 Social / Payment Buttons

Use `Button Social` component for authentication flows (not the generic `Button`). Social buttons carry brand-specific colors and icons that must not be customized.

---

## 9. Accessibility Guidelines

### Color & Contrast
- All text tokens (`color/text/primary`, `Input/Text/Default`, etc.) are configured to meet **WCAG AA** contrast minimums (4.5:1 for body, 3:1 for large text) against their respective surface tokens.
- `Icon/Disabled` and `color/text/disabled` are intentionally low-contrast — do not use for any interactive or informational element.
- Do not rely on color alone to convey state; always pair with an icon or text label.

### Focus Management
- Every interactive component must show a visible focus ring. The token `color/focus` or `component/button/focus` drives this — do not suppress it.
- Tooltip variants must be triggerable by both mouse hover and keyboard focus.

### Interactive States
- All interactive components have `Default`, `Hover`, `Focus`, `Active`, and `Disabled` states. Implement all five — omitting any state creates accessibility gaps.
- Disabled controls must be truly inert (`aria-disabled="true"`, no tab stop) unless the design requires focus for discoverability.

### Semantic Structure
- Use `Input Label` (component) — not floating placeholder text — as the accessible label for inputs. Labels must remain visible and be programmatically associated (`for`/`aria-labelledby`).
- Error messages and hint text below inputs must use `aria-describedby` to associate with the field.
- Icons used as interactive elements must carry `aria-label` or be paired with visible text.

### Tooltips
- Tooltips are supplementary. Do not place essential information only in a tooltip.
- Trigger tooltips on both `hover` and `focus`. Dismiss on `Escape` and `blur`.
- Use `role="tooltip"` and `aria-describedby` to wire tooltip content to its trigger.

---

## 10. Usage Rules

### Token Usage
1. **Always** use design tokens — never hardcode hex values, pixel sizes, or font weights directly in components.
2. Reference the most specific layer: `component` > `mapped` > `alias` > `global`.
3. When a `component` token does not exist for a new pattern, define a new `mapped` token and have it alias a `global` — do not point `component` tokens at `global` directly.

### Component Usage
1. **Always import** components from the `DesignSystem-June` library — do not recreate them locally.
2. Only override `component properties` (Label text, Boolean toggles) exposed in the right panel. Do not detach components to change colors or layout.
3. To add a new variant, propose it in the design system file first before building it independently.

### Text Styles
1. Apply named text styles (e.g. `text/text-md/regular`) — do not manually set font, size, weight, or line-height.
2. For buttons, exclusively use `Button-sm`, `Button-md`, or `Button-lg`.
3. For inputs, use `Input Label` style on field labels.

### States
1. All interactive components must implement all defined states (Default, Hover, Focus, Active, Disabled).
2. `Disabled` states use their own tokens — do not reduce opacity manually.
3. Error and success states are communicated through both color and icon — never color alone.

### Spacing
1. Use spacing tokens for all gaps and padding within components.
2. Responsive padding tokens (`Padding/Input-x`, `Padding/Input-y`) must be used for input fields — not hardcoded values.

### Do's and Don'ts

| Do | Don't |
|---|---|
| Use `Filled/Primary` for the single primary action per view | Use multiple Filled/Primary buttons at the same level |
| Show focus rings on all interactive elements | Set `outline: none` without a custom focus indicator |
| Use `Input Label` component for field labels | Use placeholder text as the only label |
| Use `Error Message` component for validation | Use color alone to indicate errors |
| Trigger tooltips on focus as well as hover | Use hover-only tooltips for essential information |
| Reference tokens from `component` layer | Hardcode color values or use `global` tokens in UI |
| Use icon styles `fill`/`line` from the Icon library | Create custom icon SVGs that diverge from the system |

---

*This file is generated from the Figma source. Re-sync when the Figma library is updated.*
