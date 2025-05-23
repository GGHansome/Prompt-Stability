import React, { useEffect, useState } from "react";
import { Input, Card, Space, Button, Flex } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  RobotOutlined,
  SendOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import styled from "styled-components";
import { Message } from "ai";

const { Text } = Typography;
const { TextArea } = Input;

interface IChatProps {
  handleDelete: (id: string) => void;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: string;
  stop: () => void;
  error: Error | undefined;
  reload: () => void;
  messages: Message[];
}

const StyledCard = styled(Card)`
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <Space direction="vertical" className="w-full" size={16}>
      <Space direction="vertical" className="w-full">
        {messages.map((item, index) => (
          <Flex
            key={item.id}
            justify={item.role === "user" ? "end" : "start"}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Space direction="vertical" className="max-w-[80%]">
              <Flex
                justify={item.role === "user" ? "end" : "start"}
                align="center"
                gap={16}
                className={`${item.role === "user" ? "" : "!flex-row-reverse"}`}
              >
                <Text className="!text-xs">
                  {item.role === "user" ? "You" : "Chat-GPT 4.1"}
                </Text>
                {item.role === "user" && <UserOutlined />}
                {item.role === "assistant" && <RobotOutlined />}
              </Flex>
              <Flex justify={item.role === "user" ? "end" : "start"}>
                <StyledCard
                  className={`inline-block ${
                    item.role === "user"
                      ? "!bg-blue-500 !rounded-tr-none"
                      : "!bg-gray-100 !rounded-tl-none"
                  }`}
                  hoverable
                >
                  <Text
                    className={`${
                      item.role === "user" ? "!text-white" : "!text-black"
                    }`}
                  >
                    {item.content}
                  </Text>
                </StyledCard>
              </Flex>
              <Flex
                gap={8}
                className={`
                  transition-all duration-300
                  ${
                    hoveredIndex === index
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }
                `}
              >
                <Button type="text" size="small" icon={<SyncOutlined />} />
                <Button onClick={() => handleDelete(item.id)} type="text" size="small" icon={<DeleteOutlined />} />
                <Button type="text" size="small" icon={<EditOutlined />} />
              </Flex>
            </Space>
          </Flex>
        ))}
      </Space>
      <StyledCard className="!bg-gray-100">
        <Space direction="vertical" className="w-full">
          <form onSubmit={handleSubmit}>
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
