"use client";

import { Menu } from "lucide-react";

interface TopHeaderProps {
  onMenuClick: () => void;
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="w-11 h-11 flex items-center justify-center rounded-xl active:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>

        {/* Name and Title */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">高磊</span>
          <span className="text-xs text-gray-500">产品专家 | 杭州拱墅汽车城零售门店
</span>
        </div>
      </div>

      {/* Right Section - Stats */}
      <div className="flex items-center gap-6">
        {/* Combat Value */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">战力值:</span>
          <span className="text-sm font-bold text-emerald-600">4201</span>
        </div>

        {/* Rankings */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">全国排名:</span>
            <span className="font-semibold text-blue-600">156</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">区域排名:</span>
            <span className="font-semibold text-blue-600">12</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">门店排名:</span>
            <span className="font-semibold text-blue-600">2</span>
          </div>
        </div>
      </div>
    </header>
  );
}
