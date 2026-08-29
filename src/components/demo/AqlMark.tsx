/* ───────────────────────────────────────────────────────────────
   The Aql AI mark.

   Two things differ from the mark it may replace:

   1. The artwork does not fill its canvas. Supplied at 745×750, the
      shape itself occupies 60.14,40.2 → 623.13×670.61 — 84% of the
      width, 89% of the height — and it is NOT square (aspect 0.929).
      The old mark filled its 16×16 box completely, so at an identical
      `size` this renders visibly smaller. `fit="tight"` crops to the
      real bounds so both marks occupy the same optical area.

   2. The gradient id is generated per instance. The old MalLogo
      hardcoded its mask and gradient ids, so two instances on a page
      collided and one won — this leaves that behind.
   ─────────────────────────────────────────────────────────────── */

import { useId } from "react";

/* measured from the supplied artwork, not eyeballed */
export const MARK_BOUNDS = { x: 60.14, y: 40.2, w: 623.13, h: 670.61 };
const RAW_BOX = "0 0 745 750";
const TIGHT_BOX = `${MARK_BOUNDS.x} ${MARK_BOUNDS.y} ${MARK_BOUNDS.w} ${MARK_BOUNDS.h}`;

const D = [
  "M358.832 40.1976C359.057 40.2056 359.258 40.3493 359.466 40.4381C359.649 45.1589 359.351 49.9937 359.349 54.7525C359.444 65.2021 359.46 75.6555 359.402 86.1071L359.394 169.06L359.404 434.371L359.41 575.362L359.432 617.42C359.425 623.771 359.526 630.273 359.23 636.619C358.861 638.784 357.173 641.364 355.352 642.553C350.087 645.995 342.714 643.729 340.765 637.588C339.409 633.31 338.666 629.107 337.751 624.755C336.314 617.828 334.794 610.921 333.187 604.03C325.085 570.234 315.615 542.115 297.288 512.587C262.015 458.934 208.739 439.033 148.337 425.48C130.486 421.407 112.511 417.893 94.4401 414.945L77.4743 412.354C72.5471 411.615 65.8208 411.32 62.3644 407.367C60.7105 405.471 59.9227 402.972 60.1907 400.471C60.3016 399.378 60.5894 398.31 61.0427 397.309C62.4637 394.144 64.7311 392.557 68.0246 391.868C73.2613 390.774 78.8039 390.011 84.0979 389.169C93.2786 387.725 102.441 386.169 111.584 384.504C163.66 375.13 223.89 361.06 265.456 326.508C321.802 279.67 336.097 192.87 347.331 124.385C351.561 98.5977 356.439 65.9526 358.832 40.1976Z",
  "M438.946 376.947C438.975 373.873 438.107 373.741 437.356 371.297C437.349 369.647 438.377 366.878 438.685 365.441C440.356 357.638 443.752 351.964 447.448 345.005C450.758 338.768 453.139 331.623 457.172 325.674C457.627 325.503 458.081 325.335 458.539 325.167C461.466 321.665 465.421 315.695 468.226 311.844L478.998 296.888C482.336 292.197 484.905 289.483 487.03 283.703C487.685 281.918 487.586 282.074 488.995 280.597C509.456 294.593 531.9 304.611 555.58 311.99C557.439 312.57 559.239 313.048 561.057 313.779C573.404 317.439 585.886 320.629 598.477 323.342C602.225 324.147 618.869 326.992 621.23 328.017C633.347 330.463 645.522 332.635 657.74 334.524C663.087 335.392 672.63 336.248 677.426 337.843C686.866 340.983 684.293 356.322 673.797 356.616C657.217 359.088 640.863 361.982 624.451 364.84C618.264 366.645 605.525 368.69 598.486 370.234C582.751 373.685 569.048 377.754 553.668 382.197C549.672 384.013 542.099 386.142 537.388 387.968C525.718 392.522 514.359 397.832 503.384 403.867C498.396 406.587 493.185 410.28 488.474 413.499C486.34 414.96 482.54 418.211 480.538 419.358L480.093 419.607L479.984 419.317C478.363 419.736 474.486 423.525 473.1 424.89C468.128 421.928 462.859 414.473 458.237 410.42C452.767 405.096 449.251 397.944 445.8 391.25C443.651 387.07 438.92 381.546 438.946 376.947Z",
  "M553.668 382.197C551.966 381.739 543.055 384.322 542.166 385.277C537.36 380.927 539.601 370.27 539.822 364.368C539.954 360.906 541.382 357.339 542.33 354.014C543.565 349.63 544.752 345.232 545.884 340.817C547.032 336.334 547.612 332.169 548.622 327.855C549.26 325.146 553.036 317.578 553.94 314.359C553.666 313.582 553.435 312.927 553.251 312.402C554.686 312.07 557.913 314.463 561.057 313.779C573.404 317.439 585.886 320.629 598.477 323.342C602.225 324.147 618.869 326.992 621.23 328.017C633.347 330.463 645.522 332.635 657.74 334.524C663.087 335.392 672.63 336.248 677.426 337.843C686.866 340.983 684.293 356.322 673.797 356.616C657.217 359.088 640.863 361.982 624.451 364.84C618.264 366.645 605.525 368.69 598.486 370.234C582.751 373.685 569.048 377.754 553.668 382.197Z",
  "M624.451 364.84C625.058 362.618 637.341 362.728 640.042 361.016C638.152 352.657 639.802 345.02 639.332 336.499C638.895 328.609 624.773 331.606 620.87 328.481L621.23 328.017C633.347 330.463 645.522 332.635 657.74 334.524C663.087 335.392 672.63 336.248 677.426 337.843C686.866 340.983 684.293 356.322 673.797 356.616C657.217 359.088 640.863 361.982 624.451 364.84Z",
  "M384.155 364.566C383.803 358.916 384.028 351.145 384.035 345.346L384.076 155.782L384.042 128.378C384.037 123.618 383.977 118.854 384.12 114.092C384.176 111.143 384.652 109.646 386.494 107.349C389.638 103.428 396.327 102.585 399.956 106.219C403.858 110.132 404.499 117.45 405.583 122.761C406.854 128.745 408.158 134.722 409.501 140.69C421.538 193.021 442.894 249.015 488.995 280.597C487.586 282.074 487.685 281.918 487.03 283.703C484.905 289.483 482.336 292.197 478.998 296.888L468.226 311.844C465.421 315.695 461.466 321.665 458.539 325.167C458.081 325.335 457.627 325.503 457.172 325.674C453.139 331.623 450.758 338.768 447.448 345.005C443.752 351.964 440.356 357.638 438.685 365.441C438.377 366.878 437.349 369.647 437.356 371.297C438.107 373.741 438.975 373.873 438.946 376.947C438.7 376.831 438.358 376.686 438.146 376.525C435.815 375.168 427.78 370.572 425.34 370.251C416.356 369.063 407.067 366.254 398.304 364.277C392.731 363.018 391.079 364.598 385.411 361.875L384.155 364.566Z",
  "M384.155 364.566L385.411 361.875C391.079 364.598 392.731 363.018 398.304 364.277C407.067 366.254 416.356 369.063 425.34 370.251C427.78 370.572 435.815 375.168 438.146 376.525C438.358 376.686 438.7 376.831 438.946 376.947C438.92 381.546 443.651 387.07 445.8 391.25C449.251 397.944 452.767 405.096 458.237 410.42C462.859 414.473 468.128 421.928 473.1 424.89C474.486 423.525 478.363 419.736 479.984 419.317L480.093 419.607C465.478 432.704 453.033 445.765 443.281 462.897C442.531 464.217 441.149 466.682 440.274 467.775C439.696 466.778 441.078 465.51 441.014 463.911C440.409 463.051 439.404 462.409 438.441 462.045C424.822 456.906 411.664 449.643 396.944 448.2C394.124 447.923 392.319 446.569 389.476 447.9C388.771 447.672 388.812 447.683 388.044 447.55L388.237 448.382L387.805 448.675C386.015 447.585 387.406 447.09 385.747 445.797C384.633 446.285 384.95 449.562 383.964 451.289C383.392 443.388 384.101 428.592 384.03 420.039L384.018 383.969C384.03 378.411 383.763 369.92 384.155 364.566Z",
  "M383.964 451.289C384.95 449.562 384.633 446.285 385.747 445.797C387.406 447.09 386.015 447.585 387.805 448.675L388.237 448.382L388.044 447.55C388.812 447.683 388.771 447.672 389.476 447.9C392.319 446.569 394.124 447.923 396.944 448.2C411.664 449.643 424.822 456.906 438.441 462.045C439.404 462.409 440.409 463.051 441.014 463.911C441.078 465.51 439.696 466.778 440.274 467.775C435.905 476.276 430.683 486.367 427.228 495.233C410.625 537.872 401.826 585.373 394.975 630.528C391.648 652.463 387.368 679.546 385.241 701.628L383.915 701.395L383.921 539.219L384.008 480.941C384.002 473.204 383.371 458.5 383.964 451.289Z",
  "M383.915 701.395L385.241 701.628C385.034 704.693 384.763 707.756 384.424 710.809C383.683 707.806 383.789 704.468 383.915 701.395Z",
];

/* The mark is two halves meeting on a near-vertical seam at x≈372:
   path 0 is the left wing (x 60→359), paths 1–7 the right (x 384→683).
   The ratchet pulls them apart across that seam while it rotates. */
const LEFT_WING = 1;

/* Every point sits within ~336 user units of the centre, so a rotating
   mark needs ~672 of room — more than the 623-wide tight box. Rather
   than pad the viewBox (which would shrink the mark at every size, the
   opposite of what small sizes need), let the animated variant spill. */
export function AqlMark({
  size = 16, solid = false, fit = "tight",
  animate = "none", spread = 30, slide = 60, delay = "0s",
}: {
  size?: number; solid?: boolean; fit?: "raw" | "tight";
  /* ratchet  — the thinking state: turns and splits continuously.
     pendulum — the idle brand mark: one turn, then a long rest.
     Both split, because the mark has 2-fold symmetry: a bare 180°
     turn lands on a shape identical to where it started, so without
     the wings parting there is nothing to see. */
  animate?: "none" | "ratchet" | "pendulum";
  spread?: number; slide?: number; delay?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const spine = `aql-s-${uid}`;   // the long stroke: light at the top, dark into the centre
  const body  = `aql-b-${uid}`;   // everything else: runs the ramp the other way
  const on = animate !== "none";

  /* the two shipped envelopes, with the split riding along on each */
  const ratchet = animate === "ratchet";
  const dur = ratchet ? "1.8s" : "15s";
  /* A full turn, not a there-and-back. It accelerates into the half turn,
     eases through it at its widest, then carries on the same way round to
     360 and closes. 360 and 0 are the same pose, so the loop is seamless. */
  const half = ratchet ? 33.3 : 3.3;   // % at the half turn, widest point
  const full = ratchet ? 66.7 : 6.7;   // % at the full turn, closed again
  const ease = "cubic-bezier(.42,0,.58,1)";

  const frames = (ax: number, ay: number) => `
      0%{transform:translate(0,0); animation-timing-function:${ease}}
      ${half}%{transform:translate(${ax}px,${ay}px); animation-timing-function:${ease}}
      ${full}%{transform:translate(0,0)} 100%{transform:translate(0,0)}`;

  const css = on ? `
    .sp-${uid}{transform-box:view-box; transform-origin:50% 50%;
      animation:sp-${uid} ${dur} ${delay} infinite both}
    .wa-${uid}{animation:wa-${uid} ${dur} ${delay} infinite both}
    .wb-${uid}{animation:wb-${uid} ${dur} ${delay} infinite both}
    @keyframes sp-${uid}{
      0%{transform:rotate(0deg); animation-timing-function:${ease}}
      ${half}%{transform:rotate(180deg); animation-timing-function:${ease}}
      ${full}%{transform:rotate(360deg)} 100%{transform:rotate(360deg)}
    }
    @keyframes wa-${uid}{${frames(-spread, -slide)}}
    @keyframes wb-${uid}{${frames(spread, slide)}}
    @media (prefers-reduced-motion:reduce){
      .sp-${uid},.wa-${uid},.wb-${uid}{animation:none}
    }` : "";

  const fill = (i: number) => solid ? "#171717" : `url(#${i === 0 ? spine : body})`;

  return (
    <svg width={size} height={size} viewBox={fit === "raw" ? RAW_BOX : TIGHT_BOX} fill="none"
         style={on ? { overflow: "visible" } : undefined}>
      {on && <style>{css}</style>}
      <g className={on ? `sp-${uid}` : undefined}>
        <g className={on ? `wa-${uid}` : undefined}>
          {D.slice(0, LEFT_WING).map((d, i) => <path key={i} d={d} fill={fill(i)} />)}
        </g>
        <g className={on ? `wb-${uid}` : undefined}>
          {D.slice(LEFT_WING).map((d, i) => <path key={i} d={d} fill={fill(i + LEFT_WING)} />)}
        </g>
      </g>
      {!solid && (
        <defs>
          {/* userSpaceOnUse, so each gradient travels with its own half */}
          <linearGradient id={spine} x1="27" y1="40" x2="523.26" y2="410.414"
                          gradientUnits="userSpaceOnUse">
            <stop offset="0.206902" stopColor="#DBA2D3" />
            <stop offset="0.357372" stopColor="#C3A0EB" />
            <stop offset="0.450267" stopColor="#B49EFA" />
            <stop offset="0.576591" stopColor="#9479F1" />
            <stop offset="0.68959"  stopColor="#7454E8" />
            <stop offset="0.828682" stopColor="#4E29DD" />
            <stop offset="0.97122"  stopColor="#130360" />
          </linearGradient>
          <linearGradient id={body} x1="273" y1="245.5" x2="731.629" y2="697.16"
                          gradientUnits="userSpaceOnUse">
            <stop offset="0.0287801" stopColor="#130360" />
            <stop offset="0.171318"  stopColor="#4E29DD" />
            <stop offset="0.31041"   stopColor="#7454E8" />
            <stop offset="0.423409"  stopColor="#9479F1" />
            <stop offset="0.549733"  stopColor="#B49EFA" />
            <stop offset="0.642628"  stopColor="#C3A0EB" />
            <stop offset="0.793098"  stopColor="#DBA2D3" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
