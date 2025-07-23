import React from 'react'
import MultipleTestComponent from '@/components/MultipleTest/MultipleTest'
import { useAppStore, useStore } from '@/store';

interface IMultipleTestProps {
  id: string;
}

const MultipleTest = (props: IMultipleTestProps) => {
  const { id } = props;
  const { multiple_test } = useStore((state) => ({
    multiple_test: state.chats[id].multiple_test,
  }));
  const setTestNumber = (test_number: number) => {
    useAppStore.setState((state) => {
      state.chats[id].multiple_test.test_number = test_number;
    });
  };
  const setExpectedResponse = (expected_response: string) => {
    useAppStore.setState((state) => {
      state.chats[id].multiple_test.expected_response = expected_response;
    });
  };
  return (
    <MultipleTestComponent />
  )
}

export default MultipleTest