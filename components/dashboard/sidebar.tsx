"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  ListTodo,
  Users,
  FolderOpen,
  Wrench,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "工作台", id: "workbench" },
  { icon: BarChart3, label: "诊断看板", id: "diagnosis" },
  { icon: ListTodo, label: "任务列表", id: "tasks" },
  { icon: Users, label: "客户列表", id: "customers" },
  { icon: FolderOpen, label: "内容库", id: "content" },
  { icon: Wrench, label: "工具箱", id: "tools" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 shrink-0">
      {/* Logo */}
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-200/50">
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 w-full px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-[9px] font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className="mt-auto pt-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
          <span className="text-sm">👤</span>
        </div>
      </div>
    </aside>
  );
}
