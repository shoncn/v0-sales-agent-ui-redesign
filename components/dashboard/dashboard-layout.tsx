"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ChatAssistant } from "@/components/dashboard/chat-assistant";
import { WorkbenchContent } from "@/components/dashboard/workbench-content";
import { DiagnosisContent } from "@/components/dashboard/diagnosis-content";
import { CustomerDetail } from "@/components/dashboard/customer-detail";
import { TaskListContent } from "@/components/dashboard/task-list-content";

type ViewType = "workbench" | "diagnosis" | "tasks" | "customers" | "content" | "tools" | "customer-detail";
type AssistantMode = "default" | "analysis" | "customerProfile" | "actionStrategy";

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<string>("workbench");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>("default");
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("王先生");

  const handleCustomerClick = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab("customer-detail");
  };

  const handleBackFromCustomerDetail = () => {
    setSelectedCustomerId(null);
    setActiveTab("workbench");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "customer-detail") {
      setSelectedCustomerId(null);
    }
    // Reset assistant mode when changing tabs
    setAssistantMode("default");
  };

  // Task list interactions
  const handleConsultantClick = (customerName: string) => {
    setSelectedCustomerName(customerName);
    // 点击顾问助手按钮显示跟进建议/行动策略
    setAssistantMode("actionStrategy");
  };

  const handleActionClick = (customerName: string, action: "followUp" | "weChat") => {
    setSelectedCustomerName(customerName);
    // 点击写跟进或发企微只进入用户详情页，不改变Agent显示
    setSelectedCustomerId("wang-detail");
    setActiveTab("customer-detail");
  };

  const handleAssistantModeChange = (mode: AssistantMode) => {
    setAssistantMode(mode);
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab === "customer-detail" ? "workbench" : activeTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {activeTab === "workbench" && (
            <WorkbenchContent onCustomerClick={handleCustomerClick} />
          )}
          {activeTab === "diagnosis" && <DiagnosisContent />}
          {activeTab === "tasks" && (
            <TaskListContent 
              onConsultantClick={handleConsultantClick}
              onActionClick={handleActionClick}
            />
          )}
          {activeTab === "customer-detail" && (
            <CustomerDetail onBack={handleBackFromCustomerDetail} />
          )}
          {activeTab !== "workbench" && activeTab !== "diagnosis" && activeTab !== "customer-detail" && activeTab !== "tasks" && (
            <div className="p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🚧</div>
                <p className="text-sm">该功能正在开发中...</p>
              </div>
            </div>
          )}
        </main>

        {/* Chat Assistant */}
        <ChatAssistant 
          mode={assistantMode}
          customerName={selectedCustomerName}
          onModeChange={handleAssistantModeChange}
        />
      </div>
    </div>
  );
}
