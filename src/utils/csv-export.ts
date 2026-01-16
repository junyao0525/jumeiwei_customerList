import type { Customer } from "@/types/customer";

/**
 * Escape CSV field if it contains special characters
 */
function escapeCsvField(field: string | number): string {
  const str = String(field);

  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Export customers data to CSV file
 * @param customers - Array of customer data
 * @param filename - Optional custom filename (default: customers-YYYY-MM-DD.csv)
 */
export function exportCustomersToCSV(
  customers: Customer[],
  filename?: string
): void {
  // CSV headers in Chinese (matching the table columns)
  const headers = [
    "姓名",
    "订购重量(公斤)",
    "创建日期",
    "订单总数",
    "类型",
    "状态",
    "请求日期",
    "已交付重量(公斤)",
    "剩余重量(公斤)",
  ];

  // Create CSV rows
  const rows = customers.map((customer) => [
    escapeCsvField(customer.name),
    escapeCsvField(customer.orderKg),
    escapeCsvField(customer.createdDate),
    escapeCsvField(customer.totalOrder),
    escapeCsvField(customer.type),
    escapeCsvField(customer.status),
    escapeCsvField(customer.requestedDate),
    escapeCsvField(customer.deliverKg),
    escapeCsvField(customer.remainingKg),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

  // Add UTF-8 BOM for proper Chinese character display in Excel
  const bom = "\uFEFF";
  const csvData = bom + csvContent;

  // Create Blob and download
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  // Generate filename with current date if not provided
  const defaultFilename = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
  const finalFilename = filename || defaultFilename;

  // Create download link
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", finalFilename);
  link.style.visibility = "hidden";

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}
