"use client";
import { useState, useEffect, useRef, useCallback } from "react";

type Page = "home" | "search" | "product" | "compare" | "categories" | "cart";

interface Product {
  id: string; name: string; brand: string; category: string;
  image: string; tag?: string;
  prices: { site: string; price: number; mrp: number; link: string; inStock: boolean; delivery: string; color: string }[];
  rating: number; reviews: number; description: string; highlights: string[];
}
interface CartItem { product: Product; site: string; qty: number }

const PRODUCTS: Product[] = [
  {
    id:"p1", name:"Himalaya Ashwagandha 60 Capsules", brand:"Himalaya", category:"Supplements", image:"🌿", tag:"Bestseller",
    prices:[
      {site:"1mg",price:185,mrp:225,link:"#",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:195,mrp:225,link:"#",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:199,mrp:225,link:"#",inStock:true,delivery:"2 days",color:"#805ad5"},
      {site:"Apollo",price:210,mrp:225,link:"#",inStock:false,delivery:"3 days",color:"#2b6cb0"},
    ],
    rating:4.6, reviews:3241,
    description:"Himalaya Ashwagandha helps manage stress and promotes vitality. Pure root extract standardized to 2.5% withanolides for consistent potency.",
    highlights:["Stress & anxiety relief","Boosts energy & vitality","Improves sleep quality","No added sugar","Vegetarian capsules"],
  },
  {
    id:"p2", name:"MuscleBlaze Whey Gold 1kg Chocolate", brand:"MuscleBlaze", category:"Protein", image:"💪", tag:"Hot Deal",
    prices:[
      {site:"HealthKart",price:1799,mrp:2499,link:"#",inStock:true,delivery:"Today",color:"#dd6b20"},
      {site:"Amazon",price:1899,mrp:2499,link:"#",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"Flipkart",price:1950,mrp:2499,link:"#",inStock:true,delivery:"2 days",color:"#4299e1"},
      {site:"1mg",price:2100,mrp:2499,link:"#",inStock:true,delivery:"3 days",color:"#e53e3e"},
    ],
    rating:4.4, reviews:8762,
    description:"25g protein per serving with 5.5g BCAAs. Informed Sport certified for purity. Ideal for muscle recovery and lean muscle growth post-workout.",
    highlights:["25g protein/serving","5.5g BCAAs","Informed Sport certified","Low sugar","Digestive enzymes added"],
  },
  {
    id:"p3", name:"Vitamin D3 + K2 60 Softgels", brand:"HealthVit", category:"Vitamins", image:"☀️",
    prices:[
      {site:"1mg",price:349,mrp:499,link:"#",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:369,mrp:499,link:"#",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:389,mrp:499,link:"#",inStock:false,delivery:"3 days",color:"#805ad5"},
    ],
    rating:4.5, reviews:1893,
    description:"Combined D3 and K2 formula for optimal calcium absorption and bone health. 2000 IU D3 + 90mcg K2 per softgel.",
    highlights:["2000 IU Vitamin D3","90mcg Vitamin K2","Improves bone density","Supports heart health","Easy to swallow softgel"],
  },
  {
    id:"p4", name:"Omega-3 Fish Oil 1000mg 60 Caps", brand:"Now Foods", category:"Supplements", image:"🐟", tag:"Top Rated",
    prices:[
      {site:"HealthKart",price:499,mrp:699,link:"#",inStock:true,delivery:"Today",color:"#dd6b20"},
      {site:"Amazon",price:529,mrp:699,link:"#",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"1mg",price:549,mrp:699,link:"#",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"Flipkart",price:579,mrp:699,link:"#",inStock:true,delivery:"2 days",color:"#4299e1"},
    ],
    rating:4.7, reviews:5420,
    description:"Premium quality fish oil with 300mg EPA + DHA per softgel. Molecularly distilled for purity with no fishy aftertaste.",
    highlights:["300mg EPA+DHA","Molecularly distilled","No fishy burps","Heart health support","Brain & cognitive support"],
  },
  {
    id:"p5", name:"Creatine Monohydrate 250g Unflavored", brand:"AS-IT-IS", category:"Protein", image:"⚡",
    prices:[
      {site:"Amazon",price:449,mrp:599,link:"#",inStock:true,delivery:"Today",color:"#f6ad55"},
      {site:"HealthKart",price:469,mrp:599,link:"#",inStock:true,delivery:"Tomorrow",color:"#dd6b20"},
      {site:"Flipkart",price:489,mrp:599,link:"#",inStock:true,delivery:"2 days",color:"#4299e1"},
    ],
    rating:4.5, reviews:12340,
    description:"100% pure micronized creatine monohydrate. No additives, no fillers. Enhances strength, power output and muscle volumization.",
    highlights:["100% pure creatine","Micronized for absorption","5g per serving","Vegan-friendly","Lab tested & certified"],
  },
  {
    id:"p6", name:"Biotin 10000mcg 90 Tablets", brand:"TrueBasics", category:"Vitamins", image:"✨", tag:"New",
    prices:[
      {site:"1mg",price:299,mrp:449,link:"#",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:319,mrp:449,link:"#",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:329,mrp:449,link:"#",inStock:true,delivery:"2 days",color:"#805ad5"},
      {site:"Apollo",price:349,mrp:449,link:"#",inStock:true,delivery:"2 days",color:"#2b6cb0"},
    ],
    rating:4.3, reviews:2876,
    description:"High potency Biotin supports hair growth, strengthens nails and promotes healthy skin. Vegetarian tablets with optimal absorption.",
    highlights:["10000mcg Biotin","Hair growth support","Nail strengthening","Skin health booster","100% Vegetarian"],
  },
];

const CATEGORIES = [
  {name:"Vitamins & Minerals",icon:"💊",count:0,grad:"from-amber-500/20 to-orange-600/10"},
  {name:"Protein & Fitness",icon:"💪",count:0,grad:"from-blue-500/20 to-cyan-600/10"},
  {name:"Supplements",icon:"🌿",count:0,grad:"from-green-500/20 to-emerald-600/10"},
  {name:"Ayurvedic",icon:"🍃",count:0,grad:"from-violet-500/20 to-purple-600/10"},
  {name:"Weight Management",icon:"⚖️",count:0,grad:"from-red-500/20 to-pink-600/10"},
  {name:"Women's Health",icon:"🌸",count:0,grad:"from-pink-500/20 to-rose-600/10"},
  {name:"Diabetic Care",icon:"🩸",count:0,grad:"from-red-600/20 to-red-800/10"},
  {name:"Heart Health",icon:"❤️",count:0,grad:"from-red-400/20 to-red-600/10"},
];

const SITES = ["1mg","PharmEasy","Netmeds","Apollo","HealthKart","Amazon","Flipkart"];
const disc = (p:number,m:number)=>Math.round(((m-p)/m)*100);

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#050709;
  --bg2:#080b10;
  --bg3:#0c1018;
  --surface:#0f131c;
  --surface2:#141a26;
  --surface3:#1a2030;
  --glass:rgba(15,19,28,0.72);
  --glass2:rgba(20,26,38,0.6);
  --border:rgba(255,255,255,0.055);
  --border2:rgba(255,255,255,0.1);
  --border3:rgba(255,255,255,0.18);
  --text:#eef2ff;
  --text2:#7a869e;
  --text3:#3d4a5c;
  --accent:#4f94f8;
  --accent2:#2a6be8;
  --accent3:#1a4fc4;
  --accent-glow:rgba(79,148,248,0.22);
  --accent-glow2:rgba(79,148,248,0.08);
  --green:#00e5a0;
  --green2:#00b87d;
  --green-glow:rgba(0,229,160,0.18);
  --red:#ff5f6d;
  --orange:#ffab40;
  --purple:#a78bfa;
  --cyan:#22d3ee;
  --nav-h:58px;
  --font:'Outfit',sans-serif;
  --mono:'DM Mono',monospace;
  --r:16px;
  --r2:12px;
  --r3:8px;
  --ease:cubic-bezier(0.22,1,0.36,1);
}

html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;overflow-x:hidden;font-feature-settings:'ss01','cv01'}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--surface3);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:var(--border2)}
a{text-decoration:none;color:inherit}
button{font-family:var(--font);cursor:pointer;border:none;background:none}

/* ── NOISE OVERLAY ── */
.mt-noise{
  position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat:repeat;background-size:180px 180px;
}

/* ── GRID OVERLAY ── */
.mt-grid-bg{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
  background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%);
}

/* ── AMBIENT ORBS ── */
.mt-orb{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0;animation:orbFloat 12s ease-in-out infinite alternate}
@keyframes orbFloat{from{transform:translate(0,0) scale(1)}to{transform:translate(20px,30px) scale(1.05)}}

/* ── NAV ── */
.mt-nav{
  position:sticky;top:0;z-index:200;height:var(--nav-h);
  display:flex;align-items:center;padding:0 1.75rem;gap:1rem;
  background:rgba(5,7,9,0.8);backdrop-filter:blur(24px) saturate(180%);
  border-bottom:1px solid var(--border);
  animation:navSlide 0.7s var(--ease) both;
}
@keyframes navSlide{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}

.mt-logo{display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0;}
.mt-logo-mark{
  width:32px;height:32px;border-radius:9px;position:relative;
  background:linear-gradient(135deg,var(--accent),var(--accent3));
  display:flex;align-items:center;justify-content:center;font-size:14px;
  box-shadow:0 0 24px var(--accent-glow),0 0 0 1px rgba(79,148,248,0.3);
}
.mt-logo-text{font-size:16px;font-weight:800;letter-spacing:-0.04em;
  background:linear-gradient(90deg,var(--text) 40%,#90b8ff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mt-logo-dot{color:var(--accent);-webkit-text-fill-color:var(--accent)}

.mt-nav-search{
  flex:1;max-width:480px;display:flex;align-items:center;
  background:var(--surface);border:1px solid var(--border2);
  border-radius:var(--r2);padding:0 12px;gap:8px;height:36px;
  transition:border-color 0.25s,box-shadow 0.25s;
}
.mt-nav-search:focus-within{border-color:rgba(79,148,248,0.5);box-shadow:0 0 0 3px var(--accent-glow2)}
.mt-nav-search input{flex:1;background:none;border:none;outline:none;
  font-family:var(--font);font-size:13px;color:var(--text);font-weight:400}
.mt-nav-search input::placeholder{color:var(--text3)}
.mt-nav-search-btn{
  background:var(--accent);color:#fff;border-radius:7px;
  padding:4px 11px;font-size:12px;font-weight:600;
  transition:all 0.2s;white-space:nowrap;
}
.mt-nav-search-btn:hover{background:var(--accent2);box-shadow:0 0 14px var(--accent-glow)}

.mt-nav-links{display:flex;align-items:center;gap:1px;margin-left:auto;flex-shrink:0}
.mt-nav-link{
  padding:6px 11px;border-radius:9px;font-size:13px;font-weight:500;
  color:var(--text2);transition:all 0.2s var(--ease);cursor:pointer;display:flex;align-items:center;gap:5px;
  position:relative;letter-spacing:-0.01em;
}
.mt-nav-link:hover{color:var(--text);background:rgba(255,255,255,0.05)}
.mt-nav-link.active{color:var(--text);background:rgba(255,255,255,0.06)}
.mt-nav-link.active::after{content:'';position:absolute;bottom:-1px;left:11px;right:11px;height:1.5px;background:var(--accent);border-radius:2px;box-shadow:0 0 8px var(--accent-glow)}
.mt-cart-badge{
  background:var(--red);color:#fff;border-radius:100px;
  font-size:9px;font-weight:700;padding:1px 5px;min-width:16px;text-align:center;
  animation:popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes popIn{from{transform:scale(0)}to{transform:scale(1)}}

/* ── HERO ── */
.mt-hero{
  position:relative;z-index:1;padding:7rem 2rem 5rem;text-align:center;
  overflow:hidden;
}
.mt-hero::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(79,148,248,0.12) 0%,transparent 70%);
  pointer-events:none;
}
.mt-hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(79,148,248,0.08);border:1px solid rgba(79,148,248,0.18);
  border-radius:100px;padding:5px 16px;font-size:11px;font-weight:600;
  color:var(--accent);letter-spacing:0.1em;text-transform:uppercase;
  margin-bottom:2.25rem;
  animation:fadeUp 0.7s 0.1s var(--ease) both;
}
.mt-hero-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);animation:pulse 1.8s infinite;box-shadow:0 0 6px var(--accent-glow)}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.6)}}

.mt-hero h1{
  font-size:clamp(3rem,6.5vw,5.5rem);font-weight:900;line-height:1.02;
  letter-spacing:-0.05em;margin-bottom:1.5rem;
  animation:fadeUp 0.7s 0.2s var(--ease) both;
}
.mt-hero h1 .line1{
  background:linear-gradient(160deg,var(--text) 0%,rgba(238,242,255,0.7) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  display:block;
}
.mt-hero h1 .line2{
  background:linear-gradient(90deg,var(--accent) 0%,var(--cyan) 50%,var(--green) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  display:block;background-size:200%;
  animation:shimmer 4s linear infinite;
}
@keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}

.mt-hero p{
  font-size:16px;font-weight:400;color:var(--text2);max-width:440px;margin:0 auto 2.75rem;
  line-height:1.75;animation:fadeUp 0.7s 0.3s var(--ease) both;letter-spacing:-0.01em;
}

.mt-hero-search{
  max-width:600px;margin:0 auto;
  background:var(--glass);border:1px solid var(--border2);
  border-radius:18px;padding:5px;display:flex;gap:5px;align-items:center;
  box-shadow:0 0 80px rgba(79,148,248,0.1),0 32px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06);
  transition:border-color 0.3s,box-shadow 0.3s;
  animation:fadeUp 0.7s 0.35s var(--ease) both;
  backdrop-filter:blur(20px);
}
.mt-hero-search:focus-within{
  border-color:rgba(79,148,248,0.35);
  box-shadow:0 0 100px rgba(79,148,248,0.15),0 0 0 4px rgba(79,148,248,0.07),0 32px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06);
}
.mt-hero-search input{
  flex:1;background:none;border:none;outline:none;
  font-family:var(--font);font-size:15px;color:var(--text);padding:11px 14px;font-weight:400;letter-spacing:-0.01em;
}
.mt-hero-search input::placeholder{color:var(--text3)}
.mt-hero-search-btn{
  background:linear-gradient(135deg,var(--accent),var(--accent3));color:#fff;
  border-radius:13px;padding:13px 26px;font-size:14px;font-weight:700;
  white-space:nowrap;transition:all 0.25s var(--ease);letter-spacing:-0.01em;
  box-shadow:0 4px 24px var(--accent-glow);
}
.mt-hero-search-btn:hover{transform:scale(0.97);box-shadow:0 6px 32px var(--accent-glow)}
.mt-hero-search-btn:active{transform:scale(0.95)}

.mt-hero-stats{
  display:flex;justify-content:center;gap:0;margin-top:3.5rem;flex-wrap:wrap;
  animation:fadeUp 0.7s 0.45s var(--ease) both;
  background:var(--glass);border:1px solid var(--border);border-radius:var(--r);
  max-width:520px;margin:3.5rem auto 0;padding:0;
  backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);overflow:hidden;
}
.mt-stat{text-align:center;flex:1;padding:1.25rem 1rem;position:relative}
.mt-stat+.mt-stat{border-left:1px solid var(--border)}
.mt-stat-num{
  font-size:24px;font-weight:900;letter-spacing:-0.05em;
  background:linear-gradient(135deg,var(--text),#90b8ff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  line-height:1;
}
.mt-stat-label{font-size:11px;color:var(--text3);margin-top:4px;font-weight:500;letter-spacing:0.02em}

/* ── TRUST BAR ── */
.mt-trust{
  position:relative;z-index:1;
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
  background:linear-gradient(90deg,var(--bg2),var(--bg3),var(--bg2));
  padding:0.9rem 2rem;
  display:flex;align-items:center;justify-content:center;gap:2.5rem;overflow-x:auto;
}
.mt-trust-item{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:500;color:var(--text2);white-space:nowrap;letter-spacing:-0.01em}

/* ── SECTIONS ── */
.mt-section{position:relative;z-index:1;padding:3rem 2rem;max-width:1240px;margin:0 auto;width:100%}
.mt-section-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.75rem}
.mt-section-title{font-size:22px;font-weight:800;letter-spacing:-0.04em}
.mt-section-title em{font-style:normal;
  background:linear-gradient(90deg,var(--accent),var(--cyan));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mt-section-link{font-size:12px;color:var(--accent);font-weight:600;cursor:pointer;transition:opacity 0.2s;letter-spacing:-0.01em}
.mt-section-link:hover{opacity:0.65}
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mt-section-link{font-size:12px;color:var(--accent);font-weight:600;cursor:pointer;transition:opacity 0.2s;letter-spacing:-0.01em}
.mt-section-link:hover{opacity:0.65}

/* ── CATEGORIES ── */
.mt-cats{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.mt-cat{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:1.4rem 0.75rem;text-align:center;cursor:pointer;
  transition:all 0.3s var(--ease);
  display:flex;flex-direction:column;align-items:center;gap:8px;
  position:relative;overflow:hidden;
}
.mt-cat::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(79,148,248,0.06),transparent 70%);opacity:0;transition:opacity 0.3s}
.mt-cat:hover{border-color:var(--border2);background:var(--surface2);transform:translateY(-5px) scale(1.02);box-shadow:0 16px 48px rgba(0,0,0,0.4),0 0 0 1px rgba(79,148,248,0.08)}
.mt-cat:hover::before{opacity:1}
.mt-cat:active{transform:translateY(-2px) scale(1.00)}
.mt-cat-icon{font-size:28px;line-height:1;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.4))}
.mt-cat-name{font-size:11px;font-weight:700;color:var(--text);line-height:1.3;letter-spacing:-0.01em}
.mt-cat-count{font-size:10px;color:var(--text3);font-family:var(--mono)}

/* ── PRODUCT CARDS ── */
.mt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.mt-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  overflow:hidden;cursor:pointer;
  transition:all 0.35s var(--ease);
  display:flex;flex-direction:column;position:relative;
}
.mt-card::before{
  content:'';position:absolute;inset:0;border-radius:var(--r);
  background:linear-gradient(135deg,rgba(79,148,248,0.07),rgba(0,229,160,0.03) 60%,transparent);
  opacity:0;transition:opacity 0.35s;pointer-events:none;
}
.mt-card::after{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(79,148,248,0.4),transparent);
  opacity:0;transition:opacity 0.35s;
}
.mt-card:hover{
  border-color:rgba(79,148,248,0.2);transform:translateY(-7px) scale(1.01);
  box-shadow:0 28px 72px rgba(0,0,0,0.5),0 0 0 1px rgba(79,148,248,0.12);
}
.mt-card:hover::before{opacity:1}
.mt-card:hover::after{opacity:1}
.mt-card:active{transform:translateY(-3px) scale(1.005)}
.mt-card-img{
  aspect-ratio:1;
  background:radial-gradient(ellipse at center,var(--surface2),var(--surface));
  display:flex;align-items:center;justify-content:center;font-size:56px;
  position:relative;border-bottom:1px solid var(--border);
}
.mt-card-tag{
  position:absolute;top:10px;left:10px;
  border-radius:7px;padding:3px 9px;font-size:9px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
  backdrop-filter:blur(8px);
}
.mt-card-tag.deal{background:rgba(255,171,64,0.15);color:var(--orange);border:1px solid rgba(255,171,64,0.25)}
.mt-card-tag.best{background:rgba(0,229,160,0.12);color:var(--green);border:1px solid rgba(0,229,160,0.22)}
.mt-card-tag.new{background:rgba(167,139,250,0.15);color:var(--purple);border:1px solid rgba(167,139,250,0.25)}
.mt-card-body{padding:14px;flex:1;display:flex;flex-direction:column;gap:5px}
.mt-card-brand{font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.1em;font-family:var(--mono)}
.mt-card-name{font-size:13px;font-weight:600;color:var(--text);line-height:1.35;letter-spacing:-0.01em}
.mt-card-rating{display:flex;align-items:center;gap:5px}
.mt-card-stars{color:var(--orange);font-size:11px}
.mt-card-rnum{font-size:11px;font-weight:700;color:var(--text);font-family:var(--mono)}
.mt-card-rcnt{font-size:10px;color:var(--text3)}
.mt-card-price-row{display:flex;align-items:baseline;gap:6px;margin-top:auto;padding-top:8px}
.mt-card-price{font-size:19px;font-weight:900;letter-spacing:-0.04em;font-family:var(--mono)}
.mt-card-mrp{font-size:11px;color:var(--text3);text-decoration:line-through;font-family:var(--mono)}
.mt-card-disc{font-size:11px;font-weight:700;color:var(--green)}
.mt-card-sites{font-size:10px;color:var(--text3);margin-top:2px;letter-spacing:0.01em}
.mt-card-cta{
  background:rgba(79,148,248,0.08);color:var(--accent);border-radius:10px;
  padding:9px 12px;font-size:12px;font-weight:700;width:100%;margin-top:8px;
  transition:all 0.25s var(--ease);border:1px solid rgba(79,148,248,0.14);letter-spacing:-0.01em;
}
.mt-card-cta:hover{background:var(--accent);color:#fff;border-color:transparent;box-shadow:0 6px 20px var(--accent-glow)}

/* ── SITES STRIP ── */
.mt-sites-strip{
  background:var(--glass);border:1px solid var(--border);border-radius:var(--r);
  padding:1.2rem 1.75rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;
  backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.04);
}
.mt-sites-label{font-size:10px;font-weight:700;color:var(--text3);letter-spacing:0.1em;text-transform:uppercase;margin-right:0.25rem}
.mt-site-pill{
  background:var(--surface2);border:1px solid var(--border);border-radius:100px;
  padding:5px 14px;font-size:12px;font-weight:600;color:var(--text2);
  transition:all 0.2s var(--ease);cursor:pointer;font-family:var(--mono);letter-spacing:-0.01em;
}
.mt-site-pill:hover{border-color:rgba(79,148,248,0.4);color:var(--accent);background:rgba(79,148,248,0.07)}

/* ── SEARCH PAGE ── */
.mt-search-layout{display:flex;gap:1.5rem;max-width:1240px;margin:0 auto;padding:1.5rem 2rem;width:100%;position:relative;z-index:1}
.mt-sidebar{width:230px;flex-shrink:0;display:flex;flex-direction:column;gap:10px;align-self:start;position:sticky;top:calc(var(--nav-h) + 1rem)}
.mt-filter-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:1rem 1.1rem}
.mt-filter-title{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;font-family:var(--mono)}
.mt-filter-opt{display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;transition:opacity 0.2s}
.mt-filter-opt:hover{opacity:0.8}
.mt-filter-cb{
  width:15px;height:15px;border:1.5px solid var(--border2);border-radius:4px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;
}
.mt-filter-cb.on{background:var(--accent);border-color:var(--accent)}
.mt-filter-cb.on::after{content:'✓';color:#fff;font-size:9px;font-weight:700}
.mt-filter-label{font-size:12px;color:var(--text2);letter-spacing:-0.01em}
.mt-filter-cnt{font-size:10px;color:var(--text3);margin-left:auto;font-family:var(--mono)}

.mt-results-area{flex:1;min-width:0}
.mt-results-bar{
  display:flex;align-items:center;justify-content:space-between;
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:10px 14px;margin-bottom:12px;
}
.mt-results-count{font-size:13px;font-weight:600;color:var(--text);letter-spacing:-0.02em}
.mt-results-count span{color:var(--text3);font-weight:400}
.mt-sort{
  background:var(--surface2);border:1px solid var(--border);border-radius:var(--r3);
  padding:5px 10px;font-family:var(--font);font-size:12px;color:var(--text);cursor:pointer;outline:none;
}

.mt-result-row{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:1.2rem;margin-bottom:10px;display:flex;gap:1rem;align-items:flex-start;
  cursor:pointer;transition:all 0.3s var(--ease);
  animation:fadeUp 0.4s var(--ease) both;position:relative;overflow:hidden;
}
.mt-result-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--accent);transform:scaleY(0);transition:transform 0.3s var(--ease);border-radius:0 2px 2px 0}
.mt-result-row:hover{box-shadow:0 16px 48px rgba(0,0,0,0.4),0 0 0 1px rgba(79,148,248,0.1);border-color:rgba(79,148,248,0.15);transform:translateX(2px)}
.mt-result-row:hover::before{transform:scaleY(1)}
.mt-result-img{
  width:80px;height:80px;background:radial-gradient(ellipse at center,var(--surface2),var(--surface));border-radius:var(--r2);
  display:flex;align-items:center;justify-content:center;font-size:36px;flex-shrink:0;
  border:1px solid var(--border);
}
.mt-result-info{flex:1;min-width:0}
.mt-result-brand{font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.1em;font-family:var(--mono)}
.mt-result-name{font-size:15px;font-weight:700;color:var(--text);margin:3px 0 6px;line-height:1.3;letter-spacing:-0.02em}
.mt-result-rating-chip{
  display:inline-flex;align-items:center;gap:4px;
  background:rgba(0,229,160,0.08);color:var(--green);border:1px solid rgba(0,229,160,0.18);
  border-radius:6px;padding:2px 8px;font-size:11px;font-weight:700;font-family:var(--mono);
}
.mt-result-rcnt{font-size:11px;color:var(--text3);margin-left:6px}
.mt-result-highlights{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
.mt-result-hl{
  background:var(--surface2);border:1px solid var(--border);border-radius:5px;
  padding:2px 8px;font-size:10px;font-weight:500;color:var(--text2);letter-spacing:-0.01em;
}
.mt-result-prices{display:flex;flex-direction:column;align-items:flex-end;gap:7px;min-width:155px}
.mt-result-from{font-size:10px;color:var(--text3);font-family:var(--mono)}
.mt-result-big{font-size:22px;font-weight:900;letter-spacing:-0.04em;font-family:var(--mono)}
.mt-result-sub{display:flex;align-items:center;justify-content:flex-end;gap:4px}
.mt-result-mrp{font-size:11px;color:var(--text3);text-decoration:line-through;font-family:var(--mono)}
.mt-result-disc{font-size:11px;font-weight:700;color:var(--green)}
.mt-result-sitecnt{font-size:10px;color:var(--text3);font-family:var(--mono)}
.mt-result-btns{display:flex;gap:7px}
.mt-result-view{
  background:var(--surface2);color:var(--text2);border:1px solid var(--border);
  border-radius:var(--r3);padding:8px 13px;font-size:12px;font-weight:600;
  transition:all 0.2s var(--ease);white-space:nowrap;
}
.mt-result-view:hover{border-color:rgba(79,148,248,0.4);color:var(--accent)}
.mt-result-add{
  background:var(--accent);color:#fff;border-radius:var(--r3);
  padding:8px 13px;font-size:12px;font-weight:600;transition:all 0.2s var(--ease);white-space:nowrap;
  box-shadow:0 0 0 0 var(--accent-glow);
}
.mt-result-add:hover{background:var(--accent2);box-shadow:0 4px 16px var(--accent-glow)}
.mt-result-add:active{transform:scale(0.97)}

/* ── PRODUCT PAGE ── */
.mt-product-layout{max-width:1240px;margin:0 auto;padding:1.75rem 2rem;display:flex;gap:2rem;position:relative;z-index:1}
.mt-product-left{flex:1;min-width:0}
.mt-product-right{width:310px;flex-shrink:0;position:sticky;top:calc(var(--nav-h) + 1rem);align-self:start}
.mt-breadcrumb{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3);margin-bottom:1.5rem;font-family:var(--mono)}
.mt-breadcrumb span{cursor:pointer;transition:color 0.2s}
.mt-breadcrumb span:hover{color:var(--accent)}
.mt-breadcrumb-sep{color:var(--border2)}

.mt-product-img-wrap{
  background:radial-gradient(ellipse at 40% 40%,var(--surface2),var(--surface));
  border:1px solid var(--border);border-radius:var(--r);
  aspect-ratio:1;max-height:300px;display:flex;align-items:center;justify-content:center;
  font-size:90px;margin-bottom:1.25rem;
  position:relative;overflow:hidden;
}
.mt-product-img-wrap::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 30% 30%,rgba(79,148,248,0.09) 0%,transparent 60%);
}
.mt-product-detail-brand{font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.12em;font-family:var(--mono)}
.mt-product-detail-name{font-size:24px;font-weight:900;letter-spacing:-0.04em;line-height:1.2;margin:6px 0 10px;color:var(--text)}
.mt-product-detail-rtg{display:flex;align-items:center;gap:10px}
.mt-rtg-chip{background:var(--green2);color:#fff;border-radius:8px;padding:4px 10px;font-size:13px;font-weight:700;font-family:var(--mono);display:flex;align-items:center;gap:4px}
.mt-rtg-cnt{font-size:12px;color:var(--text3)}
.mt-product-desc{font-size:13px;color:var(--text2);line-height:1.8;margin:1rem 0;letter-spacing:-0.005em}
.mt-highlights-list{display:flex;flex-direction:column;gap:8px;margin:0.75rem 0}
.mt-hl-item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text2)}
.mt-hl-dot{width:6px;height:6px;background:var(--green);border-radius:50%;flex-shrink:0;box-shadow:0 0 8px var(--green-glow)}

/* Price table */
.mt-price-table{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-top:1.75rem}
.mt-price-table-hd{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.mt-price-table-title{font-size:15px;font-weight:800;letter-spacing:-0.03em}
.mt-price-table-sub{font-size:11px;color:var(--text3);font-family:var(--mono)}
.mt-price-row{display:flex;align-items:center;padding:13px 16px;border-bottom:1px solid var(--border);gap:12px;transition:background 0.2s}
.mt-price-row:last-child{border-bottom:none}
.mt-price-row:hover{background:rgba(255,255,255,0.02)}
.mt-price-row.best{background:rgba(79,148,248,0.04)}
.mt-price-row.best:hover{background:rgba(79,148,248,0.08)}
.mt-price-row-rank{font-size:11px;font-weight:700;color:var(--text3);width:18px;flex-shrink:0;font-family:var(--mono)}
.mt-price-row-site{flex:1}
.mt-price-row-site-name{font-size:13px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:7px;letter-spacing:-0.01em}
.mt-best-badge{
  background:rgba(0,229,160,0.1);color:var(--green);border:1px solid rgba(0,229,160,0.2);
  border-radius:5px;padding:2px 7px;font-size:9px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
}
.mt-price-row-delivery{font-size:10px;color:var(--green);font-weight:500;margin-top:2px}
.mt-price-row-delivery.slow{color:var(--text3)}
.mt-price-row-price{text-align:right}
.mt-price-big{font-size:17px;font-weight:900;color:var(--text);font-family:var(--mono);letter-spacing:-0.03em}
.mt-price-disc{font-size:10px;font-weight:700;color:var(--green)}
.mt-price-oos{font-size:11px;color:var(--red)}
.mt-buy-row-btn{
  background:var(--accent);color:#fff;border-radius:var(--r3);
  padding:7px 14px;font-size:12px;font-weight:600;transition:all 0.2s var(--ease);white-space:nowrap;
}
.mt-buy-row-btn:hover{background:var(--accent2);box-shadow:0 4px 14px var(--accent-glow)}
.mt-notify-btn{
  background:var(--surface2);color:var(--text3);border:1px solid var(--border);
  border-radius:var(--r3);padding:7px 14px;font-size:12px;font-weight:600;
}

/* Buy card */
.mt-buy-card{
  background:var(--glass);border:1px solid var(--border2);border-radius:var(--r);
  overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.07);
  backdrop-filter:blur(20px);
}
.mt-buy-card-hd{padding:18px 16px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,rgba(79,148,248,0.07),transparent)}
.mt-buy-card-best{font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;font-family:var(--mono)}
.mt-buy-price{font-size:32px;font-weight:900;letter-spacing:-0.05em;color:var(--text);font-family:var(--mono)}
.mt-buy-sub{display:flex;align-items:center;gap:6px;margin-top:5px}
.mt-buy-mrp{font-size:12px;color:var(--text3);text-decoration:line-through;font-family:var(--mono)}
.mt-buy-disc{font-size:12px;font-weight:700;color:var(--green)}
.mt-buy-site{font-size:12px;color:var(--text2);margin-top:5px;letter-spacing:-0.01em}
.mt-buy-card-body{padding:16px;display:flex;flex-direction:column;gap:9px}
.mt-buy-delivery{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--green);font-weight:500}
.mt-buy-info{font-size:11px;color:var(--text3)}
.mt-buy-now{
  background:linear-gradient(135deg,var(--accent),var(--accent3));color:#fff;
  border-radius:11px;padding:14px;font-size:14px;font-weight:700;width:100%;
  transition:all 0.25s var(--ease);box-shadow:0 4px 24px var(--accent-glow);letter-spacing:-0.01em;
}
.mt-buy-now:hover{box-shadow:0 8px 36px var(--accent-glow);transform:translateY(-1px)}
.mt-buy-now:active{transform:translateY(0)}
.mt-buy-cart{
  background:transparent;color:var(--accent);border:1.5px solid rgba(79,148,248,0.35);
  border-radius:11px;padding:12px;font-size:14px;font-weight:700;width:100%;transition:all 0.2s var(--ease);letter-spacing:-0.01em;
}
.mt-buy-cart:hover{background:rgba(79,148,248,0.07);border-color:rgba(79,148,248,0.5)}
.mt-buy-compare{
  background:rgba(167,139,250,0.08);color:var(--purple);border:1px solid rgba(167,139,250,0.18);
  border-radius:11px;padding:10px;font-size:13px;font-weight:600;width:100%;transition:all 0.2s;
}
.mt-buy-compare:hover{background:rgba(167,139,250,0.15)}

/* Savings banner */
.mt-savings{
  background:linear-gradient(90deg,rgba(0,229,160,0.08),rgba(0,229,160,0.04));
  border:1px solid rgba(0,229,160,0.14);border-radius:var(--r2);
  padding:12px 16px;display:flex;align-items:center;gap:10px;margin-bottom:1rem;
  animation:fadeUp 0.3s var(--ease) both;
}
.mt-savings strong{color:var(--green);font-weight:800}

/* ── COMPARE PAGE ── */
.mt-compare-page{max-width:1240px;margin:0 auto;padding:1.75rem 2rem;position:relative;z-index:1}
.mt-compare-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem}
.mt-page-title{font-size:22px;font-weight:900;letter-spacing:-0.04em}
.mt-compare-cards{display:grid;gap:12px;margin-bottom:16px}
.mt-compare-product-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:1rem;text-align:center;position:relative;
  transition:border-color 0.2s;
}
.mt-compare-product-card:hover{border-color:var(--border2)}
.mt-compare-rm{
  position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;
  background:var(--surface2);border:1px solid var(--border);font-size:10px;color:var(--text3);
  display:flex;align-items:center;justify-content:center;transition:all 0.2s;
}
.mt-compare-rm:hover{background:rgba(255,95,109,0.15);color:var(--red);border-color:rgba(255,95,109,0.3)}
.mt-compare-table-wrap{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:auto}
.mt-compare-table{width:100%;border-collapse:collapse;min-width:500px}
.mt-compare-table th{padding:12px 14px;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;background:var(--surface2);border-bottom:1px solid var(--border);text-align:left;font-family:var(--mono)}
.mt-compare-table td{padding:12px 14px;font-size:13px;color:var(--text2);border-bottom:1px solid var(--border);vertical-align:top}
.mt-compare-table tr:last-child td{border-bottom:none}
.mt-compare-table tr:hover td{background:rgba(255,255,255,0.012)}
.mt-compare-table td.hl{color:var(--green);font-weight:700}
.mt-attr-label{font-size:12px;font-weight:600;color:var(--text);width:160px;letter-spacing:-0.01em}

/* ── CATEGORIES PAGE ── */
.mt-cats-page{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.mt-cat-big{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:1.5rem;cursor:pointer;transition:all 0.3s var(--ease);display:flex;align-items:center;gap:14px;
}
.mt-cat-big:hover{border-color:var(--border2);background:var(--surface2);transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.4)}
.mt-cat-big:active{transform:translateY(-2px)}
.mt-cat-big-icon{font-size:32px;flex-shrink:0;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.5))}
.mt-cat-big-name{font-size:14px;font-weight:700;color:var(--text);letter-spacing:-0.02em}
.mt-cat-big-cnt{font-size:11px;color:var(--text3);margin-top:2px;font-family:var(--mono)}

/* ── CART PAGE ── */
.mt-cart-layout{max-width:1100px;margin:0 auto;padding:1.75rem 2rem;display:flex;gap:1.5rem;position:relative;z-index:1}
.mt-cart-items{flex:1}
.mt-cart-summary{width:280px;flex-shrink:0}
.mt-cart-row{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:1.1rem;margin-bottom:10px;display:flex;gap:1rem;align-items:center;
  transition:border-color 0.2s;animation:fadeUp 0.4s var(--ease) both;
}
.mt-cart-row:hover{border-color:var(--border2)}
.mt-cart-img{width:64px;height:64px;background:radial-gradient(ellipse at center,var(--surface2),var(--surface));border:1px solid var(--border);border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0}
.mt-cart-info{flex:1;min-width:0}
.mt-cart-name{font-size:13px;font-weight:600;color:var(--text);letter-spacing:-0.01em}
.mt-cart-site{font-size:11px;color:var(--text3);margin-top:2px;font-family:var(--mono)}
.mt-cart-price{font-size:17px;font-weight:900;color:var(--text);font-family:var(--mono);letter-spacing:-0.03em}
.mt-qty{display:flex;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r3);overflow:hidden;margin-top:6px;width:fit-content}
.mt-qty-btn{width:30px;height:28px;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--text2);transition:all 0.15s}
.mt-qty-btn:hover{background:var(--surface3);color:var(--text)}
.mt-qty-val{padding:0 8px;font-size:13px;font-weight:700;font-family:var(--mono);border-left:1px solid var(--border);border-right:1px solid var(--border);min-width:32px;text-align:center}
.mt-cart-rm{font-size:11px;color:var(--red);cursor:pointer;margin-top:5px;transition:opacity 0.2s}
.mt-cart-rm:hover{opacity:0.7}
.mt-cart-summary-card{background:var(--glass);border:1px solid var(--border2);border-radius:var(--r);padding:1.2rem;backdrop-filter:blur(16px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05)}
.mt-cart-sum-title{font-size:15px;font-weight:800;margin-bottom:1rem;letter-spacing:-0.03em}
.mt-cart-sum-row{display:flex;justify-content:space-between;font-size:13px;color:var(--text2);padding:6px 0}
.mt-cart-sum-row.total{color:var(--text);font-weight:700;font-size:15px;border-top:1px solid var(--border);margin-top:8px;padding-top:14px}
.mt-checkout{
  background:linear-gradient(135deg,var(--accent),var(--accent3));color:#fff;
  border-radius:11px;padding:14px;font-size:14px;font-weight:700;width:100%;
  text-align:center;margin-top:1rem;transition:all 0.25s var(--ease);
  box-shadow:0 4px 24px var(--accent-glow);letter-spacing:-0.01em;
}
.mt-checkout:hover{box-shadow:0 8px 36px var(--accent-glow);transform:translateY(-1px)}
.mt-savings-note{
  background:rgba(0,229,160,0.07);border:1px solid rgba(0,229,160,0.14);
  border-radius:var(--r3);padding:8px 12px;font-size:12px;font-weight:600;
  color:var(--green);text-align:center;margin-top:10px;
}

/* ── EMPTY ── */
.mt-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:5rem 2rem;text-align:center}
.mt-empty-icon{font-size:52px;filter:grayscale(0.4)}
.mt-empty-title{font-size:20px;font-weight:800;letter-spacing:-0.04em}
.mt-empty-sub{font-size:13px;color:var(--text3);max-width:280px;line-height:1.6}
.mt-empty-btn{
  background:var(--accent);color:#fff;border-radius:10px;padding:11px 24px;
  font-size:13px;font-weight:600;margin-top:0.25rem;transition:all 0.2s var(--ease);
}
.mt-empty-btn:hover{background:var(--accent2);box-shadow:0 4px 16px var(--accent-glow)}

/* ── ADD TO COMPARE BTN ── */
.mt-add-compare{
  background:rgba(167,139,250,0.07);color:var(--purple);border:1px solid rgba(167,139,250,0.16);
  border-radius:var(--r3);padding:7px 13px;font-size:12px;font-weight:600;transition:all 0.2s;letter-spacing:-0.01em;
}
.mt-add-compare:hover{background:rgba(167,139,250,0.15)}

/* ── FOOTER ── */
.mt-footer{
  position:relative;z-index:1;background:var(--bg2);border-top:1px solid var(--border);
  padding:2.75rem 2rem;margin-top:4rem;
}
.mt-footer-inner{max-width:1240px;margin:0 auto;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:2rem}
.mt-footer-brand-name{font-size:15px;font-weight:900;letter-spacing:-0.04em;
  background:linear-gradient(90deg,var(--text),#90b8ff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px}
.mt-footer-desc{font-size:12px;color:var(--text3);max-width:220px;line-height:1.7}
.mt-footer-col-title{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;font-family:var(--mono)}
.mt-footer-link{font-size:12px;color:var(--text3);margin-bottom:8px;cursor:pointer;transition:color 0.2s;display:block;letter-spacing:-0.01em}
.mt-footer-link:hover{color:var(--text2)}
.mt-footer-bottom{max-width:1240px;margin:1.5rem auto 0;border-top:1px solid var(--border);padding-top:1.25rem;font-size:11px;color:var(--text3);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-family:var(--mono)}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

/* Responsive */
@media(max-width:768px){
  .mt-nav{padding:0 1rem;gap:0.5rem}
  .mt-nav-links .mt-nav-link span{display:none}
  .mt-hero{padding:4rem 1.25rem 3rem}
  .mt-section{padding:2rem 1.25rem}
  .mt-search-layout{flex-direction:column;padding:1rem}
  .mt-sidebar{width:100%;position:static}
  .mt-product-layout{flex-direction:column;padding:1rem}
  .mt-product-right{width:100%;position:static}
  .mt-cart-layout{flex-direction:column;padding:1rem}
  .mt-cart-summary{width:100%}
  .mt-hero-stats{gap:0;max-width:100%}
  .mt-result-row{flex-wrap:wrap}
  .mt-result-prices{min-width:auto;width:100%;align-items:flex-start}
}
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
const Stars = ({r}:{r:number}) => (
  <span style={{color:"#f59e0b",fontSize:12,letterSpacing:1}}>
    {"★".repeat(Math.floor(r))}{r%1>=0.5?"½":""}{" "}
  </span>
);

// Ripple hook
function useRipple() {
  const ref = useRef<HTMLButtonElement>(null);
  const createRipple = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size/2;
    const y = e.clientY - rect.top - size/2;
    const ripple = document.createElement("span");
    Object.assign(ripple.style, {
      position:"absolute",width:`${size}px`,height:`${size}px`,
      left:`${x}px`,top:`${y}px`,borderRadius:"50%",
      background:"rgba(255,255,255,0.15)",transform:"scale(0)",
      animation:"ripple 0.5s linear",pointerEvents:"none",
    });
    if (!document.getElementById("ripple-kf")) {
      const s = document.createElement("style"); s.id="ripple-kf";
      s.textContent="@keyframes ripple{to{transform:scale(2.5);opacity:0}}";
      document.head.appendChild(s);
    }
    el.style.position="relative"; el.style.overflow="hidden";
    el.appendChild(ripple);
    setTimeout(()=>ripple.remove(),500);
  };
  return {ref, createRipple};
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({page,setPage,cartCount,sq,setSq,onSearch}:{
  page:Page;setPage:(p:Page)=>void;cartCount:number;
  sq:string;setSq:(v:string)=>void;onSearch:()=>void
}) {
  return (
    <nav className="mt-nav">
      <div className="mt-logo" onClick={()=>setPage("home")}>
        <div className="mt-logo-mark">💊</div>
        <div className="mt-logo-text">Med<span className="mt-logo-dot">Tracker</span></div>
      </div>
      <div className="mt-nav-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{color:"var(--text3)",flexShrink:0}}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search medicines, supplements…" value={sq} onChange={e=>setSq(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearch()}/>
        <button className="mt-nav-search-btn" onClick={onSearch}>Search</button>
      </div>
      <div className="mt-nav-links">
        <div className={`mt-nav-link ${page==="categories"?"active":""}`} onClick={()=>setPage("categories")}><span>Categories</span></div>
        <div className={`mt-nav-link ${page==="compare"?"active":""}`} onClick={()=>setPage("compare")}><span>Compare</span></div>
        <div className={`mt-nav-link ${page==="cart"?"active":""}`} onClick={()=>setPage("cart")}>
          🛒 <span>Cart</span>
          {cartCount>0&&<span key={cartCount} className="mt-cart-badge">{cartCount}</span>}
        </div>
      </div>
    </nav>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function Home({setPage,setSq,setSelectedProduct,setCompareList}:{
  setPage:(p:Page)=>void;setSq:(v:string)=>void;
  setSelectedProduct:(p:Product)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void
}) {
  const [heroQ,setHeroQ]=useState("");
  const doSearch=()=>{if(!heroQ.trim())return;setSq(heroQ);setPage("search")};
  return (
    <div>
      {/* Hero */}
      <div className="mt-hero">
        <div className="mt-hero-eyebrow"><div className="mt-hero-eyebrow-dot"/>India's #1 Health Price Tracker</div>
        <h1>
          <span className="line1">Never Overpay for</span>
          <span className="line2">Your Health Again</span>
        </h1>
        <p>Compare prices across 1mg, PharmEasy, Netmeds, Apollo & more. Real-time. Instant. Free.</p>
        <div className="mt-hero-search">
          <input placeholder="Search whey protein, vitamin D3, omega-3, creatine…" value={heroQ} onChange={e=>setHeroQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} autoFocus/>
          <button className="mt-hero-search-btn" onClick={doSearch}>Compare Now →</button>
        </div>
        <div className="mt-hero-stats">
          {[["0","Products tracked"],["0","Stores compared"],["₹0","Saved this month"],["0","Price updates"]].map(([n,l])=>(
            <div key={l} className="mt-stat"><div className="mt-stat-num">{n}</div><div className="mt-stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div className="mt-trust">
        {[["🔒","100% Genuine"],["⚡","Live Prices"],["🚚","Free Delivery Options"],["💯","Best Price Guarantee"],["📦","7+ Store Sources"]].map(([i,t])=>(
          <div key={t} className="mt-trust-item"><span style={{fontSize:14}}>{i}</span><span>{t}</span></div>
        ))}
      </div>

      {/* Categories */}
      <div className="mt-section">
        <div className="mt-section-hd">
          <div className="mt-section-title">Browse by <em>Category</em></div>
          <div className="mt-section-link" onClick={()=>setPage("categories")}>View all →</div>
        </div>
        <div className="mt-cats">
          {CATEGORIES.map(c=>(
            <div key={c.name} className="mt-cat" onClick={()=>{setSq(c.name);setPage("search")}}>
              <div className="mt-cat-icon">{c.icon}</div>
              <div className="mt-cat-name">{c.name}</div>
              <div className="mt-cat-count">{c.count} items</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sites */}
      <div className="mt-section" style={{paddingTop:0}}>
        <div className="mt-sites-strip">
          <div className="mt-sites-label">Comparing across</div>
          {SITES.map(s=><div key={s} className="mt-site-pill">{s}</div>)}
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-section" style={{paddingTop:0}}>
        <div className="mt-section-hd"><div className="mt-section-title">How <em>It Works</em></div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
          {[
            {step:"01",icon:"🔍",title:"Search any product",desc:"Type a medicine name, supplement brand, or health category. Instant results."},
            {step:"02",icon:"📊",title:"Compare live prices",desc:"We fetch real-time prices across 7+ stores and rank them from cheapest to highest."},
            {step:"03",icon:"🛒",title:"Add to cart",desc:"Pick your preferred store, add to cart, and check out directly from the retailer."},
            {step:"04",icon:"💰",title:"Save every time",desc:"Never pay more than needed. Our tracker finds deals you'd never find manually."},
          ].map(({step,icon,title,desc})=>(
            <div key={step} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"1.5rem",position:"relative",overflow:"hidden",transition:"all 0.3s var(--ease)"}}>
              <div style={{fontSize:10,fontFamily:"var(--mono)",fontWeight:700,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:12}}>{step}</div>
              <div style={{fontSize:28,marginBottom:12,lineHeight:1}}>{icon}</div>
              <div style={{fontSize:14,fontWeight:700,color:"var(--text)",letterSpacing:"-0.03em",marginBottom:6}}>{title}</div>
              <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.7,letterSpacing:"-0.005em"}}>{desc}</div>
              <div style={{position:"absolute",top:0,right:0,fontSize:80,fontFamily:"var(--mono)",fontWeight:900,color:"var(--border)",lineHeight:1,letterSpacing:"-0.04em",pointerEvents:"none",userSelect:"none"}}>{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mt-section">
        <div className="mt-section-hd">
          <div className="mt-section-title">🔥 <em>Best Deals</em> Right Now</div>
          <div className="mt-section-link" onClick={()=>setPage("search")}>See all →</div>
        </div>
        <div className="mt-grid">
          {PRODUCTS.map((p,idx)=>{
            const best=p.prices[0];
            const d=disc(best.price,best.mrp);
            const tagCls=p.tag==="Bestseller"?"best":p.tag==="New"?"new":"deal";
            return (
              <div key={p.id} className="mt-card" style={{animationDelay:`${idx*0.06}s`}}
                onClick={()=>{setSelectedProduct(p);setPage("product")}}>
                <div className="mt-card-img">
                  {p.tag&&<div className={`mt-card-tag ${tagCls}`}>{p.tag}</div>}
                  {p.image}
                </div>
                <div className="mt-card-body">
                  <div className="mt-card-brand">{p.brand}</div>
                  <div className="mt-card-name">{p.name}</div>
                  <div className="mt-card-rating">
                    <Stars r={p.rating}/>
                    <span className="mt-card-rnum">{p.rating}</span>
                    <span className="mt-card-rcnt">({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="mt-card-price-row">
                    <div className="mt-card-price">₹{best.price.toLocaleString()}</div>
                    <div className="mt-card-mrp">₹{best.mrp}</div>
                    <div className="mt-card-disc">{d}% off</div>
                  </div>
                  <div className="mt-card-sites">{p.prices.length} stores compared</div>
                  <button className="mt-card-cta" onClick={e=>{e.stopPropagation();setCompareList(prev=>prev.find(x=>x.id===p.id)?prev:[...prev.slice(0,2),p]);setPage("compare")}}>
                    Compare Prices
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── SEARCH ────────────────────────────────────────────────────────────────────
function Search({query,setPage,setSelectedProduct,addToCart,setCompareList}:{
  query:string;setPage:(p:Page)=>void;setSelectedProduct:(p:Product)=>void;
  addToCart:(p:Product,s:string)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void
}) {
  const [cats,setCats]=useState<string[]>([]);
  const [sites,setSites]=useState<string[]>([]);
  const [sort,setSort]=useState("price_asc");
  const [stockOnly,setStockOnly]=useState(false);
  const allCats=Array.from(new Set(PRODUCTS.map(p=>p.category)));
  const toggle=(arr:string[],set:(v:string[])=>void,val:string)=>set(arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]);

  const filtered=PRODUCTS.filter(p=>{
    const q=query.toLowerCase();
    const mQ=!q||p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.category.toLowerCase().includes(q);
    const mC=cats.length===0||cats.includes(p.category);
    const mS=sites.length===0||p.prices.some(pr=>sites.includes(pr.site));
    const mSt=!stockOnly||p.prices.some(pr=>pr.inStock);
    return mQ&&mC&&mS&&mSt;
  }).sort((a,b)=>{
    if(sort==="price_asc")return a.prices[0].price-b.prices[0].price;
    if(sort==="price_desc")return b.prices[0].price-a.prices[0].price;
    if(sort==="rating")return b.rating-a.rating;
    return b.reviews-a.reviews;
  });

  return (
    <div className="mt-search-layout">
      <div className="mt-sidebar">
        <div className="mt-filter-card">
          <div className="mt-filter-title">Availability</div>
          <div className="mt-filter-opt" onClick={()=>setStockOnly(!stockOnly)}>
            <div className={`mt-filter-cb ${stockOnly?"on":""}`}/><span className="mt-filter-label">In Stock Only</span>
          </div>
        </div>
        <div className="mt-filter-card">
          <div className="mt-filter-title">Category</div>
          {allCats.map(c=>(
            <div key={c} className="mt-filter-opt" onClick={()=>toggle(cats,setCats,c)}>
              <div className={`mt-filter-cb ${cats.includes(c)?"on":""}`}/>
              <span className="mt-filter-label">{c}</span>
              <span className="mt-filter-cnt">{PRODUCTS.filter(p=>p.category===c).length}</span>
            </div>
          ))}
        </div>
        <div className="mt-filter-card">
          <div className="mt-filter-title">Store</div>
          {SITES.map(s=>(
            <div key={s} className="mt-filter-opt" onClick={()=>toggle(sites,setSites,s)}>
              <div className={`mt-filter-cb ${sites.includes(s)?"on":""}`}/><span className="mt-filter-label">{s}</span>
            </div>
          ))}
        </div>
        {(cats.length>0||sites.length>0||stockOnly)&&(
          <button style={{background:"rgba(240,82,82,0.1)",color:"var(--red)",border:"1px solid rgba(240,82,82,0.2)",borderRadius:"var(--r3)",padding:"8px 12px",fontSize:12,fontWeight:600,width:"100%"}}
            onClick={()=>{setCats([]);setSites([]);setStockOnly(false)}}>Clear All</button>
        )}
      </div>
      <div className="mt-results-area">
        <div className="mt-results-bar">
          <div className="mt-results-count"><strong>{filtered.length}</strong> results {query&&<span>for "{query}"</span>}</div>
          <select className="mt-sort" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
        {filtered.length===0?(<div className="mt-empty"><div className="mt-empty-icon">🔍</div><div className="mt-empty-title">No results</div><div className="mt-empty-sub">Try different filters or keywords.</div><button className="mt-empty-btn" onClick={()=>{setCats([]);setSites([])}}>Clear Filters</button></div>)
        :filtered.map((p,i)=>{
          const best=p.prices[0];const d=disc(best.price,best.mrp);
          return (
            <div key={p.id} className="mt-result-row" style={{animationDelay:`${i*0.05}s`}}
              onClick={()=>{setSelectedProduct(p);setPage("product")}}>
              <div className="mt-result-img">{p.image}</div>
              <div className="mt-result-info">
                <div className="mt-result-brand">{p.brand}</div>
                <div className="mt-result-name">{p.name}</div>
                <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:4}}>
                  <div className="mt-result-rating-chip">★ {p.rating}</div>
                  <span className="mt-result-rcnt">{p.reviews.toLocaleString()} reviews</span>
                </div>
                <div className="mt-result-highlights">{p.highlights.slice(0,3).map(h=><span key={h} className="mt-result-hl">{h}</span>)}</div>
              </div>
              <div className="mt-result-prices" onClick={e=>e.stopPropagation()}>
                <div>
                  <div className="mt-result-from">Best price</div>
                  <div className="mt-result-big">₹{best.price.toLocaleString()}</div>
                  <div className="mt-result-sub"><span className="mt-result-mrp">₹{best.mrp}</span><span className="mt-result-disc">{d}% off</span></div>
                </div>
                <div className="mt-result-sitecnt">on {best.site} · {p.prices.length} stores</div>
                <div className="mt-result-btns">
                  <button className="mt-result-view" onClick={()=>{setSelectedProduct(p);setPage("product")}}>View All</button>
                  <button className="mt-result-add" onClick={()=>addToCart(p,best.site)}>Add to Cart</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PRODUCT ───────────────────────────────────────────────────────────────────
function ProductPage({product,setPage,addToCart,setCompareList}:{
  product:Product;setPage:(p:Page)=>void;
  addToCart:(p:Product,s:string)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void
}) {
  const {ref,createRipple}=useRipple();
  const best=product.prices.filter(p=>p.inStock).sort((a,b)=>a.price-b.price)[0]||product.prices[0];
  const maxP=product.prices[product.prices.length-1].price;
  const savings=maxP-best.price;
  return (
    <div className="mt-product-layout" style={{animation:"fadeUp 0.4s ease both"}}>
      <div className="mt-product-left">
        <div className="mt-breadcrumb">
          <span onClick={()=>setPage("home")}>Home</span><span className="mt-breadcrumb-sep">›</span>
          <span onClick={()=>setPage("search")}>{product.category}</span><span className="mt-breadcrumb-sep">›</span>
          <span style={{color:"var(--text)"}}>{product.brand}</span>
        </div>
        <div className="mt-product-img-wrap">{product.image}</div>
        <div className="mt-product-detail-brand">{product.brand}</div>
        <div className="mt-product-detail-name">{product.name}</div>
        <div className="mt-product-detail-rtg">
          <div className="mt-rtg-chip">★ {product.rating}</div>
          <span className="mt-rtg-cnt">{product.reviews.toLocaleString()} reviews</span>
        </div>
        <div className="mt-product-desc">{product.description}</div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:"var(--text)",letterSpacing:"-0.01em"}}>Key Highlights</div>
        <div className="mt-highlights-list">{product.highlights.map(h=><div key={h} className="mt-hl-item"><div className="mt-hl-dot"/>{h}</div>)}</div>

        <div className="mt-price-table" style={{marginTop:"1.75rem"}}>
          <div className="mt-price-table-hd">
            <div>
              <div className="mt-price-table-title">Price Comparison</div>
              <div className="mt-price-table-sub">{product.prices.length} stores · Updated now</div>
            </div>
            <button className="mt-add-compare" onClick={()=>{setCompareList(prev=>prev.find(x=>x.id===product.id)?prev:[...prev.slice(0,2),product]);setPage("compare")}}>
              + Add to Compare
            </button>
          </div>
          {savings>0&&(
            <div className="mt-savings" style={{margin:"0 16px 0"}}>
              <span>💡</span><span>Save <strong>₹{savings.toLocaleString()}</strong> by choosing the best deal</span>
            </div>
          )}
          {product.prices.sort((a,b)=>a.price-b.price).map((pr,i)=>{
            const isBest=i===0&&pr.inStock;const d=disc(pr.price,pr.mrp);
            return (
              <div key={pr.site} className={`mt-price-row ${isBest?"best":""}`}>
                <div className="mt-price-row-rank">#{i+1}</div>
                <div className="mt-price-row-site">
                  <div className="mt-price-row-site-name">
                    {pr.site}{isBest&&<span className="mt-best-badge">Best Deal</span>}
                  </div>
                  <div className={`mt-price-row-delivery ${pr.delivery==="3 days"||pr.delivery==="2 days"?"slow":""}`}>🚚 {pr.delivery}</div>
                </div>
                <div className="mt-price-row-price">
                  {pr.inStock?<><div className="mt-price-big">₹{pr.price.toLocaleString()}</div><div className="mt-price-disc">{d}% off MRP</div></>
                  :<div className="mt-price-oos">Out of Stock</div>}
                </div>
                {pr.inStock
                  ?<button className="mt-buy-row-btn" onClick={()=>addToCart(product,pr.site)}>Add to Cart</button>
                  :<button className="mt-notify-btn">Notify Me</button>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-product-right">
        <div className="mt-buy-card">
          <div className="mt-buy-card-hd">
            <div className="mt-buy-card-best">✓ Best Price Available</div>
            <div className="mt-buy-price">₹{best.price.toLocaleString()}</div>
            <div className="mt-buy-sub"><span className="mt-buy-mrp">₹{best.mrp}</span><span className="mt-buy-disc">{disc(best.price,best.mrp)}% off</span></div>
            <div className="mt-buy-site">on {best.site}</div>
          </div>
          <div className="mt-buy-card-body">
            <div className="mt-buy-delivery">🚚 {best.delivery} delivery</div>
            <div className="mt-buy-info">📦 Free delivery above ₹499</div>
            <button ref={ref} className="mt-buy-now" onMouseDown={createRipple}>Buy Now on {best.site}</button>
            <button className="mt-buy-cart" onClick={()=>addToCart(product,best.site)}>Add to Cart</button>
            <button className="mt-buy-compare" onClick={()=>{setCompareList(prev=>prev.find(x=>x.id===product.id)?prev:[...prev.slice(0,2),product]);setPage("compare")}}>
              ⚖ Add to Compare
            </button>
          </div>
        </div>
        <div style={{marginTop:"1rem"}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:10,color:"var(--text)"}}>Similar Products</div>
          {PRODUCTS.filter(p=>p.id!==product.id&&p.category===product.category).slice(0,2).map(p=>(
            <div key={p.id} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"10px",display:"flex",gap:10,alignItems:"center",cursor:"pointer",marginBottom:8,transition:"border-color 0.2s"}}
              onClick={()=>{}}>
              <div style={{fontSize:24,width:40,height:40,background:"var(--surface2)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.image}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"var(--text)",lineHeight:1.3}}>{p.name}</div>
                <div style={{fontSize:13,fontWeight:800,color:"var(--accent)",fontFamily:"var(--mono)",marginTop:3}}>₹{p.prices[0].price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPARE ───────────────────────────────────────────────────────────────────
function Compare({compareList,setCompareList,setPage,addToCart}:{
  compareList:Product[];setCompareList:(fn:(prev:Product[])=>Product[])=>void;
  setPage:(p:Page)=>void;addToCart:(p:Product,s:string)=>void
}) {
  if(compareList.length===0) return (
    <div className="mt-compare-page"><div className="mt-empty"><div className="mt-empty-icon">⚖️</div><div className="mt-empty-title">Nothing to compare</div><div className="mt-empty-sub">Browse products and click "Compare Prices" to add them here.</div><button className="mt-empty-btn" onClick={()=>setPage("search")}>Browse Products</button></div></div>
  );
  const attrs=["Brand","Category","Rating","Reviews","Best Price","MRP","Max Discount","Stores","Description"];
  const getVal=(p:Product,a:string)=>{
    const b=p.prices[0];
    switch(a){
      case"Brand":return p.brand;case"Category":return p.category;case"Rating":return`★ ${p.rating}`;
      case"Reviews":return p.reviews.toLocaleString();case"Best Price":return`₹${b.price.toLocaleString()}`;
      case"MRP":return`₹${b.mrp.toLocaleString()}`;case"Max Discount":return`${disc(b.price,b.mrp)}%`;
      case"Stores":return`${p.prices.length} stores`;case"Description":return p.description;default:return"-";
    }
  };
  const isHl=(a:string,val:string)=>{
    if(a==="Best Price"){const min=Math.min(...compareList.map(p=>p.prices[0].price));return val===`₹${min.toLocaleString()}`}
    if(a==="Rating"){const max=Math.max(...compareList.map(p=>p.rating));return val===`★ ${max}`}
    if(a==="Max Discount"){const max=Math.max(...compareList.map(p=>disc(p.prices[0].price,p.prices[0].mrp)));return val===`${max}%`}
    return false;
  };
  return (
    <div className="mt-compare-page" style={{animation:"fadeUp 0.4s ease both"}}>
      <div className="mt-compare-header">
        <div className="mt-page-title">⚖️ Compare Products</div>
        <button style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r3)",padding:"7px 14px",fontSize:12,fontWeight:600,color:"var(--text2)"}} onClick={()=>setPage("search")}>+ Add More</button>
      </div>
      <div className="mt-compare-cards" style={{gridTemplateColumns:`repeat(${compareList.length},1fr)`}}>
        {compareList.map(p=>(
          <div key={p.id} className="mt-compare-product-card">
            <button className="mt-compare-rm" onClick={()=>setCompareList(prev=>prev.filter(x=>x.id!==p.id))}>✕</button>
            <div style={{fontSize:36,margin:"0 auto 8px"}}>{p.image}</div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"var(--mono)"}}>{p.brand}</div>
            <div style={{fontSize:12,fontWeight:600,color:"var(--text)",marginTop:4,lineHeight:1.3}}>{p.name}</div>
            <button style={{background:"var(--accent)",color:"#fff",borderRadius:"var(--r3)",padding:"8px 12px",fontSize:11,fontWeight:700,marginTop:10,width:"100%"}} onClick={()=>addToCart(p,p.prices[0].site)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-compare-table-wrap">
        <table className="mt-compare-table">
          <thead><tr><th>Attribute</th>{compareList.map(p=><th key={p.id}>{p.brand}</th>)}</tr></thead>
          <tbody>
            {attrs.map(a=>(
              <tr key={a}>
                <td className="mt-attr-label">{a}</td>
                {compareList.map(p=>{const v=getVal(p,a);return <td key={p.id} className={isHl(a,v)?"hl":""}>{a==="Description"?<span style={{fontSize:11,lineHeight:1.6}}>{v}</span>:v}</td>})}
              </tr>
            ))}
            <tr>
              <td className="mt-attr-label">Prices by Store</td>
              {compareList.map(p=>(
                <td key={p.id}>
                  {p.prices.slice(0,3).map(pr=>(
                    <div key={pr.site} style={{fontSize:11,color:"var(--text2)",marginBottom:3,fontFamily:"var(--mono)"}}>
                      {pr.site}: <strong style={{color:"var(--text)"}}>₹{pr.price.toLocaleString()}</strong>
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
function Categories({setPage,setSq}:{setPage:(p:Page)=>void;setSq:(v:string)=>void}) {
  return (
    <div className="mt-section" style={{animation:"fadeUp 0.4s ease both"}}>
      <div className="mt-page-title" style={{marginBottom:"1.5rem"}}>All Categories</div>
      <div className="mt-cats-page">
        {CATEGORIES.map(c=>(
          <div key={c.name} className="mt-cat-big" onClick={()=>{setSq(c.name);setPage("search")}}>
            <div className="mt-cat-big-icon">{c.icon}</div>
            <div><div className="mt-cat-big-name">{c.name}</div><div className="mt-cat-big-cnt">{c.count.toLocaleString()} products</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CART ──────────────────────────────────────────────────────────────────────
function Cart({cart,setCart,setPage}:{cart:CartItem[];setCart:(fn:(prev:CartItem[])=>CartItem[])=>void;setPage:(p:Page)=>void}) {
  const subtotal=cart.reduce((s,i)=>{const p=i.product.prices.find(p=>p.site===i.site)!;return s+p.price*i.qty},0);
  const mrpTotal=cart.reduce((s,i)=>{const p=i.product.prices.find(p=>p.site===i.site)!;return s+p.mrp*i.qty},0);
  const saved=mrpTotal-subtotal;const delivery=subtotal>499?0:49;
  if(cart.length===0) return(
    <div style={{animation:"fadeUp 0.4s ease both"}}><div className="mt-empty"><div className="mt-empty-icon">🛒</div><div className="mt-empty-title">Your cart is empty</div><div className="mt-empty-sub">Compare prices and add products to get started.</div><button className="mt-empty-btn" onClick={()=>setPage("search")}>Browse Products</button></div></div>
  );
  return (
    <div className="mt-cart-layout" style={{animation:"fadeUp 0.4s ease both"}}>
      <div className="mt-cart-items">
        <div className="mt-page-title" style={{marginBottom:"1.25rem"}}>My Cart ({cart.reduce((s,i)=>s+i.qty,0)} items)</div>
        {cart.map((item,idx)=>{
          const priceObj=item.product.prices.find(p=>p.site===item.site)!;
          return (
            <div key={`${item.product.id}-${item.site}`} className="mt-cart-row" style={{animationDelay:`${idx*0.07}s`}}>
              <div className="mt-cart-img">{item.product.image}</div>
              <div className="mt-cart-info">
                <div className="mt-cart-name">{item.product.name}</div>
                <div className="mt-cart-site">{item.site} · {priceObj.delivery}</div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
                  <div className="mt-qty">
                    <button className="mt-qty-btn" onClick={()=>setCart(prev=>prev.map((c,i)=>i===idx?{...c,qty:Math.max(1,c.qty-1)}:c))}>−</button>
                    <div className="mt-qty-val">{item.qty}</div>
                    <button className="mt-qty-btn" onClick={()=>setCart(prev=>prev.map((c,i)=>i===idx?{...c,qty:c.qty+1}:c))}>+</button>
                  </div>
                  <div className="mt-cart-price">₹{(priceObj.price*item.qty).toLocaleString()}</div>
                </div>
                <div className="mt-cart-rm" onClick={()=>setCart(prev=>prev.filter((_,i)=>i!==idx))}>Remove</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-cart-summary">
        <div className="mt-cart-summary-card">
          <div className="mt-cart-sum-title">Order Summary</div>
          <div className="mt-cart-sum-row"><span>MRP Total</span><span style={{fontFamily:"var(--mono)"}}>₹{mrpTotal.toLocaleString()}</span></div>
          <div className="mt-cart-sum-row" style={{color:"var(--green)"}}><span>Discount</span><span style={{fontFamily:"var(--mono)"}}>−₹{saved.toLocaleString()}</span></div>
          <div className="mt-cart-sum-row"><span>Delivery</span><span style={{fontFamily:"var(--mono)"}}>{delivery===0?<span style={{color:"var(--green)"}}>FREE</span>:`₹${delivery}`}</span></div>
          <div className="mt-cart-sum-row total"><span>Total</span><span style={{fontFamily:"var(--mono)"}}>₹{(subtotal+delivery).toLocaleString()}</span></div>
          {saved>0&&<div className="mt-savings-note">You save ₹{saved.toLocaleString()} on this order 🎉</div>}
          <button className="mt-checkout">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function MedTrackerApp() {
  const [page,setPage]=useState<Page>("home");
  const [sq,setSq]=useState("");
  const [selectedProduct,setSelectedProduct]=useState<Product>(PRODUCTS[0]);
  const [compareList,setCompareList]=useState<Product[]>([]);
  const [cart,setCart]=useState<CartItem[]>([]);

  const addToCart=useCallback((p:Product,site:string)=>{
    setCart(prev=>{
      const idx=prev.findIndex(c=>c.product.id===p.id&&c.site===site);
      if(idx>=0)return prev.map((c,i)=>i===idx?{...c,qty:c.qty+1}:c);
      return [...prev,{product:p,site,qty:1}];
    });
  },[]);

  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const goTo=(p:Page)=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"})};
  const onSearch=()=>{if(sq.trim())goTo("search")};

  return (
    <>
      <style>{CSS}</style>
      <div className="mt-noise"/>
      <div className="mt-grid-bg"/>
      {/* Ambient orbs */}
      <div className="mt-orb" style={{width:700,height:700,background:"rgba(42,107,232,0.07)",top:-250,left:-200,animationDuration:"14s"}}/>
      <div className="mt-orb" style={{width:500,height:500,background:"rgba(167,139,250,0.06)",top:400,right:-180,animationDuration:"10s",animationDirection:"alternate-reverse"}}/>
      <div className="mt-orb" style={{width:450,height:450,background:"rgba(0,229,160,0.04)",bottom:80,left:"30%",animationDuration:"16s"}}/>

      <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Nav page={page} setPage={goTo} cartCount={cartCount} sq={sq} setSq={setSq} onSearch={onSearch}/>

        <main style={{flex:1,position:"relative",zIndex:1}}>
          {page==="home"&&<Home setPage={goTo} setSq={setSq} setSelectedProduct={setSelectedProduct} setCompareList={setCompareList}/>}
          {page==="search"&&<Search query={sq} setPage={goTo} setSelectedProduct={p=>{setSelectedProduct(p);goTo("product")}} addToCart={addToCart} setCompareList={setCompareList}/>}
          {page==="product"&&<ProductPage product={selectedProduct} setPage={goTo} addToCart={addToCart} setCompareList={setCompareList}/>}
          {page==="compare"&&<Compare compareList={compareList} setCompareList={setCompareList} setPage={goTo} addToCart={addToCart}/>}
          {page==="categories"&&<Categories setPage={goTo} setSq={setSq}/>}
          {page==="cart"&&<Cart cart={cart} setCart={setCart} setPage={goTo}/>}
        </main>

        <footer className="mt-footer">
          <div className="mt-footer-inner">
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div className="mt-logo-mark" style={{width:26,height:26,fontSize:12}}>💊</div>
                <div className="mt-footer-brand-name">MedTracker</div>
              </div>
              <div className="mt-footer-desc">India's most trusted healthcare price comparison platform. Real-time prices, zero bias.</div>
            </div>
            {[{title:"Compare",links:["Search Products","By Category","All Stores","Price Alerts"]},{title:"Company",links:["About Us","Blog","Careers","Contact"]},{title:"Legal",links:["Privacy Policy","Terms of Use","Cookie Policy"]}].map(col=>(
              <div key={col.title}>
                <div className="mt-footer-col-title">{col.title}</div>
                {col.links.map(l=><div key={l} className="mt-footer-link">{l}</div>)}
              </div>
            ))}
          </div>
          <div className="mt-footer-bottom">
            <span>© 2025 MedTracker · Not affiliated with any pharmacy</span>
            <span>Prices sourced in real-time and may vary</span>
          </div>
        </footer>
      </div>
    </>
  );
}