"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ChatAssistant } from "@/components/dashboard/chat-assistant";
import { WorkbenchContent } from "@/components/dashboard/workbench-content";
import { DiagnosisContent } from "@/components/dashboard/diagnosis-content";

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("workbench");

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {activeTab === "workbench" && <WorkbenchContent />}
          {activeTab === "diagnosis" && <DiagnosisContent />}
          {activeTab !== "workbench" && activeTab !== "diagnosis" && (
            <div className="p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🚧</div>
                <p className="text-sm">该功能正在开发中...</p>
              </div>
            </div>
          )}
        </main>

        {/* Chat Assistant */}
        <ChatAssistant />
      </div>
    </div>
  );
}
