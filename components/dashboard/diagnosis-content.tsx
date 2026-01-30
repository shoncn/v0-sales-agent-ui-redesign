"use client";

import { DiagnosisSummary } from "@/components/dashboard/diagnosis-summary";
import { DiagnosisFunnel } from "@/components/dashboard/diagnosis-funnel";
import { KeyCustomerAnalysis } from "@/components/dashboard/key-customer-analysis";
import { KpiDiagnosis } from "@/components/dashboard/kpi-diagnosis";

export function DiagnosisContent() {
  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
          <h1 className="text-lg font-bold text-gray-800">诊断总结</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>综合评价:</span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded font-medium">良好</span>
        </div>
      </div>

      {/* Diagnosis Summary */}
      <DiagnosisSummary />

      {/* Monthly Target Path & Funnel */}
      <DiagnosisFunnel />

      {/* Key Customer Analysis */}
      <KeyCustomerAnalysis />

      {/* KPI Diagnosis */}
      <KpiDiagnosis />
    </div>
  );
}
