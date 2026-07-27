import { useState, useEffect } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Box, Building2, CalendarDays,
  CheckCircle2, ChevronRight, ClipboardList, Clock, FileText, FolderOpen, Handshake,
  ListChecks, MapPin, Package, Printer, QrCode, Search, ShieldAlert, Tags, Timer,
  TriangleAlert, Truck, Warehouse, Wrench, Zap, Plus, Eye, FileCheck, ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import { inventoryApi } from "../../services/inventory";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  ItemStatusBadge, POStatusBadge, GRNStatusBadge, RequisitionStatusBadge,
  TransferStatusBadge, ExpiryStatusBadge, InventoryStatCard, InventorySection,
  InventoryPageHeader, StockBar,
} from "./inventoryUi";
import {
  STOCK_ITEMS, DEPARTMENT_STOCKS, PURCHASE_REQUISITIONS, PURCHASE_ORDERS, SUPPLIERS,
  GRN_RECORDS, BATCH_RECORDS, STOCK_TRANSFERS, CYCLE_COUNTS, ASSET_RECORDS, ALERTS,
  AUDIT_LOGS, formatINR,
  type StockItem, type PurchaseRequisition, type PurchaseOrder, type Supplier,
} from "./data";

type InventoryRoute =
  | "dashboard" | "stock-master" | "department-inventory" | "purchase-requisition"
  | "purchase-orders" | "supplier-management" | "goods-receipt" | "batch-expiry"
  | "barcode-qr" | "stock-transfers" | "cycle-count" | "physical-stock-audit"
  | "asset-management" | "biomedical-equipment" | "inventory-reports"
  | "supply-chain-analytics" | "alerts-notifications" | "complete";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Inventory Dashboard", icon: Activity },
  { id: "stock-master", label: "Stock Item Master", icon: Package },
  { id: "department-inventory", label: "Dept Inventory", icon: Building2 },
  { id: "purchase-requisition", label: "Purchase Requisition", icon: ClipboardList, badge: "2" },
  { id: "purchase-orders", label: "Purchase Orders", icon: FileText, badge: "1" },
  { id: "supplier-management", label: "Suppliers", icon: Handshake },
  { id: "goods-receipt", label: "Goods Receipt", icon: Truck },
  { id: "batch-expiry", label: "Batch & Expiry", icon: Tags, badge: "1", tone: "warning" },
  { id: "barcode-qr", label: "Barcode / QR", icon: QrCode },
];

const NAV_SECONDARY: NavItem[] = [
  { id: "stock-transfers", label: "Stock Transfers", icon: ArrowRight },
  { id: "cycle-count", label: "Cycle Count", icon: ClipboardList },
  { id: "physical-stock-audit", label: "Physical Audit", icon: ShieldAlert },
  { id: "asset-management", label: "Asset Management", icon: Wrench },
  { id: "biomedical-equipment", label: "Biomedical Equip", icon: Activity },
  { id: "inventory-reports", label: "Reports", icon: BarChart3 },
  { id: "supply-chain-analytics", label: "SC Analytics", icon: BarChart3 },
  { id: "alerts-notifications", label: "Alerts", icon: AlertTriangle, badge: "4", tone: "danger" },
];

const CRUMBS: Record<InventoryRoute, string[]> = {
  dashboard: ["Inventory", "Dashboard"],
  "stock-master": ["Inventory", "Stock Item Master"],
  "department-inventory": ["Inventory", "Department Inventory"],
  "purchase-requisition": ["Inventory", "Purchase Requisition"],
  "purchase-orders": ["Inventory", "Purchase Orders"],
  "supplier-management": ["Inventory", "Supplier Management"],
  "goods-receipt": ["Inventory", "Goods Receipt Note"],
  "batch-expiry": ["Inventory", "Batch & Expiry Management"],
  "barcode-qr": ["Inventory", "Barcode / QR Labels"],
  "stock-transfers": ["Inventory", "Stock Transfers"],
  "cycle-count": ["Inventory", "Cycle Count"],
  "physical-stock-audit": ["Inventory", "Physical Stock Audit"],
  "asset-management": ["Inventory", "Asset Management"],
  "biomedical-equipment": ["Inventory", "Biomedical Equipment"],
  "inventory-reports": ["Inventory", "Reports"],
  "supply-chain-analytics": ["Inventory", "Supply Chain Analytics"],
  "alerts-notifications": ["Inventory", "Alerts & Notifications"],
  complete: ["Inventory", "Workflow Complete"],
};

export function InventoryApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<InventoryRoute>("dashboard");
  const [liveStock, setLiveStock] = useState(STOCK_ITEMS);
  useEffect(() => {
    inventoryApi.list().then(r => {
      if (r.data?.length) setLiveStock(r.data.map((s: any) => ({
        id: s._id,
        code: s.sku || "",
        name: s.name || "",
        category: s.category || "",
        sku: s.sku || "",
        quantity: s.quantity || 0,
        currentStock: s.quantity || 0,
        unit: s.unit || "pcs",
        unitPrice: s.unitPrice || 0,
        unitCost: s.unitPrice || 0,
        reorderLevel: s.reorderLevel || 0,
        minStock: s.reorderLevel || 0,
        maxStock: (s.reorderLevel || 0) * 3,
        supplier: s.supplier || "",
        location: s.location || "",
        expiryDate: s.expiryDate || "",
        status: s.quantity <= 0 ? "Out of Stock" : s.quantity <= (s.reorderLevel || 0) ? "Low Stock" : "Active",
        batchNumber: s.batchNumber || "",
        manufacturer: s.manufacturer || "",
        gst: s.gst || 0,
        gstRate: s.gst || 0,
        hsn: s.hsn || "",
        hsnCode: s.hsn || "",
        subcategory: s.category || "",
        lastReceived: s.createdAt || "",
      })));
    }).catch(() => {});
  }, []);
  const navTo = (r: InventoryRoute) => setRoute(r);

  const totalStockValue = liveStock.reduce((a, item) => a + (item.currentStock ?? 0) * (item.unitCost ?? 0), 0);
  const lowStockCount = liveStock.filter(i => i.status === "Low Stock").length;
  const outOfStockCount = liveStock.filter(i => i.status === "Out of Stock").length;
  const pendingPOs = PURCHASE_ORDERS.filter(p => p.status !== "Received" && p.status !== "Cancelled").length;
  const nearExpiryCount = BATCH_RECORDS.filter(b => b.status === "Near Expiry").length;
  const criticalAlerts = ALERTS.filter(a => !a.acknowledged && (a.severity === "Critical" || a.severity === "High")).length;

  function renderScreen() {
    switch (route) {
      case "dashboard": return <InventoryDashboard />;
      case "stock-master": return <StockItemMaster />;
      case "department-inventory": return <DepartmentInventory />;
      case "purchase-requisition": return <PurchaseRequisitionScreen />;
      case "purchase-orders": return <PurchaseOrdersScreen />;
      case "supplier-management": return <SupplierManagementScreen />;
      case "goods-receipt": return <GoodsReceiptScreen />;
      case "batch-expiry": return <BatchExpiryScreen />;
      case "barcode-qr": return <BarcodeQRScreen />;
      case "stock-transfers": return <StockTransfersScreen />;
      case "cycle-count": return <CycleCountScreen />;
      case "physical-stock-audit": return <PhysicalStockAuditScreen />;
      case "asset-management": return <AssetManagementScreen />;
      case "biomedical-equipment": return <BiomedicalEquipmentScreen />;
      case "inventory-reports": return <InventoryReportsScreen />;
      case "supply-chain-analytics": return <SupplyChainAnalyticsScreen />;
      case "alerts-notifications": return <AlertsNotificationsScreen />;
      case "complete": return <WorkflowCompleteScreen />;
      default: return <InventoryDashboard />;
    }
  }

  /* ========================= 1. Dashboard ========================= */
  function InventoryDashboard() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Inventory Dashboard" subtitle="Supply chain overview — 23 July 2026" actions={
          <Button onClick={() => navTo("stock-master")} className="bg-primary text-white"><Search className="mr-2 size-4" />Stock Items</Button>
        } />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InventoryStatCard icon={Warehouse} label="Total Stock Value" value={formatINR(totalStockValue)} trend={8} tone="brand" hint="Across all stores" />
          <InventoryStatCard icon={Package} label="Stock Items" value={liveStock.length} tone="success" hint={`${lowStockCount} low, ${outOfStockCount} out`} />
          <InventoryStatCard icon={AlertTriangle} label="Low / Out of Stock" value={lowStockCount + outOfStockCount} tone={outOfStockCount > 0 ? "danger" : "warning"} />
          <InventoryStatCard icon={FileText} label="Pending POs" value={pendingPOs} tone="info" hint={formatINR(PURCHASE_ORDERS.filter(p => p.status !== "Received" && p.status !== "Cancelled").reduce((a, p) => a + p.grandTotal, 0)) + " value"} />
          <InventoryStatCard icon={Tags} label="Near Expiry Batches" value={nearExpiryCount} tone={nearExpiryCount > 0 ? "warning" : "success"} />
          <InventoryStatCard icon={AlertTriangle} label="Critical Alerts" value={criticalAlerts} tone={criticalAlerts > 0 ? "danger" : "success"} />
        </div>
        <InventorySection title="Recent Activity">
          <div className="space-y-3">
            {AUDIT_LOGS.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Clock className="size-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{log.action}</span>
                    <span className="text-xs text-text-secondary">{log.user}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary truncate">{log.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-text-secondary">{log.timestamp.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 2. Stock Item Master ========================= */
  function StockItemMaster() {
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("All");
    const categories = ["All", ...new Set(liveStock.map(i => i.category))];
    const filtered = liveStock.filter(i =>
      (catFilter === "All" || i.category === catFilter) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))
    );
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Stock Item Master" subtitle={`${liveStock.length} items tracked`} actions={
          <Button className="bg-primary text-white"><Plus className="mr-2 size-4" />Add Item</Button>
        } />
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input placeholder="Search by name or code..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-1.5">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${catFilter === c ? "bg-primary text-white" : "bg-muted text-text-secondary hover:bg-muted/80"}`}>{c}</button>
            ))}
          </div>
        </div>
        <InventorySection>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-text-secondary">
                  <th className="pb-3 pr-4">Code</th><th className="pb-3 pr-4">Item Name</th><th className="pb-3 pr-4">Category</th><th className="pb-3 pr-4">Manufacturer</th><th className="pb-3 pr-4">Unit</th><th className="pb-3 pr-4 text-right">Min</th><th className="pb-3 pr-4 text-right">Current</th><th className="pb-3 pr-4 text-right">Max</th><th className="pb-3 pr-4 text-right">Unit Cost</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="py-3 pr-4 font-mono text-xs text-text-secondary">{item.code}</td>
                    <td className="py-3 pr-4 font-medium text-text-primary">{item.name}</td>
                    <td className="py-3 pr-4 text-text-secondary">{item.category}</td>
                    <td className="py-3 pr-4 text-text-secondary max-w-[180px] truncate">{item.manufacturer}</td>
                    <td className="py-3 pr-4 text-text-secondary">{item.unit}</td>
                    <td className="py-3 pr-4 text-right text-text-secondary">{item.minStock.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 text-right font-medium text-text-primary">{item.currentStock.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 text-right text-text-secondary">{item.maxStock.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 text-right text-text-primary">{formatINR(item.unitCost)}</td>
                    <td className="py-3 pr-4"><ItemStatusBadge status={item.status} /></td>
                    <td className="py-3 w-32"><StockBar current={item.currentStock} min={item.minStock} max={item.maxStock} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 3. Department Inventory ========================= */
  function DepartmentInventory() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Department Inventory" subtitle="Department-wise stock distribution" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DEPARTMENT_STOCKS.map(dept => (
            <InventorySection key={dept.departmentId} title={dept.departmentName} action={<span className="text-xs text-text-secondary">Updated {dept.lastUpdated}</span>}>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2"><div className="text-lg font-bold text-text-primary">{dept.itemCount}</div><div className="text-xs text-text-secondary">Items</div></div>
                  <div className="rounded-lg bg-muted/50 p-2"><div className="text-lg font-bold text-text-primary">{formatINR(dept.totalValue)}</div><div className="text-xs text-text-secondary">Value</div></div>
                  <div className="rounded-lg bg-muted/50 p-2"><div className={`text-lg font-bold ${dept.lowStockItems + dept.criticalItems > 0 ? "text-danger" : "text-success"}`}>{dept.lowStockItems + dept.criticalItems}</div><div className="text-xs text-text-secondary">Issues</div></div>
                </div>
                <div className="space-y-2">
                  {dept.items.map(it => (
                    <div key={it.itemId} className="flex items-center justify-between rounded-lg border border-border p-2">
                      <span className="text-sm text-text-primary">{it.itemName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">{it.quantity.toLocaleString("en-IN")}</span>
                        <ItemStatusBadge status={it.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </InventorySection>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 4. Purchase Requisition ========================= */
  function PurchaseRequisitionScreen() {
    const [selected, setSelected] = useState<PurchaseRequisition | null>(null);
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Purchase Requisition" subtitle={`${PURCHASE_REQUISITIONS.length} requisitions`} actions={
          <Button className="bg-primary text-white"><Plus className="mr-2 size-4" />New Requisition</Button>
        } />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InventorySection>
            <div className="space-y-2">
              {PURCHASE_REQUISITIONS.map(pr => (
                <button key={pr.id} onClick={() => setSelected(pr)} className={`w-full rounded-lg border p-3 text-left transition ${selected?.id === pr.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-text-secondary">{pr.requisitionNumber}</span>
                    <RequisitionStatusBadge status={pr.status} />
                  </div>
                  <div className="mt-1 text-sm font-medium text-text-primary">{pr.department} — {pr.totalItems} items</div>
                  <div className="mt-0.5 text-xs text-text-secondary">By {pr.requestedBy} · {pr.requestDate} · Est. {formatINR(pr.estimatedTotal)}</div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-text-secondary">{pr.priority}</div>
                </button>
              ))}
            </div>
          </InventorySection>
          {selected && (
            <InventorySection title={`Requisition ${selected.requisitionNumber}`}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-text-secondary">Department:</span> <span className="font-medium text-text-primary">{selected.department}</span></div>
                  <div><span className="text-text-secondary">Status:</span> <RequisitionStatusBadge status={selected.status} /></div>
                  <div><span className="text-text-secondary">Requested By:</span> <span className="font-medium text-text-primary">{selected.requestedBy}</span></div>
                  <div><span className="text-text-secondary">Date:</span> <span className="font-medium text-text-primary">{selected.requestDate}</span></div>
                  <div><span className="text-text-secondary">Priority:</span> <span className="font-medium text-text-primary">{selected.priority}</span></div>
                  <div><span className="text-text-secondary">Est. Total:</span> <span className="font-medium text-text-primary">{formatINR(selected.estimatedTotal)}</span></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border text-left text-xs text-text-secondary"><th className="pb-2">Item</th><th className="pb-2 text-right">Qty</th><th className="pb-2 text-right">Unit Price</th><th className="pb-2 text-right">Total</th></tr></thead>
                    <tbody>
                      {selected.items.map((it, i) => (
                        <tr key={i} className="border-b border-border/50"><td className="py-2 text-text-primary">{it.name}</td><td className="py-2 text-right text-text-secondary">{it.quantity.toLocaleString("en-IN")}</td><td className="py-2 text-right text-text-secondary">{formatINR(it.unitPrice)}</td><td className="py-2 text-right font-medium text-text-primary">{formatINR(it.quantity * it.unitPrice)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selected.status === "Submitted" && (
                  <div className="flex gap-2">
                    <Button className="bg-success text-white" onClick={() => toast.success("Requisition approved")}><CheckCircle2 className="mr-2 size-4" />Approve</Button>
                    <Button variant="destructive" onClick={() => toast.error("Requisition rejected")}>Reject</Button>
                  </div>
                )}
              </div>
            </InventorySection>
          )}
        </div>
      </div>
    );
  }

  /* ========================= 5. Purchase Orders ========================= */
  function PurchaseOrdersScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Purchase Orders" subtitle={`${PURCHASE_ORDERS.length} orders`} actions={
          <Button className="bg-primary text-white"><Plus className="mr-2 size-4" />New PO</Button>
        } />
        <InventorySection>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-text-secondary">
                <th className="pb-3 pr-4">PO Number</th><th className="pb-3 pr-4">Supplier</th><th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Expected</th><th className="pb-3 pr-4 text-right">Amount</th><th className="pb-3 pr-4 text-right">GST</th><th className="pb-3 pr-4 text-right">Total</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
              </tr></thead>
              <tbody>
                {PURCHASE_ORDERS.map(po => (
                  <tr key={po.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="py-3 pr-4 font-mono text-xs font-medium text-primary">{po.poNumber}</td>
                    <td className="py-3 pr-4 text-text-primary max-w-[200px] truncate">{po.supplierName}</td>
                    <td className="py-3 pr-4 text-text-secondary">{po.orderDate}</td>
                    <td className="py-3 pr-4 text-text-secondary">{po.expectedDelivery}</td>
                    <td className="py-3 pr-4 text-right text-text-secondary">{formatINR(po.totalAmount)}</td>
                    <td className="py-3 pr-4 text-right text-text-secondary">{formatINR(po.gstAmount)}</td>
                    <td className="py-3 pr-4 text-right font-medium text-text-primary">{formatINR(po.grandTotal)}</td>
                    <td className="py-3 pr-4"><POStatusBadge status={po.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm"><Eye className="size-3.5" /></Button>
                        <Button variant="ghost" size="sm"><Printer className="size-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 6. Supplier Management ========================= */
  function SupplierManagementScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Supplier Management" subtitle={`${SUPPLIERS.length} active suppliers`} actions={
          <Button className="bg-primary text-white"><Plus className="mr-2 size-4" />Add Supplier</Button>
        } />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SUPPLIERS.map(sup => (
            <InventorySection key={sup.id} title={sup.name}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-text-secondary">GSTIN:</span><div className="font-mono text-xs text-text-primary">{sup.gstin}</div></div>
                  <div><span className="text-text-secondary">Contact:</span><div className="text-text-primary">{sup.contactPerson}</div></div>
                  <div><span className="text-text-secondary">Phone:</span><div className="text-text-primary">{sup.phone}</div></div>
                  <div><span className="text-text-secondary">Email:</span><div className="text-text-primary text-xs">{sup.email}</div></div>
                  <div><span className="text-text-secondary">City:</span><div className="text-text-primary">{sup.city}, {sup.state}</div></div>
                  <div><span className="text-text-secondary">Payment:</span><div className="text-text-primary">{sup.paymentTerms}</div></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2"><div className="text-lg font-bold text-text-primary">{sup.totalOrders}</div><div className="text-[10px] text-text-secondary">Orders</div></div>
                  <div className="rounded-lg bg-muted/50 p-2"><div className="text-lg font-bold text-success">{sup.onTimeDelivery}%</div><div className="text-[10px] text-text-secondary">On Time</div></div>
                  <div className="rounded-lg bg-muted/50 p-2"><div className="text-lg font-bold text-text-primary">{sup.rating}</div><div className="text-[10px] text-text-secondary">Rating</div></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sup.categories.map(c => <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-primary">{c}</span>)}
                </div>
              </div>
            </InventorySection>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 7. Goods Receipt ========================= */
  function GoodsReceiptScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Goods Receipt Note" subtitle={`${GRN_RECORDS.length} GRN records`} />
        <InventorySection>
          <div className="space-y-4">
            {GRN_RECORDS.map(grn => (
              <div key={grn.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-primary">{grn.grnNumber}</span>
                      <GRNStatusBadge status={grn.status} />
                    </div>
                    <div className="mt-1 text-xs text-text-secondary">PO: {grn.poNumber} · {grn.supplierName} · Received: {grn.receivedDate} by {grn.receivedBy}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-text-secondary">Items: <span className="font-medium text-text-primary">{grn.totalItems.toLocaleString("en-IN")}</span></div>
                    <div className="text-text-secondary">Accepted: <span className="font-medium text-success">{grn.acceptedItems.toLocaleString("en-IN")}</span> Rejected: <span className="font-medium text-danger">{grn.rejectedItems}</span></div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {grn.batches.map((b, i) => (
                    <div key={i} className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
                      <span className="font-medium text-text-primary">Batch: {b.batchNumber}</span>
                      <span className="mx-2 text-text-secondary">·</span>
                      <span className="text-text-secondary">Exp: {b.expiryDate}</span>
                      <span className="mx-2 text-text-secondary">·</span>
                      <span className="text-text-secondary">Qty: {b.quantity.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                {grn.status === "Pending Inspection" && (
                  <div className="mt-3 flex gap-2">
                    <Button className="bg-success text-white" size="sm" onClick={() => toast.success("GRN accepted")}><CheckCircle2 className="mr-1 size-3.5" />Accept</Button>
                    <Button variant="destructive" size="sm" onClick={() => toast.error("GRN rejected")}>Reject</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 8. Batch & Expiry ========================= */
  function BatchExpiryScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Batch & Expiry Management" subtitle={`${BATCH_RECORDS.length} batches tracked`} />
        <InventorySection>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-text-secondary">
                <th className="pb-3 pr-4">Batch No.</th><th className="pb-3 pr-4">Item</th><th className="pb-3 pr-4">Manufacturer</th><th className="pb-3 pr-4">Mfg Date</th><th className="pb-3 pr-4">Expiry Date</th><th className="pb-3 pr-4 text-right">Qty</th><th className="pb-3 pr-4 text-right">Remaining</th><th className="pb-3 pr-4">FEFO</th><th className="pb-3 pr-4">Location</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {BATCH_RECORDS.map(b => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="py-3 pr-4 font-mono text-xs font-medium text-primary">{b.batchNumber}</td>
                    <td className="py-3 pr-4 text-text-primary">{b.itemName}</td>
                    <td className="py-3 pr-4 text-text-secondary max-w-[160px] truncate">{b.manufacturer}</td>
                    <td className="py-3 pr-4 text-text-secondary">{b.manufacturingDate}</td>
                    <td className="py-3 pr-4 text-text-secondary">{b.expiryDate}</td>
                    <td className="py-3 pr-4 text-right text-text-secondary">{b.quantity.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 text-right font-medium text-text-primary">{b.remainingQuantity.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4">{b.fefoCompliant ? <CheckCircle2 className="size-4 text-success" /> : <TriangleAlert className="size-4 text-danger" />}</td>
                    <td className="py-3 pr-4 text-xs text-text-secondary max-w-[160px] truncate">{b.storageLocation}</td>
                    <td className="py-3"><ExpiryStatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 9. Barcode / QR ========================= */
  function BarcodeQRScreen() {
    const [scanMode, setScanMode] = useState<"generate" | "scan">("generate");
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Barcode / QR Labels" subtitle="Generate and scan barcode/QR labels" />
        <div className="flex gap-2">
          <Button variant={scanMode === "generate" ? "default" : "outline"} onClick={() => setScanMode("generate")}><Printer className="mr-2 size-4" />Generate Labels</Button>
          <Button variant={scanMode === "scan" ? "default" : "outline"} onClick={() => setScanMode("scan")}><ScanLine className="mr-2 size-4" />Scan Barcode</Button>
        </div>
        {scanMode === "generate" ? (
          <InventorySection title="Generate Labels">
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">Select items to generate barcode or QR code labels for stock tracking.</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {liveStock.slice(0, 6).map(item => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{item.name}</div>
                      <div className="font-mono text-xs text-text-secondary">{item.code} · {item.batchNumber ?? "N/A"}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.success(`Label generated for ${item.code}`)}><Printer className="mr-1 size-3.5" />Print</Button>
                  </div>
                ))}
              </div>
            </div>
          </InventorySection>
        ) : (
          <InventorySection title="Scan Barcode">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-8 text-center">
                <ScanLine className="mx-auto size-12 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Position barcode under scanner</p>
                  <p className="text-xs text-text-secondary">Or enter barcode manually below</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Enter barcode manually..." className="flex-1" />
                <Button onClick={() => toast.info("Simulated scan: ITEM-SI-001-LOC")}>Scan</Button>
              </div>
            </div>
          </InventorySection>
        )}
      </div>
    );
  }

  /* ========================= 10. Stock Transfers ========================= */
  function StockTransfersScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Stock Transfers" subtitle={`${STOCK_TRANSFERS.length} transfers`} actions={
          <Button className="bg-primary text-white"><Plus className="mr-2 size-4" />New Transfer</Button>
        } />
        <InventorySection>
          <div className="space-y-3">
            {STOCK_TRANSFERS.map(t => (
              <div key={t.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-primary">{t.transferNumber}</span>
                      <TransferStatusBadge status={t.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span className="font-medium text-text-primary">{t.fromStore}</span>
                      <ArrowRight className="size-3" />
                      <span className="font-medium text-text-primary">{t.toStore}</span>
                      <span>· {t.transferDate}</span>
                      <span>· By {t.initiatedBy}</span>
                    </div>
                  </div>
                  {t.receivedBy && <span className="text-xs text-text-secondary">Received by {t.receivedBy}</span>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.items.map((it, i) => (
                    <div key={i} className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
                      <span className="text-text-primary">{it.name}</span>
                      <span className="mx-1 text-text-secondary">×{it.quantity.toLocaleString("en-IN")}</span>
                      <span className="text-text-secondary">(Batch: {it.batchNumber})</span>
                    </div>
                  ))}
                </div>
                {t.remarks && <p className="mt-2 text-xs text-text-secondary italic">{t.remarks}</p>}
              </div>
            ))}
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 11. Cycle Count ========================= */
  function CycleCountScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Cycle Count" subtitle="Periodic stock verification" actions={
          <Button className="bg-primary text-white"><Plus className="mr-2 size-4" />Schedule Count</Button>
        } />
        <InventorySection title="Cycle Count Schedule">
          <div className="space-y-3">
            {CYCLE_COUNTS.map(cc => (
              <div key={cc.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm font-medium text-primary">{cc.countNumber}</span>
                    <span className="ml-3 text-sm text-text-primary">{cc.store}</span>
                  </div>
                  <StatusBadge status={cc.status} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                  <div><span className="text-text-secondary">Scheduled:</span> <span className="text-text-primary">{cc.scheduledDate}</span></div>
                  <div><span className="text-text-secondary">Counted By:</span> <span className="text-text-primary">{cc.countedBy}</span></div>
                  <div><span className="text-text-secondary">Total Items:</span> <span className="text-text-primary">{cc.totalItems}</span></div>
                  <div><span className="text-text-secondary">Accuracy:</span> <span className="text-text-primary">{cc.accuracyPercent}%</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-info/5 border border-info/20 p-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 text-info" />
              <div>
                <p className="text-sm font-medium text-text-primary">Next scheduled count: 25 July 2026</p>
                <p className="text-xs text-text-secondary">Central Store — 13 items to be counted by Neha Deshpande</p>
              </div>
            </div>
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 12. Physical Stock Audit ========================= */
  function PhysicalStockAuditScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Physical Stock Audit" subtitle="Audit trail and variance reports" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InventoryStatCard icon={ShieldAlert} label="Audits This Month" value={2} tone="brand" />
          <InventoryStatCard icon={CheckCircle2} label="Variance Found" value={1} tone="warning" />
          <InventoryStatCard icon={Warehouse} label="Accuracy Rate" value="97.5%" tone="success" />
        </div>
        <InventorySection title="Audit Log">
          <div className="space-y-3">
            {AUDIT_LOGS.map(log => (
              <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><ShieldAlert className="size-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{log.action}</span>
                    <span className="text-xs text-text-secondary">{log.user} ({log.role})</span>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">{log.detail}</p>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-text-secondary">
                    <span>{log.timestamp}</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 13. Asset Management ========================= */
  function AssetManagementScreen() {
    const totalValue = ASSET_RECORDS.reduce((a, ast) => a + ast.currentValue, 0);
    const totalCost = ASSET_RECORDS.reduce((a, ast) => a + ast.purchaseCost, 0);
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Asset Management" subtitle={`${ASSET_RECORDS.length} assets tracked`} actions={
          <Button className="bg-primary text-white"><Plus className="mr-2 size-4" />Register Asset</Button>
        } />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InventoryStatCard icon={Wrench} label="Total Assets" value={ASSET_RECORDS.length} tone="brand" />
          <InventoryStatCard icon={Warehouse} label="Current Value" value={formatINR(totalValue)} tone="info" hint={`Original: ${formatINR(totalCost)}`} />
          <InventoryStatCard icon={AlertTriangle} label="Under Maintenance" value={ASSET_RECORDS.filter(a => a.status === "Under Maintenance").length} tone="warning" />
        </div>
        <InventorySection>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-text-secondary">
                <th className="pb-3 pr-4">Asset Tag</th><th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Category</th><th className="pb-3 pr-4">Department</th><th className="pb-3 pr-4">Location</th><th className="pb-3 pr-4 text-right">Purchase Cost</th><th className="pb-3 pr-4 text-right">Current Value</th><th className="pb-3 pr-4">Warranty</th><th className="pb-3 pr-4">Next Service</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {ASSET_RECORDS.map(ast => (
                  <tr key={ast.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="py-3 pr-4 font-mono text-xs font-medium text-primary">{ast.assetTag}</td>
                    <td className="py-3 pr-4 text-text-primary">{ast.name}</td>
                    <td className="py-3 pr-4 text-text-secondary">{ast.category}</td>
                    <td className="py-3 pr-4 text-text-secondary">{ast.department}</td>
                    <td className="py-3 pr-4 text-text-secondary max-w-[140px] truncate">{ast.location}</td>
                    <td className="py-3 pr-4 text-right text-text-secondary">{formatINR(ast.purchaseCost)}</td>
                    <td className="py-3 pr-4 text-right font-medium text-text-primary">{formatINR(ast.currentValue)}</td>
                    <td className="py-3 pr-4 text-text-secondary">{ast.warrantyExpiry}</td>
                    <td className="py-3 pr-4 text-text-secondary">{ast.nextServiceDate}</td>
                    <td className="py-3"><StatusBadge status={ast.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 14. Biomedical Equipment ========================= */
  function BiomedicalEquipmentScreen() {
    const biomedical = ASSET_RECORDS.filter(a => ["Ventilator", "Monitor", "C-arm", "CT Scanner", "MRI"].includes(a.category));
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Biomedical Equipment" subtitle={`${biomedical.length} equipment tracked`} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {biomedical.map(eq => (
            <InventorySection key={eq.id} title={eq.name}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-text-secondary">Tag:</span> <span className="font-mono text-xs text-primary">{eq.assetTag}</span></div>
                  <div><span className="text-text-secondary">Model:</span> <span className="text-text-primary">{eq.model}</span></div>
                  <div><span className="text-text-secondary">Serial:</span> <span className="font-mono text-xs text-text-primary">{eq.serialNumber}</span></div>
                  <div><span className="text-text-secondary">Status:</span> <StatusBadge status={eq.status} /></div>
                  <div><span className="text-text-secondary">Location:</span> <span className="text-text-primary">{eq.location}</span></div>
                  <div><span className="text-text-secondary">Department:</span> <span className="text-text-primary">{eq.department}</span></div>
                  <div><span className="text-text-secondary">Cost:</span> <span className="text-text-primary">{formatINR(eq.purchaseCost)}</span></div>
                  <div><span className="text-text-secondary">Warranty:</span> <span className="text-text-primary">{eq.warrantyExpiry}</span></div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg bg-muted/50 p-2 text-center"><div className="text-xs text-text-secondary">Last Service</div><div className="text-sm font-medium text-text-primary">{eq.lastServiceDate}</div></div>
                  <div className="flex-1 rounded-lg bg-muted/50 p-2 text-center"><div className="text-xs text-text-secondary">Next Service</div><div className="text-sm font-medium text-text-primary">{eq.nextServiceDate}</div></div>
                </div>
                {eq.assignedTo && <p className="text-xs text-text-secondary">Assigned to: <span className="font-medium text-text-primary">{eq.assignedTo}</span></p>}
              </div>
            </InventorySection>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 15. Inventory Reports ========================= */
  function InventoryReportsScreen() {
    const reports = [
      { title: "Consumption Report", desc: "Monthly item consumption by department", icon: BarChart3, tone: "brand" },
      { title: "Expiry Loss Report", desc: "Expired items and financial impact", icon: AlertTriangle, tone: "warning" },
      { title: "Vendor Performance", desc: "Supplier delivery and quality metrics", icon: Handshake, tone: "success" },
      { title: "Stock Valuation", desc: "Current stock value by category", icon: Warehouse, tone: "info" },
      { title: "Purchase Analysis", desc: "PO trends and spending patterns", icon: FileText, tone: "brand" },
      { title: "Asset Depreciation", desc: "Asset value depreciation schedule", icon: Wrench, tone: "neutral" },
    ];
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Inventory Reports" subtitle="Generate and view reports" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((r, i) => (
            <InventorySection key={i}>
              <div className="flex items-start gap-4">
                <div className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                  r.tone === "brand" ? "bg-secondary text-primary" : r.tone === "warning" ? "bg-warning/10 text-[#b45309]" : r.tone === "success" ? "bg-success/10 text-success" : r.tone === "info" ? "bg-info/10 text-[#0369a1]" : "bg-muted text-text-secondary"
                }`}><r.icon className="size-6" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{r.title}</h3>
                  <p className="mt-0.5 text-sm text-text-secondary">{r.desc}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info(`Generating ${r.title}...`)}>Generate Report</Button>
                </div>
              </div>
            </InventorySection>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 16. Supply Chain Analytics ========================= */
  function SupplyChainAnalyticsScreen() {
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Supply Chain Analytics" subtitle="Key performance indicators" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InventoryStatCard icon={Warehouse} label="Inventory Turnover" value="8.2x" trend={5} tone="brand" hint="Annualized" />
          <InventoryStatCard icon={Package} label="Carrying Cost" value="18.5%" trend={-3} tone="success" hint="% of avg inventory value" />
          <InventoryStatCard icon={Truck} label="Fill Rate" value="94.2%" trend={2} tone="success" hint="Line items fulfilled from stock" />
          <InventoryStatCard icon={Clock} label="Avg Lead Time" value="8.3 days" trend={-1} tone="info" hint="Across all suppliers" />
          <InventoryStatCard icon={FileText} label="PO Cycle Time" value="4.2 days" trend={8} tone="warning" hint="PO to GRN" />
          <InventoryStatCard icon={Tags} label="Dead Stock Value" value={formatINR(45000)} tone="danger" hint="Items with 0 movement in 90 days" />
          <InventoryStatCard icon={Handshake} label="Supplier Score" value="92.4" trend={3} tone="success" hint="Weighted quality + delivery" />
          <InventoryStatCard icon={CheckCircle2} label="Order Accuracy" value="98.7%" trend={1} tone="success" hint="Correct items received" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InventorySection title="Top Consumed Items">
            <div className="space-y-3">
              {[...liveStock].sort((a, b) => (b.currentStock ?? 0) - (a.currentStock ?? 0)).slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-secondary text-primary"><Package className="size-4" /></div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{item.name}</div>
                      <div className="text-xs text-text-secondary">{item.code}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium text-text-primary">{(item.currentStock ?? 0).toLocaleString("en-IN")} {item.unit}</div>
                    <div className="text-xs text-text-secondary">{formatINR((item.currentStock ?? 0) * (item.unitCost ?? 0))}</div>
                  </div>
                </div>
              ))}
            </div>
          </InventorySection>
          <InventorySection title="Category Distribution">
            <div className="space-y-3">
              {Object.entries(liveStock.reduce((acc, item) => { acc[item.category] = (acc[item.category] || 0) + (item.currentStock ?? 0) * (item.unitCost ?? 0); return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).map(([cat, value]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{cat}</span>
                    <span className="font-medium text-text-primary">{formatINR(value)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(value / totalStockValue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </InventorySection>
        </div>
      </div>
    );
  }

  /* ========================= 17. Alerts & Notifications ========================= */
  function AlertsNotificationsScreen() {
    const [alerts, setAlerts] = useState(ALERTS);
    const acknowledge = (id: string) => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
      toast.success("Alert acknowledged");
    };
    const severityTone: Record<string, string> = { Critical: "bg-danger/10 text-danger border-danger/20", High: "bg-warning/10 text-[#b45309] border-warning/20", Medium: "bg-info/10 text-[#0369a1] border-info/20", Low: "bg-muted text-text-secondary border-border" };
    return (
      <div className="space-y-6">
        <InventoryPageHeader title="Alerts & Notifications" subtitle={`${alerts.filter(a => !a.acknowledged).length} unacknowledged alerts`} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InventoryStatCard icon={AlertTriangle} label="Critical" value={alerts.filter(a => a.severity === "Critical").length} tone="danger" />
          <InventoryStatCard icon={TriangleAlert} label="High" value={alerts.filter(a => a.severity === "High").length} tone="warning" />
          <InventoryStatCard icon={Clock} label="Medium" value={alerts.filter(a => a.severity === "Medium").length} tone="info" />
          <InventoryStatCard icon={CheckCircle2} label="Acknowledged" value={alerts.filter(a => a.acknowledged).length} tone="success" />
        </div>
        <InventorySection>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`rounded-lg border p-4 transition ${alert.acknowledged ? "opacity-60" : ""} ${severityTone[alert.severity] || "border-border"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {alert.severity === "Critical" ? <AlertTriangle className="size-5 text-danger" /> : alert.severity === "High" ? <TriangleAlert className="size-5 text-[#b45309]" /> : <Clock className="size-5 text-[#0369a1]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-primary">{alert.title}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">{alert.type}</span>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">{alert.description}</p>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-text-secondary">
                        <span>{alert.timestamp}</span>
                        {alert.itemName && <span>Item: {alert.itemName}</span>}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button variant="outline" size="sm" onClick={() => acknowledge(alert.id)}><CheckCircle2 className="mr-1 size-3.5" />Acknowledge</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InventorySection>
      </div>
    );
  }

  /* ========================= 18. Workflow Complete ========================= */
  function WorkflowCompleteScreen() {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-success/10 text-success mb-6">
          <CheckCircle2 className="size-10" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Inventory & SCM Workflow Complete</h2>
        <p className="mt-2 max-w-md text-text-secondary">
          All 18 screens of the Inventory, Procurement & Supply Chain Management module have been reviewed.
          Stock is tracked, procurement is in progress, and alerts are being monitored.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navTo("dashboard")} className="bg-primary text-white">Return to Dashboard</Button>
          <Button variant="outline" onClick={() => onSwitchWorkspace("reception")}>Switch Workspace</Button>
        </div>
      </div>
    );
  }

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Inventory & SCM"
      activeId={route}
      onNavigate={(id) => navTo(id as InventoryRoute)}
      breadcrumb={CRUMBS[route]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="inventory"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search inventory..."
    >
      {renderScreen()}
    </Shell>
  );
}
