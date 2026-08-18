import React from 'react';

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-52 bg-slate-200 w-full" />

      {/* Body Skeleton */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-4 w-16 bg-slate-100 rounded-md" />
        </div>

        <div className="h-6 w-5/6 bg-slate-200 rounded-md mt-1" />
        <div className="h-4 w-full bg-slate-100 rounded-md" />
        <div className="h-4 w-4/5 bg-slate-100 rounded-md" />

        {/* Footer Skeleton */}
        <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="flex flex-col gap-1">
              <div className="h-3.5 w-24 bg-slate-200 rounded-md" />
              <div className="h-3 w-16 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="w-6 h-6 rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs animate-pulse flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 bg-slate-200 rounded-md" />
        <div className="h-8 w-16 bg-slate-200 rounded-md" />
        <div className="h-3.5 w-28 bg-slate-100 rounded-md mt-1" />
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-100" />
    </div>
  );
};

export const BlogDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="h-6 w-28 bg-slate-200 rounded-full mx-auto" />
      <div className="h-10 w-4/5 bg-slate-200 rounded-lg mx-auto" />
      <div className="h-5 w-3/5 bg-slate-100 rounded-md mx-auto" />

      <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-100">
        <div className="w-12 h-12 rounded-full bg-slate-200" />
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
          <div className="h-3 w-24 bg-slate-100 rounded-md" />
        </div>
      </div>

      <div className="h-96 w-full bg-slate-200 rounded-2xl" />

      <div className="space-y-4 pt-6 max-w-2xl mx-auto">
        <div className="h-4 w-full bg-slate-100 rounded-md" />
        <div className="h-4 w-full bg-slate-100 rounded-md" />
        <div className="h-4 w-5/6 bg-slate-100 rounded-md" />
        <div className="h-32 w-full bg-slate-100 rounded-xl" />
        <div className="h-4 w-full bg-slate-100 rounded-md" />
      </div>
    </div>
  );
};
