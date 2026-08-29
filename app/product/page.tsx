import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductViewer } from "@/components/product-viewer";

export const metadata: Metadata = {
  title: "Product Viewer",
  description: "View a portfolio product and return to the project library.",
};

export default function ProductPage() {
  return (
    <Suspense fallback={<main className="product-viewer product-viewer--empty">Opening product...</main>}>
      <ProductViewer />
    </Suspense>
  );
}
