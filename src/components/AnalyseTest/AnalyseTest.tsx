import React from "react";
import { StyledCard } from "../PromptPlan/AddMessage";
import { Button, Flex, Space, Typography } from "antd";
import { StyleText } from "../Common/StyledComponent/inedx";

interface IAnalyseTestProps {
  testReport: {
    averageSimilarity: number;
    highestSimilarity: number;
    lowestSimilarity: number;
    similarityVariance: number;
    stabilityRating: string;
  }
  optimizationSuggestions: string;
  optimizationExample: string;
}

const { Text, Title } = Typography;

const AnalyseTest = ({
  testReport,
  optimizationSuggestions,
  optimizationExample,
}: IAnalyseTestProps) => {
  return (
    <Flex vertical gap={16} className="w-full h-full !p-6">
      <Flex vertical gap={2} className="w-full">
        <StyleText>Test Report</StyleText>
        <StyledCard>
          <Flex vertical gap={6}>
            <Flex gap={6} align="center">
              <Text strong>Average Similarity:</Text>
              <Text strong>{`${testReport.averageSimilarity}%`}</Text>
            </Flex>
            <Flex gap={6} align="center">
              <Text>Highest Similarity:</Text>
              <Text>{`${testReport.highestSimilarity}%`}</Text>
            </Flex>
            <Flex gap={6} align="center">
              <Text>Lowest Similarity:</Text>
              <Text>{`${testReport.lowestSimilarity}%`}</Text>
            </Flex>
            <Flex gap={6} align="center">
              <Text>Similarity Variance:</Text>
              <Text>{`${testReport.similarityVariance}%`}</Text>
            </Flex>
          </Flex>
          <Title level={3} className="mt-4 !mb-0">Stability Rating: {testReport?.stabilityRating ? testReport.stabilityRating : 'N/A'}</Title>
        </StyledCard>
      </Flex>
      <Flex vertical gap={2} flex={1}>
        <StyleText>Optimization Suggestions</StyleText>
        <StyledCard className="h-full overflow-y-auto">
          <Text>{optimizationSuggestions}</Text>
        </StyledCard>
      </Flex>
      <Flex vertical gap={2} flex={1}>
        <StyleText>Optimization Example</StyleText>
        <StyledCard className="h-full overflow-y-auto">
          <Text>{optimizationExample}</Text>
        </StyledCard>
      </Flex>
      <Button type="primary">Optimize Prompt</Button>
    </Flex>
  );
};

export default AnalyseTest;
