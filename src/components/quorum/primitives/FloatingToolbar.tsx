"use client";

/* ───────────────────────────────────────────────────────────────
   FloatingToolbar — the persistent, low-chrome control bar.

   Generic shell only: it lays out groups separated by hairlines and
   animates itself in. What goes in the groups is the caller's
   business, so the same shell serves a review bar, a filter bar, or
   anything else that must stay available without taking the screen.
   ─────────────────────────────────────────────────────────────── */

export function FloatingToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  /* The bar rises into place on mount; see `q-enter-toolbar`. */
  return (
    <div className="q-toolbar-wrap">
      <div
        className={["q-toolbar", className].filter(Boolean).join(" ")}
        role="toolbar"
      >
        {children}
      </div>
    </div>
  );
}

export function ToolbarGroup({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="q-toolbar-group" role="group" aria-label={label}>
      {children}
    </div>
  );
}

export type ToolbarButtonProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  /** Trailing figure, set in mono because a count is an interface artifact. */
  count?: number | string;
  /** Marks the held tool or the open surface. */
  active?: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: () => void;
  /** A toolbar button is a common popover anchor, so it takes a ref
      directly — wrapping it in a `display: contents` span would give
      the popover a zero-sized rectangle to position against. */
  ref?: React.Ref<HTMLButtonElement>;
};

export function ToolbarButton({
  children,
  icon,
  count,
  active = false,
  disabled = false,
  title,
  onClick,
  ref,
}: ToolbarButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={`q-tb-btn${active ? " is-on" : ""}`}
      aria-pressed={active}
      disabled={disabled}
      title={title}
      onClick={onClick}
    >
      {icon}
      {children}
      {count !== undefined && <span className="q-tb-count">{count}</span>}
    </button>
  );
}

export function ToolbarDivider() {
  return <span className="q-tb-divider" aria-hidden="true" />;
}
