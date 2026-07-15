import type { Metadata } from "next";
import Link from "next/link";
import Chat from "@/components/Chat";

export const metadata: Metadata = {
  title: "Ask Kashiwaya — guest assistant",
  description:
    "Ask anything about staying at Kashiwaya Inn and exploring Nagiso — meals, e-bikes, hiking routes, check-in and check-out.",
  robots: { index: false },
};

export default function ChatPage() {
  return (
    <main className="chatpage">
      <header className="chatpage-head">
        <Link href="/" className="chatpage-brand">
          Kashiwaya <em>Inn</em>
        </Link>
        <span className="chatpage-sub">Guest assistant · ご案内チャット</span>
      </header>
      <div className="chatpage-body">
        <Chat />
      </div>
    </main>
  );
}
