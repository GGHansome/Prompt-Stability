"use client";
import { useAppStore, useStore } from "@/store";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";

export default function Page() {
  const createChat = useStore((state) => state.createChat);
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      const id = createChat();
      redirect(`/chat/${id}`);
    }
  }, [hasHydrated, createChat]);

  if (!hasHydrated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}>
        <Spin size="large"/>
      </div>
    );
  }

  return null;
}
