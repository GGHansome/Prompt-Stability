import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import PromptPlan from './PromptPlan';
import { Card } from 'antd';

// 创建一个布局装饰器组件
const withLayout = (Story: any) => (
  <Card className='w-[80vw]'>
    <Story />
  </Card>
);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'PromptPlan',
  component: PromptPlan,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  // 应用装饰器到所有story
  decorators: [withLayout],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { 
    model: 'gpt-4o',
    adjustment: {
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1, 
      frequency_penalty: 0,
      presence_penalty: 0,
      tool_choice: 'auto',
      stop_sequences: [],
    },
    tools: [
      {
        name: 'tool1',
        description: 'tool1 description',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
          required: ['name'],
        },
      }
    ],
    system_message: 'You are a helpful assistant.',
    customMessages: [],
    setSystemMessage: () => {},
    setModel: () => {},
    setAdjustment: () => {},
    setTools: () => {},
    setMessages: () => {},
   },
} satisfies Meta<typeof PromptPlan>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    
  },
};
