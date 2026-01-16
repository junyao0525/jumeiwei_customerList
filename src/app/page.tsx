"use client";

import MetricsCard from "@/components/dashboard/metrics-card";
import SimpleDatatable, {
  type SimpleColumn,
} from "@/components/datatable/simple-datatable";
import { useMemo, useState } from "react";
import type { Customer } from "@/types/customer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useViewPreference } from "@/hooks/use-view-preference";
import { exportCustomersToCSV } from "@/utils/csv-export";
import ViewToggle from "@/components/ui/view-toggle";
import CustomerCard from "@/components/cards/customer-card";
import BottomSheet from "@/components/modals/bottom-sheet";
import QuickDeliveryDialog from "@/components/modals/quick-delivery-dialog";

export default function Home() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>("customers", []);
  const [viewMode, setViewMode] = useViewPreference();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [quickDeliveryCustomer, setQuickDeliveryCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState("");
  const [orderKg, setOrderKg] = useState<number | "">("");
  const [deliverKg, setDeliverKg] = useState<number | "">("");
  const [totalOrder, setTotalOrder] = useState<number | "">("");
  const [typeValue, setTypeValue] = useState("普通");
  const [statusValue, setStatusValue] = useState("待处理");
  const [requestedDate, setRequestedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [createdDate, setCreatedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((c) =>
      [c.name, c.type, c.status].some((v) => v.toLowerCase().includes(term))
    );
  }, [customers, search]);

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const totalRemainingKg = customers.reduce(
      (sum, c) => sum + (c.remainingKg || 0),
      0
    );
    const totalGivenKg = customers.reduce(
      (sum, c) => sum + (c.deliverKg || 0),
      0
    );
    const waitingCustomers = customers.filter(
      (c) => c.status === "待处理"
    ).length;

    return {
      totalRemainingKg: totalRemainingKg.toFixed(1),
      totalGivenKg: totalGivenKg.toFixed(1),
      waitingCustomers,
    };
  }, [customers]);

  function resetForm() {
    setName("");
    setOrderKg("");
    setDeliverKg(0);
    setTotalOrder(0);
    setTypeValue("猪肉");
    setStatusValue("待处理");
    setRequestedDate(new Date().toISOString().slice(0, 10));
    setCreatedDate(new Date().toISOString().slice(0, 10));
  }

  function handleAdd() {
    if (!name.trim()) return;
    const ok = Number(orderKg) || 0;
    const dk = Number(deliverKg) || 0;
    const remain = Math.max(ok - dk, 0);
    const tot = Number(totalOrder) || 0;

    if (editingId !== null) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: name.trim(),
                orderKg: ok,
                createdDate,
                totalOrder: tot,
                type: typeValue,
                status: statusValue,
                requestedDate,
                deliverKg: dk,
                remainingKg: remain,
              }
            : c
        )
      );
    } else {
      // Add new customer
      setCustomers((prev) => [
        {
          id: Date.now(),
          name: name.trim(),
          orderKg: ok,
          createdDate,
          totalOrder: tot,
          type: typeValue,
          status: statusValue,
          requestedDate,
          deliverKg: dk,
          remainingKg: remain,
        },
        ...prev,
      ]);
    }
    resetForm();
    setShowForm(false);
    setEditingId(null);
  }

  function handleEdit(customer: Customer) {
    setName(customer.name);
    setOrderKg(customer.orderKg);
    setDeliverKg(customer.deliverKg);
    setTotalOrder(customer.totalOrder);
    setTypeValue(customer.type);
    setStatusValue(customer.status);
    setRequestedDate(customer.requestedDate);
    setCreatedDate(customer.createdDate);
    setEditingId(customer.id);
    setShowForm(true);
  }

  function handleExport() {
    exportCustomersToCSV(customers);
  }

  function handleQuickDeliver(customer: Customer) {
    setQuickDeliveryCustomer(customer);
  }

  function confirmQuickDeliver(customerId: number, deliveryKg: number) {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              deliverKg: c.deliverKg + deliveryKg,
              remainingKg: c.remainingKg - deliveryKg,
              status: c.remainingKg - deliveryKg === 0 ? "完成" : c.status,
            }
          : c
      )
    );
    setQuickDeliveryCustomer(null);
  }

  const columns: SimpleColumn<Customer>[] = [
    { id: "name", label: "姓名" },
    { id: "orderKg", label: "订购重量(公斤)" },
    { id: "createdDate", label: "创建日期" },
    { id: "totalOrder", label: "订单总数" },
    { id: "type", label: "类型" },
    { id: "status", label: "状态" },
    { id: "requestedDate", label: "请求日期" },
    { id: "deliverKg", label: "已交付重量(公斤)" },
    { id: "remainingKg", label: "剩余重量(公斤)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Dashboard Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricsCard
          title="剩余重量 (公斤)"
          value={metrics.totalRemainingKg}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          bgColor="bg-blue-500"
        />
        <MetricsCard
          title="已交付重量 (公斤)"
          value={metrics.totalGivenKg}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          bgColor="bg-green-500"
        />
        <MetricsCard
          title="等待中的客户"
          value={metrics.waitingCustomers}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          bgColor="bg-orange-500"
        />
      </div>

      {/* Actions Row */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <ViewToggle mode={viewMode} onChange={setViewMode} />
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 active:translate-y-px">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          导出 CSV
        </button>
      </div>

      {/* Bottom Sheet Form */}
      <BottomSheet
        isOpen={showForm}
        onClose={() => {
          resetForm();
          setShowForm(false);
          setEditingId(null);
        }}
        title={editingId ? "编辑客户" : "新增客户"}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名"
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">订购重量(公斤)</label>
              <input
                type="number"
                value={orderKg}
                onChange={(e) =>
                  setOrderKg(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="例如: 10"
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">已交付重量(公斤)</label>
              <input
                type="number"
                value={deliverKg}
                onChange={(e) =>
                  setDeliverKg(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="例如: 5"
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">订单总数</label>
              <input
                type="number"
                value={totalOrder}
                onChange={(e) =>
                  setTotalOrder(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="例如: 3"
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">类型</label>
              <select
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value)}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500">
                <option>鸡肉</option>
                <option>猪肉</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">状态</label>
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500">
                <option>待处理</option>
                <option>进行中</option>
                <option>完成</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">请求日期</label>
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">创建日期</label>
              <input
                type="date"
                value={createdDate}
                onChange={(e) => setCreatedDate(e.target.value)}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-gray-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAdd}
                className="h-[38px] rounded-md bg-green-600 px-3 text-sm font-medium text-white active:translate-y-px">
                {editingId ? "更新" : "保存"}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="h-[38px] rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-800 active:translate-y-px">
                取消
              </button>
          </div>
        </div>
      </BottomSheet>

      {viewMode === "table" ? (
        <SimpleDatatable
          id="customer-table"
          title="顾客表"
          description="使用组件展示数据"
          columns={columns}
          data={filtered}
          accentColor="teal"
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          showAddButton
          addButtonText={showForm ? "收起" : "新增"}
          onAddClick={() => {
            if (showForm) {
              resetForm();
              setEditingId(null);
            }
            setShowForm((s) => !s);
          }}
          showEditButton
          onEditClick={handleEdit}
          showQuickDeliverButton
          onQuickDeliver={handleQuickDeliver}
        />
      ) : (
        <div>
          {/* Search and Add Button for Card View */}
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-xl border border-teal-200 p-4 md:p-6">
            <div>
              <div className="text-xl font-bold text-gray-900">顾客卡片</div>
              <div className="text-xs text-gray-500">使用卡片展示数据</div>
            </div>
            <div className="mt-3 flex w-full gap-2 md:w-auto md:justify-end">
              <input
                aria-label="card-view-search-input"
                placeholder="搜索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 flex-1 rounded-md border border-gray-300 bg-transparent px-3 text-sm outline-none focus:border-gray-500 md:w-64"
              />
              <button
                onClick={() => {
                  if (showForm) {
                    resetForm();
                    setEditingId(null);
                  }
                  setShowForm((s) => !s);
                }}
                className="h-10 rounded-md bg-teal-600 px-3 text-sm font-medium text-white hover:bg-teal-700">
                {showForm ? "收起" : "新增"}
              </button>
            </div>
          </div>

          {/* Card Grid */}
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-gray-500">
              暂无数据
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onEdit={handleEdit}
                  onQuickDeliver={handleQuickDeliver}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Delivery Dialog */}
      <QuickDeliveryDialog
        isOpen={quickDeliveryCustomer !== null}
        customer={quickDeliveryCustomer}
        onClose={() => setQuickDeliveryCustomer(null)}
        onConfirm={confirmQuickDeliver}
      />
    </div>
  );
}
