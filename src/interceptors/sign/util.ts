import { Request } from 'express';

export function getParamsBackend(request: Request) {
  const method = request.method;

  const timestamp = request.headers['x-timestamp'];
  const nonce = request.headers['x-nonce'];

  const contentType = request.headers['content-type'];

  if (method === 'GET') {
    return normalizeValue({ ...request.query, timestamp, nonce });
  }

  if (method === 'POST' && contentType === 'application/json') {
    return normalizeValue({ ...request.body, timestamp, nonce });
  }

  if (
    method === 'POST' &&
    contentType === 'application/x-www-form-urlencoded'
  ) {
    return normalizeValue({
      ...request.body,
      file: undefined,
      files: undefined,
      timestamp,
      nonce,
    });
  }

  if (method === 'POST' && contentType.startsWith('multipart/form-data')) {
    return normalizeValue({
      ...request.body,
      file: undefined,
      files: undefined,
      timestamp,
      nonce,
    });
  }

  return {};
}
function normalizeValue(value) {
  // 1. 处理 null/undefined
  if (value === null || value === undefined) {
    return '';
  }

  // 2. 处理布尔值
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  // 3. 处理数字
  if (typeof value === 'number') {
    // 去除末尾无用的0，如 10.00 -> 10, 10.10 -> 10.1
    return parseFloat(value.toString()).toString();
  }

  // 4. 处理字符串
  if (typeof value === 'string') {
    // 移除首尾空格
    return value.trim();
  }

  // 5. 处理数组
  if (Array.isArray(value)) {
    // 深度规范化每个元素
    const normalized = value
      .map((item) => normalizeValue(item))
      .filter((item) => item !== ''); // 移除空值

    // 排序确保一致性
    normalized.sort();

    // 转换为字符串 [value1,value2]
    return `[${normalized.join(',')}]`;
  }

  // 6. 处理对象
  if (value && typeof value === 'object') {
    // 按key排序
    const sortedKeys = Object.keys(value).sort();

    // 构建 key:normalizedValue 对
    const pairs = sortedKeys
      .map((key) => {
        const normalized = normalizeValue(value[key]);
        return normalized !== '' ? `${key}:${normalized}` : null;
      })
      .filter((pair) => pair !== null); // 移除空值

    // 转换为字符串 {key1:value1,key2:value2}
    return `{${pairs.join(',')}}`;
  }

  // 7. 其他类型忽略（如文件）
  return '';
}
