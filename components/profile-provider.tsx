"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { profile as seedProfile } from "@/data/profile";
import type { PortfolioProfile } from "@/lib/portfolio-types";
import { fetchPublicProfile } from "@/lib/supabase/profile";

const initialProfile: PortfolioProfile = {
  displayName: seedProfile.displayName,
  headline: seedProfile.headline,
  introduction: seedProfile.introduction,
  shortBio: seedProfile.shortBio,
  location: seedProfile.location,
  email: seedProfile.email,
  linkedinUrl: seedProfile.linkedinUrl,
  githubUrl: seedProfile.githubUrl,
  resumeUrl: null,
};

const ProfileContext = createContext<PortfolioProfile>(initialProfile);

export function PortfolioProfileProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<PortfolioProfile>(initialProfile);

  useEffect(() => {
    let active = true;
    fetchPublicProfile()
      .then((savedProfile) => {
        if (active && savedProfile) setValue(savedProfile);
      })
      .catch(() => {
        // Static profile content remains available if the optional backend is unavailable.
      });
    return () => {
      active = false;
    };
  }, []);

  const profile = useMemo(() => value, [value]);
  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
}

export const usePortfolioProfile = () => useContext(ProfileContext);

