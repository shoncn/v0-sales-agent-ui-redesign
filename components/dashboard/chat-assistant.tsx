"use client";

import React from "react"

import { Send, Loader2, Database, Phone, Users, FileText, Download, AlertCircle, BarChart3, User, Target, Sparkles, Plus, Mic, ThumbsUp, ThumbsDown, Share2, RefreshCw, X, Upload, ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type AssistantMode = "default" | "analysis" | "customerProfile" | "actionStrategy" | "businessDiagnosis" | "marketingMaterial";

interface AnalysisStep {
  id: string;
  type: 'thinking' | 'data_loading' | 'analysis' | 'table' | 'chart' | 'conclusion' | 'report';
  title?: string;
  content?: string;
  data?: unknown;
  isComplete: boolean;
}

// Marketing material conversation step
type MarketingStep = 
  | "selectType" 
  | "selectDirection" 
  | "showLibraryImage" 
  | "uploadImage" 
  | "showGeneratedImage"
  | "shareOptions";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Marketing material flow state
  const [marketingStep, setMarketingStep] = useState<MarketingStep>("selectType");
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

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

  const enterMarketingMaterial = () => {
    setCurrentMode("marketingMaterial");
    setMarketingStep("selectType");
    setUploadedImage(null);
    setLiked(false);
    setDisliked(false);
  };

  const resetToDefault = () => {
    setCurrentMode("default");
    setShowInitial(true);
    setCurrentSteps([]);
    setCurrentStepIndex(-1);
    setIsAnalyzing(false);
    setMessage("");
    setMarketingStep("selectType");
    setShowSharePopup(false);
    setUploadedImage(null);
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
  }, [currentSteps, currentMode, marketingStep]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setMarketingStep("showGeneratedImage");
      };
      reader.readAsDataURL(file);
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
        <button type="button" className="flex-1 px-4 py-3 bg-emerald-500 active:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors">
          一键发送至企微
        </button>
        <button 
          type="button" 
          onClick={enterMarketingMaterial}
          className="flex-1 px-4 py-3 bg-blue-500 active:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          生成营销素材
        </button>
        <button type="button" className="px-4 py-3 bg-gray-100 active:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors border border-gray-200">
          编辑
        </button>
      </div>
    </div>
  );

  // Marketing Material Conversation Flow - LLM Style
  const renderMarketingMaterialView = () => (
    <div className="p-6 space-y-4">
      {/* Step 1: AI asks for type */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-gray-800">素材类型选择</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-4">您希望我为<strong className="text-gray-800">{customerName}</strong>创作哪种类型的营销素材呢？</p>
          
          {marketingStep === "selectType" && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMarketingStep("selectDirection")}
                className="flex-1 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium active:bg-emerald-100 transition-colors"
              >
                图片素材
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium active:bg-gray-100 transition-colors"
              >
                短视频素材
              </button>
            </div>
          )}
          {marketingStep !== "selectType" && (
            <div className="inline-flex px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
              已选择：图片素材
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Select Direction */}
      {(marketingStep === "selectDirection" || marketingStep === "showLibraryImage" || marketingStep === "uploadImage" || marketingStep === "showGeneratedImage") && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-800">创作方向</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700 mb-4">那么下一步创作哪个方向的营销内容呢？</p>
            
            {marketingStep === "selectDirection" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMarketingStep("showLibraryImage")}
                  className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium active:bg-emerald-100 transition-colors"
                >
                  种草图片
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium active:bg-gray-100 transition-colors"
                >
                  新车型亮点宣传
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium active:bg-gray-100 transition-colors"
                >
                  促销政策
                </button>
              </div>
            )}
            {marketingStep !== "selectDirection" && marketingStep !== "selectType" && (
              <div className="inline-flex px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">
                已选择：种草图片
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Show Library Image */}
      {(marketingStep === "showLibraryImage" || marketingStep === "uploadImage" || marketingStep === "showGeneratedImage") && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-gray-800">素材库检索</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-700">已为您检索到<strong className="text-gray-800">L9</strong>的素材库图片，是否直接使用？</p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img 
                src="/images/l9-showroom.jpg" 
                alt="理想L9展厅图" 
                className="w-full h-36 object-cover"
              />
            </div>
            
            {marketingStep === "showLibraryImage" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium active:bg-gray-100 transition-colors"
                >
                  好的，直接使用
                </button>
                <button
                  type="button"
                  onClick={() => setMarketingStep("uploadImage")}
                  className="flex-1 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium active:bg-emerald-100 transition-colors"
                >
                  不，新创建生成
                </button>
              </div>
            )}
            {(marketingStep === "uploadImage" || marketingStep === "showGeneratedImage") && (
              <div className="inline-flex px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">
                已选择：新创建生成
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Upload Image */}
      {(marketingStep === "uploadImage" || marketingStep === "showGeneratedImage") && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-medium active:bg-gray-100 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  点击上传图片
                </button>
              </>
            )}
            {marketingStep === "showGeneratedImage" && uploadedImage && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img 
                  src={uploadedImage || "/placeholder.svg"} 
                  alt="用户上传的图片" 
                  className="w-full h-28 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Show Generated Image */}
      {marketingStep === "showGeneratedImage" && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-3 bg-emerald-100/50 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">AI创作完成</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-sm text-gray-700 leading-relaxed">
              <p>根据您提供的<strong className="text-gray-800">{customerName}</strong>的信息结合家庭属性：</p>
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
            <div className="rounded-xl overflow-hidden border border-emerald-200 bg-white">
              <img 
                src="/images/l9-family.jpg" 
                alt="生成的营销图片" 
                className="w-full h-44 object-cover"
              />
              {/* Action buttons */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => { setLiked(!liked); setDisliked(false); }}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${liked ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 active:bg-gray-100'}`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDisliked(!disliked); setLiked(false); }}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${disliked ? 'bg-red-100 text-red-600' : 'text-gray-400 active:bg-gray-100'}`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowSharePopup(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 active:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 active:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowSharePopup(false)}>
          <div className="bg-white rounded-2xl p-5 w-72 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">分享至</h3>
              <button
                type="button"
                onClick={() => setShowSharePopup(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 active:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowSharePopup(false)}
                className="w-full flex items-center gap-3 px-4 py-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium active:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                企业微信
              </button>
              <button
                type="button"
                onClick={() => setShowSharePopup(false)}
                className="w-full flex items-center gap-3 px-4 py-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-medium active:bg-blue-100 transition-colors"
              >
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

  // Default LLM Style View
  const renderDefaultView = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10">
      {/* Logo/Avatar */}
      <div className="w-14 h-14 mb-5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
        <Sparkles className="w-7 h-7 text-white" />
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">Sales Agent</h2>
      <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
        AI销售专家，帮您分析业务数据、管理客户、提升销售效率
      </p>

      {/* Quick Action Chips */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={enterBusinessDiagnosis}
          className="flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl active:border-emerald-300 active:bg-emerald-50 transition-all text-left"
        >
          <BarChart3 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-sm text-gray-700">业务诊断</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl active:border-blue-300 active:bg-blue-50 transition-all text-left"
        >
          <User className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-sm text-gray-700">客户顾问</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl active:border-amber-300 active:bg-amber-50 transition-all text-left"
        >
          <Users className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="text-sm text-gray-700">获客助手</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl active:border-rose-300 active:bg-rose-50 transition-all text-left"
        >
          <Target className="w-5 h-5 text-rose-500 shrink-0" />
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
            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 active:border-emerald-300 active:bg-emerald-50/50 transition-all"
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 active:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
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
    <aside className="w-[330px] bg-white flex flex-col shrink-0 border-l border-gray-200">
      {/* Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {currentMode === "default" && showInitial && renderDefaultView()}
        {currentMode === "businessDiagnosis" && renderBusinessDiagnosisView()}
        {currentMode === "analysis" && renderAnalysisView()}
        {currentMode === "customerProfile" && renderCustomerProfile()}
        {currentMode === "actionStrategy" && renderActionStrategy()}
        {currentMode === "marketingMaterial" && renderMarketingMaterialView()}
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
              onClick={() => message.trim() && startAnalysis(message)}
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
    </aside>
  );
}
