import { useState, useEffect, useCallback } from 'react';

// 全局状态存储
const globalState = new Map<string, any>();
const subscribers = new Map<string, Set<() => void>>();

// 获取状态
const getGlobalState = <T>(key: string): T | undefined => {
  return globalState.get(key);
};

// 设置状态并通知订阅者
const setGlobalState = <T>(key: string, value: T) => {
  globalState.set(key, value);
  const keySubscribers = subscribers.get(key);
  if (keySubscribers) {
    keySubscribers.forEach(callback => callback());
  }
};

// 订阅状态变化
const subscribe = (key: string, callback: () => void) => {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  subscribers.get(key)!.add(callback);
  
  // 返回取消订阅函数
  return () => {
    const keySubscribers = subscribers.get(key);
    if (keySubscribers) {
      keySubscribers.delete(callback);
      if (keySubscribers.size === 0) {
        subscribers.delete(key);
      }
    }
  };
};

// 模拟 useSWR 的 Hook
export const useGlobalState = <T>(
  key: string | string[], 
  fallbackData?: T
) => {
  const keyString = Array.isArray(key) ? key.join(':') : key;
  const [, forceUpdate] = useState({});
  
  // 强制组件重新渲染
  const rerender = useCallback(() => {
    forceUpdate({});
  }, []);

  // 订阅状态变化
  useEffect(() => {
    const unsubscribe = subscribe(keyString, rerender);
    return unsubscribe;
  }, [keyString, rerender]);

  // 获取当前状态
  const data = getGlobalState<T>(keyString) ?? fallbackData;

  // mutate 函数
  const mutate = useCallback((
    updater: T | ((current: T | undefined) => T),
    shouldRevalidate = true
  ) => {
    const currentData = getGlobalState<T>(keyString);
    const newData = typeof updater === 'function' 
      ? (updater as (current: T | undefined) => T)(currentData)
      : updater;
    
    setGlobalState(keyString, newData);
    
    return newData;
  }, [keyString]);

  return {
    data,
    mutate,
  };
}; 