"use client";

type MetricsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
};

export default function MetricsCard({
  title,
  value,
  icon,
  gradient,
  bgColor,
}: MetricsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor} ${gradient} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 ${bgColor}`}></div>
    </div>
  );
}
