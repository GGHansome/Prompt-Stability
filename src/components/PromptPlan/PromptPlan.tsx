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
  Flex,
  Input,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { DebounceCodeEditor, DebounceTextArea } from "../Common/DebounceForm";
import { Tool } from "@/store/types";

interface IPromptPlanProps {
  model: string;
  adjustment: {
    response_format: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
  };
  tools: Tool[];
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
  setTools: (tools: Tool[]) => void;
}

const { Text } = Typography;

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
  const [functionModalVisible, setFunctionModalVisible] = useState(false);
  const [functionTemplate, setFunctionTemplate] = useState("");
  // -1代表新增，其他数字代表编辑对应的function
  const [functionModalIndex, setFunctionModalIndex] = useState<number>(-1);
  const [vaildateJson, setVaildateJson] = useState<{
    isPass: boolean;
    errorMessage: string;
  }>({
    isPass: true,
    errorMessage: "",
  });

  const vaildateFunctionFormat = (functionTemplate: string) => {
    let parsedFunction: Array<any> | Object = {};
    let hasName = true;
    let uniqueName = true;
    let errorMessage = "";
    try {
      if (functionTemplate) {
        parsedFunction = JSON.parse(functionTemplate);
        if (Array.isArray(parsedFunction)) {
          hasName =
            parsedFunction.length > 0
              ? parsedFunction.every((item: any) => Object.hasOwn(item, "name"))
              : false;
          if (hasName) {
            const names = parsedFunction.map((item: any) => item.name);
            const uniqueNames = new Set(names);
            uniqueName = names.length === uniqueNames.size;
          }    
        } else {
          hasName = Object.hasOwn(parsedFunction, "name");
        }
      }
      if (!hasName) {
        errorMessage = "Function name is required";
      } else if (!uniqueName) {
        errorMessage = "Function names must be unique";
      }
      setVaildateJson({
        isPass: hasName && uniqueName,
        errorMessage,
      });
    } catch (error) {
      setVaildateJson({
        isPass: false,
        errorMessage: `${error}`,
      });
    }
  };

  const defaultFunctionValue = (parsedFunction:any) => {
    if (!Object.hasOwn(parsedFunction, "parameters")) {
      parsedFunction["parameters"] = {
        type: "object",
        properties: {},
        required: [],
      };
    } else {
      if (!Object.hasOwn(parsedFunction["parameters"], "properties")) {
        parsedFunction["parameters"]["properties"] = {};
      }
      if (!Object.hasOwn(parsedFunction["parameters"], "required")) {
        parsedFunction["parameters"]["required"] = [];
      }
      if (parsedFunction["parameters"]["type"] !== "object") {
        parsedFunction["parameters"] = {
          type: "object",
          properties: parsedFunction["parameters"]["properties"],
          required: parsedFunction["parameters"]["required"],
        };
      }
    }
  }

  const handleFunctionModalOk = () => {
    if (!vaildateJson.isPass) {
      return;
    }
    const parsedFunction = JSON.parse(functionTemplate);
    if (Array.isArray(parsedFunction)) {
      parsedFunction.forEach((item) => {
        defaultFunctionValue(item)
      });
    } else {
      defaultFunctionValue(parsedFunction)
    }
    if (functionModalIndex === -1) {
      Array.isArray(parsedFunction)
        ? setTools([...tools, ...parsedFunction])
        : setTools([...tools, parsedFunction]);
    } else {
      const newTools = [...tools];
      newTools[functionModalIndex] = parsedFunction;
      setTools(newTools);
    }
    setFunctionTemplate("");
    setFunctionModalVisible(false);
  };

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
          {tools?.map((tool,index) => (
            <Tag
              key={tool.name}
              bordered={false}
              icon={<FunctionOutlined />}
              closeIcon
              onClick={()=>{
                setFunctionModalIndex(index);
                setFunctionModalVisible(true);
                setFunctionTemplate(JSON.stringify(tool,null,2));
              }}
              onClose={() => {
                const newTools = [...tools];
                newTools.splice(index, 1);
                setTools(newTools);
              }}
              className="cursor-pointer hover:!bg-gray-100"
            >
              {tool.name}
            </Tag>
          ))}
          {
            tools?.length === 0 && (
              <Button
                type="text"
                style={{ color: gray[3] }}
                onClick={() => {
                  setFunctionModalIndex(-1);
                  setFunctionTemplate('');
                  setFunctionModalVisible(true);
                }}
              >
                Create...
              </Button>
            )
          }
        </Col>
        <Col span={1}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => {
              setFunctionModalIndex(-1);
              setFunctionTemplate('');
              setFunctionModalVisible(true);
            }}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Space direction="vertical" className="w-full">
          <StyleText>System message</StyleText>
          <DebounceTextArea
            onChange={(e) => {
              setSystemMessage(e.target.value);
            }}
            value={system_message}
            placeholder="Describe desired model behavior(tone, tool usage, response style)"
            autoSize={{ minRows: 10, maxRows: 15 }}
            rows={10}
          />
        </Space>
      </Row>
      <Modal
        width={"60vw"}
        title="Function"
        closable
        open={functionModalVisible}
        onOk={handleFunctionModalOk}
        onCancel={() => setFunctionModalVisible(false)}
      >
        <Space direction="vertical" className="w-full">
          <StyleText>
            The model will intelligently decide to call functions based on input
            it receives from the user.
          </StyleText>
          <DebounceCodeEditor
            status={vaildateJson.isPass ? undefined : "error"}
            code={functionTemplate}
            placeholder={FUNCTION_TEMPLATE}
            onChange={(code) => {
              vaildateFunctionFormat(code);
              setFunctionTemplate(code);
            }}
          />
          <StyleText type={vaildateJson.isPass ? "success" : "danger"}>
            {vaildateJson.errorMessage}
          </StyleText>
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
