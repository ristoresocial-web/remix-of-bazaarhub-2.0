import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, X, GripVertical } from "lucide-react";

interface Category {
  id: number; nameEn: string; nameRegional: string; icon: string; parent: string; sortOrder: number; productCount: number;
}

const initialCategories: Category[] = [
  { id: 1, nameEn: "Mobiles", nameRegional: "மொபைல்", icon: "📱", parent: "", sortOrder: 1, productCount: 245 },
  { id: 2, nameEn: "TVs", nameRegional: "டிவி", icon: "📺", parent: "", sortOrder: 2, productCount: 156 },
  { id: 3, nameEn: "Refrigerators", nameRegional: "குளிர்சாதனம்", icon: "🧊", parent: "", sortOrder: 3, productCount: 112 },
  { id: 4, nameEn: "Washing Machines", nameRegional: "சலவை இயந்திரம்", icon: "🧺", parent: "", sortOrder: 4, productCount: 134 },
  { id: 5, nameEn: "Laptops", nameRegional: "லேப்டாப்", icon: "💻", parent: "", sortOrder: 5, productCount: 189 },
  { id: 6, nameEn: "ACs", nameRegional: "ஏசி", icon: "❄️", parent: "", sortOrder: 6, productCount: 87 },
  { id: 7, nameEn: "Electronics", nameRegional: "மின்னணு", icon: "🔌", parent: "", sortOrder: 7, productCount: 312 },
  { id: 8, nameEn: "Clothing & Fashion", nameRegional: "ஆடை", icon: "👗", parent: "", sortOrder: 8, productCount: 450 },
  { id: 9, nameEn: "Books & Education", nameRegional: "புத்தகங்கள்", icon: "📚", parent: "", sortOrder: 9, productCount: 203 },
  { id: 10, nameEn: "Home & Kitchen", nameRegional: "வீடு & சமையலறை", icon: "🏠", parent: "", sortOrder: 10, productCount: 178 },
  { id: 11, nameEn: "Android Phones", nameRegional: "ஆண்ட்ராய்ட்", icon: "📱", parent: "Mobiles", sortOrder: 1, productCount: 180 },
  { id: 12, nameEn: "iPhones", nameRegional: "ஐஃபோன்", icon: "📱", parent: "Mobiles", sortOrder: 2, productCount: 65 },
];

const CategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nameEn: "", nameRegional: "", icon: "", parent: "", sortOrder: 0 });

  const parentOptions = categories.filter(c => !c.parent).map(c => c.nameEn);

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ nameEn: cat.nameEn, nameRegional: cat.nameRegional, icon: cat.icon, parent: cat.parent, sortOrder: cat.sortOrder });
    setShowCreate(false);
  };

  const saveCreate = () => {
    if (!form.nameEn) return;
    const id = Math.max(...categories.map(c => c.id)) + 1;
    setCategories(prev => [...prev, { id, ...form, productCount: 0 }]);
    setForm({ nameEn: "", nameRegional: "", icon: "", parent: "", sortOrder: 0 });
    setShowCreate(false);
  };

  const saveEdit = () => {
    if (editId === null) return;
    setCategories(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
    setEditId(null);
  };

  const deleteCategory = (id: number) => setCategories(prev => prev.filter(c => c.id !== id));

  const renderForm = (onSave: () => void, onCancel: () => void) => (
    <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
      <h3 className="font-semibold text-foreground">{editId ? "Edit Category" : "New Category"}</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Name (English) *</label>
          <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} placeholder="e.g. Smart Watches" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Name (Regional)</label>
          <input value={form.nameRegional} onChange={e => setForm(f => ({ ...f, nameRegional: e.target.value }))} placeholder="e.g. ஸ்மார்ட் வாட்ச்" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Icon (emoji or upload URL)</label>
          <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="⌚ or image URL" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Parent Category</label>
          <select value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm">
            <option value="">None (Top-level)</option>
            {parentOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Sort Order</label>
          <input value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} type="number" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );

  const topLevel = categories.filter(c => !c.parent).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Categories</h2>
        <Button onClick={() => { setShowCreate(true); setEditId(null); setForm({ nameEn: "", nameRegional: "", icon: "", parent: "", sortOrder: categories.length + 1 }); }} className="gap-1 rounded-pill">
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      {showCreate && renderForm(saveCreate, () => setShowCreate(false))}
      {editId !== null && renderForm(saveEdit, () => setEditId(null))}

      <div className="space-y-2">
        {topLevel.map(cat => {
          const children = categories.filter(c => c.parent === cat.nameEn).sort((a, b) => a.sortOrder - b.sortOrder);
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between rounded-card border border-border bg-card px-4 py-3 shadow-card hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{cat.nameEn}</p>
                    {cat.nameRegional && <p className="text-xs text-muted-foreground">{cat.nameRegional}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{cat.productCount} products</span>
                  <Button variant="ghost" size="sm" onClick={() => startEdit(cat)} className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat.id)} className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              {children.length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {children.map(child => (
                    <div key={child.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{child.icon}</span>
                        <p className="text-sm text-foreground">{child.nameEn}</p>
                        {child.nameRegional && <span className="text-xs text-muted-foreground">({child.nameRegional})</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{child.productCount}</span>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(child)} className="h-6 w-6 p-0"><Edit2 className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteCategory(child.id)} className="h-6 w-6 p-0 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesTab;
