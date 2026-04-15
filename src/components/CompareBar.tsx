import React from "react";
import { Link } from "react-router-dom";
import { Scale, X } from "lucide-react";

interface CompareBarProps {
  items: { id: number; name: string }[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ items, onRemove, onClear }) => {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 animate-fade-in md:bottom-0">
      <div className="container">
        <div className="flex items-center gap-3 rounded-t-2xl bg-secondary px-4 py-3 shadow-lg">
          <Scale className="h-5 w-5 text-primary" />
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {items.map((item) => (
              <span key={item.id} className="flex items-center gap-1 rounded-full bg-secondary-foreground/10 px-3 py-1 text-xs font-medium text-secondary-foreground">
                {item.name}
                <button onClick={() => onRemove(item.id)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <button onClick={onClear} className="text-xs text-secondary-foreground/60 hover:text-secondary-foreground">
            Clear
          </button>
          <Link
            to={`/compare?ids=${items.map((i) => i.id).join(",")}`}
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))]"
          >
            Compare Now ({items.length})
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
