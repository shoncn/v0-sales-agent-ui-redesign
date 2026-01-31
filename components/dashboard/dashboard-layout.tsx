"use client";

import { useState } from "react";
import { TopHeader } from "@/components/dashboard/top-header";
import { FloatingMenu } from "@/components/dashboard/floating-menu";
import { ChatAssistant } from "@/components/dashboard/chat-assistant";
import { WorkbenchContent } from "@/components/dashboard/workbench-content";
import { DiagnosisContent } from "@/components/dashboard/diagnosis-content";
import { CustomerDetail } from "@/components/dashboard/customer-detail";
import { TaskListContent } from "@/components/dashboard/task-list-content";

type AssistantMode = "default" | "analysis" | "customerProfile" | "actionStrategy";

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<string>("workbench");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>("default");
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("王先生");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setAssistantMode("default");
  };

  const handleConsultantClick = (customerName: string) => {
    setSelectedCustomerName(customerName);
    setAssistantMode("actionStrategy");
  };

  const handleActionClick = (customerName: string, action: "followUp" | "weChat") => {
    setSelectedCustomerName(customerName);
    setSelectedCustomerId("wang-detail");
    setActiveTab("customer-detail");
  };

  const handleViewAllTasks = () => {
    setActiveTab("tasks");
  };

  const handleAssistantModeChange = (mode: AssistantMode) => {
    setAssistantMode(mode);
  };

  return (
    <div className="w-[1194px] h-[834px] mx-auto flex bg-[#F5F7FA] overflow-hidden relative rounded-lg shadow-xl">
      {/* Left Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header - only spans content area */}
        <TopHeader onMenuClick={() => setIsMenuOpen(true)} />

        {/* Floating Menu */}
        <FloatingMenu 
          activeTab={activeTab === "customer-detail" ? "workbench" : activeTab} 
          onTabChange={handleTabChange}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {activeTab === "workbench" && (
            <WorkbenchContent onCustomerClick={handleCustomerClick} onViewAllTasks={handleViewAllTasks} />
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
      </div>

      {/* Right Agent Area - Independent window */}
      <ChatAssistant 
        mode={assistantMode}
        customerName={selectedCustomerName}
        onModeChange={handleAssistantModeChange}
      />
    </div>
  );
}
