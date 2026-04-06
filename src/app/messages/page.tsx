import type { Metadata } from "next";
import { MessagesInbox } from "./MessagesInbox";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return <MessagesInbox />;
}
