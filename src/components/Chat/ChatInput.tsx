import React, { memo, useState } from "react";
import { Input, Card, Space, Button, Flex } from "antd";
import { SendOutlined, SyncOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { ChatRequestOptions } from "ai";

const { TextArea } = Input;

interface IChatInputProps {
  input: string;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 14px;
  }
`;

const ChatInput = memo((props: IChatInputProps) => {
  const { handleSubmit, input, handleInputChange } = props;
  const [isAutoClear, setIsAutoClear] = useState(false);

  const submit = (
    e:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.FormEvent<HTMLFormElement>
  ) => {
    handleSubmit(e, {
      body: {
        apikey: "23424234",
      },
    });
  };
  return (
    <StyledCard className="!bg-gray-50">
      <Space direction="vertical" className="w-full">
        <form
          onSubmit={(e) => {
            submit(e);
          }}
        >
          <TextArea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            className="!border-none focus:!shadow-none !bg-gray-50"
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
  );
}, (prevProps, nextProps) => {
  // return false;
  return prevProps.input === nextProps.input;
});

export default ChatInput;
