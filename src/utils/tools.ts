// 创建一个WeakMap来存储对象的唯一标识
const objectIdMap = new WeakMap();
let objectIdCounter = 0;

// 获取对象的唯一标识符
export const getObjectId = (obj: any) => {
  if (!objectIdMap.has(obj)) {
    objectIdMap.set(obj, ++objectIdCounter);
  }
  return objectIdMap.get(obj);
};