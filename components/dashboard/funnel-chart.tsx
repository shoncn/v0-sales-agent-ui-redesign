"use client";

import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

const funnelData = [
  { label: "获客", value: 390, widthPercent: 100 },
  { label: "邀约", value: 156, widthPercent: 75 },
  { label: "试驾", value: 23, widthPercent: 45, isWarning: true },
  { label: "成交", value: 7, widthPercent: 25 },
];

const conversionRates = [
  { rate: "40%", label: "获客→邀约", isWarning: false, target: "35%", industry: "38%" },
  { rate: "15%", label: "邀约→试驾", isWarning: true, target: "25%", industry: "22%" },
  { rate: "30%", label: "试驾→成交", isWarning: false, target: "28%", industry: "25%" },
];

export function FunnelChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">核心数据漏斗</h3>
        <span className="text-xs text-gray-400">本月累计</span>
      </div>

      <div className="flex gap-4">
        {/* Funnel Visualization */}
        <div className="flex-1 flex flex-col items-center">
          <svg viewBox="0 0 260 220" className="w-full max-w-[240px]">
            <defs>
              <linearGradient id="funnelGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="funnelGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3ECFB2" />
                <stop offset="100%" stopColor="#2BB89E" />
              </linearGradient>
              <linearGradient id="funnelGradientWarning" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="funnelGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
              </filter>
            </defs>
            
            {funnelData.map((item, index) => {
              const yStart = index * 52 + 5;
              const topWidth = 220 - index * 40;
              const bottomWidth = 220 - (index + 1) * 40;
              const centerX = 130;
              
              const topLeft = centerX - topWidth / 2;
              const topRight = centerX + topWidth / 2;
              const bottomLeft = centerX - bottomWidth / 2;
              const bottomRight = centerX + bottomWidth / 2;
              
              const gradients = [
                "url(#funnelGradient1)",
                "url(#funnelGradient2)",
                "url(#funnelGradientWarning)",
                "url(#funnelGradient4)",
              ];
              
              return (
                <g key={index} filter="url(#shadow)">
                  <path
                    d={`M ${topLeft + 8} ${yStart} 
                        L ${topRight - 8} ${yStart} 
                        Q ${topRight} ${yStart} ${topRight} ${yStart + 8}
                        L ${bottomRight} ${yStart + 38}
                        Q ${bottomRight} ${yStart + 46} ${bottomRight - 8} ${yStart + 46}
                        L ${bottomLeft + 8} ${yStart + 46}
                        Q ${bottomLeft} ${yStart + 46} ${bottomLeft} ${yStart + 38}
                        L ${topLeft} ${yStart + 8}
                        Q ${topLeft} ${yStart} ${topLeft + 8} ${yStart}
                        Z`}
                    fill={gradients[index]}
                    className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  />
                  {item.isWarning && (
                    <rect 
                      x={topLeft - 2} 
                      y={yStart - 2} 
                      width={topWidth + 4} 
                      height="50" 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      rx="8"
                      className="animate-pulse"
                    />
                  )}
                  <text
                    x={centerX}
                    y={yStart + 27}
                    textAnchor="middle"
                    className="fill-white font-medium"
                    style={{ fontSize: "12px" }}
                  >
                    {item.label} {item.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Conversion Rates */}
        <div className="flex flex-col justify-around py-2 min-w-[110px] space-y-1">
          {conversionRates.map((item, index) => (
            <div key={index} className={`p-2 rounded-lg ${item.isWarning ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                {item.isWarning ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-sm font-bold text-amber-600">{item.rate}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-700">{item.rate}</span>
                  </>
                )}
              </div>
              <div className="text-[10px] text-gray-400">{item.label}</div>
              {item.isWarning && (
                <div className="flex gap-2 mt-1 text-[9px]">
                  <span className="text-gray-400">目标:{item.target}</span>
                  <span className="text-gray-400">行业:{item.industry}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Warning Label */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-xs text-amber-700">
          <span className="font-semibold">高风险环节：</span>邀约到试驾转化率仅15%，低于目标值25%
        </span>
      </div>
    </div>
  );
}
