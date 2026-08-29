"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter as useMalRouter } from "next/navigation";
import Sidebar from "@/components/demo/dashboard/Sidebar";
import Topbar from "@/components/demo/dashboard/Topbar";
import { FlickeringGrid } from "@/components/demo/dashboard/FlickeringGrid";
import WizardPanel from "@/components/demo/WizardPanel";
import { AqlMark } from "@/components/demo/AqlMark";

const GRAD = "linear-gradient(135deg, #DBA2D3 21%, #C3A0EB 36%, #B49EFA 45%, #9479F1 58%, #7454E8 69%, #4E29DD 83%, #130360 97%)";

/* ─── icons ─── */
function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8.75 11H7.25V7.25H8.75V11ZM8.75 5.75H7.25V4.25H8.75V5.75Z" fill="var(--icon-soft-400,#A3A3A3)" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.25 9.25V4.75H10.75V9.25H15.25V10.75H10.75V15.25H9.25V10.75H4.75V9.25H9.25Z" fill="var(--icon-soft-400,#A3A3A3)" />
    </svg>
  );
}
function IconArrowUp({ white }: { white?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3.5L10 16.5M10 3.5L5 8.5M10 3.5L15 8.5" stroke={white ? "white" : "var(--icon-soft-400,#A3A3A3)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4.99961 4.4V2.6C4.99961 2.44087 5.06282 2.28826 5.17535 2.17574C5.28787 2.06321 5.44048 2 5.59961 2H12.7996C12.9587 2 13.1114 2.06321 13.2239 2.17574C13.3364 2.28826 13.3996 2.44087 13.3996 2.6V11C13.3996 11.1591 13.3364 11.3117 13.2239 11.4243C13.1114 11.5368 12.9587 11.6 12.7996 11.6H10.9996V13.4C10.9996 13.7312 10.7296 14 10.3954 14H3.20381C3.12469 14.0005 3.04625 13.9853 2.973 13.9554C2.89976 13.9254 2.83315 13.8813 2.777 13.8256C2.72086 13.7698 2.67629 13.7035 2.64584 13.6305C2.6154 13.5575 2.59969 13.4791 2.59961 13.4L2.60141 5C2.60141 4.6688 2.87141 4.4 3.20561 4.4H4.99961ZM3.80141 5.6L3.79961 12.8H9.79961V5.6H3.80141ZM6.19961 4.4H10.9996V10.4H12.1996V3.2H6.19961V4.4Z" fill="#A4A4A4"/>
    </svg>
  );
}
function IconThumbUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.56039 5.59989H13.4004C13.7187 5.59989 14.0239 5.72632 14.2489 5.95137C14.474 6.17641 14.6004 6.48163 14.6004 6.79989V8.06229C14.6006 8.21911 14.57 8.37444 14.5104 8.51949L12.6534 13.0285C12.6081 13.1384 12.5312 13.2324 12.4323 13.2985C12.3335 13.3647 12.2173 13.3999 12.0984 13.3999H2.00039C1.84126 13.3999 1.68865 13.3367 1.57613 13.2242C1.4636 13.1116 1.40039 12.959 1.40039 12.7999V6.79989C1.40039 6.64076 1.4636 6.48815 1.57613 6.37563C1.68865 6.26311 1.84126 6.19989 2.00039 6.19989H4.08959C4.18565 6.19992 4.28031 6.17688 4.36561 6.13271C4.45091 6.08855 4.52437 6.02455 4.57979 5.94609L7.85159 1.30989C7.89295 1.25128 7.95394 1.20943 8.02351 1.19193C8.09308 1.17443 8.16662 1.18243 8.23079 1.21449L9.31919 1.75869C9.62549 1.91179 9.87019 2.16508 10.0126 2.47648C10.1551 2.78788 10.1867 3.13865 10.1022 3.47049L9.56039 5.59989ZM5.00039 7.15269V12.1999H11.6964L13.4004 8.06229V6.79989H9.56039C9.37763 6.79987 9.19729 6.7581 9.03313 6.67777C8.86897 6.59744 8.72532 6.48068 8.61316 6.33639C8.50099 6.19209 8.42326 6.02409 8.3859 5.84519C8.34854 5.66629 8.35254 5.48121 8.39759 5.30409L8.93939 3.17529C8.95635 3.10889 8.95006 3.03868 8.92157 2.97635C8.89307 2.91402 8.8441 2.86332 8.78279 2.83269L8.38619 2.63469L5.56019 6.63789C5.41019 6.85029 5.21819 7.02429 5.00039 7.15269ZM3.80039 7.39989H2.60039V12.1999H3.80039V7.39989Z" fill="#A4A4A4"/>
    </svg>
  );
}
function IconThumbDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.55961 10.4001L13.3996 10.4001C13.7179 10.4001 14.0231 10.2737 14.2481 10.0486C14.4732 9.82358 14.5996 9.51836 14.5996 9.2001L14.5996 7.9377C14.5998 7.78088 14.5692 7.62555 14.5096 7.4805L12.652 2.9721C12.6068 2.86215 12.53 2.76809 12.4313 2.70186C12.3326 2.63563 12.2165 2.60021 12.0976 2.6001L1.99961 2.6001C1.84048 2.6001 1.68787 2.66331 1.57534 2.77583C1.46282 2.88835 1.39961 3.04097 1.39961 3.2001L1.39961 9.2001C1.39961 9.35923 1.46282 9.51184 1.57534 9.62436C1.68786 9.73688 1.84048 9.8001 1.99961 9.8001L4.08881 9.8001C4.18487 9.80007 4.27952 9.82311 4.36483 9.86728C4.45013 9.91144 4.52358 9.97544 4.57901 10.0539L7.85081 14.6895C7.89217 14.7481 7.95316 14.79 8.02273 14.8075C8.0923 14.825 8.16584 14.817 8.23001 14.7849L9.31841 14.2401C9.62471 14.087 9.86941 13.8337 10.0118 13.5223C10.1543 13.2109 10.1859 12.8601 10.1014 12.5283L9.55961 10.4001ZM4.99961 8.8473L4.99961 3.8001L11.6956 3.8001L13.3996 7.9377L13.3996 9.2001L9.55961 9.2001C9.37685 9.20012 9.19651 9.24189 9.03235 9.32222C8.86818 9.40255 8.72454 9.51931 8.61237 9.6636C8.5002 9.8079 8.42248 9.9759 8.38512 10.1548C8.34776 10.3337 8.35176 10.5188 8.39681 10.6959L8.93861 12.8247C8.95556 12.8911 8.94927 12.9613 8.92078 13.0236C8.89229 13.086 8.84332 13.1367 8.78201 13.1673L8.38541 13.3653L5.55941 9.3621C5.40941 9.1497 5.21741 8.9757 4.99961 8.8473ZM3.79961 8.6001L2.59961 8.6001L2.59961 3.8001L3.79961 3.8001L3.79961 8.6001Z" fill="#A4A4A4"/>
    </svg>
  );
}

/* ─── spending segment data ─── */
const SPENDING_SEGMENTS = [
  { name: "Food",      color: "#FA7319", value: 1755.08 },
  { name: "Transport", color: "#1FC16B", value: 1170.05 },
  { name: "Utilities", color: "#47C2FF", value: 1170.05 },
  { name: "Shopping",  color: "#335CFF", value: 1755.08 },
  { name: "Others",    color: "#D1D5DB", value: 390.02  },
];

/* ─── deep dive data ─── */
const CATEGORY_DAILY: Record<string, number[]> = {
  Food:      [45, 78, 32, 65, 105, 52, 42, 72, 58, 35, 88, 55, 45, 115, 62, 40, 82, 50, 70, 38, 108, 65, 42, 78, 50, 68, 28, 58, 38, 15],
  Transport: [32, 48, 38, 52, 40, 35, 48, 42, 36, 50, 38, 44, 40, 35, 42, 38, 52, 44, 38, 40, 46, 38, 34, 40, 36, 42, 38, 36, 40, 28],
  Utilities: [0, 0, 0, 0, 0, 0, 350, 0, 0, 0, 0, 0, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 420, 0, 0],
  Shopping:  [0, 0, 285, 0, 0, 420, 0, 0, 0, 310, 0, 0, 0, 280, 0, 0, 0, 0, 210, 0, 0, 250, 0, 0, 0, 0, 0, 0, 0, 0],
  Others:    [12, 8, 15, 22, 10, 18, 12, 0, 25, 10, 14, 18, 8, 12, 22, 15, 10, 8, 12, 18, 14, 22, 10, 15, 8, 12, 18, 10, 15, 8],
};

const CATEGORY_TRANSACTIONS: Record<string, { merchant: string; date: string; amount: number; sub: string }[]> = {
  Food: [
    { merchant: "Noon Food",    date: "May 14", amount: 67.80,  sub: "Food Delivery" },
    { merchant: "Starbucks",    date: "May 13", amount: 32.00,  sub: "Coffee"        },
    { merchant: "Careem Food",  date: "May 12", amount: 88.50,  sub: "Food Delivery" },
    { merchant: "McDonald's",   date: "May 11", amount: 45.00,  sub: "Dining"        },
    { merchant: "Talabat",      date: "May 10", amount: 78.90,  sub: "Food Delivery" },
    { merchant: "Noon Food",    date: "May 08", amount: 95.20,  sub: "Food Delivery" },
    { merchant: "KFC",          date: "May 07", amount: 38.50,  sub: "Dining"        },
    { merchant: "Careem Food",  date: "May 06", amount: 52.00,  sub: "Food Delivery" },
    { merchant: "Starbucks",    date: "May 05", amount: 28.00,  sub: "Coffee"        },
    { merchant: "Pizza Hut",    date: "May 04", amount: 52.00,  sub: "Dining"        },
    { merchant: "Talabat",      date: "May 02", amount: 62.40,  sub: "Food Delivery" },
    { merchant: "Noon Food",    date: "May 01", amount: 74.00,  sub: "Food Delivery" },
    { merchant: "Starbucks",    date: "Apr 29", amount: 35.50,  sub: "Coffee"        },
    { merchant: "McDonald's",   date: "Apr 27", amount: 41.00,  sub: "Dining"        },
    { merchant: "Careem Food",  date: "Apr 25", amount: 91.00,  sub: "Food Delivery" },
    { merchant: "KFC",          date: "Apr 23", amount: 44.50,  sub: "Dining"        },
    { merchant: "Talabat",      date: "Apr 21", amount: 58.80,  sub: "Food Delivery" },
    { merchant: "Starbucks",    date: "Apr 18", amount: 29.00,  sub: "Coffee"        },
    { merchant: "Noon Food",    date: "Apr 15", amount: 83.60,  sub: "Food Delivery" },
    { merchant: "Pizza Hut",    date: "Apr 12", amount: 48.00,  sub: "Dining"        },
  ],
  Transport: [
    { merchant: "Careem",       date: "May 14", amount: 42.00,  sub: "Ride"    },
    { merchant: "ADNOC",        date: "May 13", amount: 128.00, sub: "Fuel"    },
    { merchant: "Uber",         date: "May 12", amount: 38.00,  sub: "Ride"    },
    { merchant: "Dubai Metro",  date: "May 11", amount: 15.50,  sub: "Transit" },
    { merchant: "Salik",        date: "May 10", amount: 24.00,  sub: "Toll"    },
    { merchant: "Careem",       date: "May 09", amount: 55.00,  sub: "Ride"    },
    { merchant: "ADNOC",        date: "May 08", amount: 118.00, sub: "Fuel"    },
    { merchant: "Bolt",         date: "May 07", amount: 32.00,  sub: "Ride"    },
    { merchant: "RTA Bus",      date: "May 06", amount: 8.50,   sub: "Transit" },
    { merchant: "Careem",       date: "May 05", amount: 46.00,  sub: "Ride"    },
    { merchant: "ADNOC",        date: "May 03", amount: 120.00, sub: "Fuel"    },
    { merchant: "Uber",         date: "May 02", amount: 40.00,  sub: "Ride"    },
    { merchant: "Salik",        date: "May 01", amount: 36.00,  sub: "Toll"    },
    { merchant: "Dubai Metro",  date: "Apr 29", amount: 18.00,  sub: "Transit" },
    { merchant: "Careem",       date: "Apr 27", amount: 52.00,  sub: "Ride"    },
    { merchant: "ADNOC",        date: "Apr 25", amount: 105.00, sub: "Fuel"    },
    { merchant: "Uber",         date: "Apr 23", amount: 44.00,  sub: "Ride"    },
    { merchant: "Bolt",         date: "Apr 21", amount: 35.00,  sub: "Ride"    },
    { merchant: "Careem",       date: "Apr 19", amount: 48.00,  sub: "Ride"    },
    { merchant: "ADNOC",        date: "Apr 17", amount: 165.05, sub: "Fuel"    },
  ],
  Utilities: [
    { merchant: "DEWA",         date: "May 14", amount: 350.00, sub: "Electricity" },
    { merchant: "Etisalat",     date: "May 12", amount: 199.00, sub: "Internet"    },
    { merchant: "Du",           date: "May 10", amount: 149.00, sub: "Mobile"      },
    { merchant: "ADDC",         date: "May 07", amount: 120.05, sub: "Water"       },
    { merchant: "Empower",      date: "May 05", amount: 95.00,  sub: "Cooling"     },
    { merchant: "Etisalat",     date: "May 03", amount: 49.00,  sub: "TV"          },
    { merchant: "Du",           date: "May 01", amount: 29.00,  sub: "Roaming"     },
    { merchant: "DEWA",         date: "Apr 28", amount: 55.00,  sub: "Electricity" },
    { merchant: "RTA",          date: "Apr 22", amount: 25.00,  sub: "Permit"      },
    { merchant: "Empower",      date: "Apr 18", amount: 40.00,  sub: "Cooling"     },
    { merchant: "Du",           date: "Apr 15", amount: 25.00,  sub: "Mobile"      },
    { merchant: "Etisalat",     date: "Apr 10", amount: 34.00,  sub: "Internet"    },
  ],
  Shopping: [
    { merchant: "Zara",              date: "May 14", amount: 285.00, sub: "Clothing" },
    { merchant: "H&M",               date: "May 12", amount: 175.00, sub: "Clothing" },
    { merchant: "H&M",               date: "May 11", amount: 145.00, sub: "Kids"     },
    { merchant: "Adidas",            date: "May 10", amount: 100.00, sub: "Footwear" },
    { merchant: "Amazon",            date: "May 09", amount: 145.00, sub: "Online"   },
    { merchant: "Noon",              date: "May 07", amount: 88.00,  sub: "Online"   },
    { merchant: "Amazon",            date: "May 05", amount: 42.00,  sub: "Online"   },
    { merchant: "Marks & Spencer",   date: "May 04", amount: 35.00,  sub: "Clothing" },
    { merchant: "IKEA",              date: "May 03", amount: 120.00, sub: "Home"     },
    { merchant: "Home Centre",       date: "May 01", amount: 55.00,  sub: "Home"     },
    { merchant: "Bath & Body Works", date: "Apr 29", amount: 58.00,  sub: "Beauty"   },
    { merchant: "LuLu Hypermarket",  date: "Apr 27", amount: 47.00,  sub: "Grocery"  },
    { merchant: "Namshi",            date: "Apr 25", amount: 120.00, sub: "Online"   },
    { merchant: "Sephora",           date: "Apr 22", amount: 90.00,  sub: "Beauty"   },
    { merchant: "Centrepoint",       date: "Apr 19", amount: 250.08, sub: "Clothing" },
  ],
  Others: [
    { merchant: "Gym Membership",  date: "May 14", amount: 100.00, sub: "Fitness"    },
    { merchant: "Personal Trainer", date: "May 12", amount: 20.00,  sub: "Fitness"   },
    { merchant: "Netflix",         date: "May 10", amount: 45.00,  sub: "Streaming"  },
    { merchant: "Pharmacy",        date: "May 09", amount: 25.00,  sub: "Health"     },
    { merchant: "Haircut",         date: "May 07", amount: 55.00,  sub: "Grooming"   },
    { merchant: "Dry Cleaning",    date: "May 05", amount: 40.00,  sub: "Laundry"    },
    { merchant: "Spotify",         date: "May 03", amount: 19.00,  sub: "Streaming"  },
    { merchant: "Pharmacy",        date: "May 01", amount: 22.02,  sub: "Health"     },
    { merchant: "Amazon Prime",    date: "Apr 28", amount: 15.00,  sub: "Streaming"  },
    { merchant: "Barber",          date: "Apr 25", amount: 16.00,  sub: "Grooming"   },
    { merchant: "Apple iCloud",    date: "Apr 22", amount: 12.00,  sub: "Storage"    },
    { merchant: "Nail Salon",      date: "Apr 19", amount: 21.00,  sub: "Beauty"     },
  ],
};

// Weekly spend (Mon May11–Sun May17): [Food, Transport, Utilities, Shopping, Others]
const WEEK_DATA: number[][] = [
  [94, 41,   0,   0, 18],
  [62, 38,   0, 188, 14],
  [88, 44,   0,   0, 32],
  [34, 39, 270,   0, 15],
  [76, 37,   0, 228, 10],
  [52, 41,   0,   0, 28],
  [22, 29,   0, 128, 10],
];
const WEEK_CATS = [
  { name: "Food",      color: "#FA7319" },
  { name: "Transport", color: "#1FC16B" },
  { name: "Utilities", color: "#47C2FF" },
  { name: "Shopping",  color: "#335CFF" },
  { name: "Others",    color: "#D1D5DB" },
];
const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const CATEGORY_INSIGHTS: Record<string, string> = {
  Food:      "You spent AED 519 on food delivery this month, up 18% from April. That's 30% of your food budget.",
  Transport: "Most transport spend is fuel. Your ride-hailing use is steady — consolidating trips could save you around AED 150/month.",
  Utilities: "Utilities are consistent and within a healthy range. Your DEWA bill is 12% lower than the previous month — keep it up.",
  Shopping:  "Shopping spend is higher than last month. Three large clothing purchases account for 55% of this category.",
  Others:    "Subscriptions and personal care are stable. No unusual spikes detected this month.",
};

function scale(arr: number[], target: number): number[] {
  const sum = arr.reduce((s, v) => s + v, 0) || 1;
  const f = target / sum;
  return arr.map(v => v * f);
}

function getChartData(cat: string, tab: string): number[] {
  const seg = SPENDING_SEGMENTS.find(s => s.name === cat);
  const monthly = seg?.value ?? 1000;
  const base = CATEGORY_DAILY[cat] ?? CATEGORY_DAILY.Food;

  if (tab === "1M") return scale(base, monthly);

  if (tab === "1W") {
    const week = base.slice(-7);
    return scale(week, monthly / 4.33);
  }

  if (tab === "1D") {
    // 24-hour spending pattern — peaks at lunch + evening
    const pattern = [0.1, 0.05, 0.02, 0.02, 0.05, 0.15, 0.4, 0.7, 1.0, 0.75, 0.6, 0.9,
                     1.2, 0.85, 0.5, 0.4, 0.55, 0.95, 1.3, 1.1, 0.8, 0.6, 0.35, 0.15];
    return scale(pattern, monthly / 30);
  }

  if (tab === "3M") {
    // 91 daily points: Mar + Apr + May, each month slightly different
    const mar = base.map(v => v * 0.78);
    const apr = base.map(v => v * 0.88);
    const may = base;
    return scale([...mar, ...apr, ...may], monthly * 2.66); // realistic 3-month total
  }

  if (tab === "1Y") {
    // 12 monthly points (Jun '25 – May '26), current month is the reference
    const pattern = [0.80, 0.76, 0.83, 0.87, 0.85, 0.92, 0.89, 0.84, 0.91, 0.96, 0.98, 1.0];
    return scale(pattern, monthly * 10.61); // sum of pattern ≈ 10.61 → 12-month realistic total
  }

  return base;
}

function getXAxisLabels(tab: Tab): string[] {
  // 4 labels for gridlines at x ≈ 8.7%, 36.1%, 63.6%, 91.3% of chart width
  switch (tab) {
    case "1D": return ["06:00", "09:00", "15:00", "21:00"];
    case "1W": return ["Mon", "Tue", "Thu", "Sat"];
    case "1M": return ["May 3", "May 11", "May 19", "May 27"];
    case "3M": return ["Mar 9", "Apr 2", "Apr 28", "May 23"];
    case "1Y": return ["Jul '25", "Oct '25", "Jan '26", "Apr '26"];
  }
}

/* ─── svg arc helpers ─── */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function annularArc(cx: number, cy: number, r: number, sw: number, a0: number, a1: number) {
  const oR = r + sw / 2, iR = r - sw / 2, lg = a1 - a0 > 180 ? 1 : 0;
  const os = polar(cx, cy, oR, a0), oe = polar(cx, cy, oR, a1);
  const is_ = polar(cx, cy, iR, a0), ie = polar(cx, cy, iR, a1);
  return `M${os.x} ${os.y} A${oR} ${oR} 0 ${lg} 1 ${oe.x} ${oe.y} L${ie.x} ${ie.y} A${iR} ${iR} 0 ${lg} 0 ${is_.x} ${is_.y}Z`;
}

/* ─── legend tooltip ─── */
function LegendTooltip({ label }: { label: string }) {
  return (
    <div style={{ pointerEvents: "none" }}>
      <div style={{
        paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2,
        background: "white",
        boxShadow: "0px 1px 2px rgba(14,18,27,0.06), 0px 4px 12px rgba(14,18,27,0.1)",
        border: "1px solid #F4F4F4",
        borderRadius: 4, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
        <span style={{ color: "#171717", fontSize: 12, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 400, lineHeight: "16px" }}>{label}</span>
      </div>
    </div>
  );
}

/* ─── donut tooltip ─── */
function DonutTooltip({ label }: { label: string }) {
  return (
    <div style={{
      paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2,
      background: "white",
      boxShadow: "0px 1px 2px rgba(14,18,27,0.06), 0px 4px 12px rgba(14,18,27,0.1)",
      border: "1px solid #F4F4F4",
      borderRadius: 4, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap",
      pointerEvents: "none" }}>
      <span style={{ color: "#171717", fontSize: 12, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 400, lineHeight: "16px" }}>{label}</span>
    </div>
  );
}

/* ─── follow up button ─── */
function FollowUpButton({ onClick }: { onClick: () => void }) {
  return (
    <div onClick={e => { e.stopPropagation(); onClick(); }} style={{
      paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4,
      background: "white", boxShadow: "0px 1px 2px rgba(10,13,20,0.03)",
      borderRadius: 8, outline: "1px solid #F4F4F4", outlineOffset: "-1px",
      display: "inline-flex", alignItems: "center", gap: 2, cursor: "pointer" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5.5 3.5L2 7L5.5 10.5V8.5C9 8.5 11.5 9.5 13 12.5C13 8 11 4.5 5.5 5V3.5Z" fill="#5C5C5C"/>
      </svg>
      <span style={{ paddingLeft: 2, paddingRight: 2, color: "#5C5C5C", fontSize: 12, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 500, lineHeight: "16px" }}>Follow up</span>
    </div>
  );
}

/* ─── category icon ─── */
const CAT_CONFIG: Record<string, { bg: string; iconColor: string; path: string }> = {
  Food:     { bg: "#FFF3EB", iconColor: "#FA7319", path: "M12.5625 1.875V13.125H11.4375V9.1875H9.1875V5.25C9.1875 4.35489 9.54308 3.49645 10.176 2.86351C10.8089 2.23058 11.6674 1.875 12.5625 1.875ZM11.4375 3.29813C10.9706 3.5625 10.3125 4.22062 10.3125 5.25V8.0625H11.4375V3.29813ZM5.8125 8.56875V13.125H4.6875V8.56875C4.05233 8.43888 3.4815 8.09365 3.07152 7.59143C2.66154 7.0892 2.43758 6.46081 2.4375 5.8125V2.4375H3.5625V6.375H4.6875V2.4375H5.8125V6.375H6.9375V2.4375H8.0625V5.8125C8.06242 6.46081 7.83846 7.0892 7.42848 7.59143C7.0185 8.09365 6.44767 8.43888 5.8125 8.56875Z" },
  Transport:{ bg: "#E3F7EC", iconColor: "#1FC16B", path: "M11.4375 12H3.5625V12.5625C3.5625 12.7117 3.50324 12.8548 3.39775 12.9602C3.29226 13.0657 3.14918 13.125 3 13.125H2.4375C2.28832 13.125 2.14524 13.0657 2.03975 12.9602C1.93426 12.8548 1.875 12.7117 1.875 12.5625V8.34375L1.17581 8.16938C1.05417 8.1389 0.946205 8.06866 0.869056 7.96981C0.791907 7.87095 0.750003 7.74915 0.75 7.62375V7.21875C0.75 7.14416 0.779632 7.07262 0.832376 7.01988C0.885121 6.96713 0.956658 6.9375 1.03125 6.9375H1.875L3.27 3.68175C3.35681 3.47925 3.50116 3.3067 3.68516 3.1855C3.86915 3.06431 4.08468 2.9998 4.305 3H10.695C10.9151 3.00002 11.1304 3.06463 11.3142 3.18581C11.498 3.30699 11.6421 3.47943 11.7289 3.68175L13.125 6.9375H13.9688C14.0433 6.9375 14.1149 6.96713 14.1676 7.01988C14.2204 7.07262 14.25 7.14416 14.25 7.21875V7.62375C14.25 7.74915 14.2081 7.87095 14.1309 7.96981C14.0538 8.06866 13.9458 8.1389 13.8242 8.16938L13.125 8.34375V12.5625C13.125 12.7117 13.0657 12.8548 12.9602 12.9602C12.8548 13.0657 12.7117 13.125 12.5625 13.125H12C11.8508 13.125 11.7077 13.0657 11.6023 12.9602C11.4968 12.8548 11.4375 12.7117 11.4375 12.5625V12ZM12 10.875V8.0625H3V10.875H12ZM3.83081 6.9375H11.1692L10.875 4.125H4.125L3.83081 6.9375ZM3.5625 8.625V9.75H5.95031C5.74444 9.04969 4.86581 8.625 3.5625 8.625ZM11.4375 8.625C10.1336 8.625 9.255 9.04913 8.80219 9.8985L10.875 9.8985V9.75C11.4375 9.75 11.4375 9.89918 11.4375 9.75V8.625Z" },
  Utilities:{ bg: "#EBF8FF", iconColor: "#47C2FF", path: "M12 13.125H3C2.85082 13.125 2.70774 13.0657 2.60225 12.9602C2.49676 12.8548 2.4375 12.7117 2.4375 12.5625V2.4375C2.4375 2.28832 2.49676 2.14524 2.60225 2.03975C2.70774 1.93426 2.85082 1.875 3 1.875H12C12.1492 1.875 12.2923 1.93426 12.3977 2.03975C12.5032 2.14524 12.5625 2.28832 12.5625 2.4375V12.5625C12.5625 12.7117 12.5032 12.8548 12.3977 12.9602C12.2923 13.0657 12.1492 13.125 12 13.125ZM11.4375 12V3H3.5625V12H11.4375ZM5.25 4.6875H9.75V5.8125H5.25V4.6875ZM5.25 6.9375H9.75V8.0625H5.25V6.9375ZM5.25 9.1875H9.75V10.3125H5.25V9.1875Z" },
  Shopping: { bg: "#EBF1FF", iconColor: "#335CFF", path: "M4.40625 1.875H10.5938C10.6811 1.875 10.7672 1.89533 10.8453 1.93438C10.9234 1.97344 10.9914 2.03014 11.0437 2.1L12.5625 4.125V12.5625C12.5625 12.7117 12.5032 12.8548 12.3977 12.9602C12.2923 13.0657 12.1492 13.125 12 13.125H3C2.85082 13.125 2.70774 13.0657 2.60225 12.9602C2.49676 12.8548 2.4375 12.7117 2.4375 12.5625V4.125L3.95625 2.1C4.00865 2.03014 4.07659 1.97344 4.15469 1.93438C4.2328 1.89533 4.31892 1.875 4.40625 1.875ZM11.4375 5.25H3.5625V12H11.4375V5.25ZM11.1562 4.125L10.3125 3H4.6875L3.84375 4.125H11.1562ZM5.8125 6.375V7.5C5.8125 7.94755 5.99029 8.37678 6.30676 8.69324C6.62322 9.00971 7.05245 9.1875 7.5 9.1875C7.94755 9.1875 8.37678 9.00971 8.69324 8.69324C9.00971 8.37678 9.1875 7.94755 9.1875 7.5V6.375H10.3125V7.5C10.3125 8.24592 10.0162 8.96129 9.48874 9.48874C8.96129 10.0162 8.24592 10.3125 7.5 10.3125C6.75408 10.3125 6.03871 10.0162 5.51126 9.48874C4.98382 8.96129 4.6875 8.24592 4.6875 7.5V6.375H5.8125Z" },
  Others:   { bg: "#FBFBFB",  iconColor: "#5C5C5C", path: "M7.5 13.125C4.39331 13.125 1.875 10.6067 1.875 7.5C1.875 4.39331 4.39331 1.875 7.5 1.875C10.6067 1.875 13.125 4.39331 13.125 7.5C13.125 10.6067 10.6067 13.125 7.5 13.125ZM7.5 12C8.69347 12 9.83807 11.5259 10.682 10.682C11.5259 9.83807 12 8.69347 12 7.5C12 6.30653 11.5259 5.16193 10.682 4.31802C9.83807 3.47411 8.69347 3 7.5 3C6.30653 3 5.16193 3.47411 4.31802 4.31802C3.47411 5.16193 3 6.30653 3 7.5C3 8.69347 3.47411 9.83807 4.31802 10.682C5.16193 11.5259 6.30653 12 7.5 12ZM5.53125 8.625H8.625C8.69959 8.625 8.77113 8.59537 8.82387 8.54262C8.87662 8.48988 8.90625 8.41834 8.90625 8.34375C8.90625 8.26916 8.87662 8.19762 8.82387 8.14488C8.77113 8.09213 8.69959 8.0625 8.625 8.0625H6.375C6.00204 8.0625 5.64435 7.91434 5.38063 7.65062C5.11691 7.3869 4.96875 7.02921 4.96875 6.65625C4.96875 6.28329 5.11691 5.9256 5.38063 5.66188C5.64435 5.39816 6.00204 5.25 6.375 5.25H6.9375V4.125H8.0625V5.25H9.46875V6.375H6.375C6.30041 6.375 6.22887 6.40463 6.17613 6.45738C6.12338 6.51012 6.09375 6.58166 6.09375 6.65625C6.09375 6.73084 6.12338 6.80238 6.17613 6.85512C6.22887 6.90787 6.30041 6.9375 6.375 6.9375H8.625C8.99796 6.9375 9.35565 7.08566 9.61937 7.34938C9.88309 7.6131 10.0312 7.97079 10.0312 8.34375C10.0312 8.71671 9.88309 9.0744 9.61937 9.33812C9.35565 9.60184 8.99796 9.75 8.625 9.75H8.0625V10.875H6.9375V9.75H5.53125V8.625Z" },
};

function CatIcon({ type, size = 15 }: { type: string; size?: number }) {
  const cfg = CAT_CONFIG[type] ?? CAT_CONFIG.Others;
  const pad = size * 0.3;
  return (
    <div style={{ padding: pad, backgroundColor: cfg.bg, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
        <path d={cfg.path} fill={cfg.iconColor} />
      </svg>
    </div>
  );
}

/* ─── line chart ─── */
function LineChart({ data, color, width = 288, height = 80 }: { data: number[]; color: string; width?: number; height?: number }) {
  const n = data.length;
  if (n < 2) return null;
  const maxV = Math.max(...data) || 1;
  const padX = 2, padY = 4;
  const xs = data.map((_, i) => padX + (i / (n - 1)) * (width - padX * 2));
  const ys = data.map(v => height - padY - (v / maxV) * (height - padY * 2));
  const linePts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const fillPts = `${xs[0].toFixed(1)},${height} ` + linePts + ` ${xs[n - 1].toFixed(1)},${height}`;
  const gradId = `cg-${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${gradId})`} />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── deep dive panel ─── */
const TABS = ["1D", "1W", "1M", "3M", "1Y"] as const;
type Tab = typeof TABS[number];

const CATEGORY_BADGES: Record<string, string> = {
  Food:      "+8% than last month",
  Transport: "+5% than last month",
  Utilities: "+3% than last month",
  Shopping:  "+22% than last month",
  Others:    "-4% than last month",
};

const MERCHANT_COLORS: Record<string, string> = {
  "Talabat": "#FF5A00",
  "Pizza Hut": "#EE3224",
  "ADNOC": "#009A44",
  "Uber": "#000000",
  "Dubai Metro": "#006DB7",
  "DEWA": "#007C3E",
  "Etisalat": "#009C44",
  "ADDC": "#005BAA",
  "Zara": "#000000",
  "H&M": "#E50010",
  "Amazon": "#FF9900",
  "IKEA": "#0058A3",
  "Namshi": "#7B2D8B",
  "Centrepoint": "#C8102E",
  "Netflix": "#E50914",
  "Gym Membership": "#333333",
  "Salik": "#E31E24",
  "Bolt": "#34D186",
  "RTA Bus": "#006DB7",
  "RTA": "#006DB7",
  "Du": "#CF202E",
  "Empower": "#005DA6",
  "Adidas": "#000000",
  "Noon": "#FEEE00",
  "Marks & Spencer": "#006B38",
  "Home Centre": "#E31837",
  "Bath & Body Works": "#C8102E",
  "LuLu Hypermarket": "#E31837",
  "Sephora": "#000000",
  "Spotify": "#1DB954",
  "Amazon Prime": "#00A8E0",
  "Apple iCloud": "#555555",
  "Barber": "#2C2C2C",
  "Dry Cleaning": "#4A7C9E",
  "Nail Salon": "#D4508C",
  "Personal Trainer": "#E85D04",
  "Haircut": "#2C2C2C",
  "Pharmacy": "#1E7D32",
  "Careem": "#00B14F",
  "Careem Food": "#00B14F",
  "Noon Food": "#FEEE00",
  "Starbucks": "#00704A",
  "McDonald's": "#FFC72C",
  "KFC": "#E4002B",
};

/* circle wrapper shared by all logos */
function LogoCircle({ bg = "white", border = false, children }: { bg?: string; border?: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 999, flexShrink: 0,
      backgroundColor: bg,
      outline: border ? "1px solid #F4F4F4" : "none",
      outlineOffset: -1,
      overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
  );
}

function MerchantLogo({ merchant }: { merchant: string }) {
  /* ── Starbucks ── full PNG fills the circle */
  if (merchant === "Starbucks") return (
    <LogoCircle>
      <img src="/logos/starbucks.png" alt="Starbucks" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </LogoCircle>
  );

  /* ── McDonald's ── SVG has its own dark-green bg */
  if (merchant === "McDonald's") return (
    <LogoCircle>
      <img src="/logos/mcdonalds.svg" alt="McDonald's" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </LogoCircle>
  );

  /* ── KFC ── white bg, SVG contained */
  if (merchant === "KFC") return (
    <LogoCircle bg="white" border>
      <img src="/logos/kfc.svg" alt="KFC" style={{ width: 22, height: 22, objectFit: "contain" }} />
    </LogoCircle>
  );

  /* ── Noon / Noon Food ── pre-made 32x32 SVG */
  if (merchant === "Noon" || merchant === "Noon Food") return (
    <img src="/logos/noon.svg" alt="Noon" style={{ width: 32, height: 32, flexShrink: 0 }} />
  );

  /* ── Careem / Careem Food ── pre-made 32x32 SVG */
  if (merchant === "Careem" || merchant === "Careem Food") return (
    <img src="/logos/careem.svg" alt="Careem" style={{ width: 32, height: 32, flexShrink: 0 }} />
  );

  /* ── Talabat ── pre-made 32x32 SVG */
  if (merchant === "Talabat") return (
    <img src="/logos/talabat.svg" alt="Talabat" style={{ width: 32, height: 32, flexShrink: 0 }} />
  );

  /* ── generic fallback: brand color + initial ── */
  const bg = MERCHANT_COLORS[merchant] ?? "#8A8A8A";
  return (
    <LogoCircle bg={bg}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "white", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: 1 }}>
        {merchant[0].toUpperCase()}
      </span>
    </LogoCircle>
  );
}

function polylineLength(pts: string): number {
  const points = pts.trim().split(" ").map(pt => {
    const [x, y] = pt.split(",").map(Number);
    return { x, y };
  });
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.ceil(len) + 4; // +4 buffer so dashoffset fully hides the line at start
}

function DeepDivePanel({ cat, onClose, onCatChange, loading = false, isJuneFlow = false }: { cat: string; onClose: () => void; onCatChange: (c: string) => void; loading?: boolean; isJuneFlow?: boolean }) {
  const [tab, setTab] = useState<Tab>("1M");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [edgeBtn, setEdgeBtn] = useState<{ midY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Always show overlay on mount; re-activate if loading turns true while panel stays open
  const [overlayActive, setOverlayActive] = useState(true);
  useEffect(() => {
    if (loading) setOverlayActive(true);
  }, [loading]);

  const seg = SPENDING_SEGMENTS.find(s => s.name === cat)!;
  const color = seg?.color ?? "#FA7319";
  const cfg = CAT_CONFIG[cat] ?? CAT_CONFIG.Others;
  const chartData = getChartData(cat, tab);
  const rawTransactions = CATEGORY_TRANSACTIONS[cat] ?? [];
  const transactions = isJuneFlow
    ? rawTransactions.map(t => ({ ...t, date: t.date.replace("May", "Jun") }))
    : rawTransactions;
  const rawInsight = CATEGORY_INSIGHTS[cat] ?? "";
  const insight = isJuneFlow ? rawInsight.replace("April", "May") : rawInsight;

  const n = chartData.length;
  const maxV = Math.max(...chartData) || 1;
  const tabTotal = chartData.reduce((s, v) => s + v, 0);
  const badge = CATEGORY_BADGES[cat] ?? "+8% than last month";

  // Animated total counter — restarts whenever tab or cat changes
  const [displayTotal, setDisplayTotal] = useState(0);
  useEffect(() => {
    let raf: number;
    const target = tabTotal;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 500);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayTotal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tabTotal]);
  const totalFormatted = `AED ${displayTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Chart layout constants (panel 400px - 32px side padding = 368px content)
  const CW = 368, CH = 108, CT = 10, CAH = 88; // width, height, top offset, chart area height
  const xs = chartData.map((_, i) => (i / Math.max(n - 1, 1)) * CW);
  const ys = chartData.map(v => CT + CAH - (v / maxV) * CAH);
  const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");

  // Tooltip date formatting
  const tooltipDate = (() => {
    if (hoveredIdx === null) return "";
    if (tab === "1D") return `${String(hoveredIdx).padStart(2, "0")}:00, ${isJuneFlow ? "Jun" : "May"} 17`;
    if (tab === "1W") {
      const d = new Date(2026, isJuneFlow ? 5 : 4, 11 + hoveredIdx);
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }
    if (tab === "1M") {
      const d = new Date(2026, isJuneFlow ? 5 : 4, hoveredIdx + 1);
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }
    if (tab === "3M") {
      const d = new Date(2026, isJuneFlow ? 3 : 2, 1 + hoveredIdx); // May flow: Mar 1; June flow: Apr 1
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    if (tab === "1Y") {
      const months = ["Jun '25","Jul '25","Aug '25","Sep '25","Oct '25","Nov '25","Dec '25","Jan '26","Feb '26","Mar '26","Apr '26","May '26"];
      return months[Math.min(hoveredIdx, 11)];
    }
    return `Period ${hoveredIdx + 1}`;
  })();

  const dotX = hoveredIdx !== null ? xs[hoveredIdx] : null;
  const dotY = hoveredIdx !== null ? ys[hoveredIdx] : null;
  const dotVal = hoveredIdx !== null ? chartData[hoveredIdx] : null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(8px); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes panelExpand {
          from { width: 0px; }
          to   { width: 416px; }
        }
        @keyframes flickerOverlayFade {
          0%   { opacity: 1; }
          91%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes shimmerSlide {
          0%   { transform: translateX(-160px) rotate(-18deg); }
          100% { transform: translateX(560px)  rotate(-18deg); }
        }
        @keyframes deepDiveLineIn {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      <div ref={panelRef} style={{
        width: 416, flexShrink: 0,
        height: "100%",
        backgroundColor: "transparent",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        padding: 8,
        animation: "slideInRight 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        {/* edge follow-up button — position:fixed escapes all overflow clipping */}
        {edgeBtn && panelRef.current && (
          <div
            style={{
              position: "fixed",
              left: panelRef.current.getBoundingClientRect().left,
              top: edgeBtn.midY,
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              width: 28, height: 28,
              backgroundColor: "white", borderRadius: 8,
              outline: "1px solid #F4F4F4", outlineOffset: -1,
              boxShadow: "0px 1px 2px rgba(10,13,20,0.06), 0px 4px 8px rgba(10,13,20,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M5.5 3.5L2 7L5.5 10.5V8.5C9 8.5 11.5 9.5 13 12.5C13 8 11 4.5 5.5 5V3.5Z" fill="#5C5C5C"/>
            </svg>
          </div>
        )}
        {/* visual card */}
        <div style={{
          flex: 1, minHeight: 0,
          backgroundColor: "white",
          borderRadius: 20,
          boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
          outline: "1px solid var(--stroke-soft-200, #F4F4F4)",
          outlineOffset: -1,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          position: "relative" }}>
        {/* FlickeringGrid overlay — full-panel, no shape, subtle flicker then fades out */}
        {overlayActive && (
          <div
            onAnimationEnd={() => setOverlayActive(false)}
            style={{
              position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none",
              backgroundColor: "white",
              animation: "flickerOverlayFade 3.35s linear forwards",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)" }}
          >
            <FlickeringGrid
              color="#4E29DD"
              maxOpacity={0.5}
              flickerChance={7.5}
              squareSize={2}
              gridGap={2}
            />
            {/* Diagonal shimmer bar — very slow, ~12% opacity */}
            <div style={{
              position: "absolute",
              top: "-50%",
              left: 0,
              width: 90,
              height: "200%",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12) 50%, transparent)",
              animation: "shimmerSlide 12s linear infinite",
              pointerEvents: "none" }} />
          </div>
        )}
        {/* content — opacity:0 while overlay is active so it never bleeds through the fade */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", opacity: overlayActive ? 0 : 1 }}>
        {/* header */}
        <div style={{
          flexShrink: 0,
          paddingLeft: 16, paddingRight: 16, paddingTop: 24, paddingBottom: 24,
          display: "flex", alignItems: "center", gap: 8 }}>
          {/* left: "Deep dive on" + category dropdown pill */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong-950, #171717)", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "20px", whiteSpace: "nowrap" }}>
              Deep dive on
            </span>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 8,
                  backgroundColor: "var(--bg-white-0, white)",
                  borderRadius: 10,
                  outline: "1px solid var(--stroke-soft-200, #F4F4F4)",
                  outlineOffset: -1,
                  border: "none", cursor: "pointer" }}
              >
                <div style={{ padding: 7, backgroundColor: cfg.bg, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                    <path d={cfg.path} fill={cfg.iconColor} />
                  </svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong-950, #171717)", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "20px" }}>
                  {cat}
                </span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10.0001 10.879L13.7126 7.1665L14.7731 8.227L10.0001 13L5.22705 8.227L6.28755 7.1665L10.0001 10.879Z" fill="var(--icon-sub-600, #5C5C5C)" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  {/* backdrop to close on outside click */}
                  <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setDropdownOpen(false)} />
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
                    backgroundColor: "white",
                    borderRadius: 10,
                    outline: "1px solid var(--stroke-soft-200, #F4F4F4)",
                    outlineOffset: -1,
                    boxShadow: "0px 8px 24px rgba(14,18,27,0.08)",
                    overflow: "hidden",
                    minWidth: 200 }}>
                    {SPENDING_SEGMENTS.map(seg => {
                      const sCfg = CAT_CONFIG[seg.name] ?? CAT_CONFIG.Others;
                      const isActive = seg.name === cat;
                      return (
                        <button
                          key={seg.name}
                          onClick={() => { onCatChange(seg.name); setDropdownOpen(false); }}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 8,
                            paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12,
                            backgroundColor: isActive ? "var(--bg-weak-50, #FBFBFB)" : "transparent",
                            border: "none", cursor: "pointer" }}
                          onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-weak-50, #FBFBFB)"; }}
                          onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                        >
                          <div style={{ padding: 6, backgroundColor: sCfg.bg, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                              <path d={sCfg.path} fill={sCfg.iconColor} />
                            </svg>
                          </div>
                          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--text-strong-950, #171717)", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "20px", textAlign: "left" }}>
                            {seg.name}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-soft-400, #A3A3A3)", fontFamily: "var(--font-inter),Inter,sans-serif", whiteSpace: "nowrap" }}>
                            AED {seg.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* close button */}
          <button onClick={onClose} style={{ padding: 2, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="var(--icon-sub-600, #5C5C5C)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* inset divider — 16px gap on each side */}
        <div style={{ flexShrink: 0, marginLeft: 16, marginRight: 16, height: 1, backgroundColor: "var(--stroke-soft-200, #F4F4F4)" }} />

        {/* scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* tabs + spend + chart + insight */}
          <div
            onMouseEnter={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setEdgeBtn({ midY: r.top + r.height / 2 });
            }}
            onMouseLeave={() => setEdgeBtn(null)}
          >
          <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 20, paddingBottom: 20, display: "flex", flexDirection: "column", gap: 16, background: "var(--bg-white-0, white)" }}>

            {/* tab bar: single outlined pill, segments divided by outlines */}
            <div style={{ alignSelf: "stretch", height: 24, borderRadius: 6, outline: "1px solid var(--stroke-soft-200, #F4F4F4)", outlineOffset: -1, display: "flex", overflow: "hidden" }}>
              {TABS.map(t => (
                <button key={t} onClick={() => { setTab(t); setHoveredIdx(null); }} style={{
                  flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4,
                  border: "none", cursor: "pointer",
                  background: tab === t ? "var(--bg-weak-50, #FBFBFB)" : "var(--bg-white-0, white)",
                  color: tab === t ? "var(--text-strong-950, #171717)" : "var(--text-sub-600, #5C5C5C)",
                  fontSize: 12, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: tab === t ? 600 : 500, lineHeight: "16px",
                  outline: "1px solid var(--stroke-soft-200, #F4F4F4)", outlineOffset: "-0.5px",
                  transition: "background 0.12s, color 0.12s" }}>{t}</button>
              ))}
            </div>

            {/* total spend */}
            <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "var(--text-sub-600, #5C5C5C)", fontSize: 14, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 500, lineHeight: "20px" }}>Total Spend</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--text-strong-950, #171717)", fontSize: 24, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 500, lineHeight: "32px" }}>{totalFormatted}</span>
                <span style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, background: "var(--state-error-lighter, #FFEBEC)", borderRadius: 999, color: "var(--state-error-dark, #681219)", fontSize: 12, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 500, lineHeight: "16px", whiteSpace: "nowrap" }}>
                  {badge}
                </span>
              </div>
            </div>

            {/* chart: 108px container with grid + SVG line + hover */}
            <div style={{ alignSelf: "stretch", height: CH, position: "relative" }}>
              {/* horizontal grid lines at y = 0, 36, 72, 108 */}
              {[0, 36, 72, 108].map((y, i) => (
                <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y === 108 ? CH - 1 : y, height: 0, opacity: 0.64, outline: "1px solid var(--stroke-soft-200, #F4F4F4)", outlineOffset: "-0.5px", pointerEvents: "none" }} />
              ))}
              {/* vertical grid lines inside 32px padding, space-between */}
              {[32, 133, 234, 336].map((x, i) => (
                <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 0, opacity: 0.64, outline: "1px solid var(--stroke-soft-200, #F4F4F4)", outlineOffset: "-0.5px", pointerEvents: "none" }} />
              ))}
              {/* SVG: line + hover dot */}
              <svg
                width={CW} height={CH}
                style={{ position: "absolute", top: 0, left: 0, overflow: "visible", cursor: "crosshair" }}
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const idx = Math.max(0, Math.min(n - 1, Math.round(((e.clientX - rect.left) / CW) * (n - 1))));
                  setHoveredIdx(idx);
                }}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {(() => {
                  const lineLen = polylineLength(pts);
                  return (
                    <polyline
                      key={pts}
                      points={pts}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: lineLen,
                        strokeDashoffset: lineLen,
                        animation: "deepDiveLineIn 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" }}
                    />
                  );
                })()}
                {dotX !== null && dotY !== null && (
                  <circle cx={dotX} cy={dotY} r={6} fill={color} stroke="white" strokeWidth={2} style={{ pointerEvents: "none" }} />
                )}
              </svg>
              {/* tooltip */}
              {dotX !== null && dotY !== null && dotVal !== null && (
                <div style={{ position: "absolute", left: dotX, top: dotY - 12, transform: "translate(-50%, -100%)", pointerEvents: "none", zIndex: 30 }}>
                  <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: "var(--bg-white-0, white)", boxShadow: "0px 1px 2px rgba(14,18,27,0.03), 0px 12px 24px rgba(14,18,27,0.06)", borderRadius: 10, outline: "1px solid var(--stroke-soft-200, #F4F4F4)", outlineOffset: -1, display: "flex", flexDirection: "column", gap: 4, whiteSpace: "nowrap" }}>
                    <span style={{ color: "var(--text-soft-400, #A3A3A3)", fontSize: 12, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 500, lineHeight: "16px" }}>{tooltipDate}</span>
                    <span style={{ color: "var(--text-strong-950, #171717)", fontSize: 14, fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 500, lineHeight: "20px" }}>AED {dotVal.toFixed(2)}</span>
                  </div>
                  {/* downward caret */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid white", filter: "drop-shadow(0 1px 0 #F4F4F4)" }} />
                  </div>
                </div>
              )}
            </div>

            {/* x-axis labels */}
            {(() => {
              const baseLabels = getXAxisLabels(tab);
              const labels = isJuneFlow
                ? baseLabels.map(l => l.replace("May", "Jun"))
                : baseLabels;
              return (
                <div style={{ alignSelf: "stretch", position: "relative", height: 14, marginTop: -10 }}>
                  {[32, 133, 234, 336].map((x, i) => (
                    <span key={i} style={{
                      position: "absolute", left: x,
                      transform: "translateX(-50%)",
                      fontSize: 10, fontWeight: 400,
                      color: "var(--text-soft-400, #A3A3A3)",
                      fontFamily: "var(--font-inter),Inter,sans-serif",
                      lineHeight: "14px", whiteSpace: "nowrap" }}>{labels[i]}</span>
                  ))}
                </div>
              );
            })()}

            {/* insight card */}
            <div style={{
              alignSelf: "stretch", padding: 8,
              background: "linear-gradient(135deg, rgba(219,162,211,0.07) 21%, rgba(195,160,235,0.07) 36%, rgba(180,158,250,0.07) 45%, rgba(148,121,241,0.07) 58%, rgba(116,84,232,0.07) 69%, rgba(78,41,221,0.07) 83%, rgba(19,3,96,0.07) 97%)",
              borderRadius: 8,
              outline: "1px solid rgba(180,158,250,0.40)", outlineOffset: -1,
              display: "flex", gap: 6, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, flexShrink: 0, padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AqlMark size={16} />
              </div>
              <span style={{
                flex: 1, color: "var(--text-strong-950, #171717)", fontSize: 12,
                fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 400, lineHeight: "18px",
                overflow: "hidden" }}>
                {insight}
              </span>
            </div>

          </div>
          </div>{/* end chart hover wrapper */}

          {/* recent transactions — solid text divider header */}
          <div style={{
            paddingLeft: 20, paddingRight: 20, paddingTop: 6, paddingBottom: 6,
            marginTop: 6, marginBottom: 6,
            display: "flex", alignItems: "center",
            backgroundColor: "#FCFCFC" }}>
            <span style={{
              fontSize: 12, fontWeight: 500, color: "#A3A3A3",
              textTransform: "uppercase", lineHeight: "16px", letterSpacing: "0.48px",
              fontFamily: "var(--font-inter),Inter,sans-serif" }}>Recent Transactions</span>
          </div>

          {/* search + filter row */}
          <div style={{ paddingTop: 12, paddingBottom: 0, paddingLeft: 16, paddingRight: 16, display: "flex", alignItems: "center", gap: 8 }}>
            {/* search input */}
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              height: 32, paddingLeft: 10, paddingRight: 8,
              backgroundColor: "var(--bg-white-0, #FFFFFF)",
              boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
              borderRadius: 8,
              outline: "1px solid var(--stroke-soft-200, #F4F4F4)",
              outlineOffset: -1 }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9.25 2.5C12.976 2.5 16 5.524 16 9.25C16 12.976 12.976 16 9.25 16C5.524 16 2.5 12.976 2.5 9.25C2.5 5.524 5.524 2.5 9.25 2.5ZM9.25 14.5C12.1502 14.5 14.5 12.1502 14.5 9.25C14.5 6.349 12.1502 4 9.25 4C6.349 4 4 6.349 4 9.25C4 12.1502 6.349 14.5 9.25 14.5ZM15.6137 14.5532L17.7355 16.6742L16.6742 17.7355L14.5532 15.6137L15.6137 14.5532Z" fill="var(--icon-soft-400, #A3A3A3)" />
              </svg>
              <span style={{
                fontSize: 12, fontWeight: 400, color: "var(--text-soft-400, #A3A3A3)",
                lineHeight: "16px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>Search by merchant or amount…</span>
            </div>
            {/* filter button */}
            <button style={{
              width: 32, height: 32, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "var(--bg-white-0, #FFFFFF)",
              boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
              borderRadius: 8,
              outline: "1px solid var(--stroke-soft-200, #F4F4F4)",
              outlineOffset: -1,
              border: "none", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M8.5 14.5H11.5V13H8.5V14.5ZM3.25 5.5V7H16.75V5.5H3.25ZM5.5 10.75H14.5V9.25H5.5V10.75Z" fill="#5C5C5C" />
              </svg>
            </button>
          </div>

          {/* transaction list */}
          <div style={{ paddingTop: 12, paddingBottom: 20, display: "flex", flexDirection: "column", gap: 4 }}>
            {transactions.map((tx, i) => (
              <div
                key={i}
                onMouseEnter={e => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setEdgeBtn({ midY: r.top + r.height / 2 });
                }}
                onMouseLeave={() => setEdgeBtn(null)}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}>
                  <MerchantLogo merchant={tx.merchant} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 500, color: "var(--text-strong-950, #171717)",
                      lineHeight: "16px", fontFamily: "var(--font-inter),Inter,sans-serif",
                      display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.merchant}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 400, color: "var(--text-sub-600, #5C5C5C)",
                      lineHeight: "16px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>{tx.sub} · {tx.date}</span>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 500, color: "var(--text-strong-950, #171717)",
                    lineHeight: "16px", fontFamily: "var(--font-inter),Inter,sans-serif",
                    whiteSpace: "nowrap", flexShrink: 0 }}>
                    AED {tx.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div style={{ padding: "24px 16px", textAlign: "center" }}>
                <span style={{ fontSize: 14, color: "#A3A3A3", fontFamily: "var(--font-inter),Inter,sans-serif" }}>No transactions found</span>
              </div>
            )}
          </div>

        </div>
        </div> {/* end content wrapper */}
        </div> {/* end visual card */}
      </div>
    </>
  );
}

/* ─── donut chart ─── */
type DonutProps = {
  hoveredCat: string | null;
  hoverSource: "legend" | "donut" | null;
  onCatEnter: (cat: string) => void;
  onCatLeave: () => void;
  onCatClick: (cat: string) => void;
};
function SpendingDonut({ hoveredCat, hoverSource, onCatEnter, onCatLeave, onCatClick }: DonutProps) {
  const cx = 93, cy = 93, r = 68, sw = 18;
  const circum = 2 * Math.PI * r;
  const total = SPENDING_SEGMENTS.reduce((s, d) => s + d.value, 0);

  // Arc draw-on animation
  const [arcP, setArcP] = useState(0);
  const [spendCount, setSpendCount] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 600);
      const eased = 1 - Math.pow(1 - p, 3);
      setArcP(eased);
      setSpendCount(6240.28 * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const arcData = SPENDING_SEGMENTS.map((seg, i) => {
    const startFrac = SPENDING_SEGMENTS.slice(0, i).reduce((s, d) => s + d.value, 0) / total;
    const frac = seg.value / total;
    const midAngle = (startFrac + frac / 2) * 360;
    const midRad = midAngle * Math.PI / 180;
    const tipR = r + sw / 2 + 22;
    return {
      ...seg, frac, startFrac,
      startAngle: startFrac * 360, endAngle: (startFrac + frac) * 360,
      tipX: cx + tipR * Math.sin(midRad),
      tipY: cy - tipR * Math.cos(midRad),
    };
  });
  return (
    <div style={{ position: "relative", width: 186, height: 186, flexShrink: 0, overflow: "visible" }}>
      <svg width={186} height={186} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F4F4F4" strokeWidth={sw} />
        {arcData.map((seg, i) => (
          <path key={`hl-${i}`}
            d={annularArc(cx, cy, r, sw + 8, seg.startAngle + 0.4, seg.endAngle - 0.4)}
            fill={seg.color}
            style={{ opacity: hoveredCat === seg.name ? 0.22 : 0, transition: "opacity 0.15s ease", pointerEvents: "none" }}
          />
        ))}
        {arcData.map((seg, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={sw}
            strokeDasharray={`${Math.max(0, circum * seg.frac * arcP - 2 * Math.min(arcP, 1))} ${circum}`}
            strokeDashoffset={-(circum * seg.startFrac)} strokeLinecap="butt" />
        ))}
        {arcData.map((seg, i) => (
          <path key={`hit-${i}`}
            d={annularArc(cx, cy, r, sw, seg.startAngle + 0.4, seg.endAngle - 0.4)}
            fill="transparent" stroke="none" style={{ cursor: "pointer" }}
            onMouseEnter={() => onCatEnter(seg.name)}
            onMouseLeave={onCatLeave}
            onClick={() => onCatClick(seg.name)}
          />
        ))}
      </svg>
      {hoverSource === "donut" && arcData.map((seg) =>
        hoveredCat === seg.name ? (
          <div key={seg.name} style={{
            position: "absolute", left: seg.tipX, top: seg.tipY,
            transform: "translate(-50%, -50%)", zIndex: 20, pointerEvents: "none" }}>
            <DonutTooltip label={`Deep dive on ${seg.name}`} />
          </div>
        ) : null
      )}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, pointerEvents: "none" }}>
        <span style={{ fontSize: 9, fontWeight: 500, color: "#5C5C5C", letterSpacing: "0.36px", textTransform: "uppercase", fontFamily: "var(--font-inter),Inter,sans-serif" }}>SPEND</span>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#171717", lineHeight: "24px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>AED {spendCount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

/* ─── spending summary widget ─── */
function SpendingWidget({ onDeepDive, onFollowUp }: { onDeepDive: (cat: string) => void; onFollowUp?: () => void }) {
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hoverSource, setHoverSource] = useState<"legend" | "donut" | null>(null);
  const [widgetHovered, setWidgetHovered] = useState(false);

  const handleCatEnter = (cat: string, src: "legend" | "donut") => { setHoveredCat(cat); setHoverSource(src); };
  const handleCatLeave = () => { setHoveredCat(null); setHoverSource(null); };

  const col1 = [
    { type: "Food",      amount: "AED 1,755.08" },
    { type: "Utilities", amount: "AED 1,170.05" },
    { type: "Shopping",  amount: "AED 1,755.08" },
  ];
  const col2 = [
    { type: "Transport", amount: "AED 1,170.05" },
    { type: "Others",    amount: "AED 390.02"   },
  ];

  const renderCol = (items: { type: string; amount: string }[]) => (
    <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
      {items.map((cat) => (
        <div key={cat.type}
          style={{ position: "relative", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "center", gap: 9, padding: 4, borderRadius: 6, backgroundColor: hoveredCat === cat.type ? "#FBFBFB" : "transparent", cursor: "pointer", transition: "background-color 0.12s ease" }}
          onMouseEnter={() => handleCatEnter(cat.type, "legend")}
          onMouseLeave={handleCatLeave}
          onClick={() => onDeepDive(cat.type)}
        >
          {hoverSource === "legend" && hoveredCat === cat.type && (
            <div style={{ position: "absolute", bottom: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
              <LegendTooltip label="Deep dive" />
            </div>
          )}
          <CatIcon type={cat.type} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
            <span style={{ alignSelf: "stretch", textAlign: "center", fontSize: 9, fontWeight: 400, color: "#5C5C5C", lineHeight: "12px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>{cat.type}</span>
            <span style={{ alignSelf: "stretch", textAlign: "center", fontSize: 10.5, fontWeight: 500, color: "#171717", lineHeight: "15px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>{cat.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      position: "relative", width: 426, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
      backgroundColor: "white", boxShadow: "0px 0.75px 1.5px rgba(10,13,20,0.03)",
      borderRadius: 12, outline: "0.75px solid var(--stroke-soft-200,#F4F4F4)", outlineOffset: -0.75,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 18, overflow: "visible" }}
      onMouseEnter={() => setWidgetHovered(true)}
      onMouseLeave={() => { setWidgetHovered(false); handleCatLeave(); }}
    >
      {widgetHovered && !hoveredCat && (
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
          <FollowUpButton onClick={() => onFollowUp?.()} />
        </div>
      )}
      <div style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 400, color: "#171717", lineHeight: "16px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>Spending Summary</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, overflow: "visible" }}>
        <SpendingDonut
          hoveredCat={hoveredCat}
          hoverSource={hoverSource}
          onCatEnter={(cat) => handleCatEnter(cat, "donut")}
          onCatLeave={handleCatLeave}
          onCatClick={onDeepDive}
        />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {renderCol(col1)}
          {renderCol(col2)}
        </div>
      </div>
    </div>
  );
}

/* ─── stat card ─── */
function StatCard({ label, value, badge, good, onFollowUp }: { label: string; value: string; badge: string; good: boolean; onFollowUp: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{
      position: "relative", flex: 1, padding: 12,
      backgroundColor: "white",
      boxShadow: "0px 0.75px 1.5px rgba(10,13,20,0.03)",
      borderRadius: 12,
      outline: "0.75px solid var(--stroke-soft-200,#F4F4F4)",
      outlineOffset: -0.75,
      display: "flex", flexDirection: "column", gap: 3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
          <FollowUpButton onClick={onFollowUp} />
        </div>
      )}
      <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5C5C", lineHeight: "16px", fontFamily: "var(--font-inter), Inter, sans-serif" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#171717", lineHeight: "24px", fontFamily: "var(--font-inter), Inter, sans-serif" }}>{value}</span>
        <span style={{
          paddingLeft: 6, paddingRight: 6, paddingTop: 1.5, paddingBottom: 1.5,
          borderRadius: 9999, fontSize: 9, fontWeight: 500, lineHeight: "12px",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: good ? "#0B4627" : "#681219",
          backgroundColor: good ? "#E3F7EC" : "#FFEBEC" }}>{badge}</span>
      </div>
    </div>
  );
}

/* ─── user bubble ─── */
function UserBubble({ text, cardRef }: { text: string; cardRef?: { label: string; value: string } | null }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, animation: "msgIn 0.3s ease-out" }}>
      {cardRef && (
        <div style={{
          paddingTop: 10, paddingBottom: 10, paddingLeft: 12, paddingRight: 16,
          backgroundColor: "white",
          borderRadius: 16,
          outline: "1px solid var(--stroke-soft-200,#F4F4F4)",
          outlineOffset: -1,
          display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-sub-600,#5C5C5C)", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "16px" }}>{cardRef.label}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong-950,#171717)", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "20px" }}>{cardRef.value}</span>
        </div>
      )}
      <div style={{
        maxWidth: "70%", backgroundColor: "#F4F4F4",
        borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomRightRadius: 8, borderBottomLeftRadius: 14,
        padding: "10px 14px", fontSize: 15, color: "#171717", lineHeight: "24px",
        fontFamily: "var(--font-inter),Inter,sans-serif" }}>
        {text}
      </div>
    </div>
  );
}

/* ─── loading indicator ─── */
function LoadingIndicator({ phase, isJuneFlow }: { phase: "fetching" | "building" | "followup" | null; isJuneFlow?: boolean }) {
  const text = phase === "building"
    ? "Building your deep dive report..."
    : phase === "followup"
    ? "Breaking down your daily spending patterns..."
    : isJuneFlow ? "Reviewing your June transactions..." : "Reviewing your May transactions...";
  return (
    <>
      <style>{`
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes textSwap {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8, animation: "msgIn 0.3s ease-out" }}>
        <div style={{ width: 20, height: 20, flexShrink: 0 }}>
          <AqlMark size={20} animate="ratchet" />
        </div>
        <span key={text} style={{ fontSize: 13, color: "#A3A3A3", fontFamily: "var(--font-inter), Inter, sans-serif", animation: "textSwap 0.25s ease-out" }}>
          {text}
        </span>
      </div>
    </>
  );
}

/* ─── AI response ─── */
function AIMessage({ onDeepDive, onFollowUp, isJuneFlow }: { onDeepDive: (cat: string) => void; onFollowUp: (label: string, value: string) => void; isJuneFlow?: boolean }) {
  return (
    <div style={{ animation: "msgIn 0.4s ease-out" }}>
      <p style={{ margin: "0 0 12px", fontSize: 14, color: "#171717", lineHeight: "22px", maxWidth: 600 }}>
        {isJuneFlow
          ? "You spent AED 6,240 in June — down 2% from May, which is a good sign. Your biggest opportunity is food: it's your largest category and up 8% from last month. I've opened the breakdown on the right so you can see exactly where it's going."
          : "You spent AED 6,240 in May — down 2% from April, which is a good sign. Your biggest opportunity is food: it's your largest category and up 8% from last month. I've opened the breakdown on the right so you can see exactly where it's going."
        }
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, width: 426 }}>
        <StatCard label="Total Income" value="AED 36,240.28" badge="-2%" good={false} onFollowUp={() => onFollowUp("Total Income", "AED 36,240.28")} />
        <StatCard label="Total Expenses" value="AED 6,240.28" badge="-2%" good={true} onFollowUp={() => onFollowUp("Total Expenses", "AED 6,240.28")} />
      </div>
      <SpendingWidget onDeepDive={onDeepDive} onFollowUp={() => onFollowUp("Spending Summary", "AED 6,240.28")} />
      <div style={{ display: "flex", gap: 2, marginTop: 10 }}>
        {[IconCopy, IconThumbUp, IconThumbDown].map((Icon, i) => (
          <button key={i} style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", display: "flex", borderRadius: 6, opacity: 0.7 }}>
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── chat input ─── */
function ChatInput({ postSend, value, onChange, onSend, referencedCard, onClearRef, textareaRef, suggestion, dashboardAdded, onDismissWidget, onViewDashboard, showNotifyBanner, onDismissNotify, loading, onActivate }: {
  postSend: boolean;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  referencedCard?: { label: string; value: string } | null;
  loading?: boolean;
  onActivate?: () => void;
  onClearRef?: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  suggestion?: string;
  dashboardAdded?: boolean;
  onDismissWidget?: () => void;
  onViewDashboard?: () => void;
  showNotifyBanner?: boolean;
  onDismissNotify?: () => void;
}) {
  const [notifyTooltipVisible, setNotifyTooltipVisible] = useState(false);
  const notifyTooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [notifyVisible, setNotifyVisible] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  useEffect(() => {
    if (showNotifyBanner) {
      requestAnimationFrame(() => requestAnimationFrame(() => setNotifyVisible(true)));
    } else {
      setNotifyVisible(false);
      setNotifySuccess(false);
    }
  }, [showNotifyBanner]);

  const handleGetNotified = () => {
    setNotifySuccess(true);
    setTimeout(() => onDismissNotify?.(), 2000);
  };

  const hasText = value.trim().length > 0;
  const showGhost = postSend && !!suggestion && !value;
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && hasText) { e.preventDefault(); onSend(); }
  };

  if (!postSend) {
    return (
      <div style={{ position: "relative", paddingLeft: 4, paddingRight: 4 }}>
        <div style={{
          position: "relative",
          paddingTop: 10, paddingBottom: 1, paddingLeft: 1, paddingRight: 1,
          background: "linear-gradient(135deg, rgba(219,162,211,0.07) 21%, rgba(195,160,235,0.07) 36%, rgba(180,158,250,0.07) 45%, rgba(148,121,241,0.07) 58%, rgba(116,84,232,0.07) 69%, rgba(78,41,221,0.07) 83%, rgba(19,3,96,0.07) 97%)",
          borderRadius: 20,
          outline: "1px solid rgba(180,158,250,0.40)",
          outlineOffset: -1,
          display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ paddingLeft: 12, paddingRight: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <IconInfo />
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-sub-600,#5C5C5C)", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              Analyse spending, manage your finances, and take action — all in one place.
            </span>
          </div>
          <div style={{
            paddingTop: 14, paddingBottom: 12, paddingLeft: 12, paddingRight: 12,
            backgroundColor: "white",
            borderRadius: 19,
            outline: "1px solid var(--stroke-soft-200,#F4F4F4)",
            outlineOffset: -1,
            boxShadow: "0px 0px 0px 1px rgba(23,23,23,0.02), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 6px 6px -3px rgba(23,23,23,0.04), 0px 10px 10px -5px rgba(23,23,23,0.02)",
            display: "flex", flexDirection: "column", gap: 31 }}>
            <textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
              rows={1}
              style={{
                border: "none", outline: "none", background: "transparent", resize: "none",
                fontSize: 14, color: "#171717", fontFamily: "var(--font-inter), Inter, sans-serif",
                lineHeight: "20px", minHeight: 20, paddingLeft: 4, paddingRight: 4 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ padding: 4, backgroundColor: "white", borderRadius: 9, outline: "1px solid var(--stroke-soft-200,#F4F4F4)", outlineOffset: -1, border: "none", cursor: "pointer", display: "flex" }}>
                <IconPlus />
              </button>
              <div style={{ flex: 1 }} />
              <button onClick={onSend} style={{ width: 32, height: 32, padding: 6, background: hasText ? "#1C1C1C" : "#FCFCFC", borderRadius: 9, border: "none", cursor: hasText ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
                <IconArrowUp white={hasText} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .mal-post-input {
          background: white;
          border: none;
          outline: 1px solid var(--stroke-soft-200, #F4F4F4);
          outline-offset: -1px;
        }
        .mal-post-input:focus-within {
          background: linear-gradient(white, white) padding-box, ${GRAD} border-box;
          border: 1px solid transparent;
          outline: none;
        }
        .mal-post-input.mal-post-input--inactive,
        .mal-post-input.mal-post-input--inactive:focus-within {
          background: white !important;
          border: none !important;
          outline: 1px solid var(--stroke-soft-200, #F4F4F4) !important;
          outline-offset: -1px !important;
        }
      `}</style>
      <div style={{
        paddingTop: dashboardAdded ? 0 : 10, paddingBottom: 1, paddingLeft: 1, paddingRight: 1, borderRadius: 20,
        ...((dashboardAdded || showNotifyBanner) ? (
          notifySuccess ? {
            background: "rgba(31,193,107,0.06)",
            outline: "1px solid rgba(31,193,107,0.40)",
            outlineOffset: -1,
          } : {
            background: "linear-gradient(135deg, rgba(219,162,211,0.07) 21%, rgba(195,160,235,0.07) 36%, rgba(180,158,250,0.07) 45%, rgba(148,121,241,0.07) 58%, rgba(116,84,232,0.07) 69%, rgba(78,41,221,0.07) 83%, rgba(19,3,96,0.07) 97%)",
            outline: "1px solid rgba(219,162,211,0.40)",
            outlineOffset: -1,
          }
        ) : {}) }}>
        {/* get-notified banner — autostart returning users only */}
        {showNotifyBanner && (
          <div
            style={{
              paddingLeft: 12, paddingRight: 12, marginBottom: 10,
              display: "flex", alignItems: "center", gap: 12, position: "relative",
              opacity: notifyVisible ? 1 : 0,
              transform: notifyVisible ? "translateY(0)" : "translateY(-6px)",
              transition: "opacity 0.4s ease, transform 0.4s ease" }}
            onMouseEnter={() => {
              notifyTooltipTimer.current = setTimeout(() => setNotifyTooltipVisible(true), 400);
            }}
            onMouseLeave={() => {
              if (notifyTooltipTimer.current) clearTimeout(notifyTooltipTimer.current);
              setNotifyTooltipVisible(false);
            }}
          >
            {notifySuccess ? (
              /* success state */
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ flexShrink: 0, width: 16, height: 16, borderRadius: "50%", background: "#1FC16B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L3.5 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ flex: 1, color: "var(--state-success-dark,#0b4627)", fontSize: 14, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500, lineHeight: "20px" }}>
                  You're all set — we'll notify you when your monthly report is ready.
                </span>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AqlMark size={19} />
                  </div>
                  <span style={{ flex: 1, color: "var(--text-sub-600,#5C5C5C)", fontSize: 14, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500, lineHeight: "20px" }}>
                    Aql can prepare your spending report automatically each month.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={handleGetNotified}
                    style={{
                      paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4,
                      background: "var(--bg-surface-800,#262626)", border: "none", cursor: "pointer",
                      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <span style={{ color: "white", fontSize: 14, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500, lineHeight: "20px", whiteSpace: "nowrap" }}>
                      Set it up
                    </span>
                  </button>
                  <button
                    onClick={onDismissNotify}
                    style={{ padding: 2, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M14.5 5.5L5.5 14.5M5.5 5.5L14.5 14.5" stroke="var(--icon-sub-600,#5C5C5C)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
            {/* dark tooltip */}
            {notifyTooltipVisible && !notifySuccess && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 10px)", left: "50%",
                transform: "translateX(-50%)",
                background: "#171717", borderRadius: 8,
                boxShadow: "0px 4px 16px rgba(14,18,27,0.24)",
                padding: "8px 10px", width: 300, zIndex: 100, pointerEvents: "none" }}>
                <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, fontWeight: 500, lineHeight: "18px", color: "#ffffff", display: "block" }}>
                  We introduce this opt-in once we recognise a user performing the same action repeatedly — like reviewing monthly spend 2–3 times — to encourage the habit of regularly checking in on their finances.
                </span>
              </div>
            )}
          </div>
        )}
        {/* widget-added notification row */}
        {dashboardAdded && (
          <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, marginBottom: 8, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flexShrink: 0, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AqlMark size={16} />
              </div>
              <span style={{ flex: 1, color: "var(--text-sub-600,#5C5C5C)", fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500, lineHeight: "16px" }}>
                Widget saved to my dashboard
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => onViewDashboard?.()}
                style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "var(--primary-base,#335CFF)", fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500, lineHeight: "16px", whiteSpace: "nowrap" }}
              >
                View Dashboard
              </button>
              <div style={{ width: 1, alignSelf: "stretch", background: GRAD, opacity: 0.5 }} />
              <button onClick={onDismissWidget} style={{ padding: 2, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M14.5 5.5L5.5 14.5M5.5 5.5L14.5 14.5" stroke="var(--icon-sub-600,#5C5C5C)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className={`mal-post-input${loading ? " mal-post-input--inactive" : ""}`} style={{
          paddingTop: 14, paddingBottom: 12, paddingLeft: 12, paddingRight: 12,
          borderRadius: 19,
          boxShadow: "0px 0px 0px 1px rgba(23,23,23,0.02), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 6px 6px -3px rgba(23,23,23,0.04), 0px 10px 10px -5px rgba(23,23,23,0.02)",
          display: "flex", flexDirection: "column", gap: 14 }}>
          {/* referenced card chip */}
          {referencedCard && (
            <div style={{
              paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
              backgroundColor: "white",
              borderRadius: 16,
              outline: "1px solid var(--stroke-soft-200,#F4F4F4)",
              outlineOffset: -1,
              display: "inline-flex", alignItems: "center", gap: 12,
              alignSelf: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-sub-600,#5C5C5C)", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "16px" }}>{referencedCard.label}</span>
                  <button onClick={onClearRef} style={{ width: 16, height: 16, padding: 2, backgroundColor: "#262626", borderRadius: 999, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M6.5 1.5L1.5 6.5M1.5 1.5L6.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong-950,#171717)", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "20px" }}>{referencedCard.value}</span>
              </div>
            </div>
          )}
          <div style={{ position: "relative", minHeight: 20 }}>
            {showGhost && (
              <div style={{
                position: "absolute", top: 0, left: 4, right: 0,
                pointerEvents: "none", fontSize: 14, lineHeight: "20px",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#A3A3A3", display: "flex", alignItems: "center",
                whiteSpace: "nowrap", overflow: "hidden" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", flexShrink: 1 }}>{suggestion}</span>
                <span style={{
                  marginLeft: 8, flexShrink: 0,
                  padding: "1px 5px", border: "1px solid #D1D1D1",
                  borderRadius: 4, fontSize: 10, lineHeight: "14px",
                  color: "#A3A3A3", background: "#FBFBFB" }}>Tab</span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={value}
              onFocus={() => onActivate?.()}
              onChange={e => onChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Tab" && showGhost && suggestion) {
                  e.preventDefault();
                  onChange(suggestion);
                }
                if (e.key === "Enter" && !e.shiftKey && (hasText || referencedCard)) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder={showGhost ? "" : "Write a message"}
              rows={1}
              style={{ border: "none", outline: "none", background: "transparent", resize: "none", fontSize: 14, color: "#171717", fontFamily: "var(--font-inter), Inter, sans-serif", lineHeight: "20px", minHeight: 20, paddingLeft: 4, paddingRight: 4, width: "100%", position: "relative", zIndex: 1 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ padding: 4, backgroundColor: "white", borderRadius: 9, outline: "1px solid var(--stroke-soft-200,#F4F4F4)", outlineOffset: -1, border: "none", cursor: "pointer", display: "flex" }}>
              <IconPlus />
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={onSend} style={{ width: 32, height: 32, padding: 6, background: (hasText || referencedCard) ? "#1C1C1C" : "#FCFCFC", borderRadius: 9, border: "none", cursor: (hasText || referencedCard) ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
              <IconArrowUp white={!!(hasText || referencedCard)} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── weekly breakdown chart ─── */
function WeeklyBreakdown({ onFollowUp, dashboardAdded, onDashboardAdd }: { onFollowUp: (label: string, value: string) => void; dashboardAdded: boolean; onDashboardAdd: () => void }) {
  const [hoveredSeg, setHoveredSeg] = useState<{ day: number; catIdx: number } | null>(null);
  const [cardHovered, setCardHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const dayTotals = WEEK_DATA.map(day => day.reduce((s, v) => s + v, 0));
  const weekTotal = dayTotals.reduce((s, v) => s + v, 0);
  const avgDaily = weekTotal / 7;
  const maxDay = Math.max(...dayTotals);

  const step = maxDay <= 200 ? 50 : maxDay <= 500 ? 100 : maxDay <= 1000 ? 200 : maxDay <= 2000 ? 500 : 1000;
  const yMax = Math.ceil(maxDay / step) * step;
  const numTicks = yMax / step;
  const yLabels = Array.from({ length: numTicks + 1 }, (_, i) => (numTicks - i) * step)
    .map(v => v >= 1000 ? `${v / 1000}k` : String(v));

  const CHART_H = 220;

  return (
    <div style={{ animation: "msgIn 0.4s ease-out" }}>
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wkBarGrow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      {/* cursor-following tooltip rendered at fixed position */}
      {hoveredSeg && (
        <div style={{
          position: "fixed",
          left: mousePos.x + 14,
          top: mousePos.y - 48,
          zIndex: 9999,
          background: "white",
          border: "1px solid #F4F4F4",
          boxShadow: "0px 4px 16px rgba(14,18,27,0.12)",
          borderRadius: 8,
          padding: "8px 10px",
          pointerEvents: "none",
          animation: "tooltipIn 0.12s ease-out",
          whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: WEEK_CATS[hoveredSeg.catIdx].color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#5C5C5C", fontFamily: "var(--font-inter),Inter,sans-serif" }}>{WEEK_CATS[hoveredSeg.catIdx].name}</span>
            <span style={{ fontSize: 12, color: "#171717", fontFamily: "var(--font-inter),Inter,sans-serif", fontWeight: 600 }}>
              AED {WEEK_DATA[hoveredSeg.day][hoveredSeg.catIdx]}
            </span>
          </div>
          <div style={{ borderTop: "1px solid #F4F4F4", paddingTop: 5 }}>
            <span style={{ fontSize: 11, color: "#A3A3A3", fontFamily: "var(--font-inter),Inter,sans-serif" }}>Click to deep dive</span>
          </div>
        </div>
      )}
      <p style={{ margin: "0 0 12px", fontSize: 14, color: "#171717", lineHeight: "22px", maxWidth: 600, fontFamily: "var(--font-inter),Inter,sans-serif" }}>
        You have spent an average of <strong style={{ fontWeight: 500 }}>AED {avgDaily.toFixed(2)}</strong> last week, with the weekly total adding up to <strong style={{ fontWeight: 500 }}>AED {weekTotal.toFixed(2)}</strong>
      </p>

      {/* card with Follow Up on hover */}
      <div
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        {cardHovered && (
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 20 }}>
            <FollowUpButton onClick={() => onFollowUp("Weekly Expenses", `AED ${weekTotal.toFixed(2)}`)} />
          </div>
        )}
        <div style={{
          width: 426, paddingLeft: 12, paddingRight: 12, paddingTop: 16, paddingBottom: 16,
          background: "white",
          boxShadow: "0px 0.75px 1.5px rgba(10,13,20,0.03)",
          borderRadius: 12,
          outline: "0.75px solid var(--stroke-soft-200,#F4F4F4)",
          outlineOffset: -0.75,
          display: "flex", flexDirection: "column", gap: 12 }}>
          {/* chart area */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* y-axis labels — exactly CHART_H tall so "0" sits at bar base */}
            <div style={{ width: 28, height: CHART_H, display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
              {yLabels.map((l, i) => (
                <span key={i} style={{ fontSize: 9, color: "#5C5C5C", lineHeight: "12px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>{l}</span>
              ))}
            </div>
            {/* right column: bars then day labels */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
              {/* bars row */}
              <div
                style={{ height: CHART_H, display: "flex", gap: 10, paddingRight: 6 }}
                onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
              >
                {WEEK_DAYS.map((day, d) => {
                  const hoveredCatIdx = hoveredSeg?.day === d ? hoveredSeg.catIdx : null;
                  return (
                    <div
                      key={d}
                      style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}
                      onMouseLeave={() => setHoveredSeg(null)}
                    >
                      {/* empty space */}
                      <div style={{ flex: 1, background: "#FCFCFC" }} />
                      {/* Animated stack — grows from the bottom as a unit */}
                      <div style={{
                        display: "flex", flexDirection: "column", flexShrink: 0,
                        transformOrigin: "bottom",
                        animation: `wkBarGrow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${d * 0.045}s both` }}>
                        {[...WEEK_CATS].reverse().map((c, ci) => {
                          const catIdx = WEEK_CATS.length - 1 - ci;
                          const val = WEEK_DATA[d][catIdx];
                          const segH = (val / yMax) * CHART_H;
                          if (segH <= 0.5) return null;
                          const isSegHovered = hoveredSeg?.day === d && hoveredSeg.catIdx === catIdx;
                          return (
                            <div
                              key={c.name}
                              style={{
                                height: segH, background: c.color, flexShrink: 0,
                                opacity: hoveredCatIdx === null ? 1 : isSegHovered ? 1 : 0.35,
                                transition: "opacity 0.15s",
                                cursor: "default" }}
                              onMouseEnter={() => setHoveredSeg({ day: d, catIdx })}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* day labels row */}
              <div style={{ display: "flex", gap: 10, paddingRight: 6 }}>
                {WEEK_DAYS.map((day, d) => (
                  <span key={d} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#5C5C5C", lineHeight: "12px", fontFamily: "var(--font-inter),Inter,sans-serif" }}>{day}</span>
                ))}
              </div>
            </div>
          </div>
          {/* legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {WEEK_CATS.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "#5C5C5C", fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: "12px" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* action chips */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {/* follow-up suggestion chip */}
        <div style={{ display: "inline-flex", borderRadius: 7, padding: 1, background: "linear-gradient(135deg, rgba(219,162,211,0.5) 21%, rgba(195,160,235,0.5) 36%, rgba(180,158,250,0.5) 45%, rgba(148,121,241,0.5) 58%, rgba(116,84,232,0.5) 69%, rgba(78,41,221,0.5) 83%, rgba(19,3,96,0.5) 97%)" }}>
          <button style={{
            paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 8,
            background: "white",
            borderRadius: 6,
            border: "none", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 2 }}>
            <div style={{ padding: "2.86px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M4.99993 4.46429V6.60714L1.78564 3.92857L4.99993 1.25V3.39286H7.6785C8.81514 3.39286 9.90523 3.84439 10.709 4.64811C11.5127 5.45184 11.9642 6.54193 11.9642 7.67857C11.9642 8.81521 11.5127 9.9053 10.709 10.709C9.90523 11.5128 8.81514 11.9643 7.6785 11.9643H2.85707V10.8929H7.6785C8.53098 10.8929 9.34855 10.5542 9.95135 9.95142C10.5541 9.34862 10.8928 8.53105 10.8928 7.67857C10.8928 6.82609 10.5541 6.00852 9.95135 5.40573C9.34855 4.80293 8.53098 4.46429 7.6785 4.46429H4.99993Z" fill="#5C5C5C"/>
              </svg>
            </div>
            <span style={{ color: "var(--text-sub-600, #5C5C5C)", fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 400, lineHeight: "16px" }}>
              How can I reduce my food spend?
            </span>
          </button>
        </div>

        {/* dashboard action chip */}
        {!dashboardAdded && (
          <div style={{ display: "inline-flex", borderRadius: 7, padding: 1, background: "linear-gradient(135deg, rgba(219,162,211,0.5) 21%, rgba(195,160,235,0.5) 36%, rgba(180,158,250,0.5) 45%, rgba(148,121,241,0.5) 58%, rgba(116,84,232,0.5) 69%, rgba(78,41,221,0.5) 83%, rgba(19,3,96,0.5) 97%)" }}>
            <button
              onClick={onDashboardAdd}
              style={{
                paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 8,
                background: "white",
                borderRadius: 6,
                border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 2 }}>
              <div style={{ padding: "2.86px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 11.5L11.5 2.5M11.5 2.5H6.5M11.5 2.5V7.5" stroke="#5C5C5C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ color: "var(--text-sub-600, #5C5C5C)", fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 400, lineHeight: "16px" }}>
                Save this to my dashboard
              </span>
            </button>
          </div>
        )}
      </div>


      <div style={{ display: "flex", gap: 2, marginTop: 10 }}>
        {[IconCopy, IconThumbUp, IconThumbDown].map((Icon, i) => (
          <button key={i} style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", display: "flex", borderRadius: 6, opacity: 0.7 }}>
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

type CardRef = { label: string; value: string };
type ChatMsg =
  | { role: "user"; text: string; cardRef: CardRef | null }
  | { role: "ai-summary" }
  | { role: "ai-weekly" };

/* ─── page ─── */
export default function MalAIPage() {
  const malRouter = useMalRouter();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<"fetching" | "building" | "followup" | null>(null);
  const [input, setInput] = useState("");
  const [chatTitle, setChatTitle] = useState("New conversation");
  const [deepDiveCat, setDeepDiveCat] = useState<string | null>(null);
  const [deepDiveLoading, setDeepDiveLoading] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const deepDiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeepDiveOpen = (cat: string) => {
    if (deepDiveTimerRef.current) clearTimeout(deepDiveTimerRef.current);
    if (deepDiveCat !== null) {
      // Panel already open — just swap category, no loading animation
      setDeepDiveCat(cat);
    } else {
      // Panel was closed — open with loading animation
      setDeepDiveCat(cat);
      setDeepDiveLoading(true);
      deepDiveTimerRef.current = setTimeout(() => setDeepDiveLoading(false), 3000);
    }
  };
  const [referencedCard, setReferencedCard] = useState<CardRef | null>(null);
  const [dashboardAdded, setDashboardAdded] = useState(false);
  const [isAutostart, setIsAutostart] = useState(false);
  const [isJuneFlow, setIsJuneFlow] = useState(false);
  const [showNotifyBanner, setShowNotifyBanner] = useState(false);
  const [showCrossFlowChip, setShowCrossFlowChip] = useState(false);

  const handleDismissNotify = () => {
    setShowNotifyBanner(false);
    setShowCrossFlowChip(true);
    window.dispatchEvent(new CustomEvent("mal-wizard-advance", { detail: { to: 7 } }));
  };
  const notifyBannerShown = useRef(false);

  const handleDashboardAdd = () => {
    setDashboardAdded(true);
    sessionStorage.setItem("dashboardWidgetAdded", "true");
    window.dispatchEvent(new CustomEvent("mal-wizard-advance", { detail: { to: 4 } }));
  };
  const [followUpSuggestion, setFollowUpSuggestion] = useState("");
  const [chatColWidth, setChatColWidth] = useState(9999);
  const hasAutoOpened = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatColRef.current) return;
    const ro = new ResizeObserver(entries => {
      setChatColWidth(entries[0].contentRect.width);
    });
    ro.observe(chatColRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (isLoading) setInputActive(false);
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, dashboardAdded, showNotifyBanner]);

  const isEmpty = messages.length === 0 && !isLoading;
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [emptyStateKey, setEmptyStateKey] = useState(0);

  const handleNewConversation = () => {
    setMessages([]);
    setChatTitle("New conversation");
    setInput("");
    setDeepDiveCat(null);
    setIsLoading(false);
    setLoadingPhase(null);
    setInputActive(false);
    setReferencedCard(null);
    setFollowUpSuggestion("");
    setDashboardAdded(false);
    setShowNotifyBanner(false);
    setEmptyStateKey(k => k + 1);
  };

  const sendMessage = (text: string, cardRef: CardRef | null = null) => {
    const isFirstMessage = messages.length === 0;
    const userMsg: ChatMsg = { role: "user", text, cardRef };
    setMessages(prev => [...prev, userMsg]);
    setReferencedCard(null);
    setInput("");
    setFollowUpSuggestion("");
    if (isFirstMessage) {
      setChatTitle("Monthly spend summary");
      window.dispatchEvent(new CustomEvent("mal-wizard-advance", { detail: { to: 2 } }));
    }
    setIsLoading(true);

    if (isFirstMessage) {
      // Phase 1: fetching (no right panel yet)
      setLoadingPhase("fetching");

      // Phase 2 at 2500ms: right panel opens with flicker (3000ms timer inside)
      setTimeout(() => {
        setLoadingPhase("building");
        if (!hasAutoOpened.current) {
          hasAutoOpened.current = true;
          handleDeepDiveOpen("Food");
        }
      }, 2500);

      // At 5500ms (2500 + 3000): loading ends + AI message appears — same moment flicker fades
      setTimeout(() => {
        setIsLoading(false);
        setLoadingPhase(null);
        setMessages(prev => [...prev, { role: "ai-summary" } as ChatMsg]);
      }, 5500);
    } else {
      setLoadingPhase("followup");
      setTimeout(() => {
        setIsLoading(false);
        setLoadingPhase(null);
        setMessages(prev => [...prev, { role: "ai-weekly" } as ChatMsg]);
      }, 2000);
    }
  };

  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  useEffect(() => {
    if (sessionStorage.getItem("mal-ai-june-flow") === "true") {
      sessionStorage.removeItem("mal-ai-june-flow");
      setIsJuneFlow(true);
    }
    if (sessionStorage.getItem("mal-ai-autostart") === "true") {
      sessionStorage.removeItem("mal-ai-autostart");
      setIsAutostart(true);
      setTimeout(() => sendMessageRef.current("Show me my monthly spend summary"), 400);
    } else if (sessionStorage.getItem("mal-ai-firsttime") === "true") {
      sessionStorage.removeItem("mal-ai-firsttime");
      setTimeout(() => sendMessageRef.current("Show me my monthly spend summary"), 400);
      // isAutostart stays false — "Get notified" banner will not show
    }
  }, []);

  useEffect(() => {
    if (deepDiveCat && isAutostart && !deepDiveLoading && !notifyBannerShown.current) {
      notifyBannerShown.current = true;
      setTimeout(() => setShowNotifyBanner(true), 2000);
    }
  }, [deepDiveCat, deepDiveLoading, isAutostart]);

  const handleFollowUp = (label: string, value: string) => {
    setReferencedCard({ label, value });
    setFollowUpSuggestion("Break down my expenses last week on a daily basis");
    setTimeout(() => textareaRef.current?.focus(), 0);
    if (label === "Total Expenses") {
      window.dispatchEvent(new CustomEvent("mal-wizard-advance", { detail: { to: 3 } }));
    }
  };

  const handleSend = () => {
    if (!input.trim() && !referencedCard) return;
    sendMessage(input.trim(), referencedCard);
  };

  return (
    <div style={{ display: "flex", height: "100vh", minWidth: 1280, backgroundColor: "var(--bg-weak-25, #FAFAFA)" }}>
      <Sidebar />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, backgroundColor: "var(--bg-weak-25, #FAFAFA)" }}>
        {/* Topbar strip — gray zone */}
        <div style={{ flexShrink: 0, paddingLeft: 32, paddingRight: 32, paddingTop: 14, paddingBottom: 14 }}>
          <Topbar title="Conversations" variant="mal-ai" compressed={chatColWidth < 1200} />
        </div>

        {/* White content box */}
        <div style={{
          flex: 1, minHeight: 0,
          overflow: "hidden",
          background: "var(--bg-white-0, white)",
          borderTopLeftRadius: 20,
          borderLeft: "1px solid var(--stroke-soft-200, #F4F4F4)",
          borderTop: "1px solid var(--stroke-soft-200, #F4F4F4)",
          display: "flex",
          flexDirection: "row" }}>
        {/* chat column */}
        <div ref={chatColRef} style={{ flex: 1, minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", padding: "24px 32px 16px" }}>
              {/* FlickeringGrid — empty state only, bottom 40%, fades from transparent (top) to opaque (bottom) */}
              {isEmpty && (
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                  pointerEvents: "none", zIndex: 0,
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 100%)" }}>
                  <FlickeringGrid
                    color="#4E29DD"
                    maxOpacity={0.15}
                    flickerChance={0.1}
                    squareSize={2}
                    gridGap={2}
                  />
                </div>
              )}
              {/* ── Conversation nav bar ── */}
              <div style={{ flexShrink: 0, marginBottom: isEmpty ? 0 : 8, display: "flex", alignItems: "center", gap: 8, height: 28 }}>
                {/* Hamburger icon */}
                <button style={{
                  width: 28, height: 28, padding: 4, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3.25 4H16.75V5.5H3.25V4ZM3.25 9.25H12.25V10.75H3.25V9.25ZM3.25 14.5H16.75V16H3.25V14.5Z" fill="var(--icon-sub-600, #5C5C5C)"/>
                  </svg>
                </button>

                {/* Breadcrumb */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "var(--text-soft-400, #A3A3A3)", whiteSpace: "nowrap" }}>
                    Conversations /&nbsp;
                  </span>
                  <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "var(--text-sub-600, #5C5C5C)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {chatTitle}
                  </span>
                </div>

                {/* New conversation button */}
                <button
                  onClick={isEmpty ? undefined : handleNewConversation}
                  disabled={isEmpty}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    background: "transparent", border: "none", cursor: isEmpty ? "default" : "pointer",
                    padding: "0 4px", flexShrink: 0,
                    opacity: isEmpty ? 0.35 : 1,
                    transition: "opacity 0.15s" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.25 9.25V4.75H10.75V9.25H15.25V10.75H10.75V15.25H9.25V10.75H4.75V9.25H9.25Z" fill="var(--icon-strong-950, #171717)"/>
                  </svg>
                  <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "var(--text-strong-950, #171717)", whiteSpace: "nowrap" }}>
                    New conversation
                  </span>
                </button>

                {/* More options (⋮) with dropdown */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    onClick={() => setMoreMenuOpen(o => !o)}
                    style={{
                      width: 28, height: 28, padding: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "transparent", border: "none", borderRadius: 8, cursor: "pointer" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="4.5" r="1.25" fill="var(--icon-sub-600, #5C5C5C)"/>
                      <circle cx="10" cy="10" r="1.25" fill="var(--icon-sub-600, #5C5C5C)"/>
                      <circle cx="10" cy="15.5" r="1.25" fill="var(--icon-sub-600, #5C5C5C)"/>
                    </svg>
                  </button>

                  {moreMenuOpen && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setMoreMenuOpen(false)} />
                      <div style={{
                        position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                        backgroundColor: "var(--bg-white-0, white)",
                        borderRadius: 10,
                        outline: "1px solid var(--stroke-soft-200, #F4F4F4)",
                        outlineOffset: -1,
                        boxShadow: "0px 8px 24px rgba(14,18,27,0.08)",
                        overflow: "hidden",
                        minWidth: 180 }}>
                        {[
                          { label: "Archive conversation", icon: "M3.25 3.25H16.75V5.5L11.5 10.75V16.75L8.5 15.25V10.75L3.25 5.5V3.25Z" },
                          { label: "Delete conversation", icon: "M6.5 3.25V2.5H13.5V3.25H17.5V4.75H16V17C16 17.1989 15.921 17.3897 15.7803 17.5303C15.6397 17.671 15.4489 17.75 15.25 17.75H4.75C4.55109 17.75 4.36032 17.671 4.21967 17.5303C4.07902 17.3897 4 17.1989 4 17V4.75H2.5V3.25H6.5ZM5.5 4.75V16.25H14.5V4.75H5.5ZM8.5 7.25H7V13.75H8.5V7.25ZM13 7.25H11.5V13.75H13V7.25Z", danger: true },
                        ].map(item => (
                          <button key={item.label} onClick={() => setMoreMenuOpen(false)} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 8,
                            paddingTop: 10, paddingBottom: 10, paddingLeft: 12, paddingRight: 12,
                            backgroundColor: "transparent", border: "none", cursor: "pointer",
                            textAlign: "left" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-weak-50, #FBFBFB)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                          >
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                              <path d={item.icon} fill={item.danger ? "var(--state-error-base, #FB3748)" : "var(--icon-sub-600, #5C5C5C)"} />
                            </svg>
                            <span style={{
                              fontFamily: "var(--font-inter), Inter, sans-serif",
                              fontSize: 14, fontWeight: 400, lineHeight: "20px",
                              color: item.danger ? "var(--state-error-base, #FB3748)" : "var(--text-strong-950, #171717)" }}>
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{
                flex: 1, minHeight: 0,
                overflowY: isEmpty ? "hidden" : "auto",
                display: "flex", flexDirection: "column",
                justifyContent: isEmpty ? "center" : "flex-start",
                alignItems: "center" }}>
                {isEmpty ? (
                  <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <style>{`
                    `}</style>
                    <div
                      key={emptyStateKey}
                    >
                      <AqlMark size={48} animate="pendulum" delay="0.35s" />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "24px", color: "var(--text-strong-950,#171717)" }}>
                        Hello, Mathew
                      </p>
                      <p style={{ margin: 0, fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "var(--text-soft-400,#A3A3A3)" }}>
                        What can I help you with today?
                      </p>
                    </div>
                    {/* conversation starter cards */}
                    <div style={{ width: "100%", display: "flex", gap: 16 }}>
                      {/* card 1 — clickable, triggers monthly summary flow */}
                      <button
                        onClick={() => sendMessage("Show me my monthly spend summary")}
                        style={{
                          flex: 1, display: "flex", alignItems: "center", gap: 16,
                          paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                          background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(219,162,211,0.40) 21%, rgba(195,160,235,0.40) 36%, rgba(180,158,250,0.40) 45%, rgba(148,121,241,0.40) 58%, rgba(116,84,232,0.40) 69%, rgba(78,41,221,0.40) 83%, rgba(19,3,96,0.40) 97%) border-box",
                          boxShadow: "0px 1px 2px rgba(10,13,20,0.03)",
                          borderRadius: 12, border: "1px solid transparent",
                          cursor: "pointer", textAlign: "left" }}
                      >
                        <span style={{ flex: 1, color: "var(--text-sub-600, #5C5C5C)", fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500, lineHeight: "16px" }}>
                          Where did I spend the most last month?
                        </span>
                        <div style={{ flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-white-0, white)", borderRadius: 9, outline: "1px solid var(--stroke-soft-200, #F4F4F4)", outlineOffset: -1 }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                      {/* card 2 — not clickable */}
                      <div style={{
                        flex: 1, display: "flex", alignItems: "center", gap: 16,
                        paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                        background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(219,162,211,0.40) 21%, rgba(195,160,235,0.40) 36%, rgba(180,158,250,0.40) 45%, rgba(148,121,241,0.40) 58%, rgba(116,84,232,0.40) 69%, rgba(78,41,221,0.40) 83%, rgba(19,3,96,0.40) 97%) border-box",
                        boxShadow: "0px 1px 2px rgba(10,13,20,0.03)",
                        borderRadius: 12, border: "1px solid transparent" }}>
                        <span style={{ flex: 1, color: "var(--text-sub-600, #5C5C5C)", fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500, lineHeight: "16px" }}>
                          What bills do I have due this week?
                        </span>
                        <div style={{ flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-white-0, white)", borderRadius: 9, outline: "1px solid var(--stroke-soft-200, #F4F4F4)", outlineOffset: -1 }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", gap: 16, paddingTop: 8, paddingBottom: 8, marginTop: "auto" }}>
                    <style>{`
                      @keyframes msgIn {
                        from { opacity: 0; transform: translateY(14px); }
                        to   { opacity: 1; transform: translateY(0); }
                      }
                    `}</style>
                    {messages.map((msg, i) => {
                      if (msg.role === "user") return <UserBubble key={i} text={msg.text} cardRef={msg.cardRef} />;
                      if (msg.role === "ai-summary") return <AIMessage key={i} onDeepDive={handleDeepDiveOpen} onFollowUp={handleFollowUp} isJuneFlow={isJuneFlow} />;
                      if (msg.role === "ai-weekly") return <WeeklyBreakdown key={i} onFollowUp={handleFollowUp} dashboardAdded={dashboardAdded} onDashboardAdd={handleDashboardAdd} />;
                      return null;
                    })}
                    {isLoading && <LoadingIndicator phase={loadingPhase} isJuneFlow={isJuneFlow} />}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div style={{ flexShrink: 0, width: "100%", maxWidth: 800, alignSelf: "center", position: "relative", zIndex: 1, marginTop: isEmpty ? 0 : 12 }}>
                <ChatInput postSend={!isEmpty} value={input} onChange={setInput} onSend={handleSend} referencedCard={referencedCard} onClearRef={() => { setReferencedCard(null); setFollowUpSuggestion(""); }} textareaRef={textareaRef} suggestion={followUpSuggestion} dashboardAdded={dashboardAdded} onDismissWidget={() => setDashboardAdded(false)} onViewDashboard={() => { sessionStorage.setItem("dashboardWidgetHighlight", "true"); sessionStorage.setItem("mal-internal-nav", "1"); malRouter.push("/demo/playground"); }} showNotifyBanner={showNotifyBanner} onDismissNotify={handleDismissNotify} loading={isLoading || !inputActive} onActivate={() => setInputActive(true)} />
                <p style={{ margin: "8px 0 0", textAlign: "center", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-soft-400,#A3A3A3)" }}>
                  Aql AI can make mistakes — always double-check important figures.
                </p>
              </div>
        </div>

        {/* deep dive panel */}
        {deepDiveCat && (
          <div style={{
            flexShrink: 0,
            alignSelf: "stretch",
            overflow: "hidden",
            animation: "panelExpand 0.2s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <DeepDivePanel cat={deepDiveCat} onClose={() => setDeepDiveCat(null)} onCatChange={setDeepDiveCat} loading={deepDiveLoading} isJuneFlow={isJuneFlow} />
          </div>
        )}
        </div>{/* end white content box */}
      </main>

      <WizardPanel />
    </div>
  );
}
