import { Flex, Modal, Tag, Typography } from "antd";
import React, { useState } from "react";
import { DebounceStepInput, DebounceTextArea } from "../Common/DebounceForm";
import {
  StyledCard,
  StyleText,
} from "@/components/Common/StyledComponent/inedx";
import { MemoizedMarkdown } from "../Chat/Markdown";

interface IMultipleTestProps {}

const { Text } = Typography;

const MultipleTest = (props: IMultipleTestProps) => {
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  return (
    <Flex vertical className="w-full h-screen !p-6" gap={16}>
      <DebounceStepInput
        title={"Test Number"}
        min={1}
        max={100}
        step={1}
        value={10}
        initValue={1}
        onChange={undefined}
      />
      <Flex vertical gap={2}>
        <StyleText>Expected Response Results</StyleText>
        <DebounceTextArea value={""} onChange={undefined} rows={4} />
      </Flex>

      <Flex vertical gap={2} flex={1} className="min-h-0">
        <StyleText>Response Results</StyleText>
        <StyledCard className="!bg-gray-50 overflow-y-auto">
          <Flex vertical gap={16}>
            {[90, 65, 55, 90, 65, 55, 90, 65, 55, 90, 65, 55, 90, 65, 55].map(
              (item, index) => (
                <StyledCard
                  key={`${index}-success`}
                  className={`!border-${
                    item > 80
                      ? "green-300"
                      : item > 60
                      ? "orange-300"
                      : "red-400"
                  }`}
                  hoverable
                  onClick={() => setResultsModalVisible(true)}
                >
                  <Flex justify="space-between" align="center">
                    <Text strong>Response #{index + 1}</Text>
                    <Tag
                      color={
                        item > 80 ? "green" : item > 60 ? "warning" : "red"
                      }
                    >
                      {item}%
                    </Tag>
                  </Flex>
                  <Text ellipsis className="!text-[12px] !text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quos.Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Quisquam, quos.
                  </Text>
                </StyledCard>
              )
            )}
          </Flex>
        </StyledCard>
      </Flex>
      <Modal
        width={"60vw"}
        title="Response Results"
        closable
        footer={null}
        open={resultsModalVisible}
        onCancel={() => setResultsModalVisible(false)}
      >
        <StyledCard className="min-h-[50vh] overflow-y-auto">
          <MemoizedMarkdown
            content="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Quisquam, quos."
            id={"123"}
          />
        </StyledCard>
      </Modal>
    </Flex>
  );
};

export default MultipleTest;
