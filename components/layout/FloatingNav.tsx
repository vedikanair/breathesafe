"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "◉" },
  { href: "/explore", label: "Explore", icon: "◎" },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Show nav after user scrolls a bit, or immediately on non-landing pages
    const isLanding = pathname === "/";

    if (!isLanding) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 100);
      setVisible(scrollY > 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (!visible && pathname === "/") return null;

  return (
    <nav
      id="floating-nav"
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        bg-white/[0.03] backdrop-blur-md border border-white/[0.08]
        px-1.5 py-1.5 rounded-2xl
        flex items-center gap-1
        transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
      `}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative px-4 py-1.5 rounded-xl text-[13px] font-medium
              transition-all duration-300
              ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/80"
              }
            `}
          >
            {item.label}
            {isActive && (
              <span 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full animate-fade-in" 
                style={{ backgroundColor: "var(--aqi-very-poor)" }} 
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
