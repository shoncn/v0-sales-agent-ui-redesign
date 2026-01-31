"use client";

import React from "react"

import { Send, Loader2, Database, Phone, Users, FileText, Download, AlertCircle, BarChart3, User, Target, Sparkles, Plus, Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type AssistantMode = "default" | "analysis" | "customerProfile" | "actionStrategy" | "businessDiagnosis";

interface AnalysisStep {
  id: string;
  type: 'thinking' | 'data_loading' | 'analysis' | 'table' | 'chart' | 'conclusion' | 'report';
  title?: string;
  content?: string;
  data?: unknown;
  isComplete: boolean;
}

interface ChatAssistantProps {
  mode?: AssistantMode;
  customerName?: string;
  onModeChange?: (mode: AssistantMode) => void;
}

const salesData = [
  { name: "张三", calls: "3 通", duration: "2.1 分钟", gap: "通次 -3 通", status: "通次不达标" },
  { name: "李四", calls: "4 通", duration: "2.5 分钟", gap: "通次 -2 通", status: "通次不达标" },
  { name: "王五", calls: "5.8 通", duration: "0.9 分钟", gap: "通时 -0.9 分钟", status: "通时不达标" },
  { name: "赵六", calls: "6.2 通", duration: "1.2 分钟", gap: "通时 -0.6 分钟", status: "通时不达标" },
  { name: "孙七", calls: "3.5 通", duration: "1.1 分钟", gap: "通次 -2.5 / 通时 -0.7", status: "双项不达标" },
  { name: "周八", calls: "7 通", duration: "2.8 分钟", gap: "无", status: "达标" },
  { name: "吴九", calls: "8.5 通", duration: "3.0 分钟", gap: "通次 +2.5 通", status: "优秀" },
  { name: "郑十", calls: "6.5 通", duration: "2.2 分钟", gap: "无", status: "达标" },
];

const analysisSteps: AnalysisStep[] = [
  { id: '1', type: 'thinking', content: '正在分析您的问题...', isComplete: false },
  { id: '2', type: 'data_loading', title: '正在调用数据模块', content: '商机状态数据 · 存量商机数据 · 通话数据', isComplete: false },
  { id: '3', type: 'analysis', title: '维度一：商机状态更新核查', content: `基于昨日商机数据，验证"已邀约未试驾"商机的状态同步及时性。\n\n**异常发现：商机状态更新异常**\n\n- 昨日录入 80 个有效邀约商机，按 30% 历史转化规律，今日应产生 **24 个**试驾转化，实际仅 **12 个**，缺口 **50%**`, isComplete: false },
  { id: '4', type: 'analysis', title: '维度二：存量商机储备分析', content: `测算达成试驾目标所需的存量商机基数。\n\n**结论：存量商机储备不足**\n\n- **目标测算**：本月需完成 100 个试驾量（转化率 25%）\n- **现状缺口**：当前系统「待邀约」存量仅 **280 个**，缺口 **120 个**`, isComplete: false },
  { id: '5', type: 'analysis', title: '维度三：邀约通话质量分析', content: `提取近7天团队整体邀约通话数据分析。\n\n**发现：邀约通话质量不达标**\n\n- 通次：人均每日 **6 通** vs 门店均值 8 通\n- 通时：单次 **1.8 分钟** vs 门店均值 3.2 分钟`, isComplete: false },
  { id: '6', type: 'table', title: '销售顾问通话数据明细', data: salesData, isComplete: false },
  { id: '7', type: 'report', title: '分析报告已生成', content: `**核心问题汇总：**\n1. 通话质量不达标（权重45%）\n2. 存量商机储备不足（权重30%）\n3. 商机状态更新异常（权重25%）`, isComplete: false },
];

export function ChatAssistant({ mode = "default", customerName = "王先生", onModeChange }: ChatAssistantProps) {
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const [currentSteps, setCurrentSteps] = useState<AnalysisStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [currentMode, setCurrentMode] = useState<AssistantMode>(mode);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentMode(mode);
    if (mode === "customerProfile" || mode === "actionStrategy") {
      setShowInitial(false);
    }
  }, [mode]);

  const startAnalysis = (userMessage?: string) => {
    const analysisMessage = userMessage || message || "请帮我分析下当前邀约到试驾转化率低的原因";
    setMessage(analysisMessage);
    setShowInitial(false);
    setCurrentMode("analysis");
    setIsAnalyzing(true);
    setCurrentSteps([]);
    setCurrentStepIndex(0);
  };

  const enterBusinessDiagnosis = () => {
    setShowInitial(false);
    setCurrentMode("businessDiagnosis");
    setMessage("");
  };

  const resetToDefault = () => {
    setCurrentMode("default");
    setShowInitial(true);
    setCurrentSteps([]);
    setCurrentStepIndex(-1);
    setIsAnalyzing(false);
    setMessage("");
    onModeChange?.("default");
  };

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < analysisSteps.length) {
      const timer = setTimeout(() => {
        setCurrentSteps(prev => [...prev, { ...analysisSteps[currentStepIndex], isComplete: true }]);
        setCurrentStepIndex(prev => prev + 1);
      }, currentStepIndex === 0 ? 800 : 1200);
      return () => clearTimeout(timer);
    } else if (currentStepIndex >= analysisSteps.length) {
      setIsAnalyzing(false);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSteps, currentMode]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "优秀": return "bg-emerald-100 text-emerald-700";
      case "达标": return "bg-blue-100 text-blue-700";
      case "通次不达标": return "bg-amber-100 text-amber-700";
      case "通时不达标": return "bg-orange-100 text-orange-700";
      case "双项不达标": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-gray-800 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*([^*]+)\*\*/g);
        return (
          <p key={i} className="text-gray-600 leading-relaxed">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-800">{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-gray-600 ml-4 leading-relaxed">{line.substring(2)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-600 leading-relaxed">{line}</p>;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAnalyzing && message.trim()) {
      e.preventDefault();
      startAnalysis(message);
    }
  };

  // Customer Profile Content
  const renderCustomerProfile = () => (
    <div className="p-6 space-y-4">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{customerName}</h3>
            <p className="text-xs text-emerald-600">高意向客户</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { icon: Target, color: "text-blue-500", title: "客户洞察", desc: "基于客户详情页面的信息，深度挖掘用户" },
          { icon: Sparkles, color: "text-amber-500", title: "探需技巧", desc: "基于客户画像的沟通策略，排除障碍技巧" },
          { icon: BarChart3, color: "text-emerald-500", title: "跟进技巧", desc: "推荐的跟进建议" },
          { icon: Target, color: "text-rose-500", title: "促单技巧", desc: "推荐促单话术及发送话术" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm font-semibold text-gray-700">{item.title}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Action Strategy Content
  const renderActionStrategy = () => (
    <div className="p-6 space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-800">行动策略</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
        {[
          { label: "策略", value: '精准打击"停车焦虑" (解决顾虑)' },
          { label: "动作", value: "主动提出针对泊车的上门演示或邀约。" },
          { label: "话术逻辑", value: "不谈参数，只谈场景。" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">·</span>
            <div>
              <span className="text-sm font-medium text-gray-700">{item.label}：</span>
              <span className="text-sm text-gray-600">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed">
          {customerName}，我看您最近在关注L9的智能驾驶。L9虽然尺寸比较大，但最新的OTA升级后，断头路和狭窄车位泊入比老司机还稳。如果您方便，我今天或是明天把车开到您家楼下（或者您太太常去的商场），咱们专门试一下您最担心的那个车位，您亲自体验一下到底好不好停，怎么样？
        </p>
      </div>

      <div className="flex gap-2">
        <button type="button" className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors">
          一键发送至企微
        </button>
        <button type="button" className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors">
          生成营销素材
        </button>
        <button type="button" className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors border border-gray-200">
          编辑
        </button>
      </div>
    </div>
  );

  // Default LLM Style View
  const renderDefaultView = () => (
    <div className="flex flex-col items-center justify-center h-full px-8 py-10">
      {/* Logo/Avatar */}
      <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Sales Agent</h2>
      <p className="text-sm text-gray-500 text-center mb-8 max-w-sm">
        AI销售专家，帮您分析业务数据、管理客户、提升销售效率
      </p>

      {/* Quick Action Chips */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={enterBusinessDiagnosis}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left"
        >
          <BarChart3 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-sm text-gray-700">业务诊断</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
        >
          <User className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm text-gray-700">客户顾问</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all text-left"
        >
          <Users className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-sm text-gray-700">获客助手</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-rose-300 hover:bg-rose-50 transition-all text-left"
        >
          <Target className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="text-sm text-gray-700">帮我干活</span>
        </button>
      </div>
    </div>
  );

  // Business Diagnosis View
  const renderBusinessDiagnosisView = () => (
    <div className="flex flex-col h-full p-6">
      {/* AI Message */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-gray-700">业务问题可以直接问我。</span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400 mb-3">试试这些问题：</p>
        {[
          "请帮我分析下当前邀约到试驾转化率低的原因",
          "本月业绩达成情况如何？",
          "哪些客户需要重点跟进？"
        ].map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => startAnalysis(q)}
            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );

  // Analysis View
  const renderAnalysisView = () => (
    <div className="p-6 space-y-4">
      {/* User Question */}
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-emerald-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm">
          <p className="text-sm">{message || "请帮我分析下当前邀约到试驾转化率低的原因"}</p>
        </div>
      </div>

      {/* AI Response */}
      <div className="space-y-4">
        {currentSteps.map((step) => (
          <div key={step.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {step.type === 'thinking' && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{step.content}</span>
              </div>
            )}
            
            {step.type === 'data_loading' && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">{step.title}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {step.content?.split(' · ').map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-1.5">
                      {i === 0 && <Users className="w-3 h-3 text-blue-500" />}
                      {i === 1 && <BarChart3 className="w-3 h-3 text-emerald-500" />}
                      {i === 2 && <Phone className="w-3 h-3 text-purple-500" />}
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step.type === 'analysis' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-800">{step.title}</span>
                  </div>
                </div>
                <div className="p-4 text-sm">{renderMarkdown(step.content || '')}</div>
              </div>
            )}

            {step.type === 'table' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-800">{step.title}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-500 font-medium">销售顾问</th>
                        <th className="px-3 py-2 text-left text-gray-500 font-medium">日均通次</th>
                        <th className="px-3 py-2 text-left text-gray-500 font-medium">单次通时</th>
                        <th className="px-3 py-2 text-left text-gray-500 font-medium">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(step.data as typeof salesData).map((row, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-800">{row.name}</td>
                          <td className="px-3 py-2 text-gray-600">{row.calls}</td>
                          <td className="px-3 py-2 text-gray-600">{row.duration}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {step.type === 'report' && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 overflow-hidden">
                <div className="px-4 py-3 bg-emerald-100/50 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">{step.title}</span>
                  </div>
                </div>
                <div className="p-4 text-sm">{renderMarkdown(step.content || '')}</div>
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    导出完整分析报告
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAnalyzing && currentStepIndex < analysisSteps.length && (
          <div className="flex items-center gap-2 text-gray-400 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">正在分析中...</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <aside className="w-[360px] bg-gradient-to-b from-gray-50 to-white flex flex-col shrink-0 border-l border-gray-200">
      {/* Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {currentMode === "default" && showInitial && renderDefaultView()}
        {currentMode === "businessDiagnosis" && renderBusinessDiagnosisView()}
        {currentMode === "analysis" && renderAnalysisView()}
        {currentMode === "customerProfile" && renderCustomerProfile()}
        {currentMode === "actionStrategy" && renderActionStrategy()}
      </div>

      {/* LLM Style Input Area */}
      <div className="p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Textarea */}
          <div className="px-4 pt-4">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的问题..."
              disabled={isAnalyzing}
              rows={1}
              className="w-full resize-none text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
              style={{ minHeight: '24px', maxHeight: '120px' }}
            />
          </div>
          
          {/* Bottom Bar with Buttons */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 mt-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetToDefault}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                title="新对话"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                title="语音输入"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => message.trim() && startAnalysis(message)}
              disabled={isAnalyzing || !message.trim()}
              className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
