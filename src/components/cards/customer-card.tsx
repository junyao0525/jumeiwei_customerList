"use client";

import type { Customer } from "@/types/customer";

type CustomerCardProps = {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onQuickDeliver: (customer: Customer) => void;
};

export default function CustomerCard({
  customer,
  onEdit,
  onQuickDeliver,
}: CustomerCardProps) {
  // Get status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "待处理":
        return "bg-orange-100 text-orange-800";
      case "进行中":
        return "bg-blue-100 text-blue-800";
      case "完成":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get type badge colors
  const getTypeColor = (type: string) => {
    switch (type) {
      case "鸡肉":
        return "bg-purple-100 text-purple-800";
      case "猪肉":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: Name + Edit button */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
        <button
          onClick={() => onEdit(customer)}
          className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
          编辑
        </button>
      </div>

      {/* Badges: Type + Status */}
      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(customer.type)}`}>
          {customer.type}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(customer.status)}`}>
          {customer.status}
        </span>
      </div>

      {/* Order Metrics */}
      <div className="mb-3 space-y-2 border-t border-gray-100 pt-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">订购重量:</span>
          <span className="font-medium text-gray-900">{customer.orderKg} kg</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">已交付:</span>
          <span className="font-medium text-green-600">
            {customer.deliverKg} kg
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">剩余:</span>
          <span className="font-semibold text-orange-600">
            {customer.remainingKg} kg
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">订单总数:</span>
          <span className="font-medium text-gray-900">{customer.totalOrder}</span>
        </div>
      </div>

      {/* Dates */}
      <div className="mb-3 space-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>请求日期:</span>
          <span>{customer.requestedDate}</span>
        </div>
        <div className="flex justify-between">
          <span>创建日期:</span>
          <span>{customer.createdDate}</span>
        </div>
      </div>

      {/* Quick Deliver Button */}
      <button
        onClick={() => onQuickDeliver(customer)}
        className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 active:translate-y-px">
        快速交付
      </button>
    </div>
  );
}
