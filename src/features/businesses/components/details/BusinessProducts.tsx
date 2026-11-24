"use client";

import React from "react";
import Image from "next/image";
import { Package, ArrowRight } from "lucide-react";
import { BusinessProduct } from "../../types/business.types";
import { EmptyState, Button } from "@/components/common";
import { APP_MESSAGES } from "@/config/messages.config";
import { APP_HEADERS } from "@/config/headers.config";

export interface BusinessProductsProps {
  products: BusinessProduct[];
  onEnquire?: (product: BusinessProduct) => void;
}

export function BusinessProducts({ products, onEnquire }: BusinessProductsProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={APP_MESSAGES.empty.noProducts.title}
        description={APP_MESSAGES.empty.noProducts.description}
        icon={<Package className="w-8 h-8 text-text-muted" />}
      />
    );
  }

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            {APP_HEADERS.businessDetails.sections.productsAndServices}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Browse verified industrial products manufactured and supplied by this entity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="group rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-44 w-full bg-background-secondary overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors mt-0.5 line-clamp-1">
                  {product.name}
                </h3>
                {product.priceRange && (
                  <p className="text-xs font-semibold text-status-success mt-1">
                    {product.priceRange}
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEnquire && onEnquire(product)}
                className="w-full justify-center text-xs"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
