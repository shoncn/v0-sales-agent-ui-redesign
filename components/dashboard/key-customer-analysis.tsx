"use client";

import { Star, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const customers = [
  {
    name: "王先生",
    model: "L9",
    status: "overdue",
    statusLabel: "试驾后3天未跟进",
    intent: "high",
    description: "宝马X5置换，纠结问界M9",
    action: "跟进用户",
  },
  {
    name: "陈先生",
    model: "L8 Pro",
    status: "overdue",
    statusLabel: "试驾后7天未联系",
    intent: "medium",
    description: "对比竞品中，对价格较敏感",
    action: "了解竞品对比",
  },
  {
    name: "张女士",
    model: "L9 Max",
    status: "normal",
    statusLabel: "二次到店洽谈中",
    intent: "high",
    description: "三胎家庭，空间需求明显",
    action: "配置方案介绍",
  },
  {
    name: "周先生",
    model: "L8 Max",
    status: "warning",
    statusLabel: "试驾后6天",
    intent: "high",
    description: "科技爱好者，智驾接受度高",
    action: "智能驾驶演示",
  },
  {
    name: "赵女士",
    model: "L7 Pro",
    status: "normal",
    statusLabel: "报价中等待决策",
    intent: "high",
    description: "首购用户，关注售后服务",
    action: "跟进服务",
  },
  {
    name: "韩女士",
    model: "L9 Pro",
    status: "warning",
    statusLabel: "对比竞品M9",
    intent: "medium",
    description: "高端用户，同时对比问界M9",
    action: "竞品对比分析",
  },
];

// 标签颜色规范: 达标-绿色, 未达标-红色, 待改进-黄色, 其他-中性灰
const getStatusStyle = (status: string) => {
  switch (status) {
    case "normal": // 达标
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "overdue": // 未达标
      return "bg-red-50 text-red-600 border-red-200";
    case "warning": // 待改进
      return "bg-amber-50 text-amber-600 border-amber-200";
    default: // 其他
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const getIntentStyle = (intent: string) => {
  switch (intent) {
    case "high":
      return "text-emerald-600";
    case "medium":
      return "text-amber-600";
    default:
      return "text-slate-500";
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
        <Button variant="ghost" size="sm" className="text-xs text-emerald-600 active:text-emerald-700 bg-transparent">
          共6位
        </Button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[60px_70px_120px_60px_1fr_100px] gap-3 px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 mb-2">
        <div>客户名</div>
        <div>意向车系</div>
        <div>当前状态</div>
        <div>意向</div>
        <div>客户描述</div>
        <div>建议动作</div>
      </div>

      {/* Table Body */}
      <div className="space-y-0">
        {customers.map((customer, index) => (
          <div 
            key={index} 
            className="grid grid-cols-[60px_70px_120px_60px_1fr_100px] gap-3 px-3 py-2.5 rounded-lg active:bg-gray-50 transition-colors items-center border-b border-gray-50 last:border-0"
          >
            <div className="text-sm font-medium text-gray-800">{customer.name}</div>
            <div>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">{customer.model}</span>
            </div>
            <div>
              <span className={`px-2 py-0.5 text-xs rounded border whitespace-nowrap ${getStatusStyle(customer.status)}`}>
                {customer.statusLabel}
              </span>
            </div>
            <div>
              <span className={`text-sm font-medium ${getIntentStyle(customer.intent)}`}>
                {customer.intent === "high" ? "高" : customer.intent === "medium" ? "中" : "低"}
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate">{customer.description}</div>
            <div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2 py-0 border-emerald-200 text-emerald-600 active:bg-emerald-50 bg-transparent whitespace-nowrap"
              >
                <UserRound className="w-3 h-3 mr-1" />
                {customer.action}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
