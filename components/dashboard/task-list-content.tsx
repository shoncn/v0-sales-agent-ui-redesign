"use client";

import { useState } from "react";
import { MessageSquare, Filter, Pin, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  name: string;
  statusTag: string;
  secondaryTag?: string;
  lastContact: string;
  status: string;
  redTags?: string[];
  whiteTags: string[];
  onConsultantClick: () => void;
  onFollowUpClick: () => void;
  onWeChatClick: () => void;
}

function TaskCard({
  name,
  statusTag,
  secondaryTag,
  lastContact,
  status,
  redTags = [],
  whiteTags,
  onConsultantClick,
  onFollowUpClick,
  onWeChatClick,
}: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-gray-800 text-sm">{name}</span>
          {statusTag && (
            <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[9px] rounded-full font-medium">
              {statusTag}
            </span>
          )}
          {secondaryTag && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] rounded-full border border-gray-200">
              {secondaryTag}
            </span>
          )}
        </div>
      </div>

      {/* Last Contact */}
      <p className="text-[10px] text-gray-500 mb-2">
        最后沟通：{lastContact} | {status}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {redTags.map((tag, i) => (
          <span
            key={`red-${i}`}
            className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[9px] rounded-md border border-rose-200"
          >
            {tag}
          </span>
        ))}
        {whiteTags.map((tag, i) => (
          <span
            key={`white-${i}`}
            className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[9px] rounded-md border border-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={onConsultantClick}
          className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] rounded-md border border-emerald-200 transition-colors"
        >
          <MessageSquare className="w-3 h-3" />
          顾问助手
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onFollowUpClick}
            className="flex-1 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] rounded-md border border-emerald-200 transition-colors"
          >
            写跟进
          </button>
          <button
            type="button"
            onClick={onWeChatClick}
            className="flex-1 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] rounded-md border border-emerald-200 transition-colors"
          >
            发企微
          </button>
        </div>
      </div>
    </div>
  );
}

interface TaskListContentProps {
  onConsultantClick: (customerName: string) => void;
  onActionClick: (customerName: string, action: "followUp" | "weChat") => void;
}

export function TaskListContent({ onConsultantClick, onActionClick }: TaskListContentProps) {
  const [activeTab, setActiveTab] = useState<"today" | "overdue" | "future">("today");

  const swimlanes = [
    {
      title: "试驾前",
      count: 4,
      tasks: [
        {
          name: "王先生",
          statusTag: "高意向",
          secondaryTag: "首次邀约",
          lastContact: "1天前",
          status: "待邀约",
          redTags: ["理想i6", "夜间活跃"],
          whiteTags: ["35-40岁", "爱好运动", "金融敏感", "高学历", "高收入", "科技尝鲜"],
        },
        {
          name: "王先生",
          statusTag: "高意向",
          secondaryTag: "上级下发",
          lastContact: "2天前",
          status: "试驾邀约中",
          redTags: [],
          whiteTags: ["参数党", "30-35岁", "问界m7", "华为手机", "20-30万"],
        },
        {
          name: "王先生",
          statusTag: "高意向",
          secondaryTag: "试驾确认",
          lastContact: "1天前",
          status: "已排程",
          redTags: ["抖音直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "爱好运动"],
        },
        {
          name: "王先生",
          statusTag: "",
          secondaryTag: "试驾邀约",
          lastContact: "1天前",
          status: "试驾邀约中",
          redTags: ["抖音直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "爱好运动"],
        },
      ],
    },
    {
      title: "试驾后",
      count: 2,
      tasks: [
        {
          name: "王先生",
          statusTag: "高意向",
          secondaryTag: "试驾接待",
          lastContact: "1天前",
          status: "3天内试驾",
          redTags: ["抖音直播"],
          whiteTags: ["夜间活跃", "35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
        {
          name: "王先生",
          statusTag: "高意向",
          secondaryTag: "试驾回访",
          lastContact: "1天前",
          status: "已试驾",
          redTags: ["抖音直播"],
          whiteTags: ["夜间活跃", "35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
      ],
    },
    {
      title: "车主",
      count: 2,
      tasks: [
        {
          name: "王先生",
          statusTag: "",
          secondaryTag: "养喜提车",
          lastContact: "1天前",
          status: "已交付",
          redTags: ["抖音直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
        {
          name: "王先生",
          statusTag: "",
          secondaryTag: "生日祝福",
          lastContact: "1天前",
          status: "待交付",
          redTags: ["抖音直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
      ],
    },
    {
      title: "战败",
      count: 10,
      tasks: [
        {
          name: "王先生",
          statusTag: "",
          secondaryTag: "战败激活",
          lastContact: "30天前",
          status: "待激活",
          redTags: ["抖音直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
        {
          name: "王先生",
          statusTag: "",
          secondaryTag: "战败激活",
          lastContact: "30天前",
          status: "待激活",
          redTags: ["科普直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
        {
          name: "王先生",
          statusTag: "",
          secondaryTag: "战败激活",
          lastContact: "30天前",
          status: "待激活",
          redTags: ["科普直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
        {
          name: "王先生",
          statusTag: "",
          secondaryTag: "战败激活",
          lastContact: "30天前",
          status: "待激活",
          redTags: ["科普直播", "夜间活跃"],
          whiteTags: ["35-40岁", "高学历", "高收入", "科技尝鲜"],
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          {/* Task Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("today")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "today"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              今日任务 <span className="text-emerald-400">1</span>/57
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overdue")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "overdue"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              逾期任务 <span className="text-gray-400">289</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("future")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "future"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              未来任务 <span className="text-gray-400">173</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
              <Pin className="w-4 h-4" />
              仅看置顶
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
              <List className="w-4 h-4" />
              按列表查看
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Swimlanes */}
      <div className="flex-1 p-3 overflow-x-auto">
        <div className="flex gap-2 h-full min-w-max">
          {swimlanes.map((lane, laneIndex) => (
            <div key={laneIndex} className="w-56 flex flex-col bg-gray-50 rounded-xl shrink-0">
              {/* Lane Header */}
              <div className="px-3 py-2 border-b border-gray-200 shrink-0">
                <h3 className="font-semibold text-gray-800 text-sm">
                  {lane.title} <span className="text-gray-400 font-normal">{lane.count}</span>
                </h3>
              </div>

              {/* Lane Content */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {lane.tasks.map((task, taskIndex) => (
                  <TaskCard
                    key={taskIndex}
                    {...task}
                    onConsultantClick={() => onConsultantClick(task.name)}
                    onFollowUpClick={() => onActionClick(task.name, "followUp")}
                    onWeChatClick={() => onActionClick(task.name, "weChat")}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
