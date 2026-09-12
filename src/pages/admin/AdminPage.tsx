import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CloudUpload,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Image as ImageIcon,
  KeyRound,
  LayoutGrid,
  ListFilter,
  LockKeyhole,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { Modal } from "../../components/common/Modal";
import { useToast } from "../../components/common/toast-context";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { PageDefinition } from "../../types";
import { AdminDashboard } from "./AdminDashboard";
import { AdminShell } from "./AdminShell";
import { CourseEditor } from "./CourseEditor";

interface AdminPageProps { page: PageDefinition; }
interface AdminRow { id: string; name: string; detail: string; category: string; status: string; metric: string; updated: string; image?: string; }

const peopleRows: AdminRow[] = [
  { id: "USR-10482", name: "Layla Hassan", detail: "layla.hassan@example.com", category: "Student", status: "Active", metric: "3 courses", updated: "2 min ago" },
  { id: "USR-10481", name: "Omar Farouk", detail: "omar.farouk@example.com", category: "Student", status: "Active", metric: "5 courses", updated: "18 min ago" },
  { id: "USR-10480", name: "Dr. Sarah Ahmed", detail: "sarah@biophlo.com", category: "Instructor", status: "Verified", metric: "8 courses", updated: "1 hour ago" },
  { id: "USR-10479", name: "Maya Chen", detail: "maya.chen@example.com", category: "Student", status: "Pending", metric: "1 course", updated: "Yesterday" },
  { id: "USR-10478", name: "Karim Mansour", detail: "karim.m@example.com", category: "Administrator", status: "Active", metric: "Full access", updated: "Yesterday" },
  { id: "USR-10477", name: "Aisha Khan", detail: "aisha.khan@example.com", category: "Student", status: "Suspended", metric: "2 courses", updated: "Sep 9, 2026" },
];

const courseRows: AdminRow[] = [
  { id: "CRS-001", name: "Introduction to Plant Biology", detail: "Dr. Sarah Ahmed · 12 modules", category: "Plant biology", status: "Published", metric: "3,921 learners", updated: "Today", image: "/assets/course-plant.webp" },
  { id: "CRS-002", name: "Genetics and Inheritance", detail: "Dr. Sarah Ahmed · 10 modules", category: "Genetics", status: "Published", metric: "2,834 learners", updated: "Yesterday", image: "/assets/course-genetics.webp" },
  { id: "CRS-003", name: "Cell Structure and Function", detail: "Dr. Sarah Ahmed · 8 modules", category: "Cell biology", status: "In review", metric: "2,417 learners", updated: "Sep 11, 2026", image: "/assets/course-cell.webp" },
  { id: "CRS-004", name: "Ecosystems and Biodiversity", detail: "Dr. Omar Khalil · 9 modules", category: "Ecology", status: "Scheduled", metric: "1,903 learners", updated: "Sep 10, 2026", image: "/assets/journey-leaf.webp" },
  { id: "CRS-005", name: "Human Physiology Essentials", detail: "Prof. Maya Chen · 14 modules", category: "Human biology", status: "Draft", metric: "0 learners", updated: "Sep 8, 2026", image: "/assets/journey-microscope.webp" },
];

const commerceRows: AdminRow[] = [
  { id: "BIO-10482", name: "Layla Hassan", detail: "Cell Structure and Function", category: "Card · •••• 4821", status: "Paid", metric: "$39.00", updated: "Today, 10:42" },
  { id: "BIO-10481", name: "Marco Silva", detail: "Annual Learner plan", category: "PayPal", status: "Paid", metric: "$149.00", updated: "Today, 09:18" },
  { id: "BIO-10480", name: "Fatima Noor", detail: "Genetics and Inheritance", category: "Card · •••• 1190", status: "Refund requested", metric: "$49.00", updated: "Yesterday" },
  { id: "BIO-10479", name: "James Wu", detail: "Biology Complete bundle", category: "Apple Pay", status: "Failed", metric: "$129.00", updated: "Yesterday" },
  { id: "BIO-10478", name: "Aisha Khan", detail: "Monthly Learner plan", category: "Card · •••• 7422", status: "Paid", metric: "$15.00", updated: "Sep 10, 2026" },
];

const contentRows: AdminRow[] = [
  { id: "CNT-221", name: "Cell Division Study Guide", detail: "PDF · 18 pages · 2.4 MB", category: "Free resource", status: "Published", metric: "1,204 downloads", updated: "Today" },
  { id: "CNT-220", name: "IGCSE Biology Paper 4", detail: "June 2025 · Mark scheme linked", category: "Past paper", status: "Published", metric: "893 downloads", updated: "Yesterday" },
  { id: "CNT-219", name: "Cellular Respiration Explained", detail: "Video · 12:38 · Captions ready", category: "Video", status: "Published", metric: "4,281 views", updated: "Sep 10, 2026" },
  { id: "CNT-218", name: "Five Genetics Mistakes", detail: "Draft article · Dr. Sarah Ahmed", category: "Article", status: "Draft", metric: "—", updated: "Sep 9, 2026" },
  { id: "CNT-217", name: "Biology Revision Checklist", detail: "PDF · 6 pages · 840 KB", category: "Free resource", status: "In review", metric: "—", updated: "Sep 8, 2026" },
];

const supportRows: AdminRow[] = [
  { id: "#2847", name: "Access issue after purchase", detail: "Aisha Khan · aisha.khan@example.com", category: "Account access", status: "Open", metric: "High", updated: "12 min ago" },
  { id: "#2846", name: "Certificate not showing", detail: "Marco Silva · marco.s@example.com", category: "Certificates", status: "In progress", metric: "Medium", updated: "44 min ago" },
  { id: "#2845", name: "Question about cell module", detail: "Lina Park · lina@example.com", category: "Course content", status: "Open", metric: "Medium", updated: "1 hour ago" },
  { id: "#2844", name: "Duplicate payment", detail: "James Wu · james.w@example.com", category: "Billing", status: "Escalated", metric: "High", updated: "2 hours ago" },
  { id: "#2843", name: "Quiz would not load", detail: "Fatima Noor · fatima@example.com", category: "Technical", status: "Resolved", metric: "Low", updated: "Yesterday" },
];

const taxonomyRows: AdminRow[] = [
  { id: "TAX-001", name: "Cell biology", detail: "cell-biology", category: "12 linked courses", status: "Active", metric: "1", updated: "Today" },
  { id: "TAX-002", name: "Genetics", detail: "genetics", category: "9 linked courses", status: "Active", metric: "2", updated: "Yesterday" },
  { id: "TAX-003", name: "Plant biology", detail: "plant-biology", category: "7 linked courses", status: "Active", metric: "3", updated: "Sep 10, 2026" },
  { id: "TAX-004", name: "Ecology", detail: "ecology", category: "6 linked courses", status: "Active", metric: "4", updated: "Sep 9, 2026" },
  { id: "TAX-005", name: "Human physiology", detail: "human-physiology", category: "5 linked courses", status: "Hidden", metric: "5", updated: "Sep 8, 2026" },
];

function initialRows(page: PageDefinition): AdminRow[] {
  if (["users", "students", "instructors", "administrators", "cohorts", "enrollments", "issued-certificates"].includes(page.id)) return peopleRows;
  if (["admin-courses", "articulate-packages", "prerequisites", "admin-achievements", "certificate-templates"].includes(page.id)) return courseRows;
  if (["orders-payments", "subscriptions", "refunds-cancellations"].includes(page.id)) return commerceRows;
  if (["admin-resources", "admin-past-papers", "admin-videos", "testimonials", "static-pages", "admin-faq"].includes(page.id)) return contentRows;
  if (["admin-support", "contact-inquiries", "qa-moderation", "message-moderation"].includes(page.id)) return supportRows;
  if (["admin-subjects", "admin-curricula", "admin-grades", "categories", "roles-permissions"].includes(page.id)) return taxonomyRows;
  return contentRows;
}

function PageHeading({ page, onAction, onExport }: { page: PageDefinition; onAction?: () => void; onExport?: () => void }) {
  return <header className="admin-page-heading"><div><span className="admin-kicker">{page.group}</span><h1>{page.title}</h1><p>{page.description}</p></div><div className="admin-heading-actions">{onExport ? <button type="button" className="button-secondary" onClick={onExport}><Download size={17} /> Export</button> : null}{page.primaryAction && onAction ? <button type="button" className="button-primary" onClick={onAction}><Plus size={17} /> {page.primaryAction}</button> : null}</div></header>;
}

function statusClass(status: string) { return `status status-${status.toLowerCase().replace(/\s+/g, "-")}`; }

function downloadRows(page: PageDefinition, rows: AdminRow[]) {
  const csv = ["ID,Name,Details,Category,Status,Metric,Updated", ...rows.map((row) => [row.id, row.name, row.detail, row.category, row.status, row.metric, row.updated].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");
  const href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = `${page.id}-export.csv`;
  anchor.click();
  URL.revokeObjectURL(href);
}

function EntityForm({ page, onSaved }: { page: PageDefinition; onSaved: (row: AdminRow) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const people = ["users", "students", "instructors", "administrators", "cohorts"].includes(page.id);
  const commerce = ["orders-payments", "subscriptions", "refunds-cancellations"].includes(page.id);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3) { setError("Enter a name of at least 3 characters."); return; }
    onSaved({ id: `${page.id.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`, name, detail: email || description || "Created locally", category: category || page.group, status, metric: commerce ? "$0.00" : people ? "New account" : "New", updated: "Just now" });
  };

  return <form id="admin-entity-form" className="form-grid" onSubmit={submit}>
    <label className="field span-2"><span>{people ? "Full name" : commerce ? "Reference or customer" : "Title or name"} *</span><input className="text-input" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} aria-invalid={Boolean(error)} />{error ? <small className="field-error">{error}</small> : null}</label>
    <label className="field"><span>{people ? "Email address" : "Slug or reference"}</span><input className="text-input" type={people ? "email" : "text"} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
    <label className="field"><span>{people ? "Role" : "Category"}</span><select className="select-input" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Choose…</option>{people ? <><option>Student</option><option>Instructor</option><option>Administrator</option></> : <><option>Biology</option><option>Cell biology</option><option>Resource</option><option>Platform content</option></>}</select></label>
    <label className="field"><span>Status</span><select className="select-input" value={status} onChange={(event) => setStatus(event.target.value)}><option>Active</option><option>Draft</option><option>Pending</option><option>Scheduled</option><option>Hidden</option></select></label>
    <label className="field"><span>{commerce ? "Amount" : "Owner"}</span><input className="text-input" type={commerce ? "number" : "text"} placeholder={commerce ? "0.00" : "Dr. Sarah Ahmed"} /></label>
    <label className="field span-2"><span>Description and internal notes</span><textarea className="text-area" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add the context administrators need to manage this item…" /></label>
    <fieldset className="modal-fieldset span-2"><legend>Availability</legend><label><input type="checkbox" defaultChecked /> Visible to relevant users</label><label><input type="checkbox" defaultChecked /> Include in platform search</label><label><input type="checkbox" /> Notify affected users</label></fieldset>
  </form>;
}

function ManagementView({ page }: { page: PageDefinition }) {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [rows, setRows] = useLocalStorage<AdminRow[]>(`biophlo-admin-${page.id}`, initialRows(page));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const filtered = useMemo(() => rows.filter((row) => (filter === "All statuses" || row.status === filter) && `${row.name} ${row.detail} ${row.id}`.toLowerCase().includes(query.toLowerCase())), [filter, query, rows]);
  const statuses = ["All statuses", ...Array.from(new Set(rows.map((row) => row.status)))];

  const primary = () => {
    if (page.id === "admin-courses") navigate("/admin/courses/new");
    else setModalOpen(true);
  };
  const addRow = (row: AdminRow) => {
    setRows((current) => [row, ...current]);
    setModalOpen(false);
    notify({ title: `${page.title.replace(/s$/, "")} created`, detail: `${row.name} was added to this local workspace.`, tone: "success" });
  };
  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    setRowMenu(null);
    notify({ title: "Item removed", detail: "The local demo record was removed.", tone: "info" });
  };

  return <>
    <PageHeading page={page} onAction={primary} onExport={() => { downloadRows(page, rows); notify({ title: "Export created", detail: `${rows.length} rows downloaded as CSV.`, tone: "success" }); }} />
    <section className="admin-mini-metrics" aria-label={`${page.title} summary`}>
      <article><span>Total records</span><strong>{rows.length.toLocaleString()}</strong><small><TrendingUp size={14} /> 8.4% this month</small></article>
      <article><span>Active</span><strong>{rows.filter((row) => ["Active", "Published", "Paid", "Verified", "Open"].includes(row.status)).length}</strong><small>Currently available</small></article>
      <article><span>Needs attention</span><strong>{rows.filter((row) => ["Pending", "Draft", "In review", "Failed", "Escalated"].includes(row.status)).length}</strong><small>Review recommended</small></article>
    </section>
    <section className="admin-panel management-panel">
      <div className="table-toolbar">
        <label className="table-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${page.title.toLowerCase()}…`} /></label>
        <label className="filter-select"><Filter size={16} /><span className="sr-only">Filter status</span><select value={filter} onChange={(event) => setFilter(event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <button type="button" className="button-secondary" onClick={() => notify({ title: "Filters ready", detail: "Date, owner, and advanced filters are available in the full filter panel.", tone: "info" })}><ListFilter size={17} /> More filters</button>
        <span className="toolbar-count">{filtered.length} results</span>
      </div>
      {selected.length ? <div className="bulk-actions"><strong>{selected.length} selected</strong><button type="button" onClick={() => { setSelected([]); notify({ title: "Status updated", detail: "Selected records were marked active.", tone: "success" }); }}>Mark active</button><button type="button" onClick={() => setSelected([])}>Clear selection</button></div> : null}
      <div className="admin-table-wrap">
        <table className="admin-table management-table">
          <thead><tr><th className="check-cell"><input type="checkbox" aria-label="Select all visible rows" checked={filtered.length > 0 && selected.length === filtered.length} onChange={(event) => setSelected(event.target.checked ? filtered.map((row) => row.id) : [])} /></th><th>Name</th><th>Category</th><th>Status</th><th>Metric</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>{filtered.map((row) => <tr key={row.id}><td className="check-cell"><input type="checkbox" aria-label={`Select ${row.name}`} checked={selected.includes(row.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id))} /></td><td><div className="primary-cell">{row.image ? <img src={row.image} alt="" /> : <span className="row-avatar">{row.name.split(" ").map((word) => word[0]).slice(0,2).join("")}</span>}<span><strong>{row.name}</strong><small>{row.id} · {row.detail}</small></span></div></td><td>{row.category}</td><td><span className={statusClass(row.status)}>{row.status}</span></td><td><strong>{row.metric}</strong></td><td>{row.updated}</td><td className="row-actions"><button type="button" className="module-icon-button" onClick={() => setRowMenu(rowMenu === row.id ? null : row.id)} aria-label={`Actions for ${row.name}`}><MoreHorizontal size={18} /></button>{rowMenu === row.id ? <div className="row-action-menu"><button type="button" onClick={() => notify({ title: row.name, detail: "Record details opened in preview mode.", tone: "info" })}><Eye size={15} /> View</button><button type="button" onClick={() => { setModalOpen(true); setRowMenu(null); }}><Pencil size={15} /> Edit</button><button type="button" className="danger" onClick={() => removeRow(row.id)}><Trash2 size={15} /> Remove</button></div> : null}</td></tr>)}</tbody>
        </table>
      </div>
      {!filtered.length ? <div className="empty-table"><Search size={28} /><strong>No matching records</strong><p>Change the search or status filter to see more results.</p></div> : null}
      <footer className="table-pagination"><span>Showing {filtered.length ? 1 : 0}–{filtered.length} of {filtered.length}</span><div><button type="button" disabled aria-label="Previous page"><ChevronLeft size={17} /></button><button type="button" className="active">1</button><button type="button" onClick={() => notify({ title: "Page 2", detail: "This local demo contains one page of seeded data.", tone: "info" })}>2</button><button type="button" onClick={() => notify({ title: "Last page reached", tone: "info" })} aria-label="Next page"><ChevronRight size={17} /></button></div></footer>
    </section>
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={page.primaryAction ?? `Edit ${page.title}`} description="Complete the structured details below. This frontend stores the result locally." size="large" footer={<><button className="button-secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button><button className="button-primary" type="submit" form="admin-entity-form">Save details</button></>}><EntityForm page={page} onSaved={addRow} /></Modal>
  </>;
}

const settingCopy: Record<string, { sections: { title: string; fields: string[] }[] }> = {
  "payment-settings": { sections: [{ title: "Provider", fields: ["Payment provider", "Public key", "Secret key reference", "Webhook endpoint"] }, { title: "Commerce defaults", fields: ["Settlement currency", "Tax behavior", "Statement descriptor", "Failed-payment retries"] }] },
  "email-settings": { sections: [{ title: "Sender identity", fields: ["Email provider", "From name", "From email", "Reply-to address"] }, { title: "Delivery", fields: ["API key reference", "Sending domain", "Daily limit", "Bounce threshold"] }] },
  "storage-settings": { sections: [{ title: "Object storage", fields: ["Storage provider", "Bucket name", "Region", "Public asset host"] }, { title: "Upload policy", fields: ["Maximum upload size", "Allowed video formats", "Image optimization", "Signed URL lifetime"] }] },
  "scorm-settings": { sections: [{ title: "Learning standards", fields: ["Default package standard", "LRS endpoint", "LRS client ID", "LRS secret reference"] }, { title: "Launch behavior", fields: ["Player mode", "Completion mapping", "Score mapping", "Suspend data limit"] }] },
  "monitoring-settings": { sections: [{ title: "Product analytics", fields: ["Analytics provider", "Measurement ID", "Consent mode", "Data region"] }, { title: "Reliability", fields: ["Error tracking DSN", "Uptime endpoint", "Alert channel", "Sample rate"] }] },
  "data-retention": { sections: [{ title: "Learner records", fields: ["Inactive account retention", "Assessment attempt retention", "Support message retention", "Deletion grace period"] }, { title: "Privacy operations", fields: ["Export SLA", "Deletion approver", "Legal hold behavior", "Anonymization mode"] }] },
  localization: { sections: [{ title: "Language defaults", fields: ["Default locale", "Fallback locale", "Date format", "Time zone"] }, { title: "Translation workflow", fields: ["Enabled locales", "Missing-string behavior", "Review requirement", "Translation owner"] }] },
  "general-settings": { sections: [{ title: "Platform identity", fields: ["Platform name", "Public URL", "Support email", "Default country"] }, { title: "Learning defaults", fields: ["Default course language", "Passing score", "Week starts on", "Student time zone"] }] },
  "system-status": { sections: [{ title: "System health", fields: ["Public status message", "Status page URL", "Incident contact", "Health check interval"] }, { title: "Maintenance window", fields: ["Maintenance mode", "Starts at", "Ends at", "Allowed administrator IPs"] }] },
  "import-export": { sections: [{ title: "Import defaults", fields: ["Duplicate handling", "Validation mode", "Maximum rows", "Error report format"] }, { title: "Export controls", fields: ["Default file format", "Field delimiter", "Sensitive data masking", "Signed link lifetime"] }] },
};

function SettingsView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const config = settingCopy[page.id] ?? { sections: [{ title: "Configuration", fields: ["Display name", "Public value", "Internal reference", "Default behavior"] }, { title: "Governance", fields: ["Owner", "Review cadence", "Change approval", "Audit note"] }] };
  const [values, setValues] = useLocalStorage<Record<string, string>>(`biophlo-settings-${page.id}`, {});
  const [enabled, setEnabled] = useState(page.id !== "system-status");
  return <>
    <PageHeading page={page} />
    <form className="settings-layout" onSubmit={(event) => { event.preventDefault(); notify({ title: "Settings saved", detail: `${page.title} were updated in this browser.`, tone: "success" }); }}>
      <div className="settings-main">
        <section className="admin-panel settings-toggle-panel"><div><span className={`integration-icon ${enabled ? "enabled" : ""}`}><Settings2 size={23} /></span><span><strong>{page.title}</strong><small>{enabled ? "Configuration is enabled" : "Configuration is currently disabled"}</small></span></div><label className="admin-switch-row compact"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /><i /></label></section>
        {config.sections.map((section, index) => <section className="admin-panel settings-section" key={section.title}><header><span>{index + 1}</span><div><h2>{section.title}</h2><p>Configure and validate the values used by this frontend experience.</p></div></header><div className="form-grid">{section.fields.map((field, fieldIndex) => <label className={`field ${fieldIndex === section.fields.length - 1 && section.fields.length % 2 ? "span-2" : ""}`} key={field}><span>{field}</span>{field.toLowerCase().includes("behavior") || field.toLowerCase().includes("provider") || field.toLowerCase().includes("format") || field.toLowerCase().includes("mode") ? <select className="select-input" value={values[field] ?? "Recommended"} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))}><option>Recommended</option><option>Enabled</option><option>Disabled</option><option>Custom</option></select> : <input className="text-input" type={field.toLowerCase().includes("secret") || field.toLowerCase().includes("key") ? "password" : field.toLowerCase().includes("email") ? "email" : "text"} value={values[field] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} placeholder={`Enter ${field.toLowerCase()}`} />}</label>)}</div></section>)}
        <div className="settings-save-bar"><span><CheckCircle2 size={18} /> Changes are validated before they are applied.</span><button type="button" className="button-secondary" onClick={() => setValues({})}>Reset</button><button className="button-primary" type="submit">Save settings</button></div>
      </div>
      <aside className="admin-panel settings-aside"><ShieldCheck size={28} /><h2>Configuration safety</h2><p>Secrets are represented as local demo values and are never sent to a server.</p><ul><li><Check size={15} /> Field-level validation</li><li><Check size={15} /> Change history preview</li><li><Check size={15} /> Clear ownership</li></ul><button type="button" className="button-secondary" onClick={() => notify({ title: "Connection successful", detail: "The local configuration passed all frontend checks.", tone: "success" })}>Test configuration</button></aside>
    </form>
  </>;
}

function ReportsView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const [range, setRange] = useState("Last 30 days");
  const [segment, setSegment] = useState("All learners");
  const values = page.id.includes("revenue") ? [18, 31, 28, 45, 51, 58, 66, 61, 77, 84, 92, 100] : [25, 29, 36, 34, 49, 56, 52, 65, 72, 78, 84, 91];
  return <>
    <PageHeading page={page} onExport={() => notify({ title: "Report export queued", detail: "A CSV report was prepared locally.", tone: "success" })} />
    <div className="report-toolbar"><label><span>Date range</span><select value={range} onChange={(event) => setRange(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option><option>Year to date</option></select></label><label><span>Segment</span><select value={segment} onChange={(event) => setSegment(event.target.value)}><option>All learners</option><option>New learners</option><option>Subscribers</option><option>Course purchasers</option></select></label><button className="button-secondary" type="button" onClick={() => notify({ title: "Report refreshed", detail: `${range} · ${segment}`, tone: "success" })}>Apply filters</button></div>
    <section className="admin-mini-metrics report-metrics"><article><span>Primary metric</span><strong>{page.id.includes("revenue") ? "$84.2k" : "12,840"}</strong><small><TrendingUp size={14} /> 14.8% vs prior period</small></article><article><span>Conversion</span><strong>7.4%</strong><small>+0.8 percentage points</small></article><article><span>Benchmark</span><strong>Top 18%</strong><small>Across biology education</small></article><article><span>Data freshness</span><strong>4 min</strong><small>Last synchronized</small></article></section>
    <div className="reports-grid">
      <section className="admin-panel report-chart-card"><header className="admin-panel-head"><div><h2>{page.title} trend</h2><p>{range} · compared with previous period</p></div><button type="button" className="icon-control"><MoreHorizontal size={18} /></button></header><div className="big-line-chart"><div className="chart-grid-lines" /><svg viewBox="0 0 1100 300" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id={`fill-${page.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a959b" stopOpacity=".28" /><stop offset="1" stopColor="#0a959b" stopOpacity="0" /></linearGradient></defs><polygon points={`0,300 ${values.map((value,index) => `${index * 100},${300 - value * 2.7}`).join(" ")} 1100,300`} fill={`url(#fill-${page.id})`} /><polyline points={values.map((value,index) => `${index * 100},${300 - value * 2.7}`).join(" ")} fill="none" stroke="#078d98" strokeWidth="7" vectorEffect="non-scaling-stroke" /></svg><div className="report-x-axis">{["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6"].map((label) => <span key={label}>{label}</span>)}</div></div></section>
      <section className="admin-panel report-breakdown"><header className="admin-panel-head"><div><h2>Performance breakdown</h2><p>Contribution by course category</p></div></header>{[["Cell biology",82,"#0a959b"],["Genetics",68,"#2fbab5"],["Plant biology",57,"#f5a623"],["Ecology",43,"#76c9c5"],["Human biology",31,"#f3c46c"]].map(([name,value,color]) => <div className="breakdown-row" key={String(name)}><span><i style={{ background: String(color) }} />{name}</span><strong>{value}%</strong><div><i style={{ width: `${value}%`, background: String(color) }} /></div></div>)}</section>
      <section className="admin-panel report-table-card"><header className="admin-panel-head"><div><h2>Detailed results</h2><p>Sorted by contribution</p></div><button type="button" className="button-secondary" onClick={() => notify({ title: "Columns updated", tone: "info" })}>Edit columns</button></header><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Dimension</th><th>Visitors</th><th>Enrollments</th><th>Rate</th><th>Change</th></tr></thead><tbody>{["Organic search","Direct","Student referral","Social media","Email campaigns"].map((name,index) => <tr key={name}><td><strong>{name}</strong></td><td>{(4820-index*617).toLocaleString()}</td><td>{892-index*103}</td><td>{(8.4-index*.7).toFixed(1)}%</td><td><span className="positive-change">+{12-index*1.3}%</span></td></tr>)}</tbody></table></div></section>
    </div>
  </>;
}

function ContentEditorView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const [title, setTitle] = useLocalStorage(`biophlo-editor-title-${page.id}`, page.title.replace("Home page content", "Biology made clear for a brighter tomorrow"));
  const [body, setBody] = useLocalStorage(`biophlo-editor-body-${page.id}`, page.description);
  const [audience, setAudience] = useState("All visitors");
  const [preview, setPreview] = useState(false);
  return <>
    <PageHeading page={page} />
    <form className="content-editor-layout" onSubmit={(event) => { event.preventDefault(); notify({ title: "Content saved", detail: "The local draft and its revision note were stored.", tone: "success" }); }}>
      <div className="settings-main">
        <section className="admin-panel content-editor-card"><header className="admin-panel-head"><div><h2>Content</h2><p>Write clear, useful copy and define where it appears.</p></div><div className="segmented-control"><button type="button" className={!preview ? "active" : ""} onClick={() => setPreview(false)}>Edit</button><button type="button" className={preview ? "active" : ""} onClick={() => setPreview(true)}>Preview</button></div></header>{preview ? <div className="content-live-preview"><span>{page.group}</span><h2>{title}</h2><p>{body}</p><button type="button" className="button-primary">Primary action <ArrowRight size={16} /></button></div> : <div className="editor-form-body"><label className="field"><span>Title</span><input className="text-input" value={title} onChange={(event) => setTitle(event.target.value)} /></label><label className="field"><span>Body content</span><div className="rich-toolbar"><button type="button"><b>B</b></button><button type="button"><i>I</i></button><button type="button">H2</button><button type="button">• List</button><button type="button">Link</button></div><textarea className="text-area editor-rich-area" value={body} onChange={(event) => setBody(event.target.value)} /></label><div className="form-grid"><label className="field"><span>Audience</span><select className="select-input" value={audience} onChange={(event) => setAudience(event.target.value)}><option>All visitors</option><option>Signed-in learners</option><option>Subscribers</option><option>Selected cohorts</option></select></label><label className="field"><span>Publish date</span><input className="text-input" type="datetime-local" /></label></div><label className="field"><span>Call-to-action label</span><input className="text-input" placeholder="Learn more" /></label><label className="field"><span>Call-to-action destination</span><input className="text-input" placeholder="/courses" /></label></div>}</section>
        <section className="admin-panel content-blocks"><header className="admin-panel-head"><div><h2>Structured blocks</h2><p>Reorder and configure the content shown on this surface.</p></div><button type="button" className="button-secondary" onClick={() => notify({ title: "Block added", detail: "A new text-and-media block was added to the local draft.", tone: "success" })}><Plus size={16} /> Add block</button></header>{["Primary content", "Supporting media", "Call to action"].map((block,index) => <div className="content-block-row" key={block}><span>{index+1}</span><div><strong>{block}</strong><small>{index === 1 ? "BIOPHLO media library asset" : "Editable structured content"}</small></div><button type="button" className="icon-control" aria-label={`Edit ${block}`}><Pencil size={16} /></button><button type="button" className="icon-control" aria-label={`Reorder ${block}`}><MoreHorizontal size={16} /></button></div>)}</section>
      </div>
      <aside className="admin-panel content-publish-aside"><span className="status status-draft">Draft</span><h2>Publishing</h2><dl><div><dt>Audience</dt><dd>{audience}</dd></div><div><dt>Last saved</dt><dd>Just now</dd></div><div><dt>Owner</dt><dd>Dr. Sarah Ahmed</dd></div></dl><label className="field"><span>Revision note</span><textarea className="text-area" placeholder="What changed in this revision?" /></label><button className="button-primary" type="submit">Save draft</button><button type="button" className="button-secondary" onClick={() => notify({ title: "Content published", detail: "The page is now marked published in this local demo.", tone: "success" })}>Publish now</button></aside>
    </form>
  </>;
}

function SecurityView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const events = [
    ["Multiple failed sign-in attempts", "185.220.101.14 · Amsterdam, NL", "High", "5 minutes ago"],
    ["New administrator device", "Chrome on Windows · Beirut, LB", "Review", "42 minutes ago"],
    ["Recovery code used", "Layla Hassan · London, UK", "Medium", "2 hours ago"],
    ["Password changed", "Karim Mansour · Dubai, AE", "Expected", "Yesterday"],
  ];
  return <>
    <PageHeading page={page} onExport={() => notify({ title: "Security report exported", tone: "success" })} />
    <section className="security-score admin-panel"><div className="score-ring"><strong>92</strong><span>/100</span></div><div><span className="admin-kicker">Security posture</span><h2>Strong protection with two recommended actions</h2><p>Authentication controls, session policies, and administrator coverage are operating normally.</p></div><button type="button" className="button-primary" onClick={() => notify({ title: "Security review started", detail: "The local checklist is ready for review.", tone: "info" })}>Review recommendations</button></section>
    <section className="admin-mini-metrics"><article><span>2FA coverage</span><strong>94%</strong><small>Administrators: 100%</small></article><article><span>Active sessions</span><strong>1,284</strong><small>Across 1,041 users</small></article><article><span>Flagged events</span><strong>3</strong><small>1 high priority</small></article><article><span>Policy checks</span><strong>18/18</strong><small>Passing now</small></article></section>
    <div className="security-grid"><section className="admin-panel"><header className="admin-panel-head"><div><h2>Recent security events</h2><p>Authentication and access signals requiring awareness.</p></div><button type="button" className="button-secondary"><Filter size={16} /> Filter</button></header><div className="security-event-list">{events.map(([title,detail,risk,time]) => <div key={title}><span className={`security-event-icon ${risk === "High" ? "risk-high" : ""}`}>{risk === "High" ? <AlertTriangle size={19} /> : <ShieldCheck size={19} />}</span><div><strong>{title}</strong><small>{detail}</small></div><span className={statusClass(risk)}>{risk}</span><time>{time}</time><button type="button" className="icon-control" onClick={() => notify({ title: "Event opened", detail: title, tone: "info" })}><ArrowRight size={16} /></button></div>)}</div></section><aside className="admin-panel security-controls"><h2>Protection controls</h2>{[["Require administrator 2FA",true],["Block breached passwords",true],["Risk-based sign-in checks",true],["Restrict administrator IPs",false]].map(([label,checked]) => <label className="admin-switch-row compact" key={String(label)}><span><strong>{String(label)}</strong><small>{checked ? "Enabled" : "Optional"}</small></span><input type="checkbox" defaultChecked={Boolean(checked)} onChange={() => notify({ title: "Security control updated", detail: String(label), tone: "success" })} /><i /></label>)}<Link className="button-secondary" to="/admin/security/audit-logs">View audit logs <ArrowRight size={16} /></Link></aside></div>
  </>;
}

function InboxView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const [selected, setSelected] = useState(0);
  const [reply, setReply] = useState("");
  const conversations = supportRows.map((row,index) => ({ ...row, unread: index < 2 }));
  const current = conversations[selected];
  return <>
    <PageHeading page={page} />
    <section className="admin-panel inbox-layout">
      <aside className="inbox-list"><div className="inbox-search"><Search size={16} /><input placeholder="Search conversations…" /></div><div className="inbox-filters"><button className="active" type="button">Open <span>8</span></button><button type="button">Mine <span>3</span></button><button type="button">Resolved</button></div>{conversations.map((conversation,index) => <button type="button" className={`conversation-item ${selected === index ? "active" : ""}`} key={conversation.id} onClick={() => setSelected(index)}><span className="row-avatar">{conversation.detail[0]}</span><span><strong>{conversation.name}</strong><small>{conversation.detail}</small><em>{conversation.updated}</em></span>{conversation.unread ? <i /> : null}</button>)}</aside>
      <div className="conversation-pane"><header><div><span className="row-avatar">{current.detail[0]}</span><div><h2>{current.name}</h2><p>{current.detail}</p></div></div><div><span className={statusClass(current.status)}>{current.status}</span><button className="icon-control" type="button"><MoreHorizontal size={18} /></button></div></header><div className="conversation-context"><span><strong>{current.id}</strong> · {current.category}</span><span>Priority: <b>{current.metric}</b></span><button type="button" onClick={() => notify({ title: "Conversation assigned", detail: "Assigned to Dr. Sarah Ahmed.", tone: "success" })}>Assign to me</button></div><div className="message-thread"><div className="message-bubble inbound"><strong>{current.detail.split(" · ")[0]}</strong><p>I’m having trouble with {current.name.toLowerCase()}. Could you help me understand what I need to do next?</p><time>10:24 AM</time></div><div className="message-bubble outbound"><strong>BIOPHLO Support</strong><p>Thanks for the details. I’ve reviewed your account and can help resolve this. Please confirm the course or order reference shown in your dashboard.</p><time>10:31 AM</time></div></div><form className="reply-box" onSubmit={(event) => { event.preventDefault(); if (!reply.trim()) return; notify({ title: "Reply sent", detail: "The response was added to this local conversation.", tone: "success" }); setReply(""); }}><div className="reply-toolbar"><button type="button">B</button><button type="button">Attach file</button><button type="button">Insert template</button></div><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a clear, helpful reply…" aria-label="Reply" /><div><label><input type="checkbox" /> Resolve after sending</label><button className="button-primary" type="submit"><Send size={16} /> Send reply</button></div></form></div>
      <aside className="customer-context"><h2>Customer context</h2><div className="context-profile"><span className="row-avatar large">AK</span><strong>Aisha Khan</strong><small>Student since Mar 2025</small></div><dl><div><dt>Email</dt><dd>aisha.khan@example.com</dd></div><div><dt>Plan</dt><dd>Learner annual</dd></div><div><dt>Courses</dt><dd>3 active</dd></div><div><dt>Prior requests</dt><dd>2 resolved</dd></div></dl><Link to="/admin/users/layla-hassan">Open user profile <ArrowRight size={15} /></Link></aside>
    </section>
  </>;
}

function DetailView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const course = page.id === "course-preview";
  const order = page.id === "order-details";
  return <>
    <PageHeading page={page} />
    {course ? <section className="course-preview-admin"><div className="course-preview-hero"><div><span className="status status-in-review">Preview mode</span><h2>Cell Structure and Function</h2><p>Master the building blocks of life through clear, visual lessons, focused practice, and curriculum-aligned assessment.</p><div><span><BookOpen size={16} /> 8 modules</span><span><Clock3 size={16} /> 12 hours</span><span><Star size={16} /> 4.7 (260)</span></div><button className="button-primary" type="button" onClick={() => notify({ title: "Preview enrollment started", tone: "info" })}>Start course preview</button></div><img src="/assets/course-cell.webp" alt="Cell structure" /></div><div className="course-preview-content"><div><h2>What learners will achieve</h2><ul><li>Explain major cell organelles and their functions.</li><li>Compare plant, animal, and prokaryotic cells.</li><li>Apply microscopy calculations to exam questions.</li></ul><h2>Course curriculum</h2>{["Foundations of cell biology", "Cell membranes and transport", "Cell division", "Applied microscopy"].map((module,index) => <details key={module} open={index===0}><summary><span>{String(index+1).padStart(2,"0")}</span><strong>{module}</strong><small>3 lessons · 42 min</small></summary><p>Video lesson, illustrated study note, and a focused knowledge check.</p></details>)}</div><aside><strong>$39.00</strong><s>$49.00</s><p>Lifetime access · Certificate included</p><button className="button-primary" type="button">Enroll now</button><button className="button-secondary" type="button" onClick={() => notify({ title: "Preview link copied", tone: "success" })}>Copy preview link</button></aside></div></section> : order ? <OrderDetail onNotify={(title) => notify({ title, tone: "success" })} /> : <RecordDetail page={page} onNotify={(title) => notify({ title, tone: "success" })} />}
  </>;
}

function OrderDetail({ onNotify }: { onNotify: (title: string) => void }) {
  return <div className="detail-grid"><section className="admin-panel detail-main"><header className="detail-record-head"><div><span className="status status-paid">Paid</span><h2>Order BIO-10482</h2><p>Placed September 12, 2026 at 10:42 AM</p></div><button className="button-secondary" type="button" onClick={() => onNotify("Invoice downloaded")}><ArrowDownToLine size={17} /> Download invoice</button></header><h3>Line items</h3><div className="order-line"><img src="/assets/course-cell.webp" alt="" /><div><strong>Cell Structure and Function</strong><span>Lifetime course access · Dr. Sarah Ahmed</span></div><strong>$49.00</strong></div><dl className="order-totals"><div><dt>Subtotal</dt><dd>$49.00</dd></div><div><dt>WELCOME20 discount</dt><dd>−$10.00</dd></div><div><dt>Tax</dt><dd>$0.00</dd></div><div><dt>Total</dt><dd>$39.00 USD</dd></div></dl><h3>Payment timeline</h3><ul className="detail-timeline"><li><span><Check size={15} /></span><div><strong>Payment captured</strong><small>Stripe · Visa ending 4821 · 10:42 AM</small></div></li><li><span><Mail size={15} /></span><div><strong>Receipt delivered</strong><small>layla.hassan@example.com · 10:43 AM</small></div></li><li><span><UserRound size={15} /></span><div><strong>Course access granted</strong><small>Enrollment ENR-93218 · 10:43 AM</small></div></li></ul></section><aside className="settings-main"><section className="admin-panel detail-side-card"><h2>Customer</h2><span className="row-avatar large">LH</span><strong>Layla Hassan</strong><p>layla.hassan@example.com</p><Link to="/admin/users/layla-hassan">View profile <ArrowRight size={15} /></Link></section><section className="admin-panel detail-side-card"><h2>Billing address</h2><address>Layla Hassan<br />24 Cedar Avenue<br />Beirut 1107 2020<br />Lebanon</address></section><button type="button" className="button-danger" onClick={() => onNotify("Refund request opened")}>Issue refund</button></aside></div>;
}

function RecordDetail({ page, onNotify }: { page: PageDefinition; onNotify: (title: string) => void }) {
  return <div className="detail-grid"><section className="admin-panel detail-main"><header className="detail-record-head"><div className="record-profile"><span className="row-avatar xlarge">LH</span><div><span className="status status-active">Active</span><h2>{page.id === "user-details" ? "Layla Hassan" : page.title}</h2><p>{page.description}</p></div></div><button className="button-primary" type="button" onClick={() => onNotify("Record changes saved")}><Pencil size={16} /> Edit details</button></header><nav className="detail-tabs"><button className="active" type="button">Overview</button><button type="button">Activity</button><button type="button">Access</button><button type="button">Notes</button></nav><div className="record-info-grid"><div><span>Email address</span><strong>layla.hassan@example.com</strong></div><div><span>Account created</span><strong>March 14, 2025</strong></div><div><span>Country</span><strong>Lebanon</strong></div><div><span>Preferred language</span><strong>English</strong></div><div><span>Last sign in</span><strong>12 minutes ago</strong></div><div><span>Two-factor authentication</span><strong>Enabled</strong></div></div><h3>Learning summary</h3><section className="admin-mini-metrics embedded"><article><span>Active courses</span><strong>3</strong><small>1 completed</small></article><article><span>Study time</span><strong>42h</strong><small>Last 90 days</small></article><article><span>Average score</span><strong>88%</strong><small>12 attempts</small></article></section><h3>Recent activity</h3><ul className="detail-timeline"><li><span><BookOpen size={15} /></span><div><strong>Completed “Eukaryotic cells”</strong><small>Cell Structure and Function · 18 minutes ago</small></div></li><li><span><FileCheck2 size={15} /></span><div><strong>Scored 92% on module quiz</strong><small>First attempt · Yesterday</small></div></li><li><span><CircleDollarSign size={15} /></span><div><strong>Purchased course access</strong><small>Order BIO-10482 · Sep 12, 2026</small></div></li></ul></section><aside className="settings-main"><section className="admin-panel detail-side-card"><h2>Account access</h2><button className="button-secondary" type="button" onClick={() => onNotify("Password reset link prepared")}><KeyRound size={16} /> Send password reset</button><button className="button-secondary" type="button" onClick={() => onNotify("All other sessions revoked")}><LockKeyhole size={16} /> Revoke sessions</button></section><section className="admin-panel detail-side-card"><h2>Internal notes</h2><textarea className="text-area" placeholder="Add a private note for administrators…" /><button className="button-primary" type="button" onClick={() => onNotify("Internal note saved")}>Save note</button></section></aside></div>;
}

function MediaView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const [view, setView] = useState<"grid" | "list">("grid");
  const assets = [
    ["course-plant.webp", "/assets/course-plant.webp", "Image", "178 KB"], ["course-genetics.webp", "/assets/course-genetics.webp", "Image", "191 KB"], ["course-cell.webp", "/assets/course-cell.webp", "Image", "213 KB"], ["hero-student.webp", "/assets/hero-student.webp", "Image", "482 KB"], ["lesson-video.webp", "/assets/lesson-video.webp", "Video cover", "287 KB"], ["instructor.webp", "/assets/instructor.webp", "Image", "467 KB"],
  ];
  return <><PageHeading page={page} onAction={() => notify({ title: "Upload panel ready", detail: "Choose files from your device to add them to the local media queue.", tone: "info" })} /><section className="admin-panel media-panel"><div className="table-toolbar"><label className="table-search"><Search size={17} /><input placeholder="Search media by filename or alt text…" /></label><label className="filter-select"><Filter size={16} /><select aria-label="File type"><option>All file types</option><option>Images</option><option>Videos</option><option>Documents</option></select></label><div className="view-toggle"><button className={view === "grid" ? "active" : ""} type="button" onClick={() => setView("grid")} aria-label="Grid view"><LayoutGrid size={17} /></button><button className={view === "list" ? "active" : ""} type="button" onClick={() => setView("list")} aria-label="List view"><ListFilter size={17} /></button></div></div><div className="media-dropzone"><CloudUpload size={30} /><div><strong>Drop media here or browse files</strong><span>Images, video, audio, and documents up to 250 MB.</span></div><label className="button-secondary">Choose files<input type="file" multiple className="sr-only" onChange={(event) => notify({ title: "Files added", detail: `${event.target.files?.length ?? 0} file(s) entered the local upload queue.`, tone: "success" })} /></label></div><div className={`media-library ${view}`}>{assets.map(([name,src,type,size]) => <article key={name}><div><img src={src} alt="" /><label><input type="checkbox" aria-label={`Select ${name}`} /></label><button type="button" className="icon-control"><MoreHorizontal size={16} /></button></div><strong>{name}</strong><span>{type} · {size}</span></article>)}</div></section></>;
}

function PackageUploadView({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const [fileName, setFileName] = useState("");
  return <><PageHeading page={page} /><form className="package-upload-layout" onSubmit={(event) => { event.preventDefault(); if (!fileName) { notify({ title: "Choose a package first", tone: "danger" }); return; } notify({ title: "Package configured", detail: `${fileName} passed the local validation workflow.`, tone: "success" }); }}><section className="admin-panel package-upload-main"><h2>1. Upload package</h2><label className="package-drop"><UploadCloud size={36} /><strong>{fileName || "Choose a SCORM, xAPI, Rise, or Storyline package"}</strong><span>ZIP packages up to 1 GB. Files are inspected locally in this frontend demo.</span><input type="file" accept=".zip" className="sr-only" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /><b className="button-secondary">Browse files</b></label><h2>2. Package metadata</h2><div className="form-grid"><label className="field span-2"><span>Display title</span><input className="text-input" defaultValue={fileName.replace(/\.zip$/i, "")} /></label><label className="field"><span>Learning standard</span><select className="select-input"><option>Auto-detect</option><option>SCORM 1.2</option><option>SCORM 2004 4th Edition</option><option>xAPI</option></select></label><label className="field"><span>Launch file</span><input className="text-input" placeholder="index_lms.html" /></label><label className="field"><span>Completion rule</span><select className="select-input"><option>Package reports completion</option><option>Viewed percentage</option><option>Passing score</option></select></label><label className="field"><span>Passing score</span><input className="text-input" type="number" defaultValue="70" /></label><label className="field span-2"><span>Internal notes</span><textarea className="text-area" placeholder="Version, source, accessibility notes, and release context…" /></label></div></section><aside className="admin-panel package-validation"><h2>Validation checklist</h2>{["ZIP archive structure", "Launch file detected", "Manifest metadata", "External URL policy", "Tracking standard", "Accessibility metadata"].map((item,index) => <div key={item}><span className={fileName && index < 5 ? "ready" : ""}>{fileName && index < 5 ? <Check size={15} /> : index+1}</span><strong>{item}</strong></div>)}<button className="button-primary" type="submit">Validate and save</button></aside></form></>;
}

function WebsiteOverview({ page }: { page: PageDefinition }) {
  const { notify } = useToast();
  const areas = [["Home page", "11 sections", "Published", "/admin/content/home"],["Static pages", "9 pages", "Published", "/admin/content/pages"],["Navigation", "3 menus", "Published", "/admin/content/navigation"],["Brand assets", "14 assets", "Current", "/admin/content/branding"]];
  return <><PageHeading page={page} /><section className="admin-mini-metrics"><article><span>Published pages</span><strong>18</strong><small>All healthy</small></article><article><span>Draft changes</span><strong>4</strong><small>Across 3 editors</small></article><article><span>Media assets</span><strong>284</strong><small>1.8 GB used</small></article><article><span>SEO checks</span><strong>96%</strong><small>2 recommendations</small></article></section><div className="website-overview-grid"><section className="admin-panel"><header className="admin-panel-head"><div><h2>Content areas</h2><p>Ownership and publishing state across the website.</p></div></header><div className="content-area-list">{areas.map(([name,detail,status,path],index) => <Link to={path} key={name}><span className={`content-area-icon tone-${index%2 ? "amber" : "teal"}`}>{index===0?<LayoutGrid size={20}/>:index===1?<FileText size={20}/>:index===2?<ListFilter size={20}/>:<ImageIcon size={20}/>}</span><div><strong>{name}</strong><small>{detail}</small></div><span className={statusClass(status)}>{status}</span><ArrowRight size={17}/></Link>)}</div></section><section className="admin-panel"><header className="admin-panel-head"><div><h2>Recent changes</h2><p>Latest edits by the content team.</p></div></header><ul className="recent-change-list">{["Updated hero headline and CTA","Replaced Genetics course cover","Published refund policy revision","Added cellular respiration video"].map((item,index)=><li key={item}><span className="row-avatar">{["SA","KM","SA","OC"][index]}</span><div><strong>{item}</strong><small>{["Dr. Sarah Ahmed","Karim Mansour","Dr. Sarah Ahmed","Omar Khalil"][index]} · {index+1}h ago</small></div><button type="button" className="icon-control" onClick={()=>notify({title:"Revision preview opened",detail:item,tone:"info"})}><Eye size={16}/></button></li>)}</ul></section></div></>;
}

export function AdminPage({ page }: AdminPageProps) {
  let content;
  if (page.id === "admin-overview") content = <AdminDashboard />;
  else if (page.id === "course-editor") content = <CourseEditor />;
  else if (page.id === "package-upload") content = <PackageUploadView page={page} />;
  else if (page.id === "website-content") content = <WebsiteOverview page={page} />;
  else if (page.id === "media-library") content = <MediaView page={page} />;
  else if (page.kind === "settings") content = <SettingsView page={page} />;
  else if (page.kind === "analytics" || page.kind === "reports") content = <ReportsView page={page} />;
  else if (page.kind === "editor") content = <ContentEditorView page={page} />;
  else if (page.kind === "security") content = <SecurityView page={page} />;
  else if (page.kind === "messages" || page.kind === "support") content = <InboxView page={page} />;
  else if (page.kind === "detail") content = <DetailView page={page} />;
  else content = <ManagementView page={page} />;
  return <AdminShell page={page}>{content}</AdminShell>;
}
