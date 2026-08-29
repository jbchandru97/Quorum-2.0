"use client";

import { PROVENANCE_LEGEND, type Provenance } from "./provenance";

/* ───────────────────────────────────────────────────────────────
   SourceChip — where an answer came from.

   The highest-value detail in the reference design, and the one
   worth copying most carefully: provenance is carried by *shape* as
   well as colour, so it survives greyscale, colour blindness, and a
   projector that eats saturation.

     filled square   fetched data
     hollow square   cited principle or document
     filled circle   model inference
     hollow circle   a person said it

   A chip is set in mono at 11px on a hairline. That is what makes it
   read as an interface artifact rather than as prose — not a colour
   fill, which is why these chips do not have one.
   ─────────────────────────────────────────────────────────────── */

export type SourceChipProps = {
  /** What was consulted: "Design review playbook", "Analytics precedent". */
  label: string;
  provenance?: Provenance;
  /** Quieter trailing text: a section, a date, a metric. */
  detail?: string;
  /** Makes the chip a link out to the source. */
  href?: string;
  onClick?: () => void;
  title?: string;
};

export function SourceChip({
  label,
  provenance = "cited",
  detail,
  href,
  onClick,
  title,
}: SourceChipProps) {
  /* Chips arrive under an answer, so they enter the same way every
     other row in Quorum does rather than popping in fully formed. */
  const cls = "q-chip";

  const inner = (
    <>
      <span className="q-prov" data-kind={provenance} aria-hidden="true" />
      <span className="q-chip-label">{label}</span>
      {detail && <span className="q-chip-detail">{detail}</span>}
    </>
  );

  const describedTitle = title ?? `${PROVENANCE_LEGEND[provenance]} · ${label}`;

  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer" title={describedTitle}>
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} title={describedTitle}>
        {inner}
      </button>
    );
  }
  return (
    <span className={cls} title={describedTitle}>
      {inner}
    </span>
  );
}

export function SourceChips({ children }: { children: React.ReactNode }) {
  return <div className="q-chips">{children}</div>;
}

/* The legend and the `Provenance` type are deliberately NOT
   re-exported here. Routing that data through a `"use client"` module
   gives a server component a client reference instead of the object,
   and the failure is silent. Import them from ./provenance, or from
   the barrel, which does exactly that. */
