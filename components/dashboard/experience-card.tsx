"use client";

export function ExperienceCard() {
  return (
    <div className="grid grid-cols-3 gap-3 h-full">
      {/* 通话数据 - 呼入 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          <span className="text-xs font-medium text-gray-600">通话数据 - 呼入</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">平均通时</span>
            <span className="text-sm font-semibold text-gray-800">77秒</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">总通时</span>
            <span className="text-sm font-semibold text-gray-800">1.28分钟</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">通次</span>
            <span className="text-sm font-semibold text-gray-800">2次</span>
          </div>
        </div>
      </div>

      {/* 通话数据 - 呼出 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span className="text-xs font-medium text-gray-600">通话数据 - 呼出</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">平均通时</span>
            <span className="text-sm font-semibold text-gray-800">105秒</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">总通时</span>
            <span className="text-sm font-semibold text-gray-800">5.27分钟</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">通次</span>
            <span className="text-sm font-semibold text-gray-800">3次</span>
          </div>
        </div>
      </div>

      {/* 试驾质量 & 客户满意度 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="space-y-4">
          {/* 试驾质量 */}
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
              <span className="text-xs font-medium text-gray-600">试驾质量</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">试驾分数</span>
                <span className="text-sm font-semibold text-gray-800">85分</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">试驾反馈率</span>
                <span className="text-sm font-semibold text-gray-800">68.6%</span>
              </div>
            </div>
          </div>
          
          {/* 客户满意度 */}
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
              <span className="text-xs font-medium text-gray-600">客户满意度</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">净满意度(NPS)</span>
                <span className="text-sm font-semibold text-emerald-600">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">门店均值</span>
                <span className="text-sm font-semibold text-gray-800">99.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
