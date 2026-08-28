"use client";

import Link from "next/link";
import { Code2, ContactRound, Mail, MapPin } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { usePortfolioProfile } from "@/components/profile-provider";

export function SiteFooter() {
  const profile = usePortfolioProfile();
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer__grid">
        <div className="site-footer__brand">
          <div className="site-brand site-brand--footer">
            <BrandMark />
            <span>{profile.displayName}</span>
          </div>
          <p>Monitoring, evaluation, information management, data analytics and GIS.</p>
        </div>
        <div className="site-footer__detail">
          <MapPin aria-hidden="true" />
          <span>{profile.location}</span>
        </div>
        <div className="site-footer__links">
          <a href={`mailto:${profile.email}`} aria-label="Email Tersoo Yaji">
            <Mail aria-hidden="true" /> Email
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
            <ContactRound aria-hidden="true" /> LinkedIn
          </a>
          <a href={profile.githubUrl} target="_blank" rel="noreferrer">
            <Code2 aria-hidden="true" /> GitHub
          </a>
        </div>
      </div>
      <div className="site-shell site-footer__bottom">
        <span>© {new Date().getFullYear()} Tersoo Yaji</span>
        <Link href="/admin/">Portfolio administration</Link>
      </div>
    </footer>
  );
}
