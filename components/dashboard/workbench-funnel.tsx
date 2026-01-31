"use client";

import { TrendingUp, AlertTriangle } from "lucide-react";

const funnelData = [
  { label: "获客", value: 390, color: "#34D399" },
  { label: "邀约", value: 156, color: "#3ECFB2" },
  { label: "试驾", value: 23, color: "#F59E0B", isWarning: true },
  { label: "跟进", value: 15, color: "#14B8A6" },
  { label: "成交", value: 7, color: "#0D9488" },
];

const conversionRates = [
  { rate: "40%", label: "获客-邀约", isWarning: false },
  { rate: "15%", label: "邀约-试驾", isWarning: true },
  { rate: "65%", label: "试驾-跟进", isWarning: false },
  { rate: "47%", label: "跟进-成交", isWarning: false },
];

export function WorkbenchFunnel() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">核心数据漏斗</h3>
        <span className="text-xs text-gray-400">本月累计</span>
      </div>

      <div className="flex gap-3">
        {/* Funnel Visualization */}
        <div className="flex-1 flex flex-col items-center">
          <svg viewBox="0 0 260 270" className="w-full max-w-[220px]">
            <defs>
              <linearGradient id="wfGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="wfGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3ECFB2" />
                <stop offset="100%" stopColor="#2BB89E" />
              </linearGradient>
              <linearGradient id="wfGradWarning" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="wfGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
              <linearGradient id="wfGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>
              <filter id="wfShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1"/>
              </filter>
            </defs>
            
            {funnelData.map((item, index) => {
              const yStart = index * 50 + 5;
              const topWidth = 210 - index * 32;
              const bottomWidth = 210 - (index + 1) * 32;
              const centerX = 130;
              
              const topLeft = centerX - topWidth / 2;
              const topRight = centerX + topWidth / 2;
              const bottomLeft = centerX - bottomWidth / 2;
              const bottomRight = centerX + bottomWidth / 2;
              
              const gradients = [
                "url(#wfGrad1)",
                "url(#wfGrad2)",
                "url(#wfGradWarning)",
                "url(#wfGrad4)",
                "url(#wfGrad5)",
              ];
              
              return (
                <g key={index} filter="url(#wfShadow)">
                  <path
                    d={`M ${topLeft + 6} ${yStart} 
                        L ${topRight - 6} ${yStart} 
                        Q ${topRight} ${yStart} ${topRight} ${yStart + 6}
                        L ${bottomRight} ${yStart + 38}
                        Q ${bottomRight} ${yStart + 44} ${bottomRight - 6} ${yStart + 44}
                        L ${bottomLeft + 6} ${yStart + 44}
                        Q ${bottomLeft} ${yStart + 44} ${bottomLeft} ${yStart + 38}
                        L ${topLeft} ${yStart + 6}
                        Q ${topLeft} ${yStart} ${topLeft + 6} ${yStart}
                        Z`}
                    fill={gradients[index]}
                    className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  />
                  {item.isWarning && (
                    <rect 
                      x={topLeft - 2} 
                      y={yStart - 2} 
                      width={topWidth + 4} 
                      height="48" 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      rx="6"
                      className="animate-pulse"
                    />
                  )}
                  <text
                    x={centerX}
                    y={yStart + 26}
                    textAnchor="middle"
                    className="fill-white font-medium"
                    style={{ fontSize: "11px" }}
                  >
                    {item.label} {item.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Conversion Rates */}
        <div className="flex flex-col justify-around py-2 min-w-[95px] space-y-0.5">
          {conversionRates.map((item, index) => (
            <div key={index} className={`p-1.5 rounded-lg ${item.isWarning ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-1">
                {item.isWarning ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600">{item.rate}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-semibold text-gray-700">{item.rate}</span>
                  </>
                )}
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Warning Label */}
      <div className="mt-3 p-2.5 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[10px] text-amber-700">
          <span className="font-semibold">预警：</span>邀约到试驾转化率15%，低于目标25%
        </span>
      </div>
    </div>
  );
}
