import { Message } from "ai";
import { Button, Flex, Space, Typography } from "antd";
import React, { memo, useState } from "react";
import { StyledCard } from "./ChatInput";
import {
  DeleteOutlined,
  EditOutlined,
  RobotOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface IChatMessageProps {
  message: Message;
  handleDelete: (id: string) => void;
}

const ChatMessage = memo(
  ({ message, handleDelete }: IChatMessageProps) => {
    const [isHovered, setIsHovered] = useState(false);
    console.log("ChatMessage 组件渲染了", message.id, Date.now());
    return (
      <Flex
        key={message.id}
        justify={message.role === "user" ? "end" : "start"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Space direction="vertical" className="max-w-[80%]">
          <Flex
            justify={message.role === "user" ? "end" : "start"}
            align="center"
            gap={16}
            className={`${message.role === "user" ? "" : "!flex-row-reverse"}`}
          >
            <Text className="!text-xs">
              {message.role === "user" ? "You" : "Chat-GPT 4.1"}
            </Text>
            {message.role === "user" && <UserOutlined />}
            {message.role === "assistant" && <RobotOutlined />}
          </Flex>
          <Flex justify={message.role === "user" ? "end" : "start"}>
            <StyledCard
              className={`inline-block ${
                message.role === "user"
                  ? "!bg-blue-500 !rounded-tr-none"
                  : "!bg-gray-100 !rounded-tl-none"
              }`}
              hoverable
            >
              <Text
                className={`${
                  message.role === "user" ? "!text-white" : "!text-black"
                }`}
              >
                {message.content}
              </Text>
            </StyledCard>
          </Flex>
          <Flex
            gap={8}
            className={`
          transition-all duration-300
          ${isHovered ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
          >
            <Button type="text" size="small" icon={<SyncOutlined />} />
            <Button
              onClick={() => handleDelete(message.id)}
              type="text"
              size="small"
              icon={<DeleteOutlined />}
            />
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Flex>
        </Space>
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    // return false
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.role === nextProps.message.role
    );
  }
);

export default ChatMessage;
