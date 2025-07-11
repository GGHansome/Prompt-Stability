import { gray } from "@ant-design/colors";
import styled from "styled-components";
import { Card, Typography } from "antd";

const { Text } = Typography;

export const StyleText = styled(Text)`
  color: ${gray[3]};
`;

export const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 14px;
  }
`;