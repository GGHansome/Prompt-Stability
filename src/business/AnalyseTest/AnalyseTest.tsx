import React, { useEffect, useMemo } from 'react'
import { experimental_useObject as useObject } from '@ai-sdk/react';
import AnalyseTestComponent from '@/components/AnalyseTest/AnalyseTest'
import { useAppStore, useStore } from '@/store'
import { OptimizeSchema } from '@/app/api/optimize/route';
import useApp from 'antd/es/app/useApp';

interface IAnalyseTestProps {
  id: string
}

const AnalyseTest = (props: IAnalyseTestProps) => {
  const { id } = props
  const {message} = useApp()
  const { object, isLoading, submit } = useObject({
    api: '/api/optimize',
    schema: OptimizeSchema,
    onError: (error) => {
      message.error(JSON.stringify(error))
    },
    onFinish: ({object}) => {
      useAppStore.setState((state) => {
        state.chats[id].optimization = {
          suggest: object?.optimization_suggestions || '',
          example: object?.optimization_example || '',
        }
      })
    }
  });
  const { systemMessage, multipleResponseMessages, expectedResponse, optimization } = useStore((state) => ({
    systemMessage: state.chats[id]?.system_message,
    multipleResponseMessages: state.chats[id]?.multiple_test.multiple_response_messages,
    expectedResponse: state.chats[id]?.multiple_test.expected_response,
    optimization: state.chats[id]?.optimization,
  }))

  const testReport = useMemo(() => {
    if (!multipleResponseMessages || multipleResponseMessages.length === 0) {
      return {
        averageSimilarity: 0,
        highestSimilarity: 0,
        lowestSimilarity: 0,
        coefficientOfVariation: 0,
        stabilityRating: 'No Data'
      }
    }
    const similarities = multipleResponseMessages.map(msg => msg.similarity)
    // 计算最高值和最低值
    const highestSimilarity = Math.max(...similarities)
    const lowestSimilarity = Math.min(...similarities)
    // 计算平均值
    const averageSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length
    // 计算方差
    const variance = similarities.reduce((sum, sim) => sum + Math.pow(sim - averageSimilarity, 2), 0) / similarities.length
    const standardDeviation = Math.sqrt(variance)
    // 避免除零错误，当平均值为0时，变异系数设为0
    const coefficientOfVariation = averageSimilarity === 0 ? 0 : standardDeviation / averageSimilarity

    // 根据平均相似度和变异系数综合评定稳定性等级
    const getStabilityRating = (avgSim: number, cv: number) => {
      // 优秀：高相似度且低变异系数
      if (avgSim >= 0.8 && cv < 0.1) return 'A'
      // 良好：中高相似度且低变异系数，或高相似度但中等变异系数
      if ((avgSim >= 0.7 && cv < 0.15) || (avgSim >= 0.8 && cv < 0.2)) return 'B'
      // 一般：中等相似度且中等变异系数，或较高相似度但高变异系数
      if ((avgSim >= 0.5 && cv < 0.2) || (avgSim >= 0.7 && cv < 0.3)) return 'C'
      // 差：低相似度或高变异系数
      return 'D'
    }

    return {
      averageSimilarity: Math.round(averageSimilarity * 100) / 100,
      highestSimilarity: Math.round(highestSimilarity * 100) / 100,
      lowestSimilarity: Math.round(lowestSimilarity * 100) / 100,
      // similarityVariance: Math.round(variance * 10000) / 100,
      coefficientOfVariation: Math.round(coefficientOfVariation * 10000) / 100, // CV百分比
      stabilityRating: getStabilityRating(averageSimilarity, coefficientOfVariation)
    }
  }, [multipleResponseMessages])

  const handleOptimizePrompt = async () => {
    useAppStore.setState((state) => {
      state.chats[id].optimization = {
        suggest: '',
        example: '',
      }
    })
    submit({
      system_message: systemMessage,
      expected_response: expectedResponse,
      multiple_response_messages: multipleResponseMessages.slice(0, 10),
      averageSimilarity: testReport.averageSimilarity,
      coefficientOfVariation: testReport.coefficientOfVariation,
    })
  }
  
  return (
    <AnalyseTestComponent
      testReport={testReport}
      optimizationSuggestions={object?.optimization_suggestions || optimization?.suggest || ''}
      optimizationExample={object?.optimization_example || optimization?.example || ''}
      isLoading={isLoading}
      disabled={multipleResponseMessages?.length === 0}
      handleOptimizePrompt={handleOptimizePrompt}
    />
  )
}

export default AnalyseTest