import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type AnyObject = { [k: string]: unknown };

const getDifferences = (prev: AnyObject, current: AnyObject) => {
  type Difference = {
    key: string;
    type: "added" | "removed" | "changed";
    v: {
      prev: unknown;
      current: unknown;
    };
    isEqual_withObjectIs?: boolean;
    isEqual_withJsonStringify?: boolean;
  };
  const differences: Difference[] = [];

  // get all keys
  const allKeys = Array.from(
    new Set([...Object.keys(prev), ...Object.keys(current)])
  );

  // create diff
  allKeys.forEach((key) => {
    const prevV = prev[key];
    const currentV = current[key];

    // if new prop
    if (!prevV && currentV) {
      differences.push({
        key,
        type: "added",
        v: {
          prev: prevV,
          current: currentV,
        },
      });
      return;
    }

    // if removed prop
    if (prevV && !currentV) {
      differences.push({
        key,
        type: "removed",
        v: {
          prev: prevV,
          current: currentV,
        },
      });
      return;
    }

    // if not changed
    const isEqual_withObjectIs = Object.is(prevV, currentV);
    const isEqual_withJsonStringify =
      JSON.stringify(prevV) === JSON.stringify(currentV);
    if (isEqual_withObjectIs && isEqual_withJsonStringify) return;

    // if changed
    differences.push({
      key,
      type: "changed",
      v: {
        prev: prevV,
        current: currentV,
      },
      isEqual_withObjectIs,
      isEqual_withJsonStringify,
    });
  });

  return differences;
};

export const useLogDifferencesBetweenPrevAndCurrentValue = (
  currentValue: AnyObject
) => {
  const prevValue = useRef(currentValue);

  // on every render => log differences
  useEffect(() => {
    const differences = getDifferences(prevValue.current, currentValue);
    prevValue.current = currentValue;
    console.log({ differences });
  }, [currentValue]);

  return null;
};

export const useEvent = (fn: (...args: any[]) => void) => {
  const fnRef = useRef(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  return useCallback((...args: any[]) => {
    fnRef.current(...args);
  }, []);
};
