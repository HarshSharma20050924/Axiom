# AXIOM: System Architecture

## Topology
The system operates on a **Headless, Event-Driven** architecture designed for edge performance and absolute decoupling of presentation from logic.

### The Flow
`[Client Storefront]` <-> `[Edge Middleware]` <-> `[Commerce Engine]`

1.  **Storefront (The Glass):** A React/Next.js application. It holds no business logic, only display logic and animation state.
2.  **Edge Middleware (The Brain):** Handles personalization, A/B variant injection, and auth routing at the network edge (Cloudflare Workers).
3.  **Commerce Engine (The Vault):** Headless backend (MedusaJS) managing inventory, orders, and the PIM (Product Information Management).

## The Spatial PDP
The Product Detail Page is not a document; it is a **Scene**.
-   **State:** The URL governs the camera position of the 3D scene, not just the content loaded.
-   **Transition:** Navigating from "Collection" to "Product" is a continuous camera move, not a page reload.

## Global State
We utilize **Zustand** for state management due to its transient update capabilities, essential for high-frequency animation loops (e.g., synchronizing scroll position with 3D model rotation) without causing React re-renders.