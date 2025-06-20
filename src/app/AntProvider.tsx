"use client";
import React, { PropsWithChildren } from "react";
import { App, ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";

const AntProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider theme={{ cssVar: true, hashed: false }}>
      <App>{children}</App>
    </ConfigProvider>
  );
};

export default AntProvider;
