import { Button, Empty, Flex, Input, Popconfirm, Tag, Typography } from "antd";
import React, { memo, useState } from "react";
import { StyledCard, StyledText } from "../Common/StyledComponent/inedx";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface IChatHistoryItem {
  id: string;
  title: string;
  systemMessage: string;
  toolsName: string[];
  lastChatAt: string;
}

interface IChatHistoryProps {
  chatHistoryList?: IChatHistoryItem[];
  onCreateChat: () => void;
  onDeleteChat: (id: string) => void;
  onChatChange: (id: string) => void;
  onTitleChange: (id: string, newTitle: string) => void;
}

const ChatHistoryItem: React.FC<{
  item: IChatHistoryItem;
  onTitleChange: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
}> = memo(({ item, onTitleChange, onDeleteChat }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  const handleTitleSubmit = () => {
    onTitleChange(item.id, editTitle);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    }
  };

  return (
    <StyledCard className="cursor-pointer hover:shadow-md transition-shadow">
      <Flex vertical gap={8}>
        {/* 可编辑标题 */}
        <Flex align="center">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyPress}
              className="font-medium !text-base"
              autoFocus
              maxLength={50}
            />
          ) : (
            <Text
              strong={!!item.title}
              italic={!item.title}
              className={`${!item.title && '!text-gray-300'} !text-base hover:bg-gray-50 px-1 -mx-1 rounded w-full`}
              onClick={(e) => {e.preventDefault(); e.stopPropagation(); setIsEditing(true)}}
              ellipsis={{ tooltip: item.title }}
            >
              {item.title || 'Untitled'}
            </Text>
          )}
          <Popconfirm
            title="Delete the chat"
            description="Are you sure to delete this chat?"
            onConfirm={(e) => {e?.preventDefault(); e?.stopPropagation(); onDeleteChat(item.id)}}
            onCancel={(e) => {e?.preventDefault(); e?.stopPropagation()}}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="text" icon={<DeleteOutlined />} onClick={(e) => {e.preventDefault(); e.stopPropagation()}}></Button>
          </Popconfirm>
        </Flex>

        {/* 描述文本 */}
        <StyledText ellipsis={{ tooltip: item.systemMessage }}>
          {item.systemMessage}
        </StyledText>
        {/* 标签列表 */}
        <Flex justify={item.toolsName.length > 0 ? "space-between" : "flex-end"}>
          <Flex wrap="wrap" gap={4} className="max-h-6 overflow-hidden">
            {item.toolsName.map((tag, index) => (
              <Tag
                key={index}
                className="max-w-32 overflow-hidden text-ellipsis"
              >
                {tag}
              </Tag>
            ))}
          </Flex>
          <StyledText className="shrink-0">{item.lastChatAt}</StyledText>
        </Flex>
      </Flex>
    </StyledCard>
  );
});

const ChatHistory = ({chatHistoryList, onCreateChat, onDeleteChat, onChatChange, onTitleChange}: IChatHistoryProps) => {
  const handleTitleChange = (id: string, newTitle: string) => {
    onTitleChange(id, newTitle);
  };

  return (
    <Flex vertical gap={16} className="w-full h-full !p-6">
      <Button variant="outlined" onClick={onCreateChat}>Create New Chat</Button>
      {chatHistoryList?.length === 0 ? (
        <Flex justify="center" align="center" className="h-32">
          <Empty description="No Chat History"></Empty>
        </Flex>
      ) : (
        <Flex vertical className="overflow-y-auto h-full" gap={8}>
        {chatHistoryList?.map((item) => (
          <div onClick={() => {onChatChange(item.id)}} key={item.id}>
            <ChatHistoryItem
              item={item}
              onTitleChange={handleTitleChange}
              onDeleteChat={onDeleteChat}
            />
          </div>
        ))}
        </Flex>
      )}
    </Flex>
  );
};

export default ChatHistory;
