import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import ChatHistory from './ChatHistory';
import { Card } from 'antd';

// 创建一个布局装饰器组件
const withLayout = (Story: any) => (
  <Card className='w-[80vw] max-w-4xl'>
    <Story />
  </Card>
);

// 测试数据
const mockItems = [
  {
    id: "1",
    title: "产品介绍对话",
    systemMessage: "关于新产品功能的详细介绍和用户反馈讨论",
    toolsName: ["产品", "反馈", "讨论"],
    lastChatAt: "2024-10-30"
  },
  {
    id: "2", 
    title: "技术支持咨询",
    systemMessage: "用户遇到的技术问题解答和解决方案提供",
    toolsName: ["技术支持", "问题解答"],
    lastChatAt: "2024-10-30"
  },
  {
    id: "3",
    title: "项目需求分析会议记录",
    systemMessage: "新项目的需求梳理、技术选型和实现方案讨论，包含详细的功能点分析和风险评估",
    toolsName: ["需求分析", "技术选型", "方案设计", "风险评估", "项目管理"],
    lastChatAt: "2024-10-30"
  },
  {
    id: "4",
    title: "用户体验优化建议",
    systemMessage: "基于用户调研数据提出的界面优化建议",
    toolsName: ["UX", "优化"],
    lastChatAt: "2024-10-30"
  }
];

const longContentItems = [
  {
    id: "1",
    title: "这是一个非常长的标题，用来测试标题的省略号显示效果，看看是否能正确处理超长文本",
    systemMessage: "这是一个非常长的描述文本，用来测试描述的省略号显示效果。这个描述包含了很多详细的信息，比如项目背景、技术栈选择、实现难点、解决方案等等，目的是看看组件是否能正确处理超长的描述文本并显示省略号。",
    toolsName: ["超长标签名称测试", "省略号测试", "文本溢出处理", "用户体验", "界面设计", "组件开发", "前端技术", "React", "TypeScript", "Ant Design"],
    lastChatAt: "2024-10-30"
  }
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ChatHistory',
  component: ChatHistory,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    chatHistoryList: {
      description: '聊天历史记录数据数组',
      control: { type: 'object' }
    }
  },
  args: {
  },
  // 应用装饰器到所有story
  decorators: [withLayout],
} satisfies Meta<typeof ChatHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础使用场景
export const Basic: Story = {
  args: {
    chatHistoryList: mockItems,
    onCreateChat: () => {},
    onDeleteChat: () => {},
    onChatChange: () => {},
    onTitleChange: () => {},
  },
};

// 自定义数据
export const WithCustomData: Story = {
  args: {
    chatHistoryList: mockItems,
    onCreateChat: () => {},
    onDeleteChat: () => {},
    onChatChange: () => {},
    onTitleChange: () => {},
  },
};

// 测试长文本省略号
export const WithLongContent: Story = {
  args: {
    chatHistoryList: longContentItems,
    onCreateChat: () => {},
    onDeleteChat: () => {},
    onChatChange: () => {},
    onTitleChange: () => {},
  },
};

// 空数据状态
export const EmptyState: Story = {
  args: {
    chatHistoryList: [],
    onCreateChat: () => {},
    onDeleteChat: () => {},
    onChatChange: () => {},
    onTitleChange: () => {},
  },
};
