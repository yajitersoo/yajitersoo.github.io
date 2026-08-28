import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { PortfolioProfileProvider } from "@/components/profile-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tersoo Yaji | Evidence, Data and Decision Support",
    template: "%s | Tersoo Yaji",
  },
  description:
    "Portfolio of Tersoo Yaji, a monitoring, evaluation, information management, data analytics and GIS specialist.",
  keywords: [
    "Tersoo Yaji",
    "monitoring and evaluation",
    "information management",
    "data analytics",
    "GIS",
    "Power BI",
    "humanitarian data",
  ],
  authors: [{ name: "Tersoo Yaji" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PortfolioProfileProvider>{children}</PortfolioProfileProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
