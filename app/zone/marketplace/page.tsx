"use client";

/**
 * app/zone/marketplace/page.tsx
 * Nexfluence — Marketplace Anticipation Dashboard
 *
 * Shown to every signed-up creator before marketplace launch.
 * Builds excitement, shows brand/offer teasers, nudges profile
 * completion, and gives creators early-access actions.
 *
 * Sections:
 *  1. Top nav (user context)
 *  2. Hero  — launch countdown + live stats
 *  3. Brand preview grid  (blurred, locked)
 *  4. Offer category teasers
 *  5. Profile completion nudge
 *  6. Early access perks
 *  7. Live activity feed
 *  8. Referral / share block
 */

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────
function useWindowWidth(): number {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const cb = () => setW(window.innerWidth);
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);
  return w;
}

// ─────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────
const C = {
  ink:    "#0a0612",
  pink:   "#ff7ac3",
  mag:    "#ff33bc",
  violet: "#8061ff",
  indigo: "#6a66ff",
  dim:    "rgba(255,255,255,0.50)",
  dim2:   "rgba(255,255,255,0.72)",
  grad:   "linear-gradient(90deg, #ff33bc, #8061ff)",
  border: "rgba(128,97,255,0.3)",
  card:   "rgba(128,97,255,0.06)",
  green:  "#34d399",
} as const;

// ─────────────────────────────────────────────
// MOCK USER  (replace with real session data)
// ─────────────────────────────────────────────
const USER = {
  name:            "Marta",
  handle:          "@martakalns",
  photo:           "/Speaker 1.webp",
  profileProgress: 62,          // percent
  followers:       "18.4K",
  niche:           "Lifestyle",
};

// ─────────────────────────────────────────────
// LAUNCH DATE  (set your real date here)
// ─────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-07-01T09:00:00+03:00");

// ─────────────────────────────────────────────
// COUNTDOWN HOOK
// ─────────────────────────────────────────────
interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function useCountdown(target: Date): TimeLeft {
  const calc = useCallback((): TimeLeft => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000)  / 60_000),
      seconds: Math.floor((diff % 60_000)      / 1_000),
    };
  }, [target]);

  const [t, setT] = useState<TimeLeft>(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

// ─────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────
function GradText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {children}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      borderRadius: "18px",
      background: C.card,
      border: `1px solid ${C.border}`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em",
      textTransform: "uppercase", color: C.pink, marginBottom: "16px",
    }}>
      <span style={{ display: "block", width: "18px", height: "1px", background: C.pink }} />
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// 1. TOP NAV
// ─────────────────────────────────────────────
function TopNav({ isMobile }: { isMobile: boolean }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,6,18,0.88)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid rgba(128,97,255,0.18)`,
      padding: isMobile ? "14px 20px" : "14px 40px",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Logo */}
        <a href="/zone" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <Image src="/Nex.webp" alt="Nexfluence" width={36} height={36} style={{ borderRadius: "9px" }} />
          {!isMobile && (
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Nexfluence</span>
          )}
        </a>

        {/* Centre badge */}
        <div style={{
          flex: 1, display: "flex", justifyContent: "center",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "5px 14px", borderRadius: "100px",
            background: "rgba(255,51,188,0.1)",
            border: "1px solid rgba(255,51,188,0.3)",
          }}>
            <span className="dot-live" />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
              Marketplace — Opening Soon
            </span>
          </div>
        </div>

        {/* User avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!isMobile && (
            <span style={{ fontSize: "13px", color: C.dim }}>
              Hey, <span style={{ color: "#fff", fontWeight: 600 }}>{USER.name}</span> 👋
            </span>
          )}
          <div style={{ position: "relative", width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(128,97,255,0.5)" }}>
            <Image src={USER.photo} alt={USER.name} fill style={{ objectFit: "cover", objectPosition: "top" }} />
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// 2. HERO — countdown + live stats
// ─────────────────────────────────────────────
function CountdownBlock({ t }: { t: TimeLeft }) {
  const units = [
    { val: t.days,    label: "Days"    },
    { val: t.hours,   label: "Hours"   },
    { val: t.minutes, label: "Minutes" },
    { val: t.seconds, label: "Seconds" },
  ];
  return (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
      {units.map((u, i) => (
        <div key={u.label}>
          <div style={{
            minWidth: "80px",
            padding: "18px 12px 14px",
            borderRadius: "16px",
            background: "rgba(128,97,255,0.1)",
            border: `1px solid rgba(128,97,255,0.35)`,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Subtle glow */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(128,97,255,0.2), transparent 70%)", pointerEvents: "none" }} />
            <p style={{
              fontSize: "42px", fontWeight: 900, letterSpacing: "-0.05em",
              lineHeight: 1, color: "#fff",
              background: C.grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {String(u.val).padStart(2, "0")}
            </p>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginTop: "6px" }}>
              {u.label}
            </p>
          </div>
          {/* Colon separator */}
          {i < units.length - 1 && (
            <p style={{ display: "inline-block", fontSize: "28px", fontWeight: 900, color: "rgba(128,97,255,0.4)", textAlign: "center", width: "100%", marginTop: "8px" }}>:</p>
          )}
        </div>
      ))}
    </div>
  );
}

const LIVE_STATS = [
  { icon: "🏢", value: "47",   label: "Brands registered",   accent: C.violet },
  { icon: "🎁", value: "120+", label: "Offers being prepared", accent: C.mag   },
  { icon: "✨", value: "500+", label: "Creators like you",     accent: C.pink  },
  { icon: "💰", value: "€50K", label: "In campaign budgets",   accent: C.green },
];

function Hero({ isMobile, time }: { isMobile: boolean; time: TimeLeft }) {
  return (
    <section style={{ padding: isMobile ? "48px 20px 40px" : "64px 40px 52px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse at 50% 0%, rgba(128,97,255,0.22) 0%, rgba(255,51,188,0.1) 40%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(128,97,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(128,97,255,0.05) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Early access badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 16px 6px 8px", borderRadius: "100px",
          background: "rgba(128,97,255,0.12)", border: `1px solid ${C.border}`,
          marginBottom: "28px",
        }}>
          <span style={{
            padding: "3px 10px", borderRadius: "100px",
            background: C.grad, fontSize: "10px", fontWeight: 700,
            color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Early Access
          </span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
            You're one of the first creators in
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: isMobile ? "32px" : "52px",
          fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05,
          color: "#fff", marginBottom: "16px",
        }}>
          The Baltic Creator
          <br />
          Marketplace <GradText>Opens In</GradText>
        </h1>

        <p style={{ fontSize: isMobile ? "14px" : "16px", color: C.dim2, lineHeight: 1.75, marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px" }}>
          {USER.name}, your spot is secured. Dozens of Baltic brands are loading their
          campaigns right now — and verified profiles get first pick.
        </p>

        {/* Countdown */}
        <CountdownBlock t={time} />

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "16px", letterSpacing: "0.04em" }}>
          Marketplace launch · July 1, 2026 · 09:00 EET
        </p>
      </div>

      {/* Live stats strip */}
      <div style={{
        maxWidth: "1200px", margin: "52px auto 0",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: "12px",
        position: "relative", zIndex: 1,
      }}>
        {LIVE_STATS.map((s) => (
          <div key={s.label} style={{
            padding: "20px",
            borderRadius: "16px",
            background: `${s.accent}0f`,
            border: `1px solid ${s.accent}40`,
            textAlign: "center",
          }}>
            <p style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</p>
            <p style={{
              fontSize: "28px", fontWeight: 900, letterSpacing: "-0.04em",
              background: C.grad, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1, marginBottom: "4px",
            }}>
              {s.value}
            </p>
            <p style={{ fontSize: "12px", color: C.dim, fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. BRAND PREVIEW GRID  (blurred, locked)
// ─────────────────────────────────────────────
const BRAND_TILES = [
  { name: "Artisan Street Bakery", img: "/Artisan Street Bakery.webp", category: "Food & Drink",  budget: "€300–800"  },
  { name: "Molberts",              img: "/Molberts.webp",              category: "Art & Culture", budget: "€200–500"  },
  { name: "Gardu Muti",            img: "/Gardu Muti.webp",            category: "Food & Drink",  budget: "€150–400"  },
  { name: "Street Pizza",          img: "/Street Pizza.webp",          category: "Restaurant",    budget: "€400–900"  },
  { name: "Street Burgers",        img: "/Street Burgers.webp",        category: "Restaurant",    budget: "€300–700"  },
  { name: "Skriveŗu",              img: "/Skriveru.webp",              category: "Lifestyle",     budget: "€500–1.2K" },
  { name: "Hedonya",               img: "/Hedonya.webp",               category: "Wellness",      budget: "€600–1.5K" },
  { name: "Red Bull Latvia",       img: "/RedBull Image.webp",         category: "Energy / Sport",budget: "€800–2K"   },
];

function BrandGrid({ isMobile }: { isMobile: boolean }) {
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto 0", padding: isMobile ? "0 20px" : "0 40px" }}>
      <div style={{ marginBottom: "28px" }}>
        <SectionLabel>Brands Waiting for You</SectionLabel>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1 }}>
              47 Brands Are Loading
              <br />
              <GradText>Their Campaigns Right Now</GradText>
            </h2>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 16px", borderRadius: "100px",
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.3)",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(52,211,153,0.9)" }}>Brands actively adding offers</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: "12px",
        position: "relative",
      }}>
        {BRAND_TILES.map((b, i) => {
          const locked = i > 2; // first 3 partially visible, rest fully blurred
          return (
            <div
              key={b.name}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                background: C.card,
                position: "relative",
                opacity: locked ? 0.45 : 1,
                filter: locked ? "blur(2px)" : "none",
                transition: "opacity 0.2s",
                cursor: locked ? "default" : "pointer",
              }}
            >
              {/* Brand image */}
              <div style={{ position: "relative", height: "100px" }}>
                <Image src={b.img} alt={b.name} fill style={{ objectFit: "cover", opacity: 0.7 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,18,0.9) 0%, rgba(10,6,18,0.2) 60%, transparent 100%)" }} />
                <span style={{
                  position: "absolute", top: "8px", right: "8px",
                  fontSize: "10px", fontWeight: 700,
                  padding: "3px 8px", borderRadius: "6px",
                  background: "rgba(10,6,18,0.75)", backdropFilter: "blur(6px)",
                  color: "rgba(255,255,255,0.7)", letterSpacing: "0.03em",
                }}>
                  {b.category}
                </span>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "11px", color: C.dim }}>Budget / campaign</p>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: C.violet }}>{b.budget}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Full-width lock overlay on bottom rows */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "60%",
          background: "linear-gradient(to top, rgba(10,6,18,0.97) 0%, rgba(10,6,18,0.6) 50%, transparent 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          padding: "28px 20px",
          pointerEvents: "none",
          borderRadius: "0 0 18px 18px",
        }}>
          <div style={{
            pointerEvents: "auto", textAlign: "center",
            padding: "20px 28px",
            borderRadius: "16px",
            background: "rgba(128,97,255,0.12)",
            border: `1px solid ${C.border}`,
            backdropFilter: "blur(12px)",
            maxWidth: "380px",
          }}>
            <p style={{ fontSize: "22px", marginBottom: "8px" }}>🔒</p>
            <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
              Full Access Opens July 1
            </p>
            <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.6, marginBottom: "16px" }}>
              Complete your profile now — verified creators get first priority when brands browse.
            </p>
            <a href="/zone/profile/setup" style={{
              display: "inline-block",
              padding: "10px 24px", borderRadius: "8px",
              background: C.grad, color: "#fff",
              fontSize: "13px", fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(128,97,255,0.35)",
            }}>
              Complete Profile →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. OFFER CATEGORY TEASERS
// ─────────────────────────────────────────────
const CATEGORIES = [
  { icon: "🍕", name: "Food & Drink",      count: 28, color: "#ff7a7a" },
  { icon: "👗", name: "Fashion & Beauty",  count: 19, color: C.pink   },
  { icon: "🏋️", name: "Fitness & Wellness",count: 14, color: C.green  },
  { icon: "🏨", name: "Travel & Hospitality", count: 11, color: "#fbbf24" },
  { icon: "💻", name: "Tech & Apps",       count: 9,  color: C.violet },
  { icon: "🎨", name: "Art & Culture",     count: 7,  color: C.indigo },
  { icon: "🏠", name: "Home & Lifestyle",  count: 16, color: C.mag    },
  { icon: "🎮", name: "Gaming & Esports",  count: 6,  color: "#a78bfa" },
];

function OfferCategories({ isMobile }: { isMobile: boolean }) {
  return (
    <section style={{ maxWidth: "1200px", margin: "64px auto 0", padding: isMobile ? "0 20px" : "0 40px" }}>
      <SectionLabel>What's Inside</SectionLabel>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1 }}>
          120+ Offers Across
          <br />
          <GradText>8 Campaign Categories</GradText>
        </h2>
        <p style={{ fontSize: "13px", color: C.dim, maxWidth: "280px", lineHeight: 1.6 }}>
          Every offer is performance-based — you only earn when you deliver.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: "10px",
      }}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            style={{
              padding: "18px 18px 16px",
              borderRadius: "14px",
              background: `${cat.color}0a`,
              border: `1px solid ${cat.color}30`,
              position: "relative",
              overflow: "hidden",
              cursor: "default",
              transition: "border-color 0.18s, background 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = `${cat.color}14`;
              (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.color}60`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = `${cat.color}0a`;
              (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.color}30`;
            }}
          >
            <p style={{ fontSize: "24px", marginBottom: "10px" }}>{cat.icon}</p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "4px", lineHeight: 1.3 }}>{cat.name}</p>
            <p style={{ fontSize: "12px", color: cat.color, fontWeight: 600 }}>{cat.count} offers</p>
            {/* Locked badge */}
            <span style={{
              position: "absolute", top: "12px", right: "10px",
              fontSize: "12px", opacity: 0.5,
            }}>🔒</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. PROFILE COMPLETION NUDGE
// ─────────────────────────────────────────────
const PROFILE_STEPS = [
  { label: "Basic info",      done: true,  pct: 10 },
  { label: "Profile photo",   done: true,  pct: 15 },
  { label: "Social handles",  done: true,  pct: 15 },
  { label: "Content niche",   done: true,  pct: 10 },
  { label: "Audience data",   done: false, pct: 15 },
  { label: "Past work",       done: false, pct: 15 },
  { label: "Rate card",       done: false, pct: 10 },
  { label: "Verification",    done: false, pct: 10 },
];

function ProfileNudge({ isMobile }: { isMobile: boolean }) {
  const done   = PROFILE_STEPS.filter((s) => s.done);
  const pct    = done.reduce((a, s) => a + s.pct, 0);
  const nextUp = PROFILE_STEPS.find((s) => !s.done);

  return (
    <section style={{ maxWidth: "1200px", margin: "64px auto 0", padding: isMobile ? "0 20px" : "0 40px" }}>
      <div style={{
        borderRadius: "24px",
        background: "rgba(128,97,255,0.07)",
        border: `1px solid ${C.border}`,
        padding: isMobile ? "28px 24px" : "36px 44px",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG glow */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "400px", height: "300px", background: "radial-gradient(circle at 80% 20%, rgba(255,51,188,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
          gap: "32px", alignItems: "center",
          position: "relative", zIndex: 1,
        }}>
          {/* Left */}
          <div>
            <SectionLabel>Your Profile</SectionLabel>
            <h2 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", marginBottom: "8px", lineHeight: 1.1 }}>
              You're <GradText>{pct}% Complete</GradText>
            </h2>
            <p style={{ fontSize: "14px", color: C.dim, lineHeight: 1.7, marginBottom: "24px", maxWidth: "460px" }}>
              Brands browse <strong style={{ color: "#fff" }}>complete profiles first</strong>.
              Finish yours before launch and you'll appear at the top of search results on day one.
            </p>

            {/* Progress bar */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                height: "8px", borderRadius: "100px",
                background: "rgba(128,97,255,0.15)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: "100px",
                  width: `${pct}%`,
                  background: C.grad,
                  transition: "width 1s ease",
                  boxShadow: "0 0 12px rgba(128,97,255,0.5)",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <p style={{ fontSize: "11px", color: C.dim }}>{done.length}/{PROFILE_STEPS.length} steps done</p>
                <p style={{ fontSize: "11px", fontWeight: 700, color: C.violet }}>{pct}% credibility score</p>
              </div>
            </div>

            {/* Steps checklist */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "8px",
              marginBottom: "24px",
            }}>
              {PROFILE_STEPS.map((s) => (
                <div key={s.label} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 12px", borderRadius: "10px",
                  background: s.done ? "rgba(52,211,153,0.07)" : "rgba(128,97,255,0.05)",
                  border: `1px solid ${s.done ? "rgba(52,211,153,0.25)" : C.border}`,
                }}>
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>{s.done ? "✅" : "⬜"}</span>
                  <span style={{ fontSize: "12px", fontWeight: s.done ? 600 : 400, color: s.done ? "rgba(52,211,153,0.9)" : C.dim }}>
                    {s.label}
                  </span>
                  <span style={{
                    marginLeft: "auto", fontSize: "10px", fontWeight: 700,
                    color: s.done ? "rgba(52,211,153,0.7)" : C.violet,
                  }}>
                    +{s.pct}%
                  </span>
                </div>
              ))}
            </div>

            {/* Next step CTA */}
            {nextUp && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <a href="/zone/profile/setup" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "12px 24px", borderRadius: "9px",
                  background: C.grad, color: "#fff",
                  fontSize: "14px", fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(128,97,255,0.35)",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}
                >
                  Add {nextUp.label} → +{nextUp.pct}%
                </a>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  Takes about 2 minutes
                </p>
              </div>
            )}
          </div>

          {/* Right — circular progress */}
          {!isMobile && (
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <CircularProgress pct={pct} />
              <p style={{ fontSize: "13px", color: C.dim, marginTop: "12px" }}>Credibility Score</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CircularProgress({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <defs>
        <linearGradient id="cpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff33bc" />
          <stop offset="100%" stopColor="#8061ff" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(128,97,255,0.15)" strokeWidth="10" />
      {/* Progress */}
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke="url(#cpGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      {/* Text */}
      <text x="70" y="64" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900" fontFamily="inherit" letterSpacing="-1">
        {pct}%
      </text>
      <text x="70" y="82" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="inherit" letterSpacing="1">
        COMPLETE
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// 6. EARLY ACCESS PERKS
// ─────────────────────────────────────────────
const PERKS = [
  { icon: "🥇", title: "First-Pick Priority",     desc: "Complete profiles appear at the top of brand searches on launch day. Late completers go to page 2."                  },
  { icon: "🔒", title: "Rate Lock",                desc: "Early creators lock in 0% platform fee for the first 6 months. Post-launch joiners pay the standard 8%."             },
  { icon: "📣", title: "Featured on Launch Day",  desc: "Top 10 most complete profiles get featured in our launch email to 47 brand partners."                                },
  { icon: "🎓", title: "Founding Creator Badge",  desc: "A permanent 'Founding Creator' badge on your public profile — exclusive to those who joined before opening day."    },
];

function EarlyAccessPerks({ isMobile }: { isMobile: boolean }) {
  return (
    <section style={{ maxWidth: "1200px", margin: "64px auto 0", padding: isMobile ? "0 20px" : "0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <SectionLabel>Why Join Early</SectionLabel>
        <h2 style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1 }}>
          Early Creators Get
          <br />
          <GradText>Permanently Better Deals</GradText>
        </h2>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: "14px",
      }}>
        {PERKS.map((p) => (
          <div
            key={p.title}
            style={{
              display: "flex", gap: "18px",
              padding: "24px",
              borderRadius: "18px",
              background: C.card,
              border: `1px solid ${C.border}`,
              transition: "border-color 0.18s",
              alignItems: "flex-start",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,122,195,0.45)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = C.border)}
          >
            <div style={{
              width: "48px", height: "48px", flexShrink: 0,
              borderRadius: "14px",
              background: "rgba(128,97,255,0.15)",
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
            }}>
              {p.icon}
            </div>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px", letterSpacing: "-0.01em" }}>
                {p.title}
              </p>
              <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 7. LIVE ACTIVITY FEED
// ─────────────────────────────────────────────
interface ActivityItem { icon: string; text: string; time: string; type: "brand" | "creator" | "offer" }

const INITIAL_FEED: ActivityItem[] = [
  { icon: "🏢", text: "Street Pizza joined as a brand partner",          time: "2m ago",  type: "brand"   },
  { icon: "✨", text: "Armands Simsons completed their profile",          time: "5m ago",  type: "creator" },
  { icon: "🎁", text: "New wellness campaign added — €600 budget",        time: "11m ago", type: "offer"   },
  { icon: "🏢", text: "Hedonya Spa posted 3 new affiliate offers",        time: "18m ago", type: "brand"   },
  { icon: "✨", text: "New creator from Tallinn joined the waitlist",      time: "24m ago", type: "creator" },
  { icon: "🎁", text: "Food & Drink: 4 new campaigns this week",          time: "1h ago",  type: "offer"   },
];

const TYPE_COLOR: Record<string, string> = { brand: C.violet, creator: C.pink, offer: C.green };

function ActivityFeed({ isMobile }: { isMobile: boolean }) {
  const [feed, setFeed] = useState<ActivityItem[]>(INITIAL_FEED);
  const [flash, setFlash] = useState<number | null>(null);

  // Simulate new activity every 8s
  useEffect(() => {
    const NEW: ActivityItem[] = [
      { icon: "🏢", text: "Gardu Muti added a food collab offer",            time: "just now", type: "brand"   },
      { icon: "✨", text: "A Travel creator completed profile verification",  time: "just now", type: "creator" },
      { icon: "🎁", text: "Fashion campaign launched — €800 budget",         time: "just now", type: "offer"   },
    ];
    let idx = 0;
    const id = setInterval(() => {
      const item = { ...NEW[idx % NEW.length], time: "just now" };
      setFeed((prev) => [item, ...prev.slice(0, 7)]);
      setFlash(0);
      setTimeout(() => setFlash(null), 1000);
      idx++;
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ maxWidth: "1200px", margin: "64px auto 0", padding: isMobile ? "0 20px" : "0 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <SectionLabel>Live Activity</SectionLabel>
          <h2 style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff" }}>
            Things Are <GradText>Moving Fast</GradText>
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span className="dot-live" />
          <span style={{ fontSize: "12px", color: C.dim }}>Updated in real time</span>
        </div>
      </div>

      <div style={{
        borderRadius: "18px",
        border: `1px solid ${C.border}`,
        background: C.card,
        overflow: "hidden",
      }}>
        {feed.map((item, i) => (
          <div
            key={`${item.text}-${i}`}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 20px",
              borderBottom: i < feed.length - 1 ? `1px solid rgba(128,97,255,0.12)` : "none",
              background: flash === i ? "rgba(128,97,255,0.1)" : "transparent",
              transition: "background 0.8s",
            }}
          >
            <span style={{
              width: "36px", height: "36px", flexShrink: 0,
              borderRadius: "10px",
              background: `${TYPE_COLOR[item.type]}18`,
              border: `1px solid ${TYPE_COLOR[item.type]}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
            }}>
              {item.icon}
            </span>
            <p style={{ flex: 1, fontSize: "13px", color: C.dim2, lineHeight: 1.4 }}>
              {item.text}
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 8. REFERRAL BLOCK
// ─────────────────────────────────────────────
function ReferralBlock({ isMobile }: { isMobile: boolean }) {
  const [copied, setCopied] = useState(false);
  const refLink = `https://nexfluence.eu/join?ref=${USER.handle.replace("@", "")}`;

  const copy = async () => {
    await navigator.clipboard.writeText(refLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ maxWidth: "1200px", margin: "64px auto 0 ", padding: isMobile ? "0 20px" : "0 40px" }}>
      <div style={{
        borderRadius: "24px",
        padding: isMobile ? "32px 24px" : "44px 52px",
        background: "rgba(128,97,255,0.07)",
        border: `1px solid ${C.border}`,
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(128,97,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "36px", marginBottom: "12px" }}>🎁</p>
          <SectionLabel>Refer a Creator</SectionLabel>
          <h2 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", marginBottom: "10px" }}>
            Every Creator You Invite
            <br />
            <GradText>Earns You Credibility Points</GradText>
          </h2>
          <p style={{ fontSize: "14px", color: C.dim, maxWidth: "460px", margin: "0 auto 28px", lineHeight: 1.7 }}>
            Invite fellow creators before launch. For every person who signs up via your link and completes their profile, you earn +5% credibility — permanently.
          </p>

          {/* Ref link input */}
          <div style={{
            display: "flex",
            maxWidth: "460px",
            margin: "0 auto",
            borderRadius: "10px",
            border: `1.5px solid ${C.border}`,
            overflow: "hidden",
            background: "rgba(128,97,255,0.06)",
          }}>
            <p style={{
              flex: 1, padding: "12px 16px",
              fontSize: "13px", color: C.dim2,
              fontFamily: "monospace",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {refLink}
            </p>
            <button
              onClick={copy}
              style={{
                padding: "12px 20px", flexShrink: 0,
                background: copied ? "rgba(52,211,153,0.2)" : C.grad,
                border: "none", cursor: "pointer",
                color: "#fff", fontSize: "13px", fontWeight: 700,
                transition: "all 0.2s",
              }}
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "16px" }}>
            Share on Instagram, WhatsApp, or anywhere your creator friends hang out.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function MarketplacePage() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const time     = useCountdown(LAUNCH_DATE);

  return (
    <div style={{ background: C.ink, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @keyframes dot-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(255,51,188,0.5); }
          70%  { box-shadow: 0 0 0 9px rgba(255,51,188,0);   }
          100% { box-shadow: 0 0 0 0   rgba(255,51,188,0);   }
        }
        .dot-live {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 9999px;
          background: #ff33bc;
          box-shadow: 0 0 0 0 rgba(255,51,188,0.5);
          animation: dot-pulse 1.8s ease-out infinite;
          flex-shrink: 0;
        }
        * { font-family: var(--font-rubik), sans-serif; box-sizing: border-box; }
      `}</style>

      <TopNav isMobile={isMobile} />
      <Hero isMobile={isMobile} time={time} />
      <BrandGrid isMobile={isMobile} />
      <OfferCategories isMobile={isMobile} />
      <ProfileNudge isMobile={isMobile} />
      <EarlyAccessPerks isMobile={isMobile} />
      <ActivityFeed isMobile={isMobile} />
      <ReferralBlock isMobile={isMobile} />
      <div style={{ height: "96px" }} />
    </div>
  );
}