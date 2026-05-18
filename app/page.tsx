/**
 * Nex · Event Landing Page
 * ─────────────────────────────────────────────────────────────────────
 * IMAGES: Place your files in the /public folder of your Next.js project:
 *
 *   public/
 *   ├── hero.jpg              ← Full-width top banner image
 *   ├── event-1.jpg           ← Gallery square top-left
 *   ├── event-2.jpg           ← Gallery square top-middle
 *   ├── event-reel.mp4        ← Gallery tall reel (right column, both rows)
 *   ├── event-wide.jpg        ← Gallery wide bottom-left
 *   ├── sponsor-redbull.jpg   ← RedBull campaign image
 *   ├── sponsor-2.jpg         ← Second sponsor logo/image
 *   └── sponsor-3.jpg         ← Third sponsor logo/image
 *
 * Then replace the <img src="..."> paths below with your actual filenames.
 * All images use standard <img> tags so no width/height props are required.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─── Inline style constants ───────────────────────────────────────────────
// Keeping styles as inline objects so this is fully self-contained
// and there are zero className-resolution errors.

const FONT = "'Rubik', var(--font-rubik), sans-serif";

const C = {
  ink:     "#0a0612",
  pink:    "#ff7ac3",
  magenta: "#ff33bc",
  violet:  "#8061ff",
  indigo:  "#6a66ff",
  white:   "#ffffff",
  dimText: "rgba(255,255,255,0.5)",
  border:  "rgba(255,122,195,0.22)",
  vBorder: "rgba(128,97,255,0.3)",
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div style={{ background: C.ink, minHeight: "100vh", fontFamily: FONT }}>

      {/* ── Logo-only nav ── */}
      <header style={{ maxWidth: "calc(380px + 50vw)", margin: "0 auto", padding: "28px 32px" }}>
        <LogoMark />
      </header>

      {/* ── Hero image — same width as content, rounded corners, location overlay ── */}
      <div style={{
        maxWidth: "calc(380px + 50vw)",
        margin: "20px auto 0",
        padding: "0 32px",
      }}>
        <div style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          lineHeight: 0,
        }}>
          {/* Replace /hero.jpg with your image in /public */}
          <img
            src="/Event Place.webp"
            alt="Nex Event"
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              maxHeight: "520px",
            }}
          />

          {/* Bottom-left overlay — soft cloud, no border, no hard edges */}
          {/* Outer halo: large radial gradient that dissolves into the image */}
          <div style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 340,
            height: 200,
            background: "radial-gradient(ellipse at 28% 70%, rgba(128,97,255,0.55) 0%, rgba(255,51,188,0.3) 35%, transparent 70%)",
            filter: "blur(18px)",
            pointerEvents: "none",
          }} />
          {/* Text sits on top of the halo — no container, just the words */}
          <div style={{
            position: "absolute",
            bottom: 24,
            left: 24,
          }}>
            <div style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              textShadow: "0 1px 12px rgba(128,97,255,0.8), 0 0 30px rgba(255,51,188,0.5)",
            }}>
              Hilton Hotel, Jalian Wala Bagh
            </div>
            <div style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              marginTop: 5,
              letterSpacing: "0.04em",
              textShadow: "0 1px 8px rgba(128,97,255,0.7)",
            }}>
              28 May 2026 · 19:00
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content — constrained width, left-aligned ── */}
      <main style={{ maxWidth: "calc(380px + 50vw)", padding: "0 32px", margin: "0 auto" }}>

        <LastHappenings />
        <Sponsors />
        <KeynoteSpeakers />
        <LumaForm />
        <AboutNex />

        {/* Bottom breathing room */}
        <div style={{ height: 80 }} />
      </main>

    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      {/* Place your logo file at public/logo.png (or .svg / .webp)
          and update the src below to match the filename */}
      <img
        src="/Nex.png"
        alt="Nex logo"
        style={{
          width: 64,
          height: 64,
          objectFit: "contain",
          display: "block",
        }}
      />

      <div>
        <div style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 650,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: C.white,
        }}>
          Nex
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 250,
          letterSpacing: "0.16em",
          color: C.pink,
          marginTop: 3,
        }}>
          Building From Baltics For the Globe
        </div>
      </div>
    </div>
  );
}

// ─── Last Happenings ──────────────────────────────────────────────────────
// Bento grid — matches wireframe exactly:
//   [sq 1]  [sq 2]  | [tall reel — spans 2 rows]
//   [wide ────────] | [continued]

function LastHappenings() {
  return (
    <section style={{ marginTop: 56 }}>
      <Label text="Gallery" />
      <h2 style={sectionTitle}>Our Last Event</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "180px 200px",
        gap: 10,
        marginTop: 24,
      }}>

        {/* Square 1 — replace src with your image */}
        <div style={{ gridColumn: "1", gridRow: "1", ...photoCell }}>
          <img
            src="/event-1.jpg"
            alt="Event photo 1"
            style={fillImg}
          />
          <PhotoCaption text="Opening night" />
        </div>

        {/* Square 2 — replace src with your image */}
        <div style={{ gridColumn: "2", gridRow: "1", ...photoCell }}>
          <img
            src="/event-2.jpg"
            alt="Event photo 2"
            style={fillImg}
          />
          <PhotoCaption text="Casting tables" />
        </div>

        {/* Tall reel — replace src with your .mp4 reel */}
        <div style={{ gridColumn: "3", gridRow: "1 / span 2", ...photoCell }}>
          <video
            src="/event-reel.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={fillImg}
          />
          <PhotoCaption text="Reel" />
        </div>

        {/* Wide landscape — replace src with your image */}
        <div style={{ gridColumn: "1 / span 2", gridRow: "2", ...photoCell }}>
          <img
            src="/event-wide.jpg"
            alt="Event wide shot"
            style={fillImg}
          />
          <PhotoCaption text="The roster reveal" />
        </div>

      </div>
    </section>
  );
}

// ─── Sponsors ─────────────────────────────────────────────────────────────

function Sponsors() {
  return (
    <section style={{ marginTop: 64 }}>
      <Label text="Partners" />
      <h2 style={sectionTitle}>Our Sponsors in Baltics</h2>

      {/* Main sponsor — RedBull */}
      <div style={{
        marginTop: 24,
        borderRadius: 16,
        border: `1px solid ${C.vBorder}`,
        background: "rgba(128,97,255,0.08)",
        overflow: "hidden",
      }}>
        {/* Replace /sponsor-redbull.jpg with your actual image */}
        <img
          src="/sponsor-redbull.jpg"
          alt="Red Bull"
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            maxHeight: 220,
          }}
        />
        <div style={{ padding: "20px 24px" }}>
          <div style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: C.white,
          }}>
            Red Bull
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: 13,
            color: C.dimText,
            marginTop: 6,
            lineHeight: 1.6,
          }}>
            Headline partner · Baltic creator campaigns
          </div>
        </div>
      </div>

      {/* Two supporting sponsors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SponsorTile imgSrc="/sponsor-2.jpg" name="Vapiano" />
        <SponsorTile imgSrc="/sponsor-3.jpg" name="Dzintari SPA" />
      </div>
    </section>
  );
}

function SponsorTile({ imgSrc, name }: { imgSrc: string; name: string }) {
  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${C.vBorder}`,
      background: "rgba(128,97,255,0.07)",
      overflow: "hidden",
    }}>
      <img
        src={imgSrc}
        alt={name}
        style={{
          width: "100%",
          display: "block",
          objectFit: "cover",
          height: 120,
        }}
      />
      <div style={{
        padding: "12px 16px",
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 700,
        color: "rgba(255,255,255,0.75)",
      }}>
        {name}
      </div>
    </div>
  );
}

// ─── Keynote Speakers ─────────────────────────────────────────────────────
// Two speakers side by side. Each photo has the same cloud-fog name overlay.
// Replace src paths and names/roles with your actual speakers.
//
//   public/speaker-1.jpg  ← headshot or portrait of speaker 1
//   public/speaker-2.jpg  ← headshot or portrait of speaker 2

function KeynoteSpeakers() {
  const speakers = [
    {
      src: "/speaker-1.jpg",
      name: "Speaker Name",
      role: "Founder · Brand",
    },
    {
      src: "/speaker-2.jpg",
      name: "Speaker Name",
      role: "Creative Director · Agency",
    },
  ];

  return (
    <section style={{ marginTop: 64 }}>
      <Label text="On Stage" />
      <h2 style={sectionTitle}>Keynote Speakers</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginTop: 24,
      }}>
        {speakers.map((s, i) => (
          <div key={i} style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            aspectRatio: "3 / 4",
            background: "rgba(128,97,255,0.12)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            {/* Speaker photo */}
            <img
              src={s.src}
              alt={s.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Cloud halo — larger, softer for portrait format */}
            <div style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: "140%",
              height: 200,
              background: "radial-gradient(ellipse at 30% 85%, rgba(128,97,255,0.65) 0%, rgba(255,51,188,0.32) 38%, transparent 68%)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }} />

            {/* Name + role float above the halo */}
            <div style={{
              position: "absolute",
              bottom: 20,
              left: 18,
            }}>
              <div style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                textShadow: "0 1px 12px rgba(128,97,255,0.9), 0 0 28px rgba(255,51,188,0.55)",
              }}>
                {s.name}
              </div>
              <div style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 400,
                color: "rgba(255,255,255,0.8)",
                marginTop: 5,
                letterSpacing: "0.04em",
                textShadow: "0 1px 8px rgba(128,97,255,0.8)",
              }}>
                {s.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Luma Form ───────────────────────────────────────────────────────────
// Only the iframe — no extra buttons, no checkbox, no UI chrome around it.
// scrolling="no" disables the iframe's own internal scrollbar.
// Height is set tall enough that Luma's form doesn't need to scroll.

function LumaForm() {
  return (
    <section id="apply" style={{ marginTop: 64 }}>
      <Label text="Apply" />
      <h2 style={sectionTitle}>Sign Up</h2>

      {/* 
        overflow: hidden on the wrapper clips any iframe overflow.
        scrolling="no" is the key — it tells the iframe not to show a scrollbar.
        If the form content is taller than the height, increase the height below.
      */}
      <div style={{
        marginTop: 24,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        lineHeight: 0, /* removes gap below inline iframe */
      }}>
        <iframe
          src="https://luma.com/embed/event/evt-guA9zHzcVg5vgdw/simple"
          width="100%"
          height="600"
          /* scrolling="no" suppresses the iframe's own scrollbar */
          scrolling="no"
          frameBorder="0"
          style={{
            display: "block",
            border: "none",
            overflow: "hidden",
          }}
          allow="fullscreen; payment"
          title="Apply to attend Nex"
        />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────

function AboutNex() {
  return (
    <section style={{ marginTop: 64 }}>
      <Label text="Our Story" />
      <h2 style={sectionTitle}>About Nex</h2>

      <p style={{
        fontFamily: FONT,
        marginTop: 16,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.9,
        color: C.dimText,
      }}>
        Nex is the platform built in the Baltics, for the Baltics. We connect
        creators with the brands that actually operate here — not global
        campaigns adapted for a regional afterthought, but campaigns written
        for Latvian, Estonian, and Lithuanian audiences from day one.
        Building From Baltics For Baltics means every partnership, every
        campaign, and every creator on our roster is rooted in the culture
        we live in. We earn when creators earn — so every decision we make
        points in the same direction. Building From Baltics For Baltics.
      </p>
    </section>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <div className="section-label" style={{ fontFamily: FONT }}>
      {text}
    </div>
  );
}

function PhotoCaption({ text }: { text: string }) {
  return (
    <>
      {/* Cloud halo behind the text — dissolves upward, no hard edge */}
      <div style={{
        position: "absolute",
        bottom: -20,
        left: -20,
        width: "120%",
        height: 120,
        background: "radial-gradient(ellipse at 25% 80%, rgba(128,97,255,0.6) 0%, rgba(255,51,188,0.28) 40%, transparent 70%)",
        filter: "blur(14px)",
        pointerEvents: "none",
      }} />
      {/* Text floats above the halo */}
      <div style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 500,
        color: "rgba(255,255,255,0.9)",
        letterSpacing: "0.05em",
        textShadow: "0 1px 10px rgba(128,97,255,0.9), 0 0 20px rgba(255,51,188,0.5)",
      }}>
        {text}
      </div>
    </>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 28,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "#fff",
  marginTop: 8,
  textAlign: "left",
};

const photoCell: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 12,
  background: "rgba(128,97,255,0.12)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const fillImg: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};