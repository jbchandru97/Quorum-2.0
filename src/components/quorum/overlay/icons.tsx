"use client";

/* ───────────────────────────────────────────────────────────────
   Overlay icons — one 16px grid, stroke 1.4, round caps.

   Sized and weighted identically so chrome controls read as one
   family; the CSS (`.q-pop-icon svg` etc.) sets the rendered size.
   ─────────────────────────────────────────────────────────────── */

export function IconClose() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
    </svg>
  );
}

export function IconExpand() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9.25 6.75M2.5 13.5L6.75 9.25" />
    </svg>
  );
}

/** Rounded stroke resolve mark: a circled check. */
export function IconResolve() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.1" />
      <path d="M5.4 8.3l1.9 1.9 3.4-3.9" />
    </svg>
  );
}

export function IconMessage() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 3.5h11v7.5h-6l-3 2.5v-2.5h-2z" />
    </svg>
  );
}

export function IconPlus() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}

export function IconArrowOut() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 3.5H3.5v9h9v-3M9.5 2.5h4v4M13.5 2.5L7.5 8.5" />
    </svg>
  );
}

export function IconFile() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 1.5h5.5L12 4v10.5H4z" />
      <path d="M9.5 1.5V4H12" />
    </svg>
  );
}

/* ── connector brands ─────────────────────────────────────────────
   Internal documentation reads through Atlassian; metrics read
   through Amplitude; the live web reads through Context.dev. The
   marks live in src/assets/brands and render at chip/step size. */

import atlassianSvg from "../../../assets/brands/atlassian.svg";
import amplitudeSvg from "../../../assets/brands/amplitude.svg";
import contextdevSvg from "../../../assets/brands/contextdev.svg";
import devinPng from "../../../assets/brands/devin.png";
import quorumWhiteSvg from "../../../assets/brands/quorum-white.svg";

function BrandImg({ src, size }: { src: string; size: number }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={src} width={size} height={size} alt="" aria-hidden="true" />
  );
}

export function BrandAtlassian({ size = 12 }: { size?: number }) {
  return <BrandImg src={atlassianSvg.src} size={size} />;
}

export function BrandAmplitude({ size = 12 }: { size?: number }) {
  return <BrandImg src={amplitudeSvg.src} size={size} />;
}

export function BrandContextDev({ size = 12 }: { size?: number }) {
  return <BrandImg src={contextdevSvg.src} size={size} />;
}

export function BrandDevin({ size = 12 }: { size?: number }) {
  return <BrandImg src={devinPng.src} size={size} />;
}

/** The white Quorum mark, for the dark review chrome. */
export function QuorumLogo({ size = 18 }: { size?: number }) {
  return <BrandImg src={quorumWhiteSvg.src} size={size} />;
}

/** The connector mark for a source chip, if it has one. */
export function brandFor(source: { label: string; detail?: string }): React.ReactNode | null {
  if (/playbook|internal doc/i.test(source.label)) return <BrandAtlassian />;
  if (/analytics|precedent|metric/i.test(source.label)) return <BrandAmplitude />;
  if (/context\.dev/i.test(source.detail ?? "")) return <BrandContextDev />;
  return null;
}
