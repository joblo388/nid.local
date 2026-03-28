import type { Metadata } from "next";
import { ConversationView } from "./ConversationView";

export const metadata: Metadata = { title: "Conversation" };

export default function ConversationPage() {
  return <ConversationView />;
}
