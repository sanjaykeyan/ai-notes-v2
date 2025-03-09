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
        header: "text-blue-700 dark:text-blue-300",
        icon: "text-blue-600 dark:text-blue-400",
        count: "bg-blue-50 text-blue-600 dark:bg-blue-700 dark:text-blue-200",
        item: "bg-blue-50/50 text-blue-700 border border-blue-100 dark:bg-blue-800 dark:text-blue-300 dark:border-blue-600",
      },
    },
    {
      title: "Metrics & Numbers",
      icon: <ChartBarIcon className="h-4 w-4" />,
      items: data.metrics || [],
      emptyText: "No metrics found",
      colors: {
        header: "text-emerald-700 dark:text-emerald-300",
        icon: "text-emerald-600 dark:text-emerald-400",
        count: "bg-emerald-50 text-emerald-600 dark:bg-emerald-700 dark:text-emerald-200",
        item: "bg-emerald-50/50 text-emerald-700 border border-emerald-100 dark:bg-emerald-800 dark:text-emerald-300 dark:border-emerald-600",
      },
    },
    {
      title: "Tasks & Action Items",
      icon: <CheckCircleIcon className="h-4 w-4" />,
      items: data.tasks || [],
      emptyText: "No tasks identified",
      colors: {
        header: "text-purple-700 dark:text-purple-300",
        icon: "text-purple-600 dark:text-purple-400",
        count: "bg-purple-50 text-purple-600 dark:bg-purple-700 dark:text-purple-200",
        item: "bg-purple-50/50 text-purple-700 border border-purple-100 dark:bg-purple-800 dark:text-purple-300 dark:border-purple-600",
      },
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
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
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600">
                      <span className="text-xs font-medium text-blue-50">{index + 1}</span>
                    </div>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic pl-1">
              {section.emptyText}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
