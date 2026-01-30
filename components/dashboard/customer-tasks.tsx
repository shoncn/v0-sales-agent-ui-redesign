"use client";

import { MessageCircle } from "lucide-react";

interface CustomerCardProps {
  name: string;
  phone: string;
  lastFollowUp: string;
  tags: { label: string; variant: "danger" | "warning" | "info" | "outline" }[];
  isHighIntent?: boolean;
  onClick?: () => void;
}

function CustomerCard({
  name,
  phone,
  lastFollowUp,
  tags,
  isHighIntent,
  onClick,
}: CustomerCardProps) {
  const getTagStyles = (variant: string) => {
    switch (variant) {
      case "danger":
        return "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
      case "info":
        return "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100";
    }
  };

  return (
    <div
      className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-800">{name}</span>
          {isHighIntent && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-medium rounded-full">
              高意向
            </span>
          )}
        </div>
        <button
          type="button"
          className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="space-y-1 text-sm text-gray-500 mb-3">
        <div>客户手机: {phone}</div>
        <div>上次跟进时间: {lastFollowUp}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getTagStyles(tag.variant)}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface CustomerTasksProps {
  onCustomerClick?: (customerId: string) => void;
}

export function CustomerTasks({ onCustomerClick }: CustomerTasksProps) {
  const topCustomers = [
    {
      id: "wang",
      name: "王先生",
      phone: "166****1234",
      lastFollowUp: "2025-11-30",
      isHighIntent: true,
      tags: [
        { label: "心愿单", variant: "info" as const },
        { label: "预算30~50w", variant: "warning" as const },
        { label: "二胎家庭", variant: "danger" as const },
        { label: "现有车: 宝马X5", variant: "outline" as const },
        { label: "对比: 问界M9", variant: "outline" as const },
      ],
    },
    {
      id: "li",
      name: "李丽",
      phone: "1397****2950",
      lastFollowUp: "2025-06-28",
      isHighIntent: true,
      tags: [
        { label: "三天锁单", variant: "danger" as const },
        { label: "小订付款", variant: "warning" as const },
        { label: "保存心愿单", variant: "info" as const },
        { label: "3月4日已试驾", variant: "info" as const },
        { label: "对比问界M7", variant: "outline" as const },
        { label: "公户购车人", variant: "outline" as const },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        客户跟进任务 Top 5
      </h3>

      <div className="space-y-4">
        {topCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            {...customer}
            onClick={() => onCustomerClick?.(customer.id)}
          />
        ))}
      </div>
    </div>
  );
}
