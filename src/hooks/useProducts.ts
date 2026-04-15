import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  image_url: string | null;
  gallery_images: string[];
  specs: [string, string][];
  variants: { sizes?: string[]; colors?: { name: string; hex: string }[] };
  prices: { platform: string; price: number; url: string; isAffiliate: boolean; inStock: boolean; city?: string; shopName?: string }[];
  mrp: number;
  status: string;
  created_at: string;
  updated_at: string;
}

function mapRow(row: any): DbProduct {
  return {
    ...row,
    gallery_images: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    specs: Array.isArray(row.specs) ? row.specs : [],
    variants: row.variants && typeof row.variants === "object" ? row.variants : {},
    prices: Array.isArray(row.prices) ? row.prices : [],
  };
}

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*").eq("status", "active");
      if (category) query = query.eq("category", category);
      const { data, error } = await query.order("name");
      if (error) throw error;
      return (data || []).map(mapRow) as DbProduct[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) as DbProduct : null;
    },
    enabled: !!slug,
  });
}
