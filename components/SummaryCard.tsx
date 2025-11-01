"use client";

import { useTranslations } from "next-intl";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: "green" | "yellow" | "red" | "blue";
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: SummaryCardProps) {
  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
    red: "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
    blue: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
  };

  return (
    <div
      className={`rounded-lg sm:rounded-xl border-2 p-4 sm:p-5 md:p-6 shadow-md transition-all hover:shadow-lg ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium opacity-80">{title}</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-bold break-words">{value}</p>
          {subtitle && (
            <p className="mt-1 text-[10px] xs:text-xs opacity-70">{subtitle}</p>
          )}
        </div>
        {icon && <span className="text-2xl sm:text-3xl md:text-4xl ml-2 flex-shrink-0">{icon}</span>}
      </div>
    </div>
  );
}

