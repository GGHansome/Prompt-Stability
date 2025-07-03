import TextArea, { TextAreaProps } from "antd/es/input/TextArea";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import React from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from '@codemirror/lint';

interface IDebounceTextAreaProps extends TextAreaProps {}

export const DebounceTextArea = (props: IDebounceTextAreaProps) => {
  const { value, onChange, ...rest } = props;
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue] = useDebounce(localValue, 300);
  useEffect(() => {
    if (value !== localValue && onChange) {
      onChange?.({
        target: { value: debouncedValue },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [debouncedValue]);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  return (
    <TextArea
      {...rest}
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
    />
  );
};

const jsonLinterExtension = linter(jsonParseLinter());

export const DebounceCodeEditor = (props: {
  code: string;
  placeholder?: string;
  status?: "error" | "warning" | "success";
  onChange: (code: string) => void;
}) => {
  const { code, onChange, placeholder, status } = props;
  const [localValue, setLocalValue] = useState(code);
  const [debouncedValue] = useDebounce(localValue, 500);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  useEffect(() => {
    if (code !== localValue && onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);
  useEffect(() => {
    setLocalValue(code);
  }, [code]);
  return (
    <CodeMirror
      autoFocus={true}
      placeholder={placeholder}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        searchKeymap: false,
        highlightActiveLine: false,
        highlightSelectionMatches: false,
      }}
      value={code}
      ref={editorRef}
      height="360px"
      extensions={[vscodeLight, json(), jsonLinterExtension]}
      onChange={(value) => {
        setLocalValue(value);
      }}
      className={`!border !rounded-sm !outline-none transition-colors pt-1 pb-1 pl-3 pr-3 ${
        status === "error"
          ? "!border-red-500 hover:!border-red-500 focus:!border-red-500"
          : "!border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
      }`}
    />
  );
};
