import { redirect } from "next/navigation";

/* The workspace is the front door; the review host lives at /demo. */
export default function Root() {
  redirect("/quorum/threads");
}
