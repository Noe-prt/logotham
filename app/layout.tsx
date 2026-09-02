import { FeedbackPrompt } from "@/components/feedback-prompt";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import "@flaticon/flaticon-uicons/css/all/all.css";
import { Analytics } from "@vercel/analytics/next";
import "boxicons/css/boxicons.min.css";
import "lineicons/dist/lineicons.css";
import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Logotham — Logo Maker for Shippers",
  description:
    "Craft your logo easily across 24k+ icons with our simple editor—plus AI when you need inspiration. Perfect for founders, indie makers, and designers shipping fast. Export PNG, SVG, brand kits, and mockups in seconds with full support for Lucide, Flaticon, Feather, Iconoir, Boxicons, Heroicons, Tabler, Hugeicons, Lineicons, and Font Awesome.",
  keywords: [
    "logo maker",
    "logo generator",
    "logo creator",
    "logo design",
    "ship fast",
    "startup tools",
    "indie makers",
    "founder tools",
    "AI logo generator",
    "icon logo maker",
    "Lucide icons",
    "Flaticon logos",
    "Feather icons",
    "Iconoir",
    "Boxicons",
    "Heroicons",
    "Tabler icons",
    "Hugeicons",
    "Lineicons",
    "Font Awesome",
    "brand kit export",
    "custom logo",
  ],
  authors: [{ name: "mathaegon", url: "https://x.com/mathaegon" }],
  creator: "mathaegon",
  publisher: "Logotham",
  openGraph: {
    title: "Logotham — Logo Maker for Shippers",
    description:
      "Craft your logo easily across 24k+ icons with our simple editor—plus AI when you need inspiration. Export brand kits, PNG, SVG, and mockups. Built for founders and indie makers who ship fast.",
    type: "website",
    url: "https://logotham.app",
    images: [
      {
        url: "https://logotham.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Logotham logo maker for founders and shippers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Logotham — Logo Maker for Shippers",
    description:
      "Craft logos easily across 24k+ icons with simple editor—plus AI when you need it. Export brand kits, PNG, SVG, mockups. Built for founders who ship fast.",
    images: ["https://logotham.app/og-image.jpg"],
    creator: "@mathaegon",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://logotham.app",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${geistMono.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col overflow-x-hidden bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="relative w-full flex-1 min-h-0 overflow-x-hidden">
            <Analytics />
            <Toaster />
            {children}
            <FeedbackPrompt />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
