import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Command,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { PageDefinition } from "../../types";
import { studentNavigation } from "./studentData";

type StudentLayoutProps = {
  page: PageDefinition;
  children: ReactNode;
  fullBleed?: boolean;
};

export function StudentLayout({ page, children, fullBleed = false }: StudentLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const links = studentNavigation.flatMap((group) => group.items);
    return links.filter((item) => item.label.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`student-shell ${menuOpen ? "student-shell--menu-open" : ""}`}>
      <aside className="student-rail" aria-label="Student navigation">
        <div className="student-rail__head">
          <Link to="/" className="student-brand" aria-label="BIOPHLO home">
            <img src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" />
          </Link>
          <button className="student-icon-button student-rail__close" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>

        <nav className="student-nav">
          {studentNavigation.map((group) => (
            <div className="student-nav__group" key={group.label}>
              <p className="student-nav__label">{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.match?.includes(page.id) ?? false;
                return (
                  <Link className={`student-nav__item ${active ? "is-active" : ""}`} to={item.path} key={item.path} onClick={() => setMenuOpen(false)}>
                    <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.badge && <span className="student-nav__badge">{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="student-rail__momentum">
          <span className="student-rail__flame" aria-hidden="true">7</span>
          <div>
            <strong>Day streak</strong>
            <p>Learn for 20 min today</p>
          </div>
          <div className="student-rail__mini-progress"><span style={{ width: "72%" }} /></div>
        </div>

        <div className="student-rail__footer">
          <Link to="/student/support"><HelpCircle size={17} /> Help center</Link>
          <Link to="/"><LogOut size={17} /> Back to website</Link>
        </div>
      </aside>

      <button className="student-rail-scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation overlay" />

      <div className="student-main">
        <header className="student-topbar">
          <div className="student-topbar__left">
            <button className="student-icon-button student-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
              <Menu size={21} />
            </button>
            <div className="student-crumb">
              <span>{page.group}</span>
              <b>/</b>
              <strong>{page.title}</strong>
            </div>
          </div>
          <div className="student-topbar__right">
            <button className="student-command-search" onClick={() => setSearchOpen(true)}>
              <Search size={17} />
              <span>Search your learning</span>
              <kbd><Command size={12} /> K</kbd>
            </button>
            <Link className="student-icon-button student-notification-button" to="/student/notifications" aria-label="Notifications, 3 unread">
              <Bell size={19} />
              <i />
            </Link>
            <div className="student-profile-menu">
              <button className="student-profile-trigger" onClick={() => setProfileOpen((current) => !current)} aria-expanded={profileOpen}>
                <span className="student-avatar">LH</span>
                <span className="student-profile-trigger__copy"><strong>Layla Hassan</strong><small>Plus learner</small></span>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="student-profile-popover">
                  <div><strong>Layla Hassan</strong><span>layla.hassan@example.com</span></div>
                  <Link to="/student/profile" onClick={() => setProfileOpen(false)}>View profile</Link>
                  <Link to="/student/preferences" onClick={() => setProfileOpen(false)}>Learning preferences</Link>
                  <Link to="/student/security" onClick={() => setProfileOpen(false)}>Security</Link>
                  <hr />
                  <Link to="/">Sign out</Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className={fullBleed ? "student-content student-content--full" : "student-content"}>{children}</main>
      </div>

      {searchOpen && (
        <div className="student-modal-layer" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setSearchOpen(false)}>
          <section className="student-search-modal" role="dialog" aria-modal="true" aria-label="Search your learning">
            <div className="student-search-modal__field">
              <Search size={20} />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses, lessons, resources..." aria-label="Search" />
              <button className="student-icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={18} /></button>
            </div>
            <div className="student-search-modal__body">
              {query && searchResults.length === 0 && <div className="student-empty-mini"><strong>No matching pages</strong><span>Try “courses”, “progress”, or “billing”.</span></div>}
              {!query && (
                <>
                  <p className="student-search-modal__hint">Quick destinations</p>
                  <div className="student-search-shortcuts">
                    <Link to="/student/learn/cell-structure-and-function" onClick={() => setSearchOpen(false)}><BookOpen size={18} /> Continue current lesson</Link>
                    <Link to="/student/saved" onClick={() => setSearchOpen(false)}><BookOpen size={18} /> Open saved resources</Link>
                    <Link to="/student/qa" onClick={() => setSearchOpen(false)}><HelpCircle size={18} /> Ask a course question</Link>
                  </div>
                </>
              )}
              {searchResults.map((item) => {
                const Icon = item.icon;
                return <Link key={item.path} className="student-search-result" to={item.path} onClick={() => setSearchOpen(false)}><Icon size={18} /><span><strong>{item.label}</strong><small>Open student page</small></span><kbd>↵</kbd></Link>;
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
