import type { ReactNode } from "react";
import { SidebarLayout } from "~/components/chat/sidebar-layout";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
