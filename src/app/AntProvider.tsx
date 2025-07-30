"use client";
import React, { PropsWithChildren } from "react";
import { App, ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";

const AntProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        cssVar: false,
        hashed: false,
        components: {
          Spin: {
            contentHeight: "100%",
          },
        },
      }}
    >
      <App className="h-screen">{children}</App>
    </ConfigProvider>
  );
};

export default AntProvider;
