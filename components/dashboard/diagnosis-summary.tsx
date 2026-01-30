"use client";

const summaryItems = [
  {
    id: 1,
    text: '锁单量10单距目标14单差4单（缺口29%），需从试驾后42位客户中锁3单，报价中6位高意向客户锁1单。',
    highlight: false,
  },
  {
    id: 2,
    text: '试驾-锁单转化率23.8%距城市基线30%差6.2%，试驾后24h内必回访（当前62%），报价借鉴3套话术。',
    highlight: false,
  },
  {
    id: 3,
    text: '邀约量82距目标100差18个，重点邀约试驾后7天内28位未试驾客户，话术突出"限时名额"和"专属礼品"。',
    highlight: true,
  },
];

export function DiagnosisSummary() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="space-y-3">
        {summaryItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
              item.highlight 
                ? 'bg-emerald-50 border border-emerald-100' 
                : 'bg-gray-50 border border-transparent'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              item.highlight 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-300 text-white'
            }`}>
              {item.id}
            </div>
            <p className={`text-sm leading-relaxed ${
              item.highlight ? 'text-emerald-800' : 'text-gray-600'
            }`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
