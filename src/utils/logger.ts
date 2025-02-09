/**
 * 只會在開發模式下執行的 ```console.log()```
 * @param args - 想要log的參數
 */
export function logger(...args: unknown[]) {
    if (import.meta.env.DEV) console.log(...args);
}