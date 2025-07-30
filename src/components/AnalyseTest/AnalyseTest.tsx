import React from "react";
import { Button, Flex, Spin, Typography } from "antd";
import { StyledCard, StyledText } from "../Common/StyledComponent/inedx";

interface IAnalyseTestProps {
  testReport: {
    averageSimilarity: number;
    highestSimilarity: number;
    lowestSimilarity: number;
    coefficientOfVariation: number;
    stabilityRating: string;
  };
  optimizationSuggestions: string;
  optimizationExample: string;
  isLoading: boolean;
  disabled: boolean;
  handleOptimizePrompt: () => void;
}

const { Text, Title } = Typography;

const AnalyseTest = ({
  testReport,
  optimizationSuggestions,
  optimizationExample,
  isLoading,
  disabled,
  handleOptimizePrompt,
}: IAnalyseTestProps) => {
  return (
    <Flex vertical gap={16} className="w-full h-full !p-6">
      <Flex vertical gap={2} className="w-full">
        <StyledText>Test Report</StyledText>
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
              <Text>Coefficient of Variation:</Text>
              <Text>{`${testReport.coefficientOfVariation}%`}</Text>
            </Flex>
          </Flex>
          <Title level={3} className="mt-4 !mb-0">
            Stability Rating:{" "}
            {testReport?.stabilityRating ? testReport.stabilityRating : "N/A"}
          </Title>
        </StyledCard>
      </Flex>
      <Flex vertical gap={2} flex={1} className="min-h-0">
        <StyledText>Optimization Suggestions</StyledText>
        <StyledCard className="overflow-y-auto h-full">
          <Flex
            justify={
              !optimizationSuggestions && isLoading ? "center" : "flex-start"
            }
            align={
              !optimizationSuggestions && isLoading ? "center" : "flex-start"
            }
            className="h-full"
          >
            <Spin spinning={!optimizationSuggestions && isLoading} />
            <Text className="whitespace-pre-line">
              {optimizationSuggestions}
            </Text>
          </Flex>
        </StyledCard>
      </Flex>
      <Flex vertical gap={2} flex={1} className="min-h-0">
        <StyledText>Optimization Example</StyledText>
        <StyledCard className="h-full overflow-y-auto">
          <Flex
            justify={
              !optimizationExample && isLoading ? "center" : "flex-start"
            }
            align={!optimizationExample && isLoading ? "center" : "flex-start"}
            className="h-full"
          >
            <Spin spinning={!optimizationExample && isLoading} />
            <Text className="whitespace-pre-line">{optimizationExample}</Text>
          </Flex>
        </StyledCard>
      </Flex>
      <Button type="primary" onClick={handleOptimizePrompt} disabled={disabled}>
        Optimize Prompt
      </Button>
    </Flex>
  );
};

export default AnalyseTest;
