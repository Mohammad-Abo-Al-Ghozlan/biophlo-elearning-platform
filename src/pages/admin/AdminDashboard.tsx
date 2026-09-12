import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CircleDollarSign, Headphones, TrendingUp, Users } from "lucide-react";

const metrics = [
  { label: "Active learners", value: "10,482", change: "+12%", note: "vs. last month", icon: Users, tone: "teal" },
  { label: "Course completion", value: "68%", change: "+5%", note: "vs. last month", icon: BookOpen, tone: "amber" },
  { label: "Monthly revenue", value: "$28,340", change: "+18%", note: "vs. last month", icon: CircleDollarSign, tone: "teal" },
  { label: "Support queue", value: "12", change: "−40%", note: "vs. last month", icon: Headphones, tone: "amber" },
];

const courses = [
  ["Introduction to Plant Biology", "3,921", "76%", "4.8", "$8,340", "/assets/course-plant.webp"],
  ["Genetics and Inheritance", "2,834", "62%", "4.9", "$7,120", "/assets/course-genetics.webp"],
  ["Cell Structure and Function", "2,417", "71%", "4.7", "$6,290", "/assets/course-cell.webp"],
  ["Ecosystems and Biodiversity", "1,903", "58%", "4.6", "$4,210", "/assets/journey-leaf.webp"],
];

const tickets = [
  ["#2847", "Aisha Khan", "Access issue", "High", "Open", "Oct 12"],
  ["#2846", "Marco Silva", "Certificate not showing", "Medium", "In progress", "Oct 12"],
  ["#2845", "Lina Park", "Course content question", "Medium", "Open", "Oct 11"],
  ["#2844", "James Wu", "Payment issue", "High", "In progress", "Oct 11"],
  ["#2843", "Fatima Noor", "Quiz not loading", "Low", "Resolved", "Oct 10"],
];

const publishing = [
  ["Marine Biology Fundamentals", "Published", "Oct 12, 2026"],
  ["Human Biology Essentials", "In review", "Oct 11, 2026"],
  ["Biotechnology and Society", "Draft", "Oct 10, 2026"],
  ["Ecology in a Changing World", "Scheduled", "Oct 09, 2026"],
];

export function AdminDashboard() {
  return (
    <>
      <header className="admin-page-heading dashboard-heading">
        <div>
          <h1>Platform overview</h1>
          <p>Insights, content, and community — all in one place.</p>
        </div>
        <p className="admin-handwritten">Learn<br />Explore<br />Grow</p>
      </header>

      <section className="admin-metric-grid" aria-label="Platform metrics">
        {metrics.map(({ label, value, change, note, icon: Icon, tone }) => (
          <article className="admin-metric" key={label}>
            <span className={`admin-metric-icon tone-${tone}`}><Icon size={26} /></span>
            <div><span>{label}</span><strong>{value}</strong><small><b>{change}</b> {note}</small></div>
            <TrendingUp className="metric-spark" size={42} />
          </article>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-main">
          <section className="admin-panel admin-chart-panel">
            <header className="admin-panel-head"><div><h2>Enrollment & revenue</h2><p>Rolling 12-month performance</p></div><select aria-label="Report range" defaultValue="12"><option value="12">Last 12 months</option><option value="6">Last 6 months</option><option value="3">Last 3 months</option></select></header>
            <div className="admin-chart" role="img" aria-label="Enrollments and revenue increase consistently from January through December">
              <div className="chart-y-labels"><span>5,000</span><span>4,000</span><span>3,000</span><span>2,000</span><span>1,000</span><span>0</span></div>
              <div className="chart-plot">
                <div className="chart-grid-lines" />
                <div className="chart-bars">
                  {[21, 28, 34, 40, 42, 52, 61, 72, 75, 82, 85, 96].map((height, index) => <span key={index} style={{ height: `${height}%` }}><small>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][index]}</small></span>)}
                </div>
                <svg viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true"><polyline points="30,220 135,207 240,190 345,172 450,151 555,130 660,112 765,87 870,69 975,52 1080,28 1170,0" fill="none" stroke="#078d98" strokeWidth="8" vectorEffect="non-scaling-stroke" /></svg>
              </div>
            </div>
            <div className="chart-legend"><span><i className="legend-bar" /> Enrollments</span><span><i className="legend-line" /> Revenue</span></div>
          </section>

          <section className="admin-panel">
            <header className="admin-panel-head"><div><h2>Course performance</h2><p>Top courses this period</p></div><Link to="/admin/analytics/courses">View all courses <ArrowRight size={16} /></Link></header>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Course</th><th>Enrollments</th><th>Completion</th><th>Rating</th><th>Revenue</th></tr></thead>
                <tbody>{courses.map(([name,enrollments,completion,rating,revenue,image]) => <tr key={name}><td><span className="table-course"><img src={image} alt="" /><strong>{name}</strong></span></td><td>{enrollments}</td><td>{completion}</td><td><span className="rating-star">★</span> {rating}</td><td>{revenue}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="admin-dashboard-side">
          <section className="admin-panel create-course-callout">
            <div className="create-course-icon"><BookOpen size={26} /></div>
            <div><h2>Create course</h2><p>Build and publish a new biology course with the guided course creator.</p></div>
            <Link className="button-primary amber-button" to="/admin/courses/new">Create course <ArrowRight size={17} /></Link>
            <ol><li><strong>Add content</strong><span>Videos, quizzes, resources</span></li><li><strong>Set access</strong><span>Free or paid, anytime</span></li><li><strong>Publish</strong><span>Get your course live</span></li></ol>
          </section>

          <section className="admin-panel compact-panel">
            <header className="admin-panel-head"><div><h2>Recent support queue</h2></div><Link to="/admin/support">View all <ArrowRight size={15} /></Link></header>
            <div className="admin-table-wrap"><table className="admin-table compact-table"><thead><tr><th>#</th><th>Student</th><th>Subject</th><th>Priority</th><th>Status</th></tr></thead><tbody>{tickets.map(([id,name,subject,priority,status]) => <tr key={id}><td><Link to={`/admin/support`}>{id}</Link></td><td>{name}</td><td>{subject}</td><td><span className={`status status-${priority.toLowerCase()}`}>{priority}</span></td><td><span className={`status status-${status.toLowerCase().replace(" ", "-")}`}>{status}</span></td></tr>)}</tbody></table></div>
          </section>

          <section className="admin-panel compact-panel">
            <header className="admin-panel-head"><div><h2>Publishing status</h2></div><Link to="/admin/courses">View all <ArrowRight size={15} /></Link></header>
            <ul className="publishing-list">{publishing.map(([name,status,date]) => <li key={name}><span className={`publish-dot publish-${status.toLowerCase().replace(" ", "-")}`} /><strong>{name}</strong><span>{status}</span><time>{date}</time></li>)}</ul>
          </section>
        </div>
      </div>
    </>
  );
}
