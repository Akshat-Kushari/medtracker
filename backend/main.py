from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from typing import Optional

app = FastAPI(title="MedTracker API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://jzgoqoyrexaoyhukaosz.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6Z29xb3lyZXhhb3lodWthb3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NzY3MTQsImV4cCI6MjEwNzM1MjcxNH0.A01qzRgY4tvFmaS9aCYWvj4DnFFAuW3AG-8vHgHt2zs")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_products_with_prices(product_ids: list[str]) -> list[dict]:
    """Fetch products and join their prices."""
    if not product_ids:
        return []

    products_resp = (
        supabase.table("products")
        .select("*")
        .in_("id", product_ids)
        .execute()
    )
    products = products_resp.data or []

    prices_resp = (
        supabase.table("prices")
        .select("*")
        .in_("product_id", product_ids)
        .order("price")
        .execute()
    )
    prices = prices_resp.data or []

    # Group prices by product_id
    price_map: dict[str, list] = {}
    for p in prices:
        pid = p["product_id"]
        price_map.setdefault(pid, []).append({
            "site": p["site"],
            "price": p["price"],
            "mrp": p["mrp"],
            "link": p["link"],
            "inStock": p.get("in_stock", True),
            "delivery": p.get("delivery", ""),
            "color": p.get("color", "#888"),
        })

    result = []
    for prod in products:
        result.append({
            **prod,
            "prices": price_map.get(prod["id"], []),
        })

    return result


@app.get("/")
def home():
    return {"message": "MedTracker API v2 running", "status": "ok"}


@app.get("/products")
def get_products(
    category: Optional[str] = Query(None),
    limit: int = Query(40, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """List products, optionally filtered by category."""
    query = supabase.table("products").select("id")
    if category:
        query = query.eq("category", category)
    query = query.range(offset, offset + limit - 1)

    resp = query.execute()
    ids = [r["id"] for r in (resp.data or [])]
    products = fetch_products_with_prices(ids)

    return {"products": products, "total": len(products), "offset": offset}


@app.get("/search")
def search(q: str = Query(..., min_length=1)):
    """Search products by name, brand, category, or description."""
    term = q.strip().lower()

    resp = (
        supabase.table("products")
        .select("id")
        .or_(
            f"name.ilike.%{term}%,"
            f"brand.ilike.%{term}%,"
            f"category.ilike.%{term}%,"
            f"description.ilike.%{term}%"
        )
        .limit(50)
        .execute()
    )
    ids = [r["id"] for r in (resp.data or [])]
    products = fetch_products_with_prices(ids)

    # Sort by lowest price
    def min_price(p):
        prices = p.get("prices", [])
        return min((x["price"] for x in prices), default=9999999)

    products.sort(key=min_price)
    return products


@app.get("/categories")
def get_categories():
    """Return all distinct categories with product counts."""
    resp = (
        supabase.table("products")
        .select("category")
        .execute()
    )
    rows = resp.data or []
    counts: dict[str, int] = {}
    for r in rows:
        c = r["category"]
        counts[c] = counts.get(c, 0) + 1

    categories = [{"name": k, "count": v} for k, v in sorted(counts.items())]
    return categories


@app.get("/products/{product_id}")
def get_product(product_id: str):
    """Get a single product with all its prices."""
    products = fetch_products_with_prices([product_id])
    if not products:
        raise HTTPException(status_code=404, detail="Product not found")
    return products[0]
