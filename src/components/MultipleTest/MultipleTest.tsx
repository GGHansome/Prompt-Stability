import {
  Button,
  Empty,
  Flex,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import { DebounceStepInput, DebounceTextArea } from "../Common/DebounceForm";
import {
  StyledCard,
  StyleText,
} from "@/components/Common/StyledComponent/inedx";
import { MemoizedMarkdown } from "../Chat/Markdown";
import { MultipleResponseMessage } from "@/store/types";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";

interface IMultipleTestProps {
  testNumber: number;
  expectedResponse: string;
  multipleResponseMessages: MultipleResponseMessage[];
  isLoading: boolean;
  canStart: {
    status: boolean;
    message: string;
  };
  setTestNumber: (test_number: number) => void;
  setExpectedResponse: (expectedResponse: string) => void;
  onStart: () => void;
  onClear: () => void;
  onRefresh: () => void;
}

const { Text } = Typography;

const MultipleTest = ({
  testNumber,
  expectedResponse,
  multipleResponseMessages,
  isLoading,
  canStart,
  setTestNumber,
  setExpectedResponse,
  onStart,
  onClear,
  onRefresh,
}: IMultipleTestProps) => {
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [resultsContent, setResultsContent] = useState("");
  return (
    <Flex vertical className="w-full h-screen !p-6" gap={16}>
      <DebounceStepInput
        title={"Test Number"}
        min={1}
        max={100}
        step={1}
        value={testNumber}
        initValue={1}
        onChange={(value) => setTestNumber(value as number)}
      />
      <Flex vertical gap={2}>
        <StyleText>Expected Response Results</StyleText>
        <DebounceTextArea
          value={expectedResponse}
          onChange={(e) => setExpectedResponse(e.target.value)}
          rows={4}
        />
      </Flex>
      <Flex vertical gap={2} flex={1} className="min-h-0">
        <Flex justify="space-between" align="center">
          <StyleText>Response Results</StyleText>
          <Space size={2}>
            {multipleResponseMessages?.length > 0 && (
              <>
                <Button
                  type="text"
                  onClick={onClear}
                  icon={<DeleteOutlined />}
                />
                <Button
                  type="text"
                  onClick={onRefresh}
                  icon={<ReloadOutlined />}
                />
              </>
            )}
          </Space>
        </Flex>
        <StyledCard className="!bg-gray-50 overflow-y-auto h-full">
          <Flex
            vertical
            gap={16}
            className="h-full"
            justify={`${
              multipleResponseMessages?.length === 0 ? "center" : "start"
            }`}
          >
            {multipleResponseMessages?.length === 0 && !isLoading ? (
              <Space direction="vertical" align="center" className="w-full">
                <Empty description={canStart.message} />
                <Button
                  type="primary"
                  size="large"
                  onClick={onStart}
                  disabled={!canStart.status}
                >
                  Start Test
                </Button>
              </Space>
            ) : (
              multipleResponseMessages?.map((item, index) => (
                <StyledCard
                  key={`${index}-success`}
                  className={`!border-${
                    item.similarity > 80
                      ? "green-300"
                      : item.similarity > 60
                      ? "orange-300"
                      : "red-400"
                  }`}
                  hoverable
                  onClick={() => {
                    setResultsModalVisible(true);
                    setResultsContent(item.response);
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Text strong>Response #{index + 1}</Text>
                    <Tooltip title={item.reason}>
                      <Tag
                        color={
                          item.similarity > 80
                            ? "green"
                            : item.similarity > 60
                            ? "warning"
                            : "red"
                        }
                      >
                        {item.similarity}%
                      </Tag>
                    </Tooltip>
                  </Flex>
                  <Text ellipsis className="!text-[12px] !text-gray-500">
                    {item.response}
                  </Text>
                </StyledCard>
              ))
            )}
            <Spin size="large" spinning={isLoading} />
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
          <MemoizedMarkdown content={resultsContent} id={"123"} />
        </StyledCard>
      </Modal>
    </Flex>
  );
};

export default MultipleTest;
