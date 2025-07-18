import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import React, { memo } from 'react';

import MultipleTest from './MultipleTest';
import { Card } from 'antd';

// 创建一个布局装饰器组件
const withLayout = (Story: any) => (
  <Card className='w-[80vw]'>
    <Story />
  </Card>
);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'MultipleTest',
  component: MultipleTest,
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

  },
  // 应用装饰器到所有story
  decorators: [withLayout],
} satisfies Meta<typeof MultipleTest>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
  },
};
