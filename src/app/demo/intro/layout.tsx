import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./case-study.css";

const newsreader = Newsreader({
  variable: "--cs-serif", subsets: ["latin"],
  weight: ["300", "400", "500"], style: ["normal", "italic"],
});
const plex = IBM_Plex_Mono({
  variable: "--cs-mono", subsets: ["latin"], weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Aql AI — Case Study",
  description: "Envisioning an AI-native finance experience. Designed and built.",
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${newsreader.variable} ${plex.variable} cs-root`}>{children}</div>;
}
