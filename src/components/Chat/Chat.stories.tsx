import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import React, { memo } from 'react';

import Chat from './Chat';
import { Card } from 'antd';

// 创建一个布局装饰器组件
const withLayout = (Story: any) => (
  <Card className='w-[80vw]'>
    <Story />
  </Card>
);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Chat',
  component: Chat,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
  args: {
    handleDelete: () => {},
    handleSubmit: () => {},
    stop: () => {},
    error: undefined,
    reload: () => {},
  },
  // 应用装饰器到所有story
  decorators: [withLayout],
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    input: "",
    handleInputChange: () => {},
    status: 'done',
    customMessages: [],
    messages: Array.from({length: 20}).map((_, index) => ({
      id: index.toString(),
      content: 'Hello, world!',
      role: index % 2 === 0 ? 'user' : 'assistant',
      parts: [
        {
          type: 'text',
          text: 'Hello, world!',
        },
      ],
    })),  
    model: 'gpt-4o',
  },
  render: (args) => {
    const [{ input }, updateArgs] = useArgs();
    return <Chat {...args} input={input} handleInputChange={(e) => updateArgs({ input: e.target.value })} />;
  },
};
