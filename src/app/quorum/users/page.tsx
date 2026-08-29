import { AvatarStack, type Person } from "@/components/quorum/primitives";
import { seedUsers } from "@/lib/quorum/fixtures";

/* Visual only, per /docs/01-FEATURES.md §13. It reads the seeded
   participants so the page shows the real cast rather than invented
   placeholders — but there is nothing to manage here yet. */

const ROLE_LABEL: Record<string, string> = {
  pm: "PM",
  designer: "Designer",
  engineer: "Engineer",
  agent: "Agent",
};

export default function UsersPage() {
  const people: Person[] = seedUsers.map((u) => ({
    id: u.id,
    name: u.name,
    role: ROLE_LABEL[u.role] ?? u.role,
    active: u.isActive,
  }));

  return (
    <>
      <header className="q-ws-head">
        <h1 className="q-ws-h1">Users</h1>
        <span className="q-ws-head-note">visual only</span>
      </header>

      <div className="q-ws-detail">
        <div className="q-ws-section">
          <h3 className="q-ws-section-h">Seeded participants</h3>
          {people.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid var(--q-rule)",
              }}
            >
              <AvatarStack people={[p]} size={28} />
              <span style={{ font: "400 13px/1.3 var(--q-body)" }}>{p.name}</span>
              <span
                style={{
                  marginLeft: "auto",
                  font: "400 10.5px/1 var(--q-mono)",
                  color: "var(--q-muted)",
                }}
              >
                {p.role}
              </span>
            </div>
          ))}
        </div>

        <div className="q-ws-ghost">
          <span className="q-ws-ghost-label">Not in scope</span>
          <p className="q-ws-empty-s">
            Invitations, roles and permissions are out of scope for the hackathon
            (/docs/00-SCOPE.md). This page exists so the workspace reads as a
            product, not so it manages accounts.
          </p>
        </div>
      </div>
    </>
  );
}
