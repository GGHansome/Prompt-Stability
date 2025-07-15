import { UnorderedListOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Flex,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import { StyleText } from "@/components/Common/StyledComponent/inedx";
import { Adjustment } from "@/store/types";
import { DebounceSelect, DebounceStepInput } from "@/components/Common/DebounceForm";

interface IAdjustmentProps {
  toolNames: string[];
  adjustment: Adjustment;
  setAdjustment: (key: keyof Adjustment, value: any) => void;
}

const AdjustmentComponent = ({
  toolNames,
  adjustment,
  setAdjustment,
}: IAdjustmentProps) => {
  const [stopSequenceInput, setStopSequenceInput] = useState<string>("");
  return (
    <Dropdown
      trigger={["click"]}
      placement="bottom"
      dropdownRender={() => (
        <Space
          direction="vertical"
          className="w-[20rem] bg-white rounded-lg p-4 shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12),0_9px_28px_8px_rgba(0,0,0,0.05)]"
        >
          {toolNames.length > 0 && (
            <Flex justify="space-between" align="center">
              <StyleText>Tool choice</StyleText>
              <Select
                popupMatchSelectWidth={false}
                variant="borderless"
                placeholder="Select a model..."
                value={
                  typeof adjustment.tool_choice === "object"
                    ? adjustment.tool_choice.toolName
                    : adjustment.tool_choice
                }
                options={[
                  { value: "auto", label: "auto" },
                  { value: "none", label: "none" },
                  { value: "required", label: "required" },
                  ...toolNames.map((toolName) => ({
                    value: toolName,
                    label: `${toolName}()`,
                  })),
                ]}
                onChange={(value) => {
                  if (["auto", "none", "required"].includes(value)) {
                    setAdjustment("tool_choice", value);
                  } else {
                    setAdjustment("tool_choice", {
                      type: "tool",
                      toolName: value,
                    });
                  }
                }}
              />
            </Flex>
          )}
          <DebounceStepInput
            title="Temperature"
            min={0}
            max={2}
            step={0.01}
            initValue={1}
            value={adjustment.temperature}
            onChange={(value) => {
              setAdjustment("temperature", value);
            }}
          />
          <DebounceStepInput
            title="Max tokens"
            min={1}
            max={16384}
            step={1}
            initValue={2048}
            value={adjustment.max_tokens}
            onChange={(value) => {
              setAdjustment("max_tokens", value);
            }}
          />
          <Flex vertical gap={2}>
            <StyleText>Stop sequences</StyleText>
            <StyleText className="!text-[11px]">
              Enter sequence and press Tab
            </StyleText>
            <DebounceSelect
              suffixIcon={null}
              mode="multiple"
              open={adjustment.stop_sequences?.length < 4 ? true : false}
              popupClassName="hidden-dropdown"
              style={{ width: "100%" }}
              value={adjustment.stop_sequences}
              searchValue={stopSequenceInput}
              onInputKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" || e.key === "Tab") {
                  e.stopPropagation();
                  e.preventDefault();
                  const trimmedValue = stopSequenceInput.trim();
                  if (
                    trimmedValue &&
                    !adjustment.stop_sequences.includes(trimmedValue)
                  ) {
                    setStopSequenceInput("");
                    setAdjustment("stop_sequences", [
                      ...adjustment.stop_sequences,
                      trimmedValue,
                    ]);
                  }
                } else if (
                  e.key === "Backspace" &&
                  !stopSequenceInput &&
                  adjustment.stop_sequences.length > 0
                ) {
                  setAdjustment(
                    "stop_sequences",
                    adjustment.stop_sequences.slice(0, -1)
                  );
                }
              }}
              onSearch={(value) => {
                if (adjustment.stop_sequences?.length >= 4) {
                  return;
                }
                setStopSequenceInput(value);
              }}
            />
            <StyleText className="!text-[12px] text-right">
              {adjustment.stop_sequences?.length} / 4
            </StyleText>
          </Flex>
          <DebounceStepInput
            title="Top P"
            min={0}
            max={1}
            step={0.01}
            initValue={1}
            value={adjustment.top_p}
            onChange={(value) => {
              setAdjustment("top_p", value);
            }}
          />
          <DebounceStepInput
            title="Frequency penalty"
            min={0}
            max={2}
            step={0.01}
            initValue={0}
            value={adjustment.frequency_penalty}
            onChange={(value) => {
              setAdjustment("frequency_penalty", value);
            }}
          />
          <DebounceStepInput
            title="Presence penalty"
            min={0}
            max={2}
            step={0.01}
            initValue={0}
            value={adjustment.presence_penalty}
            onChange={(value) => {
              setAdjustment("presence_penalty", value);
            }}
          />
        </Space>
      )}
    >
      <Button type="text" icon={<UnorderedListOutlined />} />
    </Dropdown>
  );
};

export default AdjustmentComponent;
