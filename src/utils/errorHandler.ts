import { logger } from "./logger";
import { toast } from "react-toastify";

/**
 * 使用 logger 在console顯示錯誤訊息(只在開發模式)，使用 toast 顯示錯誤訊息。注意，需要有 ```<ToastContainer />``` 才能顯示 ```toast.error```
 * @param error - 一個error物件
 */
export function handleError(error: unknown) {
    logger(error);
    if (error instanceof Error) { toast.error(error.message) };
};

