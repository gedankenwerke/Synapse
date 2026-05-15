import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "./globals.css";

const lineSeed = localFont({
  src: [
    {
      path: "./fonts/LINESeedSansTH_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LINESeedSansTH_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-line-seed",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      {...mantineHtmlProps}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${lineSeed.variable} h-full antialiased`}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className="mantine-body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}