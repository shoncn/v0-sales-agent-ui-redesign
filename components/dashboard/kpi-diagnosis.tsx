"use client";

import { BarChart3, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";

const kpiData = [
  {
    icon: "warning",
    name: "任务逾期情况",
    status: "danger",
    statusLabel: "达标",
    currentValue: "0个",
    target: "目标0个 | 全部按时完成",
  },
  {
    icon: "call",
    name: "通话遵时达标",
    status: "success",
    statusLabel: "达标",
    currentValue: "77秒",
    target: "店均65秒 | 符合要求",
  },
  {
    icon: "call",
    name: "通话满次达标",
    status: "success",
    statusLabel: "达标",
    currentValue: "3次",
    target: "店均2.5次 | 符合要求",
  },
  {
    icon: "car",
    name: "试驾质量得分",
    status: "success",
    statusLabel: "达标",
    currentValue: "85分",
    target: "店均78分 | 达标",
  },
  {
    icon: "rate",
    name: "试驾合格率",
    status: "warning",
    statusLabel: "待改进",
    currentValue: "68%",
    target: "门店均值75% | 差距-7%",
  },
  {
    icon: "smile",
    name: "试驾NPS满意度",
    status: "success",
    statusLabel: "达标",
    currentValue: "100%",
    target: "店均99.4% | 达标",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case "danger":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <CheckCircle2 className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "success":
      return "bg-emerald-100 text-emerald-700";
    case "warning":
      return "bg-amber-100 text-amber-700";
    case "danger":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getIconBg = (icon: string) => {
  switch (icon) {
    case "warning":
      return "bg-amber-100 text-amber-600";
    case "call":
      return "bg-blue-100 text-blue-600";
    case "car":
      return "bg-emerald-100 text-emerald-600";
    case "rate":
      return "bg-purple-100 text-purple-600";
    case "smile":
      return "bg-orange-100 text-orange-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export function KpiDiagnosis() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-gray-800">关键指标诊断</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>6项指标 | 5项达标</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 mb-2">
        <div className="col-span-3">指标名称</div>
        <div className="col-span-2">状态</div>
        <div className="col-span-2">当前值</div>
        <div className="col-span-5">目标对比</div>
      </div>

      {/* Table Body */}
      <div className="space-y-1">
        {kpiData.map((kpi, index) => (
          <div 
            key={index} 
            className="grid grid-cols-12 gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors items-center border-b border-gray-50 last:border-0"
          >
            <div className="col-span-3 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getIconBg(kpi.icon)}`}>
                {getStatusIcon(kpi.status)}
              </div>
              <span className="text-sm text-gray-700">{kpi.name}</span>
            </div>
            <div className="col-span-2">
              <span className={`px-2 py-1 text-xs rounded-md ${getStatusStyle(kpi.status)}`}>
                {kpi.statusLabel}
              </span>
            </div>
            <div className="col-span-2 text-sm font-semibold text-gray-800">{kpi.currentValue}</div>
            <div className="col-span-5 text-xs text-gray-500">
              {kpi.status === "warning" ? (
                <span className="text-amber-600">{kpi.target}</span>
              ) : (
                <span className="text-emerald-600">{kpi.target}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
