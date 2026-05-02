"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const SUGGESTIONS = ["Whey Protein", "Creatine Monohydrate", "Vitamin D3", "Omega-3 Fish Oil", "Biotin 10000mcg", "Magnesium Glycinate", "Pre-workout", "Collagen Peptides"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searched, setSearched] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 400);
  };

  const search = async () => {
    if (!query.trim()) return;
    triggerGlitch();
    setLoading(true);
    setSearched(true);
    setResults([]);
    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      // demo fallback
      setResults([
        { site: "HealthKart", price: 2199, link: "#" },
        { site: "Flipkart Health", price: 2450, link: "#" },
        { site: "Amazon.in", price: 2699, link: "#" },
        { site: "1mg", price: 2799, link: "#" },
      ]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") search(); };

  const savings = results.length > 1 ? results[results.length - 1].price - results[0].price : null;
  const pct = results.length > 1 ? Math.round(((results[results.length - 1].price - results[0].price) / results[results.length - 1].price) * 100) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#03060f",
      color: "#e2e8f8",
      fontFamily: "'Outfit', system-ui, sans-serif",
      overflowX: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}

        .grid-bg {
          position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:
            linear-gradient(rgba(56,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,130,246,0.04) 1px, transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 20%, black 40%, transparent 100%);
        }

        .aurora {
          position:fixed;pointer-events:none;z-index:0;border-radius:50%;filter:blur(120px);
        }

        .hero-wrap {
          position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;
          padding:5rem 1.5rem 3rem;text-align:center;
        }

        .eyebrow {
          font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.18em;
          color:#3882f6;text-transform:uppercase;margin-bottom:1.5rem;
          display:flex;align-items:center;gap:10px;
        }
        .eyebrow::before,.eyebrow::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,#3882f620)}
        .eyebrow::before{background:linear-gradient(90deg,transparent,#3882f640)}
        .eyebrow::after{background:linear-gradient(90deg,#3882f640,transparent)}

        .main-title {
          font-size:clamp(3rem,8vw,5.5rem);font-weight:900;line-height:1.0;
          letter-spacing:-0.04em;margin-bottom:1.25rem;
          background:linear-gradient(135deg,#fff 0%,#c8d8ff 50%,#6fa0f5 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .title-accent {
          background:linear-gradient(135deg,#3882f6,#a855f7,#f43f5e);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .sub {
          font-size:16px;color:rgba(200,215,255,0.4);font-weight:400;max-width:380px;line-height:1.6;
        }

        .search-outer {
          width:100%;max-width:680px;margin-top:2.5rem;position:relative;
        }

        .search-glow {
          position:absolute;inset:-1px;border-radius:20px;
          background:linear-gradient(135deg,#3882f6,#a855f7,#f43f5e);
          opacity:0;transition:opacity 0.3s;z-index:0;
        }
        .search-outer:focus-within .search-glow{opacity:1;}

        .search-inner {
          position:relative;z-index:1;display:flex;align-items:center;
          background:#080d1a;border-radius:19px;padding:5px;gap:0;border:1px solid rgba(56,130,246,0.15);
          transition:border-color 0.3s;
        }
        .search-outer:focus-within .search-inner{border-color:transparent;}

        .search-icon-wrap{padding:0 14px;flex-shrink:0;}

        .search-input {
          flex:1;background:none;border:none;outline:none;
          color:#e2e8f8;font-family:'Outfit',sans-serif;font-size:16px;font-weight:400;
          padding:14px 0;letter-spacing:0.01em;min-width:0;
        }
        .search-input::placeholder{color:rgba(180,200,255,0.22);}

        .search-btn {
          background:linear-gradient(135deg,#3882f6,#7c3aed);
          color:#fff;border:none;border-radius:14px;
          padding:13px 28px;font-family:'Outfit',sans-serif;
          font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;
          letter-spacing:0.02em;transition:all 0.2s;flex-shrink:0;
          position:relative;overflow:hidden;
        }
        .search-btn::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,#60a5fa,#a855f7);
          opacity:0;transition:opacity 0.2s;
        }
        .search-btn:hover::after{opacity:1;}
        .search-btn:hover{transform:scale(0.99);}
        .search-btn:active{transform:scale(0.97);}
        .search-btn span{position:relative;z-index:1;}

        .glitch {
          animation:glitchFlash 0.4s ease;
        }
        @keyframes glitchFlash{
          0%{filter:none}
          15%{filter:hue-rotate(90deg) saturate(5) brightness(2)}
          30%{filter:none}
          45%{filter:hue-rotate(-90deg) saturate(3)}
          60%{filter:none}
          100%{filter:none}
        }

        .tags-wrap{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:1.5rem;max-width:680px;}
        .tag{
          background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);
          border-radius:100px;padding:7px 16px;font-size:13px;color:rgba(180,200,255,0.45);
          cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif;font-weight:400;
          letter-spacing:0.01em;
        }
        .tag:hover{
          background:rgba(56,130,246,0.12);border-color:rgba(56,130,246,0.35);
          color:#90bcff;transform:translateY(-1px);
        }

        .results-section{
          position:relative;z-index:1;width:100%;max-width:720px;
          margin:0 auto;padding:0 1.5rem 6rem;
        }

        .results-header{
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:1.25rem;padding:0 0.25rem;
        }
        .results-label{
          font-family:'Space Mono',monospace;font-size:11px;
          letter-spacing:0.14em;color:rgba(180,200,255,0.35);text-transform:uppercase;
        }
        .results-count{
          font-family:'Space Mono',monospace;font-size:11px;
          letter-spacing:0.1em;color:rgba(56,130,246,0.6);
        }

        .savings-chip {
          display:flex;align-items:center;gap:10px;
          background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.18);
          border-radius:14px;padding:14px 20px;margin-bottom:1.25rem;
          animation:slideUp 0.4s ease both;
        }

        .pct-badge{
          background:rgba(16,185,129,0.15);color:#34d399;
          border-radius:8px;padding:3px 10px;
          font-family:'Space Mono',monospace;font-size:12px;font-weight:700;
          border:1px solid rgba(16,185,129,0.25);flex-shrink:0;
        }

        .card {
          width:100%;background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.06);border-radius:22px;
          padding:1.5rem 1.75rem;display:flex;align-items:center;
          justify-content:space-between;gap:1rem;
          transition:background 0.25s,border-color 0.25s,transform 0.25s,box-shadow 0.25s;
          animation:slideUp 0.45s ease both;cursor:default;
          position:relative;overflow:hidden;
        }
        .card::before{
          content:'';position:absolute;inset:0;border-radius:22px;
          background:linear-gradient(135deg,rgba(56,130,246,0.08),transparent 60%);
          opacity:0;transition:opacity 0.3s;pointer-events:none;
        }
        .card:hover{
          background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.12);
          transform:translateY(-3px) scale(1.005);
          box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(56,130,246,0.1);
        }
        .card:hover::before{opacity:1;}

        .card.best{
          background:rgba(56,130,246,0.08);
          border-color:rgba(56,130,246,0.3);
        }
        .card.best:hover{
          background:rgba(56,130,246,0.14);
          box-shadow:0 20px 60px rgba(56,130,246,0.2),0 0 40px rgba(56,130,246,0.08);
        }

        .rank-wrap{display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0;}
        .rank-num{
          font-family:'Space Mono',monospace;font-size:11px;
          color:rgba(180,200,255,0.25);letter-spacing:0.08em;
        }
        .rank-bar{
          width:2px;background:rgba(255,255,255,0.07);border-radius:2px;flex:1;min-height:30px;
        }

        .card-info{flex:1;min-width:0;}

        .best-badge{
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(56,130,246,0.15);color:#7db8ff;
          border:1px solid rgba(56,130,246,0.3);border-radius:8px;
          padding:3px 11px;font-size:11px;font-weight:700;
          letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;
          font-family:'Space Mono',monospace;
        }
        .best-badge-dot{
          width:5px;height:5px;border-radius:50%;background:#3882f6;
          animation:pulse 1.5s infinite;
        }
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}

        .site-name{
          font-size:16px;font-weight:600;color:#e2e8f8;letter-spacing:-0.01em;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;
        }
        .price-wrap{display:flex;align-items:baseline;gap:6px;}
        .price-symbol{font-size:14px;font-weight:500;color:rgba(180,200,255,0.5);margin-bottom:2px;}
        .price-num{
          font-family:'Space Mono',monospace;font-size:28px;font-weight:700;
          letter-spacing:-0.03em;line-height:1;
        }
        .price-best{color:#60a5fa;}
        .price-normal{color:#c8d8ff;}

        .buy-btn{
          background:linear-gradient(135deg,#3882f6,#7c3aed);
          color:#fff;border:none;border-radius:13px;
          padding:12px 22px;font-family:'Outfit',sans-serif;
          font-size:14px;font-weight:700;cursor:pointer;
          text-decoration:none;white-space:nowrap;
          transition:all 0.2s;display:inline-flex;align-items:center;gap:6px;
          position:relative;overflow:hidden;flex-shrink:0;letter-spacing:0.01em;
        }
        .buy-btn::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,#60a5fa,#a855f7);
          opacity:0;transition:opacity 0.25s;
        }
        .buy-btn:hover::after{opacity:1;}
        .buy-btn:hover{transform:scale(0.97);}
        .buy-btn span{position:relative;z-index:1;}

        .buy-btn-ghost{
          background:transparent;color:rgba(180,200,255,0.5);
          border:1px solid rgba(255,255,255,0.08);border-radius:13px;
          padding:12px 22px;font-family:'Outfit',sans-serif;
          font-size:14px;font-weight:500;cursor:pointer;
          text-decoration:none;white-space:nowrap;
          transition:all 0.2s;display:inline-flex;align-items:center;gap:6px;flex-shrink:0;
        }
        .buy-btn-ghost:hover{
          background:rgba(255,255,255,0.05);color:#c8d8ff;
          border-color:rgba(255,255,255,0.18);transform:scale(0.98);
        }

        .loader-wrap{
          display:flex;flex-direction:column;align-items:center;gap:1.5rem;
          padding:3rem 0;
        }
        .loader-bars{display:flex;align-items:flex-end;gap:5px;height:36px;}
        .loader-bar{
          width:4px;border-radius:3px;
          background:linear-gradient(180deg,#3882f6,#7c3aed);
          animation:barBounce 1s infinite ease-in-out;
        }
        .loader-bar:nth-child(2){animation-delay:0.12s;}
        .loader-bar:nth-child(3){animation-delay:0.24s;}
        .loader-bar:nth-child(4){animation-delay:0.36s;}
        .loader-bar:nth-child(5){animation-delay:0.48s;}
        @keyframes barBounce{
          0%,100%{height:8px;opacity:0.3}
          50%{height:36px;opacity:1}
        }
        .loader-text{
          font-family:'Space Mono',monospace;font-size:12px;
          letter-spacing:0.14em;color:rgba(56,130,246,0.6);text-transform:uppercase;
          animation:blink 1.2s infinite;
        }
        @keyframes blink{0%,100%{opacity:0.4}50%{opacity:1}}

        .ticker{
          overflow:hidden;width:100%;border-top:1px solid rgba(255,255,255,0.04);
          border-bottom:1px solid rgba(255,255,255,0.04);
          background:rgba(255,255,255,0.015);
          padding:10px 0;margin-bottom:3rem;position:relative;z-index:1;
        }
        .ticker-inner{
          display:flex;gap:0;white-space:nowrap;
          animation:tickerScroll 25s linear infinite;
          width:max-content;
        }
        @keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .ticker-item{
          display:inline-flex;align-items:center;gap:20px;padding:0 32px;
          font-family:'Space Mono',monospace;font-size:11px;
          color:rgba(180,200,255,0.25);letter-spacing:0.06em;
        }
        .ticker-dot{width:3px;height:3px;border-radius:50%;background:rgba(56,130,246,0.4);}

        @keyframes slideUp{
          from{opacity:0;transform:translateY(24px)}
          to{opacity:1;transform:translateY(0)}
        }

        .empty-state{
          display:flex;flex-direction:column;align-items:center;
          gap:1rem;padding:4rem 0;color:rgba(180,200,255,0.2);text-align:center;
        }
        .empty-icon{
          width:56px;height:56px;border:1px solid rgba(255,255,255,0.06);
          border-radius:16px;display:flex;align-items:center;justify-content:center;
        }
      `}</style>

      {/* Background grid */}
      <div className="grid-bg" />

      {/* Aurora orbs */}
      <div className="aurora" style={{width:700,height:700,background:"rgba(56,100,246,0.12)",top:-200,left:-200}} />
      <div className="aurora" style={{width:500,height:500,background:"rgba(124,58,237,0.1)",top:100,right:-150}} />
      <div className="aurora" style={{width:400,height:400,background:"rgba(244,63,94,0.07)",bottom:200,left:"30%"}} />

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...SUGGESTIONS,...SUGGESTIONS,...SUGGESTIONS,...SUGGESTIONS].map((s,i)=>(
            <span key={i} className="ticker-item">
              {s} <span className="ticker-dot"/>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className={`hero-wrap ${glitch ? "glitch" : ""}`}>
        <div className="eyebrow">India&apos;s Health Price Tracker</div>

        <h1 className="main-title">
          Stop<br/>
          <span className="title-accent">Overpaying</span>
        </h1>

        <p className="sub">Compare health supplement prices across every major Indian store — instantly.</p>

        {/* Search */}
        <div className="search-outer">
          <div className="search-glow" />
          <div className="search-inner">
            <div className="search-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(100,150,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              ref={inputRef}
              className="search-input"
              placeholder="Search whey protein, creatine, omega-3…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <button className="search-btn" onClick={search}>
              <span>Search →</span>
            </button>
          </div>
        </div>

        {/* Suggestion tags */}
        {!searched && (
          <div className="tags-wrap">
            {SUGGESTIONS.slice(0,6).map(t=>(
              <button key={t} className="tag" onClick={()=>{setQuery(t);setTimeout(search,0);}}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {(loading || results.length > 0 || searched) && (
        <div className="results-section">
          {loading ? (
            <div className="loader-wrap">
              <div className="loader-bars">
                {[1,2,3,4,5].map(i=><div key={i} className="loader-bar"/>)}
              </div>
              <div className="loader-text">Scanning prices…</div>
            </div>
          ) : results.length > 0 ? (
            <>
              {savings !== null && savings > 0 && (
                <div className="savings-chip">
                  <div className="pct-badge">-{pct}%</div>
                  <div style={{flex:1}}>
                    <span style={{fontSize:14,color:"#34d399",fontWeight:600}}>
                      Save ₹{savings.toLocaleString("en-IN")} 
                    </span>
                    <span style={{fontSize:13,color:"rgba(52,211,153,0.55)",fontWeight:400}}> by picking the best deal over the most expensive</span>
                  </div>
                </div>
              )}

              <div className="results-header">
                <span className="results-label">Results for &quot;{query}&quot;</span>
                <span className="results-count">{results.length} stores found</span>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                {results.map((item, i) => {
                  const isBest = i === 0;
                  return (
                    <div
                      key={i}
                      className={`card ${isBest ? "best" : ""}`}
                      style={{animationDelay:`${i * 0.07}s`}}
                      onMouseEnter={()=>setHoveredIdx(i)}
                      onMouseLeave={()=>setHoveredIdx(null)}
                    >
                      <div className="rank-wrap">
                        <span className="rank-num">#{i+1}</span>
                      </div>

                      <div className="card-info">
                        {isBest && (
                          <div className="best-badge">
                            <div className="best-badge-dot"/>
                            Best Deal
                          </div>
                        )}
                        <div className="site-name">{item.site}</div>
                        <div className="price-wrap">
                          <span className="price-symbol">₹</span>
                          <span className={`price-num ${isBest ? "price-best" : "price-normal"}`}>
                            {Number(item.price).toLocaleString("en-IN")}
                          </span>
                          {i > 0 && savings && (
                            <span style={{fontSize:12,color:"rgba(244,63,94,0.6)",fontFamily:"'Space Mono',monospace",marginLeft:6,fontWeight:700}}>
                              +₹{(item.price - results[0].price).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className={isBest ? "buy-btn" : "buy-btn-ghost"}>
                        <span>Buy now</span>
                        <span>→</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(180,200,255,0.25)" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p style={{fontSize:15,color:"rgba(180,200,255,0.25)"}}>No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}