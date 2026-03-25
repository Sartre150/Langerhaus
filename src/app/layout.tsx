import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { ProgressProvider } from "@/lib/ProgressContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { StudyProvider } from "@/lib/StudyContext";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1510" },
  ],
};

export const metadata: Metadata = {
  title: "Langerhaus — Cuaderno de Arena y Cálculo",
  description:
    "Un lugar entre la memoria y las matemáticas. Roadmap visual de aritmética a cálculo multivariable.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Langerhaus",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('langerhaus-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`
              + `;if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary font-sans pt-safe pb-safe`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ProgressProvider>
              <StudyProvider>{children}</StudyProvider>
            </ProgressProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
