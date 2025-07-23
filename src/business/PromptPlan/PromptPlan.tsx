import React from "react";
import PromptPlanComponent from "@/components/PromptPlan/PromptPlan";
import { useAppStore, useStore } from "@/store";
import { Adjustment, SetMessageType, Tool } from "@/store/types";
import { generateMessageFormat } from "@/utils/tools";
interface IPromptPlanProps {
  id: string;
}

const PromptPlan = (props: IPromptPlanProps) => {
  const { id } = props;
  const { chat } = useStore((state) => ({
    chat: state.chats[id],
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

  const setCustomMessage = (sign: SetMessageType | number, index: number, content: any) => {
    const customMessages = chat?.customMessages || [];
    switch (sign) {
      case SetMessageType.ADD:
        const newRole = customMessages[customMessages.length - 1]?.role === "user" ? "assistant" : "user";
        const newMessage = generateMessageFormat(
          newRole,
          content || "",
          undefined,
          true
        );
        useAppStore.setState((state) => {
          if (state.chats[id]) {
            // @ts-ignore
            state.chats[id].customMessages = [...customMessages, newMessage];
          }
        });
        break;
      case SetMessageType.DELETE:
        useAppStore.setState((state) => {
          if (state.chats[id]) {
            state.chats[id].customMessages = customMessages.filter((_, i) => i !== index);
          }
        });
        break;
      case SetMessageType.CHANGE_ROLE:
        useAppStore.setState((state) => {
          if (state.chats[id]) {
            state.chats[id].customMessages[index].role = content;
          }
        });
        break;
      case SetMessageType.CHANGE_CONTENT:
        const updatedMessage = generateMessageFormat(
          customMessages[index]?.role || "user",
          content,
          customMessages[index]?.id,
          true
        );
        useAppStore.setState((state) => {
          if (state.chats[id]) {
            // @ts-ignore
            state.chats[id].customMessages[index] = updatedMessage;
          }
        });
        break;
    }
  };
  return (
    <PromptPlanComponent
      key={`prompt-plan-${id}`}
      model={chat?.model}
      adjustment={chat?.adjustment}
      tools={chat?.tools}
      system_message={chat?.system_message}
      customMessages={chat?.customMessages}
      setSystemMessage={setSystemMessage}
      setModel={setModel}
      setAdjustment={setAdjustment}
      setTools={setTools}
      setMessages={setCustomMessage}
    />
  );
};

export default PromptPlan;
