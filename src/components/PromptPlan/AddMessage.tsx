import { Button, Card, Flex, Select } from "antd";
import React from "react";
import { StyledCard, StyledText } from "../Common/StyledComponent/inedx";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Message } from "ai";
import { DebounceTextArea } from "../Common/DebounceForm";
import { SetMessageType } from "@/store/types";

interface IAddMessageProps {
  customMessages: Message[];
  setMessages: (sign: SetMessageType | number, index: number, content: any) => void;
}

const AddMessage = ({
  customMessages,
  setMessages,
}: IAddMessageProps) => {
  return (
    <Flex vertical gap={4}>
      {customMessages?.length > 0 && <StyledText>Prompt Messages</StyledText>}
      {customMessages?.map((message, index) => (
        <StyledCard
          className="focus-within:ring-1 focus-within:ring-blue-500"
          padding="8px"
          key={message.id}
        >
          <Flex justify="space-between" align="center" className="w-full">
            <Select
              variant="borderless"
              options={[
                { label: "User", value: "user" },
                { label: "Assistant", value: "assistant" },
              ]}
              value={message.role}
              popupMatchSelectWidth={false}
              onChange={(value) => {
                setMessages?.(SetMessageType.CHANGE_ROLE, index, value);
              }}
            />
            <Button onClick={() => {
              setMessages?.(SetMessageType.DELETE, index, "");
            }} type="text" icon={<CloseOutlined />} />
          </Flex>
          <DebounceTextArea
            value={message.content}
            onChange={(e) => {
              setMessages?.(SetMessageType.CHANGE_CONTENT, index, e.target.value);
            }}
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
          setMessages?.(SetMessageType.ADD, -1, "");
        }}
      >
        Add message to prompt
      </Button>
    </Flex>
  );
};

export default AddMessage;
