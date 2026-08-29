import { redirect } from "next/navigation";

export default function QuorumIndex() {
  redirect("/quorum/threads");
}
