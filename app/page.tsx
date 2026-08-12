"use client";

import { useEffect, useState, useTransition } from "react";
import { parseAuthParams, AuthParams } from "@/lib/auth-parser";
import { generateDeepLink, SchemeType } from "@/lib/deep-link";
import Confetti from "@/components/Confetti";

export default function AuthCallbackPage() {
  const [params, setParams] = useState<AuthParams>({});
  const [scheme, setScheme] = useState<SchemeType>("mobile");
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState<number>(1.5);
  const [progress, setProgress] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    const parsed = parseAuthParams();
    setParams(parsed);
  }, []);

  const isError = Boolean(params.error || params.errorCode);
  const deepLinkUrl = generateDeepLink(scheme, params);

  // Auto-trigger deep-linking after 1.5 seconds countdown if no error
  useEffect(() => {
    if (!mounted || isError) return;

    const totalMs = 1500;
    const intervalMs = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      const remainingSec = Math.max(0, (totalMs - elapsed) / 1000);
      const remainingPct = Math.max(0, ((totalMs - elapsed) / totalMs) * 100);

      setCountdown(Number(remainingSec.toFixed(1)));
      setProgress(remainingPct);

      if (elapsed >= totalMs) {
        clearInterval(timer);
        // Execute deep link redirect
        try {
          window.location.href = deepLinkUrl;
        } catch (e) {
          console.warn("Auto deep-link trigger error:", e);
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [mounted, isError, deepLinkUrl]);

  const handleOpenApp = () => {
    window.location.href = deepLinkUrl;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return (
      <main className="app-container">
        <div className="auth-card">
          <div className="logo-container">
            <img src="/logo.png" alt="Fluff Walks" className="brand-logo-img" />
          </div>
          <p className="subheadline" style={{ margin: 0 }}>Connecting to FluffWalks...</p>
        </div>
      </main>
    );
  }

  // Determine context headline & subheadline based on auth type
  const getSuccessContent = () => {
    switch (params.type) {
      case "signup":
        return {
          title: "Email Verified! 🐾",
          sub: "Your FluffWalks account is verified and ready. You can safely return to the mobile app.",
        };
      case "recovery":
        return {
          title: "Password Reset Verified! 🔑",
          sub: "Your password reset session is authenticated. Return to FluffWalks app to choose a new password.",
        };
      case "invite":
        return {
          title: "Invitation Accepted! 🐶",
          sub: "Welcome to the FluffWalks family! Your account has been successfully set up.",
        };
      case "magiclink":
      default:
        return {
          title: "Account Connected! ✨",
          sub: "Your FluffWalks profile is active and ready. You can safely close this page.",
        };
    }
  };

  const successContent = getSuccessContent();

  return (
    <main className="app-container">
      {/* Celebratory confetti on success */}
      <Confetti active={!isError} />

      <div className="auth-card">
        {/* Floating Brand Logo Header */}
        <div className="logo-container">
          <img src="/logo.png" alt="Fluff Walks Logo" className="brand-logo-img" />
          <span className="floating-paw-badge">🐾</span>
        </div>

        <div className="brand-title">
          <span>FLUFF WALKS</span>
        </div>

        {isError ? (
          /* Error State */
          <div>
            <div className="status-badge error">
              <span>⚠️ Authentication Issue</span>
            </div>

            <div className="icon-circle error">
              <svg className="checkmark-svg" viewBox="0 0 24 24" style={{ stroke: "#ef4444" }}>
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <h1 className="headline">Link Expired or Invalid</h1>
            <p className="subheadline">
              {params.errorDescription ||
                "This verification link has expired or has already been used. Please request a new link from the mobile app."}
            </p>

            <button onClick={handleOpenApp} className="btn-primary">
              <span>Open FluffWalks App to Resend 🐾</span>
            </button>
          </div>
        ) : (
          /* Success State */
          <div>
            <div className="status-badge success">
              <span>Verified Callback</span>
            </div>

            {/* Animated Checkmark Circle */}
            <div className="icon-circle success">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" opacity="0.1" />
                <path
                  className="checkmark-check"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>

            <h1 className="headline">{successContent.title}</h1>
            <p className="subheadline">{successContent.sub}</p>

            {/* Display Verified User Email if decoded */}
            {params.email && (
              <div className="email-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>{params.email}</span>
              </div>
            )}

            {/* Auto Deep-Link Countdown */}
            <div className="countdown-box">
              <div className="countdown-text">
                {countdown > 0
                  ? `Attempting to open app in ${countdown}s...`
                  : "Opening FluffWalks app..."}
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Main Action Button */}
            <button onClick={handleOpenApp} className="btn-primary">
              <span>Open FluffWalks App 🐾</span>
            </button>
          </div>
        )}

        {/* Secondary Options & Developer Scheme Selector */}
        <div className="secondary-actions">
          <div className="scheme-selector">
            <span>Target Scheme:</span>
            <button
              onClick={() => startTransition(() => setScheme("mobile"))}
              className={`scheme-btn ${scheme === "mobile" ? "active" : ""}`}
              title="mobile://auth/callback"
            >
              mobile://
            </button>
            <button
              onClick={() => startTransition(() => setScheme("fluffwalks"))}
              className={`scheme-btn ${scheme === "fluffwalks" ? "active" : ""}`}
              title="fluffwalks://auth/callback"
            >
              fluffwalks://
            </button>
            <button
              onClick={() => startTransition(() => setScheme("exp"))}
              className={`scheme-btn ${scheme === "exp" ? "active" : ""}`}
              title="exp:// Expo Go dev link"
            >
              exp:// (Expo)
            </button>
          </div>

          <button onClick={handleCopyLink} className="btn-text-link">
            {copied ? "✓ Link Copied to Clipboard!" : "Copy Deep-Link for Manual Paste"}
          </button>
        </div>

        <div className="footer-text">
          <span>Official Auth Callback Portal for</span>
          <strong style={{ color: "var(--color-orange)" }}>FluffWalks</strong>
        </div>
      </div>
    </main>
  );
}
