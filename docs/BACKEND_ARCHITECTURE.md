# AXIOM: Backend & Data Architecture

## Philosophy
The backend follows a **Composable Commerce** architecture. We avoid monolithic platforms (like Shopify) to maintain absolute control over the data model, specifically for our unique "Provenance" and "Material" requirements.

## The Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Commerce Engine** | **MedusaJS** | Core logic (Cart, Orders, Customers, Inventory). |
| **Database** | **PostgreSQL** | Relational data for orders and products. |
| **CMS** | **Sanity.io** | Editorial content (The Journal), rich storytelling assets. |
| **Search Engine** | **Meilisearch** | Instant, faceted search for the Archive. |
| **Cache/Queue** | **Redis** | Session management, job queues, API caching. |
| **Storage** | **AWS S3** | Raw 3D assets, high-res textures. |
| **Edge Logic** | **Cloudflare Workers** | Geo-personalization, currency detection. |

## Data Modeling (Key Schemas)

### 1. The Extended Product (Medusa Module)
Standard commerce products are insufficient. We extend the schema:

```typescript
interface AxiomProduct extends Product {
  // Provenance Data (Stored in Metadata or Custom Table)
  provenance: {
    origin_coordinates: [number, number]; // Lat/Long for Map grounding
    materials: MaterialRef[]; // Links to Material Table
    carbon_footprint_kg: number;
    artisan_id: string; // Link to CMS Artisan Profile
    blockchain_ledger_id: string; // For Digital Passport
  };
  
  // 3D Assets
  digital_assets: {
    model_glb: string; // URL
    model_usdz: string; // iOS AR QuickLook
    texture_maps: {
        diffuse: string;
        normal: string;
        roughness: string;
    }
  }
}
```

### 2. The Journal (Sanity Schema)
Content is treated as data, linked to products.

```javascript
export default {
  name: 'article',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'linkedProducts', type: 'array', of: [{ type: 'reference', to: { type: 'product' } }] },
    { name: 'narrativeBlock', type: 'array', of: [{ type: 'block' }] },
    { name: 'mood', type: 'string', options: { list: ['Obsidian', 'Chrome', 'Paper'] } }
  ]
}
```

## API Layer Strategy

### 1. Storefront API (Public)
*   **Protocol:** REST (via Medusa Client SDK).
*   **Authentication:** JWT (JSON Web Tokens).
*   **Rate Limiting:** Leaky Bucket algorithm implemented via Upstash (Redis).

### 2. Admin API (Private)
*   Used by the "Curator Dashboard".
*   Protected via Admin Session Tokens.

## Integration: The "Biometric Gate"
*   **Provider:** WebAuthn (Passkeys).
*   **Flow:**
    1.  Frontend generates a challenge.
    2.  Backend signs challenge.
    3.  User signs with TouchID/FaceID.
    4.  Backend validates signature against stored public key in PostgreSQL.
    5.  Issue "Elite Session" JWT with extended expiry (30 days).

## Inventory & Fulfillment
*   **Inventory:** Multi-warehouse logic handled by Medusa Stock Locations.
*   **Fulfillment:** Webhooks listening to `order.placed` trigger 3PL (Third Party Logistics) APIs (e.g., Shipstation).