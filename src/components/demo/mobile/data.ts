/* ───────────────────────────────────────────────────────────────
   Mobile prototype data — mirrors the desktop prototype exactly so
   both tell the same story. Kept in its own module so the desktop
   build is never touched.
   ─────────────────────────────────────────────────────────────── */

export const GRAD =
  "linear-gradient(135deg, #DBA2D3 21%, #C3A0EB 36%, #B49EFA 45%, #9479F1 58%, #7454E8 69%, #4E29DD 83%, #130360 97%)";

export const GRAD_TINT = (a: number) =>
  `linear-gradient(135deg, rgba(219,162,211,${a}) 21%, rgba(195,160,235,${a}) 36%, rgba(180,158,250,${a}) 45%, rgba(148,121,241,${a}) 58%, rgba(116,84,232,${a}) 69%, rgba(78,41,221,${a}) 83%, rgba(19,3,96,${a}) 97%)`;

export type Category = "Food" | "Transport" | "Utilities" | "Shopping" | "Others";

export const SPENDING_SEGMENTS: { name: Category; color: string; value: number }[] = [
  { name: "Food",      color: "#FA7319", value: 1755.08 },
  { name: "Transport", color: "#1FC16B", value: 1170.05 },
  { name: "Utilities", color: "#47C2FF", value: 1170.05 },
  { name: "Shopping",  color: "#335CFF", value: 1755.08 },
  { name: "Others",    color: "#D1D5DB", value: 390.02  },
];

export const TOTAL_SPEND = 6240.28;

export const CATEGORY_DAILY: Record<string, number[]> = {
  Food:      [45, 78, 32, 65, 105, 52, 42, 72, 58, 35, 88, 55, 45, 115, 62, 40, 82, 50, 70, 38, 108, 65, 42, 78, 50, 68, 28, 58, 38, 15],
  Transport: [32, 48, 38, 52, 40, 35, 48, 42, 36, 50, 38, 44, 40, 35, 42, 38, 52, 44, 38, 40, 46, 38, 34, 40, 36, 42, 38, 36, 40, 28],
  Utilities: [0, 0, 0, 0, 0, 0, 350, 0, 0, 0, 0, 0, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 420, 0, 0],
  Shopping:  [0, 0, 285, 0, 0, 420, 0, 0, 0, 310, 0, 0, 0, 280, 0, 0, 0, 0, 210, 0, 0, 250, 0, 0, 0, 0, 0, 0, 0, 0],
  Others:    [12, 8, 15, 22, 10, 18, 12, 0, 25, 10, 14, 18, 8, 12, 22, 15, 10, 8, 12, 18, 14, 22, 10, 15, 8, 12, 18, 10, 15, 8],
};

export type Txn = { merchant: string; date: string; amount: number; sub: string };

export const CATEGORY_TRANSACTIONS: Record<string, Txn[]> = {
  Food: [
    { merchant: "Noon Food",   date: "May 14", amount: 67.80, sub: "Food Delivery" },
    { merchant: "Starbucks",   date: "May 13", amount: 32.00, sub: "Coffee" },
    { merchant: "Careem Food", date: "May 12", amount: 88.50, sub: "Food Delivery" },
    { merchant: "McDonald's",  date: "May 11", amount: 45.00, sub: "Dining" },
    { merchant: "Talabat",     date: "May 10", amount: 78.90, sub: "Food Delivery" },
    { merchant: "Noon Food",   date: "May 08", amount: 95.20, sub: "Food Delivery" },
    { merchant: "KFC",         date: "May 07", amount: 38.50, sub: "Dining" },
    { merchant: "Careem Food", date: "May 06", amount: 52.00, sub: "Food Delivery" },
    { merchant: "Starbucks",   date: "May 05", amount: 28.00, sub: "Coffee" },
    { merchant: "Pizza Hut",   date: "May 04", amount: 52.00, sub: "Dining" },
    { merchant: "Talabat",     date: "May 02", amount: 62.40, sub: "Food Delivery" },
    { merchant: "Noon Food",   date: "May 01", amount: 74.00, sub: "Food Delivery" },
  ],
  Transport: [
    { merchant: "Careem",      date: "May 14", amount: 42.00,  sub: "Ride" },
    { merchant: "ADNOC",       date: "May 13", amount: 128.00, sub: "Fuel" },
    { merchant: "Uber",        date: "May 12", amount: 38.00,  sub: "Ride" },
    { merchant: "Dubai Metro", date: "May 11", amount: 15.50,  sub: "Transit" },
    { merchant: "Salik",       date: "May 10", amount: 24.00,  sub: "Toll" },
    { merchant: "Careem",      date: "May 09", amount: 55.00,  sub: "Ride" },
    { merchant: "ADNOC",       date: "May 08", amount: 118.00, sub: "Fuel" },
    { merchant: "Bolt",        date: "May 07", amount: 32.00,  sub: "Ride" },
    { merchant: "RTA Bus",     date: "May 06", amount: 8.50,   sub: "Transit" },
    { merchant: "Careem",      date: "May 05", amount: 46.00,  sub: "Ride" },
    { merchant: "ADNOC",       date: "May 03", amount: 120.00, sub: "Fuel" },
    { merchant: "Uber",        date: "May 02", amount: 40.00,  sub: "Ride" },
  ],
  Utilities: [
    { merchant: "DEWA",     date: "May 14", amount: 350.00, sub: "Electricity" },
    { merchant: "Etisalat", date: "May 12", amount: 199.00, sub: "Internet" },
    { merchant: "Du",       date: "May 10", amount: 149.00, sub: "Mobile" },
    { merchant: "ADDC",     date: "May 07", amount: 120.05, sub: "Water" },
    { merchant: "Empower",  date: "May 05", amount: 95.00,  sub: "Cooling" },
    { merchant: "Etisalat", date: "May 03", amount: 49.00,  sub: "TV" },
    { merchant: "Du",       date: "May 01", amount: 29.00,  sub: "Roaming" },
    { merchant: "DEWA",     date: "Apr 28", amount: 55.00,  sub: "Electricity" },
    { merchant: "RTA",      date: "Apr 22", amount: 25.00,  sub: "Permit" },
    { merchant: "Empower",  date: "Apr 18", amount: 40.00,  sub: "Cooling" },
  ],
  Shopping: [
    { merchant: "Zara",              date: "May 14", amount: 285.00, sub: "Clothing" },
    { merchant: "H&M",               date: "May 12", amount: 175.00, sub: "Clothing" },
    { merchant: "H&M",               date: "May 11", amount: 145.00, sub: "Kids" },
    { merchant: "Adidas",            date: "May 10", amount: 100.00, sub: "Footwear" },
    { merchant: "Amazon",            date: "May 09", amount: 145.00, sub: "Online" },
    { merchant: "Noon",              date: "May 07", amount: 88.00,  sub: "Online" },
    { merchant: "Amazon",            date: "May 05", amount: 42.00,  sub: "Online" },
    { merchant: "Marks & Spencer",   date: "May 04", amount: 35.00,  sub: "Clothing" },
    { merchant: "IKEA",              date: "May 03", amount: 120.00, sub: "Home" },
    { merchant: "Home Centre",       date: "May 01", amount: 55.00,  sub: "Home" },
    { merchant: "Bath & Body Works", date: "Apr 29", amount: 58.00,  sub: "Beauty" },
    { merchant: "Centrepoint",       date: "Apr 19", amount: 250.08, sub: "Clothing" },
  ],
  Others: [
    { merchant: "Gym Membership",   date: "May 14", amount: 100.00, sub: "Fitness" },
    { merchant: "Personal Trainer", date: "May 12", amount: 20.00,  sub: "Fitness" },
    { merchant: "Netflix",          date: "May 10", amount: 45.00,  sub: "Streaming" },
    { merchant: "Pharmacy",         date: "May 09", amount: 25.00,  sub: "Health" },
    { merchant: "Haircut",          date: "May 07", amount: 55.00,  sub: "Grooming" },
    { merchant: "Dry Cleaning",     date: "May 05", amount: 40.00,  sub: "Laundry" },
    { merchant: "Spotify",          date: "May 03", amount: 19.00,  sub: "Streaming" },
    { merchant: "Pharmacy",         date: "May 01", amount: 22.02,  sub: "Health" },
    { merchant: "Amazon Prime",     date: "Apr 28", amount: 15.00,  sub: "Streaming" },
    { merchant: "Apple iCloud",     date: "Apr 22", amount: 12.00,  sub: "Storage" },
  ],
};

/* Weekly spend (Mon–Sun): [Food, Transport, Utilities, Shopping, Others] */
export const WEEK_DATA: number[][] = [
  [94, 41,   0,   0, 18],
  [62, 38,   0, 188, 14],
  [88, 44,   0,   0, 32],
  [34, 39, 270,   0, 15],
  [76, 37,   0, 228, 10],
  [52, 41,   0,   0, 28],
  [22, 29,   0, 128, 10],
];
export const WEEK_CATS = [
  { name: "Food",      color: "#FA7319" },
  { name: "Transport", color: "#1FC16B" },
  { name: "Utilities", color: "#47C2FF" },
  { name: "Shopping",  color: "#335CFF" },
  { name: "Others",    color: "#D1D5DB" },
];
export const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
export const WEEK_FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const CATEGORY_INSIGHTS: Record<string, string> = {
  Food:      "You spent AED 519 on food delivery this month, up 18% from April. That's 30% of your food budget.",
  Transport: "Most transport spend is fuel. Your ride-hailing use is steady — consolidating trips could save you around AED 150/month.",
  Utilities: "Utilities are consistent and within a healthy range. Your DEWA bill is 12% lower than the previous month — keep it up.",
  Shopping:  "Shopping spend is higher than last month. Three large clothing purchases account for 55% of this category.",
  Others:    "Subscriptions and personal care are stable. No unusual spikes detected this month.",
};

export const CATEGORY_BADGES: Record<string, string> = {
  Food:      "+8% than last month",
  Transport: "+5% than last month",
  Utilities: "+3% than last month",
  Shopping:  "+22% than last month",
  Others:    "-4% than last month",
};

export const MERCHANT_COLORS: Record<string, string> = {
  "Talabat": "#FF5A00", "Pizza Hut": "#EE3224", "ADNOC": "#009A44", "Uber": "#000000",
  "Dubai Metro": "#006DB7", "DEWA": "#007C3E", "Etisalat": "#009C44", "ADDC": "#005BAA",
  "Zara": "#000000", "H&M": "#E50010", "Amazon": "#FF9900", "IKEA": "#0058A3",
  "Namshi": "#7B2D8B", "Centrepoint": "#C8102E", "Netflix": "#E50914",
  "Gym Membership": "#333333", "Salik": "#E31E24", "Bolt": "#34D186", "RTA Bus": "#006DB7",
  "RTA": "#006DB7", "Du": "#CF202E", "Empower": "#005DA6", "Adidas": "#000000",
  "Noon": "#FEEE00", "Marks & Spencer": "#006B38", "Home Centre": "#E31837",
  "Bath & Body Works": "#C8102E", "LuLu Hypermarket": "#E31837", "Sephora": "#000000",
  "Spotify": "#1DB954", "Amazon Prime": "#00A8E0", "Apple iCloud": "#555555",
  "Barber": "#2C2C2C", "Dry Cleaning": "#4A7C9E", "Nail Salon": "#D4508C",
  "Personal Trainer": "#E85D04", "Haircut": "#2C2C2C", "Pharmacy": "#1E7D32",
  "Careem": "#00B14F", "Careem Food": "#00B14F", "Noon Food": "#FEEE00",
  "Starbucks": "#00704A", "McDonald's": "#FFC72C", "KFC": "#E4002B",
};

export const CAT_CONFIG: Record<string, { bg: string; iconColor: string; path: string }> = {
  Food:      { bg: "#FFF3EB", iconColor: "#FA7319", path: "M12.5625 1.875V13.125H11.4375V9.1875H9.1875V5.25C9.1875 4.35489 9.54308 3.49645 10.176 2.86351C10.8089 2.23058 11.6674 1.875 12.5625 1.875ZM11.4375 3.29813C10.9706 3.5625 10.3125 4.22062 10.3125 5.25V8.0625H11.4375V3.29813ZM5.8125 8.56875V13.125H4.6875V8.56875C4.05233 8.43888 3.4815 8.09365 3.07152 7.59143C2.66154 7.0892 2.43758 6.46081 2.4375 5.8125V2.4375H3.5625V6.375H4.6875V2.4375H5.8125V6.375H6.9375V2.4375H8.0625V5.8125C8.06242 6.46081 7.83846 7.0892 7.42848 7.59143C7.0185 8.09365 6.44767 8.43888 5.8125 8.56875Z" },
  Transport: { bg: "#E3F7EC", iconColor: "#1FC16B", path: "M11.4375 12H3.5625V12.5625C3.5625 12.7117 3.50324 12.8548 3.39775 12.9602C3.29226 13.0657 3.14918 13.125 3 13.125H2.4375C2.28832 13.125 2.14524 13.0657 2.03975 12.9602C1.93426 12.8548 1.875 12.7117 1.875 12.5625V8.34375L1.17581 8.16938C1.05417 8.1389 0.946205 8.06866 0.869056 7.96981C0.791907 7.87095 0.750003 7.74915 0.75 7.62375V7.21875C0.75 7.14416 0.779632 7.07262 0.832376 7.01988C0.885121 6.96713 0.956658 6.9375 1.03125 6.9375H1.875L3.27 3.68175C3.35681 3.47925 3.50116 3.3067 3.68516 3.1855C3.86915 3.06431 4.08468 2.9998 4.305 3H10.695C10.9151 3.00002 11.1304 3.06463 11.3142 3.18581C11.498 3.30699 11.6421 3.47943 11.7289 3.68175L13.125 6.9375H13.9688C14.0433 6.9375 14.1149 6.96713 14.1676 7.01988C14.2204 7.07262 14.25 7.14416 14.25 7.21875V7.62375C14.25 7.74915 14.2081 7.87095 14.1309 7.96981C14.0538 8.06866 13.9458 8.1389 13.8242 8.16938L13.125 8.34375V12.5625C13.125 12.7117 13.0657 12.8548 12.9602 12.9602C12.8548 13.0657 12.7117 13.125 12.5625 13.125H12C11.8508 13.125 11.7077 13.0657 11.6023 12.9602C11.4968 12.8548 11.4375 12.7117 11.4375 12.5625V12ZM12 10.875V8.0625H3V10.875H12ZM3.83081 6.9375H11.1692L10.875 4.125H4.125L3.83081 6.9375ZM3.5625 8.625V9.75H5.95031C5.74444 9.04969 4.86581 8.625 3.5625 8.625ZM11.4375 8.625C10.1336 8.625 9.255 9.04913 8.80219 9.8985L10.875 9.8985V9.75C11.4375 9.75 11.4375 9.89918 11.4375 9.75V8.625Z" },
  Utilities: { bg: "#EBF8FF", iconColor: "#47C2FF", path: "M12 13.125H3C2.85082 13.125 2.70774 13.0657 2.60225 12.9602C2.49676 12.8548 2.4375 12.7117 2.4375 12.5625V2.4375C2.4375 2.28832 2.49676 2.14524 2.60225 2.03975C2.70774 1.93426 2.85082 1.875 3 1.875H12C12.1492 1.875 12.2923 1.93426 12.3977 2.03975C12.5032 2.14524 12.5625 2.28832 12.5625 2.4375V12.5625C12.5625 12.7117 12.5032 12.8548 12.3977 12.9602C12.2923 13.0657 12.1492 13.125 12 13.125ZM11.4375 12V3H3.5625V12H11.4375ZM5.25 4.6875H9.75V5.8125H5.25V4.6875ZM5.25 6.9375H9.75V8.0625H5.25V6.9375ZM5.25 9.1875H9.75V10.3125H5.25V9.1875Z" },
  Shopping:  { bg: "#EBF1FF", iconColor: "#335CFF", path: "M4.40625 1.875H10.5938C10.6811 1.875 10.7672 1.89533 10.8453 1.93438C10.9234 1.97344 10.9914 2.03014 11.0437 2.1L12.5625 4.125V12.5625C12.5625 12.7117 12.5032 12.8548 12.3977 12.9602C12.2923 13.0657 12.1492 13.125 12 13.125H3C2.85082 13.125 2.70774 13.0657 2.60225 12.9602C2.49676 12.8548 2.4375 12.7117 2.4375 12.5625V4.125L3.95625 2.1C4.00865 2.03014 4.07659 1.97344 4.15469 1.93438C4.2328 1.89533 4.31892 1.875 4.40625 1.875ZM11.4375 5.25H3.5625V12H11.4375V5.25ZM11.1562 4.125L10.3125 3H4.6875L3.84375 4.125H11.1562ZM5.8125 6.375V7.5C5.8125 7.94755 5.99029 8.37678 6.30676 8.69324C6.62322 9.00971 7.05245 9.1875 7.5 9.1875C7.94755 9.1875 8.37678 9.00971 8.69324 8.69324C9.00971 8.37678 9.1875 7.94755 9.1875 7.5V6.375H10.3125V7.5C10.3125 8.24592 10.0162 8.96129 9.48874 9.48874C8.96129 10.0162 8.24592 10.3125 7.5 10.3125C6.75408 10.3125 6.03871 10.0162 5.51126 9.48874C4.98382 8.96129 4.6875 8.24592 4.6875 7.5V6.375H5.8125Z" },
  Others:    { bg: "#FBFBFB", iconColor: "#5C5C5C", path: "M7.5 13.125C4.39331 13.125 1.875 10.6067 1.875 7.5C1.875 4.39331 4.39331 1.875 7.5 1.875C10.6067 1.875 13.125 4.39331 13.125 7.5C13.125 10.6067 10.6067 13.125 7.5 13.125ZM7.5 12C8.69347 12 9.83807 11.5259 10.682 10.682C11.5259 9.83807 12 8.69347 12 7.5C12 6.30653 11.5259 5.16193 10.682 4.31802C9.83807 3.47411 8.69347 3 7.5 3C6.30653 3 5.16193 3.47411 4.31802 4.31802C3.47411 5.16193 3 6.30653 3 7.5C3 8.69347 3.47411 9.83807 4.31802 10.682C5.16193 11.5259 6.30653 12 7.5 12ZM5.53125 8.625H8.625C8.69959 8.625 8.77113 8.59537 8.82387 8.54262C8.87662 8.48988 8.90625 8.41834 8.90625 8.34375C8.90625 8.26916 8.87662 8.19762 8.82387 8.14488C8.77113 8.09213 8.69959 8.0625 8.625 8.0625H6.375C6.00204 8.0625 5.64435 7.91434 5.38063 7.65062C5.11691 7.3869 4.96875 7.02921 4.96875 6.65625C4.96875 6.28329 5.11691 5.9256 5.38063 5.66188C5.64435 5.39816 6.00204 5.25 6.375 5.25H6.9375V4.125H8.0625V5.25H9.46875V6.375H6.375C6.30041 6.375 6.22887 6.40463 6.17613 6.45738C6.12338 6.51012 6.09375 6.58166 6.09375 6.65625C6.09375 6.73084 6.12338 6.80238 6.17613 6.85512C6.22887 6.90787 6.30041 6.9375 6.375 6.9375H8.625C8.99796 6.9375 9.35565 7.08566 9.61937 7.34938C9.88309 7.6131 10.0312 7.97079 10.0312 8.34375C10.0312 8.71671 9.88309 9.0744 9.61937 9.33812C9.35565 9.60184 8.99796 9.75 8.625 9.75H8.0625V10.875H6.9375V9.75H5.53125V8.625Z" },
};

/* ─── home screen ─── */
export const BALANCE = "AED 14,480.24";
export const BALANCE_SPARK = [
  42, 46, 40, 52, 58, 51, 63, 70, 64, 58, 66, 74, 68, 60, 55, 62,
  70, 78, 72, 66, 74, 82, 76, 70, 78, 86, 80, 74, 82, 90,
];

export const QUICK_ACTIONS = ["Send", "Request", "Deposit", "Pay Bills", "Invoice"] as const;

export type FeedTxn = {
  merchant: string; sub: string; date: string; amount: number; positive?: boolean;
};

export const RECENT_TRANSACTIONS: FeedTxn[] = [
  { merchant: "Noon Food",   sub: "Food Delivery", date: "Today, 8:24 PM",   amount: 67.80 },
  { merchant: "Careem",      sub: "Ride",          date: "Today, 6:10 PM",   amount: 42.00 },
  { merchant: "Salary",      sub: "Emirates NBD",  date: "Today, 9:00 AM",   amount: 12400.00, positive: true },
  { merchant: "Zara",        sub: "Clothing",      date: "Yesterday",        amount: 285.00 },
  { merchant: "Starbucks",   sub: "Coffee",        date: "Yesterday",        amount: 32.00 },
  { merchant: "DEWA",        sub: "Electricity",   date: "May 13",           amount: 350.00 },
  { merchant: "Talabat",     sub: "Food Delivery", date: "May 12",           amount: 78.90 },
  { merchant: "Netflix",     sub: "Streaming",     date: "May 10",           amount: 45.00 },
];

/* ─── chart helpers ─── */
export type Range = "1D" | "1W" | "1M" | "3M" | "1Y";
export const RANGES: Range[] = ["1D", "1W", "1M", "3M", "1Y"];

function scale(arr: number[], target: number): number[] {
  const sum = arr.reduce((s, v) => s + v, 0) || 1;
  const f = target / sum;
  return arr.map(v => v * f);
}

export function getChartData(cat: string, range: Range): number[] {
  const seg = SPENDING_SEGMENTS.find(s => s.name === cat);
  const monthly = seg?.value ?? 1000;
  const base = CATEGORY_DAILY[cat] ?? CATEGORY_DAILY.Food;

  if (range === "1M") return scale(base, monthly);
  if (range === "1W") return scale(base.slice(-7), monthly / 4.33);
  if (range === "1D") {
    const pattern = [0.1, 0.05, 0.02, 0.02, 0.05, 0.15, 0.4, 0.7, 1.0, 0.75, 0.6, 0.9,
                     1.2, 0.85, 0.5, 0.4, 0.55, 0.95, 1.3, 1.1, 0.8, 0.6, 0.35, 0.15];
    return scale(pattern, monthly / 30);
  }
  if (range === "3M") {
    const mar = base.map(v => v * 0.78);
    const apr = base.map(v => v * 0.88);
    return scale([...mar, ...apr, ...base], monthly * 2.66);
  }
  const yearly = [0.80, 0.76, 0.83, 0.87, 0.85, 0.92, 0.89, 0.84, 0.91, 0.96, 0.98, 1.0];
  return scale(yearly, monthly * 10.61);
}

export function getRangeTotal(cat: string, range: Range): number {
  return getChartData(cat, range).reduce((s, v) => s + v, 0);
}

export function getXAxisLabels(range: Range, june = false): string[] {
  const m = june ? "Jun" : "May";
  switch (range) {
    case "1D": return ["06:00", "12:00", "18:00", "23:00"];
    case "1W": return ["Mon", "Wed", "Fri", "Sun"];
    case "1M": return [`${m} 3`, `${m} 11`, `${m} 19`, `${m} 27`];
    case "3M": return june ? ["Apr 9", "May 2", "May 28", "Jun 23"] : ["Mar 9", "Apr 2", "Apr 28", "May 23"];
    case "1Y": return ["Jul '25", "Oct '25", "Jan '26", "Apr '26"];
  }
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const moneyShort = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 });
