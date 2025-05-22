import React, { useState } from "react";
import { Input, Card, Space, Button, Flex } from "antd";
import { SendOutlined, SyncOutlined } from "@ant-design/icons";

const { TextArea } = Input;

type Props = {};

const Chat = (props: Props) => {
  const [isAutoClear, setIsAutoClear] = useState(false);
  return (
    <Card>
      <Space direction="vertical" className="w-full">
        <TextArea
          className="!border-none focus:!shadow-none"
          autoSize={{ minRows: 4, maxRows: 8 }}
          placeholder="Chat with your prompt..."
        />
        <Flex justify="end" gap={16}>
          <Button
            className={`${isAutoClear ? "!bg-emerald-100" : ""}`}
            size="large"
            type="text"
            icon={<SyncOutlined />}
            onClick={() => setIsAutoClear(!isAutoClear)}
          >
            Auto-clear
          </Button>
          <Button
            color="green"
            variant="solid"
            size="large"
            shape="circle"
            icon={<SendOutlined />}
          />
        </Flex>
      </Space>
    </Card>
  );
};

export default Chat;
