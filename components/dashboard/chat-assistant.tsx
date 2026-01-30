"use client";

import { X, Send, Loader2, Database, Phone, Users, FileText, Download, ChevronRight, AlertCircle, TrendingDown, BarChart3, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface AnalysisStep {
  id: string;
  type: 'thinking' | 'data_loading' | 'analysis' | 'table' | 'chart' | 'conclusion' | 'report';
  title?: string;
  content?: string;
  data?: unknown;
  isComplete: boolean;
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
  {
    id: '1',
    type: 'thinking',
    content: '正在分析您的问题...',
    isComplete: false,
  },
  {
    id: '2',
    type: 'data_loading',
    title: '正在调用数据模块',
    content: '商机状态数据 · 存量商机数据 · 通话数据',
    isComplete: false,
  },
  {
    id: '3',
    type: 'analysis',
    title: '维度一：商机状态更新核查',
    content: `基于昨日商机数据，验证"已邀约未试驾"商机的状态同步及时性。

**异常发现：商机状态更新异常**

- 昨日录入 80 个有效邀约商机，按 30% 历史转化规律，今日应产生 **24 个**试驾转化，实际仅 **12 个**，缺口 **50%**
- 4 个高优先级商机未及时更新状态，导致统计偏差 + 跟进滞后：
  - 商机 A-20240501：客户已确认试驾时间（5月3日14:00）未录入系统
  - 商机 B-20240502：客户取消邀约未标记，仍显示"待试驾"
  - 商机 C-20240503、D-20240504：邀约后未同步客户反馈（客户顾虑提车周期）`,
    isComplete: false,
  },
  {
    id: '4',
    type: 'analysis',
    title: '维度二：存量商机储备分析',
    content: `测算达成试驾目标所需的存量商机基数，对比当前实际储备量。

**结论：存量商机储备不足**

- **目标测算**：本月需完成 100 个试驾量（转化率 25%），按 40% 邀约成功率，需储备「待邀约」商机 **400 个**
- **现状缺口**：当前系统「待邀约」存量仅 **280 个**，缺口 **120 个**，不足以支撑目标达成
- **结论**：邀约基数不足，间接拉低转化效率`,
    isComplete: false,
  },
  {
    id: '5',
    type: 'analysis',
    title: '维度三：邀约通话质量分析',
    content: `提取近7天团队整体邀约通话数据，与门店均值、专家标杆值对比。

**发现：邀约通话质量不达标（团队+个体双维度）**

**团队整体表现：**
- 通次：人均每日 **6 通** vs 门店均值 8 通 vs 专家标杆 10 通（频次不足 25%）
- 通时：单次 **1.8 分钟** vs 门店均值 3.2 分钟 vs 专家标杆 4.5 分钟（深度不足 44%）

**个体下钻分析（8名销售顾问）：**
- **通次不足**：张三（日均3通）、李四（日均4通），显著低于团队均值
- **通时不足**：王五（单次0.9分钟）、赵六（单次1.2分钟），仅为专家标杆值的20%、26.7%
- **双项不达标**：孙七（日均3.5通 + 单次1.1分钟），两项数据均排名团队末位

**结论**：5名销售（占比62.5%）存在通时/通次不足，孙七、张三、王五为重点关注对象`,
    isComplete: false,
  },
  {
    id: '6',
    type: 'table',
    title: '销售顾问通话数据明细',
    data: salesData,
    isComplete: false,
  },
  {
    id: '7',
    type: 'analysis',
    title: '维度四：通话质量下钻分析',
    content: `结合通话录音关键词提取、销售顾问反馈，定位通话质量不足的根源。

**核心根源发现：**

**1. 话术支撑不足（60%低质量通话）**
- 缺少「产品核心卖点讲解」（如L系列智能驾驶功能、续航优势）
- 未主动介绍「试驾权益」（免费接送、试驾时长30分钟+、专属顾问陪同）
- 无法回应客户核心疑问（如"充电速度""保养成本""提车周期"）

**2. 沟通技巧欠缺（30%低质量通话）**
- 被动回应客户，未主动挖掘需求（如"您更关注空间还是动力？"）
- 未明确试驾邀约节点（如"明天上午10点方便吗？我帮您预留试驾车辆"）
- 孙七的通话中该类问题占比达80%，需重点培训`,
    isComplete: false,
  },
  {
    id: '8',
    type: 'report',
    title: '分析报告已生成',
    content: `**核心问题汇总（按影响权重排序）：**
1. 通话质量不达标（权重45%）
2. 存量商机储备不足（权重30%）
3. 商机状态更新异常（权重25%）

**改进建议：**
- 针对张三、孙七等人员开展专项话术培训
- 制定个体通话通时通次考核标准
- 补充存量商机，加大获客力度
- 建立商机状态实时更新机制`,
    isComplete: false,
  },
];

export function ChatAssistant() {
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const [currentSteps, setCurrentSteps] = useState<AnalysisStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startAnalysis = () => {
    if (!message.trim()) {
      setMessage("请帮我分析下当前邀约到试驾转化率低的原因");
    }
    setShowInitial(false);
    setIsAnalyzing(true);
    setCurrentSteps([]);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < analysisSteps.length) {
      const timer = setTimeout(() => {
        setCurrentSteps(prev => [...prev, { ...analysisSteps[currentStepIndex], isComplete: true }]);
        setCurrentStepIndex(prev => prev + 1);
      }, currentStepIndex === 0 ? 800 : currentStepIndex === 1 ? 1200 : 1500);
      
      return () => clearTimeout(timer);
    } else if (currentStepIndex >= analysisSteps.length) {
      setIsAnalyzing(false);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSteps]);

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
      if (line.startsWith('  - ')) {
        return <li key={i} className="text-gray-500 ml-8 text-sm leading-relaxed">{line.substring(4)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-600 leading-relaxed">{line}</p>;
    });
  };

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
          className="w-8 h-8 hover:bg-white/60 rounded-lg flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {showInitial ? (
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

            <h3 className="text-xl font-bold text-gray-800 mb-2">小明 您好!</h3>
            <p className="text-sm text-gray-500 text-center leading-relaxed px-4 mb-8">
              我是您的AI销售专家，可以帮您分析业务、获客、客户顾问、任务管理等
            </p>

            {/* Quick Start */}
            <div className="w-full space-y-3">
              <p className="text-xs text-gray-400 text-center">点击下方快捷问题开始分析</p>
              <button
                type="button"
                onClick={() => {
                  setMessage("请帮我分析下当前邀约到试驾转化率低的原因");
                  startAnalysis();
                }}
                className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">分析转化率低的原因</p>
                    <p className="text-xs text-gray-500">邀约到试驾环节转化率仅15%</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* User Question */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-emerald-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg">
                <p className="text-sm">{message || "请帮我分析下当前邀约到试驾转化率低的原因"}</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="space-y-4">
              {currentSteps.map((step, index) => (
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
                      <div className="p-4 text-sm">
                        {renderMarkdown(step.content || '')}
                      </div>
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
                              <th className="px-3 py-2 text-left text-gray-500 font-medium">差距</th>
                              <th className="px-3 py-2 text-left text-gray-500 font-medium">状态</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(step.data as typeof salesData).map((row, i) => (
                              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-800">{row.name}</td>
                                <td className="px-3 py-2 text-gray-600">{row.calls}</td>
                                <td className="px-3 py-2 text-gray-600">{row.duration}</td>
                                <td className="px-3 py-2 text-gray-500">{row.gap}</td>
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
                      <div className="p-4 text-sm">
                        {renderMarkdown(step.content || '')}
                      </div>
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

              {/* Loading indicator */}
              {isAnalyzing && currentStepIndex < analysisSteps.length && (
                <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">正在分析中...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
