"use client";

import { use } from "react";
import { Splitter } from "antd";
import Chat from "@/business/Chat/Chat";
import PromptPlan from "@/business/PromptPlan/PromptPlan";
import MultipleTest from "@/components/MultipleTest/MultipleTest";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);

  return (
    <>
      <Splitter>
        <Splitter.Panel collapsible defaultSize="50%" min="40%" max="60%">
          <PromptPlan id={id} />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="50%" min="40%" max="60%">
          <Chat id={id} />
        </Splitter.Panel>
        {/* <Splitter.Panel defaultSize="50%" min="40%" max="60%">
          <MultipleTest />
        </Splitter.Panel> */}
      </Splitter>
    </>
  );
}
