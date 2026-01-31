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

// Report sections for progressive display
const reportSections = [
  { id: "section1", title: "商机状态更新异常", color: "red" },
  { id: "section2", title: "商机储备不足", color: "amber" },
  { id: "section3", title: "邀约通话质量不达标", color: "orange" },
  { id: "section4", title: "通话质量核心根源", color: "purple" },
  { id: "section5", title: "核心问题汇总与改进建议", color: "emerald" },
];

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
  const [visibleReportSections, setVisibleReportSections] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setVisibleReportSections([]);
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
    setVisibleReportSections([]);

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
      // Start showing report sections progressively
      startProgressiveReport();
    }
  }, [currentThinkingIndex]);

  // Progressive report display
  const startProgressiveReport = () => {
    reportSections.forEach((section, index) => {
      setTimeout(() => {
        setVisibleReportSections(prev => [...prev, section.id]);
      }, index * 600);
    });
  };

  // Auto scroll left panel
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thinkingSteps, dataModulesLoading, analysisComplete]);

  // Auto scroll right panel when new sections appear
  useEffect(() => {
    if (rightScrollRef.current && visibleReportSections.length > 0) {
      rightScrollRef.current.scrollTop = rightScrollRef.current.scrollHeight;
    }
  }, [visibleReportSections]);

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
    setVisibleReportSections([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isAnalyzing) {
        startAnalysis();
      }
    }
  };

  if (!isOpen) return null;

  // Render left side navigation
  const renderLeftNav = () => (
    <div className="w-12 bg-gray-900 flex flex-col items-center py-4 gap-2 shrink-0">
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

  // Input area component (fixed at bottom, matches small Agent style)
  const renderInputArea = () => (
    <div className="p-4 shrink-0 border-t border-gray-100 bg-white">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
              className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-gray-100 transition-colors text-gray-400 active:text-gray-600"
              title="新对话"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-gray-100 transition-colors text-gray-400 active:text-gray-600"
              title="语音输入"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => message.trim() && startAnalysis()}
            disabled={isAnalyzing || !message.trim()}
            className="w-8 h-8 bg-emerald-500 active:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
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
  );

  // Render welcome message for analysis mode
  const renderAnalysisWelcome = () => (
    <div className="flex-1 overflow-y-auto p-6">
      {/* AI Welcome Message */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 mb-3">您好，店长！我是理想同学，您的AI销售助手。</p>
          <p className="text-sm text-gray-600 mb-2">我可以帮您：</p>
          <ul className="text-sm text-gray-600 space-y-1.5 mb-3">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
              分析销售数据，发现异常环节
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
              诊断业务问题，定位根本原因
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
              提供改进建议，提升转化效率
            </li>
          </ul>
          <p className="text-sm text-gray-600">您可以直接告诉我您想分析什么，或者点击下方话题查看分析示例。</p>
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
    </div>
  );

  // Render analysis thinking process (left panel)
  const renderAnalysisThinking = () => (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* User question - no background, natural text */}
      <div className="flex justify-end">
        <p className="text-sm text-gray-700 max-w-[85%]">
          分析邀约到试驾转化率低的原因（当前15%，目标25%）
        </p>
      </div>

      {/* Thinking indicator */}
      {isAnalyzing && !dataModulesComplete && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">思考中...</span>
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
          <p className="text-xs text-emerald-600 mt-1 ml-6">已获取：商机状态数据 / 存量商机数据 / 通话数据</p>
        </div>
      )}

      {/* Thinking steps */}
      {thinkingSteps.length > 0 && (
        <div className="space-y-3 mt-4">
          {thinkingSteps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {step.isActive ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />
                </div>
              ) : step.isComplete ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
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
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-emerald-800">已完成</span>
          </div>
          <p className="text-xs text-gray-600 mt-2 ml-8">请在右侧面板查看完整分析报告</p>
        </div>
      )}
    </div>
  );

  // Render analysis report (right panel) - Progressive display
  const renderAnalysisReport = () => {
    if (!analysisComplete && visibleReportSections.length === 0) {
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
        {visibleReportSections.includes("section1") && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
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
                <div>
                  <p className="font-medium text-gray-800 mb-1">数据支撑：</p>
                  <p className="text-gray-600">昨日录入 80 个有效邀约商机，按 30% 历史转化规律，今日应产生 24 个试驾转化，实际仅 12 个，缺口 50%</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">异常点：4 个高优先级商机未及时更新状态</p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>- 商机 A-20240501：客户已确认试驾时间（5 月 3 日 14:00）未录入系统</li>
                    <li>- 商机 B-20240502：客户取消邀约未标记，仍显示 "待试驾"</li>
                    <li>- 商机 C-20240503、D-20240504：邀约后未同步客户反馈（客户顾虑提车周期）</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 2: 商机储备不足 */}
        {visibleReportSections.includes("section2") && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
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
                <div>
                  <p className="font-medium text-gray-800 mb-1">目标测算：</p>
                  <p className="text-gray-600">本月需完成 100 个试驾量（转化率 25%），按 40% 邀约成功率，需储备「待邀约」商机 400 个</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">现状缺口：</p>
                  <p className="text-gray-600">当前系统「待邀约」存量仅 280 个，缺口 120 个，不足以支撑目标达成</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                  <p className="text-amber-800 font-medium">结论：邀约基数不足，间接拉低转化效率</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 3: 邀约通话质量不达标 */}
        {visibleReportSections.includes("section3") && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <button
              type="button"
              onClick={() => toggleSection("section3")}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm font-semibold text-gray-800">3. 邀约通话质量不达标（团队 + 个体双维度）</span>
              </div>
              {expandedSections.has("section3") ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
            {expandedSections.has("section3") && (
              <div className="p-4 text-sm text-gray-700 space-y-4">
                <div>
                  <p className="font-medium text-gray-800 mb-2">团队整体表现：</p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>- 通次：人均每日 6 通 vs 门店均值 8 通 vs 专家标杆 10 通（频次不足 25%）</li>
                    <li>- 通时：单次 1.8 分钟 vs 门店均值 3.2 分钟 vs 专家标杆 4.5 分钟（深度不足 44%）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-2">个体下钻分析（8 名销售顾问）：</p>
                  <ul className="space-y-2 text-gray-600 ml-4">
                    <li><span className="text-red-600 font-medium">1. 通次不足人员：</span>销售顾问张三（日均 3 通）、李四（日均 4 通），显著低于团队均值</li>
                    <li><span className="text-orange-600 font-medium">2. 通时不足人员：</span>销售顾问王五（单次 0.9 分钟）、赵六（单次 1.2 分钟），仅为专家标杆值的 20%、26.7%</li>
                    <li><span className="text-red-700 font-medium">3. 双项不达标人员：</span>孙七（日均 3.5 通 + 单次 1.1 分钟），两项数据均排名团队末位</li>
                  </ul>
                </div>
                {/* Sales data table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">姓名</th>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">通次</th>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">通时</th>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">差距</th>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {salesData.map((row, i) => (
                        <tr key={i} className="bg-white">
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
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <p className="text-orange-800 font-medium">结论：5 名销售（占比 62.5%）存在通时/通次不足，孙七、张三、王五为重点关注对象</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 4: 通话质量核心根源 */}
        {visibleReportSections.includes("section4") && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
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
                <div>
                  <p className="font-medium text-red-700 mb-2">话术支撑不足（60% 低质量通话）：</p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>- 缺少「产品核心卖点讲解」（如 L 系列智能驾驶功能、续航优势）</li>
                    <li>- 未主动介绍「试驾权益」（免费接送、试驾时长 30 分钟 +、专属顾问陪同）</li>
                    <li>- 无法回应客户核心疑问（如 "充电速度""保养成本""提车周期"）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-orange-700 mb-2">沟通技巧欠缺（30% 低质量通话）：</p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>- 被动回应客户，未主动挖掘需求（如 "您更关注空间还是动力？"）</li>
                    <li>- 未明确试驾邀约节点（如 "明天上午 10 点方便吗？我帮您预留试驾车辆"）</li>
                    <li>- 孙七的通话中该类问题占比达 80%，需重点培训</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 5: 核心问题汇总与改进建议 */}
        {visibleReportSections.includes("section5") && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <button
              type="button"
              onClick={() => toggleSection("section5")}
              className="w-full px-4 py-3 flex items-center justify-between bg-emerald-100/50 border-b border-emerald-200"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">5. 核心问题汇总与改进建议</span>
              </div>
              {expandedSections.has("section5") ? <ChevronDown className="w-4 h-4 text-emerald-500" /> : <ChevronRight className="w-4 h-4 text-emerald-500" />}
            </button>
            {expandedSections.has("section5") && (
              <div className="p-4 text-sm text-gray-700 space-y-4">
                <div>
                  <p className="font-medium text-gray-800 mb-2">核心问题（按影响权重排序）：</p>
                  <ol className="space-y-1 text-gray-600 ml-4 list-decimal list-inside">
                    <li>通话质量不达标（权重最高）</li>
                    <li>存量商机储备不足</li>
                    <li>商机状态更新不及时</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-emerald-700 mb-2">改进建议：</p>
                  <ul className="space-y-2 text-gray-600 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                      针对张三、孙七等人员开展专项话术培训
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                      制定个体通话通时通次考核标准
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                      补充存量商机（目标：补齐 120 个缺口）
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                      建立商机状态日清机制，确保当日更新
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export button */}
        {visibleReportSections.length === 5 && (
          <div className="pt-4 animate-in fade-in duration-500">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium active:bg-emerald-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              导出报告 PDF
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render default welcome (no mode selected)
  const renderDefaultWelcome = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 mb-3">您好，店长！我是 SalesAgent，您的AI销售助手。</p>
          <p className="text-sm text-gray-600">请选择您想要使用的功能，或直接输入问题开始对话。</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("analysis")}
          className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl active:bg-emerald-100 transition-colors text-left"
        >
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">业务诊断</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl active:bg-blue-100 transition-colors text-left"
        >
          <User className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">客户顾问</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl active:bg-amber-100 transition-colors text-left"
        >
          <Users className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-gray-700">获客助手</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl active:bg-rose-100 transition-colors text-left"
        >
          <Target className="w-5 h-5 text-rose-600" />
          <span className="text-sm font-medium text-gray-700">帮我干活</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl flex overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-300">
      {/* Left Navigation */}
      {renderLeftNav()}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left: Chat/Dialog Panel */}
        <div className="w-[400px] flex flex-col border-r border-gray-200 shrink-0">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-gray-800">SalesAgent</span>
            </div>
            {!showWelcome && (
              <button
                type="button"
                onClick={resetToDefault}
                className="text-xs text-gray-400 active:text-gray-600"
              >
                开启新话题
              </button>
            )}
          </div>

          {/* Content */}
          {mode === "default" && showWelcome && renderDefaultWelcome()}
          {mode === "analysis" && showWelcome && renderAnalysisWelcome()}
          {mode === "analysis" && !showWelcome && renderAnalysisThinking()}

          {/* Input Area - Fixed at bottom */}
          {renderInputArea()}
        </div>

        {/* Right: Content Panel */}
        <div className="flex-1 bg-[#F5F7FA] flex flex-col">
          {/* Right panel header with close button */}
          <div className="px-6 py-3 flex items-center justify-between shrink-0 border-b border-gray-200 bg-white">
            <h3 className="text-sm font-semibold text-gray-800">
              {mode === "analysis" && "数据分析面板"}
              {mode === "default" && "内容预览"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Right panel content */}
          {mode === "analysis" ? renderAnalysisReport() : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-sm">选择功能后，内容将在此处显示</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
