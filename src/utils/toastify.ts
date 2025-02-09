import { toast } from "react-toastify";

/**
 * 依照promise的狀態，顯示不同的Toastify訊息
 * @param promise - 一個promise物件，根據此物件的狀態顯示不同的訊息
 * @param msgs - 一個物件，包含pending和success兩個訊息
 * @param autoClose - 一個數字，設定Toastify自動關閉的時間(milliseconds)
 */
export function hanlePromiseToastify(promise: Promise<unknown>, msgs: { pending?: string, success?: string }, autoClose: number = 2000) {
    toast.promise(promise, {
        pending: msgs.pending,
        success: msgs.success,
    }, { autoClose: autoClose });
};