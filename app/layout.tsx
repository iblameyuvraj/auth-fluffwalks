import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluff Walks | Authentication Callback Portal",
  description: "Official authentication callback and deep-linking landing page for the FluffWalks mobile application.",
  metadataBase: new URL("https://auth.fluffwalks.in"),
  icons: {
    icon: "https://framerusercontent.com/images/4ttu7pHe4vcU0VsRvxnyTvQE.png",
  },
  openGraph: {
    title: "Fluff Walks Auth Portal",
    description: "Verified authentication callback for FluffWalks App.",
    url: "https://auth.fluffwalks.in",
    siteName: "Fluff Walks",
    images: [
      {
        url: "https://framerusercontent.com/images/fefC2RWvbwNoJwbi2L8dekNgNM.png",
        width: 1200,
        height: 630,
        alt: "Fluff Walks Pet Care",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
