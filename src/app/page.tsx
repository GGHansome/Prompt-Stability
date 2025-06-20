"use client";
import { useStore } from "@/store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const createChat = useStore((state) => state.createChat);
  useEffect(() => {
    const id = createChat();
    redirect(`/chat/${id}`);
  }, []);
}
