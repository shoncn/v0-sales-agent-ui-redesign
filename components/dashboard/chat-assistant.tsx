"use client";

import { X, Send, Loader2, Database, Phone, Users, FileText, Download, ChevronRight, AlertCircle, TrendingDown, BarChart3, MessageSquare, User, Target, Lightbulb, Car, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type AssistantMode = "default" | "analysis" | "customerProfile" | "actionStrategy";

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

  useEffect(() => {
    setCurrentMode(mode);
    if (mode === "customerProfile" || mode === "actionStrategy") {
      setShowInitial(false);
    }
  }, [mode]);

  const startAnalysis = () => {
    if (!message.trim()) {
      setMessage("请帮我分析下当前邀约到试驾转化率低的原因");
    }
    setShowInitial(false);
    setCurrentMode("analysis");
    setIsAnalyzing(true);
    setCurrentSteps([]);
    setCurrentStepIndex(0);
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

  // Customer Profile Content
  const renderCustomerProfile = () => (
    <div className="p-5 space-y-4">
      {/* Customer Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
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

      {/* Profile Cards */}
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">客户洞察</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            基于客户详情页面的信息，深度挖掘用户
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">探需技巧</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            基于客户画像的沟通策略，排除障碍技巧
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-gray-700">跟进技巧</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            推荐的跟进建议
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-semibold text-gray-700">促单技巧</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            推荐促单话术及发送话术
          </p>
        </div>
      </div>
    </div>
  );

  // Action Strategy Content
  const renderActionStrategy = () => (
    <div className="p-5 space-y-4">
      {/* Strategy Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-800">行动策略</span>
        </div>
      </div>

      {/* Strategy Content */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-gray-400 mt-0.5">{'>'}</span>
          <div>
            <span className="text-sm font-medium text-gray-700">策略：</span>
            <span className="text-sm text-gray-600">精准打击"停车焦虑" (解决顾虑)</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-400 mt-0.5">{'>'}</span>
          <div>
            <span className="text-sm font-medium text-gray-700">动作：</span>
            <span className="text-sm text-gray-600">主动提出针对泊车的上门演示或邀约。</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-400 mt-0.5">{'>'}</span>
          <div>
            <span className="text-sm font-medium text-gray-700">话术逻辑：</span>
            <span className="text-sm text-gray-600">不谈参数，只谈场景。</span>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          {customerName}，我看您最近在关注L9的智能驾驶。L9虽然尺寸比较大，但最新的OTA升级后，断头路和狭窄车位泊入比老司机还稳。如果您方便，我今天或是明天把车开到您家楼下（或者您太太常去的商场），咱们专门试一下您最担心的那个车位，您亲自体验一下到底好不好停，怎么样？
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-emerald-200"
        >
          一键发送至企微
        </button>
        <button
          type="button"
          className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          生成营销素材
        </button>
        <button
          type="button"
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors border border-gray-200"
        >
          编辑
        </button>
      </div>
    </div>
  );

  // Default Initial View
  const renderDefaultView = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      {/* Avatar */}
      <div className="w-28 h-28 mb-6 relative">
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center overflow-hidden shadow-lg">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <ellipse cx="50" cy="55" rx="30" ry="28" fill="#E8DDD0" />
            <circle cx="40" cy="52" r="3" fill="#2D2D2D" />
            <circle cx="60" cy="52" r="3" fill="#2D2D2D" />
            <path d="M 40 62 Q 50 70 60 62" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="50" cy="32" rx="28" ry="12" fill="#C4956A" />
            <path d="M 22 32 Q 22 20 50 18 Q 78 20 78 32" fill="#C4956A" />
            <ellipse cx="50" cy="32" rx="32" ry="6" fill="#B8875C" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">Hi 我是SalesAgent，我可以提供以下帮助!</h3>
      <p className="text-sm text-gray-500 text-center leading-relaxed px-4 mb-8">
        我是您的AI销售专家，可以帮您分析业务、获客、客户顾问、任务管理等
      </p>

      {/* Quick Actions */}
      <div className="w-full space-y-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-gray-700">业务诊断</span>
          </div>
          <p className="text-xs text-gray-500">分析业务数据，诊断经营问题，提供改进建议</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">客户顾问</span>
          </div>
          <p className="text-xs text-gray-500">基于客户画像提供沟通策略和跟进建议</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">获客助手</span>
          </div>
          <p className="text-xs text-gray-500">智能获客线索挖掘，拓展潜在客户资源</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-semibold text-gray-700">帮我干活</span>
          </div>
          <p className="text-xs text-gray-500">自动化任务执行，提升工作效率</p>
        </div>
      </div>
    </div>
  );

  // Analysis View
  const renderAnalysisView = () => (
    <div className="p-5 space-y-4">
      {/* User Question */}
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-emerald-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg">
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
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-800">{step.title}</span>
                  </div>
                </div>
                <div className="p-4 text-sm">{renderMarkdown(step.content || '')}</div>
              </div>
            )}

            {step.type === 'table' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200"
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
    <aside className="w-[480px] bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-800 block">Sales Agent</span>
            <span className="text-xs text-emerald-600">AI 智能分析助手</span>
          </div>
        </div>
        <button
          type="button"
          onClick={resetToDefault}
          className="w-8 h-8 hover:bg-white/60 rounded-lg flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {currentMode === "default" && showInitial && renderDefaultView()}
        {currentMode === "analysis" && renderAnalysisView()}
        {currentMode === "customerProfile" && renderCustomerProfile()}
        {currentMode === "actionStrategy" && renderActionStrategy()}
      </div>

      {/* Quick Action Buttons */}
      {(currentMode === "customerProfile" || currentMode === "actionStrategy") && (
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentMode("default")}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors border border-gray-200"
            >
              业务诊断
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode("customerProfile")}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${currentMode === "customerProfile" ? "bg-emerald-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"}`}
            >
              获客助手
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode("customerProfile")}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors border border-gray-200"
            >
              客户顾问
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode("actionStrategy")}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${currentMode === "actionStrategy" ? "bg-emerald-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"}`}
            >
              任务助手
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && startAnalysis()}
            placeholder="请输入您想要咨询的问题..."
            disabled={isAnalyzing}
            className="w-full px-4 py-3.5 pr-12 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          <button
            type="button"
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
