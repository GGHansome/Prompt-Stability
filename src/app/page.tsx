"use client";
import { createChat } from "@/store/chat-stores";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const id = createChat();
    redirect(`/chat/${id}`);
  }, []);
}
