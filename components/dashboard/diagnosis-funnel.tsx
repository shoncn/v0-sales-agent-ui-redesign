"use client";

import { Target, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

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

export function DiagnosisFunnel() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-gray-800">月度目标达成路径</h3>
      </div>

      {/* Main Content: Full Width Adaptive Layout */}
      <div className="flex items-stretch gap-8">
        {/* Left: Funnel SVG */}
        <div className="flex-1 flex justify-center items-center min-w-0">
          <svg viewBox="0 0 320 300" className="w-full max-w-[400px] h-auto">
            <defs>
              {/* More vibrant gradient colors */}
              <linearGradient id="dfGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
              <linearGradient id="dfGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="dfGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="dfGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="dfGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
              <filter id="dfShadow2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#10B981" floodOpacity="0.2"/>
              </filter>
            </defs>
            
            {funnelData.map((item, index) => {
              const yStart = index * 56 + 8;
              const layerHeight = 50;
              const topWidth = 280 - index * 45;
              const bottomWidth = 280 - (index + 1) * 45;
              const centerX = 160;
              
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
                <g key={index} filter="url(#dfShadow2)">
                  <path
                    d={`M ${topLeft + 8} ${yStart} 
                        L ${topRight - 8} ${yStart} 
                        Q ${topRight} ${yStart} ${topRight} ${yStart + 8}
                        L ${bottomRight} ${yStart + layerHeight - 8}
                        Q ${bottomRight} ${yStart + layerHeight} ${bottomRight - 8} ${yStart + layerHeight}
                        L ${bottomLeft + 8} ${yStart + layerHeight}
                        Q ${bottomLeft} ${yStart + layerHeight} ${bottomLeft} ${yStart + layerHeight - 8}
                        L ${topLeft} ${yStart + 8}
                        Q ${topLeft} ${yStart} ${topLeft + 8} ${yStart}
                        Z`}
                    fill={gradients[index]}
                    className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  />
                  <text
                    x={centerX}
                    y={yStart + layerHeight / 2 + 5}
                    textAnchor="middle"
                    className="fill-white font-semibold pointer-events-none"
                    style={{ fontSize: "13px", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                  >
                    {item.label}量：{item.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

        {/* Right: Stats and Conversion Rates */}
        <div className="flex-1 flex flex-col justify-between py-2 min-w-0">
          {/* Funnel Stats */}
          <div className="space-y-3">
            {funnelData.map((item, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  item.positive 
                    ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200' 
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                }`}>
                  {item.positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-semibold ${item.positive ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {item.label}达成率：
                    </span>
                    <span className={`text-base font-bold ${item.positive ? 'text-emerald-600' : 'text-gray-800'}`}>
                      {item.rate}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.target} | <span className={item.positive ? 'text-emerald-500' : 'text-amber-500'}>{item.extra}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversion Rate Warnings */}
          <div className="space-y-2.5 mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">转化率预警</div>
            {conversionRates.map((item, index) => (
              <div 
                key={index} 
                className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl transition-all hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-sm font-semibold text-amber-700">
                    {item.from}-{item.to}转化率：{item.rate}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6">
                  {item.benchmark} | <span className="text-amber-600 font-medium">{item.diff}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
