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
  ListTodo,
  FileText,
  FolderOpen,
  Wrench,
  Home,
  Database,
  Mic,
  Plus,
  ChevronRight,
  AlertTriangle,
  Download,
  CheckCircle2,
  Bold,
  Italic,
  List,
  Share2,
  Printer,
  Play,
  ImageIcon,
  Video,
} from "lucide-react";

type AgentMode = "default" | "analysis" | "marketingMaterial" | "customerAdvisor" | "acquisitionHelper" | "taskHelper";

// Marketing flow step
type MarketingStep = 
  | "selectType"           // Select: image or video
  | "selectDirection"      // Select: 种草视频, 新车型, 促销
  | "showLibrary"          // Show library videos
  | "askRecreate"          // Ask if want to recreate
  | "generating"           // Generating video
  | "complete";            // Show final result

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
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0); // For line-by-line display
  
  // Marketing flow state
  const [marketingStep, setMarketingStep] = useState<MarketingStep>("selectType");
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>("");
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [videoGenerationProgress, setVideoGenerationProgress] = useState(0);
  const [showMarketingRightPanel, setShowMarketingRightPanel] = useState(false);
  const [marketingLibraryLoaded, setMarketingLibraryLoaded] = useState(false);
  const [videoGenerationComplete, setVideoGenerationComplete] = useState(false);
  const [downloadAlert, setDownloadAlert] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  
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
      setShowRightPanel(false);
      setVisibleLines(0);
      // Reset marketing state
      setMarketingStep("selectType");
      setSelectedMaterialType("");
      setSelectedDirection("");
      setVideoGenerationProgress(0);
      setShowMarketingRightPanel(false);
      setMarketingLibraryLoaded(false);
      setVideoGenerationComplete(false);
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
    setShowRightPanel(false);
    setVisibleLines(0);

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
      // Show right panel and start progressive report display
      setShowRightPanel(true);
      startProgressiveReport();
    }
  }, [currentThinkingIndex]);

  // Progressive report display - line by line
  const startProgressiveReport = () => {
    // Total number of lines to display (approximately)
    const totalLines = 50;
    let lineIndex = 0;
    
    const lineInterval = setInterval(() => {
      if (lineIndex < totalLines) {
        setVisibleLines(lineIndex + 1);
        lineIndex++;
      } else {
        clearInterval(lineInterval);
      }
    }, 80); // 80ms per line for smooth typing effect
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
    setShowRightPanel(false);
    setVisibleLines(0);
    // Reset marketing state
    setMarketingStep("selectType");
    setSelectedMaterialType("");
    setSelectedDirection("");
    setVideoGenerationProgress(0);
    setShowMarketingRightPanel(false);
    setMarketingLibraryLoaded(false);
    setVideoGenerationComplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isAnalyzing) {
        // Check if in marketing flow and waiting for user input
        if (mode === "acquisitionHelper" && marketingStep === "askRecreate") {
          handleRecreateConfirm();
        } else {
          startAnalysis();
        }
      }
    }
  };

  // Download handlers with alert
  const handleDownloadVideo = () => {
    setDownloadAlert({ show: true, message: "下载成功，已保存到本地目录" });
    setTimeout(() => setDownloadAlert({ show: false, message: "" }), 3000);
  };

  const handleDownloadPDF = () => {
    setDownloadAlert({ show: true, message: "PDF导出成功，已保存到本地目录" });
    setTimeout(() => setDownloadAlert({ show: false, message: "" }), 3000);
  };

  // Marketing flow handlers
  const handleSelectMaterialType = (type: string) => {
    setSelectedMaterialType(type);
    setMarketingStep("selectDirection");
    setShowWelcome(false);
  };

  const handleSelectDirection = (direction: string) => {
    setSelectedDirection(direction);
    setMarketingStep("showLibrary");
    setShowMarketingRightPanel(true);
    // Simulate library loading
    setTimeout(() => {
      setMarketingLibraryLoaded(true);
      setMarketingStep("askRecreate");
    }, 1500);
  };

  const handleRecreateConfirm = () => {
    setMarketingStep("generating");
    setMessage("");
    // Start video generation - 3 seconds total
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10; // Faster increments for 3 second completion
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setVideoGenerationProgress(100);
        setTimeout(() => {
          setMarketingStep("complete");
          setVideoGenerationComplete(true);
        }, 300);
      }
      setVideoGenerationProgress(Math.min(progress, 100));
    }, 300); // 300ms * 10 increments = 3 seconds
  };

  if (!isOpen) return null;

  // Input area component - matches small Agent style exactly
  const renderInputArea = () => (
    <div className="p-4 shrink-0 bg-background">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Textarea */}
        <div className="px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题..."
            disabled={isAnalyzing}
            rows={1}
            className="w-full resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
        </div>
        
        {/* Bottom Bar with Buttons */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={resetToDefault}
              className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-accent transition-colors text-muted-foreground active:text-foreground"
              title="新对话"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-accent transition-colors text-muted-foreground active:text-foreground"
              title="语音输入"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => message.trim() && startAnalysis()}
            disabled={isAnalyzing || !message.trim()}
            className="w-8 h-8 bg-success active:bg-success/90 disabled:bg-muted disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 text-success-foreground animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-success-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render welcome message for analysis mode
  const renderAnalysisWelcome = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* AI Welcome Message */}
        <div className="flex items-start gap-3 mb-6">
          
          <div className="flex-1 text-sm text-foreground leading-relaxed">
            <p className="mb-4">您好，店长！我是理想同学，您的AI销售助手。我可以帮您：</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-info rounded-full shrink-0" />
                分析销售数据，发现异常环节
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-info rounded-full shrink-0" />
                诊断业务问题，定位根本原因
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-info rounded-full shrink-0" />
                提供改进建议，提升转化效率
              </li>
            </ul>
            <p>您可以直接告诉我您想分析什么，或者点击下方话题查看分析示例。</p>
          </div>
        </div>

        {/* Anomaly Alert Topic */}
        <button
          type="button"
          onClick={startAnalysis}
          className="w-full bg-warning-muted border border-warning/30 rounded-xl p-4 text-left active:bg-warning-muted/80 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-warning-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-foreground mb-1">已发现异常：邀约到试驾转化率显著偏低</p>
              <p className="text-xs text-warning-foreground/80 leading-relaxed">
                当前转化率为 <strong>15%</strong>，低于目标值（25%）的 <strong>10个百分点</strong>，也低于行业均值（22%）的 <strong>7个百分点</strong>。该环节被系统标记为高风险环节，建议重点分析原因。
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-warning shrink-0 mt-1" />
          </div>
        </button>
      </div>
    </div>
  );

  // Render analysis thinking process (left panel)
  const renderAnalysisThinking = () => (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className={`${showRightPanel ? 'px-6' : 'max-w-xl mx-auto px-6'} py-6 space-y-4`}>
        {/* User question - natural text, no background */}
        <div className="flex justify-end mb-4">
          <div className="bg-muted rounded-2xl px-4 py-2.5 max-w-[85%]">
            <p className="text-sm text-foreground">
              分析邀约到试驾转化率低的原因（当前15%，目标25%）
            </p>
          </div>
        </div>

        {/* AI Response Area */}
        <div className="flex items-start gap-3">
          
          <div className="flex-1 space-y-4">
            {/* Thinking indicator */}
            {isAnalyzing && !dataModulesComplete && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">思考中...</span>
              </div>
            )}

            {/* Data modules loading */}
            {dataModulesLoading && (
              <div className="bg-info-muted rounded-xl p-4 border border-info/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-info">正在调用系统数据模块</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-info">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>商机状态数据</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-info">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>存量商机数据</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-info">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>通话数据</span>
                  </div>
                </div>
              </div>
            )}

            {/* Data modules complete */}
            {dataModulesComplete && (
              <div className="bg-success-muted rounded-xl p-3 border border-success/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">数据模块调用完成</span>
                </div>
              </div>
            )}

            {/* Thinking steps */}
            {thinkingSteps.length > 0 && (
              <div className="space-y-2">
                {thinkingSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {step.isActive ? (
                      <Loader2 className="w-4 h-4 text-info animate-spin shrink-0" />
                    ) : step.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-muted shrink-0" />
                    )}
                    <span className={`text-sm ${step.isActive ? 'text-info' : step.isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Completion indicator */}
            {analysisComplete && (
              <div className="bg-gradient-to-br from-success-muted to-success-muted/50 rounded-xl p-4 border border-success/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-success">已完成</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-7">分析报告已生成，请在右侧查看完整内容</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Report content lines for line-by-line display
  const reportLines = [
    { type: "title", content: "邀约到试驾转化率分析报告" },
    { type: "h2", content: "一、商机状态更新异常", color: "red" },
    { type: "p", content: "数据支撑：昨日录入 80 个有效邀约商机，按 30% 历史转化规律，今日应产生 24 个试驾转化，实际仅 12 个，缺口 50%。" },
    { type: "p", content: "异常点：4 个高优先级商机未及时更新状态，导致统计偏差 + 跟进滞后：" },
    { type: "li", content: "商机 A-20240501：客户已确认试驾时间（5 月 3 日 14:00）未录入系统" },
    { type: "li", content: "商机 B-20240502：客户取消邀约未标记，仍显示 \"待试驾\"" },
    { type: "li", content: "商机 C-20240503、D-20240504：邀约后未同步客户反馈（客户顾虑提车周期）" },
    { type: "h2", content: "二、商机储备不足", color: "amber" },
    { type: "p", content: "目标测算：本月需完成 100 个试驾量（转化率 25%），按 40% 邀约成功率，需储备「待邀约」商机 400 个。" },
    { type: "p", content: "现状缺口：当前系统「待邀约」存量仅 280 个，缺口 120 个，不足以支撑目标达成。" },
    { type: "conclusion", content: "结论：邀约基数不足，间接拉低转化效率。", color: "amber" },
    { type: "h2", content: "三、邀约通话质量不达标（团队 + 个体双维度）", color: "orange" },
    { type: "h3", content: "团队整体表现：" },
    { type: "li", content: "通次：人均每日 6 通 vs 门店均值 8 通 vs 专家标杆 10 通（频次不足 25%）" },
    { type: "li", content: "通时：单次 1.8 分钟 vs 门店均值 3.2 分钟 vs 专家标杆 4.5 分钟（深度不足 44%）" },
    { type: "h3", content: "个体下钻分析（8 名销售顾问）：" },
    { type: "li-red", content: "通次不足人员：销售顾问张三（日均 3 通）、李四（日均 4 通）" },
    { type: "li-orange", content: "通时不足人员：销售顾问王五（单次 0.9 分钟）、赵六（单次 1.2 分钟）" },
    { type: "li-red", content: "双项不达标人员：孙七（日均 3.5 通 + 单次 1.1 分钟）" },
    { type: "table", content: "sales_table" },
    { type: "conclusion", content: "结论：5 名销售（占比 62.5%）存在通时/通次不足，孙七、张三、王五为重点关注对象。", color: "orange" },
    { type: "h2", content: "四、通话质量核心根源", color: "purple" },
    { type: "h3-red", content: "话术支撑不足（60% 低质量通话）：" },
    { type: "li", content: "缺少「产品核心卖点讲解」（如 L 系列智能驾驶功能、续航优势）" },
    { type: "li", content: "未主动介绍「试驾权益」（免费接送、试驾时长 30 分钟 +、专属顾问陪同）" },
    { type: "li", content: "无法回应客户核心疑问（如 \"充电速度\"\"保养成本\"\"提车周期\"）" },
    { type: "h3-orange", content: "沟通技巧欠缺（30% 低质量通话）：" },
    { type: "li", content: "被动回应客户，未主动挖掘需求（如 \"您更关注空间还是动力？\"）" },
    { type: "li", content: "未明确试驾邀约节点（如 \"明天上午 10 点方便吗？我帮您预留试驾车辆\"）" },
    { type: "li", content: "孙七的通话中该类问题占比达 80%，需重点培训" },
    { type: "h2", content: "五、核心问题汇总与改进建议", color: "emerald" },
    { type: "h3", content: "核心问题（按影响权重排序）：" },
    { type: "li-num", content: "1. 通话质量不达标（权重最高）" },
    { type: "li-num", content: "2. 存量商机储备不足" },
    { type: "li-num", content: "3. 商机状态更新不及时" },
    { type: "advice-title", content: "改进建议：" },
    { type: "advice", content: "针对张三、孙七等人员开展专项话术培训" },
    { type: "advice", content: "制定个体通话通时通次考核标准" },
    { type: "advice", content: "补充存量商机（目标：补齐 120 个缺口）" },
    { type: "advice", content: "建立商机状态日清机制，确保当日更新" },
    { type: "export", content: "导出报告 PDF" },
  ];

  // Render analysis report (right panel) - Line by line display
  const renderAnalysisReport = () => {
    const renderLine = (line: typeof reportLines[0], index: number) => {
      if (index >= visibleLines) return null;
      
      switch (line.type) {
        case "title":
          return <h1 key={index} className="text-xl font-bold text-foreground mb-6 animate-in fade-in duration-200">{line.content}</h1>;
        case "h2":
          return (
            <h2 key={index} className="text-base font-semibold text-foreground mt-6 mb-3 flex items-center gap-2 animate-in fade-in duration-200">
              <span className={`w-1.5 h-1.5 bg-${line.color}-500 rounded-full`} />
              {line.content}
            </h2>
          );
        case "h3":
          return <p key={index} className="font-medium text-foreground mt-3 mb-1 ml-3.5 animate-in fade-in duration-200">{line.content}</p>;
        case "h3-red":
          return <p key={index} className="font-medium text-destructive mt-3 mb-1 ml-3.5 animate-in fade-in duration-200">{line.content}</p>;
        case "h3-orange":
          return <p key={index} className="font-medium text-warning-foreground mt-3 mb-1 ml-3.5 animate-in fade-in duration-200">{line.content}</p>;
        case "p":
          return <p key={index} className="text-sm text-foreground ml-3.5 mb-2 animate-in fade-in duration-200">{line.content}</p>;
        case "li":
          return (
            <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground ml-7 mb-1 animate-in fade-in duration-200">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 shrink-0" />
              {line.content}
            </div>
          );
        case "li-red":
          return (
            <div key={index} className="flex items-start gap-2 text-sm ml-7 mb-1 animate-in fade-in duration-200">
              <span className="w-1 h-1 bg-destructive rounded-full mt-2 shrink-0" />
              <span><span className="text-destructive font-medium">{line.content.split("：")[0]}：</span><span className="text-muted-foreground">{line.content.split("：")[1]}</span></span>
            </div>
          );
        case "li-orange":
          return (
            <div key={index} className="flex items-start gap-2 text-sm ml-7 mb-1 animate-in fade-in duration-200">
              <span className="w-1 h-1 bg-warning rounded-full mt-2 shrink-0" />
              <span><span className="text-warning-foreground font-medium">{line.content.split("：")[0]}：</span><span className="text-muted-foreground">{line.content.split("：")[1]}</span></span>
            </div>
          );
        case "li-num":
          return (
            <div key={index} className="text-sm text-muted-foreground ml-7 mb-1 animate-in fade-in duration-200">
              {line.content}
            </div>
          );
        case "conclusion":
          return (
            <div key={index} className={`bg-${line.color}-50 rounded-lg p-3 border border-${line.color}-100 ml-3.5 mt-2 mb-2 text-sm text-foreground animate-in fade-in duration-200`}>
              <strong>{line.content.split("：")[0]}：</strong>{line.content.split("：")[1]}
            </div>
          );
        case "table":
          return (
            <div key={index} className="overflow-x-auto mt-3 ml-3.5 animate-in fade-in duration-200">
              <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-muted-foreground font-medium">姓名</th>
                    <th className="px-3 py-2 text-left text-muted-foreground font-medium">通次</th>
                    <th className="px-3 py-2 text-left text-muted-foreground font-medium">通时</th>
                    <th className="px-3 py-2 text-left text-muted-foreground font-medium">差距</th>
                    <th className="px-3 py-2 text-left text-muted-foreground font-medium">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {salesData.map((row, i) => (
                    <tr key={i} className="bg-card">
                      <td className="px-3 py-2 text-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.calls}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.duration}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.gap}</td>
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
          );
        case "advice-title":
          return (
            <div key={index} className="bg-success-muted rounded-lg p-4 border border-success/20 ml-3.5 mt-3 animate-in fade-in duration-200">
              <p className="font-medium text-success mb-2">{line.content}</p>
            </div>
          );
        case "advice":
          return (
            <div key={index} className="flex items-start gap-2 text-sm text-foreground ml-7 mb-2 animate-in fade-in duration-200">
              <span className="w-1.5 h-1.5 bg-success rounded-full mt-1.5 shrink-0" />
              {line.content}
            </div>
          );
        case "export":
          return (
            <div key={index} className="pt-4 ml-3.5 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-success text-success-foreground rounded-lg font-medium active:bg-success/90 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                {line.content}
              </button>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Document header toolbar */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">邀约到试驾转化率分析报告</span>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent bg-transparent">
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent bg-transparent">
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent bg-transparent">
              <List className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button type="button" className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent bg-transparent">
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent bg-transparent">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent ml-2 bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document content - Line by line display */}
        <div ref={rightScrollRef} className="flex-1 overflow-y-auto p-6">
          {reportLines.map((line, index) => renderLine(line, index))}
          
          {/* Typing cursor indicator */}
          {visibleLines > 0 && visibleLines < reportLines.length && (
            <span className="inline-block w-2 h-4 bg-info animate-pulse ml-1" />
          )}
        </div>
      </div>
    );
  };

  // Render marketing/acquisition helper welcome
  const renderMarketingWelcome = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* AI Welcome Message */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-info to-info/80 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-info-foreground" />
          </div>
          <div className="flex-1 text-sm text-foreground leading-relaxed">
            <p>您希望我创作哪种类型的营销素材呢</p>
          </div>
        </div>

        {/* Material type options */}
        <div className="flex gap-3 ml-11">
          <button
            type="button"
            onClick={() => handleSelectMaterialType("image")}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl active:bg-accent transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-warning" />
            <span className="text-sm text-foreground">图片素材</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectMaterialType("video")}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl active:bg-accent transition-colors"
          >
            <Video className="w-4 h-4 text-info" />
            <span className="text-sm text-foreground">短视频素材</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render marketing flow (after type selection)
  const renderMarketingFlow = () => (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className={`${showMarketingRightPanel ? 'px-6' : 'max-w-xl mx-auto px-6'} py-6 space-y-4`}>
        {/* Step 1: Type selection result */}
        <div className="flex justify-end mb-4">
          <div className="bg-muted rounded-2xl px-4 py-2.5">
            <p className="text-sm text-foreground">
              {selectedMaterialType === "video" ? "短视频素材" : "图片素材"}
            </p>
          </div>
        </div>

        {/* Step 2: Direction question */}
        {marketingStep !== "selectType" && (
          <div className="flex items-start gap-3">
            <img src="/images/sales-agent-avatar.png" alt="SalesAgent" className="w-8 h-8 object-contain shrink-0" />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-foreground">那么下一步创作哪个方向的营销内容呢</p>
              
              {marketingStep === "selectDirection" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectDirection("种草视频")}
                    className="px-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground active:bg-accent transition-colors"
                  >
                    种草视频
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDirection("新车型亮点宣传")}
                    className="px-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground active:bg-accent transition-colors"
                  >
                    新车型亮点宣传
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDirection("促销政策")}
                    className="px-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground active:bg-accent transition-colors"
                  >
                    促销政策
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: User selected direction */}
        {selectedDirection && (
          <div className="flex justify-end">
            <div className="bg-muted rounded-2xl px-4 py-2.5">
              <p className="text-sm text-foreground">{selectedDirection}</p>
            </div>
          </div>
        )}

        {/* Step 4: Loading library */}
        {marketingStep === "showLibrary" && !marketingLibraryLoaded && (
          <div className="flex items-start gap-3">
            <img src="/images/sales-agent-avatar.png" alt="SalesAgent" className="w-8 h-8 object-contain shrink-0" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">检索内容库素材内容...</span>
            </div>
          </div>
        )}

        {/* Step 5: Ask recreate */}
        {(marketingStep === "askRecreate" || marketingStep === "generating" || marketingStep === "complete") && (
          <div className="flex items-start gap-3">
            <img src="/images/sales-agent-avatar.png" alt="SalesAgent" className="w-8 h-8 object-contain shrink-0" />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-foreground">下一步是否为您重新创作？</p>
              {marketingStep === "askRecreate" && (
                <button
                  type="button"
                  onClick={handleRecreateConfirm}
                  className="px-4 py-2 bg-success text-success-foreground rounded-xl text-sm font-medium active:bg-success/90 transition-colors"
                >
                  好的
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 6: User confirmed */}
        {(marketingStep === "generating" || marketingStep === "complete") && (
          <div className="flex justify-end">
            <div className="bg-muted rounded-2xl px-4 py-2.5">
              <p className="text-sm text-foreground">好的</p>
            </div>
          </div>
        )}

        {/* Step 7: Generating - LLM style text generation */}
        {marketingStep === "generating" && (
          <div className="flex items-start gap-3">
            <img src="/images/sales-agent-avatar.png" alt="SalesAgent" className="w-8 h-8 object-contain shrink-0" />
            <div className="flex-1">
              <div className="text-sm text-foreground leading-relaxed">
                <p className="mb-2">正在为您生成视频内容...</p>
                <div className="space-y-1.5 text-muted-foreground">
                  {videoGenerationProgress >= 10 && (
                    <p className="animate-in fade-in duration-300">- 分析种草视频风格特征</p>
                  )}
                  {videoGenerationProgress >= 30 && (
                    <p className="animate-in fade-in duration-300">- 匹配理想i6产品亮点</p>
                  )}
                  {videoGenerationProgress >= 50 && (
                    <p className="animate-in fade-in duration-300">- 生成视频脚本和画面</p>
                  )}
                  {videoGenerationProgress >= 70 && (
                    <p className="animate-in fade-in duration-300">- 合成视频素材</p>
                  )}
                  {videoGenerationProgress >= 90 && (
                    <p className="animate-in fade-in duration-300">- 优化输出质量</p>
                  )}
                </div>
                {videoGenerationProgress < 100 && (
                  <span className="inline-block w-2 h-4 bg-info animate-pulse ml-1 mt-2" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Complete */}
        {marketingStep === "complete" && (
          <div className="flex items-start gap-3">
            <img src="/images/sales-agent-avatar.png" alt="SalesAgent" className="w-8 h-8 object-contain shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="bg-gradient-to-br from-success-muted to-success-muted/50 rounded-xl p-4 border border-success/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-success">视频生成完成</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-7">请在右侧查看生成的视频内容</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render marketing right panel (library videos / generated video)
  const renderMarketingRightPanel = () => {
    return (
      <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {videoGenerationComplete ? "生成结果" : "内容库素材"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:bg-accent bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!videoGenerationComplete ? (
            <>
              {/* Library loading */}
              {!marketingLibraryLoaded && (
                <div className="flex items-center justify-center h-40">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">检索内容库素材内容...</span>
                  </div>
                </div>
              )}

              {/* Library videos */}
              {marketingLibraryLoaded && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <p className="text-sm text-foreground">为您找到以下热门素材：</p>
                  
                  {/* Video thumbnails */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { title: "面对冰雪路面方向盘自己会修正是种什么体验", duration: "00:02:18", views: "18.6万", image: "/images/11.jpg" },
                      { title: "理想i8超长3米侧气帘，给你满舱安全底气", duration: "00:01:52", views: "12.3万", image: "/images/44.jpg" },
                      { title: "牙克石-30°C实测,这台车空调不止是快", duration: "00:03:05", views: "25.1万", image: "/images/55.jpg" },
                    ].map((video, index) => (
                      <div key={index} className="bg-muted rounded-xl overflow-hidden">
                        <div className="relative aspect-[9/16]">
                          <img 
                            src={video.image || "/placeholder.svg"} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <div className="w-10 h-10 bg-card/90 rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-5 h-5 text-foreground ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{video.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{video.views} 播放</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Generated video result */
            <div className="space-y-4 animate-in fade-in duration-500">
              <p className="text-sm text-foreground">视频已生成完成：</p>
              
              {/* Final video preview - using 66.jpg */}
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="relative">
                  <img 
                    src="/images/66.jpg" 
                    alt="全网最详细理想i6评测视频" 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="w-16 h-16 bg-card/95 rounded-full flex items-center justify-center shadow-xl">
                      <Play className="w-8 h-8 text-foreground ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    00:03:50
                  </div>
                  {/* New badge */}
                  <div className="absolute top-3 left-3 bg-success text-success-foreground text-[10px] font-medium px-2 py-1 rounded">
                    AI 生成
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-foreground mb-1">全网最详细理想i6评测</h4>
                  <p className="text-sm text-muted-foreground">种草视频 · 刚刚生成</p>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={handleDownloadVideo}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-success text-success-foreground rounded-lg text-sm font-medium active:bg-success/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载视频
                    </button>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium active:bg-accent transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      分享
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render default welcome (no mode selected)
  const renderDefaultWelcome = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-info to-info/80 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-info-foreground" />
          </div>
          <div className="flex-1 text-sm text-foreground leading-relaxed">
            <p className="mb-4">您好，店长！我是 SalesAgent，您的AI销售助手。</p>
            <p>请选择您想要使用的功能，或直接输入问题开始对话。</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={() => setMode("analysis")}
            className="flex items-center gap-3 p-4 bg-success-muted border border-success/30 rounded-xl active:bg-success-muted/80 transition-colors text-left"
          >
            <BarChart3 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-foreground">业务诊断</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 p-4 bg-info-muted border border-info/30 rounded-xl active:bg-info-muted/80 transition-colors text-left"
          >
            <User className="w-5 h-5 text-info" />
            <span className="text-sm font-medium text-foreground">客户顾问</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("acquisitionHelper")}
            className="flex items-center gap-3 p-4 bg-warning-muted border border-warning/30 rounded-xl active:bg-warning-muted/80 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-warning-foreground" />
            <span className="text-sm font-medium text-foreground">获客助手</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl active:bg-destructive/20 transition-colors text-left"
          >
            <Target className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-foreground">帮我干活</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      {/* Fixed size container: 1194 x 834 */}
      <div 
        className="bg-card rounded-2xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        style={{ width: '1194px', height: '834px' }}
      >
        {/* Left Navigation Sidebar - White background matching content */}
        <div className="w-14 bg-card border-r border-border flex flex-col items-center py-4 gap-1 shrink-0">
          {/* Avatar */}
          <button
            type="button"
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center">
              <span className="text-success-foreground text-xs font-semibold">店</span>
            </div>
          </button>
          
          {/* Workbench - returns to homepage */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground active:bg-accent transition-colors"
            title="工作台"
          >
            <Home className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          {/* Diagnosis */}
          <button
            type="button"
            onClick={() => setMode("analysis")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              mode === "analysis" ? "bg-success-muted text-success" : "text-muted-foreground active:bg-accent"
            }`}
            title="诊断看板"
          >
            <BarChart3 className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          {/* Task List */}
          <button
            type="button"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground active:bg-accent transition-colors"
            title="任务列表"
          >
            <ListTodo className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          {/* Customer List */}
          <button
            type="button"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground active:bg-accent transition-colors"
            title="客户列表"
          >
            <Users className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          {/* Content Library */}
          <button
            type="button"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground active:bg-accent transition-colors"
            title="内容库"
          >
            <FolderOpen className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          {/* Toolbox */}
          <button
            type="button"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground active:bg-accent transition-colors"
            title="工具箱"
          >
            <Wrench className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex bg-card relative">
          {/* Close button - top right corner */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors bg-transparent"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Chat Panel - Dynamic width */}
          <div className={`flex flex-col transition-all duration-500 ease-in-out ${(showRightPanel || showMarketingRightPanel) ? 'w-[420px] border-r border-border' : 'flex-1'}`}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <img src="/images/sales-agent-avatar.png" alt="SalesAgent" className="w-6 h-6 object-contain" />
                <span className="text-sm font-semibold text-foreground">SalesAgent</span>
              </div>
              {!showWelcome && (
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="text-xs text-muted-foreground active:text-foreground"
                >
                  开启新话题
                </button>
              )}
            </div>

            {/* Content */}
            {mode === "default" && showWelcome && renderDefaultWelcome()}
            {mode === "analysis" && showWelcome && renderAnalysisWelcome()}
            {mode === "analysis" && !showWelcome && renderAnalysisThinking()}
            {mode === "acquisitionHelper" && showWelcome && renderMarketingWelcome()}
            {mode === "acquisitionHelper" && !showWelcome && renderMarketingFlow()}

            {/* Input Area - Fixed at bottom center */}
            <div className={`shrink-0 ${(showRightPanel || showMarketingRightPanel) ? '' : 'max-w-xl mx-auto w-full'}`}>
              {renderInputArea()}
            </div>
          </div>

          {/* Right Panel - Slide in when analysis complete */}
          {showRightPanel && (
            <div className="flex-1 p-4 bg-muted animate-in slide-in-from-right duration-500">
              {renderAnalysisReport()}
            </div>
          )}

          {/* Right Panel - Marketing content */}
          {showMarketingRightPanel && (
            <div className="flex-1 p-4 bg-muted animate-in slide-in-from-right duration-500">
              {renderMarketingRightPanel()}
            </div>
          )}
        </div>
      </div>

      {/* Download success alert toast */}
      {downloadAlert.show && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm">{downloadAlert.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
