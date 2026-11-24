"use client";

import React from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import { ProductItem } from "./add-business.types";

interface AddBusinessProductsSectionProps {
  products: ProductItem[];
  onAddProduct: () => void;
  onRemoveProduct: (index: number) => void;
  onProductChange: (index: number, field: keyof ProductItem, value: string) => void;
}

export function AddBusinessProductsSection({
  products,
  onAddProduct,
  onRemoveProduct,
  onProductChange,
}: AddBusinessProductsSectionProps) {
  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Products &amp; Offerings
          </label>
        </div>
        <button
          type="button"
          onClick={onAddProduct}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="space-y-3">
        {products.map((item, index) => (
          <div
            key={item.id}
            className="p-3 rounded-xl border border-border bg-surface-hover/30 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-secondary">
                Product #{index + 1}
              </span>
              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveProduct(index)}
                  className="p-1 text-destructive hover:opacity-80 transition-opacity cursor-pointer"
                  title="Remove product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => onProductChange(index, "name", e.target.value)}
                placeholder="Product Name (e.g. CNC Machine)"
                className="px-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary focus:outline-none"
              />
              <input
                type="text"
                value={item.category}
                onChange={(e) => onProductChange(index, "category", e.target.value)}
                placeholder="Product Category (e.g. Heavy Equipment)"
                className="px-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary focus:outline-none"
              />
            </div>

            <input
              type="text"
              value={item.description}
              onChange={(e) => onProductChange(index, "description", e.target.value)}
              placeholder="Short description / specs"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
