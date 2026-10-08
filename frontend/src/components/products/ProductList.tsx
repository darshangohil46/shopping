"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Plus } from "lucide-react";
import { productsService } from "../../services/products.service";
import { cartService } from "../../services/cart.service";
import { Product } from "../../types/product.types";
import { useToast } from "../../hooks/useToast";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function ProductList() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await productsService.getProducts();
        if (isMounted) {
          setProducts(response.products || []);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load products";
        toast(message, "error");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleAddToCart = async (product: Product) => {
    setAddingId(product.id);
    try {
      await cartService.addToCart(product.id, 1);
      toast(`Added "${product.name}" to cart!`, "success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to add item to cart";
      toast(msg, "error");
    } finally {
      setAddingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
        <p className="text-xs">Loading products catalog...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Product Catalog
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Browse our list of available hardware and accessories (
            {products.length} products).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-sm text-slate-500">
            No products available at the moment.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col justify-between p-4 bg-white border border-slate-200/90 rounded-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col gap-3">
                {/* Product Image */}
                <div className="relative w-full h-44 bg-slate-50 rounded-sm overflow-hidden border border-slate-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  {product.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  Rs. {Number(product.price).toLocaleString()}
                </span>
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(product)}
                  disabled={addingId === product.id}
                  className="text-xs px-3.5 py-1.5 flex items-center gap-1"
                >
                  {addingId === product.id ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{addingId === product.id ? "Adding..." : "Add"}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
