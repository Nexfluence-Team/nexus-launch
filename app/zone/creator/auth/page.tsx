"use client";

/**
 * app/zone/auth/page.tsx
 * Nexfluence — Creator Login & Sign Up
 *
 * Layout:  Split — left branding panel (desktop) · right form panel
 * Modes:   "login"  →  email + password + OAuth
 *          "signup" →  3-step wizard
 *            Step 1: Account  (name, email, password)
 *            Step 2: Profile  (handle, platforms, niche, followers, country)
 *            Step 3: Success  (verify email state)
 *
 * Wire OAuth and form POST to your BetterAuth backend as needed.
 */

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

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
  ink:     "#0a0612",
  pink:    "#ff7ac3",
  magenta: "#ff33bc",
  violet:  "#8061ff",
  indigo:  "#6a66ff",
  dim:     "rgba(255,255,255,0.50)",
  dim2:    "rgba(255,255,255,0.72)",
  grad:    "linear-gradient(90deg, #ff33bc, #8061ff)",
  gradR:   "linear-gradient(90deg, #8061ff, #ff33bc)",
  border:  "rgba(128,97,255,0.35)",
  cardBg:  "rgba(128,97,255,0.07)",
  error:   "#ff6b6b",
  success: "#34d399",
} as const;

type CSSProps = React.CSSProperties;
type AuthMode = "login" | "signup";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// FORM PRIMITIVES
// ─────────────────────────────────────────────
interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  rightSlot?: React.ReactNode;
}
function FInput({ label, value, onChange, placeholder, type = "text", error, required, hint, autoComplete, rightSlot }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: error ? C.error : focused ? "#fff" : "rgba(255,255,255,0.55)", transition: "color 0.15s" }}>
        {label}{required && <span style={{ color: C.magenta, marginLeft: "3px" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: rightSlot ? "11px 44px 11px 14px" : "11px 14px",
            borderRadius: "10px",
            background: focused ? "rgba(128,97,255,0.1)" : "rgba(128,97,255,0.05)",
            border: `1.5px solid ${error ? C.error + "80" : focused ? "rgba(128,97,255,0.7)" : C.border}`,
            color: "#fff",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.15s, background 0.15s",
            boxSizing: "border-box",
          }}
        />
        {rightSlot && (
          <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: "11px", color: C.error }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>{hint}</p>}
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}
function FSelect({ label, value, onChange, options, error, required }: SelectProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: error ? C.error : "rgba(255,255,255,0.55)" }}>
        {label}{required && <span style={{ color: C.magenta, marginLeft: "3px" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: "11px 38px 11px 14px",
          borderRadius: "10px",
          background: focused ? "rgba(128,97,255,0.12)" : "rgba(128,97,255,0.05)",
          border: `1.5px solid ${error ? C.error + "80" : focused ? "rgba(128,97,255,0.7)" : C.border}`,
          color: value ? "#fff" : "rgba(255,255,255,0.35)",
          fontSize: "14px",
          outline: "none",
          width: "100%",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          transition: "border-color 0.15s, background 0.15s",
          boxSizing: "border-box",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#12081e", color: "#fff" }}>{o.label}</option>
        ))}
      </select>
      {error && <p style={{ fontSize: "11px", color: C.error }}>{error}</p>}
    </div>
  );
}

interface ChipsProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  error?: string;
  required?: boolean;
  max?: number;
}
function FChips({ label, options, selected, onChange, error, required, max }: ChipsProps) {
  const toggle = (o: string) => {
    if (selected.includes(o)) { onChange(selected.filter((s) => s !== o)); return; }
    if (max && selected.length >= max) return;
    onChange([...selected, o]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: error ? C.error : "rgba(255,255,255,0.55)" }}>
        {label}{required && <span style={{ color: C.magenta, marginLeft: "3px" }}>*</span>}
        {max && <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: "8px", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>pick up to {max}</span>}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {options.map((o) => {
          const on = selected.includes(o);
          const atMax = !on && max != null && selected.length >= max;
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              disabled={atMax}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                background: on ? "rgba(128,97,255,0.22)" : "rgba(128,97,255,0.05)",
                border: `1.5px solid ${on ? "rgba(128,97,255,0.7)" : C.border}`,
                color: on ? "#fff" : atMax ? "rgba(255,255,255,0.25)" : C.dim,
                fontSize: "13px",
                fontWeight: on ? 600 : 400,
                cursor: atMax ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {on ? "✓ " : ""}{o}
            </button>
          );
        })}
      </div>
      {error && <p style={{ fontSize: "11px", color: C.error }}>{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// PASSWORD INPUT  (show / hide toggle)
// ─────────────────────────────────────────────
function PasswordInput({ label, value, onChange, error, placeholder, autoComplete, required }: Omit<InputProps, "type">) {
  const [show, setShow] = useState(false);
  return (
    <FInput
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? "••••••••"}
      type={show ? "text" : "password"}
      error={error}
      required={required}
      autoComplete={autoComplete}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "15px", padding: 0, lineHeight: 1, transition: "color 0.15s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)")}
          title={show ? "Hide password" : "Show password"}
        >
          {show ? "🙈" : "👁"}
        </button>
      }
    />
  );
}

// ─────────────────────────────────────────────
// OAUTH BUTTON
// ─────────────────────────────────────────────
interface OAuthBtnProps {
  icon: string;
  label: string;
  onClick: () => void;
  accent?: string;
}
function OAuthBtn({ icon, label, onClick, accent = "rgba(128,97,255,0.4)" }: OAuthBtnProps) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "11px 16px",
        borderRadius: "10px",
        background: hov ? "rgba(128,97,255,0.12)" : "rgba(128,97,255,0.05)",
        border: `1.5px solid ${hov ? accent : C.border}`,
        color: hov ? "#fff" : C.dim2,
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.18s",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "17px", lineHeight: 1 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "4px",
            borderRadius: "100px",
            transition: "all 0.3s ease",
            background: i < step
              ? C.grad
              : i === step
              ? "rgba(128,97,255,0.5)"
              : "rgba(128,97,255,0.18)",
            flex: i === step ? 2 : 1,
          }}
        />
      ))}
      <p style={{ fontSize: "11px", color: C.dim, whiteSpace: "nowrap", marginLeft: "4px" }}>
        Step {step + 1} of {total}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const PLATFORMS  = ["Instagram", "TikTok", "YouTube", "LinkedIn", "X / Twitter", "Threads"];
const NICHES     = ["Lifestyle", "Travel", "Food & Drink", "Fitness", "Fashion & Beauty", "Business", "Tech", "Gaming", "Family", "Art & Design", "Music", "Comedy"];
const COUNTRIES  = [
  { value: "",   label: "Select your country…" },
  { value: "LV", label: "🇱🇻 Latvia" },
  { value: "LT", label: "🇱🇹 Lithuania" },
  { value: "EE", label: "🇪🇪 Estonia" },
  { value: "OTHER", label: "Other" },
];
const FOLLOWERS  = [
  { value: "",        label: "Approximate total following…" },
  { value: "1k-5k",   label: "1K – 5K" },
  { value: "5k-10k",  label: "5K – 10K" },
  { value: "10k-50k", label: "10K – 50K" },
  { value: "50k-100k",label: "50K – 100K" },
  { value: "100k+",   label: "100K+" },
];

// ─────────────────────────────────────────────
// SIGNUP STEP 1  — Account
// ─────────────────────────────────────────────
interface Step1Data { name: string; email: string; password: string; confirm: string }
type Step1Errors   = Partial<Record<keyof Step1Data, string>>;

interface Step1Props { onNext: (d: Step1Data) => void }
function SignupStep1({ onNext }: Step1Props) {
  const [d, setD] = useState<Step1Data>({ name: "", email: "", password: "", confirm: "" });
  const [e, setE] = useState<Step1Errors>({});
  const set = (k: keyof Step1Data) => (v: string) => setD((p) => ({ ...p, [k]: v }));

  const next = () => {
    const errs: Step1Errors = {};
    if (d.name.trim().length < 2)               errs.name     = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errs.email = "Enter a valid email";
    if (d.password.length < 8)                  errs.password = "Password must be at least 8 characters";
    if (d.confirm !== d.password)               errs.confirm  = "Passwords don't match";
    setE(errs);
    if (!Object.keys(errs).length) onNext(d);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <FInput    label="Full Name"      value={d.name}     onChange={set("name")}     placeholder="Marta Kalniņa"     required error={e.name}     autoComplete="name" />
      <FInput    label="Email Address"  value={d.email}    onChange={set("email")}    placeholder="you@email.com"    required error={e.email}    type="email" autoComplete="email" />
      <PasswordInput label="Password"   value={d.password} onChange={set("password")} placeholder="Min. 8 characters" required error={e.password} autoComplete="new-password" />
      <PasswordInput label="Confirm Password" value={d.confirm} onChange={set("confirm")} placeholder="Same as above" required error={e.confirm} autoComplete="new-password" />

      <SubmitBtn onClick={next} label="Continue →" />
    </div>
  );
}

// ─────────────────────────────────────────────
// SIGNUP STEP 2  — Creator Profile
// ─────────────────────────────────────────────
interface Step2Data { handle: string; platforms: string[]; niche: string[]; followers: string; country: string }
type Step2Errors = Partial<Record<keyof Step2Data, string>>;

interface Step2Props { onNext: (d: Step2Data) => void; onBack: () => void }
function SignupStep2({ onNext, onBack }: Step2Props) {
  const [d, setD] = useState<Step2Data>({ handle: "", platforms: [], niche: [], followers: "", country: "" });
  const [e, setE] = useState<Step2Errors>({});
  const set = (k: keyof Step2Data) => (v: string) => setD((p) => ({ ...p, [k]: v }));

  const next = () => {
    const errs: Step2Errors = {};
    if (d.handle.trim().length < 2)     errs.handle    = "Add your main social handle";
    if (d.platforms.length === 0)       errs.platforms = "Select at least one platform";
    if (d.niche.length === 0)           errs.niche     = "Pick at least one niche";
    if (!d.country)                     errs.country   = "Select your country";
    setE(errs);
    if (!Object.keys(errs).length) onNext(d);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <FInput label="Main Social Handle" value={d.handle} onChange={set("handle")} placeholder="@yourusername" required error={e.handle} hint="Your most active account" />
      <FChips label="Platforms" options={PLATFORMS} selected={d.platforms} onChange={(v) => setD((p) => ({ ...p, platforms: v }))} error={e.platforms} required />
      <FChips label="Content Niche" options={NICHES} selected={d.niche} onChange={(v) => setD((p) => ({ ...p, niche: v }))} error={e.niche} required max={3} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <FSelect label="Total Following" value={d.followers} onChange={set("followers")} options={FOLLOWERS} />
        <FSelect label="Country" value={d.country} onChange={set("country")} options={COUNTRIES} required error={e.country} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <BackBtn onClick={onBack} />
        <SubmitBtn onClick={next} label="Create Account →" flex />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIGNUP STEP 3  — Success
// ─────────────────────────────────────────────
function SignupStep3({ email }: { email: string }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      {/* Checkmark */}
      <div
        style={{
          width: "80px", height: "80px",
          borderRadius: "50%",
          background: "rgba(52,211,153,0.1)",
          border: "2px solid rgba(52,211,153,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "34px",
          animation: "pulse-success 2.2s ease infinite",
        }}
      >
        ✓
      </div>

      <div>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          You're In!
        </h3>
        <p style={{ fontSize: "14px", color: C.dim, lineHeight: 1.75, maxWidth: "320px" }}>
          We've sent a confirmation link to{" "}
          <span style={{ color: "#fff", fontWeight: 600 }}>{email}</span>
          . Verify your email to activate your creator profile.
        </p>
      </div>

      <div style={{ padding: "16px 20px", borderRadius: "12px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", width: "100%", boxSizing: "border-box" }}>
        <p style={{ fontSize: "13px", color: "rgba(52,211,153,0.85)", fontWeight: 500, lineHeight: 1.6 }}>
          📬 Check your inbox · Didn't get it? Check spam or{" "}
          <a href="#" style={{ color: "rgba(52,211,153,1)", fontWeight: 700, textDecoration: "none" }}>
            resend the link
          </a>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", marginTop: "4px" }}>
        {[
          { icon: "🔗", text: "Connect your Instagram for faster matching" },
          { icon: "📋", text: "Your profile is under review (48h avg.)"    },
          { icon: "📲", text: "Follow @nexfluence.eu for campaign updates"  },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 14px", borderRadius: "10px",
              background: "rgba(128,97,255,0.06)",
              border: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            <p style={{ fontSize: "12px", color: C.dim }}>{item.text}</p>
          </div>
        ))}
      </div>

      <a
        href="/zone"
        style={{
          marginTop: "8px",
          fontSize: "13px",
          color: C.dim,
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          transition: "color 0.18s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.dim)}
      >
        Back to Nexfluence →
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────
// SMALL SHARED BUTTONS
// ─────────────────────────────────────────────
function SubmitBtn({ onClick, label, flex }: { onClick: () => void; label: string; flex?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [hov, setHov]         = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: flex ? 1 : undefined,
        width: flex ? undefined : "100%",
        padding: "13px",
        borderRadius: "10px",
        background: loading ? "rgba(128,97,255,0.4)" : C.grad,
        border: "none",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        cursor: loading ? "wait" : "pointer",
        boxShadow: hov && !loading ? "0 10px 36px rgba(128,97,255,0.4)" : "0 6px 24px rgba(128,97,255,0.25)",
        transform: hov && !loading ? "translateY(-1px)" : "none",
        transition: "all 0.18s",
      }}
    >
      {loading ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          Processing…
        </span>
      ) : label}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "13px 20px",
        borderRadius: "10px",
        background: "transparent",
        border: `1.5px solid ${C.border}`,
        color: C.dim,
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "border-color 0.15s, color 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(128,97,255,0.7)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.dim; }}
    >
      ← Back
    </button>
  );
}

// ─────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────
function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(128,97,255,0.2)" }} />
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 500, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>OR CONTINUE WITH</p>
      <div style={{ flex: 1, height: "1px", background: "rgba(128,97,255,0.2)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// RIGHT PANEL — form shell
// ─────────────────────────────────────────────
function FormPanel() {
  const [mode, setMode]     = useState<AuthMode>("signup");
  const [signupStep, setSignupStep] = useState(0);
  const [step1Data, setStep1Data]   = useState<Step1Data | null>(null);
  const w = useWindowWidth();

  // ── Login state ──
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors]     = useState<{ email?: string; password?: string }>({});
  const [loginLoading, setLoginLoading]   = useState(false);
  const [forgotSent, setForgotSent]       = useState(false);

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setSignupStep(0);
    setStep1Data(null);
    setLoginErrors({});
    setForgotSent(false);
  };

  // ── Login submit ──
  const handleLogin = async () => {
    const errs: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) errs.email = "Enter a valid email";
    if (loginPassword.length < 1) errs.password = "Enter your password";
    setLoginErrors(errs);
    if (Object.keys(errs).length) return;
    setLoginLoading(true);
    // Replace with: await signIn({ email: loginEmail, password: loginPassword })
    await new Promise((r) => setTimeout(r, 1200));
    setLoginLoading(false);
    alert("Login hook — connect to BetterAuth");
  };

  const handleOAuth = (provider: string) => {
    // Replace with: await signIn.social({ provider })
    alert(`OAuth: ${provider} — connect to BetterAuth`);
  };

  const isMobile = w < 640;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "32px 24px 48px" : "48px 56px",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Logo (mobile only) */}
      {isMobile && (
        <a href="/zone" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "32px" }}>
          <Image src="/Nex.webp" alt="Nexfluence" width={40} height={40} style={{ borderRadius: "10px" }} />
          <div>
            <p style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>Nexfluence</p>
            <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em", marginTop: "2px" }}>CREATOR NEXUS</p>
          </div>
        </a>
      )}

      {/* Back to site */}
      {!isMobile && (
        <a
          href="/zone"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: C.dim, textDecoration: "none", marginBottom: "40px", transition: "color 0.15s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.dim)}
        >
          ← Back to Nexfluence
        </a>
      )}

      {/* Mode tabs */}
      <div
        style={{
          display: "inline-flex",
          borderRadius: "12px",
          background: "rgba(128,97,255,0.08)",
          border: `1px solid ${C.border}`,
          padding: "4px",
          marginBottom: "32px",
          alignSelf: "flex-start",
        }}
      >
        {(["signup", "login"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            style={{
              padding: "9px 24px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              transition: "all 0.2s",
              background: mode === m ? C.grad : "transparent",
              color: mode === m ? "#fff" : C.dim,
            }}
          >
            {m === "signup" ? "Sign Up" : "Log In"}
          </button>
        ))}
      </div>

      {/* ──── SIGNUP ──── */}
      {mode === "signup" && (
        <div>
          {signupStep < 2 && (
            <>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.pink, marginBottom: "6px" }}>
                Creator Account
              </p>
              <h1 style={{ fontSize: isMobile ? "26px" : "30px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", marginBottom: "6px", lineHeight: 1.1 }}>
                {signupStep === 0 ? "Create Your Account" : "Build Your Profile"}
              </h1>
              <p style={{ fontSize: "14px", color: C.dim, lineHeight: 1.6, marginBottom: "28px" }}>
                {signupStep === 0
                  ? "Join 500+ Baltic creators already in the network."
                  : "Tell us about your content so we can match you to the right brands."}
              </p>
            </>
          )}

          {signupStep < 2 && <StepDots step={signupStep} total={2} />}

          {/* OAuth only on step 0 */}
          {signupStep === 0 && (
            <>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <OAuthBtn icon="📸" label="Instagram"  onClick={() => handleOAuth("instagram")} accent="rgba(255,122,195,0.6)" />
                <OAuthBtn icon="🎵" label="TikTok"     onClick={() => handleOAuth("tiktok")}    accent="rgba(128,97,255,0.6)" />
                <OAuthBtn icon="G"  label="Google"     onClick={() => handleOAuth("google")}    accent="rgba(128,97,255,0.5)" />
              </div>
              <OrDivider />
              <div style={{ marginTop: "20px" }} />
            </>
          )}

          {signupStep === 0 && (
            <SignupStep1
              onNext={(d) => { setStep1Data(d); setSignupStep(1); }}
            />
          )}
          {signupStep === 1 && step1Data && (
            <SignupStep2
              onNext={() => setSignupStep(2)}
              onBack={() => setSignupStep(0)}
            />
          )}
          {signupStep === 2 && step1Data && (
            <SignupStep3 email={step1Data.email} />
          )}

          {signupStep < 2 && (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", marginTop: "20px", lineHeight: 1.6 }}>
              By signing up you agree to our{" "}
              <a href="#" style={{ color: C.violet, textDecoration: "none" }}>Terms of Service</a> and{" "}
              <a href="#" style={{ color: C.violet, textDecoration: "none" }}>Privacy Policy</a>.
            </p>
          )}
        </div>
      )}

      {/* ──── LOGIN ──── */}
      {mode === "login" && (
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.pink, marginBottom: "6px" }}>
            Creator Login
          </p>
          <h1 style={{ fontSize: isMobile ? "26px" : "30px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", marginBottom: "6px", lineHeight: 1.1 }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: "14px", color: C.dim, marginBottom: "28px", lineHeight: 1.6 }}>
            Sign in to your Nexfluence creator dashboard.
          </p>

          {/* OAuth */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            <OAuthBtn icon="📸" label="Instagram" onClick={() => handleOAuth("instagram")} accent="rgba(255,122,195,0.6)" />
            <OAuthBtn icon="🎵" label="TikTok"    onClick={() => handleOAuth("tiktok")}    accent="rgba(128,97,255,0.6)" />
            <OAuthBtn icon="G"  label="Google"    onClick={() => handleOAuth("google")}    accent="rgba(128,97,255,0.5)" />
          </div>

          <OrDivider />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
            <FInput
              label="Email Address"
              value={loginEmail}
              onChange={setLoginEmail}
              placeholder="you@email.com"
              type="email"
              autoComplete="email"
              required
              error={loginErrors.email}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <PasswordInput
                label="Password"
                value={loginPassword}
                onChange={setLoginPassword}
                required
                error={loginErrors.password}
                autoComplete="current-password"
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: C.violet, padding: 0, transition: "opacity 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {forgotSent && (
              <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.25)" }}>
                <p style={{ fontSize: "13px", color: "rgba(52,211,153,0.9)" }}>
                  📬 If that email is registered, a reset link is on its way.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loginLoading}
              style={{
                padding: "13px",
                borderRadius: "10px",
                background: loginLoading ? "rgba(128,97,255,0.4)" : C.grad,
                border: "none",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: loginLoading ? "wait" : "pointer",
                boxShadow: "0 6px 24px rgba(128,97,255,0.28)",
                transition: "all 0.18s",
              }}
            >
              {loginLoading ? (
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Signing in…
                </span>
              ) : "Sign In →"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom switch */}
      {signupStep < 2 && (
        <p style={{ fontSize: "13px", color: C.dim, marginTop: "28px" }}>
          {mode === "signup" ? "Already have an account? " : "New to Nexfluence? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.violet, fontWeight: 700, fontSize: "13px", padding: 0, transition: "opacity 0.15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            {mode === "signup" ? "Log in" : "Create an account"}
          </button>
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LEFT PANEL — branding + social proof
// ─────────────────────────────────────────────
const PROOF_CREATORS = [
  { name: "Cindy Bokāne",     niche: "Travel",   followers: "84K", photo: "/Speaker 1.webp", plat: "IG"  },
  { name: "Armands Simsons",  niche: "Business", followers: "61K", photo: "/Speaker 2.webp", plat: "IG"  },
];

const PERKS = [
  { icon: "💸", text: "Get paid on real results — not just reach"     },
  { icon: "🎯", text: "Matched to brands that fit your niche"          },
  { icon: "📊", text: "Full campaign analytics in one dashboard"       },
  { icon: "🤝", text: "Long-term affiliate deals, not one-off posts"   },
];

function BrandingPanel() {
  return (
    <div
      style={{
        flex: "0 0 440px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 44px",
        background: `linear-gradient(160deg, rgba(128,97,255,0.18) 0%, rgba(255,51,188,0.1) 50%, rgba(10,6,18,0.4) 100%)`,
        borderRight: "1px solid rgba(128,97,255,0.2)",
        boxSizing: "border-box",
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image src="/Skyline.webp" alt="" fill style={{ objectFit: "cover", opacity: 0.1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(10,6,18,0.7), rgba(10,6,18,0.5) 60%, rgba(10,6,18,0.85))" }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(128,97,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(128,97,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <a href="/zone" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "52px" }}>
          <Image src="/Nex.webp" alt="Nexfluence" width={44} height={44} style={{ borderRadius: "10px" }} />
          <div>
            <p style={{ fontSize: "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>Nexfluence</p>
            <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em", marginTop: "2px" }}>CREATOR NEXUS</p>
          </div>
        </a>

        {/* Headline */}
        <h2 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#fff", marginBottom: "16px" }}>
          Turn Your
          <br />
          Audience Into
          <br />
          <GradientText>Real Income</GradientText>
        </h2>
        <p style={{ fontSize: "14px", color: C.dim2, lineHeight: 1.75, marginBottom: "36px", maxWidth: "300px" }}>
          Join the Baltic's first performance-based creator network. Get matched to brands. Earn on results.
        </p>

        {/* Perks list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
          {PERKS.map((p) => (
            <div key={p.text} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "9px",
                  background: "rgba(128,97,255,0.15)",
                  border: "1px solid rgba(128,97,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", flexShrink: 0,
                }}
              >
                {p.icon}
              </span>
              <p style={{ fontSize: "13px", color: C.dim2, lineHeight: 1.55, paddingTop: "6px" }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creator social proof */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "14px" }}>
          Already in the network
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {PROOF_CREATORS.map((c) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "rgba(128,97,255,0.08)",
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(128,97,255,0.4)" }}>
                <Image src={c.photo} alt={c.name} fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{c.name}</p>
                <p style={{ fontSize: "11px", color: C.dim, marginTop: "3px" }}>{c.niche} · {c.followers} followers</p>
              </div>
              <span
                style={{
                  fontSize: "10px", fontWeight: 700,
                  padding: "3px 9px", borderRadius: "5px",
                  background: "rgba(255,51,188,0.15)",
                  color: C.pink, letterSpacing: "0.04em",
                }}
              >
                {c.plat}
              </span>
            </div>
          ))}
        </div>

        {/* Total count */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px" }}>
          <div style={{ display: "flex" }}>
            {["/Speaker 1.webp", "/Speaker 2.webp", "/Food.webp"].map((s, i) => (
              <div key={i} style={{ width: "26px", height: "26px", borderRadius: "50%", overflow: "hidden", border: "2px solid #0a0612", marginLeft: i === 0 ? 0 : "-8px", position: "relative" }}>
                <Image src={s} alt="" fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: C.dim }}>
            <span style={{ color: "#fff", fontWeight: 600 }}>497+ more creators</span> across the Baltics
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function AuthPage() {
  const w        = useWindowWidth();
  const isDesktop = w >= 900;

  return (
    <div style={{ background: C.ink, minHeight: "100vh", display: "flex" }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-success {
          0%, 100% { box-shadow: 0 0 0 0   rgba(52,211,153,0.35); }
          50%       { box-shadow: 0 0 0 14px rgba(52,211,153,0);   }
        }
        input::placeholder,
        textarea::placeholder { color: rgba(255,255,255,0.22); }
        select option          { background: #12081e; color: #fff; }
        * { font-family: var(--font-rubik), sans-serif; }
      `}</style>

      {/* Left panel — desktop only */}
      {isDesktop && <BrandingPanel />}

      {/* Right panel — form */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <FormPanel />
      </div>
    </div>
  );
}