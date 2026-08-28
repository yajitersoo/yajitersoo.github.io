"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { usePortfolioProfile } from "@/components/profile-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { href: "/work/", label: "Work" },
  { href: "/about/", label: "About" },
  { href: "/about/#expertise", label: "Expertise" },
  { href: "/contact/", label: "Contact" },
];

export function SiteHeader() {
  const profile = usePortfolioProfile();
  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link href="/" className="site-brand" aria-label="Tersoo Yaji, home">
          <BrandMark />
          <span>{profile.displayName}</span>
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Button asChild className="header-contact">
            <Link href="/contact/">Start a conversation</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mobile-menu-trigger" aria-label="Open menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent className="mobile-navigation-panel">
              <SheetHeader>
                <SheetTitle className="mobile-navigation-title">{profile.displayName}</SheetTitle>
                <SheetDescription>Evidence, information and geospatial decision support.</SheetDescription>
              </SheetHeader>
              <nav className="mobile-navigation" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
