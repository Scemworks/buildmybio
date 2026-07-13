import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildmybio.vercel.app"),
  title: "BuildMyBio - GitHub Profile Generator",
  description: "Generate an animated, self-updating terminal SVG and advanced stats for your GitHub Profile README. Create a beautiful, bespoke developer portfolio in seconds.",
  keywords: ["GitHub", "README", "Profile", "Generator", "Neofetch", "SVG", "Stats", "Developer", "Portfolio"],
  authors: [{ name: "Scemworks" }],
  openGraph: {
    title: "BuildMyBio - Animated GitHub Profile Generator",
    description: "Generate an animated, self-updating terminal SVG and advanced stats for your GitHub Profile README.",
    url: "https://buildmybio.vercel.app", // Adjust if there's a custom domain
    siteName: "BuildMyBio",
    images: [
      {
        url: "/og-image.png", // Will need an actual OG image, but fallback is fine
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildMyBio - Animated GitHub Profile Generator",
    description: "Create a beautiful, bespoke developer portfolio for your GitHub README in seconds.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
