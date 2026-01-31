"use client";

export function ExperienceCard() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 h-full">
      {/* Card Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
        <span className="text-sm font-medium text-gray-700">行为数据</span>
      </div>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* 通话数据 - 呼入 */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-blue-600 mb-2">通话数据 - 呼入</div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">平均通时</span>
            <span className="text-sm font-semibold text-gray-800">77秒</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">总通时</span>
            <span className="text-sm font-semibold text-gray-800">1.28分钟</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">通次</span>
            <span className="text-sm font-semibold text-gray-800">2次</span>
          </div>
        </div>

        {/* 通话数据 - 呼出 */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-emerald-600 mb-2">通话数据 - 呼出</div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">平均通时</span>
            <span className="text-sm font-semibold text-gray-800">105秒</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">总通时</span>
            <span className="text-sm font-semibold text-gray-800">5.27分钟</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">通次</span>
            <span className="text-sm font-semibold text-gray-800">3次</span>
          </div>
        </div>

        {/* 试驾质量 */}
        <div className="space-y-2 pt-3 border-t border-gray-50">
          <div className="text-xs font-medium text-orange-500 mb-2">试驾质量</div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">试驾分数</span>
            <span className="text-sm font-semibold text-gray-800">85分</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">试驾反馈率</span>
            <span className="text-sm font-semibold text-gray-800">68.6%</span>
          </div>
        </div>

        {/* 客户满意度 */}
        <div className="space-y-2 pt-3 border-t border-gray-50">
          <div className="text-xs font-medium text-cyan-600 mb-2">客户满意度</div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">净满意度(NPS)</span>
            <span className="text-sm font-semibold text-emerald-600">100%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">门店均值</span>
            <span className="text-sm font-semibold text-gray-800">99.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
