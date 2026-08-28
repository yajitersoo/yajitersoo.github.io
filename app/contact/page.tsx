import type { Metadata } from "next";
import { ContactOptions, PrimaryContactCard } from "@/components/contact-profile";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Tersoo Yaji regarding MEL, information management, data analytics, GIS and evidence-system work.",
};

export default function ContactPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content" className="contact-page">
        <section className="contact-hero">
          <div className="site-shell contact-hero__grid">
            <div>
              <p className="eyebrow">Contact</p>
              <h1>Let us connect around evidence, data and decision support.</h1>
              <p>
                For professional opportunities, technical collaboration or a focused conversation about monitoring, information management, analytics or GIS, reach me through the channels below.
              </p>
            </div>
            <PrimaryContactCard />
          </div>
        </section>

        <ContactOptions />

        <section className="site-shell contact-context">
          <div><p className="eyebrow">Good context helps</p><h2>What to include in your message.</h2></div>
          <ul>
            <li><span>01</span><p>The problem, assignment or opportunity you want to discuss.</p></li>
            <li><span>02</span><p>The intended users, decision or operational outcome.</p></li>
            <li><span>03</span><p>Your timeline and any important technical constraints.</p></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
