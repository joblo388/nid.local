import type { Metadata } from "next";
import { MessagesInbox } from "./MessagesInbox";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return <MessagesInbox />;
}
