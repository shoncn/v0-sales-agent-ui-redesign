"use client";

import React from "react"

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  Sparkles,
  X,
  BarChart3,
  User,
  Target,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Search,
  Home,
  ThumbsUp,
  ThumbsDown,
  Share2,
  RefreshCw,
  Upload,
  ImageIcon,
  Database,
  Mic,
  Plus,
  ChevronRight,
} from "lucide-react";

type AgentMode = "default" | "analysis" | "marketingMaterial" | "customerAdvisor" | "acquisitionHelper" | "taskHelper";

interface FullscreenAgentProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AgentMode;
  customerName?: string;
}

// Analysis step type
interface AnalysisStep {
  id: string;
  type: "thinking" | "data_loading" | "analysis" | "table" | "conclusion";
  title?: string;
  content?: string;
  data?: unknown;
  isComplete: boolean;
  isExpanded?: boolean;
}

// Marketing step type
type MarketingStep =
  | "selectType"
  | "selectDirection"
  | "showLibraryImage"
  | "uploadImage"
  | "aiThinking"
  | "showGeneratedImage";

// Recommended topics
const recommendedTopics = [
  {
    id: "analysis",
    icon: BarChart3,
    title: "业务诊断分析",
    desc: "分析邀约到试驾转化率低的原因",
    mode: "analysis" as AgentMode,
  },
  {
    id: "marketing",
    icon: ImageIcon,
    title: "生成营销素材",
    desc: "为客户创作个性化营销内容",
    mode: "marketingMaterial" as AgentMode,
  },
  {
    id: "customer",
    icon: User,
    title: "客户画像分析",
    desc: "深度了解客户需求与偏好",
    mode: "customerAdvisor" as AgentMode,
  },
  {
    id: "task",
    icon: Target,
    title: "智能任务规划",
    desc: "制定高效的跟进计划",
    mode: "taskHelper" as AgentMode,
  },
];

// Sales data for analysis
const salesData = [
  { name: "张三", calls: "3 通", duration: "2.1 分钟", gap: "通次 -3 通", status: "通次不达标" },
  { name: "李四", calls: "4 通", duration: "2.5 分钟", gap: "通次 -2 通", status: "通次不达标" },
  { name: "王五", calls: "5.8 通", duration: "0.9 分钟", gap: "通时 -0.9 分钟", status: "通时不达标" },
  { name: "赵六", calls: "6.2 通", duration: "1.2 分钟", gap: "通时 -0.6 分钟", status: "通时不达标" },
  { name: "孙七", calls: "3.5 通", duration: "1.1 分钟", gap: "通次 -2.5 / 通时 -0.7", status: "双项不达标" },
  { name: "周八", calls: "7 通", duration: "2.8 分钟", gap: "无", status: "达标" },
];

const analysisSteps: AnalysisStep[] = [
  { id: "1", type: "thinking", content: "正在分析您的问题...", isComplete: false },
  { id: "2", type: "data_loading", title: "正在调用数据模块", content: "商机状态数据 · 存量商机数据 · 通话数据", isComplete: false },
  { id: "3", type: "analysis", title: "维度一：商机状态更新核查", content: "基于昨日商机数据，验证\"已邀约未试驾\"商机的状态同步及时性。\n\n**异常发现：商机状态更新异常**\n\n- 昨日录入 80 个有效邀约商机，按 30% 历史转化规律，今日应产生 24 个试驾转化，实际仅 12 个，缺口 50%", isComplete: false },
  { id: "4", type: "analysis", title: "维度二：存量商机储备分析", content: "测算达成试驾目标所需的存量商机基数。\n\n**结论：存量商机储备不足**\n\n- 目标测算：本月需完成 100 个试驾量（转化率 25%）\n- 现状缺口：当前系统「待邀约」存量仅 280 个，缺口 120 个", isComplete: false },
  { id: "5", type: "analysis", title: "维度三：邀约通话质量分析", content: "提取近7天团队整体邀约通话数据分析。\n\n**发现：邀约通话质量不达标**\n\n- 通次：人均每日 6 通 vs 门店均值 8 通\n- 通时：单次 1.8 分钟 vs 门店均值 3.2 分钟", isComplete: false },
  { id: "6", type: "table", title: "销售顾问通话数据明细", data: salesData, isComplete: false },
  { id: "7", type: "conclusion", title: "分析报告已生成", content: "**核心问题汇总：**\n1. 通话质量不达标（权重45%）\n2. 存量商机储备不足（权重30%）\n3. 商机状态更新异常（权重25%）", isComplete: false },
];

export function FullscreenAgent({ isOpen, onClose, initialMode = "default", customerName = "王先生" }: FullscreenAgentProps) {
  const [mode, setMode] = useState<AgentMode>(initialMode);
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<AnalysisStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  
  // Marketing state
  const [marketingStep, setMarketingStep] = useState<MarketingStep>("selectType");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiThinkingProgress, setAiThinkingProgress] = useState(0);
  const [aiThinkingSteps, setAiThinkingSteps] = useState<string[]>([]);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (initialMode !== "default") {
        startModeScript(initialMode);
      }
    }
  }, [isOpen, initialMode]);

  // Start script for mode
  const startModeScript = (selectedMode: AgentMode) => {
    setMode(selectedMode);
    if (selectedMode === "analysis") {
      setIsAnalyzing(true);
      setCurrentSteps([]);
      setCurrentStepIndex(0);
    } else if (selectedMode === "marketingMaterial") {
      setMarketingStep("selectType");
      setUploadedImage(null);
    }
  };

  // Analysis progress effect
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

  // AI thinking effect for marketing
  useEffect(() => {
    if (marketingStep === "aiThinking") {
      const thinkingStepsText = [
        "正在分析客户画像...",
        "正在匹配家庭属性特征...",
        "正在检索二胎家庭营销策略...",
        "正在生成创意方案...",
        "正在合成营销素材...",
      ];

      setAiThinkingSteps([]);
      setAiThinkingProgress(0);

      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex < thinkingStepsText.length) {
          setAiThinkingSteps(prev => [...prev, thinkingStepsText[stepIndex]]);
          setAiThinkingProgress(((stepIndex + 1) / thinkingStepsText.length) * 100);
          stepIndex++;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => setMarketingStep("showGeneratedImage"), 500);
        }
      }, 800);

      return () => clearInterval(stepInterval);
    }
  }, [marketingStep]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSteps, marketingStep]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setMarketingStep("aiThinking");
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleStepExpand = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "优秀": return "bg-emerald-100 text-emerald-700";
      case "达标": return "bg-blue-100 text-blue-700";
      case "通次不达标": return "bg-amber-100 text-amber-700";
      case "通时不达标": return "bg-orange-100 text-orange-700";
      case "双项不达标": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const resetToDefault = () => {
    setMode("default");
    setCurrentSteps([]);
    setCurrentStepIndex(-1);
    setIsAnalyzing(false);
    setMessage("");
    setMarketingStep("selectType");
    setUploadedImage(null);
    setAiThinkingProgress(0);
    setAiThinkingSteps([]);
  };

  if (!isOpen) return null;

  // Render left side navigation
  const renderLeftNav = () => (
    <div className="w-12 bg-gray-900 flex flex-col items-center py-4 gap-2">
      <button
        type="button"
        onClick={resetToDefault}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
          mode === "default" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
        }`}
      >
        <Home className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
      >
        <FileText className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <button
        type="button"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );

  // Render default view with recommended topics
  const renderDefaultChat = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Sales Agent</h2>
      <p className="text-sm text-gray-500 mb-8">您的智能销售助手，随时为您服务</p>

      <div className="w-full max-w-md space-y-3">
        <p className="text-sm text-gray-600 mb-3">推荐话题：</p>
        {recommendedTopics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => startModeScript(topic.mode)}
            className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <topic.icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{topic.title}</p>
              <p className="text-xs text-gray-500 truncate">{topic.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );

  // Render analysis chat content
  const renderAnalysisChat = () => (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* User question */}
      <div className="flex justify-end">
        <div className="bg-emerald-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
          <p className="text-sm">请帮我分析下当前邀约到试驾转化率低的原因</p>
        </div>
      </div>

      {/* AI response steps */}
      {currentSteps.map((step) => (
        <div key={step.id} className="space-y-2">
          {step.type === "thinking" && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{step.content}</span>
            </div>
          )}

          {step.type === "data_loading" && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{step.title}</span>
              </div>
              <p className="text-xs text-gray-500">{step.content}</p>
            </div>
          )}

          {step.type === "analysis" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleStepExpand(step.id)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{step.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSteps.has(step.id) ? "rotate-90" : ""}`} />
              </button>
              {expandedSteps.has(step.id) && (
                <div className="p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {step.content}
                </div>
              )}
            </div>
          )}

          {step.type === "table" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-800">{step.title}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600">姓名</th>
                      <th className="px-3 py-2 text-left text-gray-600">通次</th>
                      <th className="px-3 py-2 text-left text-gray-600">通时</th>
                      <th className="px-3 py-2 text-left text-gray-600">差距</th>
                      <th className="px-3 py-2 text-left text-gray-600">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(step.data as typeof salesData).map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-800">{row.name}</td>
                        <td className="px-3 py-2 text-gray-600">{row.calls}</td>
                        <td className="px-3 py-2 text-gray-600">{row.duration}</td>
                        <td className="px-3 py-2 text-gray-600">{row.gap}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getStatusColor(row.status)}`}>
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

          {step.type === "conclusion" && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">{step.title}</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">{step.content}</div>
            </div>
          )}
        </div>
      ))}

      {isAnalyzing && currentStepIndex < analysisSteps.length && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">正在分析中...</span>
        </div>
      )}
    </div>
  );

  // Render marketing chat content
  const renderMarketingChat = () => (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* Step 1 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-gray-800">素材类型选择</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-4">您希望我为<strong>{customerName}</strong>创作哪种类型的营销素材呢？</p>
          {marketingStep === "selectType" ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => setMarketingStep("selectDirection")} className="flex-1 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium active:bg-emerald-100">
                图片素材
              </button>
              <button type="button" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">
                短视频素材
              </button>
            </div>
          ) : (
            <div className="inline-flex px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm">已选择：图片素材</div>
          )}
        </div>
      </div>

      {/* Step 2 */}
      {marketingStep !== "selectType" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-800">创作方向</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700 mb-4">那么下一步创作哪个方向的营销内容呢？</p>
            {marketingStep === "selectDirection" ? (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setMarketingStep("showLibraryImage")} className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
                  种草图片
                </button>
                <button type="button" className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">
                  新车型亮点宣传
                </button>
                <button type="button" className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">
                  促销政策
                </button>
              </div>
            ) : (
              <div className="inline-flex px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">已选择：种草图片</div>
            )}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {(marketingStep === "showLibraryImage" || marketingStep === "uploadImage" || marketingStep === "aiThinking" || marketingStep === "showGeneratedImage") && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-gray-800">素材库检索</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-700">已为您检索到<strong>L9</strong>的素材库图片，是否直接使用？</p>
            {marketingStep === "showLibraryImage" ? (
              <div className="flex gap-2">
                <button type="button" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">
                  好的，直接使用
                </button>
                <button type="button" onClick={() => setMarketingStep("uploadImage")} className="flex-1 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
                  不，新创建生成
                </button>
              </div>
            ) : (
              <div className="inline-flex px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">已选择：新创建生成</div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Upload */}
      {(marketingStep === "uploadImage" || marketingStep === "aiThinking" || marketingStep === "showGeneratedImage") && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-gray-800">上传素材</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-700">请上传一张您想要使用的图片，我将基于此进行创作。</p>
            {marketingStep === "uploadImage" && (
              <>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-medium">
                  <Upload className="w-5 h-5" />
                  点击上传图片
                </button>
              </>
            )}
            {(marketingStep === "aiThinking" || marketingStep === "showGeneratedImage") && uploadedImage && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img src={uploadedImage || "/placeholder.svg"} alt="上传的图片" className="w-full h-28 object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 5: AI Thinking */}
      {marketingStep === "aiThinking" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm font-semibold text-purple-800">AI创作中</span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">创作进度</span>
                <span className="text-purple-600 font-medium">{Math.round(aiThinkingProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${aiThinkingProgress}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {aiThinkingSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index === aiThinkingSteps.length - 1 && aiThinkingProgress < 100 ? (
                    <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <span className={`text-sm ${index === aiThinkingSteps.length - 1 && aiThinkingProgress < 100 ? "text-purple-600" : "text-gray-600"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Result */}
      {marketingStep === "showGeneratedImage" && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 overflow-hidden">
          <div className="px-4 py-3 bg-emerald-100/50 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">AI创作完成</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-sm text-gray-700 leading-relaxed">
              <p>根据您提供的<strong>{customerName}</strong>的信息结合家庭属性：</p>
              <ul className="mt-2 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  <span>考虑已成为<strong className="text-emerald-700">二胎家庭</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  <span>充满童趣、可爱的氛围有助于拉近彼此感情</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render right content panel
  const renderRightContent = () => {
    // For analysis mode, show data visualizations
    if (mode === "analysis" && currentSteps.length > 0) {
      return (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">数据分析面板</h3>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">今日试驾转化</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-xs text-red-500">目标24，缺口50%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">存量商机</p>
              <p className="text-2xl font-bold text-gray-800">280</p>
              <p className="text-xs text-amber-500">缺口120个</p>
            </div>
          </div>

          {/* Table */}
          {currentSteps.some((s) => s.type === "table") && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-800">通话数据明细</span>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600">姓名</th>
                      <th className="px-3 py-2 text-left text-gray-600">通次</th>
                      <th className="px-3 py-2 text-left text-gray-600">通时</th>
                      <th className="px-3 py-2 text-left text-gray-600">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {salesData.map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-800">{row.name}</td>
                        <td className="px-3 py-2 text-gray-600">{row.calls}</td>
                        <td className="px-3 py-2 text-gray-600">{row.duration}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getStatusColor(row.status)}`}>
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
        </div>
      );
    }

    // For marketing mode, show generated image
    if (mode === "marketingMaterial") {
      return (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">素材预览</h3>
          </div>

          {marketingStep === "showLibraryImage" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <img src="/images/l9-showroom.jpg" alt="L9展厅图" className="w-full h-48 object-cover" />
              <div className="p-3 text-center text-sm text-gray-500">L9 素材库图片</div>
            </div>
          )}

          {marketingStep === "showGeneratedImage" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <img src="/images/l9-family.jpg" alt="生成的营销图片" className="w-full h-56 object-cover" />
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setLiked(!liked); setDisliked(false); }}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${liked ? "bg-emerald-100 text-emerald-600" : "text-gray-400 active:bg-gray-100"}`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDisliked(!disliked); setLiked(false); }}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${disliked ? "bg-red-100 text-red-600" : "text-gray-400 active:bg-gray-100"}`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setShowSharePopup(true)} className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 active:bg-gray-100">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 active:bg-gray-100">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button" className="flex-1 px-4 py-3 bg-emerald-500 text-white text-sm font-medium rounded-xl active:bg-emerald-600">
                  发送至企业微信
                </button>
                <button type="button" className="flex-1 px-4 py-3 bg-blue-500 text-white text-sm font-medium rounded-xl active:bg-blue-600">
                  发送至朋友圈
                </button>
              </div>
            </div>
          )}

          {(marketingStep === "selectType" || marketingStep === "selectDirection" || marketingStep === "uploadImage" || marketingStep === "aiThinking") && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">完成左侧选择后预览素材</p>
            </div>
          )}
        </div>
      );
    }

    // Default empty state
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <FileText className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-sm">选择话题后查看相关内容</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-[1194px] h-[834px] bg-[#F5F7FA] rounded-xl shadow-2xl overflow-hidden flex">
        {/* Left Navigation */}
        {renderLeftNav()}

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left: Chat Panel */}
          <div className="w-[480px] bg-white flex flex-col border-r border-gray-200">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-gray-800">Sales Agent</span>
              </div>
              {mode !== "default" && (
                <button type="button" onClick={resetToDefault} className="text-xs text-gray-400 active:text-gray-600">
                  开启新话题
                </button>
              )}
            </div>

            {/* Chat Content */}
            {mode === "default" && renderDefaultChat()}
            {mode === "analysis" && renderAnalysisChat()}
            {mode === "marketingMaterial" && renderMarketingChat()}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <button type="button" className="w-8 h-8 flex items-center justify-center text-gray-400 active:bg-gray-200 rounded-lg">
                  <Plus className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="发送消息给 Sales Agent"
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
                <button type="button" className="w-8 h-8 flex items-center justify-center text-gray-400 active:bg-gray-200 rounded-lg">
                  <Mic className="w-5 h-5" />
                </button>
                <button type="button" className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-lg active:bg-emerald-600">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Content Panel */}
          <div className="flex-1 bg-[#F5F7FA] overflow-y-auto">
            {renderRightContent()}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-500 active:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]" onClick={() => setShowSharePopup(false)}>
          <div className="bg-white rounded-2xl p-5 w-72 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">分享至</h3>
              <button type="button" onClick={() => setShowSharePopup(false)} className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 active:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button type="button" onClick={() => setShowSharePopup(false)} className="w-full flex items-center gap-3 px-4 py-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium active:bg-green-100">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                企业微信
              </button>
              <button type="button" onClick={() => setShowSharePopup(false)} className="w-full flex items-center gap-3 px-4 py-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-medium active:bg-blue-100">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                微信朋友圈
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
