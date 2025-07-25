import React, { useMemo } from 'react'
import AnalyseTestComponent from '@/components/AnalyseTest/AnalyseTest'
import { useStore } from '@/store'

interface IAnalyseTestProps {
  id: string
}

const AnalyseTest = (props: IAnalyseTestProps) => {
  const { id } = props
  const { multipleResponseMessages } = useStore((state) => ({
    multipleResponseMessages: state.chats[id]?.multiple_test.multiple_response_messages || [],
  }))

  const testReport = useMemo(() => {
    if (!multipleResponseMessages || multipleResponseMessages.length === 0) {
      return {
        averageSimilarity: 0,
        highestSimilarity: 0,
        lowestSimilarity: 0,
        similarityVariance: 0,
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
    
    // 根据方差确定稳定性评级 (A-D 等级)
    const getStabilityRating = (variance: number) => {
      if (variance < 0.01) return 'A'  // 优秀 - 非常稳定
      if (variance < 0.05) return 'B'  // 良好 - 比较稳定
      if (variance < 0.1) return 'C'   // 一般 - 中等稳定
      return 'D'                       // 差 - 不稳定
    }

    return {
      averageSimilarity: Math.round(averageSimilarity * 100) / 100,
      highestSimilarity: Math.round(highestSimilarity * 100) / 100,
      lowestSimilarity: Math.round(lowestSimilarity * 100) / 100,
      similarityVariance: Math.round(variance * 10000) / 100, // 转换为百分比
      stabilityRating: getStabilityRating(variance)
    }
  }, [multipleResponseMessages])
  
  return (
    <AnalyseTestComponent
      testReport={testReport}
      optimizationSuggestions={''}
      optimizationExample={''}
    />
  )
}

export default AnalyseTest