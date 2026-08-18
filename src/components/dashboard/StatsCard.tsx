import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  iconBgColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  iconBgColor = 'bg-indigo-50 text-indigo-600',
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>

          {trend && (
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>

        {description && (
          <p className="text-xs text-slate-400 mt-1.5 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
};
