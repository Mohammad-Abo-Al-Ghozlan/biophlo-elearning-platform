import { useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  Gauge,
  Layers3,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { Logo } from "../../components/common/Logo";
import { adminPages } from "../../data/pageInventory";
import type { PageDefinition } from "../../types";

interface AdminShellProps {
  page: PageDefinition;
  children: ReactNode;
}

const navigation = [
  { label: "Overview", path: "/admin", icon: Gauge },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Courses", path: "/admin/courses", icon: BookOpen },
  { label: "Enrollments", path: "/admin/enrollments", icon: Layers3 },
  { label: "Orders & payments", path: "/admin/orders", icon: ShoppingCart },
  { label: "Website content", path: "/admin/content", icon: FileText },
  { label: "Media library", path: "/admin/media", icon: Layers3 },
  { label: "Support", path: "/admin/support", icon: CircleHelp },
  { label: "Messages", path: "/admin/messages", icon: MessageCircle },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Security", path: "/admin/security", icon: ShieldCheck },
  { label: "Settings", path: "/admin/settings/general", icon: Settings },
];

export function AdminShell({ page, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return adminPages.filter((candidate) => `${candidate.title} ${candidate.group}`.toLowerCase().includes(normalized)).slice(0, 8);
  }, [query]);

  const selectResult = (path: string) => {
    setQuery("");
    navigate(path);
  };

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">Skip to content</a>
      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`} aria-label="Administration navigation">
        <div className="admin-sidebar-head">
          <Logo />
          <button className="icon-control admin-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>
        <nav className="admin-nav">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              to={path}
              key={path}
              end={path === "/admin"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <div className="admin-health"><span /> All systems operational</div>
          <p>BIOPHLO admin · Frontend demo</p>
        </div>
      </aside>
      {menuOpen ? <button className="admin-sidebar-scrim" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation" /> : null}

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button className="icon-control admin-menu" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <Menu size={19} />
          </button>
          <div className="admin-search">
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && results[0]) selectResult(results[0].path);
              }}
              placeholder="Search pages, learners, courses, or orders…"
              aria-label="Search administration pages"
            />
            {results.length ? (
              <div className="admin-search-results">
                {results.map((result) => (
                  <button type="button" key={result.id} onClick={() => selectResult(result.path)}>
                    <span>{result.title}</span>
                    <small>{result.group}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="admin-top-actions">
            <Link className="icon-control notification-control" to="/admin/announcements" aria-label="Announcements">
              <Bell size={18} />
              <span />
            </Link>
            <div className="admin-profile-wrap">
              <button className="admin-profile" type="button" onClick={() => setProfileOpen((current) => !current)} aria-expanded={profileOpen}>
                <span className="admin-avatar">SA</span>
                <span><strong>Dr. Sarah Ahmed</strong><small>Administrator</small></span>
                <ChevronDown size={16} />
              </button>
              {profileOpen ? (
                <div className="admin-profile-menu">
                  <Link to="/admin/users/layla-hassan" onClick={() => setProfileOpen(false)}>View account</Link>
                  <Link to="/admin/settings/general" onClick={() => setProfileOpen(false)}>Platform settings</Link>
                  <Link to="/" onClick={() => setProfileOpen(false)}>View website</Link>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main id="admin-main" className="admin-main" tabIndex={-1}>
          <div className="admin-breadcrumbs"><Link to="/admin">Administration</Link><span>/</span><span>{page.group}</span><span>/</span><strong>{page.title}</strong></div>
          {children}
        </main>
      </div>
    </div>
  );
}
