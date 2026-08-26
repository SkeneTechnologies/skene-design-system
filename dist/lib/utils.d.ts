import { type ClassValue } from 'clsx';
/**
 * The only approved class-merging utility.
 *
 * clsx resolves conditionals; twMerge then drops Tailwind classes that a later
 * one overrides, so `cn('p-2', 'p-4')` is `p-4` rather than both. Passing raw
 * template strings instead is how conflicting utilities end up fighting in the
 * cascade with the winner decided by stylesheet order.
 */
export declare function cn(...inputs: ClassValue[]): string;
//# sourceMappingURL=utils.d.ts.map