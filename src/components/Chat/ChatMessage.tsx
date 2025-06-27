import { Message } from "ai";
import { Button, Flex, Space, Typography } from "antd";
import React, { memo, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  RobotOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { MemoizedMarkdown } from "./Markdown";
import { StyledCard } from "./ChatInput";

const { Text } = Typography;

const StyledText = styled(Text)`
  pre {
    background: none;
    padding: 0;
    border: none;
  }
  p {
    margin: 0;
  }
`;

interface IChatMessageProps {
  message: Message;
  handleDelete: (id: string) => void;
}

const ChatMessage = memo(
  ({ message, handleDelete }: IChatMessageProps) => {
    const [isHovered, setIsHovered] = useState(false);
    console.log("重渲染chatMessage组件");
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
              className={`${
                message.role === "user"
                  ? "!bg-blue-500 !rounded-tr-none"
                  : "!bg-gray-100 !rounded-tl-none"
              } w-full`}
              hoverable
            >
              <StyledText
                className={`${
                  message.role === "user" ? "!text-white" : "!text-black"
                }`}
              >
                <MemoizedMarkdown content={message.content} id={message.id} />
              </StyledText>
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
