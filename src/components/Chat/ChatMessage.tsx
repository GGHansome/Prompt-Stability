import { Message } from "ai";
import { Button, Flex, Space, Typography } from "antd";
import React, { memo, useState } from "react";
import { StyledCard } from "./Chat";
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
  index: number;
}

const ChatMessage = memo(({ message, handleDelete, index }: IChatMessageProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  console.log("组件重渲染了", Date.now(), index);
  return (
    <Flex
      key={message.id}
      justify={message.role === "user" ? "end" : "start"}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
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
          ${
            hoveredIndex === index
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
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
});

export default ChatMessage;
