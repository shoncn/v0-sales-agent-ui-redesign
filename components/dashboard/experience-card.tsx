"use client";

import { Phone, PhoneIncoming, PhoneOutgoing, Car, Smile, Building2 } from "lucide-react";

export function ExperienceCard() {
  return (
    <div className="space-y-4 h-full">
      {/* Experience Bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">战力值:</span>
          <span className="text-lg font-bold text-gray-800">4201</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            全国排名: <strong className="text-gray-800">156</strong> 个
          </span>
          <span>
            区域排名: <strong className="text-gray-800">12</strong> 个
          </span>
          <span>
            门店排名: <strong className="text-gray-800">2</strong> ↓
          </span>
        </div>
      </div>

      {/* Behavior Data Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1 - 行为数据 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-sm font-semibold text-gray-700">行为数据</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 呼入数据 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 rounded-full w-fit">
                <PhoneIncoming className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">通话数据 - 呼入</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">平均通时</div>
                  <div className="text-sm font-semibold text-gray-800">77秒</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">总通时</div>
                  <div className="text-sm font-semibold text-gray-800">1.28分钟</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-teal-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">通次</div>
                  <div className="text-sm font-semibold text-gray-800">2次</div>
                </div>
              </div>
            </div>
            
            {/* 呼出数据 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-full w-fit">
                <PhoneOutgoing className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">通话数据 - 呼出</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">平均通时</div>
                  <div className="text-sm font-semibold text-gray-800">105秒</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">总通时</div>
                  <div className="text-sm font-semibold text-gray-800">5.27分钟</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">通次</div>
                  <div className="text-sm font-semibold text-gray-800">3次</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - 试驾质量 & 客户满意度 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span className="text-sm font-semibold text-gray-700">试驾质量</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Car className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">试驾分数</div>
                    <div className="text-sm font-semibold text-gray-800">85分</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Car className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">试驾反馈率</div>
                    <div className="text-sm font-semibold text-gray-800">68.6%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm font-semibold text-gray-700">客户满意度</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Smile className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">净满意度(NPS)</div>
                    <div className="text-sm font-semibold text-emerald-600">100%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">门店均值</div>
                    <div className="text-sm font-semibold text-gray-800">99.4%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
