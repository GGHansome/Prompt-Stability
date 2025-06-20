"use client";

import { getChat, saveChat } from "@/store/chat";
import { Message, useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";

export default function Chat({
  id
}: {
  id: string
}) {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    id,
    initialMessages:getChat(id),
    // send id and createdAt for each message 因为我统一采用本地缓存所以不需要将id和createdAt发送给后端
    // sendExtraMessageFields:true,
    onFinish: (message) => {
      setMessage(message);
    },
  });
  const [message, setMessage] = useState<Message>();

  useEffect(() => {
    if (messages.length > 0) {
      saveChat(id, messages);
    }
  }, [message]);

  const handleDelete = (_id: string) => {
    const newMessages = messages.filter((message) => message.id !== _id);
    setMessages(newMessages);
    saveChat(id, newMessages);
  };

  

  return (
    <>
      {messages.map((message, index) => {
        console.log('重渲染了', Date.now(), index)
        return (
          <div key={message.id}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.content}
            <button onClick={() => handleDelete(message.id)}>Delete</button>
          </div>
        );
      })}

      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}

      {(status === "submitted" || status === "streaming") && (
        <div>
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      <form
        onSubmit={(event) => {
          console.log(event);
          handleSubmit(event, {
            body: {
              apikey: "23424234",
            },
          });
        }}
      >
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={status !== "ready" || error != null}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
