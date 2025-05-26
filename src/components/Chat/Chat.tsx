import React, { useState } from "react";
import { Input, Card, Space, Button, Flex } from "antd";
import { SendOutlined, SyncOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { ChatRequestOptions, Message } from "ai";
import ChatMessage from "./ChatMessage";

const { TextArea } = Input;

interface IChatProps {
  handleDelete: (id: string) => void;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  status: string;
  stop: () => void;
  error: Error | undefined;
  reload: () => void;
  messages: Message[];
}

export const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 14px;
  }
`;

const Chat = ({
  handleDelete,
  input,
  handleInputChange,
  handleSubmit,
  status,
  stop,
  error,
  reload,
  messages = [],
}: IChatProps) => {
  const [isAutoClear, setIsAutoClear] = useState(false);
  return (
    <Space direction="vertical" className="w-full" size={16}>
      <Space direction="vertical" className="w-full">
        {messages.map((message, index) => (
          <ChatMessage key={message.id} index={index} message={message} handleDelete={handleDelete} />
        ))}
      </Space>
      <StyledCard className="!bg-gray-100">
        <Space direction="vertical" className="w-full">
          <form
            onSubmit={(event) => {
              console.log(event);
              handleSubmit(event, {
                body: {
                  apikey: "23424234",
                },
              });
            }}
          >
            <TextArea
              value={input}
              onChange={handleInputChange}
              className="!border-none focus:!shadow-none !bg-gray-100"
              autoSize={{ minRows: 2, maxRows: 8 }}
              placeholder="Chat with your prompt..."
            />
            <Flex justify="end" gap={16}>
              <Button
                className={`${isAutoClear ? "!bg-blue-300 !text-white" : ""}`}
                size="large"
                type="text"
                icon={<SyncOutlined />}
                onClick={() => setIsAutoClear(!isAutoClear)}
              >
                Auto-clear
              </Button>
              <Button
                htmlType="submit"
                color="blue"
                variant="solid"
                size="large"
                shape="circle"
                icon={<SendOutlined />}
              />
            </Flex>
          </form>
        </Space>
      </StyledCard>
    </Space>
  );
};

export default Chat;
