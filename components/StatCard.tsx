"use client";

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "blue" | "amber" | "green" | "red" | "purple";
  trend?: { value: string; up: boolean };
}

const colorMap = {
  blue: { icon: "bg-[#1E3A5F] text-white" },
  amber: { icon: "bg-[#F0A500] text-white" },
  green: { icon: "bg-green-600 text-white" },
  red: { icon: "bg-red-500 text-white" },
  purple: { icon: "bg-purple-600 text-white" },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={trend.up ? "text-xs mt-2 font-medium text-green-600" : "text-xs mt-2 font-medium text-red-500"}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + c.icon}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
