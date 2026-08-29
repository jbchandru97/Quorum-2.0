import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aql AI – Mobile Prototype",
  description: "The Aql AI spending-review flow, rebuilt as a native mobile app.",
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
