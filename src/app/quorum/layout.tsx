import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/quorum/workspace/WorkspaceShell";

export const metadata: Metadata = {
  title: "Quorum · Workspace",
  description: "Threads, decisions and actions from product reviews.",
};

export default function QuorumLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
