"use client";

interface CustomerItemProps {
  name: string;
  phone: string;
  lastFollowUp: string;
  tags: { label: string; variant: "danger" | "warning" | "info" | "outline" }[];
  isHighIntent?: boolean;
  onClick?: () => void;
}

function CustomerItem({
  name,
  phone,
  lastFollowUp,
  tags,
  isHighIntent,
  onClick,
}: CustomerItemProps) {
  const getTagStyles = (variant: string) => {
    switch (variant) {
      case "danger":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "info":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div
      className="p-4 border-b border-gray-100 last:border-b-0 active:bg-gray-50/50 transition-colors cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-base font-semibold text-gray-800">{name}</span>
        {isHighIntent && (
          <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-medium rounded-lg">
            高意向
          </span>
        )}
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          客户跟进任务 <span className="text-emerald-600">Top 5</span>
        </h3>
        <button
          type="button"
          className="text-sm text-emerald-600 active:text-emerald-700"
        >
          全部任务
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {topCustomers.map((customer) => (
          <CustomerItem
            key={customer.id}
            {...customer}
            onClick={() => onCustomerClick?.(customer.id)}
          />
        ))}
      </div>
    </div>
  );
}
