/* ───────────────────────────────────────────────────────────────
   The embedded demo host.

   Everything under /demo is a clone of the Malbank / Aql AI app
   (jbchandru97/mal-ai, deployed at mal-ai-three.vercel.app). It runs
   here as Quorum's review fixture: the product a team reviews.

   This layout reproduces the source app's root layout — its fonts, its
   bootstrap script, its full-height body — but scoped to a wrapper so
   Quorum's own surfaces keep their own type and tokens.
   ─────────────────────────────────────────────────────────────── */

import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./demo.css";
import DemoBootstrap from "./demo-bootstrap";
import { ReviewMount } from "@/components/quorum/overlay/ReviewMount";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-display",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Aql AI – Finance Dashboard",
  description: "Finance & Banking Dashboard",
};

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${interTight.variable} mal-root`}>
      <DemoBootstrap />
      {children}
      {/* Quorum's own layer. On by default over /demo/playground,
          opt-in (?review=1) elsewhere — see ReviewMount. */}
      <ReviewMount />
    </div>
  );
}
