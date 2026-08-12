"use client";

import { useEffect, useState } from "react";
import { parseAuthParams, AuthParams } from "@/lib/auth-parser";
import { generateDeepLink } from "@/lib/deep-link";
import BackgroundStroke from "@/components/BackgroundStroke";

export default function AuthCallbackPage() {
  const [params, setParams] = useState<AuthParams>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const parsed = parseAuthParams();
    setParams(parsed);
  }, []);

  const isError = Boolean(params.error || params.errorCode);

  // Check if this page was loaded as part of an active authentication/callback flow.
  // If there are no auth action parameters, we treat the request as a direct landing page visit.
  const isAuthAction = Boolean(
    params.accessToken ||
    params.refreshToken ||
    params.code ||
    params.error ||
    params.errorCode ||
    params.type
  );
  
  // Default to standard mobile app scheme URL
  const deepLinkUrl = generateDeepLink("mobile", params);


  const handleOpenApp = () => {
    window.location.href = deepLinkUrl;
  };

  if (!mounted) {
    return (
      <main className="app-container">
        <BackgroundStroke />
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

  // If the user visits this page directly without any auth parameters, show the data transparency and purpose disclosure
  if (!isAuthAction) {
    return (
      <main className="app-container">
        <BackgroundStroke />
        <div className="auth-wrapper" style={{ maxWidth: "520px" }}>
          {/* Brand Logo Header */}
          <div className="logo-header">
            <img src="/logo.png" alt="Fluff Walks Logo" className="logo-image" />
            <span className="logo-text">Fluff Walks</span>
          </div>

          <div style={{ textAlign: "center" }}>
            <h1 className="headline" style={{ fontSize: "24px", letterSpacing: "-0.02em" }}>Authentication Gateway</h1>
            <p className="subheadline" style={{ fontSize: "14px", marginTop: "4px" }}>
              This portal (<code>auth.fluffwalks.in</code>) is the secure OAuth 2.0 authentication service for the <strong>Fluff Walks</strong> mobile application.
            </p>
          </div>

          {/* Card 1: App Purpose & Features */}
          <div className="info-card">
            <div className="info-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <span>Application Purpose &amp; Features</span>
            </div>
            <p className="info-body">
              Fluff Walks is a comprehensive pet care platform that matches pet owners with background-verified, professionally trained dog walkers and sitters. Our mobile application provides:
            </p>
            <ul className="info-list">
              <li className="info-list-item">
                <span className="info-list-bullet">✓</span>
                <span><strong>Verified Walkers &amp; Sitters:</strong> Easily book and schedule trusted care near your neighborhood.</span>
              </li>
              <li className="info-list-item">
                <span className="info-list-bullet">✓</span>
                <span><strong>Real-Time GPS Tracking:</strong> Monitor your pet's walking routes live for complete peace of mind.</span>
              </li>
              <li className="info-list-item">
                <span className="info-list-bullet">✓</span>
                <span><strong>Structured Walk Summaries:</strong> Receive detailed reports on hydration, potty breaks, distance, and photos after every walk.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Google Sign-In & Privacy */}
          <div className="info-card">
            <div className="info-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Google Sign-In &amp; User Data Usage</span>
            </div>
            <p className="info-body">
              We utilize Google Sign-In to establish a secure login session without storing password hashes. During sign-in, we request access to basic, non-sensitive credentials:
            </p>
            <ul className="info-list">
              <li className="info-list-item">
                <span className="info-list-bullet">•</span>
                <span><strong>Email Address:</strong> Used to uniquely identify you, verify your account status, and send important service alerts, invoices, and walk reports.</span>
              </li>
              <li className="info-list-item">
                <span className="info-list-bullet">•</span>
                <span><strong>Name &amp; Profile Picture:</strong> Used solely to personalize your app dashboard and verify your identity with your booked pet walker during hands-on handoff.</span>
              </li>
            </ul>
            <p className="info-body" style={{ fontSize: "13px", fontStyle: "italic", borderTop: "1px dashed var(--color-border)", paddingTop: "10px", marginTop: "4px" }}>
              <strong>Scope Compliance:</strong> We do not request or access sensitive scopes (e.g., Contacts, Drive, Calendar). Your data is fully encrypted in transit and at rest and is never shared with third-party advertisers.
            </p>
          </div>

          <button onClick={() => window.location.href = "https://fluffwalks.in"} className="btn-secondary-submit">
            <span>Go to main fluffwalks.in website</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "4px" }}>
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          <div className="links-container">
            <a href="https://fluffwalks.in/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <span style={{ color: "var(--color-border)" }}>|</span>
            <a href="https://fluffwalks.in/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            <span style={{ color: "var(--color-border)" }}>|</span>
            <a href="mailto:wecare@fluffwalks.in">Support Contact</a>
          </div>

          <div className="footer-branding">
            <span>Copyright © 2025 Fluff Walks LTD.</span>
          </div>
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
      <BackgroundStroke />

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
