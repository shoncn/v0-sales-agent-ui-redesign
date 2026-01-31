"use client";

interface TodoItemProps {
  name: string;
  phone: string;
  timeLabel?: string;
  timeValue?: string;
  tags: { label: string; variant: "danger" | "warning" | "info" | "outline" }[];
  actionLabel?: string;
  actionType?: "primary" | "warning" | "info";
  carLabels?: string[];
  lastFollowUp?: string;
}

function TodoItem({
  name,
  phone,
  timeLabel,
  timeValue,
  tags,
  actionLabel,
  actionType = "primary",
  carLabels,
  lastFollowUp,
}: TodoItemProps) {
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

  const getActionStyles = (type: string) => {
    switch (type) {
      case "primary":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="text-base font-semibold text-gray-800">{name}</span>
        {actionLabel && (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-lg border ${getActionStyles(actionType)}`}
          >
            {actionLabel}
          </span>
        )}
      </div>

      <div className="space-y-1 text-sm text-gray-500 mb-3">
        <div>客户手机: {phone}</div>
        {timeLabel && timeValue && <div>{timeLabel}: {timeValue}</div>}
        {carLabels && carLabels.length > 0 && (
          <div className="flex items-center gap-2">
            <span>车主标签:</span>
            {carLabels.map((label, index) => (
              <span key={index} className="text-emerald-600 font-medium">
                {label}
              </span>
            ))}
          </div>
        )}
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

export function TodoList() {
  const todos = [
    {
      name: "刘女士",
      phone: "1397****2950",
      timeLabel: "预约试驾时间",
      timeValue: "2025-06-28 14:00",
      actionLabel: "试驾排程",
      actionType: "primary" as const,
      tags: [
        { label: "待跟进", variant: "danger" as const },
        { label: "保存心愿单", variant: "info" as const },
        { label: "预算20～30万", variant: "info" as const },
      ],
    },
    {
      name: "董明",
      phone: "1397****2950",
      timeLabel: "上次活跃时间",
      timeValue: "2025-06-28",
      actionLabel: "战败激活",
      actionType: "warning" as const,
      tags: [
        { label: "保存心愿单", variant: "info" as const },
        { label: "3月4日已试驾", variant: "info" as const },
        { label: "对比问界M7", variant: "outline" as const },
      ],
    },
    {
      name: "于浩天",
      phone: "1397****2950",
      actionLabel: "车主任务",
      actionType: "info" as const,
      carLabels: ["理想L6", "理想L8"],
      tags: [
        { label: "保存心愿单", variant: "info" as const },
        { label: "3月4日已试驾", variant: "info" as const },
        { label: "对比问界M7", variant: "outline" as const },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">
          待办事项 <span className="text-emerald-600">3</span>
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {todos.map((todo, index) => (
          <TodoItem key={index} {...todo} />
        ))}
      </div>
    </div>
  );
}
