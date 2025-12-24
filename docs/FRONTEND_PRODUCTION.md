# AXIOM: Frontend Production Standards

## Architecture: Next.js (App Router)

We migrate from Vite SPA to Next.js to leverage **React Server Components (RSC)**.

### Directory Structure
```
/src
  /app
    /(shop)
      /collection
      /product/[slug]    <- SSR: Fetches Product & Provenance Data
    /(journal)
      /journal/[slug]    <- ISR: Revalidates every hour
    /api                 <- Proxy routes for Auth/Payment
  /components
    /canvas              <- R3F Components (Client Side Only)
    /ui                  <- Shared UI Library
  /lib
    /medusa              <- Medusa SDK client
    /tracking            <- Analytics
```

## 3D Engineering (The Atelier)

The `TheAtelier` and `ProductStage` components require optimization to prevent Large Contentful Paint (LCP) penalties.

1.  **Asset Pipeline:**
    *   Models must be converted to `.glb` + **Draco compression**.
    *   Textures: Basis Universal (`.ktx2`) format for GPU efficiency.
2.  **Loading Strategy:**
    *   **Tier 1 (Mobile):** Load 2D High-Res Image sequence (36 frames) on scroll.
    *   **Tier 2 (Desktop):** Load real-time WebGL canvas.
    *   **Hydration:** Use `next/dynamic` with `ssr: false` for the Canvas component.

```typescript
const TheAtelier = dynamic(() => import('@/components/canvas/TheAtelier'), {
  ssr: false,
  loading: () => <AtelierPlaceholder />
})
```

## State Management (Zustand)

While Next.js handles server state, **Zustand** remains critical for:
1.  **Viscous Physics:** Storing velocity, skew, and scroll position.
2.  **UI State:** Vault (Cart) visibility, Auth modals.
3.  **Cross-Component Comms:** Syncing DOM scroll with WebGL camera rotation.

## Search Engine Optimization (SEO)

### 1. Metadata
Dynamic generation of meta tags based on the "Quiet Luxury" persona.
*   Title: `AXIOM | [Product Name] - Edition [Year]`
*   Description: Provenance-focused descriptions, not sales copy.

### 2. Structured Data (JSON-LD)
Inject `Product` and `MerchantReturnPolicy` schemas into the `<head>`.

```typescript
// app/product/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  return {
    title: `AXIOM | ${product.title}`,
    openGraph: { images: [product.thumbnail] }
  }
}
```

## Styling & Animation
*   **Tailwind CSS:** For layout and typography.
*   **Framer Motion:** For UI transitions.
*   **GSAP:** (Optional) If Framer Motion performance drops on complex 3D timelines, switch timeline logic to GSAP.

## Accessibility (A11y)
*   **Reduced Motion:** If `prefers-reduced-motion` is true:
    *   Disable `skewX` on scroll.
    *   Disable auto-rotate in 3D.
    *   Switch "Viscous" scroll to native scrolling.
*   **Screen Readers:** Ensure 3D Canvas has a descriptive `aria-label` or fallback text description.