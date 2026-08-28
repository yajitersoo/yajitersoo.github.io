"use client";

import { ArrowUpRight, Code2, ContactRound, Mail, MapPin } from "lucide-react";
import { usePortfolioProfile } from "@/components/profile-provider";

export function PrimaryContactCard() {
  const profile = usePortfolioProfile();
  const subject = encodeURIComponent("Portfolio inquiry");
  const body = encodeURIComponent("Hello Tersoo,\n\nI would like to discuss...");
  return (
    <a href={`mailto:${profile.email}?subject=${subject}&body=${body}`} className="contact-primary-card">
      <Mail aria-hidden="true" />
      <span>Primary contact</span>
      <strong>{profile.email}</strong>
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

export function ContactOptions() {
  const profile = usePortfolioProfile();
  return (
    <section className="site-shell contact-options" aria-label="Contact channels">
      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
        <ContactRound aria-hidden="true" /><span>LinkedIn</span><strong>Professional profile and messages</strong><ArrowUpRight aria-hidden="true" />
      </a>
      <a href={profile.githubUrl} target="_blank" rel="noreferrer">
        <Code2 aria-hidden="true" /><span>GitHub</span><strong>Code, systems and technical projects</strong><ArrowUpRight aria-hidden="true" />
      </a>
      <div>
        <MapPin aria-hidden="true" /><span>Location</span><strong>{profile.location}</strong><p>Available for suitable remote and international opportunities.</p>
      </div>
    </section>
  );
}

