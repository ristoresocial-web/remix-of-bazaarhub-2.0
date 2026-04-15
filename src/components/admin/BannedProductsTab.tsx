import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ShieldAlert, Plus, Search, Trash2, Edit2, X, Check, AlertTriangle,
  MapPin, FileText, Eye, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  getBannedKeywords, saveBannedKeywords, getBlockedListings, saveBlockedListings,
  getGeoBlockRules, saveGeoBlockRules,
  type BannedKeyword, type BlockedListing, type GeoBlockRule,
} from "@/data/bannedProductsData";
import { citiesByState } from "@/lib/cityUtils";

const allStates = Object.keys(citiesByState).sort();
const CATEGORIES = ["Weapons", "Drugs", "Counterfeit", "Tobacco", "Electronics", "Other"];
const SEVERITIES: BannedKeyword["severity"][] = ["critical", "high", "medium"];

const sevBadge = (s: BannedKeyword["severity"]) => {
  const cls = s === "critical" ? "bg-destructive/10 text-destructive" : s === "high" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground";
  return <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase ${cls}`}>{s}</span>;
};

const statusBadge = (s: BlockedListing["status"]) => {
  const map: Record<string, string> = {
    blocked: "bg-destructive/10 text-destructive",
    confirmed: "bg-destructive/20 text-destructive",
    whitelisted: "bg-success/10 text-success",
    appealed: "bg-warning/10 text-warning",
    "appeal-approved": "bg-success/10 text-success",
    "appeal-rejected": "bg-destructive/10 text-destructive",
  };
  return <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase ${map[s] || "bg-muted text-muted-foreground"}`}>{s.replace("-", " ")}</span>;
};

const BannedProductsTab: React.FC = () => {
  // Keywords state
  const [keywords, setKeywords] = useState<BannedKeyword[]>(getBannedKeywords);
  const [showAddKw, setShowAddKw] = useState(false);
  const [kwForm, setKwForm] = useState({ keyword: "", category: "Other", severity: "high" as BannedKeyword["severity"] });
  const [editKwId, setEditKwId] = useState<number | null>(null);
  const [kwSearch, setKwSearch] = useState("");

  // Blocked listings state
  const [blocked, setBlocked] = useState<BlockedListing[]>(getBlockedListings);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Geo rules state
  const [geoRules, setGeoRules] = useState<GeoBlockRule[]>(getGeoBlockRules);
  const [showAddGeo, setShowAddGeo] = useState(false);
  const [geoForm, setGeoForm] = useState({ keyword: "", blockedStates: [] as string[], reason: "" });

  // --- Keywords CRUD ---
  const saveKw = () => {
    if (!kwForm.keyword.trim()) return;
    let next: BannedKeyword[];
    if (editKwId !== null) {
      next = keywords.map(k => k.id === editKwId ? { ...k, keyword: kwForm.keyword.trim(), category: kwForm.category, severity: kwForm.severity } : k);
    } else {
      next = [...keywords, { id: Date.now(), keyword: kwForm.keyword.trim(), category: kwForm.category, severity: kwForm.severity, addedAt: new Date().toISOString().split("T")[0], addedBy: "Admin" }];
    }
    setKeywords(next);
    saveBannedKeywords(next);
    setKwForm({ keyword: "", category: "Other", severity: "high" });
    setShowAddKw(false);
    setEditKwId(null);
  };

  const deleteKw = (id: number) => {
    const next = keywords.filter(k => k.id !== id);
    setKeywords(next);
    saveBannedKeywords(next);
  };

  const startEditKw = (k: BannedKeyword) => {
    setKwForm({ keyword: k.keyword, category: k.category, severity: k.severity });
    setEditKwId(k.id);
    setShowAddKw(true);
  };

  // --- Blocked listings actions ---
  const updateListingStatus = (id: number, status: BlockedListing["status"], notes?: string) => {
    const next = blocked.map(b => b.id === id ? { ...b, status, adminNotes: notes || b.adminNotes } : b);
    setBlocked(next);
    saveBlockedListings(next);
  };

  // --- Geo rules CRUD ---
  const saveGeo = () => {
    if (!geoForm.keyword.trim() || geoForm.blockedStates.length === 0) return;
    const next = [...geoRules, { id: Date.now(), keyword: geoForm.keyword.trim(), blockedStates: geoForm.blockedStates, reason: geoForm.reason, createdAt: new Date().toISOString().split("T")[0] }];
    setGeoRules(next);
    saveGeoBlockRules(next);
    setGeoForm({ keyword: "", blockedStates: [], reason: "" });
    setShowAddGeo(false);
  };

  const deleteGeo = (id: number) => {
    const next = geoRules.filter(r => r.id !== id);
    setGeoRules(next);
    saveGeoBlockRules(next);
  };

  const toggleGeoState = (state: string) => {
    setGeoForm(prev => ({
      ...prev,
      blockedStates: prev.blockedStates.includes(state) ? prev.blockedStates.filter(s => s !== state) : [...prev.blockedStates, state],
    }));
  };

  const filteredKw = kwSearch ? keywords.filter(k => k.keyword.toLowerCase().includes(kwSearch.toLowerCase()) || k.category.toLowerCase().includes(kwSearch.toLowerCase())) : keywords;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-destructive" /> Banned Products</h2>
      </div>

      {/* Info banner */}
      <div className="rounded-card bg-destructive/5 border border-destructive/20 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Auto-Block System Active</p>
          <p className="text-xs text-muted-foreground">New product listings are automatically scanned against the banned keywords database. Matches are instantly blocked and logged for admin review.</p>
        </div>
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="keywords">Keywords ({keywords.length})</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Queue ({blocked.filter(b => b.status === "blocked" || b.status === "appealed").length})</TabsTrigger>
          <TabsTrigger value="geo">Geo-Blocks ({geoRules.length})</TabsTrigger>
          <TabsTrigger value="history">History ({blocked.length})</TabsTrigger>
        </TabsList>

        {/* ====== KEYWORDS TAB ====== */}
        <TabsContent value="keywords" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={kwSearch} onChange={e => setKwSearch(e.target.value)} placeholder="Search keywords..." className="w-full rounded-input border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <Button size="sm" onClick={() => { setShowAddKw(true); setEditKwId(null); setKwForm({ keyword: "", category: "Other", severity: "high" }); }} className="gap-1">
              <Plus className="h-4 w-4" /> Add Keyword
            </Button>
          </div>

          {showAddKw && (
            <div className="rounded-card border border-border bg-card p-4 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">{editKwId ? "Edit" : "Add"} Banned Keyword</h3>
                <button onClick={() => { setShowAddKw(false); setEditKwId(null); }} className="p-1 hover:bg-muted rounded-full"><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <input value={kwForm.keyword} onChange={e => setKwForm(p => ({ ...p, keyword: e.target.value }))} placeholder="Keyword or phrase..." className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <div className="flex gap-2">
                <select value={kwForm.category} onChange={e => setKwForm(p => ({ ...p, category: e.target.value }))} className="rounded-input border border-border bg-background px-3 py-2 text-sm flex-1">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={kwForm.severity} onChange={e => setKwForm(p => ({ ...p, severity: e.target.value as BannedKeyword["severity"] }))} className="rounded-input border border-border bg-background px-3 py-2 text-sm flex-1">
                  {SEVERITIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Button size="sm" onClick={saveKw} disabled={!kwForm.keyword.trim()} className="gap-1"><Check className="h-4 w-4" /> {editKwId ? "Update" : "Add"}</Button>
            </div>
          )}

          <div className="rounded-card border border-border bg-card shadow-card overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_120px_80px_100px_80px] gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
              <span>Keyword</span><span>Category</span><span>Severity</span><span>Added</span><span>Actions</span>
            </div>
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
              {filteredKw.map(k => (
                <div key={k.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_80px_100px_80px] gap-2 px-4 py-3 items-center hover:bg-accent/50 transition-colors">
                  <span className="text-sm font-medium text-foreground">{k.keyword}</span>
                  <span className="text-xs text-muted-foreground">{k.category}</span>
                  <span>{sevBadge(k.severity)}</span>
                  <span className="text-xs text-muted-foreground">{k.addedAt}</span>
                  <div className="flex gap-1">
                    <button onClick={() => startEditKw(k)} className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => deleteKw(k.id)} className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
              {filteredKw.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No keywords found</p>}
            </div>
          </div>
        </TabsContent>

        {/* ====== BLOCKED QUEUE TAB ====== */}
        <TabsContent value="blocked" className="space-y-3">
          {blocked.filter(b => b.status === "blocked" || b.status === "appealed").length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No pending blocked listings</p>
          )}
          {blocked.filter(b => b.status === "blocked" || b.status === "appealed").map(b => (
            <div key={b.id} className="rounded-card border border-destructive/20 bg-card p-4 shadow-card space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-foreground">{b.productName}</p>
                    {statusBadge(b.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Seller: <span className="font-medium text-foreground">{b.sellerName}</span> ({b.sellerId})</p>
                  <p className="text-xs text-muted-foreground">Blocked: {new Date(b.blockedAt).toLocaleString("en-IN")}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {b.matchedKeywords.map(kw => (
                      <span key={kw} className="rounded-pill bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">🚫 {kw}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)} className="p-1 hover:bg-muted rounded-full">
                  {expandedId === b.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>

              {expandedId === b.id && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Product Description</p>
                    <p className="text-sm text-foreground bg-muted/50 rounded-input p-2">{b.productDescription}</p>
                  </div>
                  {b.status === "appealed" && (
                    <div className="rounded-input bg-warning/5 border border-warning/20 p-3">
                      <p className="text-xs font-semibold text-warning flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Seller Appeal</p>
                      <p className="text-sm text-foreground mt-1">{b.appealMessage}</p>
                      {b.appealProof && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><FileText className="h-3 w-3" /> Attached: {b.appealProof}</p>}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => updateListingStatus(b.id, "confirmed", "Block confirmed by admin")} className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                  <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Confirm Block
                </Button>
                <Button size="sm" variant="outline" onClick={() => updateListingStatus(b.id, "whitelisted", "Whitelisted by admin")} className="text-xs text-success border-success/30 hover:bg-success/10">
                  <Check className="h-3.5 w-3.5 mr-1" /> Whitelist
                </Button>
                {b.status === "appealed" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => updateListingStatus(b.id, "appeal-approved", "Appeal approved")} className="text-xs text-success border-success/30 hover:bg-success/10">
                      Approve Appeal
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateListingStatus(b.id, "appeal-rejected", "Appeal rejected")} className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                      Reject Appeal
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ====== GEO-BLOCK TAB ====== */}
        <TabsContent value="geo" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Restrict products/categories to specific Indian states</p>
            <Button size="sm" onClick={() => setShowAddGeo(true)} className="gap-1"><Plus className="h-4 w-4" /> Add Rule</Button>
          </div>

          {showAddGeo && (
            <div className="rounded-card border border-border bg-card p-4 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">New Geo-Block Rule</h3>
                <button onClick={() => setShowAddGeo(false)} className="p-1 hover:bg-muted rounded-full"><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <input value={geoForm.keyword} onChange={e => setGeoForm(p => ({ ...p, keyword: e.target.value }))} placeholder="Product keyword (e.g. gutka)..." className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={geoForm.reason} onChange={e => setGeoForm(p => ({ ...p, reason: e.target.value }))} placeholder="Reason (e.g. State ban under FSSA)..." className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Blocked States</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {allStates.map(state => (
                    <button key={state} onClick={() => toggleGeoState(state)} className={`rounded-pill px-2.5 py-1 text-xs font-medium transition-all ${geoForm.blockedStates.includes(state) ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                      {state}
                    </button>
                  ))}
                </div>
              </div>
              <Button size="sm" onClick={saveGeo} disabled={!geoForm.keyword.trim() || geoForm.blockedStates.length === 0} className="gap-1"><Check className="h-4 w-4" /> Create Rule</Button>
            </div>
          )}

          <div className="space-y-2">
            {geoRules.map(r => (
              <div key={r.id} className="rounded-card border border-border bg-card px-4 py-3 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">"{r.keyword}"</p>
                    <p className="text-xs text-muted-foreground">{r.reason}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.blockedStates.map(s => (
                        <span key={s} className="rounded-pill bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => deleteGeo(r.id)} className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
            {geoRules.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No geo-block rules</p>}
          </div>
        </TabsContent>

        {/* ====== HISTORY TAB ====== */}
        <TabsContent value="history" className="space-y-2">
          {blocked.map(b => (
            <div key={b.id} className="rounded-card border border-border bg-card px-4 py-3 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{b.productName}</p>
                    {statusBadge(b.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {b.sellerName} · {new Date(b.blockedAt).toLocaleDateString("en-IN")} · Keywords: {b.matchedKeywords.join(", ")}
                  </p>
                  {b.adminNotes && <p className="text-xs text-muted-foreground italic mt-0.5">Note: {b.adminNotes}</p>}
                </div>
                <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)} className="p-1 hover:bg-muted rounded-full">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
          {blocked.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No blocked listing history</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BannedProductsTab;
