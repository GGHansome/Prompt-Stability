import React, { useMemo } from "react";
import PromptPlanComponent from "@/components/PromptPlan/PromptPlan";
import { useAppStore, useStore } from "@/store";
import { Adjustment, SetMessageType, Tool } from "@/store/types";
import { Message } from "ai";
import { generateMessageFormat } from "@/utils/tools";
interface IPromptPlanProps {
  id: string;
}

const PromptPlan = (props: IPromptPlanProps) => {
  const { id } = props;
  const { chat, setMessages, saveChat } = useStore((state) => ({
    chat: state.chats[id],
    setMessages: state.setMessages,
    saveChat: state.saveChat,
  }));

  const setSystemMessage = (system_message: string) => {
    useAppStore.setState((state) => {
      state.chats[id].system_message = system_message;
    });
  };
  const setModel = (model: string) => {
    useAppStore.setState((state) => {
      state.chats[id].model = model;
    });
  };

  const setAdjustment = (key: keyof Adjustment, value: any) => {
    useAppStore.setState((state) => {
      state.chats[id].adjustment[key] = value;
    });
  };

  const setTools = (tools: Tool[]) => {
    useAppStore.setState((state) => {
      state.chats[id].tools = tools;
    });
  };

  const customMessages = useMemo(() => {
    return chat?.messages.filter(
      (message) =>
        Object.assign({}, ...(message.annotations || []))?.type === "custom"
    );
  }, [chat?.messages]);

  const setCustomMessage = (sign: SetMessageType | number, index: number, content: any) => {
    let newMessages: Message[] = [];

    setMessages?.((messages) => {
      const noCustomMessages = messages.filter(
        (message) =>
          Object.assign({}, ...(message.annotations || []))?.type !== "custom"
      );
      switch (sign) {
        case SetMessageType.ADD:
          newMessages = [
            ...customMessages,
            generateMessageFormat(
              customMessages[customMessages.length - 1]?.role === "user"
                ? "assistant"
                : "user",
              content
            ),
            ...noCustomMessages,
          ];
          break;
        case SetMessageType.DELETE:
          newMessages = [
            ...customMessages.filter((_, i) => i !== index),
            ...noCustomMessages,
          ];
          break;
        case SetMessageType.CHANGE_ROLE:
          const newCustomMessages = customMessages.map((message, i) => 
            i === index 
              ? { ...message, role: content }
              : message
          );
          newMessages = [
            ...newCustomMessages,
            ...noCustomMessages,
          ];
          break;
        case SetMessageType.CHANGE_CONTENT:
          customMessages[index] = generateMessageFormat(
            customMessages[index]?.role,
            content,
            customMessages[index]?.id
          );
          newMessages = [...customMessages, ...noCustomMessages];
          break;
      }
      saveChat(id, newMessages);
      return newMessages;
    });
  };
  return (
    <PromptPlanComponent
      key={`prompt-plan-${id}`}
      model={chat?.model}
      adjustment={chat?.adjustment}
      tools={chat?.tools}
      system_message={chat?.system_message}
      setSystemMessage={setSystemMessage}
      setModel={setModel}
      setAdjustment={setAdjustment}
      setTools={setTools}
      setMessages={setCustomMessage}
      customMessages={customMessages}
    />
  );
};

export default PromptPlan;
