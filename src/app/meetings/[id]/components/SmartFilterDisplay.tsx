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
      icon: <CalendarIcon className="h-5 w-5" />,
      items: data.dates || [],
      emptyText: "No dates mentioned",
    },
    {
      title: "Metrics & Numbers",
      icon: <ChartBarIcon className="h-5 w-5" />,
      items: data.metrics || [],
      emptyText: "No metrics found",
    },
    {
      title: "Tasks & Action Items",
      icon: <CheckCircleIcon className="h-5 w-5" />,
      items: data.tasks || [],
      emptyText: "No tasks identified",
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            {section.icon}
            <h3 className="font-medium">{section.title}</h3>
            <span className="text-sm text-gray-500 ml-auto">
              ({section.items.length})
            </span>
          </div>
          {section.items.length > 0 ? (
            <ul className="space-y-2">
              {section.items.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">{section.emptyText}</p>
          )}
        </div>
      ))}
    </div>
  );
}
