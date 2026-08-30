"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QuorumMark } from "../QuorumMark";
import "./workspace.css";

/* ───────────────────────────────────────────────────────────────
   WorkspaceShell — the standalone Quorum app frame.

   Left rail, content area, nothing else. Threads is the only tab
   that will do real work; Users and Settings are visual, and say so
   with a quiet mono tag rather than a disabled state that reads as
   broken.
   ─────────────────────────────────────────────────────────────── */

function IconThreads() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="6" cy="6" r="2.4" />
      <path d="M1.9 13.2a4.4 4.4 0 0 1 8.2 0M11 4.1a2.2 2.2 0 0 1 0 4.1M12.2 12.9a4 4 0 0 0-1.1-2.1" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.6v1.7M8 12.7v1.7M14.4 8h-1.7M3.3 8H1.6M12.5 3.5l-1.2 1.2M4.7 11.3l-1.2 1.2M12.5 12.5l-1.2-1.2M4.7 4.7L3.5 3.5" />
    </svg>
  );
}

const NAV = [
  { href: "/quorum/threads", label: "Threads", icon: IconThreads, tag: undefined },
  { href: "/quorum/users", label: "Users", icon: IconUsers, tag: "ref" },
  { href: "/quorum/settings", label: "Settings", icon: IconSettings, tag: "ref" },
] as const;

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="q-ws">
      <nav className="q-ws-side" aria-label="Quorum">
        <Link
          className="q-ws-brand"
          href="/demo/playground"
          title="Back to the review playground"
        >
          <QuorumMark size={20} title="Quorum" />
          <span>Quorum</span>
        </Link>

        <div className="q-ws-nav">
          {NAV.map(({ href, label, icon: Icon, tag }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname?.startsWith(href) ? "page" : undefined}
            >
              <Icon />
              <span>{label}</span>
              {tag && <span className="q-ws-nav-tag">{tag}</span>}
            </Link>
          ))}
        </div>

        {/* The nav is Threads / Users / Settings per /docs/01-FEATURES.md
            §13. The foundation gallery is developer scaffolding, so it
            sits below the rule rather than becoming a fourth tab. */}
        <div className="q-ws-side-foot">
          <span>
            <Link className="q-ws-foot-link" href="/quorum/foundation">
              Foundation
            </Link>
            <br />
            Review host · /demo/playground
          </span>
        </div>
      </nav>

      <main className="q-ws-main">{children}</main>
    </div>
  );
}
