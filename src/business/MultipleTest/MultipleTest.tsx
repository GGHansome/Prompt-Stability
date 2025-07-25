import React, { useMemo, useState } from "react";
import MultipleTestComponent from "@/components/MultipleTest/MultipleTest";
import { useAppStore, useStore } from "@/store";
import useApp from "antd/es/app/useApp";
import type { MultipleApiResponse } from "@/app/api/type";

interface IMultipleTestProps {
  id: string;
}

const MultipleTest = (props: IMultipleTestProps) => {
  const { id } = props;
  const { message } = useApp();
  const { multiple_test, system_message, custom_messages, tools, model } =
    useStore((state) => ({
      system_message: state.chats[id]?.system_message,
      custom_messages: state.chats[id]?.custom_messages,
      tools: state.chats[id]?.tools,
      model: state.chats[id]?.model,
      multiple_test: state.chats[id]?.multiple_test,
    }));
  const [isLoading, setIsLoading] = useState(false);

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

  const onStartTest = async () => {
    setIsLoading(true);
    const requests = Array.from(
      { length: multiple_test.test_number },
      async (_, index) => {
        try {
          const response = await fetch("/api/multiple", {
            method: "POST",
            body: JSON.stringify({
              messages: custom_messages,
              apikey: "1234",
              system_message: system_message,
              tools: tools,
              model: model,
              expected_response: multiple_test?.expected_response,
            }),
          });
          const result: MultipleApiResponse = await response.json();
          if (result.status === "success" && result.data) {
            useAppStore.setState((state) => {
              state.chats[id].multiple_test.multiple_response_messages.push(
                result.data!
              );
            });
            return result.data;
          } else {
            throw new Error(result.message || "Unknown error");
          }
        } catch (error) {
          message.error(`Test ${index + 1} failed: ${error}`);
        }
      }
    );
    await Promise.all(requests);
    setIsLoading(false);
  };

  const onClear = () => {
    useAppStore.setState((state) => {
      state.chats[id].multiple_test.multiple_response_messages = [];
    });
  };

  const onRefresh = () => {
    onClear();
    onStartTest();
  };

  const canStart = () => useMemo(() => {
    if(!multiple_test?.expected_response){
      return {
        status: false,
        message: 'Expected Response is required'
      }
    }
    if(custom_messages?.length === 0){
      return {
        status: false,
        message: 'You must input at least one Prompt Messages'
      }
    }
    return {
      status: true,
      message: ''
    }
  }, [multiple_test, custom_messages])

  return (
    <MultipleTestComponent
      testNumber={multiple_test?.test_number}
      expectedResponse={multiple_test?.expected_response}
      multipleResponseMessages={multiple_test?.multiple_response_messages}
      isLoading={isLoading}
      canStart={canStart()}
      setTestNumber={setTestNumber}
      setExpectedResponse={setExpectedResponse}
      onStart={onStartTest}
      onClear={onClear}
      onRefresh={onRefresh}
    />
  );
};

export default MultipleTest;
