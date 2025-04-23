"use client";

import Chat from "@/components";
import { getChat } from "@/store/chat-stores";
import { Message } from "ai";
import { use, useEffect, useState } from "react";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    setMessages(getChat(id));
  }, []);

  return ( 
    <>
      <Chat id={id} initialMessages={messages} />
    </>
  );
}
