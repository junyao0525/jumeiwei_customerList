"use client";

import { useMemo } from "react";

export type SimpleColumn<T> = {
  id: keyof T;
  label: string;
  thClassName?: string;
  tdClassName?: string;
  renderItem?: (value: unknown, row: T, index: number) => React.ReactNode;
};

type Accent = "blue" | "green" | "purple" | "red" | "orange" | "gray" | "teal";

function accentClasses(accent: Accent) {
  switch (accent) {
    case "teal":
      return {
        button: "bg-teal-600 hover:bg-teal-700",
        headerBorder: "border-teal-200",
        th: "bg-teal-50",
      };
    case "green":
      return {
        button: "bg-green-600 hover:bg-green-700",
        headerBorder: "border-green-200",
        th: "bg-green-50",
      };
    case "purple":
      return {
        button: "bg-purple-600 hover:bg-purple-700",
        headerBorder: "border-purple-200",
        th: "bg-purple-50",
      };
    case "red":
      return {
        button: "bg-red-600 hover:bg-red-700",
        headerBorder: "border-red-200",
        th: "bg-red-50",
      };
    case "orange":
      return {
        button: "bg-orange-600 hover:bg-orange-700",
        headerBorder: "border-orange-200",
        th: "bg-orange-50",
      };
    case "gray":
      return {
        button: "bg-gray-700 hover:bg-gray-800",
        headerBorder: "border-gray-200",
        th: "bg-gray-50",
      };
    case "blue":
    default:
      return {
        button: "bg-blue-600 hover:bg-blue-700",
        headerBorder: "border-blue-200",
        th: "bg-blue-50",
      };
  }
}

export type SimpleDatatableProps<T> = {
  id: string;
  title: string;
  description?: string;
  columns: SimpleColumn<T>[];
  data: T[];
  isLoading?: boolean;
  accentColor?: Accent;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  showEditButton?: boolean;
  onEditClick?: (item: T, index: number) => void;
  showQuickDeliverButton?: boolean;
  onQuickDeliver?: (item: T, index: number) => void;
  quickDeliverButtonText?: string;
};

export default function SimpleDatatable<T extends { id?: string | number }>(
  props: SimpleDatatableProps<T>
) {
  const {
    id,
    title,
    description,
    columns,
    data,
    isLoading = false,
    accentColor = "blue",
    showSearch = true,
    searchValue = "",
    onSearchChange,
    showAddButton = true,
    addButtonText = "新增",
    onAddClick,
    showEditButton = false,
    onEditClick,
    showQuickDeliverButton = false,
    onQuickDeliver,
    quickDeliverButtonText = "交付",
  } = props;

  const classes = useMemo(() => accentClasses(accentColor), [accentColor]);

  return (
    <div
      className="w-full"
      id={id}>
      <div className={`rounded-xl border ${classes.headerBorder} p-4 md:p-6`}>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">{title}</div>
            {description ? (
              <div className="text-xs text-gray-500">{description}</div>
            ) : null}
          </div>
          <div className="mt-3 flex w-full gap-2 md:w-auto md:justify-end">
            {showSearch && (
              <input
                aria-label={`${id}-search-input`}
                placeholder="搜索..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="h-10 flex-1 rounded-md border border-gray-300 bg-transparent px-3 text-sm outline-none focus:border-gray-500 md:w-64"
              />
            )}
            {showAddButton && (
              <button
                onClick={onAddClick}
                className={`h-10 rounded-md px-3 text-sm font-medium text-white ${classes.button}`}>
                {addButtonText}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className={`text-gray-900 ${classes.th}`}>
              <tr>
                {columns.map((c) => (
                  <th
                    key={String(c.id)}
                    className={`px-4 py-2 ${c.thClassName ?? ""}`}>
                    {c.label}
                  </th>
                ))}
                {showEditButton && <th className="px-4 py-2">操作</th>}
                {showQuickDeliverButton && <th className="px-4 py-2">快速操作</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-500"
                    colSpan={columns.length + (showEditButton ? 1 : 0) + (showQuickDeliverButton ? 1 : 0)}>
                    加载中...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-500"
                    colSpan={columns.length + (showEditButton ? 1 : 0) + (showQuickDeliverButton ? 1 : 0)}>
                    暂无数据
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={String(row.id ?? idx)}
                    className="border-t hover:bg-gray-50">
                    {columns.map((c) => (
                      <td
                        key={`${String(c.id)}-${idx}`}
                        className={`px-4 py-2 text-gray-900 ${
                          c.tdClassName ?? ""
                        }`}>
                        {c.renderItem
                          ? c.renderItem(row[c.id], row, idx)
                          : String(row[c.id])}
                      </td>
                    ))}
                    {showEditButton && (
                      <td className="px-4 py-2">
                        <button
                          onClick={() => onEditClick?.(row, idx)}
                          className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
                          编辑
                        </button>
                      </td>
                    )}
                    {showQuickDeliverButton && (
                      <td className="px-4 py-2">
                        <button
                          onClick={() => onQuickDeliver?.(row, idx)}
                          className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">
                          {quickDeliverButtonText}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
