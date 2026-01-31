"use client";

import { Target, TrendingUp, TrendingDown, AlertTriangle, Zap, Calendar, Clock, Bell } from "lucide-react";

const actionPlan = {
  title: "月度目标达成路径",
  actions: [
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
      text: "建立9:00/14:00/18:00任务提醒节点，高优先级任务提前30分钟排警，意向度≥70%客户建VIP快速通道。",
      color: "purple",
    },
  ],
};

const funnelData = [
  { label: "商机", value: 156, rate: "104%", target: "目标150", extra: "超标6个", positive: true },
  { label: "邀约", value: 82, rate: "82%", target: "目标100", extra: "差距18个", positive: false },
  { label: "试驾", value: 42, rate: "82%", target: "目标100", extra: "差距18个", positive: false },
  { label: "跟进", value: 12, rate: "82%", target: "目标100", extra: "差距18个", positive: false },
  { label: "锁单", value: 10, rate: "71%", target: "目标14", extra: "差距4单", positive: false },
];

const conversionRates = [
  { from: "商机", to: "试驾", rate: "26.9%", benchmark: "门店均值31.7%", diff: "差距-4.8%", positive: false },
  { from: "试驾", to: "锁单", rate: "23.8%", benchmark: "门店均值30.0%", diff: "差距-6.2%", positive: false },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: "text-emerald-500 bg-emerald-100",
    label: "text-emerald-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    icon: "text-blue-500 bg-blue-100",
    label: "text-blue-700",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: "text-amber-500 bg-amber-100",
    label: "text-amber-700",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-100",
    icon: "text-purple-500 bg-purple-100",
    label: "text-purple-700",
  },
};

export function DiagnosisFunnel() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-gray-800">{actionPlan.title}</h3>
      </div>

      {/* Main Layout: Left (Funnel + Data) | Right (Actions) */}
      <div className="flex gap-6">
        {/* Left Section: Funnel Chart and Data */}
        <div className="flex-1 flex gap-4">
          {/* SVG Funnel Chart */}
          <div className="flex flex-col items-center shrink-0">
            <svg viewBox="0 0 240 290" className="w-[200px]">
              <defs>
                <linearGradient id="dfGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <linearGradient id="dfGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3ECFB2" />
                  <stop offset="100%" stopColor="#2BB89E" />
                </linearGradient>
                <linearGradient id="dfGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2DD4BF" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="dfGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#0D9488" />
                </linearGradient>
                <linearGradient id="dfGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0D9488" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <filter id="dfShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1"/>
                </filter>
              </defs>
              
              {funnelData.map((item, index) => {
                const yStart = index * 55 + 5;
                const topWidth = 200 - index * 32;
                const bottomWidth = 200 - (index + 1) * 32;
                const centerX = 120;
                
                const topLeft = centerX - topWidth / 2;
                const topRight = centerX + topWidth / 2;
                const bottomLeft = centerX - bottomWidth / 2;
                const bottomRight = centerX + bottomWidth / 2;
                
                const gradients = [
                  "url(#dfGrad1)",
                  "url(#dfGrad2)",
                  "url(#dfGrad3)",
                  "url(#dfGrad4)",
                  "url(#dfGrad5)",
                ];
                
                return (
                  <g key={index} filter="url(#dfShadow)">
                    <path
                      d={`M ${topLeft + 6} ${yStart} 
                          L ${topRight - 6} ${yStart} 
                          Q ${topRight} ${yStart} ${topRight} ${yStart + 6}
                          L ${bottomRight} ${yStart + 42}
                          Q ${bottomRight} ${yStart + 48} ${bottomRight - 6} ${yStart + 48}
                          L ${bottomLeft + 6} ${yStart + 48}
                          Q ${bottomLeft} ${yStart + 48} ${bottomLeft} ${yStart + 42}
                          L ${topLeft} ${yStart + 6}
                          Q ${topLeft} ${yStart} ${topLeft + 6} ${yStart}
                          Z`}
                      fill={gradients[index]}
                      className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                    />
                    <text
                      x={centerX}
                      y={yStart + 30}
                      textAnchor="middle"
                      className="fill-white font-medium"
                      style={{ fontSize: "11px" }}
                    >
                      {item.label}量：{item.value}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Funnel Stats and Conversion Rates */}
          <div className="flex flex-col justify-between py-1">
            {/* Stats */}
            <div className="space-y-2">
              {funnelData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.positive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  )}
                  <div>
                    <span className={`text-xs font-semibold ${item.positive ? 'text-emerald-600' : 'text-gray-600'}`}>
                      {item.label}达成率：{item.rate}
                    </span>
                    <div className="text-[10px] text-gray-400">
                      {item.target} | {item.extra}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Conversion Rate Warnings */}
            <div className="space-y-2 mt-3">
              {conversionRates.map((item, index) => (
                <div key={index} className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span className="text-[11px] font-semibold text-amber-700">
                      {item.from}-{item.to}转化率：{item.rate}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {item.benchmark} | <span className="text-amber-600">{item.diff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-100" />

        {/* Right Section: Action Items */}
        <div className="w-[320px] space-y-3">
          {actionPlan.actions.map((action, index) => {
            const Icon = action.icon;
            const colors = colorClasses[action.color as keyof typeof colorClasses];
            return (
              <div 
                key={index} 
                className={`p-3 ${colors.bg} rounded-xl border ${colors.border} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-6 h-6 rounded-lg ${colors.icon} flex items-center justify-center shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${colors.label} mb-1`}>{action.label}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{action.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
