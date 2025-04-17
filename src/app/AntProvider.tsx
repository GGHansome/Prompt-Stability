"use client";
import React, { PropsWithChildren } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import { App, ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";

const AntProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={{ cssVar: true, hashed: false }}>
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default AntProvider;
