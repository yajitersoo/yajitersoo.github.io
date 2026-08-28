import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorkExplorer } from "@/components/work-explorer";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Maps, dashboards, reports, systems and analytical products designed to support better decisions.",
};

export default function WorkPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content" className="work-page">
        <section className="work-intro">
          <div className="site-shell work-intro__grid">
            <div>
              <p className="eyebrow">Portfolio library</p>
              <h1>Selected Work</h1>
            </div>
            <p>Maps, dashboards, reports, systems and analytical products designed to support better decisions.</p>
          </div>
        </section>
        <section className="site-shell work-library" aria-label="Portfolio projects">
          <WorkExplorer />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
