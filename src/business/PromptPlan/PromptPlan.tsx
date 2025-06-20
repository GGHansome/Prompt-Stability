import React from "react";
import PromptPlanComponent from "@/components/PromptPlan/PromptPlan";
import { useAppStore, useStore } from "@/store";
import { Spin } from "antd";

interface IPromptPlanProps {
  id: string;
}

const PromptPlan = (props: IPromptPlanProps) => {
  const { id } = props;
  const chat = useStore(
    (state) => state.chats[id]
  );
  console.log("PromptPlan业务组件重渲染");

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
  const setAdjustment = (adjustment: {
    response_format: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
  }) => {};
  const setTools = (tools: string[]) => {};
  // if (!chat) {
  //   return <Spin size="large" />;
  // }
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
    />
  );
};

export default PromptPlan;
