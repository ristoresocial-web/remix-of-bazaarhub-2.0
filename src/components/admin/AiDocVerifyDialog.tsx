import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Result {
  extracted_name: string;
  registration_number: string;
  name_match: boolean;
  confidence_score: number;
  risk_level: "Low" | "Medium" | "High";
  tamper_notes: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  expectedName: string;
  defaultDocType?: "pan" | "gst";
}

const fileToBase64 = (file: File): Promise<{ b64: string; mime: string }> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const dataUrl = r.result as string;
      const [meta, b64] = dataUrl.split(",");
      const mime = meta.match(/data:(.*?);/)?.[1] || file.type || "image/jpeg";
      resolve({ b64, mime });
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const AiDocVerifyDialog: React.FC<Props> = ({ open, onClose, expectedName, defaultDocType = "pan" }) => {
  const [docType, setDocType] = useState<"pan" | "gst">(defaultDocType);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setResult(null);
    setLoading(true);
    try {
      const { b64, mime } = await fileToBase64(file);
      setPreview(`data:${mime};base64,${b64}`);
      const { data, error } = await supabase.functions.invoke("ai-doc-verify", {
        body: { doc_type: docType, image_base64: b64, image_mime: mime, expected_name: expectedName },
      });
      if (error) throw error;
      if ((data as any)?.error) {
        toast.error((data as any).error);
        return;
      }
      setResult(data as Result);
      toast.success("AI verification complete");
    } catch (e: any) {
      toast.error(e?.message || "Verification failed — try again");
    } finally {
      setLoading(false);
    }
  };

  const riskColors: Record<string, string> = {
    Low: "bg-success/15 text-success",
    Medium: "bg-warning/15 text-warning",
    High: "bg-destructive/15 text-destructive",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> AI Document Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Verifying <span className="font-semibold text-foreground">{expectedName}</span>
          </div>

          <div className="flex gap-2">
            {(["pan", "gst"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDocType(t)}
                className={`flex-1 rounded-pill border px-3 py-1.5 text-xs font-semibold transition-all ${
                  docType === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="rounded-card border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center hover:bg-primary/10 transition-all">
              {loading ? (
                <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
              ) : (
                <Upload className="h-8 w-8 mx-auto text-primary" />
              )}
              <p className="mt-2 text-xs font-semibold text-foreground">
                {loading ? "AI scanning document..." : "Upload PAN/GST image"}
              </p>
              <p className="text-[10px] text-muted-foreground">JPG/PNG, max 5MB</p>
            </div>
          </label>

          {preview && !loading && (
            <img src={preview} alt="Preview" className="max-h-32 rounded-input border border-border mx-auto" />
          )}

          {result && (
            <div className="rounded-card border border-border bg-muted/30 p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Extracted Name</span>
                <span className="font-semibold text-foreground">{result.extracted_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{docType.toUpperCase()} Number</span>
                <span className="font-mono text-xs text-foreground">{result.registration_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name Match</span>
                {result.name_match ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-bold text-foreground">{result.confidence_score}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Risk</span>
                <span className={`rounded-pill px-2 py-0.5 text-xs font-semibold ${riskColors[result.risk_level]}`}>
                  {result.risk_level}
                </span>
              </div>
              {result.tamper_notes && (
                <p className="text-xs text-muted-foreground border-t border-border pt-2">
                  <span className="font-semibold text-foreground">Notes:</span> {result.tamper_notes}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiDocVerifyDialog;
