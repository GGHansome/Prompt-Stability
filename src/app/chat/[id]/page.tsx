"use client";

import { use } from "react";
import { Flex, Splitter } from "antd";
import Chat from "@/business/Chat/Chat";
import PromptPlan from "@/business/PromptPlan/PromptPlan";
import MultipleTest from "@/business/MultipleTest/MultipleTest";
import AnalyseTest from "@/business/AnalyseTest/AnalyseTest";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);

  return (
    <Splitter>
      <Splitter.Panel collapsible min="25%">
        <PromptPlan id={id} />
      </Splitter.Panel>
      {/* <Splitter.Panel collapsible min="25%">
        <Chat id={id} />
      </Splitter.Panel> */}
      <Splitter.Panel collapsible min="25%">
        <MultipleTest id={id} />
      </Splitter.Panel>
      <Splitter.Panel collapsible min="25%">
        <AnalyseTest id={id} />
      </Splitter.Panel>
    </Splitter>
  );
}
