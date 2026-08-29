/* ───────────────────────────────────────────────────────────────
   Quorum primitives — the generic layer.

   Rebuilt from the interaction patterns in the Design Companion
   reference (jbchandru97/design-companion). Nothing in this folder
   knows about threads, messages, presence, agents, or Convex. They
   are shells and visual pieces; product meaning is composed on top
   of them in components/quorum/overlay and /workspace.

   Importing this barrel also brings in the primitives' stylesheet,
   so a consumer never has to remember to load it separately.
   ─────────────────────────────────────────────────────────────── */

import "./primitives.css";

export { OverlayRoot, OverlayPassive } from "./OverlayRoot";
export type { OverlayRootProps } from "./OverlayRoot";

export {
  FloatingToolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarDivider,
} from "./FloatingToolbar";
export type { ToolbarButtonProps } from "./FloatingToolbar";

export { InspectHighlight } from "./InspectHighlight";
export type { Rect, InspectVariant, InspectHighlightProps } from "./InspectHighlight";

export { SidePanel } from "./SidePanel";
export type { SidePanelProps } from "./SidePanel";

export { Popover, PopoverRow, PopoverEmpty, Tooltip } from "./Popover";
export type { PopoverProps, Placement, Align } from "./Popover";

export { Avatar, AvatarStack } from "./AvatarStack";
export type { Person } from "./AvatarStack";

export { Shimmer, Skeleton, SkeletonLines } from "./Shimmer";

export { AgentSteps } from "./AgentSteps";
export type { AgentStep, StepStatus } from "./AgentSteps";

export { SourceChip, SourceChips } from "./SourceChip";
export type { SourceChipProps } from "./SourceChip";

/* Straight from the data module, not through the chip: a server
   component that lists every mark needs the real object, and a plain
   value re-exported from a `"use client"` file arrives as a client
   reference instead — `Object.entries` on it comes back empty. */
export { PROVENANCE_LEGEND, PROVENANCE_ORDER } from "./provenance";
export type { Provenance } from "./provenance";
