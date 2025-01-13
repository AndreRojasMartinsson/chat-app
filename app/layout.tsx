import type { Metadata } from "next";
import { DM_Sans, Phudu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const phudu = Phudu({
  variable: "--font-phudu",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatTrack",
  description: "Realtime Chat App powered by Convex and NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <UserProvider>
        <body className={`${dmSans.variable} ${phudu.variable} antialiased`}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              enableColorScheme
            >
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </UserProvider>
    </html>
  );
}
