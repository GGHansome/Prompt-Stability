"use client";

import { Splitter, Spin } from "antd";
import ChatHistory from "@/business/ChatHistory/ChatHistory";
import { useAppStore } from "@/store";
import { use } from "react";

export default function ChatLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  return (
    <Spin
      size="large"
      spinning={!hasHydrated}
      wrapperClassName="h-full [&_.ant-spin-container]:h-full"
    >
      <Splitter>
        <Splitter.Panel defaultSize="20%">
          <ChatHistory id={id} />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="80%">{children}</Splitter.Panel>
      </Splitter>
    </Spin>
  );
}
