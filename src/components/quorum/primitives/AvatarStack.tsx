"use client";

/* ───────────────────────────────────────────────────────────────
   Avatar and AvatarStack — who is here.

   Presence is shown by a dot on the ring, not by a colour change on
   the face, so an offline participant still reads as themselves.

   Initials over a generated fill are the default rather than the
   fallback: a stack must be legible before any image loads, and in
   a demo there are rarely real photographs to load at all.
   ─────────────────────────────────────────────────────────────── */

export type Person = {
  id: string;
  name: string;
  /** Shown in the title attribute beside the name. */
  role?: string;
  avatarUrl?: string;
  active?: boolean;
};

/* A stable hue per person: same name, same colour, every session and
   every browser — no palette to store and no colours to assign. */
function hueOf(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  person,
  size = 26,
  showPresence = false,
}: {
  person: Person;
  size?: number;
  showPresence?: boolean;
}) {
  const hue = hueOf(person.id || person.name);
  const label = person.role ? `${person.name} · ${person.role}` : person.name;

  return (
    <span
      className="q-avatar"
      title={label}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        /* Low saturation and high lightness keep the stack quiet —
           these are identity marks, not decoration. */
        background: person.avatarUrl ? undefined : `hsl(${hue} 34% 88%)`,
        color: person.avatarUrl ? undefined : `hsl(${hue} 40% 28%)`,
      }}
    >
      {person.avatarUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={person.avatarUrl} alt="" />
      ) : (
        initialsOf(person.name)
      )}
      {showPresence && person.active && <span className="q-avatar-live" />}
      <span className="sr-only" style={SR_ONLY}>{label}</span>
    </span>
  );
}

const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
};

export function AvatarStack({
  people,
  size = 26,
  max = 4,
  showPresence = true,
  label = "Participants",
}: {
  people: Person[];
  size?: number;
  /** Beyond this the remainder collapses into a +N chip. */
  max?: number;
  showPresence?: boolean;
  label?: string;
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;

  return (
    <span className="q-avatars" role="group" aria-label={label}>
      {shown.map((p) => (
        <Avatar key={p.id} person={p} size={size} showPresence={showPresence} />
      ))}
      {rest > 0 && (
        <span
          className="q-avatar q-avatar-more"
          style={{ width: size, height: size }}
          title={people.slice(max).map((p) => p.name).join(", ")}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
