"use client";

import { motion } from "framer-motion";
import { useApp, type Tab } from "./AppState";
import { NAV_GAP, NAV_H, NAV_INSET, SAFE_BOTTOM } from "./PhoneScreen";
import { gradTint, NAV_SHADOW, SPRING_SNAP } from "./theme";
import { IconHome, IconCard, IconActivity, IconMore, Tappable } from "./ui";
import { AqlMark } from "@/components/demo/AqlMark";

const ACTIVE = "#171717";
const IDLE = "#8E8E96";

type Item = { key: Tab; label: string; icon?: typeof IconHome; brand?: boolean };

const ITEMS: Item[] = [
  { key: "home",     label: "Home",     icon: IconHome },
  { key: "cards",    label: "Cards",    icon: IconCard },
  { key: "malai",    label: "Aql AI",   brand: true },
  { key: "activity", label: "Activity", icon: IconActivity },
  { key: "more",     label: "More",     icon: IconMore },
];

/* A floating, blurred pill inset from the edges — the pattern Notion,
   Calm, CLEAR and Apple News all use. The active item is marked by a
   lozenge that slides between positions rather than cross-fading. */
export default function TabBar({ hidden = false }: { hidden?: boolean }) {
  const { state, dispatch } = useApp();

  return (
    <motion.nav
      initial={false}
      animate={{
        y: hidden ? NAV_H + NAV_GAP + SAFE_BOTTOM + 12 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={SPRING_SNAP}
      style={{
        position: "absolute", zIndex: 60,
        left: NAV_INSET, right: NAV_INSET, bottom: SAFE_BOTTOM + NAV_GAP,
        height: NAV_H, borderRadius: 999,
        display: "flex", alignItems: "stretch",
        padding: 5,
        background: "rgba(252,252,253,0.74)",
        backdropFilter: "saturate(185%) blur(28px)",
        WebkitBackdropFilter: "saturate(185%) blur(28px)",
        boxShadow: `${NAV_SHADOW}, inset 0 1px 0 rgba(255,255,255,0.9)`,
        border: "1px solid rgba(255,255,255,0.55)",
        outline: "1px solid rgba(16,24,40,0.05)",
        outlineOffset: -1,
      }}
    >
      {ITEMS.map(item => {
        const active = state.tab === item.key;

        return (
          <Tappable
            key={item.key}
            scale={0.9}
            onTap={() => dispatch({ type: "setTab", tab: item.key })}
            style={{
              flex: 1, position: "relative", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 2.5,
              borderRadius: 999,
            }}
          >
            {/* sliding active lozenge */}
            {active && (
              <motion.span
                layoutId="navLozenge"
                transition={SPRING_SNAP}
                style={{
                  position: "absolute", inset: 0, borderRadius: 999,
                  background: gradTint(0.17),
                  border: "1px solid rgba(180,158,250,0.45)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                }}
              />
            )}

            <span style={{ position: "relative", display: "flex", height: 22, alignItems: "center" }}>
              {item.brand ? (
                <AqlMark size={20} />
              ) : (
                item.icon && <item.icon size={21} color={active ? ACTIVE : IDLE} active={active} />
              )}

              {/* habit-pattern-1 badge — a pill item can't become a card */}
              {item.brand && state.juneNudge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 17 }}
                  style={{
                    position: "absolute", top: -2, right: -6,
                    width: 8, height: 8, borderRadius: 999,
                    background: "#FB3748",
                    boxShadow: "0 0 0 2px rgba(252,252,253,0.95)",
                  }}
                />
              )}
            </span>

            <motion.span
              animate={{ color: active ? ACTIVE : IDLE }}
              transition={{ duration: 0.18 }}
              style={{
                position: "relative", fontSize: 9.5, lineHeight: "11px",
                fontWeight: active ? 600 : 500, letterSpacing: "-0.01em",
              }}
            >
              {item.label}
            </motion.span>
          </Tappable>
        );
      })}
    </motion.nav>
  );
}
