import { Suspense } from "react";
import type { Metadata } from "next";
import { CaseStudyView } from "@/components/case-study-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Project Case Study",
  description: "A portfolio case study covering the context, methods, contribution, outputs and decision value behind the work.",
};

export default function CaseStudyPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content">
        <Suspense fallback={<div className="case-study-loading site-shell">Loading project...</div>}>
          <CaseStudyView />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
