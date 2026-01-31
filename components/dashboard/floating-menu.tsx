"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  ListTodo,
  Users,
  FolderOpen,
  Wrench,
  X,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "工作台", id: "workbench" },
  { icon: BarChart3, label: "诊断看板", id: "diagnosis" },
  { icon: ListTodo, label: "任务列表", id: "tasks" },
  { icon: Users, label: "客户列表", id: "customers" },
  { icon: FolderOpen, label: "内容库", id: "content" },
  { icon: Wrench, label: "工具箱", id: "tools" },
];

interface FloatingMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FloatingMenu({ activeTab, onTabChange, isOpen, onClose }: FloatingMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when tapping outside (touch-friendly)
  useEffect(() => {
    const handleTouchOrClick = (event: TouchEvent | MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("touchstart", handleTouchOrClick);
    document.addEventListener("mousedown", handleTouchOrClick);
    return () => {
      document.removeEventListener("touchstart", handleTouchOrClick);
      document.removeEventListener("mousedown", handleTouchOrClick);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Floating Menu Panel */}
      <div
        ref={menuRef}
        className="absolute left-4 top-16 z-50 bg-white rounded-xl shadow-2xl p-4 w-[260px] animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">导航菜单</span>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-gray-100 transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Grid - 3 items per row */}
        <div className="grid grid-cols-3 gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "flex flex-col items-center gap-2 py-4 px-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-500 active:bg-gray-100 active:text-gray-700"
                )}
              >
                <Icon className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
