import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, Eye, Pencil, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AdminProduct {
  id: string; name: string; category: string; brand: string; listedBy: string; city: string; status: string; minPrice: number; maxPrice: number;
}

const mockProducts: AdminProduct[] = [
  { id: "1", name: "Samsung Galaxy S24 Ultra", category: "Mobiles", brand: "Samsung", listedBy: "Kumar Electronics", city: "Chennai", status: "live", minPrice: 129990, maxPrice: 134999 },
  { id: "2", name: "iPhone 15 Pro Max", category: "Mobiles", brand: "Apple", listedBy: "Ravi Mobiles", city: "Coimbatore", status: "live", minPrice: 156900, maxPrice: 159900 },
  { id: "3", name: "Samsung 55\" Crystal 4K TV", category: "Televisions", brand: "Samsung", listedBy: "Tech World", city: "Trichy", status: "live", minPrice: 42990, maxPrice: 49990 },
  { id: "4", name: "LG 1.5 Ton 5-Star AC", category: "Air Conditioners", brand: "LG", listedBy: "Smart Store", city: "Erode", status: "live", minPrice: 38990, maxPrice: 42990 },
  { id: "5", name: "OnePlus 12R", category: "Mobiles", brand: "OnePlus", listedBy: "Anand Gadgets", city: "Madurai", status: "pending", minPrice: 39999, maxPrice: 42999 },
  { id: "6", name: "Sony WH-1000XM5", category: "Audio", brand: "Sony", listedBy: "Digital Hub", city: "Salem", status: "review", minPrice: 26990, maxPrice: 29990 },
  { id: "7", name: "MacBook Air M3", category: "Laptops", brand: "Apple", listedBy: "Gadget Zone", city: "Mumbai", status: "live", minPrice: 112900, maxPrice: 119900 },
  { id: "8", name: "Samsung Galaxy Z Fold5", category: "Mobiles", brand: "Samsung", listedBy: "Phone Palace", city: "Delhi", status: "live", minPrice: 154999, maxPrice: 164999 },
  { id: "9", name: "Whirlpool 265L Refrigerator", category: "Refrigerators", brand: "Whirlpool", listedBy: "Star Electronics", city: "Bangalore", status: "pending", minPrice: 24990, maxPrice: 28990 },
  { id: "10", name: "Voltas 1.5 Ton 3-Star AC", category: "Air Conditioners", brand: "Voltas", listedBy: "Royal Mobiles", city: "Hyderabad", status: "live", minPrice: 32990, maxPrice: 36990 },
  { id: "11", name: "Samsung Galaxy A55", category: "Mobiles", brand: "Samsung", listedBy: "Mega Mart", city: "Pune", status: "live", minPrice: 26999, maxPrice: 29999 },
  { id: "12", name: "LG 43\" Smart TV", category: "Televisions", brand: "LG", listedBy: "City Gadgets", city: "Kolkata", status: "review", minPrice: 28990, maxPrice: 32990 },
];

const statusLabel: Record<string, string> = { pending: "Getting Ready", live: "Live", review: "Under Review" };
const statusColor: Record<string, string> = { pending: "bg-primary-light text-primary", live: "bg-success-light text-success", review: "border border-warning text-warning bg-transparent" };

const categories = [...new Set(mockProducts.map(p => p.category))].sort();
const cities = [...new Set(mockProducts.map(p => p.city))].sort();

const AdminProductsTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let list = [...mockProducts];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (catFilter) list = list.filter(p => p.category === catFilter);
    if (cityFilter) list = list.filter(p => p.city === cityFilter);
    if (statusFilter) list = list.filter(p => p.status === statusFilter);
    return list;
  }, [search, catFilter, cityFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Products Management ({filtered.length})</h2>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-input border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option value="">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="pending">Getting Ready</option>
          <option value="live">Live</option>
          <option value="review">Under Review</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="p-3 text-left font-medium text-muted-foreground hidden md:table-cell">Brand</th>
              <th className="p-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Listed By</th>
              <th className="p-3 text-left font-medium text-muted-foreground hidden lg:table-cell">City</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Price Range</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-accent/30 transition-all duration-200">
                <td className="p-3 font-semibold text-foreground notranslate">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell notranslate">{p.brand}</td>
                <td className="p-3 text-muted-foreground hidden lg:table-cell">{p.listedBy}</td>
                <td className="p-3 text-muted-foreground hidden lg:table-cell">{p.city}</td>
                <td className="p-3 text-center"><span className={`rounded-pill px-2 py-0.5 text-xs font-semibold ${statusColor[p.status]}`}>{statusLabel[p.status]}</span></td>
                <td className="p-3 text-right notranslate text-foreground">₹{p.minPrice.toLocaleString("en-IN")} – ₹{p.maxPrice.toLocaleString("en-IN")}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="View"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                    {p.status === "pending" && <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success" title="Approve" onClick={() => toast.success(`${p.name} approved!`)}><CheckCircle className="h-3.5 w-3.5" /></Button>}
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" title="Remove"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsTab;
