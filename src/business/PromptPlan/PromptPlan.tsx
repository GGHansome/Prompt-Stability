import React from "react";
import PromptPlanComponent from "@/components/PromptPlan/PromptPlan";
import { useAppStore, useStore } from "@/store";
import { Adjustment, Tool } from "@/store/types";
interface IPromptPlanProps {
  id: string;
}

const PromptPlan = (props: IPromptPlanProps) => {
  const { id } = props;
  const { chat, setMessages } = useStore((state) => ({
    chat: state.chats[id],
    setMessages: state.setMessages,
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
      setMessages={setMessages}
      customMessages={chat?.messages.filter(
        (message) =>
          Object.assign({}, ...(message.annotations || []))?.type === "custom"
      )}
    />
  );
};

export default PromptPlan;
