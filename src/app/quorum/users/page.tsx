import { AvatarStack, type Person } from "@/components/quorum/primitives";
import { seedUsers } from "@/lib/quorum/fixtures";

/* A reference surface, per /docs/01-FEATURES.md §13. It reads the
   seeded participants so the page shows the real cast rather than
   invented placeholders — but there is nothing to manage here yet. */

const ROLE_LABEL: Record<string, string> = {
  pm: "PM",
  designer: "Designer",
  engineer: "Engineer",
  agent: "Agent",
};

/* One quiet glyph per role, drawn in the same 16px stroke language
   as the rail icons — recognisable at a glance without colour. */
function RoleIcon({ role }: { role: string }) {
  const common = {
    viewBox: "0 0 16 16",
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (role) {
    case "designer":
      return (
        <svg {...common}>
          <path d="M8 2.2 12.2 10a4.6 4.6 0 1 1-8.4 0z" />
          <circle cx="8" cy="10.4" r="1.1" />
        </svg>
      );
    case "pm":
      return (
        <svg {...common}>
          <path d="M3.5 13.5v-11h8l-1.6 2.6 1.6 2.6h-8" />
        </svg>
      );
    case "engineer":
      return (
        <svg {...common}>
          <path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5" />
        </svg>
      );
    case "agent":
      return (
        <svg {...common}>
          <path d="M8 2v2.2M8 11.8V14M2 8h2.2M11.8 8H14M4.2 4.2l1.5 1.5M10.3 10.3l1.5 1.5M11.8 4.2l-1.5 1.5M5.7 10.3l-1.5 1.5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function UsersPage() {
  return (
    <>
      <header className="q-ws-head">
        <h1 className="q-ws-h1">Users</h1>
      </header>

      <div className="q-ws-detail">
        <div className="q-ws-section">
          <h3 className="q-ws-section-h">Seeded participants</h3>
          {seedUsers.map((u) => {
            const person: Person = {
              id: u.id,
              name: u.name,
              role: ROLE_LABEL[u.role] ?? u.role,
              active: u.isActive,
            };
            return (
              <div key={u.id} className="q-ws-user-row">
                <AvatarStack people={[person]} size={30} />
                <div className="q-ws-user-id">
                  <span className="q-ws-user-name">{u.name}</span>
                  {u.note && <span className="q-ws-user-note">{u.note}</span>}
                </div>
                <span className="q-ws-role" data-role={u.role}>
                  <RoleIcon role={u.role} />
                  {ROLE_LABEL[u.role] ?? u.role}
                </span>
              </div>
            );
          })}
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
