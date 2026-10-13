import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FindIt | IIT Ropar Lost & Found",
    template: "%s | FindIt",
  },
  description:
    "The campus lost and found for IIT Ropar. Report what you lost, post what you found, and let the administration verify every handover.",
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-dvh bg-cream text-ink">
        {/* Ambient page glows from the design: emerald top right, coral bottom left. */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-48 -top-72 size-232 rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.16),transparent)]" />
          <div className="absolute -bottom-80 -left-72 size-260 rounded-full bg-[radial-gradient(closest-side,rgb(255_107_87/0.13),transparent)]" />
        </div>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
