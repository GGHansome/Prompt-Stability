import { gray } from "@ant-design/colors";
import styled from "styled-components";
import { Card, Typography } from "antd";
import { CardProps } from "antd";

const { Text } = Typography;

export const StyledText = styled(Text)`
  color: ${gray[3]};
`;

// 定义 StyledCard 的自定义 props 接口
interface StyledCardProps extends CardProps {
  padding?: string;
}

export const StyledCard = styled(Card)<StyledCardProps>`
  .ant-card-body {
    height: 100%;
    padding: ${(props) => props.padding || '14px'};
  }
`;