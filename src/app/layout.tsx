import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Langerhaus — Cuaderno de Arena y Cálculo",
  description:
    "Un lugar entre la memoria y las matemáticas. Roadmap visual de aritmética a cálculo multivariable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('langerhaus-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary font-sans`}
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
