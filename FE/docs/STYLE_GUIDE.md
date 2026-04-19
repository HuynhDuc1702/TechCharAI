# TechChar AI - Frontend Style Guide

This document outlines the HTML and CSS styling rules and guidelines for the TechChar AI frontend (inspired by Character.ai). Following these rules ensures a unified, maintainable, and visually consistent codebase.

## 1. Core Aesthetics & Identity
TechChar AI uses a dark-themed, modern, and sleek aesthetic with subtle glassmorphism and purple as the primary accent color. The interface should feel immersive and conversational.

### Color Palette (CSS Variables)
To ensure global consistency across dark mode, we manage all core colors using CSS variables in `src/index.css` (or a dedicated `variables.css`). 

```css
:root {
  /* Backgrounds */
  --bg-main: #0a0a12;
  --bg-card: #13131f;
  --bg-glass: rgba(10, 10, 18, 0.85);

  /* Text & Typography */
  --text-primary: #f1f1f1;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;

  /* Accents */
  --accent-primary: #a855f7;
  --accent-hover: #c084fc;
  --accent-gradient: linear-gradient(135deg, #7c3aed, #a855f7);

  /* Status / Feedback */
  --error: #f87171;
  --error-bg: rgba(248, 113, 113, 0.08);

  /* Borders & UI Constraints */
  --border-light: rgba(255, 255, 255, 0.07);
}
```

## 2. CSS Architecture & Naming Conventions

We utilize pure CSS with a **BEM (Block Element Modifier)** influenced naming convention to keep styles modular and scoped.

**Rule: Components handle their own styles**
- Name CSS files identically to the `.tsx` component (e.g., `Navbar.tsx` maps to `Navbar.css`).
- Prevent global namespace pollution by wrapping all rules inside a block class unique to the component.

**BEM Format Examples:**
- **Block:** `.auth-card` (The main container component)
- **Element:** `.auth-card__header` (A child element strictly dependent on the `.auth-card` block)
- **Modifier:** `.auth-card__header--highlighted` (A variant/state of the element or block)

```css
/* Good: Scoped & Explicit */
.button { ... }
.button__icon { ... }
.button--primary { ... }

/* Bad: Overly generic, impacts global scope */
.header h1 { ... }
```

## 3. UI and Structural Guidelines

### Typography
- **Primary Font:** Inter (`'Inter', system-ui, sans-serif`)
- Headers should use crisp geometric weights (`font-weight: 700` or `800`).
- Text tracking (`letter-spacing`) on main titles should be tightly condensed (e.g., `-0.5px`).

### Layout & Spacing
- Use **Flexbox** as the primary layout tool.
- Use `gap` over margins where possible for cleaner structural grids.
- Padding on clickable buttons/elements should be generous to allow touch accessibility.

### Glassmorphism & Interactions
We emphasize modern depth and engagement through:
1. **Interactive Feedback:** Links and buttons must have transition styles.
   ```css
   .nav-item { transition: color 0.2s ease, background 0.2s ease; }
   ```
2. **Subtle Outlines/Borders:** Dropdown menus, modals, and distinct blocks should use semi-transparent white borders (e.g., `border: 1px solid rgba(255, 255, 255, 0.08)`).
3. **Backdrop Blur:** Use backdrop-filter blur for sticky/overlay elements.
   ```css
   .sticky-nav {
     backdrop-filter: blur(12px);
     background: var(--bg-glass);
   }
   ```

## 4. HTML Guidelines (React TSX)

- **Semantic HTML:** Always prefer semantic tags (`<main>`, `<nav>`, `<aside>`, `<header>`) instead of nested `<div>`s for better accessibility and readability.
- **ClassNames:** Avoid using inline `style={{ ... }}` objects in React. Keep styling purely within the component's CSS.
- **ID Usage:** Use IDs to link ARIA tags (like inputs with labels) or for global singletons (e.g., `#root`). Do not use IDs for CSS styling (e.g., `#login-form` shouldn't be referenced in CSS, use `.auth-form` instead).

## 5. Mobile Responsiveness

- All styles should be mobile-compatible. Do not assume desktop width.
- Use explicit media queries targeting standard breakpoints:
  ```css
  /* Example breakpoint for tablets / mobile */
  @media (max-width: 768px) {
    .auth-card {
      padding: 1.5rem;
      border-radius: 12px;
    }
  }
  ```

## 6. Development Workflow Tips

1. Whenever you define a solid new purple or shade of gray, cross-check to make sure it's not already in `variables.css`.
2. When creating Character-AI specific modules (like `ChatBubble`, `PersonaCard`), keep their border-radii soft (around `10px` to `16px`) to make conversations visually relaxing.
3. Clean dead CSS rules. If a `.tsx` classname is deleted, remove it from the corresponding `.css` right away.
