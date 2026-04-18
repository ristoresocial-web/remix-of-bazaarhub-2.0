import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let cachedKey: string | null = null;
let inFlight: Promise<string> | null = null;

export async function fetchMapsKey(): Promise<string> {
  if (cachedKey) return cachedKey;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const { data, error } = await supabase.functions.invoke("get-maps-key");
    if (error) {
      console.error("[googleMapsKey] failed to fetch key", error);
      return "";
    }
    cachedKey = (data?.key as string) ?? "";
    return cachedKey;
  })();

  const result = await inFlight;
  inFlight = null;
  return result;
}

export function useMapsKey(): { key: string; loading: boolean } {
  const [key, setKey] = useState<string>(cachedKey ?? "");
  const [loading, setLoading] = useState<boolean>(!cachedKey);

  useEffect(() => {
    if (cachedKey) {
      setKey(cachedKey);
      setLoading(false);
      return;
    }
    let mounted = true;
    fetchMapsKey().then((k) => {
      if (!mounted) return;
      setKey(k);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { key, loading };
}
