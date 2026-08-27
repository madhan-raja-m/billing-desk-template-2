// Mock data layer — swap these exports for API calls later.
// Nothing in the UI imports data from anywhere but this module.

export type Customer = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  gstin?: string;
  invoices: number;
  totalPurchase: number;
  lastPurchase: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  hsn: string;
  price: number;
  gst: number;
  stock: number;
  status: "Active" | "Inactive" | "Low stock";
};

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Cancelled";

export type Invoice = {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  date: string;
  amount: number;
  payment: "Cash" | "UPI" | "Card" | "Bank" | "Credit";
  status: InvoiceStatus;
  createdBy: string;
};

export type Enquiry = {
  id: string;
  customer: string;
  mobile: string;
  location: string;
  date: string;
  status: "New" | "Contacted" | "Quoted" | "Converted" | "Lost";
  interest: string;
};

export const currency = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

export const customers: Customer[] = [
  ["Aarav Traders", "98404 21188", "accounts@aaravtraders.in", "Chennai", 42, 486300, "2026-08-26"],
  ["Meera Enterprises", "99621 55420", "meera@meerastores.com", "Coimbatore", 28, 312450, "2026-08-25"],
  ["Sri Balaji Hardware", "94441 09876", "balajihw@gmail.com", "Madurai", 61, 742900, "2026-08-26"],
  ["Nova Interiors", "90031 44567", "hello@novainteriors.co", "Bengaluru", 12, 198750, "2026-08-19"],
  ["Kumar Electricals", "98847 33210", "kumar.elec@outlook.com", "Salem", 35, 289400, "2026-08-24"],
  ["Zenith Office Supply", "70108 92345", "orders@zenithsupply.in", "Chennai", 19, 156200, "2026-08-21"],
  ["Lakshmi Textiles", "88254 77001", "lakshmi.tex@gmail.com", "Erode", 47, 521800, "2026-08-23"],
  ["Prime Build Solutions", "93810 66432", "info@primebuild.in", "Hosur", 8, 96400, "2026-08-12"],
  ["Anand Auto Parts", "89390 12009", "anandauto@rediffmail.com", "Trichy", 24, 214650, "2026-08-20"],
  ["Vertex Systems", "72007 55418", "billing@vertexsys.io", "Chennai", 31, 398100, "2026-08-26"],
  ["Green Leaf Foods", "95661 30084", "accounts@greenleaf.in", "Vellore", 16, 132900, "2026-08-15"],
  ["Ravi Steel Mart", "80568 99120", "ravisteel@gmail.com", "Tirupur", 39, 465300, "2026-08-22"],
].map((r, i) => ({
  id: "CUS-" + String(1001 + i),
  name: r[0] as string,
  mobile: r[1] as string,
  email: r[2] as string,
  city: r[3] as string,
  gstin: i % 3 === 0 ? "33AABCU" + (9600 + i) + "R1Z" + (i % 9) : undefined,
  invoices: r[4] as number,
  totalPurchase: r[5] as number,
  lastPurchase: r[6] as string,
}));

export const products: Product[] = [
  ["Copper Wire 2.5sqmm — 90m", "WIR-2590", "Electrical", "8544", 2450, 18, 124, "Active"],
  ["LED Panel Light 18W", "LED-1801", "Lighting", "9405", 640, 12, 58, "Active"],
  ["MCB 32A Double Pole", "MCB-32DP", "Electrical", "8536", 890, 18, 12, "Low stock"],
  ["PVC Conduit Pipe 25mm", "PVC-25MM", "Plumbing", "3917", 145, 18, 340, "Active"],
  ["Modular Switch 6A", "SWT-06MD", "Electrical", "8536", 96, 18, 890, "Active"],
  ["Ceiling Fan 1200mm", "FAN-1200", "Appliances", "8414", 3150, 18, 34, "Active"],
  ["Distribution Box 8-Way", "DBX-08W", "Electrical", "8537", 1780, 18, 21, "Active"],
  ["Extension Board 4 Socket", "EXT-4SKT", "Accessories", "8536", 520, 18, 0, "Inactive"],
  ["Halogen Flood Light 50W", "FLD-50HL", "Lighting", "9405", 1240, 12, 44, "Active"],
  ["Insulation Tape (Pack of 10)", "TAP-INS10", "Accessories", "3919", 180, 12, 210, "Active"],
  ["Submersible Pump 1HP", "PMP-1HP", "Appliances", "8413", 8450, 18, 7, "Low stock"],
  ["Cable Tie 200mm (100 pcs)", "CTI-200", "Accessories", "3926", 110, 18, 520, "Active"],
].map((r, i) => ({
  id: "PRD-" + String(2001 + i),
  name: r[0] as string,
  sku: r[1] as string,
  category: r[2] as string,
  hsn: r[3] as string,
  price: r[4] as number,
  gst: r[5] as number,
  stock: r[6] as number,
  status: r[7] as Product["status"],
}));

const payments: Invoice["payment"][] = ["Cash", "UPI", "Card", "Bank", "Credit"];
const statuses: InvoiceStatus[] = ["Paid", "Paid", "Paid", "Pending", "Overdue", "Cancelled"];
const users = ["Madhan R", "Priya S", "Vignesh K", "Divya M"];

export const invoices: Invoice[] = Array.from({ length: 48 }, (_, i) => {
  const c = customers[i % customers.length];
  const day = 26 - (i % 26);
  return {
    id: "INV-" + (3001 + i),
    number: "BD/26-27/" + String(1420 - i),
    customer: c.name,
    customerId: c.id,
    date: `2026-08-${String(day).padStart(2, "0")}`,
    amount: Math.round((1850 + ((i * 3767) % 42000)) / 10) * 10,
    payment: payments[(i * 3) % payments.length],
    status: statuses[(i * 5) % statuses.length],
    createdBy: users[i % users.length],
  };
});

export const enquiries: Enquiry[] = [
  ["Suresh Babu", "98410 22334", "T. Nagar, Chennai", "2026-08-26", "New", "Ceiling fans — bulk 20 pcs"],
  ["Fatima Rizwan", "90035 77821", "RS Puram, Coimbatore", "2026-08-26", "Contacted", "LED panel lights"],
  ["Jerome Peter", "89398 45120", "Anna Nagar, Madurai", "2026-08-25", "Quoted", "Full site wiring"],
  ["Deepa Krishnan", "70942 11876", "Whitefield, Bengaluru", "2026-08-25", "New", "Submersible pump 1HP"],
  ["Ashwin Menon", "94446 60329", "Peelamedu, Coimbatore", "2026-08-24", "Converted", "Distribution boards"],
  ["Nithya Raman", "80128 34567", "Gandhipuram, Salem", "2026-08-24", "Lost", "Flood lights"],
  ["Imran Sheikh", "99529 87610", "Kodambakkam, Chennai", "2026-08-23", "Contacted", "Modular switches"],
  ["Vandana Iyer", "73583 90014", "Race Course, Trichy", "2026-08-22", "Quoted", "Office lighting retrofit"],
  ["Karthik Selvam", "96003 21789", "Hosur Main Rd", "2026-08-22", "New", "Copper wire 5 rolls"],
  ["Beena Thomas", "85269 40033", "Kottivakkam, Chennai", "2026-08-21", "Converted", "Extension boards"],
].map((r, i) => ({
  id: "ENQ-" + (4001 + i),
  customer: r[0] as string,
  mobile: r[1] as string,
  location: r[2] as string,
  date: r[3] as string,
  status: r[4] as Enquiry["status"],
  interest: r[5] as string,
}));

export const dashboardStats = {
  todaySales: 184260,
  todayDelta: 12.4,
  monthSales: 3846500,
  monthDelta: 8.1,
  invoiceCount: 1428,
  invoiceDelta: 4.6,
  customerCount: 612,
  customerDelta: 2.9,
  avgInvoice: 2694,
  avgDelta: -1.8,
  gstCollected: 486320,
  gstDelta: 7.3,
};

export const salesTrend = [
  { day: "01", sales: 128000, invoices: 42 },
  { day: "04", sales: 96500, invoices: 31 },
  { day: "07", sales: 172400, invoices: 58 },
  { day: "10", sales: 143900, invoices: 47 },
  { day: "13", sales: 198600, invoices: 64 },
  { day: "16", sales: 165300, invoices: 55 },
  { day: "19", sales: 211800, invoices: 71 },
  { day: "22", sales: 187200, invoices: 62 },
  { day: "25", sales: 234500, invoices: 78 },
  { day: "26", sales: 184260, invoices: 61 },
];

export const topProducts = [
  { name: "Copper Wire 2.5sqmm", value: 486300 },
  { name: "Ceiling Fan 1200mm", value: 342100 },
  { name: "LED Panel Light 18W", value: 268900 },
  { name: "Submersible Pump 1HP", value: 214500 },
  { name: "Modular Switch 6A", value: 168200 },
];

export const topCustomers = [
  { name: "Sri Balaji Hardware", value: 742900 },
  { name: "Lakshmi Textiles", value: 521800 },
  { name: "Aarav Traders", value: 486300 },
  { name: "Ravi Steel Mart", value: 465300 },
  { name: "Vertex Systems", value: 398100 },
];

export const paymentMix = [
  { name: "UPI", value: 42 },
  { name: "Cash", value: 24 },
  { name: "Card", value: 16 },
  { name: "Bank", value: 12 },
  { name: "Credit", value: 6 },
];

export const reportCategories = [
  {
    group: "Sales",
    items: [
      "Daily Sales",
      "Monthly Sales",
      "Invoice Register",
      "Product Sales",
      "Customer Sales",
      "Payment Method",
      "GST Report",
    ],
  },
  { group: "Customers", items: ["New Customers", "Repeat Customers", "Top Customers"] },
  { group: "Products", items: ["Top Products", "Product Revenue", "Product Quantity"] },
  { group: "Invoices", items: ["Cancelled Invoices", "User-wise Sales"] },
];

export const activityLog = [
  { user: "Madhan R", action: "Created invoice BD/26-27/1420", time: "Today, 10:42 AM" },
  { user: "Priya S", action: "Updated product LED Panel Light 18W", time: "Today, 09:58 AM" },
  { user: "Vignesh K", action: "Cancelled invoice BD/26-27/1402", time: "Yesterday, 06:12 PM" },
  { user: "Divya M", action: "Added customer Vertex Systems", time: "Yesterday, 03:30 PM" },
  { user: "Madhan R", action: "Exported GST report for July", time: "25 Aug, 11:05 AM" },
];

export const themes = [
  { id: "royal", name: "Royal Blue", swatch: "oklch(0.5 0.2 265)" },
  { id: "navy", name: "Professional Navy", swatch: "oklch(0.38 0.11 253)" },
  { id: "emerald", name: "Emerald", swatch: "oklch(0.52 0.12 163)" },
  { id: "burgundy", name: "Burgundy", swatch: "oklch(0.42 0.14 15)" },
  { id: "purple", name: "Purple", swatch: "oklch(0.48 0.19 300)" },
  { id: "teal", name: "Teal", swatch: "oklch(0.5 0.1 195)" },
  { id: "indigo", name: "Indigo", swatch: "oklch(0.45 0.17 277)" },
  { id: "slate", name: "Slate", swatch: "oklch(0.44 0.032 257)" },
  { id: "orange", name: "Orange", swatch: "oklch(0.6 0.16 48)" },
  { id: "charcoal", name: "Charcoal", swatch: "oklch(0.32 0.008 260)" },
];

export const business = {
  name: "Billing Desk Solutions",
  legalName: "Billing Desk Solutions Pvt Ltd",
  gstin: "33AABCB1234K1Z9",
  phone: "+91 98404 21188",
  email: "accounts@billingdesk.in",
  address: "No. 42, Mount Road, Guindy, Chennai 600032, Tamil Nadu",
};
