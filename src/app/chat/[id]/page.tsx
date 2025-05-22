"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getChat } from "@/store/chat-stores";
import { Message } from "ai";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  useEffect(() => {
    const messages = getChat(id);
    if (messages.length > 0) {
      setInitialMessages(messages);
    }
  }, [id]);
  return (
    <>
      <Chat id={id} />
    </>
  );
}
