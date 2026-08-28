/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Globe2,
  MapPinned,
} from "lucide-react";
import { HomeHeroProfile } from "@/components/dynamic-profile-content";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/data/profile";
import { featuredProjects } from "@/lib/projects";

const capabilityIcons = [CheckCircle2, Database, BarChart3, MapPinned];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content">
        <section className="home-hero">
          <div className="site-shell home-hero__grid">
            <div className="home-hero__copy">
              <HomeHeroProfile />
              <div className="button-row">
                <Link href="/work/" className="button-link button-link--primary">
                  Explore selected work <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/about/" className="button-link button-link--secondary">
                  View professional profile
                </Link>
              </div>
              <div className="home-hero__availability">
                <span aria-hidden="true" />
                Based in Abuja, working across humanitarian and development contexts
              </div>
            </div>

            <div className="evidence-visual" aria-label="Geospatial and analytical portfolio preview">
              <div className="evidence-visual__image">
                <img
                  src="/projects/thumbs/alleged-tomahawk-strikes-in-nigeria.webp"
                  alt="Geospatial analysis map from the portfolio"
                />
              </div>
              <div className="evidence-visual__topline">
                <span>Decision support</span>
                <span>GIS + Analytics</span>
              </div>
              <div className="evidence-visual__metric evidence-visual__metric--one">
                <MapPinned aria-hidden="true" />
                <div><strong>Spatial context</strong><span>Patterns made visible</span></div>
              </div>
              <div className="evidence-visual__metric evidence-visual__metric--two">
                <BarChart3 aria-hidden="true" />
                <div><strong>Decision signals</strong><span>Evidence made usable</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-stats" aria-label="Professional summary">
          <div className="site-shell home-stats__grid">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="home-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
            <div className="home-stat home-stat--context">
              <Globe2 aria-hidden="true" />
              <span>Humanitarian and development experience</span>
            </div>
          </div>
        </section>

        <section className="section-block section-block--capabilities" id="expertise">
          <div className="site-shell">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">Core disciplines</p>
                <h2>Connecting evidence systems from collection to decision.</h2>
              </div>
              <p>
                My work combines programme logic, information architecture, analytical methods and geospatial thinking in one coherent workflow.
              </p>
            </div>
            <div className="capability-grid">
              {profile.capabilities.map((capability, index) => {
                const Icon = capabilityIcons[index];
                return (
                  <article key={capability.title} className="capability-card">
                    <Icon aria-hidden="true" />
                    <span>0{index + 1}</span>
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-block section-block--work">
          <div className="site-shell">
            <div className="section-heading section-heading--split section-heading--work">
              <div>
                <p className="eyebrow">Featured work</p>
                <h2>Selected analytical and geospatial products.</h2>
              </div>
              <Link href="/work/" className="text-link">
                Browse all 57 projects <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="featured-project-grid">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} priority={index === 0} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-block section-block--approach">
          <div className="site-shell approach-grid">
            <div className="approach-copy">
              <p className="eyebrow eyebrow--light">How I work</p>
              <h2>The product is only as reliable as the system behind it.</h2>
              <p>
                I strengthen the full evidence chain, from indicator definitions and reporting flows to data quality, analysis, visual communication and evidence use.
              </p>
              <Link href="/about/" className="text-link text-link--light">
                Read about my approach <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <ol className="approach-steps">
              <li><span>01</span><div><strong>Frame</strong><p>Clarify the decision, users and evidence requirement.</p></div></li>
              <li><span>02</span><div><strong>Structure</strong><p>Align indicators, data models, responsibilities and controls.</p></div></li>
              <li><span>03</span><div><strong>Analyse</strong><p>Surface patterns, gaps, performance and uncertainty.</p></div></li>
              <li><span>04</span><div><strong>Enable action</strong><p>Translate findings into clear products and follow-through.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="contact-band">
          <div className="site-shell contact-band__inner">
            <div>
              <p className="eyebrow">Collaboration</p>
              <h2>Need evidence that is easier to trust, interpret and use?</h2>
            </div>
            <Link href="/contact/" className="button-link button-link--primary">
              Start a conversation <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
