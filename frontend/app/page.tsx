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
  {name:"Vitamins & Minerals",icon:"💊",count:0},
  {name:"Protein & Fitness",icon:"💪",count:0},
  {name:"Supplements",icon:"🌿",count:0},
  {name:"Ayurvedic",icon:"🍃",count:0},
  {name:"Weight Management",icon:"⚖️",count:0},
  {name:"Women's Health",icon:"🌸",count:0},
  {name:"Diabetic Care",icon:"🩸",count:0},
  {name:"Heart Health",icon:"❤️",count:0},
];

const SITES = ["1mg","PharmEasy","Netmeds","Apollo","HealthKart","Amazon","Flipkart"];
const disc = (p:number,m:number)=>Math.round(((m-p)/m)*100);

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fragment+Mono:ital@0;1&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --void:#000000;
  --ink:#080808;
  --plate:#0f0f0f;
  --panel:#141414;
  --lift:#1c1c1c;
  --wire:rgba(255,255,255,0.07);
  --wire2:rgba(255,255,255,0.12);
  --wire3:rgba(255,255,255,0.22);
  --smoke:#ffffff08;
  --chalk:#f0ede6;
  --ash:#6b6860;
  --cinder:#323028;
  --phosphor:#b8ff57;
  --phosphor2:#8fcc2e;
  --phosphor-dim:rgba(184,255,87,0.12);
  --phosphor-glow:rgba(184,255,87,0.3);
  --signal:#ff4d2e;
  --ice:#c8e6ff;
  --nav-h:56px;
  --font:'DM Sans',sans-serif;
  --display:'Bebas Neue',sans-serif;
  --mono:'Fragment Mono',monospace;
  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease2:cubic-bezier(0.76,0,0.24,1);
}

html{scroll-behavior:smooth;background:var(--void)}
body{
  font-family:var(--font);background:var(--void);color:var(--chalk);
  -webkit-font-smoothing:antialiased;overflow-x:hidden;
  cursor:crosshair;
}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-track{background:var(--void)}
::-webkit-scrollbar-thumb{background:var(--phosphor)}
::selection{background:var(--phosphor);color:var(--void)}
a{text-decoration:none;color:inherit}
button{font-family:var(--font);cursor:crosshair;border:none;background:none}

/* ── CURSOR ── */
.mt-cursor{
  position:fixed;width:8px;height:8px;background:var(--phosphor);border-radius:50%;
  pointer-events:none;z-index:9999;transform:translate(-50%,-50%);
  transition:transform 0.1s,width 0.3s,height 0.3s,background 0.3s;
  mix-blend-mode:difference;
}
.mt-cursor-ring{
  position:fixed;width:36px;height:36px;border:1px solid rgba(184,255,87,0.5);
  border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);
  transition:all 0.18s var(--ease);
}

/* ── SCANLINES ── */
.mt-scan{
  position:fixed;inset:0;z-index:1;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);
}

/* ── NOISE ── */
.mt-noise{
  position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.04;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:128px;
}

/* ── CORNER BRACKETS ── */
.mt-bracket{
  position:fixed;width:24px;height:24px;z-index:500;pointer-events:none;
  border-color:var(--phosphor);border-style:solid;opacity:0.5;
}
.mt-bracket.tl{top:16px;left:16px;border-width:1px 0 0 1px}
.mt-bracket.tr{top:16px;right:16px;border-width:1px 1px 0 0}
.mt-bracket.bl{bottom:16px;left:16px;border-width:0 0 1px 1px}
.mt-bracket.br{bottom:16px;right:16px;border-width:0 1px 1px 0}

/* ── NAV ── */
.mt-nav{
  position:sticky;top:0;z-index:200;height:var(--nav-h);
  display:flex;align-items:center;padding:0 2rem;gap:1.5rem;
  background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--wire);
}
.mt-nav-logo{
  display:flex;align-items:center;gap:10px;cursor:crosshair;flex-shrink:0;
  font-family:var(--display);font-size:22px;letter-spacing:0.05em;color:var(--chalk);
  line-height:1;
}
.mt-nav-logo-dot{color:var(--phosphor)}
.mt-nav-search{
  flex:1;max-width:440px;display:flex;align-items:center;
  background:transparent;border-bottom:1px solid var(--wire2);
  padding:0 0 6px 0;gap:10px;height:auto;
  transition:border-color 0.3s;
}
.mt-nav-search:focus-within{border-color:var(--phosphor)}
.mt-nav-search input{
  flex:1;background:none;border:none;outline:none;
  font-family:var(--mono);font-size:12px;color:var(--chalk);letter-spacing:0.05em;
}
.mt-nav-search input::placeholder{color:var(--ash);letter-spacing:0.05em}
.mt-nav-search-btn{
  font-family:var(--mono);font-size:11px;color:var(--phosphor);
  letter-spacing:0.12em;text-transform:uppercase;
  padding:4px 0;transition:opacity 0.2s;border-bottom:1px solid var(--phosphor);
}
.mt-nav-search-btn:hover{opacity:0.7}
.mt-nav-links{display:flex;align-items:center;gap:0.25rem;margin-left:auto;flex-shrink:0}
.mt-nav-link{
  padding:6px 12px;font-family:var(--mono);font-size:10px;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--ash);transition:color 0.2s;cursor:crosshair;
  display:flex;align-items:center;gap:6px;position:relative;
}
.mt-nav-link:hover{color:var(--chalk)}
.mt-nav-link.active{color:var(--phosphor)}
.mt-cart-badge{
  background:var(--phosphor);color:var(--void);border-radius:2px;
  font-family:var(--mono);font-size:9px;font-weight:700;padding:1px 4px;min-width:16px;
  text-align:center;animation:blink 0.4s step-end;
}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* ── HERO ── */
.mt-hero{
  position:relative;z-index:1;min-height:100svh;
  display:flex;flex-direction:column;justify-content:flex-end;
  padding:3rem 2rem 5rem;overflow:hidden;
  border-bottom:1px solid var(--wire);
}
.mt-hero-bg{
  position:absolute;inset:0;z-index:0;
  background:
    radial-gradient(ellipse 60% 40% at 80% 20%,rgba(184,255,87,0.04) 0%,transparent 70%),
    radial-gradient(ellipse 40% 60% at 20% 80%,rgba(184,255,87,0.025) 0%,transparent 60%);
}
.mt-hero-grid{
  position:absolute;inset:0;z-index:0;
  background-image:
    linear-gradient(var(--wire) 1px,transparent 1px),
    linear-gradient(90deg,var(--wire) 1px,transparent 1px);
  background-size:80px 80px;
  mask-image:radial-gradient(ellipse 100% 100% at 50% 50%,black 30%,transparent 100%);
}
.mt-hero-eyebrow{
  position:relative;z-index:1;
  font-family:var(--mono);font-size:10px;letter-spacing:0.2em;
  text-transform:uppercase;color:var(--phosphor);
  display:flex;align-items:center;gap:12px;margin-bottom:2rem;
  animation:fadeIn 1s 0.2s var(--ease) both;
}
.mt-hero-eyebrow::before{content:'';width:40px;height:1px;background:var(--phosphor)}
.mt-hero-eyebrow-dot{
  width:4px;height:4px;background:var(--phosphor);border-radius:50%;
  animation:pulse 2s infinite;box-shadow:0 0 8px var(--phosphor-glow);
}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.2;transform:scale(0.5)}}

.mt-hero h1{
  position:relative;z-index:1;
  font-family:var(--display);
  font-size:clamp(5rem,14vw,14rem);
  line-height:0.88;letter-spacing:0.01em;
  color:var(--chalk);margin-bottom:0.2em;
  animation:slideUp 1s 0.3s var(--ease) both;
}
.mt-hero h1 em{font-style:normal;color:var(--phosphor);-webkit-text-fill-color:var(--phosphor)}
.mt-hero-sub{
  position:relative;z-index:1;
  display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;
  margin-top:2rem;
  animation:fadeIn 1s 0.6s var(--ease) both;
}
.mt-hero-desc{
  font-size:14px;font-weight:300;color:var(--ash);
  max-width:340px;line-height:1.8;letter-spacing:0.01em;
}
.mt-hero-cta{
  display:flex;flex-direction:column;align-items:flex-end;gap:1rem;flex-shrink:0;
}
.mt-hero-btn{
  display:inline-flex;align-items:center;gap:10px;
  font-family:var(--mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);
  padding:14px 28px;border-radius:2px;
  transition:all 0.3s var(--ease);
  box-shadow:0 0 40px var(--phosphor-dim);
}
.mt-hero-btn:hover{
  background:var(--chalk);transform:translateY(-2px);
  box-shadow:0 0 60px rgba(184,255,87,0.2);
}
.mt-hero-btn:active{transform:translateY(0)}
.mt-hero-scroll{
  font-family:var(--mono);font-size:9px;letter-spacing:0.2em;
  color:var(--ash);text-transform:uppercase;
  display:flex;align-items:center;gap:8px;
}
.mt-hero-scroll::after{
  content:'';width:1px;height:40px;background:linear-gradient(var(--ash),transparent);
  animation:scrollLine 2s ease-in-out infinite;
}
@keyframes scrollLine{0%,100%{opacity:0.3;transform:scaleY(0.5)}50%{opacity:1;transform:scaleY(1)}}

.mt-hero-stats{
  position:absolute;right:2rem;top:50%;transform:translateY(-50%);z-index:1;
  display:flex;flex-direction:column;gap:2rem;
  animation:fadeIn 1s 0.8s var(--ease) both;
}
.mt-stat{text-align:right}
.mt-stat-num{
  font-family:var(--display);font-size:2.5rem;line-height:1;
  color:var(--chalk);letter-spacing:0.02em;
}
.mt-stat-label{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.15em;text-transform:uppercase;margin-top:4px}

/* ── TICKER ── */
.mt-ticker{
  border-top:1px solid var(--wire);border-bottom:1px solid var(--wire);
  background:var(--ink);overflow:hidden;
  font-family:var(--mono);font-size:10px;letter-spacing:0.12em;
  color:var(--ash);text-transform:uppercase;white-space:nowrap;
  padding:10px 0;position:relative;z-index:1;
}
.mt-ticker-inner{display:inline-flex;gap:4rem;animation:ticker 25s linear infinite}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mt-ticker-item{display:inline-flex;align-items:center;gap:8px}
.mt-ticker-sep{color:var(--phosphor);font-size:8px}

/* ── SECTION SHELL ── */
.mt-section{
  position:relative;z-index:1;
  padding:5rem 2rem;max-width:1400px;margin:0 auto;width:100%;
}
.mt-section-hd{
  display:grid;grid-template-columns:1fr 1fr;align-items:start;
  padding-bottom:2rem;border-bottom:1px solid var(--wire);margin-bottom:3rem;
}
.mt-section-label{
  font-family:var(--mono);font-size:10px;letter-spacing:0.15em;
  text-transform:uppercase;color:var(--phosphor);
  display:flex;align-items:center;gap:8px;
}
.mt-section-label::before{content:'[';color:var(--ash)}
.mt-section-label::after{content:']';color:var(--ash)}
.mt-section-title{
  font-family:var(--display);font-size:clamp(3rem,6vw,6rem);
  letter-spacing:0.02em;line-height:0.9;color:var(--chalk);
  text-align:right;
}
.mt-section-title em{font-style:normal;color:var(--phosphor)}

/* ── CATEGORIES GRID ── */
.mt-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.mt-cat{
  border:1px solid var(--wire);border-collapse:collapse;
  padding:2rem 1.5rem;cursor:crosshair;
  transition:background 0.3s var(--ease);position:relative;overflow:hidden;
  display:flex;flex-direction:column;gap:1rem;
  margin:-1px 0 0 -1px;
}
.mt-cat::before{
  content:'';position:absolute;bottom:0;left:0;right:0;height:2px;
  background:var(--phosphor);transform:scaleX(0);transform-origin:left;
  transition:transform 0.4s var(--ease);
}
.mt-cat:hover{background:var(--plate)}
.mt-cat:hover::before{transform:scaleX(1)}
.mt-cat-num{
  font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.12em;
  align-self:flex-end;
}
.mt-cat-icon{font-size:24px;line-height:1;filter:grayscale(0.3)}
.mt-cat-name{font-size:13px;font-weight:400;color:var(--chalk);letter-spacing:-0.01em;line-height:1.3}
.mt-cat-arrow{
  font-family:var(--mono);font-size:12px;color:var(--phosphor);
  align-self:flex-end;opacity:0;transform:translateX(-6px);
  transition:all 0.3s var(--ease);
}
.mt-cat:hover .mt-cat-arrow{opacity:1;transform:translateX(0)}

/* ── PRODUCT LIST (Lusion editorial style) ── */
.mt-prodlist{display:flex;flex-direction:column}
.mt-prodrow{
  display:grid;grid-template-columns:3rem 1fr auto auto;
  align-items:center;gap:2rem;
  padding:1.75rem 0;border-bottom:1px solid var(--wire);
  cursor:crosshair;position:relative;overflow:hidden;
  transition:padding 0.3s var(--ease);
  group:true;
}
.mt-prodrow::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
  background:var(--phosphor);transform:scaleY(0);transition:transform 0.4s var(--ease);
}
.mt-prodrow:hover{padding-left:1rem;background:rgba(184,255,87,0.018)}
.mt-prodrow:hover::before{transform:scaleY(1)}
.mt-prodrow-idx{
  font-family:var(--mono);font-size:11px;color:var(--ash);
  letter-spacing:0.05em;text-align:right;
}
.mt-prodrow-info{min-width:0}
.mt-prodrow-brand{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:4px}
.mt-prodrow-name{font-size:15px;font-weight:400;color:var(--chalk);letter-spacing:-0.01em;line-height:1.2}
.mt-prodrow-tag{
  display:inline-block;font-family:var(--mono);font-size:8px;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--void);background:var(--phosphor);
  padding:2px 6px;border-radius:1px;margin-left:8px;vertical-align:middle;
}
.mt-prodrow-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.mt-prodrow-price{font-family:var(--display);font-size:2rem;color:var(--chalk);letter-spacing:0.02em;line-height:1}
.mt-prodrow-disc{font-family:var(--mono);font-size:10px;color:var(--phosphor);letter-spacing:0.08em}
.mt-prodrow-stores{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.08em}
.mt-prodrow-cta{
  font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);
  padding:10px 18px;border-radius:2px;white-space:nowrap;
  transition:all 0.2s var(--ease);
  opacity:0;transform:translateX(8px);
}
.mt-prodrow:hover .mt-prodrow-cta{opacity:1;transform:translateX(0)}

/* ── SITES STRIP ── */
.mt-sites{
  border-top:1px solid var(--wire);border-bottom:1px solid var(--wire);
  background:var(--ink);padding:1.5rem 2rem;
  display:flex;align-items:center;gap:2rem;overflow-x:auto;position:relative;z-index:1;
}
.mt-sites-label{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.15em;text-transform:uppercase;flex-shrink:0}
.mt-site-tag{
  font-family:var(--mono);font-size:10px;letter-spacing:0.1em;
  color:var(--ash);border:1px solid var(--wire2);padding:5px 14px;border-radius:1px;
  transition:all 0.2s;cursor:crosshair;white-space:nowrap;text-transform:uppercase;
}
.mt-site-tag:hover{border-color:var(--phosphor);color:var(--phosphor)}

/* ── HOW IT WORKS ── */
.mt-howgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--wire)}
.mt-howcard{
  padding:3rem 2rem;border-right:1px solid var(--wire);border-bottom:1px solid var(--wire);
  position:relative;overflow:hidden;
}
.mt-howcard:last-child{border-right:none}
.mt-howcard-n{
  font-family:var(--display);font-size:5rem;color:var(--wire2);line-height:1;
  position:absolute;top:1rem;right:1.5rem;pointer-events:none;
}
.mt-howcard-icon{font-size:20px;margin-bottom:1.5rem;line-height:1}
.mt-howcard-title{font-size:13px;font-weight:500;color:var(--chalk);letter-spacing:-0.01em;margin-bottom:0.75rem;line-height:1.3}
.mt-howcard-desc{font-size:12px;font-weight:300;color:var(--ash);line-height:1.75}

/* ── SEARCH PAGE ── */
.mt-search-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem;position:relative;z-index:1}
.mt-search-topbar{
  display:flex;align-items:center;gap:2rem;padding-bottom:1.5rem;
  border-bottom:1px solid var(--wire);margin-bottom:2.5rem;
}
.mt-search-title{font-family:var(--display);font-size:3rem;letter-spacing:0.02em;color:var(--chalk)}
.mt-search-count{font-family:var(--mono);font-size:11px;color:var(--ash);letter-spacing:0.1em;margin-left:auto}
.mt-sort-sel{
  background:transparent;border:1px solid var(--wire2);border-radius:1px;
  padding:6px 12px;font-family:var(--mono);font-size:10px;color:var(--chalk);
  cursor:crosshair;outline:none;letter-spacing:0.08em;
  appearance:none;
}
.mt-search-layout{display:flex;gap:3rem}
.mt-sidebar{width:200px;flex-shrink:0;align-self:start;position:sticky;top:calc(var(--nav-h) + 1rem)}
.mt-filter-group{margin-bottom:2rem}
.mt-filter-title{
  font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.18em;
  text-transform:uppercase;margin-bottom:1rem;padding-bottom:0.5rem;
  border-bottom:1px solid var(--wire);
}
.mt-filter-opt{
  display:flex;align-items:center;gap:10px;padding:5px 0;cursor:crosshair;
  transition:color 0.2s;
}
.mt-filter-opt:hover .mt-filter-label{color:var(--chalk)}
.mt-filter-cb{
  width:12px;height:12px;border:1px solid var(--wire3);border-radius:1px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;
}
.mt-filter-cb.on{background:var(--phosphor);border-color:var(--phosphor)}
.mt-filter-cb.on::after{content:'+';color:var(--void);font-size:10px;font-weight:700;font-family:var(--mono);line-height:1}
.mt-filter-label{font-family:var(--mono);font-size:10px;color:var(--ash);letter-spacing:0.06em;transition:color 0.2s}
.mt-filter-cnt{font-family:var(--mono);font-size:9px;color:var(--cinder);margin-left:auto}
.mt-results-area{flex:1;min-width:0}
.mt-result-row{
  display:grid;grid-template-columns:60px 1fr auto;
  gap:1.5rem;align-items:center;
  padding:1.5rem 0;border-bottom:1px solid var(--wire);
  cursor:crosshair;position:relative;overflow:hidden;
  transition:background 0.2s;
}
.mt-result-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--phosphor);transform:scaleY(0);transition:transform 0.3s var(--ease)}
.mt-result-row:hover{background:var(--smoke)}
.mt-result-row:hover::before{transform:scaleY(1)}
.mt-result-img{
  width:60px;height:60px;background:var(--plate);border:1px solid var(--wire);
  border-radius:2px;display:flex;align-items:center;justify-content:center;
  font-size:24px;flex-shrink:0;
}
.mt-result-info{min-width:0}
.mt-result-brand{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:3px}
.mt-result-name{font-size:14px;font-weight:400;color:var(--chalk);letter-spacing:-0.01em;margin-bottom:6px;line-height:1.3}
.mt-result-rating-chip{
  display:inline-flex;align-items:center;gap:4px;
  font-family:var(--mono);font-size:9px;letter-spacing:0.1em;
  color:var(--ash);
}
.mt-result-highlights{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.mt-result-hl{
  font-family:var(--mono);font-size:9px;letter-spacing:0.06em;
  color:var(--ash);border:1px solid var(--wire);padding:2px 8px;border-radius:1px;
}
.mt-result-prices{display:flex;flex-direction:column;align-items:flex-end;gap:8px;min-width:160px}
.mt-result-from{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.1em;text-transform:uppercase}
.mt-result-big{font-family:var(--display);font-size:2.4rem;color:var(--chalk);letter-spacing:0.02em;line-height:1}
.mt-result-disc{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.08em}
.mt-result-btns{display:flex;gap:8px}
.mt-result-view{
  font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--ash);border:1px solid var(--wire2);padding:8px 14px;border-radius:1px;
  transition:all 0.2s;
}
.mt-result-view:hover{border-color:var(--wire3);color:var(--chalk)}
.mt-result-add{
  font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);padding:8px 14px;border-radius:1px;
  transition:all 0.2s;
}
.mt-result-add:hover{background:var(--chalk)}

/* ── PRODUCT PAGE ── */
.mt-product-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem;position:relative;z-index:1}
.mt-breadcrumb{
  font-family:var(--mono);font-size:10px;letter-spacing:0.1em;
  color:var(--ash);margin-bottom:3rem;display:flex;align-items:center;gap:8px;
}
.mt-breadcrumb span{cursor:crosshair;transition:color 0.2s}
.mt-breadcrumb span:hover{color:var(--phosphor)}
.mt-breadcrumb-sep{color:var(--wire3)}
.mt-product-layout{display:grid;grid-template-columns:1fr 360px;gap:4rem;align-items:start}
.mt-product-left{}
.mt-product-hero{
  background:var(--ink);border:1px solid var(--wire);aspect-ratio:1;
  max-height:340px;display:flex;align-items:center;justify-content:center;
  font-size:80px;margin-bottom:2.5rem;position:relative;overflow:hidden;
}
.mt-product-hero::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 30% 30%,rgba(184,255,87,0.05),transparent 60%);
}
.mt-product-brand{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px}
.mt-product-name{font-family:var(--display);font-size:clamp(2rem,4vw,3.5rem);color:var(--chalk);letter-spacing:0.02em;line-height:0.95;margin-bottom:1.5rem}
.mt-product-rtg{display:flex;align-items:center;gap:12px;margin-bottom:1.5rem}
.mt-rtg-val{font-family:var(--mono);font-size:11px;color:var(--phosphor);letter-spacing:0.1em}
.mt-rtg-cnt{font-family:var(--mono);font-size:10px;color:var(--ash);letter-spacing:0.08em}
.mt-product-desc{font-size:13px;font-weight:300;color:var(--ash);line-height:1.85;margin-bottom:2rem;letter-spacing:0.01em;border-left:1px solid var(--wire2);padding-left:1.5rem}
.mt-hl-grid{display:flex;flex-direction:column;gap:0}
.mt-hl-item{
  display:flex;align-items:center;gap:1rem;
  padding:10px 0;border-bottom:1px solid var(--wire);
  font-size:12px;color:var(--ash);font-weight:300;
}
.mt-hl-item:last-child{border-bottom:none}
.mt-hl-marker{width:6px;height:1px;background:var(--phosphor);flex-shrink:0}

/* Price comparison table */
.mt-price-table{margin-top:2.5rem;border:1px solid var(--wire)}
.mt-price-table-hd{
  padding:1rem 1.25rem;border-bottom:1px solid var(--wire);
  display:flex;align-items:center;justify-content:space-between;
  background:var(--plate);
}
.mt-price-table-title{font-family:var(--mono);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--chalk)}
.mt-price-table-sub{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.1em}
.mt-price-row{
  display:grid;grid-template-columns:2rem 1fr auto auto auto;
  align-items:center;gap:1rem;padding:1rem 1.25rem;
  border-bottom:1px solid var(--wire);transition:background 0.2s;
}
.mt-price-row:last-child{border-bottom:none}
.mt-price-row:hover{background:var(--plate)}
.mt-price-row.best{background:rgba(184,255,87,0.04)}
.mt-price-row-rank{font-family:var(--mono);font-size:10px;color:var(--ash)}
.mt-price-row-site{font-size:12px;color:var(--chalk);font-weight:400}
.mt-best-badge{
  font-family:var(--mono);font-size:8px;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);padding:2px 6px;border-radius:1px;margin-left:6px;
}
.mt-price-delivery{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.06em}
.mt-price-delivery.fast{color:var(--phosphor)}
.mt-price-big{font-family:var(--display);font-size:1.6rem;color:var(--chalk);letter-spacing:0.02em}
.mt-price-disc-sm{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.06em}
.mt-price-oos{font-family:var(--mono);font-size:10px;color:var(--signal)}
.mt-buy-row-btn{
  font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);padding:8px 14px;border-radius:1px;white-space:nowrap;
  transition:all 0.2s;
}
.mt-buy-row-btn:hover{background:var(--chalk)}
.mt-notify-btn{
  font-family:var(--mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--ash);border:1px solid var(--wire2);padding:8px 14px;border-radius:1px;
}

/* Buy card */
.mt-buy-card{border:1px solid var(--wire2);background:var(--ink);position:sticky;top:calc(var(--nav-h) + 1rem)}
.mt-buy-card-hd{padding:1.5rem;border-bottom:1px solid var(--wire)}
.mt-buy-label{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.75rem}
.mt-buy-price{font-family:var(--display);font-size:3.5rem;color:var(--chalk);letter-spacing:0.02em;line-height:1}
.mt-buy-sub{display:flex;align-items:center;gap:10px;margin-top:6px}
.mt-buy-mrp{font-family:var(--mono);font-size:11px;color:var(--ash);text-decoration:line-through}
.mt-buy-disc{font-family:var(--mono);font-size:11px;color:var(--phosphor);letter-spacing:0.06em}
.mt-buy-from{font-family:var(--mono);font-size:10px;color:var(--ash);margin-top:6px;letter-spacing:0.06em}
.mt-buy-card-body{padding:1.5rem;display:flex;flex-direction:column;gap:10px}
.mt-buy-del{font-family:var(--mono);font-size:10px;color:var(--phosphor);letter-spacing:0.08em}
.mt-buy-now{
  font-family:var(--mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);
  padding:16px;width:100%;text-align:center;border-radius:1px;
  transition:all 0.25s var(--ease);box-shadow:0 0 30px var(--phosphor-dim);
}
.mt-buy-now:hover{background:var(--chalk);box-shadow:0 0 50px rgba(184,255,87,0.25)}
.mt-buy-cart{
  font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--chalk);border:1px solid var(--wire2);
  padding:14px;width:100%;text-align:center;border-radius:1px;
  transition:all 0.2s;
}
.mt-buy-cart:hover{border-color:var(--wire3);background:var(--plate)}
.mt-buy-compare{
  font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--ash);border:1px solid var(--wire);
  padding:12px;width:100%;text-align:center;border-radius:1px;
  transition:all 0.2s;
}
.mt-buy-compare:hover{border-color:var(--wire2);color:var(--chalk)}
.mt-savings-bar{
  background:rgba(184,255,87,0.06);border:1px solid rgba(184,255,87,0.15);
  padding:12px 14px;font-family:var(--mono);font-size:10px;color:var(--phosphor);
  letter-spacing:0.08em;margin:0 1.25rem;
}

/* ── COMPARE PAGE ── */
.mt-compare-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem;position:relative;z-index:1}
.mt-compare-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--wire)}
.mt-page-title{font-family:var(--display);font-size:3rem;letter-spacing:0.02em;color:var(--chalk)}
.mt-compare-cards{display:grid;gap:12px;margin-bottom:2rem}
.mt-compare-pcard{
  background:var(--ink);border:1px solid var(--wire);
  padding:1.25rem;text-align:center;position:relative;
}
.mt-compare-rm{
  position:absolute;top:8px;right:8px;
  font-family:var(--mono);font-size:10px;color:var(--ash);
  width:22px;height:22px;border:1px solid var(--wire);border-radius:1px;
  display:flex;align-items:center;justify-content:center;transition:all 0.2s;
}
.mt-compare-rm:hover{border-color:var(--signal);color:var(--signal)}
.mt-compare-table-wrap{border:1px solid var(--wire);overflow:auto}
.mt-compare-table{width:100%;border-collapse:collapse;min-width:500px}
.mt-compare-table th{padding:12px 14px;font-family:var(--mono);font-size:9px;font-weight:400;color:var(--ash);text-transform:uppercase;letter-spacing:0.12em;background:var(--plate);border-bottom:1px solid var(--wire);text-align:left}
.mt-compare-table td{padding:12px 14px;font-size:12px;color:var(--ash);border-bottom:1px solid var(--wire);vertical-align:top}
.mt-compare-table tr:last-child td{border-bottom:none}
.mt-compare-table tr:hover td{background:var(--smoke)}
.mt-compare-table td.hl{color:var(--phosphor);font-family:var(--mono)}
.mt-attr-label{font-family:var(--mono);font-size:10px;font-weight:400;color:var(--chalk);width:160px;letter-spacing:0.06em}

/* ── CATEGORIES PAGE ── */
.mt-cats-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem;position:relative;z-index:1}
.mt-cats-page-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0;border:1px solid var(--wire)}
.mt-cat-full{
  padding:2rem;border-right:1px solid var(--wire);border-bottom:1px solid var(--wire);
  cursor:crosshair;transition:background 0.2s;
  display:flex;align-items:center;gap:1.5rem;position:relative;
}
.mt-cat-full:hover{background:var(--plate)}
.mt-cat-full-icon{font-size:28px;flex-shrink:0;filter:grayscale(0.2)}
.mt-cat-full-name{font-size:13px;font-weight:400;color:var(--chalk);letter-spacing:-0.01em;margin-bottom:3px}
.mt-cat-full-cnt{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.1em}
.mt-cat-full-arrow{position:absolute;right:1.5rem;top:50%;transform:translateY(-50%);font-family:var(--mono);font-size:12px;color:var(--phosphor);opacity:0;transition:opacity 0.2s}
.mt-cat-full:hover .mt-cat-full-arrow{opacity:1}

/* ── CART ── */
.mt-cart-shell{max-width:1200px;margin:0 auto;padding:3rem 2rem;display:flex;gap:3rem;position:relative;z-index:1}
.mt-cart-items{flex:1}
.mt-cart-summary{width:300px;flex-shrink:0;position:sticky;top:calc(var(--nav-h)+1rem);align-self:start}
.mt-cart-row{
  display:grid;grid-template-columns:60px 1fr auto;gap:1.5rem;align-items:center;
  padding:1.5rem 0;border-bottom:1px solid var(--wire);
  animation:fadeIn 0.4s var(--ease) both;
}
.mt-cart-img{
  width:60px;height:60px;background:var(--plate);border:1px solid var(--wire);
  border-radius:1px;display:flex;align-items:center;justify-content:center;font-size:24px;
}
.mt-cart-info{min-width:0}
.mt-cart-name{font-size:13px;color:var(--chalk);font-weight:400;margin-bottom:4px;letter-spacing:-0.01em}
.mt-cart-site{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.1em;text-transform:uppercase}
.mt-cart-price{font-family:var(--display);font-size:1.8rem;color:var(--chalk);letter-spacing:0.02em}
.mt-qty{display:flex;align-items:center;border:1px solid var(--wire);margin-top:8px;width:fit-content}
.mt-qty-btn{width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:14px;color:var(--ash);transition:all 0.15s}
.mt-qty-btn:hover{background:var(--plate);color:var(--chalk)}
.mt-qty-val{padding:0 10px;font-family:var(--mono);font-size:11px;border-left:1px solid var(--wire);border-right:1px solid var(--wire);min-width:36px;text-align:center;height:28px;display:flex;align-items:center;justify-content:center}
.mt-cart-rm{font-family:var(--mono);font-size:9px;color:var(--ash);cursor:crosshair;margin-top:6px;letter-spacing:0.1em;transition:color 0.2s;text-transform:uppercase}
.mt-cart-rm:hover{color:var(--signal)}
.mt-cart-summary-box{border:1px solid var(--wire2);background:var(--ink)}
.mt-cart-sum-title{padding:1.25rem 1.5rem;border-bottom:1px solid var(--wire);font-family:var(--mono);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--chalk)}
.mt-cart-sum-body{padding:1.25rem 1.5rem;display:flex;flex-direction:column;gap:8px}
.mt-cart-sum-row{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;color:var(--ash)}
.mt-cart-sum-row span:last-child{color:var(--chalk)}
.mt-cart-sum-row.green span:last-child{color:var(--phosphor)}
.mt-cart-sum-row.total{color:var(--chalk);font-size:14px;padding-top:12px;border-top:1px solid var(--wire);margin-top:4px}
.mt-checkout{
  display:block;font-family:var(--mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);
  padding:16px;text-align:center;margin-top:1rem;border-radius:1px;
  transition:all 0.25s;box-shadow:0 0 30px var(--phosphor-dim);
}
.mt-checkout:hover{background:var(--chalk)}
.mt-savings-note{
  font-family:var(--mono);font-size:10px;color:var(--phosphor);
  background:rgba(184,255,87,0.05);border:1px solid rgba(184,255,87,0.15);
  padding:8px 12px;letter-spacing:0.06em;margin-top:10px;text-align:center;
}

/* ── EMPTY ── */
.mt-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;padding:6rem 2rem;text-align:center}
.mt-empty-icon{font-size:40px;filter:grayscale(0.5)}
.mt-empty-title{font-family:var(--display);font-size:2.5rem;letter-spacing:0.02em;color:var(--chalk)}
.mt-empty-sub{font-family:var(--mono);font-size:11px;color:var(--ash);max-width:300px;line-height:1.8;letter-spacing:0.06em}
.mt-empty-btn{
  font-family:var(--mono);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--void);background:var(--phosphor);padding:12px 24px;border-radius:1px;
  margin-top:0.5rem;transition:all 0.2s;
}
.mt-empty-btn:hover{background:var(--chalk)}

/* ── ADD TO COMPARE ── */
.mt-add-compare{
  font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--ash);border:1px solid var(--wire2);padding:7px 13px;border-radius:1px;
  transition:all 0.2s;
}
.mt-add-compare:hover{border-color:var(--wire3);color:var(--chalk)}

/* ── FOOTER ── */
.mt-footer{
  position:relative;z-index:1;background:var(--ink);
  border-top:1px solid var(--wire);padding:3rem 2rem;margin-top:6rem;
}
.mt-footer-inner{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:3rem;padding-bottom:2rem;border-bottom:1px solid var(--wire)}
.mt-footer-brand{font-family:var(--display);font-size:2.5rem;letter-spacing:0.02em;color:var(--chalk);line-height:0.9}
.mt-footer-brand em{font-style:normal;color:var(--phosphor)}
.mt-footer-desc{font-size:11px;font-weight:300;color:var(--ash);line-height:1.8;margin-top:1rem;max-width:200px}
.mt-footer-col-title{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:1rem}
.mt-footer-link{font-family:var(--mono);font-size:10px;color:var(--ash);margin-bottom:8px;cursor:crosshair;transition:color 0.2s;display:block;letter-spacing:0.04em}
.mt-footer-link:hover{color:var(--chalk)}
.mt-footer-bottom{max-width:1400px;margin:1.5rem auto 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.1em;text-transform:uppercase}

@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

@media(max-width:900px){
  .mt-hero h1{font-size:clamp(4rem,18vw,8rem)}
  .mt-hero-stats{position:static;transform:none;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;gap:2rem;margin-top:2rem}
  .mt-hero-sub{flex-direction:column;align-items:flex-start}
  .mt-cats{grid-template-columns:repeat(2,1fr)}
  .mt-howgrid{grid-template-columns:repeat(2,1fr)}
  .mt-product-layout{grid-template-columns:1fr}
  .mt-search-layout{flex-direction:column}
  .mt-sidebar{width:100%;position:static}
  .mt-cart-shell{flex-direction:column}
  .mt-cart-summary{width:100%;position:static}
  .mt-footer-inner{grid-template-columns:1fr 1fr}
  .mt-prodrow{grid-template-columns:2rem 1fr auto}
  .mt-result-row{grid-template-columns:50px 1fr}
  .mt-result-prices{display:none}
  .mt-section-hd{grid-template-columns:1fr}
  .mt-section-title{text-align:left;font-size:3rem}
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function useRipple() {
  const ref = useRef<HTMLButtonElement>(null);
  const createRipple = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size/2;
    const y = e.clientY - rect.top - size/2;
    const ripple = document.createElement("span");
    Object.assign(ripple.style,{position:"absolute",width:`${size}px`,height:`${size}px`,left:`${x}px`,top:`${y}px`,borderRadius:"50%",background:"rgba(184,255,87,0.15)",transform:"scale(0)",animation:"ripple 0.5s linear",pointerEvents:"none"});
    if(!document.getElementById("ripple-kf")){const s=document.createElement("style");s.id="ripple-kf";s.textContent="@keyframes ripple{to{transform:scale(2.5);opacity:0}}";document.head.appendChild(s)}
    el.style.position="relative";el.style.overflow="hidden";
    el.appendChild(ripple);setTimeout(()=>ripple.remove(),500);
  };
  return {ref,createRipple};
}

// Custom cursor
function Cursor() {
  const cx = useRef<HTMLDivElement>(null);
  const cy = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let mx=0,my=0,rx=0,ry=0;
    const move=(e:MouseEvent)=>{mx=e.clientX;my=e.clientY;if(cx.current)Object.assign(cx.current.style,{left:mx+"px",top:my+"px"})};
    const loop=()=>{rx+=(mx-rx)*0.1;ry+=(my-ry)*0.1;if(cy.current)Object.assign(cy.current.style,{left:rx+"px",top:ry+"px"});requestAnimationFrame(loop)};
    window.addEventListener("mousemove",move);loop();
    return()=>window.removeEventListener("mousemove",move);
  },[]);
  return(<><div className="mt-cursor" ref={cx}/><div className="mt-cursor-ring" ref={cy}/></>);
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────
function Nav({page,setPage,cartCount,sq,setSq,onSearch}:{page:Page;setPage:(p:Page)=>void;cartCount:number;sq:string;setSq:(v:string)=>void;onSearch:()=>void}) {
  return(
    <nav className="mt-nav">
      <div className="mt-nav-logo" onClick={()=>setPage("home")}>
        MED<span className="mt-nav-logo-dot">.</span>TRACKER
      </div>
      <div className="mt-nav-search">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{color:"var(--ash)",flexShrink:0}}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="search medicines, supplements…" value={sq} onChange={e=>setSq(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearch()}/>
        <button className="mt-nav-search-btn" onClick={onSearch}>SEARCH</button>
      </div>
      <div className="mt-nav-links">
        {([["categories","CATEGORIES"],["compare","COMPARE"],["cart","CART"]] as const).map(([p,label])=>(
          <div key={p} className={`mt-nav-link ${page===p?"active":""}`} onClick={()=>setPage(p)}>
            {label}{p==="cart"&&cartCount>0&&<span key={cartCount} className="mt-cart-badge">{cartCount}</span>}
          </div>
        ))}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────────────────────
function Home({setPage,setSq,setSelectedProduct,setCompareList}:{setPage:(p:Page)=>void;setSq:(v:string)=>void;setSelectedProduct:(p:Product)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void}) {
  const [heroQ,setHeroQ]=useState("");
  const doSearch=()=>{if(!heroQ.trim())return;setSq(heroQ);setPage("search")};

  return(
    <div>
      {/* HERO */}
      <div className="mt-hero">
        <div className="mt-hero-bg"/>
        <div className="mt-hero-grid"/>

        <div className="mt-hero-eyebrow">
          <div className="mt-hero-eyebrow-dot"/>
          India's Health Price Intelligence System
        </div>

        <h1>
          NEVER<br/>
          <em>OVERPAY</em><br/>
          AGAIN
        </h1>

        <div className="mt-hero-sub">
          <p className="mt-hero-desc">
            Real-time price comparison across 1mg, PharmEasy, Netmeds, Apollo and more.
            Find the best deal in seconds. Always free.
          </p>
          <div className="mt-hero-cta">
            <div style={{display:"flex",gap:8,alignItems:"center",
              background:"rgba(255,255,255,0.04)",border:"1px solid var(--wire2)",
              padding:"8px 8px 8px 16px",borderRadius:2}}>
              <input
                style={{background:"none",border:"none",outline:"none",fontFamily:"var(--mono)",fontSize:12,
                  color:"var(--chalk)",letterSpacing:"0.05em",width:280}}
                placeholder="whey protein, vitamin D3, creatine…"
                value={heroQ} onChange={e=>setHeroQ(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doSearch()}
                autoFocus
              />
              <button className="mt-hero-btn" onClick={doSearch}>COMPARE →</button>
            </div>
            <div className="mt-hero-scroll">SCROLL TO EXPLORE</div>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="mt-hero-stats">
          {[["0","Products"],["0","Stores"],["₹0","Saved"]].map(([n,l])=>(
            <div key={l} className="mt-stat">
              <div className="mt-stat-num">{n}</div>
              <div className="mt-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TICKER */}
      <div className="mt-ticker">
        <div className="mt-ticker-inner">
          {[...Array(2)].map((_,rep)=>(
            <span key={rep} style={{display:"inline-flex",gap:"4rem"}}>
              {["1mg","PharmEasy","Netmeds","Apollo","HealthKart","Amazon","Flipkart"].map(s=>(
                <span key={s+rep} className="mt-ticker-item">
                  <span className="mt-ticker-sep">◆</span>{s}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mt-section" style={{paddingBottom:"2rem"}}>
        <div className="mt-section-hd">
          <div className="mt-section-label">Browse</div>
          <div className="mt-section-title">CATE<em>GORIES</em></div>
        </div>
        <div className="mt-cats">
          {CATEGORIES.map((c,i)=>(
            <div key={c.name} className="mt-cat" onClick={()=>{setSq(c.name);setPage("search")}}>
              <div className="mt-cat-num">{String(i+1).padStart(2,"0")}</div>
              <div className="mt-cat-icon">{c.icon}</div>
              <div className="mt-cat-name">{c.name}</div>
              <div className="mt-cat-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* STORES */}
      <div className="mt-sites">
        <div className="mt-sites-label">Comparing across</div>
        {SITES.map(s=><div key={s} className="mt-site-tag">{s}</div>)}
      </div>

      {/* PRODUCTS */}
      <div className="mt-section">
        <div className="mt-section-hd">
          <div className="mt-section-label">Best Deals</div>
          <div className="mt-section-title">FEAT<em>URED</em></div>
        </div>
        <div className="mt-prodlist">
          {PRODUCTS.map((p,idx)=>{
            const best=p.prices[0];
            const d=disc(best.price,best.mrp);
            return(
              <div key={p.id} className="mt-prodrow" style={{animationDelay:`${idx*0.06}s`}}
                onClick={()=>{setSelectedProduct(p);setPage("product")}}>
                <div className="mt-prodrow-idx">{String(idx+1).padStart(2,"0")}</div>
                <div className="mt-prodrow-info">
                  <div className="mt-prodrow-brand">{p.brand}</div>
                  <div className="mt-prodrow-name">
                    {p.name}
                    {p.tag&&<span className="mt-prodrow-tag">{p.tag}</span>}
                  </div>
                </div>
                <div className="mt-prodrow-meta">
                  <div className="mt-prodrow-price">₹{best.price.toLocaleString()}</div>
                  <div className="mt-prodrow-disc">{d}% OFF MRP</div>
                  <div className="mt-prodrow-stores">{p.prices.length} stores</div>
                </div>
                <button className="mt-prodrow-cta" onClick={e=>{e.stopPropagation();setSelectedProduct(p);setPage("product")}}>
                  VIEW →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-section" style={{paddingTop:"2rem"}}>
        <div className="mt-section-hd" style={{marginBottom:"2rem"}}>
          <div className="mt-section-label">Process</div>
          <div className="mt-section-title">HOW IT<em> WORKS</em></div>
        </div>
        <div className="mt-howgrid">
          {[
            {n:"01",icon:"🔍",title:"Search any product",desc:"Type a medicine, brand, or supplement name. Results appear instantly."},
            {n:"02",icon:"📊",title:"Compare live prices",desc:"We surface real-time prices across 7+ stores, ranked cheapest first."},
            {n:"03",icon:"🛒",title:"Add to cart",desc:"Pick your store. Add to cart. Check out directly from the retailer."},
            {n:"04",icon:"💰",title:"Save every time",desc:"The tracker finds deals you'd never find manually. Every. Single. Time."},
          ].map(c=>(
            <div key={c.n} className="mt-howcard">
              <div className="mt-howcard-n">{c.n}</div>
              <div className="mt-howcard-icon">{c.icon}</div>
              <div className="mt-howcard-title">{c.title}</div>
              <div className="mt-howcard-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────────────────────
function Search({query,setPage,setSelectedProduct,addToCart,setCompareList}:{query:string;setPage:(p:Page)=>void;setSelectedProduct:(p:Product)=>void;addToCart:(p:Product,s:string)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void}) {
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

  return(
    <div className="mt-search-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div className="mt-search-topbar">
        <div className="mt-search-title">{query?`"${query}"` : "ALL PRODUCTS"}</div>
        <div className="mt-search-count">{filtered.length} RESULTS</div>
        <select className="mt-sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="price_asc">PRICE: LOW → HIGH</option>
          <option value="price_desc">PRICE: HIGH → LOW</option>
          <option value="rating">BEST RATED</option>
          <option value="popular">MOST POPULAR</option>
        </select>
      </div>

      <div className="mt-search-layout">
        <div className="mt-sidebar">
          <div className="mt-filter-group">
            <div className="mt-filter-title">Availability</div>
            <div className="mt-filter-opt" onClick={()=>setStockOnly(!stockOnly)}>
              <div className={`mt-filter-cb ${stockOnly?"on":""}`}/>
              <span className="mt-filter-label">In Stock Only</span>
            </div>
          </div>
          <div className="mt-filter-group">
            <div className="mt-filter-title">Category</div>
            {allCats.map(c=>(
              <div key={c} className="mt-filter-opt" onClick={()=>toggle(cats,setCats,c)}>
                <div className={`mt-filter-cb ${cats.includes(c)?"on":""}`}/>
                <span className="mt-filter-label">{c}</span>
                <span className="mt-filter-cnt">{PRODUCTS.filter(p=>p.category===c).length}</span>
              </div>
            ))}
          </div>
          <div className="mt-filter-group">
            <div className="mt-filter-title">Store</div>
            {SITES.map(s=>(
              <div key={s} className="mt-filter-opt" onClick={()=>toggle(sites,setSites,s)}>
                <div className={`mt-filter-cb ${sites.includes(s)?"on":""}`}/>
                <span className="mt-filter-label">{s}</span>
              </div>
            ))}
          </div>
          {(cats.length>0||sites.length>0||stockOnly)&&(
            <button style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--signal)",border:"1px solid rgba(255,77,46,0.2)",padding:"8px 12px",width:"100%"}} onClick={()=>{setCats([]);setSites([]);setStockOnly(false)}}>CLEAR ALL</button>
          )}
        </div>

        <div className="mt-results-area">
          {filtered.length===0?(
            <div className="mt-empty">
              <div className="mt-empty-icon">🔍</div>
              <div className="mt-empty-title">NO RESULTS</div>
              <div className="mt-empty-sub">Try different filters or keywords.</div>
              <button className="mt-empty-btn" onClick={()=>{setCats([]);setSites([])}}>CLEAR FILTERS</button>
            </div>
          ):filtered.map((p,i)=>{
            const best=p.prices[0];const d=disc(best.price,best.mrp);
            return(
              <div key={p.id} className="mt-result-row" style={{animationDelay:`${i*0.04}s`,animation:"fadeUp 0.4s var(--ease) both"}}
                onClick={()=>{setSelectedProduct(p);setPage("product")}}>
                <div className="mt-result-img">{p.image}</div>
                <div className="mt-result-info">
                  <div className="mt-result-brand">{p.brand}</div>
                  <div className="mt-result-name">{p.name}</div>
                  <div className="mt-result-rating-chip">★ {p.rating} · {p.reviews.toLocaleString()} reviews</div>
                  <div className="mt-result-highlights">
                    {p.highlights.slice(0,3).map(h=><span key={h} className="mt-result-hl">{h}</span>)}
                  </div>
                </div>
                <div className="mt-result-prices" onClick={e=>e.stopPropagation()}>
                  <div className="mt-result-from">BEST PRICE</div>
                  <div className="mt-result-big">₹{best.price.toLocaleString()}</div>
                  <div className="mt-result-disc">↓ {d}% OFF · {best.site}</div>
                  <div className="mt-result-btns" style={{marginTop:4}}>
                    <button className="mt-result-view" onClick={()=>{setSelectedProduct(p);setPage("product")}}>VIEW</button>
                    <button className="mt-result-add" onClick={()=>addToCart(p,best.site)}>ADD</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT
// ─────────────────────────────────────────────────────────────────────────────
function ProductPage({product,setPage,addToCart,setCompareList}:{product:Product;setPage:(p:Page)=>void;addToCart:(p:Product,s:string)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void}) {
  const {ref,createRipple}=useRipple();
  const best=product.prices.filter(p=>p.inStock).sort((a,b)=>a.price-b.price)[0]||product.prices[0];
  const maxP=product.prices[product.prices.length-1].price;
  const savings=maxP-best.price;

  return(
    <div className="mt-product-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div className="mt-breadcrumb">
        <span onClick={()=>setPage("home")}>HOME</span>
        <span className="mt-breadcrumb-sep">/</span>
        <span onClick={()=>setPage("search")}>{product.category.toUpperCase()}</span>
        <span className="mt-breadcrumb-sep">/</span>
        <span style={{color:"var(--chalk)"}}>{product.brand.toUpperCase()}</span>
      </div>

      <div className="mt-product-layout">
        <div className="mt-product-left">
          <div className="mt-product-hero">{product.image}</div>
          <div className="mt-product-brand">{product.brand}</div>
          <div className="mt-product-name">{product.name}</div>
          <div className="mt-product-rtg">
            <span className="mt-rtg-val">★ {product.rating}</span>
            <span className="mt-rtg-cnt">{product.reviews.toLocaleString()} REVIEWS</span>
          </div>
          <p className="mt-product-desc">{product.description}</p>

          <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--phosphor)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:"1rem"}}>Key Highlights</div>
          <div className="mt-hl-grid">
            {product.highlights.map(h=>(
              <div key={h} className="mt-hl-item">
                <div className="mt-hl-marker"/>
                {h}
              </div>
            ))}
          </div>

          <div className="mt-price-table">
            <div className="mt-price-table-hd">
              <div className="mt-price-table-title">PRICE COMPARISON</div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div className="mt-price-table-sub">{product.prices.length} STORES · LIVE</div>
                <button className="mt-add-compare" onClick={()=>{setCompareList(prev=>prev.find(x=>x.id===product.id)?prev:[...prev.slice(0,2),product]);setPage("compare")}}>+ COMPARE</button>
              </div>
            </div>

            {savings>0&&(
              <div className="mt-savings-bar">
                SAVE ₹{savings.toLocaleString()} BY CHOOSING THE BEST DEAL
              </div>
            )}

            {[...product.prices].sort((a,b)=>a.price-b.price).map((pr,i)=>{
              const isBest=i===0&&pr.inStock;const d=disc(pr.price,pr.mrp);
              return(
                <div key={pr.site} className={`mt-price-row ${isBest?"best":""}`}>
                  <div className="mt-price-row-rank">#{i+1}</div>
                  <div>
                    <div className="mt-price-row-site">
                      {pr.site}{isBest&&<span className="mt-best-badge">BEST</span>}
                    </div>
                    <div className={`mt-price-delivery ${pr.delivery==="Today"||pr.delivery==="Tomorrow"?"fast":""}`}>
                      🚚 {pr.delivery}
                    </div>
                  </div>
                  <div className="mt-price-delivery">{pr.delivery==="Today"?"EXPRESS":pr.delivery==="Tomorrow"?"NEXT DAY":"STANDARD"}</div>
                  <div>
                    {pr.inStock?(
                      <>
                        <div className="mt-price-big">₹{pr.price.toLocaleString()}</div>
                        <div className="mt-price-disc-sm">{d}% OFF</div>
                      </>
                    ):<div className="mt-price-oos">OUT OF STOCK</div>}
                  </div>
                  {pr.inStock
                    ?<button className="mt-buy-row-btn" onClick={()=>addToCart(product,pr.site)}>ADD</button>
                    :<button className="mt-notify-btn">NOTIFY</button>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-product-right">
          <div className="mt-buy-card">
            <div className="mt-buy-card-hd">
              <div className="mt-buy-label">BEST PRICE AVAILABLE</div>
              <div className="mt-buy-price">₹{best.price.toLocaleString()}</div>
              <div className="mt-buy-sub">
                <span className="mt-buy-mrp">₹{best.mrp}</span>
                <span className="mt-buy-disc">{disc(best.price,best.mrp)}% OFF</span>
              </div>
              <div className="mt-buy-from">on {best.site}</div>
            </div>
            <div className="mt-buy-card-body">
              <div className="mt-buy-del">🚚 {best.delivery} delivery</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ash)",letterSpacing:"0.06em"}}>Free delivery above ₹499</div>
              <button ref={ref} className="mt-buy-now" onMouseDown={createRipple}>
                BUY NOW · {best.site}
              </button>
              <button className="mt-buy-cart" onClick={()=>addToCart(product,best.site)}>ADD TO CART</button>
              <button className="mt-buy-compare" onClick={()=>{setCompareList(prev=>prev.find(x=>x.id===product.id)?prev:[...prev.slice(0,2),product]);setPage("compare")}}>
                ADD TO COMPARE
              </button>
            </div>
          </div>

          {PRODUCTS.filter(p=>p.id!==product.id&&p.category===product.category).slice(0,2).map(p=>(
            <div key={p.id} style={{
              display:"flex",alignItems:"center",gap:12,padding:"1rem 0",
              borderBottom:"1px solid var(--wire)",cursor:"crosshair",
              marginTop:0,transition:"background 0.2s",
            }} onClick={()=>{}}>
              <div style={{width:36,height:36,background:"var(--plate)",border:"1px solid var(--wire)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{p.image}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--ash)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>{p.brand}</div>
                <div style={{fontSize:11,color:"var(--chalk)",letterSpacing:"-0.01em",lineHeight:1.3}}>{p.name}</div>
              </div>
              <div style={{fontFamily:"var(--display)",fontSize:"1.2rem",color:"var(--phosphor)",letterSpacing:"0.02em",flexShrink:0}}>₹{p.prices[0].price.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARE
// ─────────────────────────────────────────────────────────────────────────────
function Compare({compareList,setCompareList,setPage,addToCart}:{compareList:Product[];setCompareList:(fn:(prev:Product[])=>Product[])=>void;setPage:(p:Page)=>void;addToCart:(p:Product,s:string)=>void}) {
  if(compareList.length===0) return(
    <div className="mt-compare-shell">
      <div className="mt-empty">
        <div className="mt-empty-icon">⚖️</div>
        <div className="mt-empty-title">NOTHING TO COMPARE</div>
        <div className="mt-empty-sub">Browse products and click "Compare" to add them here.</div>
        <button className="mt-empty-btn" onClick={()=>setPage("search")}>BROWSE PRODUCTS</button>
      </div>
    </div>
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

  return(
    <div className="mt-compare-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div className="mt-compare-hd">
        <div className="mt-page-title">COMPARE</div>
        <button style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--phosphor)",border:"1px solid rgba(184,255,87,0.2)",padding:"8px 16px",borderRadius:1}} onClick={()=>setPage("search")}>+ ADD MORE</button>
      </div>
      <div className="mt-compare-cards" style={{gridTemplateColumns:`repeat(${compareList.length},1fr)`}}>
        {compareList.map(p=>(
          <div key={p.id} className="mt-compare-pcard">
            <button className="mt-compare-rm" onClick={()=>setCompareList(prev=>prev.filter(x=>x.id!==p.id))}>✕</button>
            <div style={{fontSize:32,margin:"0 auto 8px"}}>{p.image}</div>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--phosphor)",letterSpacing:"0.12em",textTransform:"uppercase"}}>{p.brand}</div>
            <div style={{fontSize:12,color:"var(--chalk)",marginTop:4,lineHeight:1.3}}>{p.name}</div>
            <button style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--void)",background:"var(--phosphor)",padding:"8px",width:"100%",marginTop:12,borderRadius:1}} onClick={()=>addToCart(p,p.prices[0].site)}>ADD TO CART</button>
          </div>
        ))}
      </div>
      <div className="mt-compare-table-wrap">
        <table className="mt-compare-table">
          <thead>
            <tr><th>Attribute</th>{compareList.map(p=><th key={p.id}>{p.brand}</th>)}</tr>
          </thead>
          <tbody>
            {attrs.map(a=>(
              <tr key={a}>
                <td className="mt-attr-label">{a}</td>
                {compareList.map(p=>{const v=getVal(p,a);return<td key={p.id} className={isHl(a,v)?"hl":""}>{a==="Description"?<span style={{fontSize:11,lineHeight:1.7,display:"block"}}>{v}</span>:v}</td>})}
              </tr>
            ))}
            <tr>
              <td className="mt-attr-label">Prices by Store</td>
              {compareList.map(p=>(
                <td key={p.id}>
                  {p.prices.slice(0,3).map(pr=>(
                    <div key={pr.site} style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ash)",marginBottom:3,letterSpacing:"0.04em"}}>
                      {pr.site}: <span style={{color:"var(--chalk)"}}>₹{pr.price.toLocaleString()}</span>
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

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
function Categories({setPage,setSq}:{setPage:(p:Page)=>void;setSq:(v:string)=>void}) {
  return(
    <div className="mt-cats-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div style={{fontFamily:"var(--display)",fontSize:"3rem",letterSpacing:"0.02em",color:"var(--chalk)",paddingBottom:"1.5rem",borderBottom:"1px solid var(--wire)",marginBottom:"2.5rem"}}>
        ALL CATEGORIES
      </div>
      <div className="mt-cats-page-grid">
        {CATEGORIES.map(c=>(
          <div key={c.name} className="mt-cat-full" onClick={()=>{setSq(c.name);setPage("search")}}>
            <div className="mt-cat-full-icon">{c.icon}</div>
            <div>
              <div className="mt-cat-full-name">{c.name}</div>
              <div className="mt-cat-full-cnt">{c.count} products</div>
            </div>
            <div className="mt-cat-full-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────────────────────────────────────
function Cart({cart,setCart,setPage}:{cart:CartItem[];setCart:(fn:(prev:CartItem[])=>CartItem[])=>void;setPage:(p:Page)=>void}) {
  const subtotal=cart.reduce((s,i)=>{const p=i.product.prices.find(p=>p.site===i.site)!;return s+p.price*i.qty},0);
  const mrpTotal=cart.reduce((s,i)=>{const p=i.product.prices.find(p=>p.site===i.site)!;return s+p.mrp*i.qty},0);
  const saved=mrpTotal-subtotal;const delivery=subtotal>499?0:49;

  if(cart.length===0) return(
    <div className="mt-cart-shell">
      <div className="mt-empty">
        <div className="mt-empty-icon">🛒</div>
        <div className="mt-empty-title">CART IS EMPTY</div>
        <div className="mt-empty-sub">Compare prices and add products to get started.</div>
        <button className="mt-empty-btn" onClick={()=>setPage("search")}>BROWSE PRODUCTS</button>
      </div>
    </div>
  );

  return(
    <div className="mt-cart-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div className="mt-cart-items">
        <div style={{fontFamily:"var(--display)",fontSize:"2.5rem",letterSpacing:"0.02em",color:"var(--chalk)",paddingBottom:"1.5rem",borderBottom:"1px solid var(--wire)",marginBottom:"0.5rem"}}>
          CART ({cart.reduce((s,i)=>s+i.qty,0)})
        </div>
        {cart.map((item,idx)=>{
          const priceObj=item.product.prices.find(p=>p.site===item.site)!;
          return(
            <div key={`${item.product.id}-${item.site}`} className="mt-cart-row" style={{animationDelay:`${idx*0.07}s`}}>
              <div className="mt-cart-img">{item.product.image}</div>
              <div className="mt-cart-info">
                <div className="mt-cart-name">{item.product.name}</div>
                <div className="mt-cart-site">{item.site} · {priceObj.delivery}</div>
                <div className="mt-qty">
                  <button className="mt-qty-btn" onClick={()=>setCart(prev=>prev.map((c,i)=>i===idx?{...c,qty:Math.max(1,c.qty-1)}:c))}>−</button>
                  <div className="mt-qty-val">{item.qty}</div>
                  <button className="mt-qty-btn" onClick={()=>setCart(prev=>prev.map((c,i)=>i===idx?{...c,qty:c.qty+1}:c))}>+</button>
                </div>
                <div className="mt-cart-rm" onClick={()=>setCart(prev=>prev.filter((_,i)=>i!==idx))}>REMOVE</div>
              </div>
              <div className="mt-cart-price">₹{(priceObj.price*item.qty).toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-cart-summary">
        <div className="mt-cart-summary-box">
          <div className="mt-cart-sum-title">ORDER SUMMARY</div>
          <div className="mt-cart-sum-body">
            <div className="mt-cart-sum-row"><span>MRP TOTAL</span><span>₹{mrpTotal.toLocaleString()}</span></div>
            <div className="mt-cart-sum-row green"><span>DISCOUNT</span><span>−₹{saved.toLocaleString()}</span></div>
            <div className="mt-cart-sum-row"><span>DELIVERY</span><span>{delivery===0?"FREE":`₹${delivery}`}</span></div>
            <div className="mt-cart-sum-row total"><span>TOTAL</span><span>₹{(subtotal+delivery).toLocaleString()}</span></div>
            {saved>0&&<div className="mt-savings-note">YOU SAVE ₹{saved.toLocaleString()} ON THIS ORDER</div>}
            <button className="mt-checkout">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
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
      return[...prev,{product:p,site,qty:1}];
    });
  },[]);

  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const goTo=(p:Page)=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"})};
  const onSearch=()=>{if(sq.trim())goTo("search")};

  return(
    <>
      <style>{CSS}</style>
      <Cursor/>
      <div className="mt-noise"/>
      <div className="mt-scan"/>
      <div className="mt-bracket tl"/><div className="mt-bracket tr"/>
      <div className="mt-bracket bl"/><div className="mt-bracket br"/>

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
              <div className="mt-footer-brand">MED<em>.</em><br/>TRACKER</div>
              <p className="mt-footer-desc">India's health price intelligence system. Real-time. Zero bias. Always free.</p>
            </div>
            {[{title:"Compare",links:["Search Products","By Category","All Stores","Price Alerts"]},{title:"Company",links:["About Us","Blog","Careers","Contact"]},{title:"Legal",links:["Privacy Policy","Terms of Use","Cookie Policy"]}].map(col=>(
              <div key={col.title}>
                <div className="mt-footer-col-title">{col.title}</div>
                {col.links.map(l=><div key={l} className="mt-footer-link">{l}</div>)}
              </div>
            ))}
          </div>
          <div className="mt-footer-bottom">
            <span>© 2025 MEDTRACKER · NOT AFFILIATED WITH ANY PHARMACY</span>
            <span>PRICES SOURCED LIVE AND MAY VARY</span>
          </div>
        </footer>
      </div>
    </>
  );
}