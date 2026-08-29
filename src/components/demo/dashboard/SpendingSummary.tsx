"use client";
import { Fragment, useState, useEffect } from "react";

function IconChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99999 10.879L13.7125 7.1665L14.773 8.227L9.99999 13L5.22699 8.227L6.28749 7.1665L9.99999 10.879Z" fill="#5C5C5C"/>
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8.49364 2.62164L13.9236 12.1352C13.9737 12.2228 14 12.3223 14 12.4235C14 12.5247 13.9737 12.6241 13.9236 12.7117C13.8736 12.7994 13.8017 12.8722 13.715 12.9228C13.6283 12.9734 13.5301 13 13.43 13H2.57C2.46995 13 2.37165 12.9734 2.285 12.9228C2.19835 12.8722 2.12639 12.7994 2.07636 12.7117C2.02634 12.6241 2 12.5247 2 12.4235C2 12.3223 2.02634 12.2228 2.07637 12.1352L7.50636 2.62164C7.5564 2.53399 7.62835 2.46121 7.715 2.41061C7.80165 2.36001 7.89995 2.33337 8 2.33337C8.10005 2.33337 8.19835 2.36001 8.285 2.41061C8.37165 2.46121 8.4436 2.53399 8.49364 2.62164ZM7.42998 10.1172V11.2703H8.57002V10.1172H7.42998ZM7.42998 6.08111V8.964H8.57002V6.08111H7.42998Z" fill="#FA7319"/>
    </svg>
  );
}

function IconShopping() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5.875 2.5H14.125C14.2414 2.5 14.3563 2.52711 14.4604 2.57918C14.5646 2.63125 14.6551 2.70685 14.725 2.8L16.75 5.5V16.75C16.75 16.9489 16.671 17.1397 16.5303 17.2803C16.3897 17.421 16.1989 17.5 16 17.5H4C3.80109 17.5 3.61032 17.421 3.46967 17.2803C3.32902 17.1397 3.25 16.9489 3.25 16.75V5.5L5.275 2.8C5.34486 2.70685 5.43545 2.63125 5.53959 2.57918C5.64373 2.52711 5.75857 2.5 5.875 2.5ZM15.25 7H4.75V16H15.25V7ZM14.875 5.5L13.75 4H6.25L5.125 5.5H14.875ZM7.75 8.5V10C7.75 10.5967 7.98705 11.169 8.40901 11.591C8.83097 12.0129 9.40326 12.25 10 12.25C10.5967 12.25 11.169 12.0129 11.591 11.591C12.0129 11.169 12.25 10.5967 12.25 10V8.5H13.75V10C13.75 10.9946 13.3549 11.9484 12.6517 12.6517C11.9484 13.3549 10.9946 13.75 10 13.75C9.00544 13.75 8.05161 13.3549 7.34835 12.6517C6.64509 11.9484 6.25 10.9946 6.25 10V8.5H7.75Z" fill="#335CFF"/>
    </svg>
  );
}

function IconUtilities() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16 17.5H4C3.80109 17.5 3.61032 17.421 3.46967 17.2803C3.32902 17.1397 3.25 16.9489 3.25 16.75V3.25C3.25 3.05109 3.32902 2.86032 3.46967 2.71967C3.61032 2.57902 3.80109 2.5 4 2.5H16C16.1989 2.5 16.3897 2.57902 16.5303 2.71967C16.671 2.86032 16.75 3.05109 16.75 3.25V16.75C16.75 16.9489 16.671 17.1397 16.5303 17.2803C16.3897 17.421 16.1989 17.5 16 17.5ZM15.25 16V4H4.75V16H15.25ZM7 6.25H13V7.75H7V6.25ZM7 9.25H13V10.75H7V9.25ZM7 12.25H13V13.75H7V12.25Z" fill="#47C2FF"/>
    </svg>
  );
}

function IconOthers() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 17.5C5.85775 17.5 2.5 14.1423 2.5 10C2.5 5.85775 5.85775 2.5 10 2.5C14.1423 2.5 17.5 5.85775 17.5 10C17.5 14.1423 14.1423 17.5 10 17.5ZM10 16C11.5913 16 13.1174 15.3679 14.2426 14.2426C15.3679 13.1174 16 11.5913 16 10C16 8.4087 15.3679 6.88258 14.2426 5.75736C13.1174 4.63214 11.5913 4 10 4C8.4087 4 6.88258 4.63214 5.75736 5.75736C4.63214 6.88258 4 8.4087 4 10C4 11.5913 4.63214 13.1174 5.75736 14.2426C6.88258 15.3679 8.4087 16 10 16ZM7.375 11.5H11.5C11.5995 11.5 11.6948 11.4605 11.7652 11.3902C11.8355 11.3198 11.875 11.2245 11.875 11.125C11.875 11.0255 11.8355 10.9302 11.7652 10.8598C11.6948 10.7895 11.5995 10.75 11.5 10.75H8.5C8.00272 10.75 7.52581 10.5525 7.17417 10.2008C6.82254 9.84919 6.625 9.37228 6.625 8.875C6.625 8.37772 6.82254 7.90081 7.17417 7.54917C7.52581 7.19754 8.00272 7 8.5 7H9.25V5.5H10.75V7H12.625V8.5H8.5C8.40054 8.5 8.30516 8.53951 8.23483 8.60983C8.16451 8.68016 8.125 8.77554 8.125 8.875C8.125 8.97446 8.16451 9.06984 8.23483 9.14017C8.30516 9.21049 8.40054 9.25 8.5 9.25H11.5C11.9973 9.25 12.4742 9.44754 12.8258 9.79917C13.1775 10.1508 13.375 10.6277 13.375 11.125C13.375 11.6223 13.1775 12.0992 12.8258 12.4508C12.4742 12.8025 11.9973 13 11.5 13H10.75V14.5H9.25V13H7.375V11.5Z" fill="#5C5C5C"/>
    </svg>
  );
}

// Gauge SVG segments from Figma
function GaugeBackground() {
  return (
    <svg width="252" height="124" viewBox="0 0 252 124" fill="none" style={{ display: "block" }}>
      <mask id="gauge-bg-mask" maskUnits="userSpaceOnUse" x="0" y="-2" width="252" height="128" fill="black">
        <rect fill="white" y="-2" width="252" height="128"/>
        <path d="M2 124C2 107.716 5.20736 91.5916 11.4389 76.5472C17.6705 61.5029 26.8043 47.8332 38.3188 36.3187C49.8332 24.8043 63.5029 15.6705 78.5473 9.43893C93.5916 3.20735 109.716 -2.13538e-06 126 0C142.284 2.13538e-06 158.408 3.20736 173.453 9.43894C188.497 15.6705 202.167 24.8043 213.681 36.3188C225.196 47.8332 234.329 61.5029 240.561 76.5473C246.793 91.5916 250 107.716 250 124L225.2 124C225.2 110.973 222.634 98.0733 217.649 86.0378C212.664 74.0023 205.357 63.0666 196.145 53.855C186.933 44.6434 175.998 37.3364 163.962 32.3512C151.927 27.3659 139.027 24.8 126 24.8C112.973 24.8 100.073 27.3659 88.0378 32.3511C76.0023 37.3364 65.0666 44.6434 55.855 53.855C46.6434 63.0666 39.3364 74.0023 34.3512 86.0378C29.3659 98.0733 26.8 110.973 26.8 124H2Z"/>
      </mask>
      <path d="M2 124C2 107.716 5.20736 91.5916 11.4389 76.5472C17.6705 61.5029 26.8043 47.8332 38.3188 36.3187C49.8332 24.8043 63.5029 15.6705 78.5473 9.43893C93.5916 3.20735 109.716 -2.13538e-06 126 0C142.284 2.13538e-06 158.408 3.20736 173.453 9.43894C188.497 15.6705 202.167 24.8043 213.681 36.3188C225.196 47.8332 234.329 61.5029 240.561 76.5473C246.793 91.5916 250 107.716 250 124L225.2 124C225.2 110.973 222.634 98.0733 217.649 86.0378C212.664 74.0023 205.357 63.0666 196.145 53.855C186.933 44.6434 175.998 37.3364 163.962 32.3512C151.927 27.3659 139.027 24.8 126 24.8C112.973 24.8 100.073 27.3659 88.0378 32.3511C76.0023 37.3364 65.0666 44.6434 55.855 53.855C46.6434 63.0666 39.3364 74.0023 34.3512 86.0378C29.3659 98.0733 26.8 110.973 26.8 124H2Z" fill="#F4F4F4"/>
      <path d="M2 124C2 107.716 5.20736 91.5916 11.4389 76.5472C17.6705 61.5029 26.8043 47.8332 38.3188 36.3187C49.8332 24.8043 63.5029 15.6705 78.5473 9.43893C93.5916 3.20735 109.716 -2.13538e-06 126 0C142.284 2.13538e-06 158.408 3.20736 173.453 9.43894C188.497 15.6705 202.167 24.8043 213.681 36.3188C225.196 47.8332 234.329 61.5029 240.561 76.5473C246.793 91.5916 250 107.716 250 124L225.2 124C225.2 110.973 222.634 98.0733 217.649 86.0378C212.664 74.0023 205.357 63.0666 196.145 53.855C186.933 44.6434 175.998 37.3364 163.962 32.3512C151.927 27.3659 139.027 24.8 126 24.8C112.973 24.8 100.073 27.3659 88.0378 32.3511C76.0023 37.3364 65.0666 44.6434 55.855 53.855C46.6434 63.0666 39.3364 74.0023 34.3512 86.0378C29.3659 98.0733 26.8 110.973 26.8 124H2Z" stroke="white" strokeWidth="4" mask="url(#gauge-bg-mask)"/>
    </svg>
  );
}

function GaugeBlue() {
  return (
    <svg width="128" height="124" viewBox="0 0 128 124" fill="none" style={{ display: "block" }}>
      <mask id="gauge-blue-mask" maskUnits="userSpaceOnUse" x="0" y="-2" width="128" height="128" fill="black">
        <rect fill="white" y="-2" width="128" height="128"/>
        <path d="M2 124C2 91.1131 15.0643 59.5733 38.3188 36.3188C61.5733 13.0642 93.1132 -3.92172e-07 126 0V24.8C99.6905 24.8 74.4586 35.2514 55.855 53.855C37.2514 72.4586 26.8 97.6905 26.8 124H2Z"/>
      </mask>
      <path d="M2 124C2 91.1131 15.0643 59.5733 38.3188 36.3188C61.5733 13.0642 93.1132 -3.92172e-07 126 0V24.8C99.6905 24.8 74.4586 35.2514 55.855 53.855C37.2514 72.4586 26.8 97.6905 26.8 124H2Z" fill="#335CFF"/>
      <path d="M2 124C2 91.1131 15.0643 59.5733 38.3188 36.3188C61.5733 13.0642 93.1132 -3.92172e-07 126 0V24.8C99.6905 24.8 74.4586 35.2514 55.855 53.855C37.2514 72.4586 26.8 97.6905 26.8 124H2Z" stroke="white" strokeWidth="4" mask="url(#gauge-blue-mask)"/>
    </svg>
  );
}

function GaugeSky() {
  return (
    <svg width="93" height="57" viewBox="0 0 93 57" fill="none" style={{ display: "block" }}>
      <mask id="gauge-sky-mask" maskUnits="userSpaceOnUse" x="0" y="-2" width="93" height="59" fill="black">
        <rect fill="white" y="-2" width="93" height="59"/>
        <path d="M2 0C34.8868 3.92172e-07 66.4267 13.0642 89.6812 36.3187L72.145 53.855C53.5414 35.2514 28.3095 24.8 2 24.8V0Z"/>
      </mask>
      <path d="M2 0C34.8868 3.92172e-07 66.4267 13.0642 89.6812 36.3187L72.145 53.855C53.5414 35.2514 28.3095 24.8 2 24.8V0Z" fill="#47C2FF"/>
      <path d="M2 0C34.8868 3.92172e-07 66.4267 13.0642 89.6812 36.3187L72.145 53.855C53.5414 35.2514 28.3095 24.8 2 24.8V0Z" stroke="white" strokeWidth="4" mask="url(#gauge-sky-mask)"/>
    </svg>
  );
}

function useCountUp(target: number, duration = 650) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const categories = [
  { label: "Shopping",  numericAmount: 900,  icon: IconShopping,  bg: "var(--state-information-lighter)" },
  { label: "Utilities", numericAmount: 600,  icon: IconUtilities, bg: "var(--state-verified-lighter)"    },
  { label: "Others",    numericAmount: 200,  icon: IconOthers,    bg: "var(--state-faded-lighter)"       },
];

export default function SpendingSummary() {
  const spendTotal = useCountUp(1800);
  const [catProgress, setCatProgress] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 650);
      setCatProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-white-0)",
        border: "1px solid var(--stroke-soft-200)",
        borderRadius: 16,
        boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
        padding: 16,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes gaugeSegIn {
          from { opacity: 0; transform: scale(0.88) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "stretch" }}>
        <div style={{ flex: 1, paddingTop: 4, paddingBottom: 4 }}>
          <span style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14, fontWeight: 500,
            color: "var(--text-strong-950)", lineHeight: "20px",
          }}>
            Spending Summary
          </span>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 2,
          paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 6,
          backgroundColor: "var(--bg-white-0)",
          border: "1px solid var(--stroke-soft-200)",
          borderRadius: 8,
          boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
          cursor: "pointer",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 14, fontWeight: 400, color: "var(--text-strong-950)",
        }}>
          Last Week
          <span style={{ color: "var(--icon-sub-600)", display: "flex" }}>
            <IconChevronDown />
          </span>
        </button>
      </div>

      {/* Gauge */}
      <div style={{ alignSelf: "stretch", height: 124, position: "relative", overflow: "hidden", display: "flex", justifyContent: "center" }}>
        <div style={{ width: 252, height: 124, position: "relative", flexShrink: 0 }}>
          {/* Background gray ring */}
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <GaugeBackground />
          </div>
          {/* Blue (Shopping) segment — sweeps in */}
          <div style={{ position: "absolute", left: 0, top: 0, animation: "gaugeSegIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both" }}>
            <GaugeBlue />
          </div>
          {/* Sky (Utilities) segment — sweeps in with slight offset */}
          <div style={{ position: "absolute", left: 124, top: 0, animation: "gaugeSegIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.22s both" }}>
            <GaugeSky />
          </div>

          {/* Center text */}
          <div style={{
            position: "absolute", bottom: 4, left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <p style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 12, fontWeight: 500, letterSpacing: "0.48px",
              textTransform: "uppercase", color: "var(--text-sub-600)",
              margin: "0 0 2px", lineHeight: "16px",
            }}>
              SPEND
            </p>
            <p style={{
              fontFamily: "var(--font-inter-display), 'Inter Display', Inter, sans-serif",
              fontSize: 24, fontWeight: 500,
              color: "var(--text-strong-950)", margin: 0, lineHeight: "32px",
            }}>
              AED {spendTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, alignSelf: "stretch" }}>
        {categories.map((cat, i) => (
          <Fragment key={cat.label}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", backgroundColor: cat.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <cat.icon />
              </div>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
                <p style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12, fontWeight: 400, color: "var(--text-sub-600)",
                  margin: 0, lineHeight: "16px",
                }}>
                  {cat.label}
                </p>
                <p style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 14, fontWeight: 500, color: "var(--text-strong-950)",
                  margin: 0, lineHeight: "20px",
                }}>
                  AED {(catProgress * cat.numericAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            {i < categories.length - 1 && (
              <div style={{
                width: 1, alignSelf: "stretch",
                backgroundColor: "var(--stroke-soft-200)", flexShrink: 0,
              }} />
            )}
          </Fragment>
        ))}
      </div>

      {/* Spending limit notice */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 4,
        backgroundColor: "var(--bg-white-0)",
        border: "1px solid var(--stroke-soft-200)",
        borderRadius: 6,
        boxShadow: "0px 1px 1px rgba(10,13,20,0.03)",
        alignSelf: "stretch", marginTop: "auto",
      }}>
        <p style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 12, fontWeight: 400, color: "var(--text-sub-600)",
          margin: 0, flex: 1, lineHeight: "16px",
        }}>
          Your weekly spending limit is{" "}
          <span style={{ fontWeight: 500 }}>AED 2000.</span>
        </p>
        <span style={{ flexShrink: 0, display: "flex" }}>
          <IconAlert />
        </span>
      </div>
    </div>
  );
}
