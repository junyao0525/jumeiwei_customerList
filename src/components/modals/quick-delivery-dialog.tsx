"use client";

import { useEffect, useState, useRef } from "react";
import type { Customer } from "@/types/customer";

type QuickDeliveryDialogProps = {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onConfirm: (customerId: number, deliveryKg: number) => void;
};

export default function QuickDeliveryDialog({
  isOpen,
  customer,
  onClose,
  onConfirm,
}: QuickDeliveryDialogProps) {
  const [deliveryKg, setDeliveryKg] = useState<number | "">("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setDeliveryKg("");
      setError("");
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const handleInputChange = (value: string) => {
    const num = value === "" ? "" : Number(value);
    setDeliveryKg(num);

    // Validate
    if (num === "") {
      setError("");
    } else if (num <= 0) {
      setError("交付重量必须大于 0");
    } else if (num > customer.remainingKg) {
      setError(`最多可交付 ${customer.remainingKg} 公斤`);
    } else {
      setError("");
    }
  };

  const handleConfirm = () => {
    if (deliveryKg === "" || deliveryKg <= 0 || deliveryKg > customer.remainingKg) {
      return;
    }
    onConfirm(customer.id, deliveryKg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !error && deliveryKg !== "") {
      handleConfirm();
    }
  };

  const isValid = deliveryKg !== "" && deliveryKg > 0 && deliveryKg <= customer.remainingKg && !error;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">快速交付</h2>
          </div>

          {/* Content */}
          <div className="space-y-4 px-6 py-4">
            {/* Customer Info */}
            <div className="rounded-md bg-gray-50 p-3">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">客户:</span>
                <span className="font-medium text-gray-900">{customer.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">剩余:</span>
                <span className="font-semibold text-orange-600">
                  {customer.remainingKg} kg
                </span>
              </div>
            </div>

            {/* Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                交付重量 (公斤)
              </label>
              <input
                ref={inputRef}
                type="number"
                value={deliveryKg}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`最多 ${customer.remainingKg} kg`}
                className={`w-full rounded-md border px-4 py-2 text-sm outline-none transition ${
                  error
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-teal-500"
                }`}
                min="0"
                step="0.1"
              />
              {error && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
              )}
            </div>

            {/* Helper text */}
            {!error && deliveryKg !== "" && (
              <p className="text-xs text-gray-500">
                交付后剩余: {(customer.remainingKg - Number(deliveryKg)).toFixed(1)} kg
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 active:translate-y-px">
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isValid}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white active:translate-y-px ${
                isValid
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-gray-300"
              }`}>
              确认
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
