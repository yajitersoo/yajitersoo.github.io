"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import { isViewableAsset } from "@/lib/product-links";

const imagePattern = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const videoPattern = /\.(?:mp4|webm)(?:[?#].*)?$/i;
const pdfPattern = /\.pdf(?:[?#].*)?$/i;

export function ProductViewer() {
  const searchParams = useSearchParams();
  const src = searchParams.get("src") ?? "";
  const title = searchParams.get("title") ?? "Portfolio product";
  const allowed = (src.startsWith("/projects/") || src.match(/^https:\/\//i)) && isViewableAsset(src);

  if (!allowed) {
    return (
      <main className="product-viewer product-viewer--empty">
        <h1>Product unavailable</h1>
        <p>This product address is missing or cannot be displayed safely.</p>
        <Link href="/work/" className="button-link button-link--primary"><ArrowLeft /> Return to products</Link>
      </main>
    );
  }

  return (
    <main className="product-viewer">
      <header className="product-viewer__header">
        <div>
          <span>Portfolio product</span>
          <h1>{title}</h1>
        </div>
        <div className="product-viewer__actions">
          <a href={src} target="_blank" rel="noreferrer">Open original <ExternalLink aria-hidden="true" /></a>
          <Link href="/work/" className="product-viewer__close"><X aria-hidden="true" /> Close and return to products</Link>
        </div>
      </header>
      <section className="product-viewer__stage" aria-label={`${title} product preview`}>
        {src.match(imagePattern) ? <img src={src} alt={title} /> : null}
        {src.match(videoPattern) ? <video src={src} controls /> : null}
        {src.match(pdfPattern) ? <iframe src={src} title={title} /> : null}
      </section>
    </main>
  );
}
