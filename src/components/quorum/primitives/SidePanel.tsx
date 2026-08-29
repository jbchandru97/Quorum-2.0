"use client";

/* ───────────────────────────────────────────────────────────────
   SidePanel — a contextual surface docked to an edge.

   It keeps the product visible: the panel takes a column, never the
   screen. When closed it parks off-screen but leaves a 32px rail
   behind, so the surface stays discoverable without occupying
   anything — the reference's code hand-off column, generalised.

   Pass `rail={false}` for a panel that should vanish completely when
   closed, and it parks fully out of view instead.
   ─────────────────────────────────────────────────────────────── */

export type SidePanelProps = {
  open: boolean;
  onClose?: () => void;
  /** Clicking the rail is the way back in when the panel is closed. */
  onRailClick?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Vertical text on the closed rail. Ignored when `rail` is false. */
  railLabel?: string;
  rail?: boolean;
  side?: "left" | "right";
  width?: number;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function SidePanel({
  open,
  onClose,
  onRailClick,
  title,
  subtitle,
  railLabel = "panel",
  rail = true,
  side = "right",
  width = 380,
  footer,
  children,
}: SidePanelProps) {
  return (
    <aside
      className={[
        "q-panel",
        open ? "is-open" : "",
        rail ? "" : "no-rail",
      ]
        .filter(Boolean)
        .join(" ")}
      data-side={side}
      style={{ width }}
      /* Hidden from assistive tech while parked, so a closed panel's
         contents are not read out as part of the page. */
      aria-hidden={!open}
    >
      {rail && (
        <button
          type="button"
          className="q-panel-rail"
          onClick={onRailClick ?? onClose}
          aria-label={open ? `Close ${railLabel}` : `Open ${railLabel}`}
        >
          <span className="q-panel-rail-t">{railLabel}</span>
        </button>
      )}

      <div className="q-panel-body">
        {(title || onClose) && (
          <header className="q-panel-head">
            <span className="q-panel-title">
              {title}
              {subtitle && <span className="q-panel-sub">{subtitle}</span>}
            </span>
            {onClose && (
              <button type="button" className="q-panel-x" onClick={onClose} aria-label="Close">
                ×
              </button>
            )}
          </header>
        )}

        <div className="q-panel-content">{children}</div>

        {footer && <footer className="q-panel-foot">{footer}</footer>}
      </div>
    </aside>
  );
}
