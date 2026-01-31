"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  ListTodo,
  Users,
  FolderOpen,
  Wrench,
  Menu,
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
}

export function FloatingMenu({ activeTab, onTabChange }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleItemClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Menu Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 w-[280px] animate-in fade-in slide-in-from-left-4 duration-200"
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-800">导航菜单</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Grid - 3 items per row */}
          <div className="grid grid-cols-3 gap-2">
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
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Info Section */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">销售顾问</p>
                <p className="text-xs text-gray-500">小明</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
