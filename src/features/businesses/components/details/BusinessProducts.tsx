import React from "react";
import Image from "next/image";
import { Package, ArrowRight } from "lucide-react";
import { BusinessProduct } from "../../types/business.types";
import { EmptyState } from "@/components/common/EmptyState";
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
        icon={<Package className="w-8 h-8" />}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {APP_HEADERS.businessDetails.sections.productsAndServices}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse verified industrial products manufactured and supplied by this entity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
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
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors mt-0.5 line-clamp-1">
                  {product.name}
                </h3>
                {product.priceRange && (
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    {product.priceRange}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onEnquire && onEnquire(product)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                <span>Request Price / Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
