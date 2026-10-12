"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { PRODUCTS, CATEGORIES, SITES, disc } from "./data";
import type { Product } from "./data";

interface CartItem { product: Product; site: string; qty: number }
type Page = "home" | "search" | "product" | "compare" | "categories" | "cart" | "ai";

// ── Chat message type ──
interface ChatMessage { role: "user" | "bot"; text: string }

// ── Healthcare AI knowledge base ──
const HEALTH_KB: Record<string, string> = {
  vitamin_d: "Vitamin D3 deficiency is extremely common in India (>70% of population). Take 2000–4000 IU daily with a fatty meal. K2 MK-7 helps direct calcium to bones not arteries. Best taken in morning.",
  vitamin_b12: "B12 deficiency is rampant in vegetarians/vegans. Choose methylcobalamin (active form) over cyanocobalamin. 1500–2000 mcg daily. Symptoms: fatigue, tingling, brain fog, anemia.",
  protein: "General guideline: 1.6–2.2g protein/kg bodyweight for muscle building. Whey isolate is best post-workout. Casein before bed. Plant proteins (pea+rice) are complete when combined.",
  creatine: "Creatine monohydrate is the most studied supplement. 3–5g daily, no loading needed. Safe long-term. Benefits: strength, power, cognitive function. Take with water anytime.",
  omega3: "Aim for 1–3g combined EPA+DHA daily. Higher triglycerides need 4g (prescription dose). Take with meal. Molecularly distilled oils have no mercury. Reduces inflammation.",
  ashwagandha: "KSM-66 and Shatavari are most bioavailable forms. 300–600mg daily. Reduces cortisol, improves thyroid. Take at night. Avoid in pregnancy. Results in 4–8 weeks.",
  magnesium: "Magnesium glycinate is best for sleep/anxiety. Magnesium malate for energy/fatigue. Citrate for constipation. 300–400mg elemental magnesium at night. Deficiency causes cramps, insomnia.",
  iron: "Iron deficiency anaemia is very common in India, especially women. Ferrous bisglycinate has fewer side effects than ferrous sulfate. Take with Vitamin C. Avoid calcium/dairy within 2 hours.",
  pcos: "For PCOS: Myo-inositol (2000mg) + D-chiro-inositol (50mg) in 40:1 ratio is clinically proven. Add spearmint tea, zinc, and magnesium. Shatavari for hormonal balance. Berberine for insulin resistance.",
  diabetes: "Lifestyle interventions first: low-glycemic diet, exercise, 7-9 hours sleep. Berberine (500mg 3x daily with meals) has strong evidence. Chromium picolinate improves insulin sensitivity. Always consult doctor.",
  heart: "CoQ10 is depleted by statins — supplement 200mg daily if on statin. Omega-3 (EPA+DHA) reduces triglycerides. Magnesium taurate for heart rhythm. Arjuna bark is Ayurvedic cardiotonic.",
  sleep: "Magnesium glycinate 400mg + L-theanine 200mg + melatonin 0.5–3mg (small dose works better). Avoid screens 1hr before bed. Ashwagandha reduces cortisol for better sleep quality.",
  immunity: "Vitamin C (1000mg), Vitamin D3 (2000-4000 IU), Zinc (30mg), Selenium (200mcg). Probiotics with Lactobacillus strains. Tulsi (Holy Basil) is a potent immune modulator.",
  weight_loss: "No supplement replaces diet/exercise. Evidence-based: protein (satiety), fiber (glucomannan), green tea EGCG, berberine, caffeine. ACV mild evidence. Focus on caloric deficit first.",
  ayurveda: "Ayurveda works best as complementary medicine. Well-studied herbs: Ashwagandha (stress/testosterone), Brahmi (memory), Shatavari (women's health), Triphala (digestion), Shilajit (energy/minerals).",
  hair: "Biotin (10000mcg) for deficiency (most people don't need more). Iron, ferritin levels critical for hair loss. Zinc deficiency causes hair fall. DHT blockers: saw palmetto, pumpkin seed oil.",
  skin: "Vitamin C (collagen synthesis), Vitamin E (antioxidant), Collagen peptides, Zinc (acne), Omega-3 (inflammation). Niacinamide topically + internally for skin barrier.",
  gut: "Probiotics with multiple strains (Lactobacillus, Bifidobacterium). Prebiotic fiber (inulin, psyllium). L-Glutamine heals gut lining. Digestive enzymes help bloating. Bone broth collagen for gut lining.",
  joints: "Glucosamine + Chondroitin for cartilage. Collagen type 2 (40mg UC-II) for joint pain. Turmeric curcumin with piperine (anti-inflammatory). Omega-3 reduces joint inflammation. Boswellia serrata.",
  stress: "Adaptogens help: Ashwagandha (cortisol), Rhodiola (energy/focus), Holy Basil (anxiety). Magnesium deficiency worsens stress response. L-theanine for calm focus. B-complex for stress metabolism.",
  compare_stores: "For best prices: HealthKart best for fitness supplements. 1mg/PharmEasy for medicines. Amazon for imported brands. Flipkart for competitive deals. Always compare — can save 20–40%.",
  1: "I'm MedTracker's AI health advisor. I can help with: supplement recommendations, drug interactions basics, vitamin deficiency symptoms, Ayurvedic herbs, price comparison tips, and general health guidance. What would you like to know?",
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("vitamin d")) return HEALTH_KB.vitamin_d;
  if (q.includes("b12") || q.includes("cobalamin")) return HEALTH_KB.vitamin_b12;
  if (q.includes("protein") || q.includes("whey")) return HEALTH_KB.protein;
  if (q.includes("creatine")) return HEALTH_KB.creatine;
  if (q.includes("omega") || q.includes("fish oil")) return HEALTH_KB.omega3;
  if (q.includes("ashwagandha")) return HEALTH_KB.ashwagandha;
  if (q.includes("magnesium")) return HEALTH_KB.magnesium;
  if (q.includes("iron") || q.includes("anaemia") || q.includes("anemia")) return HEALTH_KB.iron;
  if (q.includes("pcos") || q.includes("inositol") || q.includes("pcod")) return HEALTH_KB.pcos;
  if (q.includes("diabetes") || q.includes("diabetic") || q.includes("blood sugar") || q.includes("glucose")) return HEALTH_KB.diabetes;
  if (q.includes("heart") || q.includes("cholesterol") || q.includes("coq10") || q.includes("cardiac")) return HEALTH_KB.heart;
  if (q.includes("sleep") || q.includes("insomnia") || q.includes("melatonin")) return HEALTH_KB.sleep;
  if (q.includes("immun")) return HEALTH_KB.immunity;
  if (q.includes("weight") || q.includes("fat") || q.includes("lose")) return HEALTH_KB.weight_loss;
  if (q.includes("ayurved") || q.includes("herb") || q.includes("triphala") || q.includes("shilajit")) return HEALTH_KB.ayurveda;
  if (q.includes("hair") || q.includes("biotin") || q.includes("hairfall")) return HEALTH_KB.hair;
  if (q.includes("skin") || q.includes("acne") || q.includes("collagen")) return HEALTH_KB.skin;
  if (q.includes("gut") || q.includes("digestion") || q.includes("probiotic") || q.includes("bloating")) return HEALTH_KB.gut;
  if (q.includes("joint") || q.includes("arthritis") || q.includes("knee")) return HEALTH_KB.joints;
  if (q.includes("stress") || q.includes("anxiety") || q.includes("cortisol")) return HEALTH_KB.stress;
  if (q.includes("cheap") || q.includes("price") || q.includes("compare") || q.includes("discount") || q.includes("best deal")) return HEALTH_KB.compare_stores;
  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("help")) return HEALTH_KB[1];

  // Try to find a matching product
  const match = PRODUCTS.find(p =>
    p.name.toLowerCase().includes(q.split(" ")[0]) ||
    p.brand.toLowerCase().includes(q.split(" ")[0]) ||
    q.includes(p.name.toLowerCase().split(" ")[0])
  );
  if (match) {
    const best = [...match.prices].sort((a, b) => a.price - b.price)[0];
    return `${match.name} by ${match.brand}: Best price ₹${best?.price} on ${best?.site}. ${match.description} Key benefits: ${match.highlights.slice(0, 3).join(", ")}.`;
  }

  return `I can help you with supplement advice, vitamin deficiencies, Ayurvedic herbs, PCOS, diabetes care, heart health, weight management, and price comparisons. Try asking about: "Vitamin D", "ashwagandha", "protein powder", "PCOS", "diabetic supplements", "sleep", or "hair loss". 🌿`;
}

// ── CSS ──
const CSS = `
  :root {
    --bg: #000000;
    --bg2: #0a0a0a;
    --bg3: #111111;
    --bg4: #1a1a1a;
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.15);
    --text: #ffffff;
    --text2: #a0a0a0;
    --text3: #666666;
    --accent: #b8ff57;
    --accent2: #9de040;
    --accent-dim: rgba(184,255,87,0.12);
    --accent-dim2: rgba(184,255,87,0.06);
    --shadow: rgba(184,255,87,0.15);
    --card: #0d0d0d;
    --card2: #141414;
    --red: #ff4444;
    --radius: 12px;
    --radius-sm: 8px;
    --transition: all 0.2s ease;
  }
  [data-theme="light"] {
    --bg: #f5f5f0;
    --bg2: #ebebeb;
    --bg3: #e0e0e0;
    --bg4: #d5d5d5;
    --border: rgba(0,0,0,0.1);
    --border2: rgba(0,0,0,0.2);
    --text: #111111;
    --text2: #444444;
    --text3: #888888;
    --accent: #5a9e00;
    --accent2: #4a8a00;
    --accent-dim: rgba(90,158,0,0.12);
    --accent-dim2: rgba(90,158,0,0.06);
    --shadow: rgba(90,158,0,0.18);
    --card: #ffffff;
    --card2: #f0f0f0;
    --red: #cc0000;
  }
  * { margin:0; padding:0; box-sizing:border-box }
  html { scroll-behavior:smooth }
  body {
    background:var(--bg);
    color:var(--text);
    font-family:'DM Sans',system-ui,sans-serif;
    min-height:100vh;
    cursor:none;
    transition: background 0.3s ease, color 0.3s ease;
  }
  @font-face { font-display:swap }
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Fragment+Mono&display=swap');

  /* ── Cursor ── */
  #cursor { position:fixed;width:10px;height:10px;background:var(--accent);border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:transform 0.1s }
  #cursor-ring { position:fixed;width:36px;height:36px;border:1.5px solid var(--accent);border-radius:50%;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:all 0.18s ease;opacity:0.6 }

  /* ── Nav ── */
  nav { position:fixed;top:0;left:0;right:0;z-index:900;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;background:var(--bg);border-bottom:1px solid var(--border) }
  .nav-logo { font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;color:var(--accent);cursor:pointer }
  .nav-links { display:flex;gap:8px;align-items:center }
  .nav-btn { padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:13px;cursor:pointer;transition:var(--transition);font-family:inherit }
  .nav-btn:hover,.nav-btn.active { background:var(--accent-dim);color:var(--accent);border-color:var(--accent) }
  .nav-cart-btn { position:relative;padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:13px;cursor:pointer;transition:var(--transition);font-family:inherit }
  .nav-cart-btn:hover { background:var(--accent-dim);color:var(--accent);border-color:var(--accent) }
  .cart-badge { position:absolute;top:-6px;right:-6px;background:var(--accent);color:#000;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center }
  .theme-toggle { width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:transparent;color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:var(--transition) }
  .theme-toggle:hover { background:var(--accent-dim);color:var(--accent);border-color:var(--accent) }

  /* ── Search Bar ── */
  .search-container { position:relative;flex:1;max-width:400px;margin:0 16px }
  .search-input { width:100%;padding:8px 16px 8px 36px;border-radius:20px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px;outline:none;transition:var(--transition);font-family:inherit }
  .search-input:focus { border-color:var(--accent);background:var(--bg4) }
  .search-input::placeholder { color:var(--text3) }
  .search-icon-nav { position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:14px;pointer-events:none }

  /* ── Hero ── */
  .hero { min-height:100vh;display:flex;align-items:center;padding:80px 24px 60px;position:relative;overflow:hidden }
  .hero-content { max-width:1200px;margin:0 auto;width:100% }
  .hero-eyebrow { font-family:'Fragment Mono',monospace;font-size:11px;color:var(--accent);letter-spacing:3px;text-transform:uppercase;margin-bottom:24px;display:flex;align-items:center;gap:8px }
  .hero-dot { width:6px;height:6px;border-radius:50%;background:var(--accent);display:inline-block;animation:pulse 2s infinite }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
  .hero-title { font-family:'Bebas Neue',sans-serif;font-size:clamp(56px,8vw,120px);line-height:0.95;color:var(--text);margin-bottom:24px }
  .hero-title .accent { color:var(--accent) }
  .hero-subtitle { font-size:17px;color:var(--text2);max-width:560px;line-height:1.7;margin-bottom:40px }
  .hero-cta { display:flex;gap:12px;flex-wrap:wrap;align-items:center }
  .btn-primary { padding:14px 28px;background:var(--accent);color:#000;border:none;border-radius:var(--radius);font-weight:700;font-size:14px;cursor:pointer;transition:var(--transition);font-family:inherit;letter-spacing:0.3px }
  .btn-primary:hover { background:var(--accent2);transform:translateY(-1px) }
  .btn-secondary { padding:14px 28px;background:transparent;color:var(--text);border:1px solid var(--border2);border-radius:var(--radius);font-weight:500;font-size:14px;cursor:pointer;transition:var(--transition);font-family:inherit }
  .btn-secondary:hover { border-color:var(--accent);color:var(--accent) }
  .hero-stats { display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:80px;border:1px solid var(--border);border-radius:var(--radius) }
  .stat-item { padding:28px 32px;border-right:1px solid var(--border) }
  .stat-item:last-child { border-right:none }
  .stat-num { font-family:'Bebas Neue',sans-serif;font-size:48px;color:var(--accent);line-height:1 }
  .stat-label { font-size:12px;color:var(--text3);margin-top:4px;letter-spacing:0.5px }
  .hero-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(184,255,87,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(184,255,87,0.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none }
  [data-theme="light"] .hero-grid { background-image:linear-gradient(rgba(90,158,0,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(90,158,0,0.05) 1px,transparent 1px) }

  /* ── Sections ── */
  .section { max-width:1200px;margin:0 auto;padding:80px 24px }
  .section-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:40px }
  .section-title { font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--text);letter-spacing:1px }
  .section-link { font-size:13px;color:var(--accent);cursor:pointer;border:none;background:none;font-family:inherit }
  .section-link:hover { text-decoration:underline }
  .eyebrow { font-family:'Fragment Mono',monospace;font-size:10px;color:var(--accent);letter-spacing:3px;text-transform:uppercase;margin-bottom:8px }

  /* ── Product Cards ── */
  .products-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px }
  .product-card { background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:var(--transition);position:relative }
  .product-card:hover { border-color:var(--accent);transform:translateY(-3px);box-shadow:0 12px 32px var(--shadow) }
  .product-image-wrap { width:100%;aspect-ratio:1;background:var(--bg3);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative }
  .product-image-wrap img { width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease }
  .product-card:hover .product-image-wrap img { transform:scale(1.06) }
  .product-img-placeholder { font-size:64px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:var(--bg3) }
  .product-tag { position:absolute;top:10px;left:10px;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.5px }
  .tag-bestseller { background:var(--accent);color:#000 }
  .tag-new { background:#3182ce;color:#fff }
  .tag-hot { background:#e53e3e;color:#fff }
  .tag-top { background:#805ad5;color:#fff }
  .tag-premium { background:#d4a017;color:#000 }
  .product-info { padding:14px }
  .product-brand { font-size:10px;color:var(--text3);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:4px }
  .product-name { font-size:13px;font-weight:600;color:var(--text);line-height:1.4;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden }
  .product-price-row { display:flex;align-items:baseline;gap:6px;margin-bottom:8px }
  .product-price { font-family:'Fragment Mono',monospace;font-size:16px;font-weight:600;color:var(--text) }
  .product-mrp { font-size:12px;color:var(--text3);text-decoration:line-through }
  .product-discount { font-size:11px;color:var(--accent);font-weight:700 }
  .product-rating { font-size:12px;color:var(--text2) }
  .product-sites { display:flex;gap:4px;flex-wrap:wrap;margin-top:8px }
  .site-dot { padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;white-space:nowrap }

  /* ── Category Cards ── */
  .categories-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px }
  .cat-card { background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px 20px;cursor:pointer;transition:var(--transition) }
  .cat-card:hover { border-color:var(--accent);background:var(--accent-dim2) }
  .cat-icon { font-size:28px;margin-bottom:12px }
  .cat-name { font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px }
  .cat-count { font-size:12px;color:var(--text3) }

  /* ── Store Badges ── */
  .stores-row { display:flex;gap:12px;flex-wrap:wrap;margin-top:40px }
  .store-badge { padding:8px 16px;border:1px solid var(--border);border-radius:20px;font-size:12px;font-weight:600;color:var(--text2);background:var(--card) }
  .store-badge:hover { border-color:var(--accent);color:var(--accent);cursor:default }

  /* ── Product Detail ── */
  .product-detail { max-width:1100px;margin:0 auto;padding:80px 24px }
  .back-btn { display:flex;align-items:center;gap:6px;color:var(--text2);font-size:13px;cursor:pointer;border:none;background:none;font-family:inherit;margin-bottom:32px;transition:var(--transition) }
  .back-btn:hover { color:var(--accent) }
  .detail-grid { display:grid;grid-template-columns:1fr 1fr;gap:48px }
  .detail-image { aspect-ratio:1;background:var(--card);border-radius:var(--radius);overflow:hidden;border:1px solid var(--border) }
  .detail-image img { width:100%;height:100%;object-fit:cover }
  .detail-image-placeholder { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:120px }
  .detail-name { font-family:'Bebas Neue',sans-serif;font-size:32px;line-height:1.1;margin-bottom:8px }
  .detail-brand { font-size:13px;color:var(--text3);margin-bottom:16px }
  .detail-desc { font-size:14px;color:var(--text2);line-height:1.7;margin-bottom:24px }
  .highlights-list { list-style:none;margin-bottom:24px }
  .highlights-list li { padding:6px 0;font-size:13px;color:var(--text2);display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border) }
  .highlights-list li:last-child { border-bottom:none }
  .highlight-dot { width:4px;height:4px;border-radius:50%;background:var(--accent);flex-shrink:0 }
  .prices-list { display:flex;flex-direction:column;gap:10px;margin-bottom:24px }
  .price-row { display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--card) }
  .price-row:hover { border-color:var(--accent) }
  .price-row-best { border-color:var(--accent);background:var(--accent-dim2) }
  .price-site-name { font-weight:600;font-size:13px }
  .price-val { font-family:'Fragment Mono',monospace;font-size:16px;font-weight:600 }
  .price-mrp-sm { font-size:11px;color:var(--text3);text-decoration:line-through;margin-left:6px }
  .price-disc { font-size:11px;color:var(--accent);font-weight:700;margin-left:4px }
  .price-actions { display:flex;gap:8px;align-items:center }
  .btn-buy { padding:8px 14px;background:var(--accent);color:#000;border:none;border-radius:var(--radius-sm);font-size:12px;font-weight:700;cursor:pointer;text-decoration:none;font-family:inherit;transition:var(--transition) }
  .btn-buy:hover { background:var(--accent2) }
  .btn-cart { padding:8px 14px;background:transparent;color:var(--text2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;cursor:pointer;font-family:inherit;transition:var(--transition) }
  .btn-cart:hover { border-color:var(--accent);color:var(--accent) }
  .stock-yes { font-size:11px;color:#48bb78;font-weight:600 }
  .stock-no { font-size:11px;color:var(--red);font-weight:600 }

  /* ── Search Page ── */
  .search-page { max-width:1200px;margin:0 auto;padding:80px 24px }
  .search-big { position:relative;margin-bottom:32px }
  .search-big input { width:100%;padding:18px 20px 18px 50px;border:1px solid var(--border);border-radius:var(--radius);background:var(--card);color:var(--text);font-size:18px;outline:none;transition:var(--transition);font-family:inherit }
  .search-big input:focus { border-color:var(--accent) }
  .search-big input::placeholder { color:var(--text3) }
  .search-big svg { position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--text3) }
  .filters-row { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px }
  .filter-chip { padding:6px 14px;border:1px solid var(--border);border-radius:20px;font-size:12px;cursor:pointer;background:var(--card);color:var(--text2);transition:var(--transition);font-family:inherit }
  .filter-chip:hover,.filter-chip.active { background:var(--accent-dim);border-color:var(--accent);color:var(--accent) }
  .results-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px }
  .results-count { font-size:13px;color:var(--text3) }

  /* ── Cart ── */
  .cart-page { max-width:900px;margin:0 auto;padding:80px 24px }
  .cart-item { display:flex;gap:16px;padding:20px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:12px;background:var(--card) }
  .cart-item-img { width:80px;height:80px;object-fit:cover;border-radius:var(--radius-sm);background:var(--bg3) }
  .cart-item-details { flex:1 }
  .cart-total { margin-top:24px;padding:20px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent-dim2) }

  /* ── AI Page ── */
  .ai-page { max-width:720px;margin:0 auto;padding:80px 24px }
  .ai-header { text-align:center;margin-bottom:40px }
  .ai-title { font-family:'Bebas Neue',sans-serif;font-size:48px;color:var(--accent) }
  .ai-subtitle { color:var(--text2);font-size:14px;margin-top:8px }
  .ai-onboarding { display:flex;flex-direction:column;gap:16px }
  .ai-step { border:1px solid var(--border);border-radius:var(--radius);padding:20px;background:var(--card) }
  .ai-step-title { font-size:13px;font-weight:600;color:var(--text);margin-bottom:12px }
  .ai-chips { display:flex;gap:8px;flex-wrap:wrap }
  .ai-chip { padding:6px 14px;border:1px solid var(--border);border-radius:20px;font-size:12px;cursor:pointer;background:transparent;color:var(--text2);transition:var(--transition);font-family:inherit }
  .ai-chip.selected { background:var(--accent-dim);border-color:var(--accent);color:var(--accent) }
  .ai-recs { display:flex;flex-direction:column;gap:12px }
  .ai-rec-card { border:1px solid var(--border);border-radius:var(--radius);padding:16px;background:var(--card) }

  /* ── Floating Chatbot ── */
  .chatbot-fab { position:fixed;bottom:24px;right:24px;z-index:1000;width:56px;height:56px;border-radius:50%;background:var(--accent);color:#000;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 20px var(--shadow);transition:var(--transition) }
  .chatbot-fab:hover { background:var(--accent2);transform:scale(1.08) }
  .chatbot-window { position:fixed;bottom:90px;right:24px;z-index:1000;width:340px;max-height:500px;background:var(--card);border:1px solid var(--border2);border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.4);display:flex;flex-direction:column;overflow:hidden;animation:slideUp 0.25s ease }
  [data-theme="light"] .chatbot-window { box-shadow:0 8px 40px rgba(0,0,0,0.12) }
  @keyframes slideUp { from { opacity:0;transform:translateY(16px) } to { opacity:1;transform:translateY(0) } }
  .chatbot-header { padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--card2) }
  .chatbot-header-info { display:flex;align-items:center;gap:10px }
  .chatbot-avatar { width:32px;height:32px;border-radius:50%;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:16px }
  .chatbot-title { font-size:13px;font-weight:700;color:var(--text) }
  .chatbot-status { font-size:10px;color:var(--accent) }
  .chatbot-close { background:none;border:none;color:var(--text3);cursor:pointer;font-size:18px;line-height:1;padding:0;font-family:inherit }
  .chatbot-close:hover { color:var(--text) }
  .chatbot-messages { flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px }
  .chatbot-messages::-webkit-scrollbar { width:4px }
  .chatbot-messages::-webkit-scrollbar-track { background:transparent }
  .chatbot-messages::-webkit-scrollbar-thumb { background:var(--border2);border-radius:2px }
  .msg-user { align-self:flex-end;background:var(--accent);color:#000;padding:9px 13px;border-radius:14px 14px 4px 14px;font-size:13px;max-width:80%;line-height:1.45;font-weight:500 }
  .msg-bot { align-self:flex-start;background:var(--bg3);color:var(--text);padding:9px 13px;border-radius:14px 14px 14px 4px;font-size:13px;max-width:85%;line-height:1.55;border:1px solid var(--border) }
  .msg-typing { align-self:flex-start;background:var(--bg3);padding:10px 14px;border-radius:14px 14px 14px 4px;border:1px solid var(--border);display:flex;gap:5px;align-items:center }
  .typing-dot { width:6px;height:6px;border-radius:50%;background:var(--text3);animation:typing 1.2s infinite }
  .typing-dot:nth-child(2) { animation-delay:0.2s }
  .typing-dot:nth-child(3) { animation-delay:0.4s }
  @keyframes typing { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
  .chatbot-quick { padding:8px 14px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid var(--border) }
  .quick-chip { padding:4px 10px;border:1px solid var(--border);border-radius:20px;font-size:11px;cursor:pointer;color:var(--text2);background:transparent;transition:var(--transition);font-family:inherit;white-space:nowrap }
  .quick-chip:hover { border-color:var(--accent);color:var(--accent) }
  .chatbot-input-row { padding:10px 12px;border-top:1px solid var(--border);display:flex;gap:8px;background:var(--card2) }
  .chatbot-input { flex:1;padding:9px 12px;border:1px solid var(--border);border-radius:20px;background:var(--bg3);color:var(--text);font-size:13px;outline:none;font-family:inherit }
  .chatbot-input:focus { border-color:var(--accent) }
  .chatbot-input::placeholder { color:var(--text3) }
  .chatbot-send { width:34px;height:34px;border-radius:50%;background:var(--accent);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#000;font-size:14px;flex-shrink:0;transition:var(--transition) }
  .chatbot-send:hover { background:var(--accent2) }

  /* ── Misc ── */
  .empty-state { text-align:center;padding:80px 24px;color:var(--text3) }
  .empty-icon { font-size:48px;margin-bottom:16px }
  .empty-title { font-size:18px;font-weight:600;color:var(--text2);margin-bottom:8px }
  .compare-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px }
  .page-container { padding-top:60px }
  .divider { height:1px;background:var(--border);margin:0 24px }

  /* ── Responsive ── */
  @media (max-width:768px) {
    .hero-title { font-size:52px }
    .hero-stats { grid-template-columns:repeat(3,1fr) }
    .stat-item { padding:20px 16px }
    .stat-num { font-size:32px }
    .detail-grid { grid-template-columns:1fr }
    .nav-links { gap:4px }
    .nav-btn { padding:5px 10px;font-size:12px }
    .chatbot-window { width:calc(100vw - 48px);right:24px }
    .compare-grid { grid-template-columns:1fr }
    .hero-stats { grid-template-columns:1fr }
    .stat-item { border-right:none;border-bottom:1px solid var(--border) }
    .stat-item:last-child { border-bottom:none }
  }
`;

// ── Cursor ──
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px" }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px" }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (<><div id="cursor" ref={dot}/><div id="cursor-ring" ref={ring}/></>);
}

// ── Floating Chatbot ──
const QUICK_CHIPS = ["Vitamin D", "Protein powder", "PCOS help", "Sleep better", "Diabetes care", "Hair loss"];
function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi! I'm MedTracker's AI health advisor 🌿 Ask me about supplements, vitamins, health conditions, or prices." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, typing]);

  const send = useCallback((text?: string) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: "bot", text: getAIResponse(q) }]);
    }, 900 + Math.random() * 400);
  }, [input]);

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") send() };

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🌿</div>
              <div>
                <div className="chatbot-title">MedTracker AI</div>
                <div className="chatbot-status">● Online · Healthcare Advisor</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "msg-user" : "msg-bot"}>{m.text}</div>
            ))}
            {typing && (
              <div className="msg-typing">
                <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div className="chatbot-quick">
            {QUICK_CHIPS.map(c => (
              <button key={c} className="quick-chip" onClick={() => send(c)}>{c}</button>
            ))}
          </div>
          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              placeholder="Ask about health, supplements..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
            />
            <button className="chatbot-send" onClick={() => send()}>➤</button>
          </div>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen(o => !o)} title="AI Health Advisor">
        {open ? "×" : "🌿"}
      </button>
    </>
  );
}

// ── Nav ──
function Nav({ page, setPage, cartCount, searchQ, setSearchQ, onSearchSubmit, theme, toggleTheme }: {
  page: Page; setPage: (p: Page) => void;
  cartCount: number; searchQ: string; setSearchQ: (q: string) => void;
  onSearchSubmit: () => void; theme: string; toggleTheme: () => void;
}) {
  return (
    <nav>
      <div className="nav-logo" onClick={() => setPage("home")}>MEDTRACKER</div>
      <div className="search-container">
        <span className="search-icon-nav">⌕</span>
        <input
          className="search-input"
          placeholder="Search medicines, supplements..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearchSubmit()}
        />
      </div>
      <div className="nav-links">
        {([["home","Home"],["categories","Categories"],["compare","Compare"],["ai","AI Advisor"]] as [Page,string][]).map(([p,l]) => (
          <button key={p} className={`nav-btn${page===p?" active":""}`} onClick={() => setPage(p)}>{l}</button>
        ))}
        <button className="nav-cart-btn" onClick={() => setPage("cart")}>
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle light/dark">
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </nav>
  );
}

// ── Product Card ──
function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const bestPrice = [...product.prices].sort((a, b) => a.price - b.price)[0];
  const discount = bestPrice ? disc(bestPrice.price, bestPrice.mrp) : 0;
  const tagClass: Record<string, string> = {
    Bestseller: "tag-bestseller", New: "tag-new", "Hot Deal": "tag-hot",
    "Top Rated": "tag-top", Premium: "tag-premium",
  };
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image-wrap">
        {product.image && !product.image.startsWith("http") ? (
          <div className="product-img-placeholder">{product.image}</div>
        ) : (
          <img src={product.image} alt={product.name} loading="lazy" />
        )}
        {product.tag && (
          <span className={`product-tag ${tagClass[product.tag] || "tag-top"}`}>{product.tag}</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price-row">
          <span className="product-price">₹{bestPrice?.price}</span>
          <span className="product-mrp">₹{bestPrice?.mrp}</span>
          {discount > 0 && <span className="product-discount">{discount}% off</span>}
        </div>
        <div className="product-rating">⭐ {product.rating} ({product.reviews.toLocaleString()})</div>
        <div className="product-sites">
          {product.prices.slice(0, 3).map(p => (
            <span key={p.site} className="site-dot" style={{ background: p.color + "22", color: p.color }}>{p.site}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Home ──
function Home({ setPage, setSelectedProduct, setSearchQ }: {
  setPage: (p: Page) => void;
  setSelectedProduct: (p: Product) => void;
  setSearchQ: (q: string) => void;
}) {
  const [counts, setCounts] = useState({ products: 0, stores: 0, saved: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const totalSaved = PRODUCTS.reduce((acc, p) => {
      const prices = p.prices;
      if (!prices.length) return acc;
      const min = Math.min(...prices.map(x => x.price));
      const max = Math.max(...prices.map(x => x.mrp));
      return acc + (max - min);
    }, 0);

    const animate = () => {
      if (animated.current) return;
      animated.current = true;
      const duration = 1800;
      const targets = { products: PRODUCTS.length, stores: SITES.length, saved: Math.round(totalSaved / 1000) };
      const start = Date.now();
      const tick = () => {
        const t = Math.min(1, (Date.now() - start) / duration);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setCounts({
          products: Math.round(ease * targets.products),
          stores: Math.round(ease * targets.stores),
          saved: Math.round(ease * targets.saved),
        });
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) animate();
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const featured = PRODUCTS.slice(0, 8);
  const trending = PRODUCTS.filter(p => p.tag === "Bestseller" || p.tag === "Top Rated").slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-grid"/>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-dot"/>
            India&apos;s Health Price Intelligence System
          </div>
          <h1 className="hero-title">
            NEVER<br/>
            <span className="accent">OVERPAY</span><br/>
            AGAIN
          </h1>
          <p className="hero-subtitle">
            Real-time price comparison across 7 Indian health stores.
            Compare medicines, supplements & vitamins — find the best deal instantly.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => { setSearchQ(""); setPage("search") }}>
              Compare Prices →
            </button>
            <button className="btn-secondary" onClick={() => setPage("categories")}>
              Browse Categories
            </button>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <div className="stat-num">{counts.products}+</div>
              <div className="stat-label">Products Tracked</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{counts.stores}</div>
              <div className="stat-label">Stores Compared</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">₹{counts.saved}K+</div>
              <div className="stat-label">Potential Savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Compared Across</div>
          <div className="stores-row">
            {SITES.map(s => <div key={s} className="store-badge">{s}</div>)}
          </div>
        </div>
      </div>

      {/* Featured */}
      <div className="section">
        <div className="section-header">
          <div>
            <div className="eyebrow">Products</div>
            <div className="section-title">FEATURED PICKS</div>
          </div>
          <button className="section-link" onClick={() => setPage("search")}>View all →</button>
        </div>
        <div className="products-grid">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => { setSelectedProduct(p); setPage("product") }} />
          ))}
        </div>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <div>
              <div className="eyebrow">Bestsellers</div>
              <div className="section-title">TRENDING NOW</div>
            </div>
            <button className="section-link" onClick={() => setPage("search")}>See more →</button>
          </div>
          <div className="products-grid">
            {trending.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => { setSelectedProduct(p); setPage("product") }} />
            ))}
          </div>
        </div>
      )}

      {/* Categories Preview */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="eyebrow">Browse</div>
            <div className="section-title">ALL CATEGORIES</div>
          </div>
          <button className="section-link" onClick={() => setPage("categories")}>See all →</button>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(c => (
            <div key={c.name} className="cat-card" onClick={() => { setSearchQ(c.name); setPage("search") }}>
              <div className="cat-icon">{c.icon}</div>
              <div className="cat-name">{c.name}</div>
              <div className="cat-count">{c.count} products</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Product Detail ──
function ProductPage({ product, cart, setCart, setPage }: {
  product: Product; cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setPage: (p: Page) => void;
}) {
  const sorted = [...product.prices].sort((a, b) => a.price - b.price);

  const addToCart = (site: string) => {
    setCart(c => {
      const ex = c.find(i => i.product.id === product.id && i.site === site);
      if (ex) return c.map(i => i.product.id === product.id && i.site === site ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { product, site, qty: 1 }];
    });
  };

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => setPage("search")}>← Back</button>
      <div className="detail-grid">
        <div className="detail-image">
          {product.image && product.image.startsWith("http") ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="detail-image-placeholder">{product.image || "💊"}</div>
          )}
        </div>
        <div>
          {product.tag && <div className="eyebrow" style={{ marginBottom: 8 }}>{product.tag}</div>}
          <div className="detail-name">{product.name}</div>
          <div className="detail-brand">by {product.brand} · {product.category}</div>
          <div style={{ margin: "12px 0", fontSize: 13, color: "var(--text2)" }}>
            ⭐ {product.rating} ({product.reviews.toLocaleString()} reviews)
          </div>
          <p className="detail-desc">{product.description}</p>
          <ul className="highlights-list">
            {product.highlights.map(h => (
              <li key={h}><span className="highlight-dot"/>{h}</li>
            ))}
          </ul>

          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12, fontFamily: "var(--font-mono, monospace)" }}>
            PRICES ACROSS {product.prices.length} STORES
          </div>
          <div className="prices-list">
            {sorted.map((p, i) => (
              <div key={p.site} className={`price-row ${i === 0 ? "price-row-best" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }}/>
                  <span className="price-site-name" style={{ color: i === 0 ? "var(--accent)" : "var(--text)" }}>
                    {p.site} {i === 0 && "🏆"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="price-val" style={{ color: i === 0 ? "var(--accent)" : "var(--text)" }}>₹{p.price}</span>
                  <span className="price-mrp-sm">₹{p.mrp}</span>
                  <span className="price-disc">{disc(p.price, p.mrp)}% off</span>
                </div>
                <div className="price-actions">
                  {p.inStock ? <span className="stock-yes">✓ In Stock</span> : <span className="stock-no">Out of Stock</span>}
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-buy">Buy</a>
                  <button className="btn-cart" onClick={() => addToCart(p.site)}>+ Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Search ──
function Search({ setPage, setSelectedProduct, initialQ }: {
  setPage: (p: Page) => void;
  setSelectedProduct: (p: Product) => void;
  initialQ: string;
}) {
  const [q, setQ] = useState(initialQ);
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", ...CATEGORIES.map(c => c.name)];

  const results = PRODUCTS.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand.toLowerCase().includes(q.toLowerCase()) ||
      p.category.toLowerCase().includes(q.toLowerCase()) ||
      p.description.toLowerCase().includes(q.toLowerCase());
    const matchF = activeFilter === "All" || p.category === activeFilter;
    return matchQ && matchF;
  });

  return (
    <div className="search-page">
      <div className="section-title" style={{ marginBottom: 24 }}>SEARCH PRODUCTS</div>
      <div className="search-big">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          autoFocus
          placeholder="Search medicines, vitamins, supplements..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <div className="filters-row">
        {filters.map(f => (
          <button key={f} className={`filter-chip${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="results-header">
        <span className="results-count">{results.length} products found</span>
      </div>
      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results found</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>Try a different search term or browse categories</div>
        </div>
      ) : (
        <div className="products-grid">
          {results.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => { setSelectedProduct(p); setPage("product") }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Categories ──
function Categories({ setPage, setSearchQ }: { setPage: (p: Page) => void; setSearchQ: (q: string) => void }) {
  return (
    <div className="section">
      <div className="section-title" style={{ marginBottom: 32 }}>ALL CATEGORIES</div>
      <div className="categories-grid">
        {CATEGORIES.map(c => (
          <div key={c.name} className="cat-card" onClick={() => { setSearchQ(c.name); setPage("search") }}>
            <div className="cat-icon">{c.icon}</div>
            <div className="cat-name">{c.name}</div>
            <div className="cat-count">{c.count} products</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Compare ──
function Compare({ setPage, setSelectedProduct }: { setPage: (p: Page) => void; setSelectedProduct: (p: Product) => void }) {
  const [slots, setSlots] = useState<(Product | null)[]>([null, null, null]);
  const [searchSlot, setSearchSlot] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const searchRes = q ? PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6) : [];

  return (
    <div className="section">
      <div className="section-title" style={{ marginBottom: 32 }}>COMPARE PRODUCTS</div>
      <div className="compare-grid">
        {slots.map((slot, i) => (
          <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, background: "var(--card)", minHeight: 200 }}>
            {slot ? (
              <div>
                <div style={{ width: "100%", aspectRatio: "1", background: "var(--bg3)", borderRadius: "var(--radius-sm)", marginBottom: 12, overflow: "hidden" }}>
                  {slot.image.startsWith("http") ? (
                    <img src={slot.image} alt={slot.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 48 }}>{slot.image}</div>
                  )}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{slot.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>{slot.brand}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
                  from ₹{Math.min(...slot.prices.map(p => p.price))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[...slot.prices].sort((a, b) => a.price - b.price).slice(0, 3).map(p => (
                    <div key={p.site} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)" }}>
                      <span style={{ color: p.color }}>{p.site}</span>
                      <span>₹{p.price}</span>
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: 12, width: "100%", padding: "8px 0", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text3)", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
                  onClick={() => setSlots(s => s.map((x, j) => j === i ? null : x))}>
                  Remove
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 12 }}>
                <div style={{ fontSize: 32, opacity: 0.4 }}>+</div>
                <div style={{ fontSize: 13, color: "var(--text3)" }}>Add product</div>
                <button
                  style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--accent)", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
                  onClick={() => setSearchSlot(i)}
                >Select Product</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {searchSlot !== null && (
        <div style={{ marginTop: 24, padding: 20, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--card)" }}>
          <input
            autoFocus
            style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--bg3)", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 12 }}
            placeholder="Search product..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {searchRes.map(p => (
              <div key={p.id}
                style={{ padding: 12, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", background: "var(--bg3)" }}
                onClick={() => { setSlots(s => s.map((x, j) => j === searchSlot ? p : x)); setSearchSlot(null); setQ("") }}
              >
                <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{p.brand}</div>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 12, fontSize: 12, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            onClick={() => { setSearchSlot(null); setQ("") }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ── Cart ──
function Cart({ cart, setCart }: { cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const total = cart.reduce((acc, item) => {
    const price = item.product.prices.find(p => p.site === item.site)?.price || 0;
    return acc + price * item.qty;
  }, 0);

  if (cart.length === 0) return (
    <div className="cart-page">
      <div className="section-title" style={{ marginBottom: 32 }}>YOUR CART</div>
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <div className="empty-title">Cart is empty</div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>Add products from the search page to compare and buy</div>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="section-title" style={{ marginBottom: 32 }}>YOUR CART</div>
      {cart.map((item, i) => {
        const priceEntry = item.product.prices.find(p => p.site === item.site);
        return (
          <div key={i} className="cart-item">
            <div style={{ width: 80, height: 80, background: "var(--bg3)", borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0 }}>
              {item.product.image.startsWith("http") ? (
                <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{item.product.image}</div>
              )}
            </div>
            <div className="cart-item-details">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.product.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>via {item.site}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>₹{(priceEntry?.price || 0) * item.qty}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ width: 26, height: 26, border: "1px solid var(--border)", borderRadius: 4, background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}
                    onClick={() => setCart(c => c.map((x, j) => j === i ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>-</button>
                  <span style={{ minWidth: 24, textAlign: "center", fontSize: 14, lineHeight: "26px" }}>{item.qty}</span>
                  <button style={{ width: 26, height: 26, border: "1px solid var(--border)", borderRadius: 4, background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}
                    onClick={() => setCart(c => c.map((x, j) => j === i ? { ...x, qty: x.qty + 1 } : x))}>+</button>
                </div>
                <button style={{ fontSize: 12, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  onClick={() => setCart(c => c.filter((_, j) => j !== i))}>Remove</button>
              </div>
            </div>
            {priceEntry && (
              <a href={priceEntry.link} target="_blank" rel="noopener noreferrer" className="btn-buy" style={{ alignSelf: "center", textDecoration: "none" }}>
                Buy on {item.site}
              </a>
            )}
          </div>
        );
      })}
      <div className="cart-total">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>Estimated Total</div>
            <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "var(--accent)" }}>₹{total.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", maxWidth: 200, textAlign: "right" }}>
            You&apos;re buying from {[...new Set(cart.map(i => i.site))].join(", ")}. Prices may vary at checkout.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI Advisor ──
function AiAdvisor() {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [diet, setDiet] = useState("");
  const [recs, setRecs] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const GOALS = ["Build Muscle","Lose Weight","Boost Immunity","Better Sleep","Manage Stress","Heart Health","Bone Health","Hormonal Balance","Diabetic Care","Hair & Skin"];
  const CONCERNS = ["No side effects","Vegetarian/Vegan","Budget-friendly","Clinically proven","Ayurvedic","No sugar","Gluten-free"];
  const DIETS = ["Vegetarian","Vegan","Non-vegetarian","Keto/Low-carb","No preference"];

  const getRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      const goalMap: Record<string, string[]> = {
        "Build Muscle": ["Protein & Fitness"],
        "Lose Weight": ["Weight Management"],
        "Boost Immunity": ["Vitamins & Minerals","Ayurvedic"],
        "Better Sleep": ["Supplements"],
        "Manage Stress": ["Supplements","Ayurvedic"],
        "Heart Health": ["Heart Health","Supplements"],
        "Bone Health": ["Vitamins & Minerals"],
        "Hormonal Balance": ["Women's Health","Ayurvedic"],
        "Diabetic Care": ["Diabetic Care"],
        "Hair & Skin": ["Vitamins & Minerals","Women's Health"],
      };
      const cats = new Set(goals.flatMap(g => goalMap[g] || []));
      const filtered = PRODUCTS.filter(p => cats.has(p.category));
      const sorted = filtered.sort((a, b) => b.rating - a.rating);
      setRecs(sorted.slice(0, 8));
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  if (step === 3) return (
    <div className="ai-page">
      <div className="ai-header">
        <div className="eyebrow">Personalised For You</div>
        <div className="ai-title">YOUR PICKS</div>
        <div className="ai-subtitle">Based on your goals: {goals.join(", ")}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {recs.map(p => {
          const best = [...p.prices].sort((a, b) => a.price - b.price)[0];
          return (
            <div key={p.id} style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--card)", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, background: "var(--bg3)", borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0 }}>
                {p.image.startsWith("http") ? (
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 28 }}>{p.image}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{p.brand} · {p.category}</div>
                <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>from ₹{best?.price} on {best?.site}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>⭐ {p.rating}</div>
            </div>
          );
        })}
      </div>
      <button className="btn-secondary" style={{ marginTop: 24, width: "100%" }} onClick={() => { setStep(0); setGoals([]); setConcerns([]); setDiet("") }}>
        Start Over
      </button>
    </div>
  );

  return (
    <div className="ai-page">
      <div className="ai-header">
        <div className="eyebrow">Step {step + 1} of 3</div>
        <div className="ai-title">AI ADVISOR</div>
        <div className="ai-subtitle">Get personalised supplement recommendations</div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
          <div>Analysing your profile...</div>
        </div>
      )}

      {!loading && step === 0 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>What are your health goals?</div>
          <div className="ai-chips">
            {GOALS.map(g => (
              <button key={g} className={`ai-chip${goals.includes(g) ? " selected" : ""}`}
                onClick={() => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}>
                {g}
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ marginTop: 24 }} disabled={goals.length === 0} onClick={() => setStep(1)}>
            Next →
          </button>
        </div>
      )}

      {!loading && step === 1 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Any concerns or preferences?</div>
          <div className="ai-chips">
            {CONCERNS.map(c => (
              <button key={c} className={`ai-chip${concerns.includes(c) ? " selected" : ""}`}
                onClick={() => setConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}>
                {c}
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => setStep(2)}>
            Next →
          </button>
        </div>
      )}

      {!loading && step === 2 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>What&apos;s your diet type?</div>
          <div className="ai-chips">
            {DIETS.map(d => (
              <button key={d} className={`ai-chip${diet === d ? " selected" : ""}`} onClick={() => setDiet(d)}>
                {d}
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ marginTop: 24 }} disabled={!diet} onClick={getRecommendations}>
            Get My Picks 🌿
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main App ──
export default function MedTrackerApp() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [theme, setTheme] = useState("dark");

  // Load theme from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("medtracker-theme");
      if (saved) setTheme(saved);
    } catch {}
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("medtracker-theme", theme) } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const handleSearchSubmit = () => { setPage("search") };

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  const renderPage = () => {
    switch (page) {
      case "home": return <Home setPage={setPage} setSelectedProduct={setSelectedProduct} setSearchQ={setSearchQ} />;
      case "search": return <Search setPage={setPage} setSelectedProduct={setSelectedProduct} initialQ={searchQ} />;
      case "product": return selectedProduct
        ? <ProductPage product={selectedProduct} cart={cart} setCart={setCart} setPage={setPage} />
        : <div className="empty-state">Product not found</div>;
      case "compare": return <Compare setPage={setPage} setSelectedProduct={setSelectedProduct} />;
      case "categories": return <Categories setPage={setPage} setSearchQ={setSearchQ} />;
      case "cart": return <Cart cart={cart} setCart={setCart} />;
      case "ai": return <AiAdvisor />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <Cursor />
      <div className="page-container">
        <Nav
          page={page}
          setPage={setPage}
          cartCount={cartCount}
          searchQ={searchQ}
          setSearchQ={setSearchQ}
          onSearchSubmit={handleSearchSubmit}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        {renderPage()}
      </div>
      <FloatingChatbot />
    </>
  );
}
