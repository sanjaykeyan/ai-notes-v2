import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface DashboardButtonProps {
  Icon: LucideIcon;
  label: string;
  href: string;
  id?: string;
  dataType?: string;
  beta?: boolean;
  iconColor?: string;
}

export default function DashboardButton({
  Icon,
  label,
  href,
  id,
  dataType,
  beta,
  iconColor = "text-gray-700",
}: DashboardButtonProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
      id={id}
      data-type={dataType}
    >
      <div className="flex items-center justify-center">
        <Icon className={`w-6 h-6 ${iconColor} dark:text-gray-200`} />
      </div>
      <div className="flex items-center gap-1">
        <div
          className="font-medium text-gray-800 dark:text-gray-100 text-[12px]"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {label}
        </div>
        {beta && (
          <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-md">
            Beta
          </span>
        )}
      </div>
    </Link>
  );
}
