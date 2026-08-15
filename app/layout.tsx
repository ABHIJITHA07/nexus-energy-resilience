import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScenarioProvider } from "@/context/ScenarioContext";
import { NavRail } from "@/components/ui/NavRail";
import { TopStatusBar } from "@/components/ui/TopStatusBar";
import { AIAssistantModal } from "@/components/ui/AIAssistantModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXUS — AI-Assisted Supply Resilience Decision Engine",
  description: "Know when to act before your options disappear. A real-options decision engine for energy supply chain disruption under uncertainty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-bg-primary text-text-primary font-sans antialiased min-h-screen flex flex-col selection:bg-accent selection:text-white">
        <ScenarioProvider>
          <div className="flex min-h-screen w-full">
            <NavRail />
            <div className="flex-1 flex flex-col min-w-0">
              <TopStatusBar />
              <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
                {children}
              </main>
              <AIAssistantModal />
            </div>
          </div>
        </ScenarioProvider>
      </body>
    </html>
  );
}
