# AXIOM: Interaction Workflows

## The Magnetic Checkout
The checkout is not a form; it is a cinematic sequence.
1.  **Trigger:** User holds "Acquire" (Long press).
2.  **Transition:** The UI zooms *into* the product material (texture detail).
3.  **Overlay:** The payment UI (Apple Pay/WebAuthn) manifests as a "head-up display" over the texture.
4.  **Completion:** A haptic ripple confirms ownership.

## 3D Orchestration
To maintain LCP (Largest Contentful Paint) scores while serving WebGL:
1.  **Hydration Strategy:** Load a high-res distinct "Hero Image" first.
2.  **Lazy Canvas:** The R3F (React Three Fiber) canvas hydrates in the background.
3.  **Swap:** Once the model is ready, we cross-fade from Image to Canvas.

## Authentication: The Elite Tier
For "Black Card" users:
-   **Method:** WebAuthn (Biometrics).
-   **Flow:** No passwords. No magic links. One thumbprint authenticates the session for 30 days.