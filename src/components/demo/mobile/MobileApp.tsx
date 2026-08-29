"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "./AppState";
import PhoneScreen from "./PhoneScreen";
import TabBar from "./TabBar";
import HomeScreen from "./screens/HomeScreen";
import MalAIScreen from "./screens/MalAIScreen";
import StubScreen from "./screens/StubScreen";
import { EASE_OUT } from "./theme";

/* Screens are stacked and cross-faded rather than swapped, so scroll
   position and in-screen state survive a tab switch — the thing that
   separates an app from a website. */
export default function MobileApp() {
  const { state } = useApp();
  const [composerFocused, setComposerFocused] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [homeStatusLight, setHomeStatusLight] = useState(true);

  const onStatusLight = useCallback((v: boolean) => setHomeStatusLight(v), []);

  /* Only Home puts a dark surface under the status bar. */
  const statusLight = state.tab === "home" && homeStatusLight;

  const layer = (key: string, active: boolean, node: React.ReactNode) => (
    <motion.div
      key={key}
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.985 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      style={{
        position: "absolute", inset: 0,
        pointerEvents: active ? "auto" : "none",
        visibility: active ? "visible" : "hidden",
        zIndex: active ? 2 : 1,
      }}
    >
      {node}
    </motion.div>
  );

  return (
    <PhoneScreen statusLight={statusLight}>
      <div style={{ position: "absolute", inset: 0 }}>
        {layer("home", state.tab === "home", (
          <HomeScreen active={state.tab === "home"} onStatusLight={onStatusLight} />
        ))}
        {layer("malai", state.tab === "malai", (
          <MalAIScreen
            key={state.conversationKey}
            active={state.tab === "malai"}
            onComposerFocus={setComposerFocused}
            onSheetChange={setSheetOpen}
          />
        ))}
        <AnimatePresence>
          {(state.tab === "cards" || state.tab === "activity" || state.tab === "more") && (
            <motion.div
              key={state.tab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              style={{ position: "absolute", inset: 0, zIndex: 3 }}
            >
              <StubScreen tab={state.tab} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TabBar hidden={composerFocused || (sheetOpen && state.tab === "malai")} />
    </PhoneScreen>
  );
}
