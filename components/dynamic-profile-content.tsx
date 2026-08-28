"use client";

import { usePortfolioProfile } from "@/components/profile-provider";

function Headline({ value }: { value: string }) {
  const parts = value.split(/(\.)/).filter(Boolean);
  return <h1>{parts.map((part, index) => part === "." ? <span key={`${part}-${index}`}>.</span> : part)}</h1>;
}

export function HomeHeroProfile() {
  const profile = usePortfolioProfile();
  return (
    <>
      <p className="eyebrow">Monitoring, Evaluation • Information Management • Data • GIS</p>
      <Headline value={profile.headline} />
      <p className="home-hero__intro">{profile.introduction}</p>
    </>
  );
}

export function AboutProfileCopy() {
  const profile = usePortfolioProfile();
  return (
    <div className="about-hero__copy">
      <p>{profile.introduction}</p>
      <p>{profile.shortBio}</p>
    </div>
  );
}

