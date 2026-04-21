import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 工具函式：條件組合 class 名稱，並合併 Tailwind CSS 類別。
 * @param inputs - class 名稱或含條件判斷的物件陣列。
 * @returns 合併後的單一 class 字串。
 */

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}
