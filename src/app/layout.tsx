
"use client";

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import React, from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>LAFZ</title>
        <meta name="description" content="Learn the core words of the Quran" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
           <footer className="py-6 md:px-8 md:py-0 border-t bg-background/80 backdrop-blur-sm z-10">
            <div className="container flex flex-col items-center justify-between gap-4 h-24 md:flex-row">
              <p className="text-sm text-center text-muted-foreground">
                © {new Date().getFullYear()} LAFZ. Built with purpose.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/features"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Features
                </Link>
                <Link
                  href="/suggestions"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Suggestions
                </Link>
                <Link
                  href="/contribute"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Contribute
                </Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
