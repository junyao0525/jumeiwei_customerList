"use client";

import type { ViewMode } from "@/types/customer";

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-gray-300 bg-white p-1">
      <button
        onClick={() => onChange("table")}
        className={`flex h-9 min-w-[80px] items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition ${
          mode === "table"
            ? "bg-teal-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}>
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        表格
      </button>
      <button
        onClick={() => onChange("card")}
        className={`flex h-9 min-w-[80px] items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition ${
          mode === "card"
            ? "bg-teal-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}>
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        卡片
      </button>
    </div>
  );
}
