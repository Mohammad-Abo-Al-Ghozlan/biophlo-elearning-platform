import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import type { PageDefinition } from "../../types";

interface PublicShellProps {
  page: PageDefinition;
  children: ReactNode;
  minimal?: boolean;
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

const searchLinks = [
  ["Cell structure and function", "/courses/cell-structure-and-function", "Course"],
  ["Plant biology quick guide", "/resources/cell-division-study-guide", "Resource"],
  ["Cellular respiration", "/videos/cellular-respiration", "Video"],
  ["Cambridge IGCSE past papers", "/past-papers", "Past papers"],
] as const;

export function PublicShell({ page, children, minimal = false }: PublicShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const results = searchLinks.filter(([label, , type]) =>
    `${label} ${type}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={`public-app${minimal ? " public-app--minimal" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="public-header">
        <div className="public-header__inner">
          <a className="brand" href="/" aria-label="BIOPHLO home">
            <img src="/assets/biophlo-logo.webp" alt="BIOPHLO" />
          </a>
          {!minimal && (
            <>
              <nav className="desktop-nav" aria-label="Main navigation">
                {navItems.map((item) => (
                  <a
                    className={page.path === item.href || (item.href !== "/" && page.path.startsWith(item.href)) ? "is-active" : ""}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </a>
                ))}
                <details className="nav-more">
                  <summary>Explore <ChevronDown size={14} /></summary>
                  <div className="nav-more__menu">
                    <a href="/subjects">Subjects</a>
                    <a href="/curricula">Curricula</a>
                    <a href="/grades">Grades &amp; levels</a>
                    <a href="/videos">Video library</a>
                    <a href="/past-papers">Past papers</a>
                  </div>
                </details>
              </nav>
              <div className="public-header__actions">
                <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)} type="button">
                  <Search size={20} />
                </button>
                <a className="icon-button cart-button" href="/cart" aria-label="Shopping cart">
                  <ShoppingBag size={20} /><span>2</span>
                </a>
                <a className="button button--outline header-login" href="/auth/login">Log in</a>
                <a className="button button--orange header-cta" href="/courses">Start learning</a>
                <button
                  className="icon-button menu-button"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-navigation"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((value) => !value)}
                  type="button"
                >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </>
          )}
          {minimal && <a className="subtle-link" href="/">Back to home <ArrowRight size={16} /></a>}
        </div>
        {!minimal && (
          <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation">
            {navItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
            <a href="/subjects">Subjects</a>
            <a href="/curricula">Curricula</a>
            <a href="/pricing">Pricing</a>
            <div className="mobile-nav__actions">
              <a className="button button--outline" href="/auth/login">Log in</a>
              <a className="button button--orange" href="/courses">Start learning</a>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content">{children}</main>

      {!minimal && (
        <footer className="public-footer">
          <div className="public-footer__lead page-container">
            <div>
              <span className="footer-mark"><BookOpen size={20} /> Biology, made memorable</span>
              <h2>Keep your curiosity moving.</h2>
            </div>
            <a className="button button--orange" href="/courses">Explore all courses <ArrowRight size={17} /></a>
          </div>
          <div className="public-footer__grid page-container">
            <div className="footer-brand">
              <img src="/assets/biophlo-logo.webp" alt="BIOPHLO" />
              <p>Clear, visual biology learning built around understanding—not memorising.</p>
              <span>© 2026 BIOPHLO. All rights reserved.</span>
            </div>
            <div>
              <h3>Learn</h3>
              <a href="/courses">Courses</a><a href="/subjects">Subjects</a><a href="/curricula">Curricula</a><a href="/pricing">Pricing</a>
            </div>
            <div>
              <h3>Resources</h3>
              <a href="/resources">Study guides</a><a href="/past-papers">Past papers</a><a href="/videos">Videos</a><a href="/verify-certificate">Verify certificate</a>
            </div>
            <div>
              <h3>BIOPHLO</h3>
              <a href="/about">About</a><a href="/instructor">Instructor</a><a href="/faq">FAQ</a><a href="/contact">Contact</a>
            </div>
            <div>
              <h3>Legal</h3>
              <a href="/legal/privacy">Privacy</a><a href="/legal/terms">Terms</a><a href="/legal/refunds">Refunds</a><a href="/legal/accessibility">Accessibility</a>
            </div>
          </div>
          <div className="public-footer__bottom page-container">
            <span>Science today. A brighter tomorrow.</span>
            <span>English (UK) · USD</span>
          </div>
        </footer>
      )}

      {searchOpen && (
        <div className="search-dialog" role="dialog" aria-modal="true" aria-label="Search BIOPHLO" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}>
          <div className="search-dialog__panel">
            <div className="search-dialog__top">
              <Search size={21} />
              <input ref={searchInput} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses, videos and resources" aria-label="Search" />
              <button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search" type="button"><X size={20} /></button>
            </div>
            <div className="search-results">
              <span className="search-results__label">{query ? `${results.length} results` : "Popular searches"}</span>
              {results.map(([label, href, type]) => (
                <a href={href} key={href}><span><small>{type}</small>{label}</span><ArrowRight size={18} /></a>
              ))}
              {results.length === 0 && <p>No matches yet. Try “cells”, “papers”, or “respiration”.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
