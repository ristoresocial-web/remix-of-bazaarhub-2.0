import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Globe, Plus, Pencil, Trash2, GripVertical, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";
import {
  getAllPlatforms, savePlatforms, addPlatform, updatePlatform, deletePlatform,
  type OnlinePlatform,
} from "@/data/platformsData";
import { citiesByState } from "@/lib/cityUtils";

const ALL_STATES = Object.keys(citiesByState);

const emptyForm = {
  name: "",
  logoUrl: "",
  baseUrl: "",
  searchUrlTemplate: "",
  affiliateUrlTemplate: "",
  displayOrder: 10,
  active: true,
  states: [] as string[],
  isAffiliate: false,
  brandColor: "24 100% 50%",
  affiliateDisclaimer: "",
};

const PlatformsTab: React.FC = () => {
  const [platforms, setPlatforms] = useState<OnlinePlatform[]>(getAllPlatforms());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [stateSearch, setStateSearch] = useState("");

  const refresh = () => setPlatforms(getAllPlatforms());

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: OnlinePlatform) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      logoUrl: p.logoUrl,
      baseUrl: p.baseUrl,
      searchUrlTemplate: p.searchUrlTemplate,
      affiliateUrlTemplate: p.affiliateUrlTemplate,
      displayOrder: p.displayOrder,
      active: p.active,
      states: p.states,
      isAffiliate: p.isAffiliate,
      brandColor: p.brandColor,
      affiliateDisclaimer: p.affiliateDisclaimer,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.baseUrl || !form.searchUrlTemplate) {
      toast.error("Name, Base URL, and Search URL Template are required.");
      return;
    }
    if (!form.searchUrlTemplate.includes("{query}")) {
      toast.error("Search URL Template must contain {query} placeholder.");
      return;
    }
    if (editingId) {
      updatePlatform(editingId, form);
      toast.success(`${form.name} updated.`);
    } else {
      addPlatform(form);
      toast.success(`${form.name} added.`);
    }
    setDialogOpen(false);
    refresh();
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePlatform(deleteId);
      toast.success("Platform deleted.");
      setDeleteId(null);
      refresh();
    }
  };

  const toggleActive = (id: string, current: boolean) => {
    updatePlatform(id, { active: !current });
    refresh();
  };

  const toggleState = (state: string) => {
    setForm((f) => ({
      ...f,
      states: f.states.includes(state)
        ? f.states.filter((s) => s !== state)
        : [...f.states, state],
    }));
  };

  const filteredStates = ALL_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Online Platforms</h2>
          <Badge variant="secondary" className="text-xs">
            {platforms.filter((p) => p.active).length} active
          </Badge>
        </div>
        <Button size="sm" onClick={openAdd} className="gap-1">
          <Plus className="h-4 w-4" /> Add Platform
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Manage online shopping platforms shown in search results. Changes reflect immediately.
      </p>

      {/* Platform list */}
      <div className="space-y-3">
        {platforms
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((p) => (
            <div
              key={p.id}
              className={`rounded-card border bg-card p-4 shadow-card flex items-center justify-between gap-4 flex-wrap transition-all duration-200 ${
                p.active ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">
                  {p.logoUrl ? (
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground truncate">{p.name}</p>
                    {p.isAffiliate && (
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        Affiliate
                      </Badge>
                    )}
                    <Badge
                      variant={p.active ? "default" : "secondary"}
                      className="text-[10px] shrink-0"
                    >
                      {p.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Order: {p.displayOrder} · {p.baseUrl}
                    {p.states.length > 0 && ` · ${p.states.length} state${p.states.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={p.active}
                  onCheckedChange={() => toggleActive(p.id, p.active)}
                />
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setDeleteId(p.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <a
                  href={p.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Platform" : "Add New Platform"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Platform Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Snapdeal"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Platform Logo URL</Label>
              <Input
                value={form.logoUrl}
                onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                placeholder="https://example.com/logo.svg"
              />
              {form.logoUrl && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 w-8 rounded border border-border bg-background flex items-center justify-center">
                    <img src={form.logoUrl} alt="Preview" className="h-6 w-6 object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground">Logo preview</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Base URL *</Label>
              <Input
                value={form.baseUrl}
                onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
                placeholder="https://www.example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Search URL Template *</Label>
              <Input
                value={form.searchUrlTemplate}
                onChange={(e) => setForm((f) => ({ ...f, searchUrlTemplate: e.target.value }))}
                placeholder="https://www.example.com/search?q={query}"
              />
              <p className="text-[10px] text-muted-foreground">
                Use <code className="bg-muted px-1 rounded">{"{query}"}</code> as placeholder for search term.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Affiliate URL Template (optional)</Label>
              <Input
                value={form.affiliateUrlTemplate}
                onChange={(e) => setForm((f) => ({ ...f, affiliateUrlTemplate: e.target.value }))}
                placeholder="https://www.example.com/search?q={query}&affid=xyz"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isAffiliate}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isAffiliate: v }))}
                />
                <Label className="cursor-pointer">Affiliate platform</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))}
                />
                <Label className="cursor-pointer">Active</Label>
              </div>
            </div>

            {form.isAffiliate && (
              <div className="space-y-1.5">
                <Label>Affiliate Disclaimer Text</Label>
                <Input
                  value={form.affiliateDisclaimer}
                  onChange={(e) => setForm((f) => ({ ...f, affiliateDisclaimer: e.target.value }))}
                  placeholder="Affiliate link. We earn from qualifying purchases."
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Brand Color (HSL)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={form.brandColor}
                  onChange={(e) => setForm((f) => ({ ...f, brandColor: e.target.value }))}
                  placeholder="24 100% 50%"
                  className="flex-1"
                />
                <div
                  className="h-8 w-8 rounded border border-border shrink-0"
                  style={{ backgroundColor: `hsl(${form.brandColor})` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Available States (leave empty for all India)</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  placeholder="Filter states..."
                  className="pl-8 text-xs h-8"
                />
              </div>
              {form.states.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {form.states.map((s) => (
                    <Badge
                      key={s}
                      variant="default"
                      className="text-[10px] cursor-pointer"
                      onClick={() => toggleState(s)}
                    >
                      {s} ×
                    </Badge>
                  ))}
                </div>
              )}
              <div className="max-h-32 overflow-y-auto rounded border border-border p-1.5 space-y-0.5">
                {filteredStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => toggleState(state)}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                      form.states.includes(state)
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Save Changes" : "Add Platform"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Platform</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the platform from all search results. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlatformsTab;
