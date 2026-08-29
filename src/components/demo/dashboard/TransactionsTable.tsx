"use client";

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconSort() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M10 4L7 7M10 4l3 3M10 16l-3-3M10 16l3-3" stroke="var(--icon-soft-400)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDotsVertical() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="5" r="1.125" fill="var(--icon-sub-600)" />
      <circle cx="10" cy="10" r="1.125" fill="var(--icon-sub-600)" />
      <circle cx="10" cy="15" r="1.125" fill="var(--icon-sub-600)" />
    </svg>
  );
}

// Provided icons — row To/From column
function IconLineChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4.75 3.25V15.25H16.75V16.75H3.25V3.25H4.75ZM16.2197 5.71975L17.2802 6.78025L13 11.0605L10.75 8.81125L7.53025 12.0303L6.46975 10.9698L10.75 6.6895L13 8.93875L16.2197 5.71975Z" fill="#5C5C5C"/>
    </svg>
  );
}

function IconPieChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 17.5C5.85775 17.5 2.5 14.1422 2.5 10C2.5 6.6415 4.70725 3.799 7.75 2.8435V4.4365C6.46069 4.96003 5.39335 5.91528 4.73054 7.13884C4.06774 8.36239 3.85066 9.77823 4.11644 11.1442C4.38222 12.5101 5.11434 13.7412 6.18757 14.627C7.2608 15.5128 8.60846 15.9981 10 16C11.1953 16 12.3634 15.643 13.3546 14.9749C14.3458 14.3068 15.115 13.358 15.5635 12.25H17.1565C16.201 15.2928 13.3585 17.5 10 17.5ZM17.4625 10.75H9.25V2.5375C9.49675 2.51275 9.74725 2.5 10 2.5C14.1422 2.5 17.5 5.85775 17.5 10C17.5 10.2528 17.4873 10.5033 17.4625 10.75ZM10.75 4.0465V9.25H15.9535C15.7866 7.9282 15.1846 6.6995 14.2426 5.75743C13.3005 4.81535 12.0718 4.21344 10.75 4.0465Z" fill="#5C5C5C"/>
    </svg>
  );
}

function IconComputer() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4.00003 13H16V4.75H4.00003V13ZM10.75 14.5V16H13.75V17.5H6.25003V16H9.25003V14.5H3.24403C3.14554 14.4994 3.04814 14.4794 2.95741 14.4411C2.86667 14.4028 2.78439 14.347 2.71527 14.2768C2.64616 14.2066 2.59157 14.1235 2.55463 14.0322C2.5177 13.9409 2.49914 13.8432 2.50003 13.7448V4.00525C2.50003 3.58825 2.84128 3.25 3.24403 3.25H16.756C17.167 3.25 17.5 3.58675 17.5 4.00525V13.7448C17.5 14.1618 17.1588 14.5 16.756 14.5H10.75Z" fill="#5C5C5C"/>
    </svg>
  );
}

function IconFlashlight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10.75 7.75H16.75L9.25 19V12.25H4L10.75 1V7.75ZM9.25 9.25V6.415L6.649 10.75H10.75V14.0455L13.9473 9.25H9.25Z" fill="#5C5C5C"/>
    </svg>
  );
}

function Checkbox() {
  return (
    <div style={{ width: 20, height: 20, position: "relative", flexShrink: 0 }}>
      <div style={{
        width: 16, height: 16, left: 2, top: 2, position: "absolute",
        backgroundColor: "var(--bg-soft-200)", borderRadius: 4,
      }} />
      <div style={{
        width: 13, height: 13, left: 3.5, top: 3.5, position: "absolute",
        backgroundColor: "var(--bg-white-0)",
        boxShadow: "0px 2px 2px rgba(27, 28, 29, 0.12)",
        borderRadius: 2.6,
      }} />
    </div>
  );
}

function RowIconPill({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: 6,
      backgroundColor: "var(--bg-white-0)",
      boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
      borderRadius: 999,
      outline: "1px solid var(--stroke-soft-200)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

function AvatarImg({ src, fallback }: { src: string; fallback: string }) {
  return (
    <div style={{
      width: 32, height: 32,
      borderRadius: 999,
      overflow: "hidden",
      flexShrink: 0,
      outline: "1px solid var(--stroke-soft-200)",
    }}>
      <img src={src} alt={fallback} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

function AvatarInitials({ initials, bg }: { initials: string; bg: string }) {
  return (
    <div style={{
      width: 32, height: 32,
      borderRadius: 999,
      backgroundColor: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      fontSize: 11,
      fontWeight: 600,
      color: "var(--text-sub-600)",
      fontFamily: "var(--font-inter), Inter, sans-serif",
    }}>
      {initials}
    </div>
  );
}

const transactions = [
  {
    id: 1,
    name: "Investment Return",
    rowIcon: IconLineChart,
    avatar: null,
    amount: "AED 560.00",
    positive: true,
    account: "Checking",
    date: "12 September",
    method: "Wire",
  },
  {
    id: 2,
    name: "James Brown",
    rowIcon: null,
    avatar: { type: "initials", initials: "JB", bg: "var(--neutral-gray-200)" },
    amount: "-AED 35.20",
    positive: false,
    account: "Ops Payroll",
    date: "12 September",
    method: "Money Transfer",
  },
  {
    id: 3,
    name: "Stock Dividend",
    rowIcon: IconPieChart,
    avatar: null,
    amount: "AED 1,250.00",
    positive: true,
    account: "AP",
    date: "12 September",
    method: "ACH",
  },
  {
    id: 4,
    name: "Sophia Williams",
    rowIcon: null,
    avatar: { type: "initials", initials: "SW", bg: "#FFECC0" },
    amount: "AED 150.00",
    positive: true,
    account: "Checking",
    date: "12 September",
    method: "Money Transfer",
  },
  {
    id: 5,
    name: "Freelance Income",
    rowIcon: IconComputer,
    avatar: null,
    amount: "AED 250.00",
    positive: true,
    account: "Checking",
    date: "12 September",
    method: "ACH",
  },
  {
    id: 6,
    name: "Emma Wright",
    rowIcon: null,
    avatar: { type: "initials", initials: "EW", bg: "#D6EAF8" },
    amount: "-AED 21.80",
    positive: false,
    account: "AP",
    date: "12 September",
    method: "Wire",
  },
  {
    id: 7,
    name: "Utilities Payment",
    rowIcon: IconFlashlight,
    avatar: null,
    amount: "-AED 63.75",
    positive: false,
    account: "Ops Payroll",
    date: "12 September",
    method: "ACH",
  },
  {
    id: 8,
    name: "Matthew Johnson",
    rowIcon: null,
    avatar: { type: "initials", initials: "MJ", bg: "#E8DAEF" },
    amount: "-AED 45.00",
    positive: false,
    account: "Checking",
    date: "11 September",
    method: "Money Transfer",
  },
  {
    id: 9,
    name: "Rental Income",
    rowIcon: IconPieChart,
    avatar: null,
    amount: "AED 3,200.00",
    positive: true,
    account: "Checking",
    date: "11 September",
    method: "Wire",
  },
  {
    id: 10,
    name: "SaaS Subscription",
    rowIcon: IconComputer,
    avatar: null,
    amount: "-AED 89.00",
    positive: false,
    account: "AP",
    date: "11 September",
    method: "ACH",
  },
];

const cellBase: React.CSSProperties = {
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 12,
  paddingRight: 20,
  backgroundColor: "var(--bg-white-0)",
  display: "flex",
  alignItems: "center",
  height: 48,
  overflow: "hidden",
};

export default function TransactionsTable() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14, fontWeight: 500,
            color: "var(--text-strong-950)", lineHeight: "20px",
          }}>
            Recent Transactions
          </span>
          <span style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 12, fontWeight: 400,
            color: "var(--text-sub-600)", lineHeight: "16px",
          }}>
            Display the recent transactions in the table below.
          </span>
        </div>

        {/* Search — no shortcut chip */}
        <div style={{
          width: 300, height: 36,
          display: "flex", alignItems: "center", gap: 8,
          paddingTop: 8, paddingBottom: 8, paddingLeft: 10, paddingRight: 10,
          backgroundColor: "var(--bg-white-0)",
          boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
          borderRadius: 8,
          outline: "1px solid var(--stroke-soft-200)",
        }}>
          <span style={{ color: "var(--icon-soft-400)", display: "flex", flexShrink: 0 }}>
            <IconSearch />
          </span>
          <input
            placeholder="Search by merchant or amount…"
            style={{
              flex: 1, border: "none", outline: "none",
              backgroundColor: "transparent",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 14, color: "var(--text-soft-400)",
              lineHeight: "20px",
            }}
          />
        </div>

        {/* See All */}
        <button style={{
          padding: 8,
          backgroundColor: "var(--bg-white-0)",
          boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
          borderRadius: 8,
          outline: "1px solid var(--stroke-soft-200)",
          border: "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            paddingLeft: 4, paddingRight: 4,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14, fontWeight: 500,
            color: "var(--text-sub-600)", lineHeight: "20px",
          }}>
            See All
          </span>
        </button>
      </div>

      {/* Table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Header */}
        <div style={{
          display: "flex",
          backgroundColor: "var(--bg-weak-50)",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{
            flex: 1,
            display: "flex", alignItems: "center", gap: 10,
            paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
          }}>
            <Checkbox />
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 14, fontWeight: 400,
                color: "var(--text-sub-600)", lineHeight: "20px",
              }}>To / From</span>
              <IconSort />
            </div>
          </div>

          {(["Amount", "Account", "Date & Time", "Payment Method"] as const).map((label, i) => (
            <div key={label} style={{
              width: i === 0 ? 148 : 188,
              display: "flex", alignItems: "center", gap: 2,
              paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
            }}>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 14, fontWeight: 400,
                color: "var(--text-sub-600)", lineHeight: "20px",
              }}>{label}</span>
              <IconSort />
            </div>
          ))}

          <div style={{ width: 64 }} />
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {transactions.map((tx, i) => (
            <div key={tx.id}>
              <div style={{ display: "flex", alignItems: "stretch" }}>

                {/* To/From */}
                <div style={{ ...cellBase, flex: 1, gap: 12, paddingRight: 20 }}>
                  <Checkbox />
                  {tx.avatar ? (
                    <AvatarInitials initials={tx.avatar.initials} bg={tx.avatar.bg} />
                  ) : (
                    <RowIconPill>
                      {tx.rowIcon && <tx.rowIcon />}
                    </RowIconPill>
                  )}
                  <span style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 14, fontWeight: 400,
                    color: "var(--text-strong-950)", lineHeight: "20px",
                  }}>
                    {tx.name}
                  </span>
                </div>

                {/* Amount */}
                <div style={{ ...cellBase, width: 148 }}>
                  <span style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 14, fontWeight: 400,
                    color: tx.positive ? "var(--text-sub-600)" : "var(--text-sub-600)",
                    lineHeight: "20px",
                  }}>
                    {tx.amount}
                  </span>
                </div>

                {/* Account */}
                <div style={{ ...cellBase, width: 188 }}>
                  <span style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 14, fontWeight: 400,
                    color: "var(--text-sub-600)", lineHeight: "20px",
                  }}>
                    {tx.account}
                  </span>
                </div>

                {/* Date */}
                <div style={{ ...cellBase, width: 188 }}>
                  <span style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 14, fontWeight: 400,
                    color: "var(--text-sub-600)", lineHeight: "20px",
                  }}>
                    {tx.date}
                  </span>
                </div>

                {/* Payment Method — text only */}
                <div style={{ ...cellBase, width: 188 }}>
                  <span style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 14, fontWeight: 400,
                    color: "var(--text-sub-600)", lineHeight: "20px",
                  }}>
                    {tx.method}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ ...cellBase, width: 64, justifyContent: "center", paddingLeft: 12, paddingRight: 12 }}>
                  <button style={{
                    padding: 2, borderRadius: 6,
                    border: "none", backgroundColor: "transparent",
                    cursor: "pointer", display: "flex",
                  }}>
                    <IconDotsVertical />
                  </button>
                </div>
              </div>

              {i < transactions.length - 1 && (
                <div style={{ paddingTop: 1.5, paddingBottom: 1.5 }}>
                  <div style={{ height: 1, backgroundColor: "var(--stroke-soft-200)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
