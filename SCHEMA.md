# LuxeLens AI: Database Schema (Enterprise)

For a production enterprise environment, we use **PostgreSQL** (via Supabase) to ensure ACID compliance and high-performance querying.

## 1. `brands` Table
Stores the competitive landscape.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `name` | VARCHAR | Brand name (e.g., "Gucci") |
| `segment` | ENUM | Luxury, Ultra-Luxury, Bridge |
| `base_url` | TEXT | Official storefront URL |
| `social_config` | JSONB | Map of social handles (Instagram, TikTok) |

## 2. `products` Table
Active catalog monitoring.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `brand_id` | UUID | FK -> `brands.id` |
| `sku` | VARCHAR | Unique product identifier |
| `name` | VARCHAR | Product name |
| `category` | VARCHAR | e.g., "Leather Goods", "Ready-to-wear" |
| `image_url` | TEXT | CDN link to product image |
| `current_price` | DECIMAL | Last scraped price |
| `currency` | VARCHAR | ISO code (USD, EUR, etc.) |
| `inventory_status` | ENUM | In Stock, Low Stock, Sold Out |
| `last_scraped` | TIMESTAMP | Last update time |

## 3. `price_history` Table
For trend analysis and ROI calculation.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `product_id` | UUID | FK -> `products.id` |
| `price` | DECIMAL | Price at that point in time |
| `recorded_at` | TIMESTAMP | DEFAULT NOW() |

## 4. `social_signals` Table
Unstructured intelligence data.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `brand_id` | UUID | FK -> `brands.id` |
| `platform` | VARCHAR | IG, TikTok, etc. |
| `engagement_score` | FLOAT | Calculated velocity (likes/shares per hour) |
| `visual_embedding` | VECTOR(1536) | For visual similarity matching (pgvector) |
| `detected_trend` | TEXT | AI-labeled trend (e.g., "Pastel Aesthetic") |

## 5. `intelligence_alerts` Table
The "Actionable" layer.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `severity` | ENUM | Low, Medium, High, Critical |
| `title` | TEXT | Summary of the threat/opportunity |
| `ai_recommendation` | TEXT | Structured response suggestion |
| `is_executed` | BOOLEAN | Tracks if the brand manager acted on it (ROI tracking) |
