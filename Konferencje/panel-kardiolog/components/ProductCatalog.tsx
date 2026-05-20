"use client";

import { useDraggable } from "@dnd-kit/core";
import * as Lucide from "lucide-react";
import { products } from "@/lib/data";
import type { Product } from "@/lib/types";

interface Props {
  highlightFeature?: string | null;
}

export function ProductCatalog({ highlightFeature }: Props) {
  return (
    <aside className="w-full space-y-3">
      <div className="bg-panel rounded-xl border border-border p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Katalog produktów</div>
        <h3 className="text-base font-semibold">Przeciągnij na węzeł</h3>
        <p className="text-xs text-muted mt-1.5">
          Wybierz sekcję, w której chcesz dotrzeć do kardiologa. Kropka = placement, klik = usuń.
        </p>
      </div>

      <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
        {products.map((p) => (
          <DraggableProduct key={p.id} product={p} highlighted={highlightFeature ? p.fits.includes(highlightFeature as never) : false} />
        ))}
      </div>
    </aside>
  );
}

function DraggableProduct({ product, highlighted }: { product: Product; highlighted: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `product-${product.id}`,
    data: { productId: product.id },
  });

  const Icon = (Lucide as unknown as Record<string, React.FC<{ className?: string }>>)[product.icon] ?? Lucide.Package;

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative bg-panel border rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all select-none ${
        isDragging ? "opacity-50 shadow-2xl" : ""
      } ${highlighted ? "border-emerald-500/60 shadow-lg shadow-emerald-500/10" : "border-border hover:border-red-500/40"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${product.color}20`, borderColor: `${product.color}60`, borderWidth: 1 }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm leading-tight">{product.name}</span>
            {highlighted && (
              <span className="text-[9px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Match
              </span>
            )}
          </div>
          <div className="text-[11px] text-muted mt-1 leading-snug">{product.description}</div>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted/80">
            <span className="tabular-nums">{product.reach}</span>
            <span>·</span>
            <span>{product.pricing}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
