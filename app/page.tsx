import { Sidebar } from "@/components/dashboard/sidebar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ExperienceCard } from "@/components/dashboard/experience-card";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { CustomerTasks } from "@/components/dashboard/customer-tasks";
import { TodoList } from "@/components/dashboard/todo-list";
import { ChatAssistant } from "@/components/dashboard/chat-assistant";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - 收窄以给Agent更多空间 */}
        <main className="flex-1 overflow-y-auto min-w-0">
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
                <FunnelChart />
              </div>
            </div>

            {/* Customer Tasks and Todo List */}
            <div className="grid grid-cols-2 gap-4">
              <CustomerTasks />
              <TodoList />
            </div>
          </div>
        </main>

        {/* Chat Assistant - 加宽的Agent面板 */}
        <ChatAssistant />
      </div>
    </div>
  );
}
