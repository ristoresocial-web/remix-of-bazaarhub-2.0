import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import StatusBadge, { type StatusVariant } from "@/components/StatusBadge";
import TrustBadge, { type TrustVariant } from "@/components/TrustBadge";
import AiDocVerifyDialog from "@/components/admin/AiDocVerifyDialog";

interface Seller {
  name: string; city: string; state: string; gst: string; products: number; status: string; trust: string; joinedDays: number; revenue: number;
}

const allSellers: Seller[] = [
  { name: "Kumar Electronics", city: "Chennai", state: "Tamil Nadu", gst: "33AABCK1234A1Z5", products: 24, status: "pending", trust: "New", joinedDays: 12, revenue: 245000 },
  { name: "Ravi Mobiles", city: "Coimbatore", state: "Tamil Nadu", gst: "33AABCR5678B2Z6", products: 15, status: "live", trust: "Established", joinedDays: 65, revenue: 890000 },
  { name: "Anand Gadgets", city: "Madurai", state: "Tamil Nadu", gst: "33AABCA9012C3Z7", products: 8, status: "pending", trust: "New", joinedDays: 5, revenue: 0 },
  { name: "Tech World", city: "Trichy", state: "Tamil Nadu", gst: "33AABCT3456D4Z8", products: 42, status: "live", trust: "Trusted", joinedDays: 180, revenue: 2340000 },
  { name: "Digital Hub", city: "Salem", state: "Tamil Nadu", gst: "33AABCD7890E5Z9", products: 5, status: "review", trust: "Under Review", joinedDays: 45, revenue: 120000 },
  { name: "Smart Store", city: "Erode", state: "Tamil Nadu", gst: "33AABCS1234F6Z0", products: 31, status: "live", trust: "Established", joinedDays: 90, revenue: 1560000 },
  { name: "Gadget Zone", city: "Mumbai", state: "Maharashtra", gst: "27AABCG1234G7Z1", products: 55, status: "live", trust: "Trusted", joinedDays: 240, revenue: 4500000 },
  { name: "Phone Palace", city: "Delhi", state: "Delhi NCR", gst: "07AABCP5678H8Z2", products: 38, status: "live", trust: "Established", joinedDays: 120, revenue: 2100000 },
  { name: "Star Electronics", city: "Bangalore", state: "Karnataka", gst: "29AABCS9012I9Z3", products: 19, status: "pending", trust: "New", joinedDays: 3, revenue: 0 },
  { name: "Royal Mobiles", city: "Hyderabad", state: "Telangana", gst: "36AABCR3456J0Z4", products: 27, status: "live", trust: "Established", joinedDays: 75, revenue: 980000 },
  { name: "Mega Mart", city: "Pune", state: "Maharashtra", gst: "27AABCM7890K1Z5", products: 62, status: "live", trust: "Trusted", joinedDays: 300, revenue: 5200000 },
  { name: "City Gadgets", city: "Kolkata", state: "West Bengal", gst: "19AABCC1234L2Z6", products: 11, status: "review", trust: "Under Review", joinedDays: 35, revenue: 85000 },
  { name: "Prime Tech", city: "Jaipur", state: "Rajasthan", gst: "08AABCP5678M3Z7", products: 16, status: "live", trust: "Established", joinedDays: 60, revenue: 670000 },
  { name: "Quick Electronics", city: "Ahmedabad", state: "Gujarat", gst: "24AABCQ9012N4Z8", products: 33, status: "live", trust: "Trusted", joinedDays: 150, revenue: 1890000 },
  { name: "Value Store", city: "Kochi", state: "Kerala", gst: "32AABCV3456O5Z9", products: 9, status: "pending", trust: "New", joinedDays: 8, revenue: 0 },
  { name: "Super Gadgets", city: "Lucknow", state: "Uttar Pradesh", gst: "09AABCS7890P6Z0", products: 21, status: "live", trust: "Established", joinedDays: 95, revenue: 1120000 },
  { name: "Tech Paradise", city: "Chandigarh", state: "Punjab", gst: "04AABCT1234Q7Z1", products: 14, status: "live", trust: "Established", joinedDays: 55, revenue: 540000 },
  { name: "Mobile Hub", city: "Bhopal", state: "Madhya Pradesh", gst: "23AABCM5678R8Z2", products: 7, status: "pending", trust: "New", joinedDays: 2, revenue: 0 },
  { name: "Digital Dreams", city: "Nagpur", state: "Maharashtra", gst: "27AABCD9012S9Z3", products: 29, status: "live", trust: "Trusted", joinedDays: 200, revenue: 3100000 },
  { name: "Electro World", city: "Visakhapatnam", state: "Andhra Pradesh", gst: "37AABCE3456T0Z4", products: 18, status: "live", trust: "Established", joinedDays: 70, revenue: 780000 },
  { name: "Smart Solutions", city: "Indore", state: "Madhya Pradesh", gst: "23AABCS7890U1Z5", products: 44, status: "live", trust: "Trusted", joinedDays: 165, revenue: 2750000 },
  { name: "Nova Electronics", city: "Nashik", state: "Maharashtra", gst: "27AABCN1234V2Z6", products: 13, status: "review", trust: "Under Review", joinedDays: 40, revenue: 95000 },
  { name: "Power Gadgets", city: "Surat", state: "Gujarat", gst: "24AABCP5678W3Z7", products: 36, status: "live", trust: "Trusted", joinedDays: 210, revenue: 3450000 },
  { name: "Express Mobile", city: "Vadodara", state: "Gujarat", gst: "24AABCE9012X4Z8", products: 22, status: "live", trust: "Established", joinedDays: 80, revenue: 910000 },
  { name: "Pixel Store", city: "Mysuru", state: "Karnataka", gst: "29AABCP3456Y5Z9", products: 10, status: "pending", trust: "New", joinedDays: 6, revenue: 0 },
  { name: "Click Shop", city: "Ranchi", state: "Jharkhand", gst: "20AABCC7890Z6Z0", products: 6, status: "pending", trust: "New", joinedDays: 1, revenue: 0 },
  { name: "Tech Savvy", city: "Patna", state: "Bihar", gst: "10AABCT1234A7Z1", products: 15, status: "live", trust: "Established", joinedDays: 50, revenue: 430000 },
  { name: "Digital Express", city: "Guwahati", state: "Assam", gst: "18AABCD5678B8Z2", products: 8, status: "live", trust: "New", joinedDays: 25, revenue: 180000 },
  { name: "Gadget Galaxy", city: "Thiruvananthapuram", state: "Kerala", gst: "32AABCG9012C9Z3", products: 20, status: "live", trust: "Established", joinedDays: 85, revenue: 1050000 },
  { name: "Electro Mart", city: "Raipur", state: "Chhattisgarh", gst: "22AABCE3456D0Z4", products: 12, status: "live", trust: "Established", joinedDays: 60, revenue: 520000 },
];

const statusMap: Record<string, StatusVariant> = { pending: "getting-ready", live: "live", review: "review" };
const trustMap: Record<string, TrustVariant> = { New: "new", Established: "established", Trusted: "trusted", "Under Review": "under-review" };
const statusLabel: Record<string, string> = { pending: "Getting Ready", live: "Live", review: "Under Review" };

const PAGE_SIZE = 25;
const allCities = [...new Set(allSellers.map(s => s.city))].sort();

type SortKey = "name" | "city" | "products" | "revenue" | "joinedDays";

const SellersTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [trustFilter, setTrustFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [verifyTarget, setVerifyTarget] = useState<Seller | null>(null);

  const pendingCount = allSellers.filter(s => s.status === "pending").length;

  const filtered = useMemo(() => {
    let list = [...allSellers];
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.gst.toLowerCase().includes(search.toLowerCase()));
    if (cityFilter) list = list.filter(s => s.city === cityFilter);
    if (statusFilter) list = list.filter(s => s.status === statusFilter);
    if (trustFilter) list = list.filter(s => s.trust === trustFilter);
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return sortAsc ? (av as string).localeCompare(bv as string) : (bv as string).localeCompare(av as string);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return list;
  }, [search, cityFilter, statusFilter, trustFilter, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const exportCSV = () => {
    const headers = ["Name", "City", "State", "GST", "Products", "Status", "Trust Tier", "Days Active", "Revenue"];
    const rows = filtered.map(s => [s.name, s.city, s.state, s.gst, s.products, statusLabel[s.status], s.trust, s.joinedDays, s.revenue]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "sellers_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader: React.FC<{ label: string; field: SortKey }> = ({ label, field }) => (
    <th onClick={() => toggleSort(field)} className="p-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none">
      <span className="flex items-center gap-1">{label} <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? "text-primary" : "text-muted-foreground/40"}`} /></span>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-foreground">Sellers ({filtered.length})</h2>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="rounded-pill bg-primary-light px-3 py-1 text-xs font-medium text-primary flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {pendingCount} sellers ready to join — approve to grow!
            </span>
          )}
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1 rounded-pill">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or GST..." className="w-full rounded-input border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(1); }} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option value="">All Cities</option>
          {allCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="pending">Getting Ready</option>
          <option value="live">Live</option>
          <option value="review">Under Review</option>
        </select>
        <select value={trustFilter} onChange={e => { setTrustFilter(e.target.value); setPage(1); }} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option value="">All Tiers</option>
          <option value="New">New</option>
          <option value="Established">Established</option>
          <option value="Trusted">Trusted</option>
          <option value="Under Review">Under Review</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <SortHeader label="Name" field="name" />
              <SortHeader label="City" field="city" />
              <th className="p-3 text-left font-medium text-muted-foreground hidden lg:table-cell">GST</th>
              <SortHeader label="Products" field="products" />
              <th className="p-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Trust</th>
              <SortHeader label="Revenue" field="revenue" />
              <th className="p-3 text-center font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map(s => (
              <tr key={s.gst} className="hover:bg-accent/30 transition-all duration-200">
                <td className="p-3 font-semibold text-foreground">{s.name}</td>
                <td className="p-3 text-muted-foreground">{s.city}</td>
                <td className="p-3 text-muted-foreground hidden lg:table-cell font-mono text-xs">{s.gst}</td>
                <td className="p-3 text-center text-foreground">{s.products}</td>
                <td className="p-3 text-center"><StatusBadge variant={statusMap[s.status]} label={statusLabel[s.status]} /></td>
                <td className="p-3 text-center"><TrustBadge variant={trustMap[s.trust]} /></td>
                <td className="p-3 text-right notranslate text-foreground">₹{(s.revenue / 100000).toFixed(1)}L</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {s.status === "pending" && (
                      <Button size="sm" className="text-[10px] h-7 px-2" onClick={() => toast.success(`Welcome to BazaarHub, ${s.name}!`)}>
                        Welcome to BazaarHub!
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-[10px] h-7 px-2">Request Details</Button>
                    <Button size="sm" variant="ghost" className="text-[10px] h-7 px-2 text-muted-foreground">Pause</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="h-8 w-8 p-0 text-xs">{p}</Button>
          ))}
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
};

export default SellersTab;
