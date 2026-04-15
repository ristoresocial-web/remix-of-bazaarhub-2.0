import React, { useState } from "react";
import { X, Flag } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, productName }) => {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setReason(""); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Flag className="h-5 w-5 text-primary" /> Report Info
          </h3>
          <button onClick={onClose} className="rounded-full p-1 transition-all duration-200 hover:bg-accent">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold text-success">Thank you!</p>
            <p className="text-sm text-muted-foreground">We'll review and update the info for {productName}.</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">Help us improve — let us know what needs updating for <strong>{productName}</strong>.</p>
            <select className="mb-3 w-full rounded-input border border-border bg-background p-2.5 text-sm outline-none focus:border-primary">
              <option>Price is different</option>
              <option>Product details are incorrect</option>
              <option>Seller info is outdated</option>
              <option>Product not available</option>
              <option>Other</option>
            </select>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Add details (optional)..."
              className="mb-4 w-full rounded-input border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              className="w-full rounded-pill bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark"
            >
              Submit Report
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
