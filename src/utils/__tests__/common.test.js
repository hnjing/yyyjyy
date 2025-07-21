import { formatDate } from '../common.js';
import dayjs from 'dayjs';

// 测试 formatDate 方法
describe('formatDate', () => {
  it('应该返回格式化后的日期字符串', () => {
    const date = new Date('2024-01-01');
    const format = 'YYYY-MM-DD';
    const result = formatDate(date, format);
    expect(result).toBe(dayjs(date).format(format));
  });

  it('应该使用默认的日期格式', () => {
    const date = new Date('2024-01-01');
    const result = formatDate(date);
    expect(result).toBe(dayjs(date).format('YYYY-MM-DD'));
  });
});