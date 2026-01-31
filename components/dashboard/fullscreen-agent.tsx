"use client";

import React from "react";

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
  ChevronDown,
  AlertTriangle,
  Download,
  CheckCircle2,
} from "lucide-react";

type AgentMode = "default" | "analysis" | "marketingMaterial" | "customerAdvisor" | "acquisitionHelper" | "taskHelper";

interface FullscreenAgentProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AgentMode;
  customerName?: string;
}

// Thinking step type for left panel
interface ThinkingStep {
  id: string;
  text: string;
  isComplete: boolean;
  isActive: boolean;
}

// Sales data for analysis
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

// Analysis thinking steps
const analysisThinkingSteps: ThinkingStep[] = [
  { id: "1", text: "第一维度：商机状态更新核查中", isComplete: false, isActive: false },
  { id: "2", text: "第二维度：存量商机储备分析", isComplete: false, isActive: false },
  { id: "3", text: "第三维度：邀约通话质量分析（通时 + 通次）", isComplete: false, isActive: false },
  { id: "4", text: "第四维度：通话质量下钻分析（核心原因）", isComplete: false, isActive: false },
  { id: "5", text: "生成完整分析报告", isComplete: false, isActive: false },
];

// Marketing step type
type MarketingStep =
  | "selectType"
  | "selectDirection"
  | "showLibraryImage"
  | "uploadImage"
  | "aiThinking"
  | "showGeneratedImage";

export function FullscreenAgent({ isOpen, onClose, initialMode = "default", customerName = "王先生" }: FullscreenAgentProps) {
  const [mode, setMode] = useState<AgentMode>(initialMode);
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [currentThinkingIndex, setCurrentThinkingIndex] = useState(-1);
  const [dataModulesLoading, setDataModulesLoading] = useState(false);
  const [dataModulesComplete, setDataModulesComplete] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["section1", "section2", "section3", "section4", "section5"]));
  
  // Marketing state
  const [marketingStep, setMarketingStep] = useState<MarketingStep>("selectType");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiThinkingProgress, setAiThinkingProgress] = useState(0);
  const [aiThinkingSteps, setAiThinkingSteps] = useState<string[]>([]);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowWelcome(true);
      setIsAnalyzing(false);
      setThinkingSteps([]);
      setCurrentThinkingIndex(-1);
      setDataModulesLoading(false);
      setDataModulesComplete(false);
      setAnalysisComplete(false);
      setMarketingStep("selectType");
      setUploadedImage(null);
    }
  }, [isOpen, initialMode]);

  // Start analysis when clicking the anomaly topic
  const startAnalysis = () => {
    setShowWelcome(false);
    setIsAnalyzing(true);
    setDataModulesLoading(true);
    setThinkingSteps([]);
    setCurrentThinkingIndex(-1);
    setDataModulesComplete(false);
    setAnalysisComplete(false);

    // Start data modules loading
    setTimeout(() => {
      setDataModulesLoading(false);
      setDataModulesComplete(true);
      // Start thinking steps
      setCurrentThinkingIndex(0);
    }, 2000);
  };

  // Thinking steps progress effect
  useEffect(() => {
    if (currentThinkingIndex >= 0 && currentThinkingIndex < analysisThinkingSteps.length) {
      // Set current step as active
      setThinkingSteps(prev => {
        const newSteps = [...analysisThinkingSteps.slice(0, currentThinkingIndex + 1)];
        newSteps[currentThinkingIndex] = { ...newSteps[currentThinkingIndex], isActive: true, isComplete: false };
        if (currentThinkingIndex > 0) {
          newSteps[currentThinkingIndex - 1] = { ...newSteps[currentThinkingIndex - 1], isActive: false, isComplete: true };
        }
        return newSteps;
      });

      const timer = setTimeout(() => {
        // Mark current as complete and move to next
        setThinkingSteps(prev => {
          const newSteps = [...prev];
          if (newSteps[currentThinkingIndex]) {
            newSteps[currentThinkingIndex] = { ...newSteps[currentThinkingIndex], isActive: false, isComplete: true };
          }
          return newSteps;
        });
        setCurrentThinkingIndex(prev => prev + 1);
      }, 1500);

      return () => clearTimeout(timer);
    } else if (currentThinkingIndex >= analysisThinkingSteps.length) {
      // All steps complete
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }
  }, [currentThinkingIndex]);

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

  // Auto scroll left panel
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thinkingSteps, dataModulesLoading, analysisComplete]);

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
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
    setShowWelcome(true);
    setThinkingSteps([]);
    setCurrentThinkingIndex(-1);
    setIsAnalyzing(false);
    setDataModulesLoading(false);
    setDataModulesComplete(false);
    setAnalysisComplete(false);
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
          mode === "default" && showWelcome ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
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

  // Render welcome message for analysis mode
  const renderAnalysisWelcome = () => (
    <div className="flex-1 flex flex-col p-6">
      {/* AI Welcome Message */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-800 font-medium mb-3">您好，店长！我是理想同学，您的AI销售助手。</p>
            <p className="text-sm text-gray-600 mb-2">我可以帮您：</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                分析销售数据，发现异常环节
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                诊断业务问题，定位根本原因
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                提供改进建议，提升转化效率
              </li>
            </ul>
            <p className="text-sm text-gray-600">您可以直接告诉我您想分析什么，或者点击下方话题查看分析示例。</p>
          </div>
        </div>
      </div>

      {/* Anomaly Alert Topic */}
      <button
        type="button"
        onClick={startAnalysis}
        className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 text-left active:bg-amber-100 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 mb-1">已发现异常：邀约到试驾转化率显著偏低</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              当前转化率为 <strong>15%</strong>，低于目标值（25%）的 <strong>10个百分点</strong>，也低于行业均值（22%）的 <strong>7个百分点</strong>。该环节被系统标记为高风险环节，建议重点分析原因。
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
        </div>
      </button>

      {/* Input area */}
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
          <input
            type="text"
            placeholder="输入您想分析的问题..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button type="button" className="w-8 h-8 flex items-center justify-center text-gray-400">
            <Mic className="w-5 h-5" />
          </button>
          <button type="button" className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Render analysis thinking process (left panel)
  const renderAnalysisThinking = () => (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* User question (the clicked topic) */}
      <div className="flex justify-end">
        <div className="bg-emerald-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%]">
          <p className="text-sm">分析邀约到试驾转化率低的原因（当前15%，目标25%）</p>
        </div>
      </div>

      {/* Thinking indicator */}
      {isAnalyzing && !dataModulesComplete && (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">思考中...</span>
            </div>
          </div>
        </div>
      )}

      {/* Data modules loading */}
      {dataModulesLoading && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-800">正在调用系统数据模块</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>商机状态数据</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>存量商机数据</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>通话数据</span>
            </div>
          </div>
        </div>
      )}

      {/* Data modules complete */}
      {dataModulesComplete && (
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-800">数据模块调用完成</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1 ml-6">已获取：商机状态数据 · 存量商机数据 · 通话数据</p>
        </div>
      )}

      {/* Thinking steps */}
      {thinkingSteps.length > 0 && (
        <div className="space-y-3 mt-4">
          {thinkingSteps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {step.isActive ? (
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                </div>
              ) : step.isComplete ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
              )}
              <span className={`text-sm ${step.isActive ? 'text-emerald-700 font-medium' : step.isComplete ? 'text-gray-700' : 'text-gray-400'}`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Completion indicator */}
      {analysisComplete && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-emerald-800">分析已完成</span>
              <p className="text-xs text-gray-600">请在右侧面板查看完整分析报告</p>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
          <input
            type="text"
            placeholder="继续提问..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button type="button" className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Render analysis report (right panel)
  const renderAnalysisReport = () => {
    if (!analysisComplete) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <BarChart3 className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-sm">等待分析完成...</p>
          <p className="text-xs mt-1">分析报告将在此处显示</p>
        </div>
      );
    }

    return (
      <div ref={rightScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Section 1: 商机状态更新异常 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("section1")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-gray-800">1. 商机状态更新异常</span>
            </div>
            {expandedSections.has("section1") ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
          {expandedSections.has("section1") && (
            <div className="p-4 text-sm text-gray-700 space-y-3">
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <p className="font-medium text-amber-800 mb-1">数据支撑：</p>
                <p className="text-amber-700 text-xs">昨日录入 80 个有效邀约商机，按 30% 历史转化规律，今日应产生 24 个试驾转化，实际仅 12 个，<strong>缺口 50%</strong></p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-2">异常点：4 个高优先级商机未及时更新状态</p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span><strong>商机 A-20240501：</strong>客户已确认试驾时间（5月3日 14:00）未录入系统</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span><strong>商机 B-20240502：</strong>客户取消邀约未标记，仍显示"待试驾"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span><strong>商机 C-20240503、D-20240504：</strong>邀约后未同步客户反馈（客户顾虑提车周期）</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: 商机储备不足 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("section2")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-gray-800">2. 商机储备不足</span>
            </div>
            {expandedSections.has("section2") ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
          {expandedSections.has("section2") && (
            <div className="p-4 text-sm text-gray-700 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 mb-1">目标测算</p>
                  <p className="text-lg font-bold text-blue-800">400 个</p>
                  <p className="text-xs text-blue-600">需储备「待邀约」商机</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                  <p className="text-xs text-red-600 mb-1">当前存量</p>
                  <p className="text-lg font-bold text-red-800">280 个</p>
                  <p className="text-xs text-red-600">缺口 120 个</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                <strong>结论：</strong>本月需完成 100 个试驾量（转化率 25%），按 40% 邀约成功率，需储备 400 个商机。当前存量不足以支撑目标达成。
              </p>
            </div>
          )}
        </div>

        {/* Section 3: 邀约通话质量不达标 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("section3")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-semibold text-gray-800">3. 邀约通话质量不达标</span>
            </div>
            {expandedSections.has("section3") ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
          {expandedSections.has("section3") && (
            <div className="p-4 text-sm text-gray-700 space-y-4">
              <div>
                <p className="font-medium text-gray-800 mb-2">团队整体表现：</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">通次</p>
                    <p className="text-sm"><strong>人均 6 通/日</strong></p>
                    <p className="text-xs text-red-500">vs 门店均值 8 通 · 专家标杆 10 通</p>
                    <p className="text-xs text-red-600 mt-1">频次不足 25%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">通时</p>
                    <p className="text-sm"><strong>单次 1.8 分钟</strong></p>
                    <p className="text-xs text-red-500">vs 门店均值 3.2 分钟 · 专家标杆 4.5 分钟</p>
                    <p className="text-xs text-red-600 mt-1">深度不足 44%</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-2">个体下钻分析（8 名销售顾问）：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-2 text-left text-gray-600 font-medium">销售顾问</th>
                        <th className="px-2 py-2 text-left text-gray-600 font-medium">日均通次</th>
                        <th className="px-2 py-2 text-left text-gray-600 font-medium">单次通时</th>
                        <th className="px-2 py-2 text-left text-gray-600 font-medium">与均值差距</th>
                        <th className="px-2 py-2 text-left text-gray-600 font-medium">达标状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {salesData.map((row, i) => (
                        <tr key={i} className={row.status === "双项不达标" ? "bg-red-50" : ""}>
                          <td className="px-2 py-2 text-gray-800 font-medium">{row.name}</td>
                          <td className="px-2 py-2 text-gray-600">{row.calls}</td>
                          <td className="px-2 py-2 text-gray-600">{row.duration}</td>
                          <td className="px-2 py-2 text-gray-600">{row.gap}</td>
                          <td className="px-2 py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${getStatusColor(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2 bg-amber-50 p-2 rounded">
                  <strong>结论：</strong>5 名销售（占比 62.5%）存在通时/通次不足，<strong className="text-red-600">孙七、张三、王五</strong>为重点关注对象。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: 通话质量核心根源 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("section4")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm font-semibold text-gray-800">4. 通话质量核心根源</span>
            </div>
            {expandedSections.has("section4") ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
          {expandedSections.has("section4") && (
            <div className="p-4 text-sm text-gray-700 space-y-4">
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <p className="font-medium text-red-800 mb-2">话术支撑不足（60% 低质量通话）：</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• 缺少「产品核心卖点讲解」（如 L 系列智能驾驶功能、续航优势）</li>
                  <li>• 未主动介绍「试驾权益」（免费接送、试驾时长 30 分钟+、专属顾问陪同）</li>
                  <li>• 无法回应客户核心疑问（如"充电速度""保养成本""提车周期"）</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                <p className="font-medium text-orange-800 mb-2">沟通技巧欠缺（30% 低质量通话）：</p>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• 被动回应客户，未主动挖掘需求（如"您更关注空间还是动力？"）</li>
                  <li>• 未明确试驾邀约节点（如"明天上午 10 点方便吗？我帮您预留试驾车辆"）</li>
                  <li>• <strong>孙七</strong>的通话中该类问题占比达 80%，需重点培训</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: 核心问题汇总 & 改进建议 */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("section5")}
            className="w-full px-4 py-3 flex items-center justify-between bg-emerald-100/50 border-b border-emerald-200"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">核心问题汇总 & 改进建议</span>
            </div>
            {expandedSections.has("section5") ? <ChevronDown className="w-4 h-4 text-emerald-600" /> : <ChevronRight className="w-4 h-4 text-emerald-600" />}
          </button>
          {expandedSections.has("section5") && (
            <div className="p-4 text-sm text-gray-700 space-y-4">
              <div>
                <p className="font-medium text-emerald-800 mb-2">核心问题汇总（按影响权重排序）：</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">权重 45%</span>
                    <span className="text-sm text-gray-700">通话质量不达标</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">权重 30%</span>
                    <span className="text-sm text-gray-700">存量商机储备不足</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">权重 25%</span>
                    <span className="text-sm text-gray-700">商机状态更新异常</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 mb-2">初步改进建议：</p>
                <ul className="text-xs text-gray-700 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">1.</span>
                    <span>针对<strong>张三、孙七、王五</strong>等人员开展专项话术培训</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">2.</span>
                    <span>制定个体通话通时通次考核标准（最低 5 通/日，单次 2.5 分钟+）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">3.</span>
                    <span>加强线索获取渠道，补充存量商机至 400 个以上</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">4.</span>
                    <span>建立商机状态日清机制，确保当日商机当日更新</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl text-sm font-medium active:bg-emerald-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          导出报告（PDF）
        </button>
      </div>
    );
  };

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
            {marketingStep === "uploadImage" && (
              <>
                <p className="text-sm text-gray-700">请上传一张您想要使用的图片</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-medium">
                  <Upload className="w-5 h-5" />
                  点击上传图片
                </button>
              </>
            )}
            {(marketingStep === "aiThinking" || marketingStep === "showGeneratedImage") && uploadedImage && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img src={uploadedImage || "/placeholder.svg"} alt="用户上传" className="w-full h-28 object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Thinking */}
      {marketingStep === "aiThinking" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-800">AI创作中</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${aiThinkingProgress}%` }} />
            </div>
            <div className="space-y-2">
              {aiThinkingSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  {index === aiThinkingSteps.length - 1 && aiThinkingProgress < 100 ? (
                    <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Complete */}
      {marketingStep === "showGeneratedImage" && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">创作完成</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 ml-7">请在右侧面板查看生成的营销素材</p>
        </div>
      )}
    </div>
  );

  // Render marketing preview (right panel)
  const renderMarketingPreview = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {marketingStep === "showGeneratedImage" ? (
        <>
          <div className="text-sm text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-gray-200">
            <p>根据您提供的<strong>{customerName}</strong>的信息结合家庭属性：</p>
            <ul className="mt-2 space-y-1 ml-4 text-xs text-gray-600">
              <li>• 考虑已成为<strong className="text-emerald-700">二胎家庭</strong></li>
              <li>• 充满童趣、可爱的氛围有助于拉近彼此感情</li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
            <img src="/images/l9-family.jpg" alt="生成的营销图片" className="w-full h-64 object-cover" />
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => { setLiked(!liked); setDisliked(false); }} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${liked ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400'}`}>
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => { setDisliked(!disliked); setLiked(false); }} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${disliked ? 'bg-red-100 text-red-600' : 'text-gray-400'}`}>
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setShowSharePopup(true)} className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400">
                  <Share2 className="w-5 h-5" />
                </button>
                <button type="button" className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
          <ImageIcon className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-sm">等待创作完成...</p>
          <p className="text-xs mt-1">营销素材将在此处显示</p>
        </div>
      )}

      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowSharePopup(false)}>
          <div className="bg-white rounded-2xl p-5 w-72 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">分享至</h3>
              <button type="button" onClick={() => setShowSharePopup(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <button type="button" onClick={() => setShowSharePopup(false)} className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                企业微信
              </button>
              <button type="button" onClick={() => setShowSharePopup(false)} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-medium">
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

  // Render default welcome (right panel)
  const renderDefaultRight = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Sparkles className="w-10 h-10 text-gray-300" />
      </div>
      <p className="text-sm text-gray-500">选择一个话题开始对话</p>
      <p className="text-xs mt-1 text-gray-400">内容将在此处显示</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="w-full h-full bg-white flex overflow-hidden">
        {/* Left Navigation */}
        {renderLeftNav()}

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left: Chat Panel */}
          <div className="w-[480px] bg-white border-r border-gray-200 flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-800">理想同学</h2>
                  <p className="text-xs text-gray-500">AI 销售助手</p>
                </div>
              </div>
              {!showWelcome && (
                <button type="button" onClick={resetToDefault} className="text-xs text-gray-400 active:text-gray-600">
                  开启新话题
                </button>
              )}
            </div>

            {/* Chat Content */}
            {mode === "analysis" && showWelcome && renderAnalysisWelcome()}
            {mode === "analysis" && !showWelcome && renderAnalysisThinking()}
            {mode === "marketingMaterial" && renderMarketingChat()}
            {mode === "default" && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Sales Agent</h2>
                <p className="text-sm text-gray-500">请从左侧选择功能开始使用</p>
              </div>
            )}
          </div>

          {/* Right: Content Panel */}
          <div className="flex-1 bg-[#F5F7FA] flex flex-col relative">
            {/* Right panel header with close button */}
            <div className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-gray-200 bg-white">
              <h3 className="text-base font-semibold text-gray-800">
                {mode === "analysis" && "数据分析报告"}
                {mode === "marketingMaterial" && "素材预览"}
                {mode === "default" && "内容预览"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Right panel content */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {mode === "analysis" && renderAnalysisReport()}
              {mode === "marketingMaterial" && renderMarketingPreview()}
              {mode === "default" && renderDefaultRight()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
