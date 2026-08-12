"use client";

import { useEffect, useState } from "react";
import { parseAuthParams, AuthParams } from "@/lib/auth-parser";
import { generateDeepLink } from "@/lib/deep-link";
import Confetti from "@/components/Confetti";

export default function AuthCallbackPage() {
  const [params, setParams] = useState<AuthParams>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const parsed = parseAuthParams();
    setParams(parsed);
  }, []);

  const isError = Boolean(params.error || params.errorCode);
  
  // Default to standard mobile app scheme URL
  const deepLinkUrl = generateDeepLink("mobile", params);

  // Auto-trigger redirect after 1.5 seconds on success
  useEffect(() => {
    if (!mounted || isError) return;

    const timer = setTimeout(() => {
      try {
        window.location.href = deepLinkUrl;
      } catch (e) {
        console.warn("Redirect failed:", e);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [mounted, isError, deepLinkUrl]);

  const handleOpenApp = () => {
    window.location.href = deepLinkUrl;
  };

  if (!mounted) {
    return (
      <main className="app-container">
        <div className="auth-wrapper" style={{ alignItems: "center", justifyContent: "center" }}>
          <div className="logo-header">
            <img src="/logo.png" alt="Fluff Walks" className="logo-image" />
            <span className="logo-text">Fluff Walks</span>
          </div>
          <p className="subheadline" style={{ margin: 0, textAlign: "center" }}>Connecting to Fluff Walks...</p>
        </div>
      </main>
    );
  }

  // Get content text based on redirect action type
  const getSuccessContent = () => {
    switch (params.type) {
      case "signup":
        return {
          title: "Email Verified! 🐾",
          sub: "Your Fluff Walks profile is now active and ready. You can safely return to the app.",
        };
      case "recovery":
        return {
          title: "Password Reset Verified! 🔑",
          sub: "Your password reset session is verified. Return to the app to set your new password.",
        };
      case "invite":
        return {
          title: "Invitation Accepted! 🐶",
          sub: "Welcome to Fluff Walks! Your account setup is complete.",
        };
      case "magiclink":
      default:
        return {
          title: "Account Connected! ✨",
          sub: "Your authentication was successful. You can safely close this window.",
        };
    }
  };

  const successContent = getSuccessContent();

  return (
    <main className="app-container">
      {/* High-quality confetti celebration on success */}
      <Confetti active={!isError} />

      <div className="auth-wrapper">
        {/* Brand Logo Header */}
        <div className="logo-header">
          <img src="/logo.png" alt="Fluff Walks Logo" className="logo-image" />
          <span className="logo-text">Fluff Walks</span>
        </div>

        {isError ? (
          /* Error State UI */
          <div style={{ textAlign: "center" }}>
            <div className="status-badge error">
              <span>⚠️ Authentication Failed</span>
            </div>

            <div className="icon-circle error">
              <svg className="checkmark-svg" viewBox="0 0 24 24" style={{ stroke: "#ef4444" }}>
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="3" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            <h1 className="headline">Link Expired or Invalid</h1>
            <p className="subheadline">
              {params.errorDescription ||
                "This verification link has expired or has already been used. Please request a new link from the mobile application."}
            </p>

            <button onClick={handleOpenApp} className="btn-orange-submit">
              <span>Open Fluff Walks App to Resend 🐾</span>
            </button>
          </div>
        ) : (
          /* Success State UI */
          <div style={{ textAlign: "center" }}>
            <div className="status-badge success">
              <span>✓ Verified</span>
            </div>

            <div className="icon-circle success">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <path
                  className="checkmark-check"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>

            <h1 className="headline">{successContent.title}</h1>
            <p className="subheadline">{successContent.sub}</p>

            {/* Email Pill Badge */}
            {params.email && (
              <div className="email-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>{params.email}</span>
              </div>
            )}

            {/* Action CTA */}
            <button onClick={handleOpenApp} className="btn-orange-submit" style={{ marginTop: "12px" }}>
              <span>Open Fluff Walks App 🐾</span>
            </button>
          </div>
        )}

        <div className="footer-branding">
          <span>Copyright © 2025 Fluff Walks LTD.</span>
        </div>
      </div>
    </main>
  );
}
