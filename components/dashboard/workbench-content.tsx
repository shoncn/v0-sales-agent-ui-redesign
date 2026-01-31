"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { ExperienceCard } from "@/components/dashboard/experience-card";
import { WorkbenchFunnel } from "@/components/dashboard/workbench-funnel";
import { CustomerTasks } from "@/components/dashboard/customer-tasks";
import { TodoList } from "@/components/dashboard/todo-list";

interface WorkbenchContentProps {
  onCustomerClick?: (customerId: string) => void;
  onViewAllTasks?: () => void;
}

export function WorkbenchContent({ onCustomerClick, onViewAllTasks }: WorkbenchContentProps) {
  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">本月累计核心数据</h1>
        <span className="text-xs text-gray-400">销售核心数据看板</span>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Experience & Service Quality + Funnel Row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7">
          <ExperienceCard />
        </div>
        <div className="col-span-5">
          <WorkbenchFunnel />
        </div>
      </div>

      {/* Customer Tasks and Todo List */}
      <div className="grid grid-cols-2 gap-4">
        <CustomerTasks onCustomerClick={onCustomerClick} onViewAllTasks={onViewAllTasks} />
        <TodoList />
      </div>
    </div>
  );
}
