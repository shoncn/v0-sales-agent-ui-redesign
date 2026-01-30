"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    label: "商机数",
    value: "390",
    subLabel: "门店均值: 350",
    change: "+11.4%",
    isPositive: true,
  },
  {
    label: "邀约数",
    value: "156",
    subLabel: "门店均值: 140",
    change: "+11.4%",
    isPositive: true,
  },
  {
    label: "试驾数",
    value: "23",
    subLabel: "门店均值: 35",
    change: "-34.3%",
    isPositive: false,
    isWarning: true,
  },
  {
    label: "跟进数",
    value: "18",
    subLabel: "门店均值: 15",
    change: "+20%",
    isPositive: true,
  },
  {
    label: "成交数",
    value: "7",
    subLabel: "门店均值: 8",
    change: "-12.5%",
    isPositive: false,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
            stat.isWarning 
              ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/50 ring-1 ring-amber-100' 
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className={`text-xs font-medium mb-1.5 ${stat.isWarning ? 'text-amber-600' : 'text-gray-400'}`}>
            {stat.label}
            {stat.isWarning && <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-[10px]">预警</span>}
          </div>
          <div className={`text-2xl font-bold mb-1.5 ${stat.isWarning ? 'text-amber-600' : 'text-gray-800'}`}>
            {stat.value}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-400">{stat.subLabel}</span>
            <span
              className={`flex items-center text-[10px] font-medium ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`}
            >
              {stat.isPositive ? (
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
              )}
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
