"use client";

import { useEffect, useState } from "react";
import { AppStateProvider } from "@/components/demo/mobile/AppState";
import MobileApp from "@/components/demo/mobile/MobileApp";
import MobileWizard from "@/components/demo/mobile/MobileWizard";
import { SCREEN_H, SCREEN_W } from "@/components/demo/mobile/PhoneScreen";

/* The phone renders at true 1:1 device points and only scales down when the
   browser window is too short to show it — so a device frame dropped in later
   still lines up pixel-for-pixel. */
function useFitScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const byH = (window.innerHeight - 56) / SCREEN_H;
      const byW = (window.innerWidth - 40) / SCREEN_W;
      setScale(Math.min(1, byH, byW));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}

export default function MobilePrototypePage() {
  const scale = useFitScale();

  return (
    <AppStateProvider>
      <div style={{
        minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden",
        background: "#0F1016",
        backgroundImage:
          "radial-gradient(90% 60% at 50% -10%, rgba(116,84,232,0.30) 0%, rgba(116,84,232,0) 62%), " +
          "radial-gradient(70% 50% at 12% 105%, rgba(219,162,211,0.16) 0%, rgba(219,162,211,0) 60%), " +
          "radial-gradient(60% 45% at 92% 90%, rgba(78,41,221,0.20) 0%, rgba(78,41,221,0) 60%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}>
        {/* label */}
        <div style={{
          position: "fixed", top: 22, left: 26, zIndex: 400,
          display: "flex", flexDirection: "column", gap: 2, pointerEvents: "none",
        }}>
          <span style={{
            fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.62)",
          }}>
            Aql AI — Mobile
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
            iPhone 17 Pro · 402 × 874 pt
          </span>
        </div>

        <div style={{
          transform: `scale(${scale})`, transformOrigin: "center center",
          transition: "transform 0.15s ease-out",
        }}>
          <MobileApp />
        </div>

        <MobileWizard />
      </div>
    </AppStateProvider>
  );
}
