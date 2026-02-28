import { motion } from 'motion/react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="h-48 bg-zinc-100 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-zinc-100 animate-pulse rounded-full" />
          <div className="h-4 w-24 bg-zinc-100 animate-pulse rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-full bg-zinc-100 animate-pulse rounded-lg" />
          <div className="h-4 w-2/3 bg-zinc-100 animate-pulse rounded-lg" />
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded-xl" />
          <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
