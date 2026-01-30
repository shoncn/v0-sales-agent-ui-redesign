"use client";

import { Target, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

const actionPlan = {
  title: "月度目标达成路径",
  actions: [
    {
      label: "立即行动（3天内）",
      text: "清零8个逾期任务，回访试驾后28位客户，每日跟进2-3位报价客户。",
    },
    {
      label: "本周目标",
      text: "邀约10位试驾，从42位试驾客户中锁3单，试驾回访率提升至100%。",
    },
    {
      label: "剩余10天策略",
      text: "每日3通主动电话，周末邀约到店，价格异议统一话术培训。",
    },
    {
      label: "关键措施",
      text: "建立9:00/14:00/18:00任务提醒节点，高优先级任务提前30分钟排警，意向度≥70%客户建VIP快速通道。",
    },
  ],
};

const funnelData = [
  { label: "商机量", value: 156, rate: "104%", target: "目标150", extra: "超标6个", positive: true },
  { label: "邀约量", value: 82, rate: "82%", target: "目标100", extra: "差距18个", positive: false },
  { label: "试驾量", value: 42, rate: "82%", target: "目标100", extra: "差距18个", positive: false },
  { label: "跟进量", value: 12, rate: "82%", target: "目标100", extra: "差距18个", positive: false },
  { label: "锁单量", value: 10, rate: "71%", target: "目标14", extra: "差距4单", positive: false },
];

const conversionRates = [
  { from: "商机", to: "试驾", rate: "26.9%", benchmark: "门店均值31.7%", diff: "差距-4.8%", positive: false },
  { from: "试驾", to: "锁单", rate: "23.8%", benchmark: "门店均值30.0%", diff: "差距-6.2%", positive: false },
];

export function DiagnosisFunnel() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Action Plan Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-gray-800">{actionPlan.title}</h3>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {actionPlan.actions.map((action, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-xs font-semibold text-emerald-600 mb-1">{action.label}</div>
            <p className="text-xs text-gray-600 leading-relaxed">{action.text}</p>
          </div>
        ))}
      </div>

      {/* Funnel Section */}
      <div className="flex gap-6">
        {/* Funnel Chart */}
        <div className="flex-1">
          <div className="space-y-2">
            {funnelData.map((item, index) => {
              const widthPercent = 100 - index * 15;
              return (
                <div key={index} className="flex items-center gap-3">
                  {/* Funnel Bar */}
                  <div 
                    className="h-10 bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center relative transition-all hover:from-emerald-200 hover:to-emerald-100"
                    style={{ width: `${widthPercent}%`, minWidth: '140px' }}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}：{item.value}
                    </span>
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <span className={`text-sm font-semibold ${item.positive ? 'text-emerald-600' : 'text-gray-600'}`}>
                      {item.rate === "104%" ? "商机" : item.label.replace("量", "")}达成率：{item.rate}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.target} | {item.extra}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="w-[200px] space-y-3">
          {conversionRates.map((item, index) => (
            <div key={index} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">
                  {item.from}-{item.to}转化率：{item.rate}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {item.benchmark} | <span className="text-amber-600">{item.diff}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
