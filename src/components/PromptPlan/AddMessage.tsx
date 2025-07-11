import { Button, Card, Flex, Select } from "antd";
import React from "react";
import { StyleText } from "../Common/StyledComponent/inedx";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Message } from "ai";
import { DebounceTextArea } from "../Common/DebounceForm";
import { generateMessageFormat } from "@/utils/tools";

interface IAddMessageProps {
  model: string;
  customMessages: Message[];
  setMessages:
    | ((messages: Message[] | ((messages: Message[]) => Message[])) => void)
    | null;
}

export const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 8px;
  }
`;

const AddMessage = ({
  model,
  customMessages,
  setMessages,
}: IAddMessageProps) => {
  return (
    <Flex vertical gap={4}>
      {customMessages?.length > 0 && <StyleText>Prompt Messages</StyleText>}
      {customMessages?.map((message) => (
        <StyledCard className="focus-within:ring-1 focus-within:ring-blue-500">
          <Flex justify="space-between" align="center" className="w-full">
            <Select
              variant="borderless"
              options={[
                { label: "User", value: "user" },
                { label: "Assistant", value: "assistant" },
              ]}
              value={message.role}
              popupMatchSelectWidth={false}
            />
            <Button type="text" icon={<CloseOutlined />} />
          </Flex>
          <DebounceTextArea
            value={message.content}
            onChange={undefined}
            className="!border-none focus:!shadow-none"
            autoSize={{ minRows: 2, maxRows: 8 }}
            placeholder="Chat with your prompt..."
          />
        </StyledCard>
      ))}
      <Button
        type="text"
        icon={<PlusOutlined />}
        onClick={() => {
          setMessages?.((messages) => [
            generateMessageFormat(
              model,
              customMessages[customMessages.length - 1]?.role === "user"
                ? "assistant"
                : "user",
              ""
            ),
            ...messages,
          ]);
        }}
      >
        Add message to prompt
      </Button>
    </Flex>
  );
};

export default AddMessage;
