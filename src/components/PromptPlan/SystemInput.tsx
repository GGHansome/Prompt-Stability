import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface ISystemInputProps {
  system_message: string;
  setSystemMessage: (value: string) => void;
}

const SystemInput = ({
  system_message,
  setSystemMessage,
}: ISystemInputProps) => {
  const [localValue, setLocalValue] = useState(system_message);
  const [debouncedValue] = useDebounce(localValue, 300);
  useEffect(() => {
    if (system_message !== localValue) {
      setSystemMessage(debouncedValue);
    }
  }, [debouncedValue]);
  useEffect(() => {
    setLocalValue(system_message);
  }, [system_message]);
  return (
    <TextArea
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      placeholder="Describe desired model behavior(tone, tool usage, response style)"
      autoSize={{ minRows: 10, maxRows: 15 }}
      rows={10}
    />
  );
};

export default SystemInput;
