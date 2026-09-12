import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { findPageByPath, publicPages } from "./data/pageInventory";
import "./styles/admin.css";

const HomePage = lazy(() => import("./pages/public/HomePage"));
const PublicPage = lazy(() => import("./pages/public/PublicPage").then((module) => ({ default: module.PublicPage })));
const StudentPage = lazy(() => import("./pages/student/StudentPage").then((module) => ({ default: module.StudentPage })));
const AdminPage = lazy(() => import("./pages/admin/AdminPage").then((module) => ({ default: module.AdminPage })));

function RouteBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="route-loading" role="status"><span aria-hidden="true" /><strong>Preparing your BIOPHLO experience…</strong></div>}>
      {children}
    </Suspense>
  );
}

export default function App() {
  const location = useLocation();
  const pathname = location.pathname.length > 1 ? location.pathname.replace(/\/+$/, "") : "/";
  const page = findPageByPath(pathname) ?? publicPages.find((item) => item.id === "not-found")!;

  useEffect(() => {
    document.title = `${page.title} | BIOPHLO`;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page.id, page.title]);

  if (page.id === "home") return <RouteBoundary><HomePage /></RouteBoundary>;
  if (page.area === "student") return <RouteBoundary><StudentPage key={page.id} page={page} /></RouteBoundary>;
  if (page.area === "admin") return <RouteBoundary><AdminPage key={page.id} page={page} /></RouteBoundary>;
  return <RouteBoundary><PublicPage key={page.id} page={page} /></RouteBoundary>;
}
