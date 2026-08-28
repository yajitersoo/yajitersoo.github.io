import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, Layers3, Workflow } from "lucide-react";
import { AboutProfileCopy } from "@/components/dynamic-profile-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "About",
  description: "Professional profile, experience and technical capabilities across MEL, information management, analytics and GIS.",
};

export default function AboutPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content" className="about-page">
        <section className="about-hero">
          <div className="site-shell about-hero__grid">
            <div>
              <p className="eyebrow">Professional profile</p>
              <h1>Building the systems behind trustworthy evidence.</h1>
            </div>
            <figure className="about-portrait">
              {/* A native image keeps the asset path intact in the GitHub Pages static build. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tersoo-yaji-portrait.jpeg"
                alt="Portrait of Tersoo Yaji"
                width={2048}
                height={2048}
                fetchPriority="high"
              />
              <figcaption>
                <strong>Tersoo Yaji</strong>
                <span>Information Management Specialist, UNMAS</span>
              </figcaption>
            </figure>
            <AboutProfileCopy />
          </div>
        </section>

        <section className="site-shell about-principles" aria-label="Working principles">
          <article><Layers3 aria-hidden="true" /><span>01</span><h2>Systems thinking</h2><p>I connect collection, validation, storage, analysis, reporting and use as one evidence system.</p></article>
          <article><CheckCircle2 aria-hidden="true" /><span>02</span><h2>Analytical clarity</h2><p>I make assumptions, definitions, limitations and decision signals visible rather than hiding complexity.</p></article>
          <article><Workflow aria-hidden="true" /><span>03</span><h2>Operational use</h2><p>I design products around the decisions and workflows they need to improve.</p></article>
        </section>

        <section className="section-block about-expertise" id="expertise">
          <div className="site-shell">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">Expertise</p><h2>Four disciplines, integrated around decision use.</h2></div>
              <p>{profile.shortBio}</p>
            </div>
            <div className="about-expertise__grid">
              {profile.capabilities.map((capability, index) => (
                <article key={capability.title}>
                  <span>0{index + 1}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block experience-section">
          <div className="site-shell experience-grid">
            <div className="experience-intro">
              <p className="eyebrow">Selected experience</p>
              <h2>More than a decade across humanitarian and development data environments.</h2>
              <p>Experience spans programme performance, mine action, protection, GBV, public health and digital engagement.</p>
            </div>
            <div className="experience-list">
              {profile.experience.map((item) => (
                <article key={`${item.organisation}-${item.role}`}>
                  <div className="experience-list__period">{item.period}</div>
                  <div>
                    <h3>{item.role}</h3>
                    <strong>{item.organisation}</strong>
                    <p>{item.summary}</p>
                    <div className="tag-list">{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block education-section">
          <div className="site-shell education-grid">
            <div>
              <p className="eyebrow">Education</p>
              <h2>Academic grounding for analytical and technical work.</h2>
            </div>
            <div className="education-list">
              {profile.education.map((item) => (
                <article key={item.qualification}>
                  <GraduationCap aria-hidden="true" />
                  <div><h3>{item.qualification}</h3><p>{item.institution}</p><span>{item.detail}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tools-section">
          <div className="site-shell tools-section__grid">
            <div><p className="eyebrow eyebrow--light">Technical toolkit</p><h2>Tools selected around the problem, not the trend.</h2></div>
            <div className="tools-cloud">{profile.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
          </div>
        </section>

        <section className="contact-band">
          <div className="site-shell contact-band__inner">
            <div><p className="eyebrow">Explore the work</p><h2>See how these capabilities translate into products.</h2></div>
            <Link href="/work/" className="button-link button-link--primary">Browse selected work <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
