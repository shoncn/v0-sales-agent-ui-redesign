"use client";

import { ChevronLeft, MessageCircle } from "lucide-react";

interface CustomerDetailProps {
  onBack: () => void;
}

export function CustomerDetail({ onBack }: CustomerDetailProps) {
  const statusSteps = [
    { label: "新工单", active: false, completed: true },
    { label: "待跟进", active: false, completed: true },
    { label: "持续邀约中", active: false, completed: true },
    { label: "邀约成功", active: false, completed: true },
    { label: "试驾成功", active: true, completed: true },
    { label: "持续关单中", active: false, completed: false },
    { label: "已锁定", active: false, completed: false },
    { label: "已交付", active: false, completed: false },
  ];

  const tabs = ["客户概览", "跟进记录", "试驾记录", "线索记录", "销售订单"];

  const timeline = [
    {
      date: "12月3日",
      content: '在理想汽车app"使用了【金融计算器】（首付比例30%）"',
    },
    {
      date: "11月17日",
      content: '"观看了多个【智能座舱】视频"',
    },
    {
      date: "11月15日",
      content: '"查看了【L9 vs M9对比】文章"、"观看了【自动泊车】视频3次"',
    },
    {
      date: "11月12日",
      content: '"浏览了【AEB紧急制动】相关的视频"',
    },
    {
      date: "10月28日",
      content: "到店静态体验，并完成了试驾",
    },
    {
      date: "10月20日",
      content:
        '"添加心愿单，理想L9Ultra 银色金属漆 全新21英寸黑灰双色轮毂 黑白双色内饰"',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">客户详情</h1>
        </div>
      </div>

      {/* Status Steps */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-1">
          {statusSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  step.active
                    ? "bg-emerald-500 text-white"
                    : step.completed
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-gray-50 text-gray-400 border border-gray-200"
                }`}
              >
                {step.label}
              </div>
              {index < statusSteps.length - 1 && (
                <div
                  className={`w-4 h-px mx-1 ${step.completed ? "bg-emerald-300" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full flex gap-6">
          {/* Left Panel - Customer Info */}
          <div className="w-[320px] flex-shrink-0 space-y-6">
            {/* Customer Basic Info Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-800">
                    王先生
                  </span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-medium rounded-full">
                    高意向
                  </span>
                </div>
                <button
                  type="button"
                  className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md border border-blue-100">
                  理想i6
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-md border border-emerald-100">
                  已加企微
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div>
                  线索来源:{" "}
                  <span className="text-gray-700">理想汽车app 心愿单</span>
                </div>
                <div>
                  客户手机: <span className="text-gray-700">166****1234</span>
                </div>
                <div>
                  上次跟进时间:{" "}
                  <span className="text-gray-700">2025-11-30</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                  理想i6
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                  预算30~50w
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                  二胎家庭
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                  现有车: 宝马X5
                </span>
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                  对比: 问界M7
                </span>
              </div>
            </div>

            {/* Customer Timeline */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 overflow-hidden">
              <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                客户轨迹
              </h3>

              <div className="relative space-y-4 max-h-[340px] overflow-y-auto pr-2">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
                      {index < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-emerald-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-xs font-medium text-gray-800 mb-1">
                        {item.date}
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-100 px-6">
              <div className="flex gap-6">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                      index === 0
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Follow-up Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-amber-400 rounded-full" />
                  跟进总结
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
                  王先生10月20日在理想汽车官网添加了心愿单。在国贸从事金融工作，家里有两个孩子，目前开宝马X3已开6年做老车置换。喜欢理想i6的造型，但是在问界M7和理想i6之间纠结犹豫。10月28日自己进行了试驾。
                </div>
              </div>

              {/* Test Drive Focus Points */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-blue-400 rounded-full" />
                  试驾关注点
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 font-medium">1.</span>
                    <span>M7和这款车在智能驾驶方面的区别</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 font-medium">2.</span>
                    <span>AEB的表现。</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 font-medium">3.</span>
                    <span>实际续航里程。</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  建议动作
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    发送i6的种草视频素材
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    邀请二次试驾
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-amber-50 text-amber-600 text-sm font-medium rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    推送金融方案
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
