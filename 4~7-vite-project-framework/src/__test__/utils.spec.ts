import { add } from '@/utils/index';

describe('test util function', () => {
  test('test add fuction', () => {
    expect(add(1, 2)).toBe(3);
  });
});

describe('test mock function', async () => {
  test('test mock function', async () => {
    const obj = { test: 'hello' };
    const mockFn = vi.fn().mockImplementation(() => obj);

    await mockFn();

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toHaveReturnedWith(obj);
  });

  test('test promise', async () => {
    const mockFn = vi.fn((num) => Promise.resolve(num + 1));
    expect(mockFn).not.toBeCalled();
    expect(mockFn).toBeCalledTimes(0);
    expect(mockFn.mock.calls.length).toBe(0);

    const res = await mockFn(2);

    expect(mockFn).toBeCalledTimes(1);
    expect(res).toBe(3);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.results[0].value).toBe(3);
  });

  test('timer', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const timer = (f) => setTimeout(f, 500);
    timer(mockFn);
    expect(mockFn).not.toBeCalled();
    expect(mockFn).toBeCalledTimes(0);
    expect(mockFn.mock.calls.length).toBe(0);
    vi.advanceTimersByTime(600);
    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn.mock.calls.length).toBe(1);
  });
});
