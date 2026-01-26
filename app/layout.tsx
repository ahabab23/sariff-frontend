import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../styles/globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sarif - World-Class Fintech Platform",
  description:
    "Premium money exchange and client account management system with enterprise-grade accounting",
  keywords: [
    "fintech",
    "money exchange",
    "accounting",
    "client management",
    "double-entry accounting",
  ],
  authors: [{ name: "Sarif" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={GeistSans.className}>
        <ThemeProvider>
          <div className="min-h-screen relative">
            {/* Animated Background */}
            <AnimatedBackground variant="gradient" />

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              richColors
              expand={true}
              toastOptions={{
                style: {
                  borderRadius: "12px",
                  padding: "16px",
                },
                className: "font-medium",
              }}
            />

            {/* Main Content */}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
