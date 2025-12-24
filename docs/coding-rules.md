# AXIOM: Engineering Standards

## Type Safety
Strict TypeScript is non-negotiable. 
-   **No `any` types.**
-   **Price Safety:** Prices are `BigInt` or specialized `Money` objects, never `number` (to avoid floating point drift).
-   **Null Safety:** All optional props must have explicit fallback UIs defined in the component.

## Motion Constants
To ensure the "Viscous" feel, all animations must use the brand easing curves.

```typescript
export const ANIMATION = {
  EASE_VISCOUS: [0.23, 1, 0.32, 1], // The signature "heavy" ease
  DURATION_SLOW: 0.8,
  DURATION_INSTANT: 0.1
};
```

## Accessibility (A11y)
-   **Contrast:** "Quiet Luxury" often fails contrast. AXIOM must pass WCAG AA. Text colors are `#E5E5E5` on `#050505`, not dark grey on black.
-   **Reduced Motion:** If `prefers-reduced-motion` is detected, the "Viscous" scroll and 3D parallax are disabled instantly.