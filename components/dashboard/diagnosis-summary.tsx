"use client";

import { Zap, Calendar, Clock, Bell } from "lucide-react";

const summaryItems = [
  {
    id: 1,
    text: '锁单量10单距目标14单差4单（缺口29%），需从试驾后42位客户中锁3单，报价中6位高意向客户锁1单。',
    highlight: false,
  },
  {
    id: 2,
    text: '试驾-锁单转化率23.8%距城市基线30%差6.2%，试驾后24h内必回访（当前62%），报价借鉴3套话术。',
    highlight: false,
  },
  {
    id: 3,
    text: '邀约量82距目标100差18个，重点邀约试驾后7天内28位未试驾客户，话术突出"限时名额"和"专属礼品"。',
    highlight: true,
  },
];

const actionPlan = [
  {
    icon: Zap,
    label: "立即行动（3天内）",
    text: "清零8个逾期任务，回访试驾后28位客户，每日跟进2-3位报价客户。",
    color: "emerald",
  },
  {
    icon: Calendar,
    label: "本周目标",
    text: "邀约10位试驾，从42位试驾客户中锁3单，试驾回访率提升至100%。",
    color: "blue",
  },
  {
    icon: Clock,
    label: "剩余10天策略",
    text: "每日3通主动电话，周末邀约到店，价格异议统一话术培训。",
    color: "amber",
  },
  {
    icon: Bell,
    label: "关键措施",
    text: "建立9:00/14:00/18:00任务提醒节点，高优任务提前30分钟预警。",
    color: "purple",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
    border: "border-emerald-200/60",
    icon: "text-emerald-600 bg-emerald-100",
    label: "text-emerald-700",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    border: "border-blue-200/60",
    icon: "text-blue-600 bg-blue-100",
    label: "text-blue-700",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100/50",
    border: "border-amber-200/60",
    icon: "text-amber-600 bg-amber-100",
    label: "text-amber-700",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100/50",
    border: "border-purple-200/60",
    icon: "text-purple-600 bg-purple-100",
    label: "text-purple-700",
  },
};

export function DiagnosisSummary() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Top Section: Summary Items */}
      <div className="space-y-2.5 mb-5">
        {summaryItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
              item.highlight 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60' 
                : 'bg-gray-50/80 border border-gray-100'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              item.highlight 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm' 
                : 'bg-gray-300 text-white'
            }`}>
              {item.id}
            </div>
            <p className={`text-sm leading-relaxed ${
              item.highlight ? 'text-emerald-800' : 'text-gray-600'
            }`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5" />

      {/* Bottom Section: 4 Action Items */}
      <div className="grid grid-cols-4 gap-3">
        {actionPlan.map((action, index) => {
          const Icon = action.icon;
          const colors = colorClasses[action.color as keyof typeof colorClasses];
          return (
            <div 
              key={index} 
              className={`p-3.5 ${colors.bg} rounded-xl border ${colors.border} transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${colors.icon} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`text-xs font-semibold ${colors.label}`}>{action.label}</div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{action.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
