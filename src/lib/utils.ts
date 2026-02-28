import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: string | Date, lang: 'bn' | 'en') {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (lang === 'en') {
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return d.toLocaleDateString();
  } else {
    if (diffInSeconds < 60) return 'এইমাত্র';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} মিনিট আগে`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ঘণ্টা আগে`;
    return d.toLocaleDateString('bn-BD');
  }
}
