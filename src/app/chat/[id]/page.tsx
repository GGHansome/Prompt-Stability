"use client";

import { use, useEffect } from "react";
import { Spin, Splitter } from "antd";
import Chat from "@/business/Chat/Chat";
import PromptPlan from "@/business/PromptPlan/PromptPlan";
import MultipleTest from "@/business/MultipleTest/MultipleTest";
import AnalyseTest from "@/business/AnalyseTest/AnalyseTest";
import { useAppStore, useStore } from "@/store";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const changeChatLoading = useStore((state) => state.changeChatLoading);
  useEffect(() => {
    useAppStore.setState((state) => {
      state.changeChatLoading = false;
    });
  }, []);
  return (
    <Spin
      size="large"
      spinning={changeChatLoading}
      wrapperClassName="h-full [&_.ant-spin-container]:h-full"
    >
      <Splitter>
        <Splitter.Panel defaultSize="25%">
          <PromptPlan id={id} />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="25%">
          <Chat id={id} />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="25%">
          <MultipleTest id={id} />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="25%">
          <AnalyseTest id={id} />
        </Splitter.Panel>
      </Splitter>
    </Spin>
  );
}
