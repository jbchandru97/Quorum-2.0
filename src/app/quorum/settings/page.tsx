 import { PROVENANCE_LEGEND, PROVENANCE_ORDER, SourceChip } from "@/components/quorum/primitives";
import type { Provenance } from "@/components/quorum/primitives";

/* A reference surface, per /docs/01-FEATURES.md §13. The one thing
   worth putting on it today is the provenance legend, because the
   marks carry meaning by shape and someone has to be able to look
   them up. */

/* Each legend row shows the mark exactly as it ships in-thread: a
   real SourceChip, not a lookalike. */
const EXAMPLE_CHIP: Record<Provenance, { label: string; detail?: string }> = {
  fetched: { label: "Analytics precedent", detail: "21% vs 9%" },
  cited: { label: "Product rationale", detail: "product-rationale.md" },
  inferred: { label: "Agent synthesis", detail: "inferred" },
  human: { label: "Thread discussion" },
};

export default function SettingsPage() {
  return (
    <>
      <header className="q-ws-head">
        <div>
          <h1 className="q-ws-h1">Settings</h1>
          <p className="q-ws-head-sub">How to read what Quorum shows you.</p>
        </div>
      </header>

      <div className="q-ws-detail">
        <div className="q-ws-section">
          <h3 className="q-ws-section-h">Provenance marks</h3>
          <p className="q-ws-empty-s">
            Every answer the agent gives carries exactly one mark. They are
            distinguished by shape as well as colour, so they still read in
            greyscale and on a washed-out projector.
          </p>
          <div className="q-ws-legend">
            {PROVENANCE_ORDER.map((kind) => (
              <div key={kind} className="q-ws-legend-row">
                <span className="q-prov" data-kind={kind} aria-hidden="true" />
                <span className="q-ws-legend-kind">{kind}</span>
                <span className="q-ws-legend-desc">{PROVENANCE_LEGEND[kind]}</span>
                <span className="q-ws-legend-chip">
                  <SourceChip
                    label={EXAMPLE_CHIP[kind].label}
                    detail={EXAMPLE_CHIP[kind].detail}
                    provenance={kind}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="q-ws-section">
          <h3 className="q-ws-section-h">Review host</h3>
          <p className="q-ws-empty-s">
            Quorum reviews a cloned copy of Malbank / Aql AI that ships inside
            this project at <code>/demo/playground</code>. The original repo is
            never modified.
          </p>
        </div>

        <div className="q-ws-ghost">
          <span className="q-ws-ghost-label">Not in scope</span>
          <p className="q-ws-empty-s">
            Project administration, integrations configuration and permissions
            depth are out of scope for the hackathon (/docs/00-SCOPE.md).
          </p>
        </div>
      </div>
    </>
  );
}
