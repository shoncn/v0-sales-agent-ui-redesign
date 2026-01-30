"use client";

import { Star, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const customers = [
  {
    name: "刘先生",
    model: "L8 Max",
    status: "trial_pending",
    statusLabel: "试驾后3天未跟进",
    intent: "high",
    description: "家庭用户，关注安全配置，预算充足",
    actions: ["推荐融资试驾翌驾", "预约二访"],
  },
  {
    name: "陈先生",
    model: "L8 Pro",
    status: "trial_pending",
    statusLabel: "试驾后7天未联系",
    intent: "medium",
    description: "对比竞品中，对价格较敏感",
    actions: ["了解竞品对比", "提供优惠"],
  },
  {
    name: "张女士",
    model: "L9 Max",
    status: "negotiating",
    statusLabel: "二次到店洽谈中",
    intent: "high",
    description: "三胎家庭，空间需求明显，已确定选配",
    actions: ["跟配方案介绍", "预约二访"],
  },
  {
    name: "周先生",
    model: "L8 Max",
    status: "overdue",
    statusLabel: "试驾后6天",
    intent: "high",
    description: "科技爱好者，对智能驾驶功能接受度高",
    actions: ["智能驾驶演示", "预约沟通"],
  },
  {
    name: "赵女士",
    model: "L7 Pro",
    status: "quote_pending",
    statusLabel: "报价中等待决策",
    intent: "high",
    description: "首购用户，关注售后服务质量",
    actions: ["跟进服务", "贷款方案"],
  },
  {
    name: "韩女士",
    model: "L9 Pro",
    status: "compare",
    statusLabel: "对比竞品M9",
    intent: "medium",
    description: "高端用户，同时对比问界M9",
    actions: ["综合维修优势", "竞品对比"],
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "trial_pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "negotiating":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "overdue":
      return "bg-red-100 text-red-700 border-red-200";
    case "quote_pending":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "compare":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getIntentStyle = (intent: string) => {
  switch (intent) {
    case "high":
      return "text-emerald-600";
    case "medium":
      return "text-amber-600";
    default:
      return "text-gray-500";
  }
};

export function KeyCustomerAnalysis() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-gray-800">重点客户分析</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700">
          共6位
        </Button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 mb-2">
        <div className="col-span-1">客户名</div>
        <div className="col-span-1">意向车系</div>
        <div className="col-span-2">当前状态</div>
        <div className="col-span-1">意向等级</div>
        <div className="col-span-4">客户描述</div>
        <div className="col-span-3">建议动作</div>
      </div>

      {/* Table Body */}
      <div className="space-y-1">
        {customers.map((customer, index) => (
          <div 
            key={index} 
            className="grid grid-cols-12 gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors items-center border-b border-gray-50 last:border-0"
          >
            <div className="col-span-1 text-sm font-medium text-gray-800">{customer.name}</div>
            <div className="col-span-1">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{customer.model}</span>
            </div>
            <div className="col-span-2">
              <span className={`px-2 py-1 text-xs rounded-md border ${getStatusStyle(customer.status)}`}>
                {customer.statusLabel}
              </span>
            </div>
            <div className="col-span-1">
              <span className={`text-sm font-medium ${getIntentStyle(customer.intent)}`}>
                {customer.intent === "high" ? "高" : customer.intent === "medium" ? "中" : "低"}
              </span>
            </div>
            <div className="col-span-4 text-xs text-gray-500 leading-relaxed">{customer.description}</div>
            <div className="col-span-3 flex flex-wrap gap-1.5">
              {customer.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  {actionIndex === 0 ? (
                    <MessageSquare className="w-3 h-3 mr-1" />
                  ) : (
                    <Calendar className="w-3 h-3 mr-1" />
                  )}
                  {action}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
