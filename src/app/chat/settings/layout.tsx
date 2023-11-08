import type { ReactNode } from "react";
import { TabBar } from "~/components/chat/tab-bar";
import type { Tab } from "~/components/chat/tab-bar";

const TABS: Tab[] = [
  { name: "OpenAI", href: "/chat/settings/openai" },
  { name: "Bots", href: "/chat/settings/bots" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <TabBar title="Settings" tabs={TABS} />
      {children}
    </div>
  );
}
