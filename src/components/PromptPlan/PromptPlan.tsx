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
  Descriptions,
  Divider,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Input
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";

type Props = {};

const { Text } = Typography;
const { TextArea } = Input;

const StyleText = styled(Text)`
  color: ${gray[3]};
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

const PromptPlan = (props: Props) => {
  const [functionModalVisible, setFunctionModalVisible] = useState(false);
  return (
    <>
      <Row align="middle">
        <Col span={3}>
          <StyleText>Model</StyleText>
        </Col>
        <Col span={20}>
          <Select
            className="w-28"
            showSearch
            variant="borderless"
            placeholder="Select a model..."
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            defaultValue="gpt-4o"
            options={[
              { value: "gpt-4o", label: "gpt-4o" },
              { value: "gpt-4o-mini", label: "gpt-4o-mini" },
              { value: "gpt-4.1", label: "gpt-4.1" },
              { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
            ]}
          />
        </Col>
        <Col span={1}>
          <Button type="text" icon={<UnorderedListOutlined />} />
        </Col>
      </Row>
      <Row align="middle">
        <Descriptions
          column={24}
          colon={true}
          labelStyle={{ color: gray[1], fontSize: 11 }}
          contentStyle={{ color: lime[6], fontSize: 11 }}
        >
          <Descriptions.Item label="response_format" span={4}>
            text
          </Descriptions.Item>
          <Descriptions.Item label="temp" span={3}>
            1.00
          </Descriptions.Item>
          <Descriptions.Item label="tokens" span={3}>
            2048
          </Descriptions.Item>
          <Descriptions.Item label="top_p" span={3}>
            1.00
          </Descriptions.Item>
          <Descriptions.Item label="store" span={3}>
            false
          </Descriptions.Item>
        </Descriptions>
      </Row>
      <Divider />
      <Row align="middle">
        <Col span={3}>
          <StyleText>Functions</StyleText>
        </Col>
        <Col span={20}>
          {new Array(4).fill(0).map((_, index) => (
            <Tag
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
          <TextArea
            // value={value}
            onChange={(e) => {}}
            placeholder="Describe desired model behavior(tone, tool usage, response style)"
            autoSize={{ minRows: 10, maxRows: 15 }}
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
              You can use "[]" to declare one or more utility functions simultaneously
            </Space>
          </StyleText>
        </Space>
      </Modal>
    </>
  );
};

export default PromptPlan;
