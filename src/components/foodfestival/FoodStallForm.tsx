import React, { useState } from "react";
import { X, Plus, MapPin, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CUISINE_OPTIONS, CuisineType } from "@/data/foodFestivalData";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
}

const FoodStallForm: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState({
    stallName: "",
    ownerName: "",
    cuisineType: "" as CuisineType | "",
    address: "",
    googleMapsPin: "",
    festivalName: "",
    startDate: "",
    endDate: "",
    todaysMenu: "",
    whatsappNumber: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [menuPhoto, setMenuPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const handlePhotoAdd = () => {
    if (photos.length >= 5) { toast.error("Maximum 5 photos allowed"); return; }
    // Simulate upload with placeholder
    const placeholders = [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop",
    ];
    setPhotos((p) => [...p, placeholders[p.length % placeholders.length]]);
    toast.success("Photo added");
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.stallName.trim()) newErrors.stallName = "Stall name is required";
    if (!form.cuisineType) newErrors.cuisineType = "Select a cuisine type";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (!form.whatsappNumber.trim() || form.whatsappNumber.replace(/\D/g, "").length < 10) newErrors.whatsappNumber = "Valid WhatsApp number required";
    if (photos.length < 1) newErrors.photos = "At least 1 stall photo required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors");
      return;
    }

    toast.success("🎉 Stall listing submitted for review!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card bg-card p-6 shadow-lg border border-border">
        <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1 hover:bg-muted">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <h2 className="mb-1 text-lg font-bold text-foreground">🍽️ List Your Food Stall</h2>
        <p className="mb-5 text-xs text-muted-foreground">Fill in details to get listed on BazaarHub Food Festival</p>

        <div className="space-y-4">
          {/* Stall Name */}
          <div>
            <Label className="text-xs font-semibold">Stall Name *</Label>
            <Input value={form.stallName} onChange={(e) => set("stallName", e.target.value)} placeholder="e.g., Madurai Jigarthanda King" />
            {errors.stallName && <p className="mt-1 text-xs text-destructive">{errors.stallName}</p>}
          </div>

          {/* Owner Name */}
          <div>
            <Label className="text-xs font-semibold">Owner Name</Label>
            <Input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} placeholder="Your name" />
          </div>

          {/* Cuisine Type */}
          <div>
            <Label className="text-xs font-semibold">Cuisine Type *</Label>
            <Select value={form.cuisineType} onValueChange={(v) => set("cuisineType", v)}>
              <SelectTrigger><SelectValue placeholder="Select cuisine" /></SelectTrigger>
              <SelectContent>
                {CUISINE_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.cuisineType && <p className="mt-1 text-xs text-destructive">{errors.cuisineType}</p>}
          </div>

          {/* Address + Maps */}
          <div>
            <Label className="text-xs font-semibold">Location Address *</Label>
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address" />
            {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
            <div className="mt-2">
              <Label className="text-xs font-semibold">Google Maps Link</Label>
              <div className="flex gap-2">
                <Input value={form.googleMapsPin} onChange={(e) => set("googleMapsPin", e.target.value)} placeholder="Paste Google Maps link" className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => { set("googleMapsPin", "https://maps.google.com/?q=9.9195,78.1194"); toast.success("Location detected"); }}>
                  <MapPin className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Festival Name */}
          <div>
            <Label className="text-xs font-semibold">Festival or Event Name (optional)</Label>
            <Input value={form.festivalName} onChange={(e) => set("festivalName", e.target.value)} placeholder="e.g., Pongal Food Fest 2025" />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">Start Date *</Label>
              <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
              {errors.startDate && <p className="mt-1 text-xs text-destructive">{errors.startDate}</p>}
            </div>
            <div>
              <Label className="text-xs font-semibold">End Date *</Label>
              <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
              {errors.endDate && <p className="mt-1 text-xs text-destructive">{errors.endDate}</p>}
            </div>
          </div>

          {/* Today's Menu */}
          <div>
            <Label className="text-xs font-semibold">Today's Menu</Label>
            <Textarea value={form.todaysMenu} onChange={(e) => set("todaysMenu", e.target.value)} placeholder="List your menu items..." rows={3} />
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => { setMenuPhoto("uploaded"); toast.success("Menu photo added"); }}>
                <Upload className="mr-1 h-3.5 w-3.5" /> Upload Menu Photo
              </Button>
              {menuPhoto && <span className="ml-2 text-xs text-success">✓ Photo added</span>}
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <Label className="text-xs font-semibold">WhatsApp Number *</Label>
            <Input value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="e.g., 9876543210" />
            {errors.whatsappNumber && <p className="mt-1 text-xs text-destructive">{errors.whatsappNumber}</p>}
          </div>

          {/* Stall Photos */}
          <div>
            <Label className="text-xs font-semibold">Stall Photos * (min 1, max 5)</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                  <img src={p} alt={`Stall ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                    className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  onClick={handlePhotoAdd}
                  className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>
            {errors.photos && <p className="mt-1 text-xs text-destructive">{errors.photos}</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit}>Submit Listing</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodStallForm;
