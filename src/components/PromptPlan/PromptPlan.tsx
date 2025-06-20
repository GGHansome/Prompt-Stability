import {
  FunctionOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { lime, gray } from "@ant-design/colors";
import {
  Button,
  Col,
  Divider,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Input,
  Flex,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import SystemInput from "./SystemInput";

interface IPromptPlanProps {
  model: string;
  adjustment: {
    response_format: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
  };
  tools: string[];
  system_message: string;
  setSystemMessage: (system_message: string) => void;
  setModel: (model: string) => void;
  setAdjustment: (adjustment: {
    response_format: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
  }) => void;
  setTools: (tools: string[]) => void;
}

const { Text } = Typography;
const { TextArea } = Input;

const StyleText = styled(Text)`
  color: ${gray[3]};
`;

const LabelText = styled(Text)`
  color: ${gray[3]};
  font-size: 11px;
`;

const ValueText = styled(Text)`
  color: ${lime[6]};
  font-size: 11px;
`;

const FUNCTION_TEMPLATE = `[{
  "name": "get_stock_price",
  "description": "Get the current stock price",
  "parameters": {
    "type": "object",
    "properties": {
      "symbol": {
        "type": "string",
        "description": "The stock symbol"
      }
    },
    "required": [
      "symbol"
    ]
  }
}]`;

const PromptPlan = (props: IPromptPlanProps) => {
  const {
    model,
    adjustment,
    tools,
    system_message,
    setSystemMessage,
    setModel,
    setAdjustment,
    setTools,
  } = props;
  console.log("重渲染promptPlan组件");
  const [functionModalVisible, setFunctionModalVisible] = useState(false);
  return (
    <div className="p-6">
      <Row align="middle">
        <Col span={3}>
          <StyleText>Model</StyleText>
        </Col>
        <Col span={20}>
          <Select
            className="w-32"
            showSearch
            variant="borderless"
            placeholder="Select a model..."
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            value={model}
            options={[
              { value: "gpt-4o", label: "gpt-4o" },
              { value: "gpt-4o-mini", label: "gpt-4o-mini" },
              { value: "gpt-4.1", label: "gpt-4.1" },
              { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
            ]}
            onChange={(value) => {
              setModel(value);
            }}
          />
        </Col>
        <Col span={1}>
          <Button type="text" icon={<UnorderedListOutlined />} />
        </Col>
      </Row>
      <Row align="middle">
        <Flex gap={16}>
          <Space>
            <LabelText>response_format:</LabelText>
            <ValueText>{adjustment?.response_format}</ValueText>
          </Space>
          <Space>
            <LabelText>temp:</LabelText>
            <ValueText>{adjustment?.temperature}</ValueText>
          </Space>
          <Space>
            <LabelText>tokens:</LabelText>
            <ValueText>{adjustment?.max_tokens}</ValueText>
          </Space>
          <Space>
            <LabelText>top_p:</LabelText>
            <ValueText>{adjustment?.top_p}</ValueText>
          </Space>
          {/* <Space>
            <LabelText>store:</LabelText>
            <ValueText>{adjustment.frequency_penalty}</ValueText>
          </Space> */}
        </Flex>
      </Row>
      <Divider />
      <Row align="middle">
        <Col span={3}>
          <StyleText>Functions</StyleText>
        </Col>
        <Col span={20}>
          {new Array(4).fill(0).map((_, index) => (
            <Tag
              key={index}
              bordered={false}
              icon={<FunctionOutlined />}
              closeIcon
              onClose={() => {}}
            >
              Prevent Default
            </Tag>
          ))}
          <Button
            type="text"
            style={{ color: gray[3] }}
            onClick={() => setFunctionModalVisible(true)}
          >
            Create...
          </Button>
        </Col>
        <Col span={1}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => setFunctionModalVisible(true)}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Space direction="vertical" className="w-full">
          <StyleText>System message</StyleText>
          <SystemInput
            system_message={system_message}
            setSystemMessage={setSystemMessage}
          />
        </Space>
      </Row>
      <Modal
        width={"60vw"}
        title="Function"
        closable
        open={functionModalVisible}
        onOk={() => {}}
        onCancel={() => setFunctionModalVisible(false)}
      >
        <Space direction="vertical" className="w-full">
          <StyleText>
            The model will intelligently decide to call functions based on input
            it receives from the user.
          </StyleText>
          <TextArea
            onChange={(e) => {}}
            placeholder={FUNCTION_TEMPLATE}
            autoSize={{ minRows: 15, maxRows: 18 }}
          />
          <StyleText>
            <Space>
              <InfoCircleOutlined />
              You can use "[]" to declare one or more utility functions
              simultaneously
            </Space>
          </StyleText>
        </Space>
      </Modal>
    </div>
  );
};

export default PromptPlan;
