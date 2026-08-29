import { PROVENANCE_LEGEND, PROVENANCE_ORDER } from "@/components/quorum/primitives";

/* Visual only, per /docs/01-FEATURES.md §13. The one thing worth
   putting on it today is the provenance legend, because the marks
   carry meaning by shape and someone has to be able to look them up. */

export default function SettingsPage() {
  return (
    <>
      <header className="q-ws-head">
        <h1 className="q-ws-h1">Settings</h1>
        <span className="q-ws-head-note">visual only</span>
      </header>

      <div className="q-ws-detail">
        <div className="q-ws-section">
          <h3 className="q-ws-section-h">Provenance marks</h3>
          <p className="q-ws-empty-s">
            Every answer the agent gives carries exactly one mark. They are
            distinguished by shape as well as colour, so they still read in
            greyscale and on a washed-out projector.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
            {PROVENANCE_ORDER.map((kind) => (
              <div
                key={kind}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 120px 1fr",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 0",
                  borderBottom: "1px solid var(--q-rule)",
                  font: "400 12px/1.4 var(--q-body)",
                }}
              >
                <span className="q-prov" data-kind={kind} aria-hidden="true" />
                <span style={{ font: "400 11px/1 var(--q-mono)", color: "var(--q-muted)" }}>
                  {kind}
                </span>
                <span>{PROVENANCE_LEGEND[kind]}</span>
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
