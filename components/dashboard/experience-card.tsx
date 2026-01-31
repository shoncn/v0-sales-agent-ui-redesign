"use client";

export function ExperienceCard() {
  return (
    <div className="space-y-3 h-full">
      {/* Card 1: 通话数据 - 横向长条卡片 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm font-medium text-gray-700">昨日通话数据</span>
        </div>
        
        <div className="flex">
          {/* 呼入 */}
          <div className="flex-1 space-y-2">
            <div className="text-xs font-medium text-blue-600 mb-2">呼入</div>
            <div className="flex justify-between pr-4">
              <span className="text-xs text-gray-400">平均通时</span>
              <span className="text-sm font-semibold text-gray-800">77秒</span>
            </div>
            <div className="flex justify-between pr-4">
              <span className="text-xs text-gray-400">总通时</span>
              <span className="text-sm font-semibold text-gray-800">1.28分钟</span>
            </div>
            <div className="flex justify-between pr-4">
              <span className="text-xs text-gray-400">通次</span>
              <span className="text-sm font-semibold text-gray-800">2次</span>
            </div>
          </div>
          
          {/* 分割线 */}
          <div className="w-px bg-gray-200 mx-4" />
          
          {/* 呼出 */}
          <div className="flex-1 space-y-2">
            <div className="text-xs font-medium text-emerald-600 mb-2">呼出</div>
            <div className="flex justify-between pl-4">
              <span className="text-xs text-gray-400">平均通时</span>
              <span className="text-sm font-semibold text-gray-800">105秒</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-xs text-gray-400">总通时</span>
              <span className="text-sm font-semibold text-gray-800">5.27分钟</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-xs text-gray-400">通次</span>
              <span className="text-sm font-semibold text-gray-800">3次</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: 试驾质量 & 客户满意度 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-sm font-medium text-gray-700">昨日试驾数据</span>
        </div>
        <div className="flex">
          {/* 试驾质量 */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-xs font-medium text-gray-700">试驾质量</span>
            </div>
            <div className="flex justify-between pr-4">
              <span className="text-xs text-gray-400">试驾分数</span>
              <span className="text-sm font-semibold text-gray-800">85分</span>
            </div>
            <div className="flex justify-between pr-4">
              <span className="text-xs text-gray-400">试驾反馈率</span>
              <span className="text-sm font-semibold text-gray-800">68.6%</span>
            </div>
          </div>
          
          {/* 分割线 */}
          <div className="w-px bg-gray-200 mx-4" />
          
          {/* 客户满意度 */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full" />
              <span className="text-xs font-medium text-gray-700">客户满意度</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-xs text-gray-400">净满意度(NPS)</span>
              <span className="text-sm font-semibold text-emerald-600">100%</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-xs text-gray-400">门店均值</span>
              <span className="text-sm font-semibold text-gray-800">99.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
