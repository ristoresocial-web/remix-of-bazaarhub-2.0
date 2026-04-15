import React from "react";

interface ProductVariantsProps {
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  selectedSize: number;
  selectedColor: number;
  onSizeChange: (idx: number) => void;
  onColorChange: (idx: number) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  sizes, colors, selectedSize, selectedColor, onSizeChange, onColorChange,
}) => (
  <div className="space-y-4">
    {sizes && sizes.length > 0 && (
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Size / Variant</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size, idx) => (
            <button
              key={size}
              onClick={() => onSizeChange(idx)}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                selectedSize === idx
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    )}
    {colors && colors.length > 0 && (
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Color</p>
        <div className="flex gap-3">
          {colors.map((color, idx) => (
            <button
              key={color.name}
              title={color.name}
              onClick={() => onColorChange(idx)}
              className={`h-9 w-9 rounded-full border-2 transition-all duration-200 ${
                selectedColor === idx ? "border-primary scale-110 ring-2 ring-primary/30" : "border-border"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
        {colors[selectedColor] && (
          <p className="mt-1 text-xs text-muted-foreground">{colors[selectedColor].name}</p>
        )}
      </div>
    )}
  </div>
);

export default ProductVariants;
