import {
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface SmartFilterData {
  dates: string[];
  metrics: string[];
  tasks: string[];
}

interface SmartFilterDisplayProps {
  data: SmartFilterData;
}

export default function SmartFilterDisplay({ data }: SmartFilterDisplayProps) {
  const sections = [
    {
      title: "Dates Mentioned",
      icon: <CalendarIcon className="h-4 w-4" />,
      items: data.dates || [],
      emptyText: "No dates mentioned",
      colors: {
        header: "text-blue-700",
        icon: "text-blue-600",
        count: "bg-blue-50 text-blue-600",
        item: "bg-blue-50/50 text-blue-700 border border-blue-100",
      },
    },
    {
      title: "Metrics & Numbers",
      icon: <ChartBarIcon className="h-4 w-4" />,
      items: data.metrics || [],
      emptyText: "No metrics found",
      colors: {
        header: "text-emerald-700",
        icon: "text-emerald-600",
        count: "bg-emerald-50 text-emerald-600",
        item: "bg-emerald-50/50 text-emerald-700 border border-emerald-100",
      },
    },
    {
      title: "Tasks & Action Items",
      icon: <CheckCircleIcon className="h-4 w-4" />,
      items: data.tasks || [],
      emptyText: "No tasks identified",
      colors: {
        header: "text-purple-700",
        icon: "text-purple-600",
        count: "bg-purple-50 text-purple-600",
        item: "bg-purple-50/50 text-purple-700 border border-purple-100",
      },
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className={section.colors.icon}>{section.icon}</span>
            <h3 className={`text-sm font-semibold uppercase tracking-wide ${section.colors.header}`}>
              {section.title}
            </h3>
            <span className={`text-xs font-medium ml-auto px-2 py-0.5 rounded-full ${section.colors.count}`}>
              {section.items.length}
            </span>
          </div>
          {section.items.length > 0 ? (
            <ul className="space-y-1.5">
              {section.items.map((item, index) => (
                <li
                  key={index}
                  className={`text-[14px] leading-relaxed px-3 py-2 rounded-md ${section.colors.item}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic pl-1">
              {section.emptyText}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
