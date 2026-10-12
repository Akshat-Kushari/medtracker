"use client";
import { useState, useEffect, useRef, useCallback } from "react";

type Page = "home" | "search" | "product" | "compare" | "categories" | "cart" | "ai";

interface Product {
  id: string; name: string; brand: string; category: string;
  image: string; tag?: string;
  prices: { site: string; price: number; mrp: number; link: string; inStock: boolean; delivery: string; color: string }[];
  rating: number; reviews: number; description: string; highlights: string[];
}
interface CartItem { product: Product; site: string; qty: number }

const PRODUCTS: Product[] = [
  // ── VITAMINS & MINERALS ──
  {
    id:"v1", name:"Vitamin D3 + K2 60 Softgels", brand:"HealthVit", category:"Vitamins & Minerals", image:"☀️",
    prices:[
      {site:"1mg",price:349,mrp:499,link:"https://www.1mg.com/search/all?name=vitamin+d3+k2",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:369,mrp:499,link:"https://pharmeasy.in/search/all?name=vitamin+d3+k2",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:389,mrp:499,link:"https://www.netmeds.com/catalogsearch/result?q=vitamin+d3+k2",inStock:false,delivery:"3 days",color:"#805ad5"},
      {site:"Apollo",price:399,mrp:499,link:"https://apollopharmacy.in/search-medicines/vitamin%20d3%20k2",inStock:true,delivery:"2 days",color:"#2b6cb0"},
    ],
    rating:4.5, reviews:1893,
    description:"Combined D3 and K2 formula for optimal calcium absorption and bone health. 2000 IU D3 + 90mcg K2 per softgel.",
    highlights:["2000 IU Vitamin D3","90mcg Vitamin K2","Improves bone density","Supports heart health","Easy-to-swallow softgel"],
  },
  {
    id:"v2", name:"Biotin 10000mcg 90 Tablets", brand:"TrueBasics", category:"Vitamins & Minerals", image:"✨", tag:"New",
    prices:[
      {site:"1mg",price:299,mrp:449,link:"https://www.1mg.com/search/all?name=truebasics+biotin",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:319,mrp:449,link:"https://pharmeasy.in/search/all?name=truebasics+biotin",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:329,mrp:449,link:"https://www.netmeds.com/catalogsearch/result?q=truebasics+biotin",inStock:true,delivery:"2 days",color:"#805ad5"},
      {site:"Apollo",price:349,mrp:449,link:"https://apollopharmacy.in/search-medicines/truebasics%20biotin",inStock:true,delivery:"2 days",color:"#2b6cb0"},
    ],
    rating:4.3, reviews:2876,
    description:"High potency Biotin supports hair growth, strengthens nails and promotes healthy skin.",
    highlights:["10000mcg Biotin","Hair growth support","Nail strengthening","Skin health booster","100% Vegetarian"],
  },
  {
    id:"v3", name:"Multivitamin + Multimineral 60 Tabs", brand:"Centrum", category:"Vitamins & Minerals", image:"💊", tag:"Bestseller",
    prices:[
      {site:"1mg",price:599,mrp:799,link:"https://www.1mg.com/search/all?name=centrum+multivitamin",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"Amazon",price:629,mrp:799,link:"https://www.amazon.in/s?k=centrum+multivitamin",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"Netmeds",price:649,mrp:799,link:"https://www.netmeds.com/catalogsearch/result?q=centrum+multivitamin",inStock:true,delivery:"2 days",color:"#805ad5"},
    ],
    rating:4.4, reviews:5234,
    description:"Complete daily multivitamin with 24 essential nutrients. Supports energy, immunity, and overall wellbeing.",
    highlights:["24 essential nutrients","Daily immunity boost","Supports energy metabolism","No artificial colors","Clinically proven formula"],
  },
  // ── PROTEIN & FITNESS ──
  {
    id:"p1", name:"MuscleBlaze Whey Gold 1kg Chocolate", brand:"MuscleBlaze", category:"Protein & Fitness", image:"💪", tag:"Hot Deal",
    prices:[
      {site:"HealthKart",price:1799,mrp:2499,link:"https://www.healthkart.com/search?q=muscleblaze+whey+gold",inStock:true,delivery:"Today",color:"#dd6b20"},
      {site:"Amazon",price:1899,mrp:2499,link:"https://www.amazon.in/s?k=muscleblaze+whey+gold+1kg+chocolate",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"Flipkart",price:1950,mrp:2499,link:"https://www.flipkart.com/search?q=muscleblaze+whey+gold+1kg",inStock:true,delivery:"2 days",color:"#4299e1"},
      {site:"1mg",price:2100,mrp:2499,link:"https://www.1mg.com/search/all?name=muscleblaze+whey+gold",inStock:true,delivery:"3 days",color:"#e53e3e"},
    ],
    rating:4.4, reviews:8762,
    description:"25g protein per serving with 5.5g BCAAs. Informed Sport certified for purity. Ideal for muscle recovery post-workout.",
    highlights:["25g protein/serving","5.5g BCAAs","Informed Sport certified","Low sugar","Digestive enzymes added"],
  },
  {
    id:"p2", name:"Creatine Monohydrate 250g Unflavored", brand:"AS-IT-IS", category:"Protein & Fitness", image:"⚡",
    prices:[
      {site:"Amazon",price:449,mrp:599,link:"https://www.amazon.in/s?k=as+it+is+creatine+monohydrate",inStock:true,delivery:"Today",color:"#f6ad55"},
      {site:"HealthKart",price:469,mrp:599,link:"https://www.healthkart.com/search?q=as-it-is+creatine",inStock:true,delivery:"Tomorrow",color:"#dd6b20"},
      {site:"Flipkart",price:489,mrp:599,link:"https://www.flipkart.com/search?q=as-it-is+creatine+monohydrate",inStock:true,delivery:"2 days",color:"#4299e1"},
    ],
    rating:4.5, reviews:12340,
    description:"100% pure micronized creatine monohydrate. No additives, no fillers. Enhances strength, power output and muscle volumization.",
    highlights:["100% pure creatine","Micronized for absorption","5g per serving","Vegan-friendly","Lab tested & certified"],
  },
  {
    id:"p3", name:"Whey Protein Isolate 2kg Double Rich Chocolate", brand:"Optimum Nutrition", category:"Protein & Fitness", image:"🏋️", tag:"Top Rated",
    prices:[
      {site:"HealthKart",price:4899,mrp:6499,link:"https://www.healthkart.com/search?q=ON+gold+standard+whey",inStock:true,delivery:"Today",color:"#dd6b20"},
      {site:"Amazon",price:5199,mrp:6499,link:"https://www.amazon.in/s?k=optimum+nutrition+whey+protein",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"Flipkart",price:5399,mrp:6499,link:"https://www.flipkart.com/search?q=optimum+nutrition+whey+2kg",inStock:true,delivery:"2 days",color:"#4299e1"},
    ],
    rating:4.7, reviews:22100,
    description:"The world's best-selling whey protein. 24g of blended protein per serving with over 5g of BCAAs.",
    highlights:["24g protein/serving","5g+ BCAAs","Over 20 flavors","Gluten-free formula","Banned substance tested"],
  },
  // ── SUPPLEMENTS ──
  {
    id:"s1", name:"Himalaya Ashwagandha 60 Capsules", brand:"Himalaya", category:"Supplements", image:"🌿", tag:"Bestseller",
    prices:[
      {site:"1mg",price:185,mrp:225,link:"https://www.1mg.com/search/all?name=himalaya+ashwagandha",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:195,mrp:225,link:"https://pharmeasy.in/search/all?name=himalaya+ashwagandha",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:199,mrp:225,link:"https://www.netmeds.com/catalogsearch/result?q=himalaya+ashwagandha",inStock:true,delivery:"2 days",color:"#805ad5"},
      {site:"Apollo",price:210,mrp:225,link:"https://apollopharmacy.in/search-medicines/himalaya%20ashwagandha",inStock:false,delivery:"3 days",color:"#2b6cb0"},
    ],
    rating:4.6, reviews:3241,
    description:"Pure root extract standardized to 2.5% withanolides. Helps manage stress and promotes vitality.",
    highlights:["Stress & anxiety relief","Boosts energy & vitality","Improves sleep quality","No added sugar","Vegetarian capsules"],
  },
  {
    id:"s2", name:"Omega-3 Fish Oil 1000mg 60 Caps", brand:"Now Foods", category:"Supplements", image:"🐟", tag:"Top Rated",
    prices:[
      {site:"HealthKart",price:499,mrp:699,link:"https://www.healthkart.com/search?q=now+foods+omega+3",inStock:true,delivery:"Today",color:"#dd6b20"},
      {site:"Amazon",price:529,mrp:699,link:"https://www.amazon.in/s?k=now+foods+omega+3+fish+oil",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"1mg",price:549,mrp:699,link:"https://www.1mg.com/search/all?name=now+foods+omega+3",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"Flipkart",price:579,mrp:699,link:"https://www.flipkart.com/search?q=now+omega+3+fish+oil",inStock:true,delivery:"2 days",color:"#4299e1"},
    ],
    rating:4.7, reviews:5420,
    description:"Premium quality fish oil with 300mg EPA + DHA per softgel. Molecularly distilled for purity with no fishy aftertaste.",
    highlights:["300mg EPA+DHA","Molecularly distilled","No fishy burps","Heart health support","Brain & cognitive support"],
  },
  {
    id:"s3", name:"Magnesium Glycinate 400mg 60 Caps", brand:"Swisse", category:"Supplements", image:"🧲",
    prices:[
      {site:"Amazon",price:699,mrp:999,link:"https://www.amazon.in/s?k=magnesium+glycinate+400mg",inStock:true,delivery:"Today",color:"#f6ad55"},
      {site:"HealthKart",price:749,mrp:999,link:"https://www.healthkart.com/search?q=magnesium+glycinate",inStock:true,delivery:"Tomorrow",color:"#dd6b20"},
      {site:"1mg",price:779,mrp:999,link:"https://www.1mg.com/search/all?name=magnesium+glycinate",inStock:true,delivery:"2 days",color:"#e53e3e"},
    ],
    rating:4.4, reviews:1102,
    description:"Highly bioavailable magnesium glycinate supports muscle function, sleep quality, and nervous system health.",
    highlights:["400mg elemental magnesium","High bioavailability","Sleep & relaxation support","Muscle cramp relief","No laxative effect"],
  },
  // ── AYURVEDIC ──
  {
    id:"a1", name:"Triphala Churna 500g", brand:"Patanjali", category:"Ayurvedic", image:"🍃",
    prices:[
      {site:"1mg",price:129,mrp:180,link:"https://www.1mg.com/search/all?name=patanjali+triphala",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:139,mrp:180,link:"https://pharmeasy.in/search/all?name=patanjali+triphala",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:149,mrp:180,link:"https://www.netmeds.com/catalogsearch/result?q=patanjali+triphala",inStock:true,delivery:"2 days",color:"#805ad5"},
    ],
    rating:4.3, reviews:4521,
    description:"Classic Ayurvedic digestive formula. Combination of three fruits: Amlaki, Bibhitaki and Haritaki.",
    highlights:["Digestive health","Natural detox","Rich in Vitamin C","100% natural herbs","GMP certified"],
  },
  {
    id:"a2", name:"Shilajit Resin 20g Pure", brand:"Dabur", category:"Ayurvedic", image:"🪨", tag:"Bestseller",
    prices:[
      {site:"1mg",price:499,mrp:699,link:"https://www.1mg.com/search/all?name=shilajit+resin",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"Amazon",price:529,mrp:699,link:"https://www.amazon.in/s?k=shilajit+resin+pure",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"Netmeds",price:549,mrp:699,link:"https://www.netmeds.com/catalogsearch/result?q=shilajit+resin",inStock:true,delivery:"2 days",color:"#805ad5"},
    ],
    rating:4.5, reviews:2890,
    description:"Pure Himalayan Shilajit resin. Rich in fulvic acid and 85+ minerals for energy, stamina and vitality.",
    highlights:["85+ trace minerals","High fulvic acid content","Enhances stamina","Cognitive support","Authentic Himalayan source"],
  },
  // ── WEIGHT MANAGEMENT ──
  {
    id:"w1", name:"Apple Cider Vinegar 500ml", brand:"WOW Life Science", category:"Weight Management", image:"🍎",
    prices:[
      {site:"Amazon",price:249,mrp:399,link:"https://www.amazon.in/s?k=wow+apple+cider+vinegar",inStock:true,delivery:"Today",color:"#f6ad55"},
      {site:"Flipkart",price:269,mrp:399,link:"https://www.flipkart.com/search?q=wow+apple+cider+vinegar",inStock:true,delivery:"Tomorrow",color:"#4299e1"},
      {site:"1mg",price:289,mrp:399,link:"https://www.1mg.com/search/all?name=wow+apple+cider+vinegar",inStock:true,delivery:"2 days",color:"#e53e3e"},
    ],
    rating:4.2, reviews:7821,
    description:"Raw, unfiltered ACV with mother. Supports weight management, digestion, and blood sugar balance.",
    highlights:["With mother enzyme","Unfiltered & unpasteurized","Boosts metabolism","Digestive health","No added preservatives"],
  },
  {
    id:"w2", name:"Green Coffee Bean Extract 800mg 60 Caps", brand:"HealthVit", category:"Weight Management", image:"🫘",
    prices:[
      {site:"1mg",price:399,mrp:599,link:"https://www.1mg.com/search/all?name=green+coffee+extract",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:419,mrp:599,link:"https://pharmeasy.in/search/all?name=green+coffee+extract",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Amazon",price:449,mrp:599,link:"https://www.amazon.in/s?k=green+coffee+bean+extract+800mg",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
    ],
    rating:4.1, reviews:3201,
    description:"Standardized green coffee extract with 50% Chlorogenic acid. Supports fat burning and healthy blood sugar levels.",
    highlights:["50% chlorogenic acid","Boosts fat metabolism","Antioxidant rich","No artificial additives","Vegetarian capsules"],
  },
  // ── WOMEN'S HEALTH ──
  {
    id:"wh1", name:"Iron + Folic Acid 60 Tablets", brand:"Himalaya", category:"Women's Health", image:"🌸",
    prices:[
      {site:"1mg",price:149,mrp:199,link:"https://www.1mg.com/search/all?name=himalaya+iron+folic+acid",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:159,mrp:199,link:"https://pharmeasy.in/search/all?name=himalaya+iron+folic+acid",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:169,mrp:199,link:"https://www.netmeds.com/catalogsearch/result?q=himalaya+iron+folic",inStock:true,delivery:"2 days",color:"#805ad5"},
      {site:"Apollo",price:175,mrp:199,link:"https://apollopharmacy.in/search-medicines/iron%20folic%20acid",inStock:true,delivery:"2 days",color:"#2b6cb0"},
    ],
    rating:4.4, reviews:5432,
    description:"Iron and Folic Acid formula for women. Prevents anemia, supports energy and is essential during pregnancy.",
    highlights:["Prevents iron deficiency","Folic acid for women","Energy & vitality boost","Pregnancy support","Gentle on stomach"],
  },
  {
    id:"wh2", name:"Shatavari Capsules 60 Count", brand:"Organic India", category:"Women's Health", image:"🌺", tag:"New",
    prices:[
      {site:"1mg",price:269,mrp:399,link:"https://www.1mg.com/search/all?name=organic+india+shatavari",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"Amazon",price:299,mrp:399,link:"https://www.amazon.in/s?k=organic+india+shatavari",inStock:true,delivery:"Tomorrow",color:"#f6ad55"},
      {site:"PharmEasy",price:309,mrp:399,link:"https://pharmeasy.in/search/all?name=organic+india+shatavari",inStock:true,delivery:"2 days",color:"#3182ce"},
    ],
    rating:4.5, reviews:1876,
    description:"Traditional Ayurvedic herb for women's hormonal balance and reproductive health. Certified organic, sustainably sourced.",
    highlights:["Hormonal balance","Menopause support","USDA organic","Adaptogenic herb","Sustainably sourced"],
  },
  // ── DIABETIC CARE ──
  {
    id:"d1", name:"Sugar Balance 60 Capsules", brand:"Zandu", category:"Diabetic Care", image:"🩸",
    prices:[
      {site:"1mg",price:349,mrp:499,link:"https://www.1mg.com/search/all?name=zandu+sugar+balance",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:369,mrp:499,link:"https://pharmeasy.in/search/all?name=zandu+sugar+balance",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:379,mrp:499,link:"https://www.netmeds.com/catalogsearch/result?q=zandu+sugar+balance",inStock:true,delivery:"2 days",color:"#805ad5"},
    ],
    rating:4.2, reviews:2341,
    description:"Ayurvedic formula to support healthy blood sugar levels. Contains Karela, Jamun, and Gurmar extracts.",
    highlights:["Natural blood sugar support","Karela + Jamun + Gurmar","No hypoglycemia risk","100% herbal","GMP certified"],
  },
  // ── HEART HEALTH ──
  {
    id:"hh1", name:"CoQ10 100mg 60 Softgels", brand:"Solgar", category:"Heart Health", image:"❤️", tag:"Premium",
    prices:[
      {site:"Amazon",price:1299,mrp:1799,link:"https://www.amazon.in/s?k=solgar+coq10+100mg",inStock:true,delivery:"Today",color:"#f6ad55"},
      {site:"HealthKart",price:1349,mrp:1799,link:"https://www.healthkart.com/search?q=solgar+coq10",inStock:true,delivery:"Tomorrow",color:"#dd6b20"},
      {site:"1mg",price:1399,mrp:1799,link:"https://www.1mg.com/search/all?name=solgar+coq10",inStock:true,delivery:"2 days",color:"#e53e3e"},
    ],
    rating:4.6, reviews:3102,
    description:"CoQ10 is a potent antioxidant that supports heart health, cellular energy production and acts as an anti-aging compound.",
    highlights:["100mg pure CoQ10","Cardiovascular support","Cellular energy boost","Antioxidant protection","No artificial additives"],
  },
  {
    id:"hh2", name:"Arjuna Extract 500mg 60 Tabs", brand:"Himalaya", category:"Heart Health", image:"🫀",
    prices:[
      {site:"1mg",price:199,mrp:299,link:"https://www.1mg.com/search/all?name=himalaya+arjuna",inStock:true,delivery:"Today",color:"#e53e3e"},
      {site:"PharmEasy",price:215,mrp:299,link:"https://pharmeasy.in/search/all?name=himalaya+arjuna",inStock:true,delivery:"Tomorrow",color:"#3182ce"},
      {site:"Netmeds",price:225,mrp:299,link:"https://www.netmeds.com/catalogsearch/result?q=himalaya+arjuna",inStock:true,delivery:"2 days",color:"#805ad5"},
    ],
    rating:4.3, reviews:1450,
    description:"Ayurvedic cardiac tonic from Arjuna bark extract. Supports healthy heart function, blood pressure and cholesterol.",
    highlights:["Arjuna bark extract","Supports heart function","Healthy BP levels","Natural cardioprotective","Vegetarian tablets"],
  },
];

const CATEGORIES = [
  {name:"Vitamins & Minerals",icon:"💊"},
  {name:"Protein & Fitness",icon:"💪"},
  {name:"Supplements",icon:"🌿"},
  {name:"Ayurvedic",icon:"🍃"},
  {name:"Weight Management",icon:"⚖️"},
  {name:"Women's Health",icon:"🌸"},
  {name:"Diabetic Care",icon:"🩸"},
  {name:"Heart Health",icon:"❤️"},
].map(c=>({...c,count:PRODUCTS.filter(p=>p.category===c.name).length}));

const SITES = ["1mg","PharmEasy","Netmeds","Apollo","HealthKart","Amazon","Flipkart"];
const disc = (p:number,m:number)=>Math.round(((m-p)/m)*100);

// ── HERO STATS ──
const totalProducts = PRODUCTS.length;
const totalStores = SITES.length;
const totalSaved = PRODUCTS.reduce((acc,p)=>{
  const best=p.prices.reduce((a,b)=>a.price<b.price?a:b);
  const worst=p.prices.reduce((a,b)=>a.price>b.price?a:b);
  return acc+(worst.price-best.price);
},0);


// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fragment+Mono:ital@0;1&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --void:#000000;--ink:#080808;--plate:#0f0f0f;--panel:#141414;--lift:#1c1c1c;
  --wire:rgba(255,255,255,0.07);--wire2:rgba(255,255,255,0.12);--wire3:rgba(255,255,255,0.22);
  --smoke:#ffffff08;--chalk:#f0ede6;--ash:#6b6860;--cinder:#323028;
  --phosphor:#b8ff57;--phosphor2:#8fcc2e;--phosphor-dim:rgba(184,255,87,0.12);--phosphor-glow:rgba(184,255,87,0.3);
  --signal:#ff4d2e;--ice:#c8e6ff;--nav-h:56px;
  --font:'DM Sans',sans-serif;--display:'Bebas Neue',sans-serif;--mono:'Fragment Mono',monospace;
  --ease:cubic-bezier(0.16,1,0.3,1);--ease2:cubic-bezier(0.76,0,0.24,1);
}
html{scroll-behavior:smooth;background:var(--void)}
body{font-family:var(--font);background:var(--void);color:var(--chalk);-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:crosshair}
::-webkit-scrollbar{width:2px}::-webkit-scrollbar-track{background:var(--void)}::-webkit-scrollbar-thumb{background:var(--phosphor)}
::selection{background:var(--phosphor);color:var(--void)}
a{text-decoration:none;color:inherit}
button{font-family:var(--font);cursor:crosshair;border:none;background:none}
.mt-cursor{position:fixed;width:8px;height:8px;background:var(--phosphor);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.1s,width 0.3s,height 0.3s;mix-blend-mode:difference}
.mt-cursor-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(184,255,87,0.5);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all 0.18s var(--ease)}
.mt-scan{position:fixed;inset:0;z-index:1;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)}
.mt-noise{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:128px}
.mt-bracket{position:fixed;width:24px;height:24px;z-index:500;pointer-events:none;border-color:var(--phosphor);border-style:solid;opacity:0.5}
.mt-bracket.tl{top:16px;left:16px;border-width:1px 0 0 1px}.mt-bracket.tr{top:16px;right:16px;border-width:1px 1px 0 0}
.mt-bracket.bl{bottom:16px;left:16px;border-width:0 0 1px 1px}.mt-bracket.br{bottom:16px;right:16px;border-width:0 1px 1px 0}
/* NAV */
.mt-nav{position:sticky;top:0;z-index:200;height:var(--nav-h);display:flex;align-items:center;padding:0 2rem;gap:1.5rem;background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--wire)}
.mt-nav-logo{display:flex;align-items:center;gap:10px;cursor:crosshair;flex-shrink:0;font-family:var(--display);font-size:22px;letter-spacing:0.05em;color:var(--chalk);line-height:1}
.mt-nav-logo-dot{color:var(--phosphor)}
.mt-nav-search{flex:1;max-width:440px;display:flex;align-items:center;background:transparent;border-bottom:1px solid var(--wire2);padding:0 0 6px 0;gap:10px;transition:border-color 0.3s}
.mt-nav-search:focus-within{border-color:var(--phosphor)}
.mt-nav-search input{flex:1;background:none;border:none;outline:none;font-family:var(--mono);font-size:12px;color:var(--chalk);letter-spacing:0.05em}
.mt-nav-search input::placeholder{color:var(--ash);letter-spacing:0.05em}
.mt-nav-search-btn{font-family:var(--mono);font-size:11px;color:var(--phosphor);letter-spacing:0.12em;text-transform:uppercase;padding:4px 0;transition:opacity 0.2s;border-bottom:1px solid var(--phosphor)}
.mt-nav-search-btn:hover{opacity:0.7}
.mt-nav-links{display:flex;align-items:center;gap:0.25rem;margin-left:auto;flex-shrink:0}
.mt-nav-link{padding:6px 12px;font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ash);transition:color 0.2s;cursor:crosshair;display:flex;align-items:center;gap:6px;position:relative}
.mt-nav-link:hover{color:var(--chalk)}.mt-nav-link.active{color:var(--phosphor)}
.mt-cart-badge{background:var(--phosphor);color:var(--void);border-radius:2px;font-family:var(--mono);font-size:9px;font-weight:700;padding:1px 4px;min-width:16px;text-align:center;animation:blink 0.4s step-end}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
/* HERO */
.mt-hero{position:relative;z-index:1;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;padding:3rem 2rem 5rem;overflow:hidden;border-bottom:1px solid var(--wire)}
.mt-hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 60% 40% at 80% 20%,rgba(184,255,87,0.04) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 20% 80%,rgba(184,255,87,0.025) 0%,transparent 60%)}
.mt-hero-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(var(--wire) 1px,transparent 1px),linear-gradient(90deg,var(--wire) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse 100% 100% at 50% 50%,black 30%,transparent 100%)}
.mt-hero-eyebrow{position:relative;z-index:1;font-family:var(--mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--phosphor);display:flex;align-items:center;gap:12px;margin-bottom:2rem;animation:fadeIn 1s 0.2s var(--ease) both}
.mt-hero-eyebrow::before{content:'';width:40px;height:1px;background:var(--phosphor)}
.mt-hero-eyebrow-dot{width:4px;height:4px;background:var(--phosphor);border-radius:50%;animation:pulse 2s infinite;box-shadow:0 0 8px var(--phosphor-glow)}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.2;transform:scale(0.5)}}
.mt-hero h1{position:relative;z-index:1;font-family:var(--display);font-size:clamp(5rem,14vw,14rem);line-height:0.88;letter-spacing:0.01em;color:var(--chalk);margin-bottom:0.2em;animation:slideUp 1s 0.3s var(--ease) both}
.mt-hero h1 em{font-style:normal;color:var(--phosphor)}
.mt-hero-sub{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-top:2rem;animation:fadeIn 1s 0.6s var(--ease) both}
.mt-hero-desc{font-size:14px;font-weight:300;color:var(--ash);max-width:340px;line-height:1.8;letter-spacing:0.01em}
.mt-hero-cta{display:flex;flex-direction:column;align-items:flex-end;gap:1rem;flex-shrink:0}
.mt-hero-btn{display:inline-flex;align-items:center;gap:10px;font-family:var(--mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--void);background:var(--phosphor);padding:14px 28px;border-radius:2px;transition:all 0.3s var(--ease);box-shadow:0 0 40px var(--phosphor-dim)}
.mt-hero-btn:hover{background:var(--chalk);transform:translateY(-2px);box-shadow:0 0 60px rgba(184,255,87,0.2)}
.mt-hero-scroll{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.2em;text-transform:uppercase}
.mt-hero-stats{position:absolute;right:2rem;top:50%;transform:translateY(-50%);z-index:1;display:flex;flex-direction:column;gap:2rem;text-align:right}
.mt-stat-num{font-family:var(--display);font-size:3rem;color:var(--phosphor);letter-spacing:0.02em;line-height:1}
.mt-stat-label{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.15em;text-transform:uppercase;margin-top:2px}
/* TICKER */
.mt-ticker{overflow:hidden;border-bottom:1px solid var(--wire);background:var(--ink);padding:10px 0;white-space:nowrap}
.mt-ticker-inner{display:inline-flex;animation:ticker 30s linear infinite}
.mt-ticker-item{font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ash);padding:0 2rem;white-space:nowrap}
.mt-ticker-sep{color:var(--phosphor);margin-right:4rem}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
/* SECTIONS */
.mt-section{max-width:1400px;margin:0 auto;padding:5rem 2rem}
.mt-section-hd{display:grid;grid-template-columns:auto 1fr;align-items:end;gap:2rem;margin-bottom:3rem;padding-bottom:1.5rem;border-bottom:1px solid var(--wire)}
.mt-section-label{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.2em;text-transform:uppercase;padding-bottom:4px}
.mt-section-title{font-family:var(--display);font-size:clamp(3rem,5vw,5rem);color:var(--chalk);letter-spacing:0.02em;line-height:1}
.mt-section-title em{font-style:normal;color:var(--phosphor)}
/* CATEGORIES */
.mt-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--wire);border:1px solid var(--wire)}
.mt-cat{background:var(--ink);padding:1.75rem 1.5rem;cursor:crosshair;transition:background 0.2s;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:0.75rem}
.mt-cat:hover{background:var(--plate)}
.mt-cat::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--phosphor);transition:width 0.3s var(--ease)}
.mt-cat:hover::after{width:100%}
.mt-cat-num{font-family:var(--mono);font-size:9px;color:var(--cinder);letter-spacing:0.1em}
.mt-cat-icon{font-size:24px;margin:4px 0}
.mt-cat-name{font-size:13px;font-weight:400;color:var(--chalk);letter-spacing:-0.01em}
.mt-cat-count{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.06em}
.mt-cat-arrow{position:absolute;right:1.5rem;bottom:1.5rem;font-family:var(--mono);font-size:11px;color:var(--ash);transition:all 0.2s;opacity:0}
.mt-cat:hover .mt-cat-arrow{opacity:1;color:var(--phosphor)}
/* STORES */
.mt-sites{max-width:1400px;margin:0 auto;padding:0 2rem 3rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.mt-sites-label{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.12em;text-transform:uppercase;margin-right:0.5rem}
.mt-site-tag{font-family:var(--mono);font-size:10px;color:var(--ash);border:1px solid var(--wire);padding:4px 10px;letter-spacing:0.06em;transition:all 0.2s}
.mt-site-tag:hover{border-color:var(--phosphor);color:var(--phosphor)}
/* PRODUCT LIST */
.mt-prodlist{display:flex;flex-direction:column;border:1px solid var(--wire)}
.mt-prodrow{display:grid;grid-template-columns:3rem 1fr auto auto;align-items:center;gap:1.5rem;padding:1.25rem 1.5rem;border-bottom:1px solid var(--wire);cursor:crosshair;transition:background 0.15s;animation:fadeUp 0.5s var(--ease) both}
.mt-prodrow:last-child{border-bottom:none}
.mt-prodrow:hover{background:var(--plate)}
.mt-prodrow-idx{font-family:var(--mono);font-size:10px;color:var(--cinder);letter-spacing:0.06em}
.mt-prodrow-brand{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px}
.mt-prodrow-name{font-size:14px;color:var(--chalk);font-weight:400;letter-spacing:-0.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.mt-prodrow-tag{font-family:var(--mono);font-size:8px;background:var(--phosphor);color:var(--void);padding:2px 6px;letter-spacing:0.1em;border-radius:1px}
.mt-prodrow-meta{text-align:right}
.mt-prodrow-price{font-family:var(--display);font-size:1.6rem;color:var(--phosphor);letter-spacing:0.02em;line-height:1}
.mt-prodrow-disc{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.06em;margin-top:2px}
.mt-prodrow-stores{font-family:var(--mono);font-size:9px;color:var(--ash);margin-top:2px}
.mt-prodrow-cta{font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ash);border:1px solid var(--wire2);padding:8px 14px;transition:all 0.2s;flex-shrink:0}
.mt-prodrow:hover .mt-prodrow-cta{border-color:var(--phosphor);color:var(--phosphor)}
/* AI BANNER */
.mt-ai-banner{max-width:1400px;margin:0 auto 5rem;padding:0 2rem}
.mt-ai-banner-inner{background:linear-gradient(135deg,rgba(184,255,87,0.04) 0%,rgba(184,255,87,0.01) 100%);border:1px solid rgba(184,255,87,0.2);padding:2.5rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;position:relative;overflow:hidden}
.mt-ai-banner-inner::before{content:'AI';position:absolute;right:2rem;top:50%;transform:translateY(-50%);font-family:var(--display);font-size:8rem;color:rgba(184,255,87,0.04);letter-spacing:0.05em;pointer-events:none}
.mt-ai-banner-tag{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:8px}
.mt-ai-banner-title{font-family:var(--display);font-size:2rem;color:var(--chalk);letter-spacing:0.02em;margin-bottom:6px}
.mt-ai-banner-sub{font-size:13px;font-weight:300;color:var(--ash);max-width:400px;line-height:1.6}
.mt-ai-banner-btn{font-family:var(--mono);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--void);background:var(--phosphor);padding:14px 28px;border-radius:2px;white-space:nowrap;transition:all 0.2s;flex-shrink:0}
.mt-ai-banner-btn:hover{background:var(--chalk)}
/* HOW IT WORKS */
.mt-howgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--wire)}
.mt-howcard{background:var(--ink);padding:2rem}
.mt-howcard-n{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.15em;margin-bottom:1.5rem}
.mt-howcard-icon{font-size:28px;margin-bottom:1rem}
.mt-howcard-title{font-size:14px;font-weight:500;color:var(--chalk);margin-bottom:8px;letter-spacing:-0.01em}
.mt-howcard-desc{font-size:12px;font-weight:300;color:var(--ash);line-height:1.7}
/* SEARCH PAGE */
.mt-search-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem}
.mt-search-topbar{display:flex;align-items:center;gap:1rem;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--wire);flex-wrap:wrap}
.mt-search-title{font-family:var(--display);font-size:2.5rem;color:var(--chalk);letter-spacing:0.02em;flex:1;min-width:200px}
.mt-search-count{font-family:var(--mono);font-size:10px;color:var(--ash);letter-spacing:0.1em;text-transform:uppercase}
.mt-sort-sel{font-family:var(--mono);font-size:10px;color:var(--chalk);background:var(--plate);border:1px solid var(--wire2);padding:8px 12px;letter-spacing:0.08em;outline:none;cursor:crosshair}
.mt-search-layout{display:flex;gap:2rem}
.mt-sidebar{width:200px;flex-shrink:0;display:flex;flex-direction:column;gap:1.5rem}
.mt-filter-group{display:flex;flex-direction:column;gap:6px}
.mt-filter-title{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:4px;padding-bottom:6px;border-bottom:1px solid var(--wire)}
.mt-filter-opt{display:flex;align-items:center;gap:8px;cursor:crosshair;padding:3px 0}
.mt-filter-cb{width:12px;height:12px;border:1px solid var(--wire2);flex-shrink:0;transition:all 0.15s}
.mt-filter-cb.on{background:var(--phosphor);border-color:var(--phosphor)}
.mt-filter-label{font-family:var(--mono);font-size:10px;color:var(--ash);transition:color 0.15s;letter-spacing:0.04em;flex:1}
.mt-filter-opt:hover .mt-filter-label{color:var(--chalk)}
.mt-filter-cnt{font-family:var(--mono);font-size:9px;color:var(--cinder)}
.mt-results-area{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;background:var(--wire)}
.mt-result-row{background:var(--ink);display:grid;grid-template-columns:64px 1fr auto auto;align-items:center;gap:1.5rem;padding:1.25rem 1.5rem;cursor:crosshair;transition:background 0.15s}
.mt-result-row:hover{background:var(--plate)}
.mt-result-img{width:56px;height:56px;background:var(--plate);border:1px solid var(--wire);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.mt-result-info{min-width:0}
.mt-result-brand{font-family:var(--mono);font-size:8px;color:var(--ash);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px}
.mt-result-name{font-size:13px;color:var(--chalk);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}
.mt-result-cat{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.06em}
.mt-result-prices{display:flex;gap:6px;flex-shrink:0}
.mt-result-price-chip{font-family:var(--mono);font-size:9px;border:1px solid var(--wire);padding:4px 8px;letter-spacing:0.06em}
.mt-result-price-chip.best{border-color:rgba(184,255,87,0.3);color:var(--phosphor)}
.mt-result-buy-btn{font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--void);background:var(--phosphor);padding:10px 18px;flex-shrink:0;transition:background 0.2s}
.mt-result-buy-btn:hover{background:var(--chalk)}
/* PRODUCT PAGE */
.mt-product-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem}
.mt-product-layout{display:grid;grid-template-columns:1fr 380px;gap:3rem}
.mt-product-left{}
.mt-product-header{display:flex;align-items:flex-start;gap:1.5rem;margin-bottom:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid var(--wire)}
.mt-product-img-big{width:100px;height:100px;background:var(--plate);border:1px solid var(--wire2);display:flex;align-items:center;justify-content:center;font-size:44px;flex-shrink:0}
.mt-product-title-wrap{}
.mt-product-brand{font-family:var(--mono);font-size:10px;color:var(--ash);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:6px}
.mt-product-name{font-family:var(--display);font-size:2.5rem;color:var(--chalk);letter-spacing:0.01em;line-height:1.05;margin-bottom:10px}
.mt-product-meta{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.mt-product-rating{font-family:var(--mono);font-size:10px;color:var(--phosphor);letter-spacing:0.08em}
.mt-product-reviews{font-family:var(--mono);font-size:10px;color:var(--ash);letter-spacing:0.06em}
.mt-product-cat-tag{font-family:var(--mono);font-size:9px;color:var(--ash);border:1px solid var(--wire);padding:3px 8px;letter-spacing:0.06em}
.mt-prices-heading{font-family:var(--mono);font-size:10px;color:var(--phosphor);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1rem;padding-bottom:8px;border-bottom:1px solid var(--wire)}
.mt-price-table{display:flex;flex-direction:column;gap:1px;background:var(--wire);margin-bottom:2rem}
.mt-prodrow-price-row{background:var(--ink);display:grid;grid-template-columns:auto 1fr auto auto auto;align-items:center;gap:1rem;padding:1rem 1.25rem;transition:background 0.15s}
.mt-prodrow-price-row:hover{background:var(--plate)}
.mt-prodrow-price-row.best-price{background:rgba(184,255,87,0.03)}
.mt-prow-rank{font-family:var(--mono);font-size:9px;color:var(--cinder);width:16px}
.mt-prow-rank.first{color:var(--phosphor)}
.mt-prow-site{font-family:var(--mono);font-size:10px;color:var(--chalk);letter-spacing:0.06em}
.mt-prow-delivery{font-family:var(--mono);font-size:9px;color:var(--ash)}
.mt-prow-price{font-family:var(--display);font-size:1.4rem;color:var(--chalk);letter-spacing:0.02em}
.mt-prow-price.cheapest{color:var(--phosphor)}
.mt-prow-mrp{font-family:var(--mono);font-size:9px;color:var(--ash);text-decoration:line-through}
.mt-prow-disc-badge{font-family:var(--mono);font-size:9px;background:rgba(184,255,87,0.1);color:var(--phosphor);border:1px solid rgba(184,255,87,0.2);padding:2px 6px}
.mt-prow-oos{font-family:var(--mono);font-size:9px;color:var(--ash);opacity:0.5}
.mt-buy-card{background:var(--ink);border:1px solid var(--wire2);padding:1.5rem;position:sticky;top:calc(var(--nav-h) + 1rem)}
.mt-buy-best-label{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1rem}
.mt-buy-site-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.mt-buy-site-name{font-size:15px;color:var(--chalk);font-weight:400}
.mt-buy-price{font-family:var(--display);font-size:2.5rem;color:var(--phosphor);letter-spacing:0.02em;line-height:1}
.mt-buy-mrp{font-family:var(--mono);font-size:10px;color:var(--ash);margin-bottom:4px}
.mt-buy-savings{font-family:var(--mono);font-size:10px;color:var(--phosphor);background:rgba(184,255,87,0.06);border:1px solid rgba(184,255,87,0.15);padding:6px 10px;margin-bottom:1.25rem;letter-spacing:0.04em}
.mt-buy-btn{display:block;width:100%;font-family:var(--mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--void);background:var(--phosphor);padding:16px;text-align:center;border-radius:2px;transition:all 0.25s;box-shadow:0 0 40px var(--phosphor-dim);position:relative;overflow:hidden}
.mt-buy-btn:hover{background:var(--chalk)}
.mt-buy-other-stores{margin-top:1rem;display:flex;flex-direction:column;gap:6px}
.mt-buy-other-label{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px}
.mt-buy-other-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--wire)}
.mt-buy-other-site{font-family:var(--mono);font-size:10px;color:var(--ash)}
.mt-buy-other-price{font-family:var(--mono);font-size:10px;color:var(--chalk)}
.mt-buy-other-link{font-family:var(--mono);font-size:9px;color:var(--phosphor);text-decoration:none;opacity:0.7;transition:opacity 0.15s}
.mt-buy-other-link:hover{opacity:1}
.mt-product-desc{margin-top:2rem;padding-top:2rem;border-top:1px solid var(--wire)}
.mt-product-desc-title{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1rem}
.mt-product-desc p{font-size:13px;font-weight:300;color:var(--ash);line-height:1.8;margin-bottom:1.5rem}
.mt-product-highlights{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:1rem}
.mt-highlight{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;color:var(--ash);padding:8px 12px;background:var(--plate);border:1px solid var(--wire);letter-spacing:0.04em}
.mt-highlight::before{content:'✓';color:var(--phosphor);font-size:10px}
.mt-related{margin-top:3rem}
.mt-related-title{font-family:var(--mono);font-size:10px;color:var(--ash);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1.5rem;padding-bottom:8px;border-bottom:1px solid var(--wire)}
.mt-related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--wire)}
.mt-related-card{background:var(--ink);padding:1.25rem;cursor:crosshair;transition:background 0.15s}
.mt-related-card:hover{background:var(--plate)}
.mt-related-emoji{font-size:24px;margin-bottom:8px}
.mt-related-name{font-size:12px;color:var(--chalk);margin-bottom:4px;letter-spacing:-0.01em}
.mt-related-price{font-family:var(--mono);font-size:11px;color:var(--phosphor)}
/* COMPARE */
.mt-compare-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem}
.mt-compare-table{overflow-x:auto}
.mt-compare-grid{display:grid;min-width:600px;border:1px solid var(--wire)}
.mt-compare-header{display:grid;gap:1px;background:var(--wire);border-bottom:1px solid var(--wire2)}
.mt-compare-row{display:grid;gap:1px;background:var(--wire);border-bottom:1px solid var(--wire)}
.mt-compare-row:last-child{border-bottom:none}
.mt-compare-cell{background:var(--ink);padding:1rem 1.25rem;font-size:13px;color:var(--chalk)}
.mt-compare-attr{background:var(--plate);font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.1em;text-transform:uppercase;display:flex;align-items:center}
.mt-compare-head{background:var(--plate);display:flex;flex-direction:column;gap:6px;padding:1.25rem}
.mt-compare-head-emoji{font-size:28px}
.mt-compare-head-name{font-size:12px;color:var(--chalk);font-weight:400;letter-spacing:-0.01em}
.mt-compare-head-brand{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.08em}
.mt-compare-remove{font-family:var(--mono);font-size:8px;color:var(--ash);margin-top:8px;cursor:crosshair;transition:color 0.15s;letter-spacing:0.1em}
.mt-compare-remove:hover{color:var(--signal)}
/* CATEGORIES PAGE */
.mt-cats-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem}
.mt-cats-page-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--wire)}
.mt-cat-full{background:var(--ink);padding:1.75rem 2rem;cursor:crosshair;transition:background 0.15s;display:flex;align-items:center;gap:1.5rem}
.mt-cat-full:hover{background:var(--plate)}
.mt-cat-full-icon{font-size:32px;width:48px;flex-shrink:0}
.mt-cat-full-name{font-size:15px;color:var(--chalk);font-weight:400;margin-bottom:4px;letter-spacing:-0.01em}
.mt-cat-full-cnt{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.08em}
.mt-cat-full-arrow{margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--ash);transition:all 0.2s}
.mt-cat-full:hover .mt-cat-full-arrow{color:var(--phosphor);transform:translateX(4px)}
/* CART */
.mt-cart-shell{max-width:1400px;margin:0 auto;padding:3rem 2rem;display:grid;grid-template-columns:1fr 340px;gap:3rem;align-items:start}
.mt-cart-row{display:grid;grid-template-columns:60px 1fr auto;align-items:center;gap:1.25rem;padding:1.25rem 0;border-bottom:1px solid var(--wire);animation:fadeUp 0.4s var(--ease) both}
.mt-cart-img{width:60px;height:60px;background:var(--plate);border:1px solid var(--wire);display:flex;align-items:center;justify-content:center;font-size:24px}
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
.mt-checkout{display:block;font-family:var(--mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--void);background:var(--phosphor);padding:16px;text-align:center;margin-top:1rem;border-radius:1px;transition:all 0.25s;box-shadow:0 0 30px var(--phosphor-dim)}
.mt-checkout:hover{background:var(--chalk)}
.mt-savings-note{font-family:var(--mono);font-size:10px;color:var(--phosphor);background:rgba(184,255,87,0.05);border:1px solid rgba(184,255,87,0.15);padding:8px 12px;letter-spacing:0.06em;margin-top:10px;text-align:center}
/* AI ADVISOR */
.mt-ai-shell{max-width:700px;margin:0 auto;padding:3rem 2rem}
.mt-ai-step{animation:fadeUp 0.4s var(--ease) both}
.mt-ai-step-label{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:0.75rem}
.mt-ai-title{font-family:var(--display);font-size:3rem;color:var(--chalk);letter-spacing:0.02em;margin-bottom:0.75rem}
.mt-ai-sub{font-size:13px;font-weight:300;color:var(--ash);line-height:1.7;margin-bottom:2rem}
.mt-ai-options{display:flex;flex-direction:column;gap:8px}
.mt-ai-opt{display:flex;align-items:center;gap:12px;padding:1rem 1.25rem;border:1px solid var(--wire);cursor:crosshair;transition:all 0.2s;background:var(--ink)}
.mt-ai-opt:hover{border-color:var(--wire3);background:var(--plate)}
.mt-ai-opt.selected{border-color:var(--phosphor);background:rgba(184,255,87,0.04)}
.mt-ai-opt-icon{font-size:20px;width:32px;text-align:center}
.mt-ai-opt-label{font-size:13px;color:var(--chalk);font-weight:400;flex:1}
.mt-ai-opt-check{width:14px;height:14px;border:1px solid var(--wire2);border-radius:2px;transition:all 0.15s;flex-shrink:0}
.mt-ai-opt.selected .mt-ai-opt-check{background:var(--phosphor);border-color:var(--phosphor)}
.mt-ai-multi-note{font-family:var(--mono);font-size:9px;color:var(--ash);letter-spacing:0.08em;margin-top:8px}
.mt-ai-actions{display:flex;gap:12px;margin-top:2rem}
.mt-ai-next{font-family:var(--mono);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--void);background:var(--phosphor);padding:14px 28px;border-radius:2px;transition:all 0.2s}
.mt-ai-next:hover{background:var(--chalk)}
.mt-ai-next:disabled{opacity:0.3;pointer-events:none}
.mt-ai-back{font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ash);border:1px solid var(--wire2);padding:14px 20px;transition:all 0.2s}
.mt-ai-back:hover{border-color:var(--wire3);color:var(--chalk)}
.mt-ai-loading{display:flex;flex-direction:column;align-items:center;gap:1.5rem;padding:4rem 0;text-align:center}
.mt-ai-loading-ring{width:48px;height:48px;border:2px solid var(--wire2);border-top-color:var(--phosphor);border-radius:50%;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.mt-ai-loading-text{font-family:var(--mono);font-size:11px;color:var(--ash);letter-spacing:0.12em;text-transform:uppercase}
.mt-ai-results{}
.mt-ai-results-header{font-family:var(--display);font-size:2.5rem;color:var(--chalk);letter-spacing:0.02em;margin-bottom:0.5rem}
.mt-ai-results-sub{font-size:13px;font-weight:300;color:var(--ash);margin-bottom:2rem;line-height:1.6}
.mt-ai-recs{display:flex;flex-direction:column;gap:1px;background:var(--wire)}
.mt-ai-rec{background:var(--ink);padding:1.5rem;transition:background 0.15s}
.mt-ai-rec:hover{background:var(--plate)}
.mt-ai-rec-num{font-family:var(--mono);font-size:9px;color:var(--phosphor);letter-spacing:0.1em;margin-bottom:6px}
.mt-ai-rec-name{font-size:14px;color:var(--chalk);font-weight:400;margin-bottom:4px;letter-spacing:-0.01em}
.mt-ai-rec-why{font-size:12px;font-weight:300;color:var(--ash);line-height:1.6;margin-bottom:10px}
.mt-ai-rec-price{font-family:var(--display);font-size:1.5rem;color:var(--phosphor);letter-spacing:0.02em}
.mt-ai-rec-btn{font-family:var(--mono);font-size:9px;letter-spacing:0.12em;color:var(--void);background:var(--phosphor);padding:8px 16px;margin-top:10px;border-radius:1px;display:inline-block;cursor:crosshair;transition:background 0.2s}
.mt-ai-rec-btn:hover{background:var(--chalk)}
.mt-ai-disclaimer{font-family:var(--mono);font-size:9px;color:var(--cinder);letter-spacing:0.06em;margin-top:2rem;line-height:1.6;padding:1rem;border:1px solid var(--wire);background:var(--plate)}
/* EMPTY */
.mt-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;padding:6rem 2rem;text-align:center}
.mt-empty-icon{font-size:40px;filter:grayscale(0.5)}
.mt-empty-title{font-family:var(--display);font-size:2.5rem;letter-spacing:0.02em;color:var(--chalk)}
.mt-empty-sub{font-family:var(--mono);font-size:11px;color:var(--ash);max-width:300px;line-height:1.8;letter-spacing:0.06em}
.mt-empty-btn{font-family:var(--mono);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--void);background:var(--phosphor);padding:12px 24px;border-radius:1px;margin-top:0.5rem;transition:all 0.2s}
.mt-empty-btn:hover{background:var(--chalk)}
.mt-add-compare{font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ash);border:1px solid var(--wire2);padding:7px 13px;border-radius:1px;transition:all 0.2s}
.mt-add-compare:hover{border-color:var(--wire3);color:var(--chalk)}
/* FOOTER */
.mt-footer{position:relative;z-index:1;background:var(--ink);border-top:1px solid var(--wire);padding:3rem 2rem;margin-top:6rem}
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
  .mt-cart-shell{grid-template-columns:1fr}
  .mt-footer-inner{grid-template-columns:1fr 1fr}
  .mt-prodrow{grid-template-columns:2rem 1fr auto}
  .mt-result-row{grid-template-columns:50px 1fr}
  .mt-result-prices{display:none}
  .mt-section-hd{grid-template-columns:1fr}
  .mt-section-title{font-size:3rem}
  .mt-related-grid{grid-template-columns:repeat(2,1fr)}
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
        {([["ai","AI ADVISOR"],["categories","CATEGORIES"],["compare","COMPARE"],["cart","CART"]] as const).map(([p,label])=>(
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
function AnimCounter({target,prefix="",duration=2000}:{target:number;prefix?:string;duration?:number}) {
  const [val,setVal]=useState(0);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        let start:number|null=null;
        const step=(ts:number)=>{
          if(!start)start=ts;
          const p=Math.min((ts-start)/duration,1);
          setVal(Math.floor(p*target));
          if(p<1)requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    },{threshold:0.1});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[target,duration]);
  return <div ref={ref}>{prefix}{val.toLocaleString()}</div>;
}

function Home({setPage,setSq,setSelectedProduct,setCompareList}:{setPage:(p:Page)=>void;setSq:(v:string)=>void;setSelectedProduct:(p:Product)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void}) {
  const [heroQ,setHeroQ]=useState("");
  const doSearch=()=>{if(!heroQ.trim())return;setSq(heroQ);setPage("search")};
  const featured=PRODUCTS.slice(0,8);

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
        <h1>NEVER<br/><em>OVERPAY</em><br/>AGAIN</h1>
        <div className="mt-hero-sub">
          <p className="mt-hero-desc">
            Real-time price comparison across 1mg, PharmEasy, Netmeds, Apollo and more.
            Find the best deal in seconds. Always free.
          </p>
          <div className="mt-hero-cta">
            <div style={{display:"flex",gap:8,alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid var(--wire2)",padding:"8px 8px 8px 16px",borderRadius:2}}>
              <input
                style={{background:"none",border:"none",outline:"none",fontFamily:"var(--mono)",fontSize:12,color:"var(--chalk)",letterSpacing:"0.05em",width:280}}
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
        <div className="mt-hero-stats">
          {[
            {n:totalProducts,label:"Products",prefix:""},
            {n:totalStores,label:"Stores",prefix:""},
            {n:totalSaved,label:"Max Savings",prefix:"₹"},
          ].map(({n,label,prefix})=>(
            <div key={label} className="mt-stat">
              <div className="mt-stat-num"><AnimCounter target={n} prefix={prefix}/></div>
              <div className="mt-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TICKER */}
      <div className="mt-ticker">
        <div className="mt-ticker-inner">
          {[...Array(2)].map((_,rep)=>(
            <span key={rep} style={{display:"inline-flex",gap:"4rem"}}>
              {SITES.map(s=>(
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
          <div>
            <div className="mt-section-label">Browse</div>
            <div className="mt-section-title">CATE<em>GORIES</em></div>
          </div>
        </div>
        <div className="mt-cats">
          {CATEGORIES.map((c,i)=>(
            <div key={c.name} className="mt-cat" onClick={()=>{setSq(c.name);setPage("search")}}>
              <div className="mt-cat-num">{String(i+1).padStart(2,"0")}</div>
              <div className="mt-cat-icon">{c.icon}</div>
              <div className="mt-cat-name">{c.name}</div>
              <div className="mt-cat-count">{c.count} products</div>
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

      {/* FEATURED PRODUCTS */}
      <div className="mt-section">
        <div className="mt-section-hd">
          <div>
            <div className="mt-section-label">Best Deals</div>
            <div className="mt-section-title">FEAT<em>URED</em></div>
          </div>
        </div>
        <div className="mt-prodlist">
          {featured.map((p,idx)=>{
            const sortedPrices=[...p.prices].sort((a,b)=>a.price-b.price);
            const best=sortedPrices[0];
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
        <div style={{textAlign:"center",marginTop:"2rem"}}>
          <button style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--phosphor)",border:"1px solid rgba(184,255,87,0.3)",padding:"12px 28px",transition:"all 0.2s"}} onClick={()=>setPage("search")}>
            VIEW ALL {PRODUCTS.length} PRODUCTS →
          </button>
        </div>
      </div>

      {/* AI BANNER */}
      <div className="mt-ai-banner">
        <div className="mt-ai-banner-inner">
          <div>
            <div className="mt-ai-banner-tag">✦ Powered by Claude AI</div>
            <div className="mt-ai-banner-title">GET PERSONALIZED RECOMMENDATIONS</div>
            <div className="mt-ai-banner-sub">Tell us your health goals, and our AI advisor will suggest the exact supplements you need — with best prices across all stores.</div>
          </div>
          <button className="mt-ai-banner-btn" onClick={()=>setPage("ai")}>TRY AI ADVISOR →</button>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-section" style={{paddingTop:"2rem"}}>
        <div className="mt-section-hd">
          <div>
            <div className="mt-section-label">Process</div>
            <div className="mt-section-title">HOW IT<em> WORKS</em></div>
          </div>
        </div>
        <div className="mt-howgrid">
          {[
            {n:"01",icon:"🔍",title:"Search any product",desc:"Type a medicine, brand, or supplement name. Results appear instantly from our database."},
            {n:"02",icon:"📊",title:"Compare live prices",desc:"We surface prices across 7+ stores, ranked cheapest first. Real discounts, not inflated MRPs."},
            {n:"03",icon:"🤖",title:"Get AI recommendations",desc:"Tell our AI your health goals. Get personalized supplement suggestions with explanations."},
            {n:"04",icon:"💰",title:"Save every time",desc:"The tracker finds deals you'd never find manually. Average saving: ₹200–500 per order."},
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
    const mQ=!q||p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)||p.highlights.some(h=>h.toLowerCase().includes(q));
    const mC=cats.length===0||cats.includes(p.category);
    const mS=sites.length===0||p.prices.some(pr=>sites.includes(pr.site));
    const mSt=!stockOnly||p.prices.some(pr=>pr.inStock);
    return mQ&&mC&&mS&&mSt;
  }).sort((a,b)=>{
    const ap=[...a.prices].sort((x,y)=>x.price-y.price)[0];
    const bp=[...b.prices].sort((x,y)=>x.price-y.price)[0];
    if(sort==="price_asc")return ap.price-bp.price;
    if(sort==="price_desc")return bp.price-ap.price;
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
            const sortedPrices=[...p.prices].sort((a,b)=>a.price-b.price);
            const best=sortedPrices[0];
            const d=disc(best.price,best.mrp);
            return(
              <div key={p.id} className="mt-result-row" style={{animationDelay:`${i*0.04}s`,animation:"fadeUp 0.4s var(--ease) both"}}
                onClick={()=>setSelectedProduct(p)}>
                <div className="mt-result-img">{p.image}</div>
                <div className="mt-result-info">
                  <div className="mt-result-brand">{p.brand}</div>
                  <div className="mt-result-name">{p.name}</div>
                  <div className="mt-result-cat">{p.category} · ★{p.rating} ({p.reviews.toLocaleString()} reviews)</div>
                </div>
                <div className="mt-result-prices">
                  {sortedPrices.slice(0,3).map((pr,j)=>(
                    <div key={pr.site} className={`mt-result-price-chip ${j===0?"best":""}`}>
                      {pr.site}: ₹{pr.price}
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                  <div style={{textAlign:"right",fontFamily:"var(--display)",fontSize:"1.4rem",color:"var(--phosphor)"}}>₹{best.price}</div>
                  <div style={{textAlign:"right",fontFamily:"var(--mono)",fontSize:9,color:"var(--ash)"}}>{d}% off</div>
                  <button className="mt-result-buy-btn" onClick={e=>{e.stopPropagation();addToCart(p,best.site)}}>ADD →</button>
                  <button className="mt-add-compare" onClick={e=>{e.stopPropagation();setCompareList(prev=>prev.length<4&&!prev.find(x=>x.id===p.id)?[...prev,p]:prev)}}>COMPARE</button>
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
// PRODUCT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ProductPage({product,setPage,addToCart,setCompareList}:{product:Product;setPage:(p:Page)=>void;addToCart:(p:Product,s:string)=>void;setCompareList:(fn:(prev:Product[])=>Product[])=>void}) {
  const {ref,createRipple}=useRipple();
  const sorted=[...product.prices].sort((a,b)=>a.price-b.price);
  const best=sorted[0];
  const savings=best.mrp-best.price;
  const related=PRODUCTS.filter(p=>p.category===product.category&&p.id!==product.id).slice(0,3);

  return(
    <div className="mt-product-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--ash)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"2rem",cursor:"crosshair"}} onClick={()=>setPage("search")}>
        ← BACK TO RESULTS
      </div>
      <div className="mt-product-layout">
        <div className="mt-product-left">
          <div className="mt-product-header">
            <div className="mt-product-img-big">{product.image}</div>
            <div className="mt-product-title-wrap">
              <div className="mt-product-brand">{product.brand}</div>
              <div className="mt-product-name">{product.name}</div>
              <div className="mt-product-meta">
                <span className="mt-product-rating">★ {product.rating}</span>
                <span className="mt-product-reviews">{product.reviews.toLocaleString()} reviews</span>
                <span className="mt-product-cat-tag">{product.category}</span>
                {product.tag&&<span className="mt-prodrow-tag">{product.tag}</span>}
              </div>
            </div>
          </div>

          <div className="mt-prices-heading">PRICE COMPARISON — {sorted.length} STORES</div>
          <div className="mt-price-table">
            {sorted.map((pr,i)=>(
              <div key={pr.site} className={`mt-prodrow-price-row ${i===0?"best-price":""}`} style={{opacity:pr.inStock?1:0.5,gridTemplateColumns:"20px 1fr auto auto auto auto"}}>
                <div className={`mt-prow-rank ${i===0?"first":""}`}>#{i+1}</div>
                <div>
                  <div className="mt-prow-site">{pr.site}</div>
                  <div className="mt-prow-delivery">{pr.inStock?pr.delivery:"Out of stock"}</div>
                </div>
                <div className="mt-prow-mrp">₹{pr.mrp}</div>
                <div className={`mt-prow-disc-badge`}>{disc(pr.price,pr.mrp)}% OFF</div>
                <div className={`mt-prow-price ${i===0?"cheapest":""}`}>₹{pr.price.toLocaleString()}</div>
                {pr.inStock?(
                  <a href={pr.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:i===0?"var(--void)":"var(--ash)",background:i===0?"var(--phosphor)":"transparent",border:i===0?"none":"1px solid var(--wire2)",padding:"6px 10px",whiteSpace:"nowrap",transition:"all 0.15s"}}>
                    BUY →
                  </a>
                ):<div className="mt-prow-oos">OOS</div>}
              </div>
            ))}
          </div>

          <div className="mt-product-desc">
            <div className="mt-product-desc-title">About this product</div>
            <p>{product.description}</p>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--ash)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.75rem",marginTop:"1rem"}}>Key Highlights</div>
            <div className="mt-product-highlights">
              {product.highlights.map(h=><div key={h} className="mt-highlight">{h}</div>)}
            </div>
          </div>

          {related.length>0&&(
            <div className="mt-related">
              <div className="mt-related-title">Related in {product.category}</div>
              <div className="mt-related-grid">
                {related.map(r=>{
                  const rBest=[...r.prices].sort((a,b)=>a.price-b.price)[0];
                  return(
                    <div key={r.id} className="mt-related-card" onClick={()=>setPage("product")}>
                      <div className="mt-related-emoji">{r.image}</div>
                      <div className="mt-related-name">{r.name}</div>
                      <div className="mt-related-price">from ₹{rBest.price}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="mt-buy-card">
            <div className="mt-buy-best-label">✦ BEST PRICE FOUND</div>
            <div className="mt-buy-site-row">
              <div className="mt-buy-site-name">{best.site}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--phosphor)",letterSpacing:"0.08em"}}>{best.delivery}</div>
            </div>
            <div className="mt-buy-price">₹{best.price.toLocaleString()}</div>
            <div className="mt-buy-mrp">MRP ₹{best.mrp} · {disc(best.price,best.mrp)}% off</div>
            {savings>0&&<div className="mt-buy-savings">YOU SAVE ₹{savings.toLocaleString()} HERE</div>}
            <a href={best.link} target="_blank" rel="noopener noreferrer" style={{display:"block",width:"100%",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--void)",background:"var(--phosphor)",padding:"16px",textAlign:"center",borderRadius:"2px",marginBottom:"10px",transition:"all 0.25s",boxShadow:"0 0 40px var(--phosphor-dim)"}}>
              BUY ON {best.site.toUpperCase()} →
            </a>
            <button ref={ref} onMouseDown={createRipple} style={{display:"block",width:"100%",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--chalk)",background:"transparent",border:"1px solid var(--wire2)",padding:"16px",textAlign:"center",borderRadius:"2px",transition:"all 0.25s",cursor:"crosshair",position:"relative",overflow:"hidden"}} onClick={()=>addToCart(product,best.site)}>
              ADD TO CART
            </button>
            <div className="mt-buy-other-stores">
              <div className="mt-buy-other-label">Other stores</div>
              {sorted.slice(1).map(pr=>(
                <div key={pr.site} className="mt-buy-other-row" style={{opacity:pr.inStock?1:0.45}}>
                  <span className="mt-buy-other-site">{pr.site}</span>
                  <span className="mt-buy-other-price">₹{pr.price}</span>
                  {pr.inStock?<a href={pr.link} target="_blank" rel="noopener noreferrer" className="mt-buy-other-link">BUY →</a>:<span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--ash)"}}>OOS</span>}
                </div>
              ))}
            </div>
            <button className="mt-add-compare" style={{width:"100%",marginTop:"1rem",textAlign:"center"}} onClick={()=>{setCompareList(prev=>prev.length<4&&!prev.find(x=>x.id===product.id)?[...prev,product]:prev);setPage("compare")}}>
              + ADD TO COMPARE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARE
// ─────────────────────────────────────────────────────────────────────────────
function Compare({compareList,setCompareList,setPage,addToCart}:{compareList:Product[];setCompareList:(fn:(prev:Product[])=>Product[])=>void;setPage:(p:Page)=>void;addToCart:(p:Product,s:string)=>void}) {
  const n=compareList.length;
  const cols=`auto repeat(${n},1fr)`;

  if(n===0) return(
    <div className="mt-compare-shell">
      <div className="mt-empty">
        <div className="mt-empty-icon">📊</div>
        <div className="mt-empty-title">NOTHING TO COMPARE</div>
        <div className="mt-empty-sub">Add products to compare while browsing or on product pages.</div>
        <button className="mt-empty-btn" onClick={()=>setPage("search")}>BROWSE PRODUCTS</button>
      </div>
    </div>
  );

  const attrs=[
    {label:"Best Price",fn:(p:Product)=>{const b=[...p.prices].sort((a,b)=>a.price-b.price)[0];return`₹${b.price.toLocaleString()} on ${b.site}`}},
    {label:"Discount",fn:(p:Product)=>{const b=[...p.prices].sort((a,b)=>a.price-b.price)[0];return`${disc(b.price,b.mrp)}% off MRP`}},
    {label:"Rating",fn:(p:Product)=>`★ ${p.rating} (${p.reviews.toLocaleString()})`},
    {label:"Category",fn:(p:Product)=>p.category},
    {label:"Stores",fn:(p:Product)=>`${p.prices.length} stores`},
    {label:"In Stock",fn:(p:Product)=>p.prices.some(pr=>pr.inStock)?"Yes":"No"},
  ];

  return(
    <div className="mt-compare-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div style={{fontFamily:"var(--display)",fontSize:"3rem",letterSpacing:"0.02em",color:"var(--chalk)",paddingBottom:"1.5rem",borderBottom:"1px solid var(--wire)",marginBottom:"2.5rem"}}>
        COMPARE ({n})
      </div>
      <div className="mt-compare-table">
        <div style={{display:"grid",gridTemplateColumns:cols,gap:"1px",background:"var(--wire)",border:"1px solid var(--wire)"}}>
          <div className="mt-compare-attr" style={{padding:"1.25rem"}}>Product</div>
          {compareList.map(p=>(
            <div key={p.id} className="mt-compare-head">
              <div className="mt-compare-head-emoji">{p.image}</div>
              <div className="mt-compare-head-name">{p.name}</div>
              <div className="mt-compare-head-brand">{p.brand}</div>
              <button className="mt-compare-remove" onClick={()=>setCompareList(prev=>prev.filter(x=>x.id!==p.id))}>× REMOVE</button>
            </div>
          ))}
          {attrs.map(a=>(
            <>
              <div key={a.label+"attr"} className="mt-compare-attr" style={{padding:"1rem 1.25rem"}}>{a.label}</div>
              {compareList.map(p=>(
                <div key={p.id+a.label} className="mt-compare-cell">{a.fn(p)}</div>
              ))}
            </>
          ))}
          <div className="mt-compare-attr" style={{padding:"1.25rem"}}>Buy</div>
          {compareList.map(p=>{
            const best=[...p.prices].sort((a,b)=>a.price-b.price)[0];
            return(
              <div key={p.id+"buy"} className="mt-compare-cell" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <a href={best.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--void)",background:"var(--phosphor)",padding:"8px 12px"}}>BUY →</a>
                <button className="mt-add-compare" onClick={()=>addToCart(p,best.site)}>CART</button>
              </div>
            );
          })}
        </div>
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
  const subtotal=cart.reduce((s,i)=>{const p=i.product.prices.find(pr=>pr.site===i.site)!;return s+p.price*i.qty},0);
  const mrpTotal=cart.reduce((s,i)=>{const p=i.product.prices.find(pr=>pr.site===i.site)!;return s+p.mrp*i.qty},0);
  const saved=mrpTotal-subtotal;const delivery=subtotal>499?0:49;

  if(cart.length===0) return(
    <div style={{maxWidth:1400,margin:"0 auto",padding:"3rem 2rem"}}>
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
// AI ADVISOR
// ─────────────────────────────────────────────────────────────────────────────
interface AiRec { name:string; why:string; price:string; category:string; }

function AiAdvisor({setPage,setSelectedProduct}:{setPage:(p:Page)=>void;setSelectedProduct:(p:Product)=>void}) {
  const [step,setStep]=useState(0);
  const [goals,setGoals]=useState<string[]>([]);
  const [concerns,setConcerns]=useState<string[]>([]);
  const [diet,setDiet]=useState<string[]>([]);
  const [loading,setLoading]=useState(false);
  const [recs,setRecs]=useState<AiRec[]>([]);
  const [error,setError]=useState("");

  const goalOpts=[
    {icon:"💪",label:"Build muscle & strength"},
    {icon:"⚡",label:"Boost energy & stamina"},
    {icon:"🧠",label:"Improve focus & cognitive health"},
    {icon:"😴",label:"Better sleep & recovery"},
    {icon:"🦴",label:"Bone & joint health"},
    {icon:"❤️",label:"Heart & cardiovascular health"},
    {icon:"🏃",label:"Weight management"},
    {icon:"🛡️",label:"Immunity & general wellness"},
  ];
  const concernOpts=[
    {icon:"🌟",label:"I'm generally healthy"},
    {icon:"😰",label:"Stress & anxiety"},
    {icon:"🍽️",label:"Nutritional deficiencies"},
    {icon:"🩸",label:"Blood sugar management"},
    {icon:"💤",label:"Fatigue & low energy"},
    {icon:"🦱",label:"Hair & skin issues"},
    {icon:"🤸",label:"Joint pain & inflammation"},
    {icon:"🧬",label:"Hormonal imbalance"},
  ];
  const dietOpts=[
    {icon:"🥗",label:"Vegetarian"},
    {icon:"🌱",label:"Vegan"},
    {icon:"🍖",label:"Non-vegetarian"},
    {icon:"🥚",label:"Eggetarian"},
  ];

  const toggle=(arr:string[],set:(v:string[])=>void,val:string)=>set(arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]);

  const getRecommendations=async()=>{
    setLoading(true);setError("");
    try {
      const prompt=`You are a health supplement expert for India. Based on this profile:
- Health goals: ${goals.join(", ")||"general wellness"}
- Health concerns: ${concerns.join(", ")||"none specific"}  
- Diet type: ${diet.join(", ")||"non-vegetarian"}

Recommend exactly 4 specific supplements available in India. For each, provide:
1. Product name (real brand + product, e.g. "Himalaya Ashwagandha" or "MuscleBlaze Whey Gold")
2. Why it's perfect for this person (2 sentences max)
3. Typical price range in India (e.g. "₹199–₹350")
4. Category (one of: Vitamins & Minerals, Protein & Fitness, Supplements, Ayurvedic, Women's Health, Heart Health)

Respond ONLY with a JSON array like:
[{"name":"...","why":"...","price":"₹...–₹...","category":"..."}]`;

      const res=await fetch("/api/ai-advisor",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt}),
      });
      if(!res.ok)throw new Error("API error");
      const data=await res.json();
      setRecs(data.recommendations||[]);
      setStep(3);
    } catch {
      // Fallback to static recommendations based on goals
      const fallback:AiRec[]=[];
      if(goals.includes("Build muscle & strength")||goals.includes("Boost energy & stamina")){
        fallback.push({name:"MuscleBlaze Whey Gold",why:"25g protein per serving helps build lean muscle. Informed Sport certified for purity and safety.",price:"₹1799–₹2100",category:"Protein & Fitness"});
        fallback.push({name:"AS-IT-IS Creatine Monohydrate",why:"Pure creatine boosts strength and power output. Best value for performance enhancement.",price:"₹449–₹489",category:"Protein & Fitness"});
      }
      if(goals.includes("Bone & joint health")||concerns.includes("Nutritional deficiencies")){
        fallback.push({name:"HealthVit Vitamin D3 + K2",why:"Combined D3+K2 formula ensures calcium is deposited in bones, not arteries. Essential for most Indians who are D3 deficient.",price:"₹349–₹399",category:"Vitamins & Minerals"});
      }
      if(goals.includes("Immunity & general wellness")){
        fallback.push({name:"Himalaya Ashwagandha",why:"Adaptogenic herb reduces cortisol, boosts immunity, and improves energy levels naturally.",price:"₹185–₹210",category:"Ayurvedic"});
      }
      if(goals.includes("Heart & cardiovascular health")){
        fallback.push({name:"Now Foods Omega-3 Fish Oil",why:"EPA and DHA reduce triglycerides and support heart rhythm. Best purity with molecular distillation.",price:"₹499–₹579",category:"Supplements"});
      }
      if(fallback.length<4){
        fallback.push({name:"Now Foods Omega-3 Fish Oil",why:"Essential fatty acids that most Indians are deficient in. Supports brain, heart, and joint health.",price:"₹499–₹579",category:"Supplements"});
      }
      setRecs(fallback.slice(0,4));
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  if(loading) return(
    <div className="mt-ai-shell">
      <div className="mt-ai-loading">
        <div className="mt-ai-loading-ring"/>
        <div className="mt-ai-loading-text">ANALYZING YOUR PROFILE…</div>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--cinder)",letterSpacing:"0.08em"}}>Powered by Claude AI</div>
      </div>
    </div>
  );

  if(step===3) return(
    <div className="mt-ai-shell" style={{animation:"fadeUp 0.4s var(--ease) both"}}>
      <div className="mt-ai-results-header">YOUR SUPPLEMENT PLAN</div>
      <div className="mt-ai-results-sub">Based on your goals and profile, here are our AI-powered recommendations with the best prices across India.</div>
      <div className="mt-ai-recs">
        {recs.map((r,i)=>{
          const match=PRODUCTS.find(p=>p.name.toLowerCase().includes(r.name.split(" ").slice(0,2).join(" ").toLowerCase())||r.name.toLowerCase().includes(p.brand.toLowerCase()));
          return(
            <div key={i} className="mt-ai-rec">
              <div className="mt-ai-rec-num">0{i+1}</div>
              <div className="mt-ai-rec-name">{r.name}</div>
              <div className="mt-ai-rec-why">{r.why}</div>
              <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                <div className="mt-ai-rec-price">{r.price}</div>
                <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--ash)",letterSpacing:"0.06em"}}>{r.category}</div>
              </div>
              {match?(
                <button className="mt-ai-rec-btn" onClick={()=>{setSelectedProduct(match);setPage("product")}}>
                  COMPARE PRICES →
                </button>
              ):(
                <button className="mt-ai-rec-btn" onClick={()=>{setPage("search")}}>
                  SEARCH ON MEDTRACKER →
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-ai-disclaimer">
        ⚠ These recommendations are for informational purposes only and do not constitute medical advice. 
        Please consult a qualified healthcare professional before starting any supplement regimen, 
        especially if you have existing medical conditions or take medications.
      </div>
      <div style={{marginTop:"2rem",display:"flex",gap:12}}>
        <button className="mt-ai-next" onClick={()=>{setStep(0);setGoals([]);setConcerns([]);setDiet([]);setRecs([])}}>START OVER</button>
        <button className="mt-ai-back" onClick={()=>setPage("search")}>BROWSE PRODUCTS</button>
      </div>
    </div>
  );

  const steps=[
    {label:"Step 1 of 3 · Goals",title:"WHAT ARE YOUR HEALTH GOALS?",sub:"Select all that apply. We'll match the right supplements for your specific needs.",opts:goalOpts,val:goals,set:(v:string[])=>setGoals(v),multi:true},
    {label:"Step 2 of 3 · Concerns",title:"ANY SPECIFIC HEALTH CONCERNS?",sub:"This helps us prioritize what matters most for your body.",opts:concernOpts,val:concerns,set:(v:string[])=>setConcerns(v),multi:true},
    {label:"Step 3 of 3 · Diet",title:"WHAT'S YOUR DIET TYPE?",sub:"Some supplements are specifically formulated for certain dietary preferences.",opts:dietOpts,val:diet,set:(v:string[])=>setDiet(v),multi:false},
  ];
  const s=steps[step];
  const canNext=s.val.length>0;

  return(
    <div className="mt-ai-shell">
      <div className="mt-ai-step" key={step}>
        <div className="mt-ai-step-label">{s.label}</div>
        <div className="mt-ai-title">{s.title}</div>
        <div className="mt-ai-sub">{s.sub}</div>
        <div className="mt-ai-options">
          {s.opts.map(o=>(
            <div key={o.label} className={`mt-ai-opt ${s.val.includes(o.label)?"selected":""}`}
              onClick={()=>s.multi?toggle(s.val,s.set,o.label):s.set([o.label])}>
              <div className="mt-ai-opt-icon">{o.icon}</div>
              <div className="mt-ai-opt-label">{o.label}</div>
              <div className="mt-ai-opt-check"/>
            </div>
          ))}
        </div>
        {s.multi&&<div className="mt-ai-multi-note">Select one or more</div>}
        <div className="mt-ai-actions">
          {step<2?(
            <button className="mt-ai-next" onClick={()=>setStep(step+1)} disabled={!canNext}>NEXT →</button>
          ):(
            <button className="mt-ai-next" onClick={getRecommendations} disabled={!canNext}>GET MY PLAN →</button>
          )}
          {step>0&&<button className="mt-ai-back" onClick={()=>setStep(step-1)}>← BACK</button>}
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
          {page==="ai"&&<AiAdvisor setPage={goTo} setSelectedProduct={p=>{setSelectedProduct(p);goTo("product")}}/>}
        </main>

        <footer className="mt-footer">
          <div className="mt-footer-inner">
            <div>
              <div className="mt-footer-brand">MED<em>.</em><br/>TRACKER</div>
              <p className="mt-footer-desc">India's health price intelligence system. Real-time. Zero bias. Always free.</p>
            </div>
            {[
              {title:"Compare",links:["Search Products","By Category","All Stores","AI Advisor"]},
              {title:"Company",links:["About Us","Blog","Careers","Contact"]},
              {title:"Legal",links:["Privacy Policy","Terms of Use","Cookie Policy"]},
            ].map(col=>(
              <div key={col.title}>
                <div className="mt-footer-col-title">{col.title}</div>
                {col.links.map(l=><div key={l} className="mt-footer-link">{l}</div>)}
              </div>
            ))}
          </div>
          <div className="mt-footer-bottom">
            <span>© 2025 MEDTRACKER.IN · NOT AFFILIATED WITH ANY PHARMACY · FOR INFORMATIONAL USE ONLY</span>
            <span>BUILT FOR INDIA 🇮🇳</span>
          </div>
        </footer>
      </div>
    </>
  );
}
