"use client";

import { saveChat } from "@/store/chat-stores";
import { Message, useChat } from "@ai-sdk/react";

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Message[];
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
    initialMessages,
    // send id and createdAt for each message 因为我统一采用本地缓存所以不需要将id和createdAt发送给后端
    // sendExtraMessageFields:true,
    onFinish: () => {
      console.log("123")
      //存储消息到localstorage
      saveChat(id, messages);
    },
  });

  const handleDelete = (id: string) => {
    const newMessages = messages.filter((message) => message.id !== id);
    setMessages(newMessages);
    saveChat(id, newMessages);
  };

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
          <button onClick={() => handleDelete(message.id)}>Delete</button>
        </div>
      ))}

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
