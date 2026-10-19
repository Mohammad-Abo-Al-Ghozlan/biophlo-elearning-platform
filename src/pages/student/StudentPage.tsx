import { useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Bell,
  BookMarked,
  BookOpen,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleHelp,
  Clock3,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Filter,
  Globe2,
  Headphones,
  Image,
  Info,
  Laptop,
  Library,
  ListChecks,
  Lock,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  MessageCircleMore,
  MoreHorizontal,
  Paperclip,
  Pause,
  Pencil,
  Play,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Upload,
  UserRound,
  Video,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { PageDefinition } from "../../types";
import { StudentLayout } from "./StudentLayout";
import {
  announcements,
  attempts,
  badges,
  conversations,
  courseModules,
  courses,
  formatMinutes,
  initialChat,
  initialNotifications,
  initialQuestions,
  orders,
  profileDefaults,
  savedResources,
  supportTickets,
  transcript,
  weeklyActivity,
  type Course,
  type Question,
} from "./studentData";
import { copyText, downloadTextFile, useStudentLocalState } from "./useStudentLocalState";
import "../../styles/student.css";

type StudentPageProps = { page: PageDefinition };
type Toast = { title: string; detail?: string; tone?: "success" | "warning" | "info" } | null;

function PageHeading({ page, eyebrow, action, children }: { page: PageDefinition; eyebrow?: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="student-page-heading">
      <div>
        {eyebrow && <p className="student-eyebrow">{eyebrow}</p>}
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      {action && <div className="student-page-heading__actions">{action}</div>}
      {children}
    </div>
  );
}

function ToastNotice({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className={`student-toast student-toast--${toast.tone ?? "success"}`} role="status">
      <span className="student-toast__icon"><CheckCircle2 size={18} /></span>
      <span><strong>{toast.title}</strong>{toast.detail && <small>{toast.detail}</small>}</span>
      <button onClick={onClose} aria-label="Dismiss message"><X size={16} /></button>
    </div>
  );
}

function EmptyState({ icon, title, detail }: { icon?: ReactNode; title: string; detail: string }) {
  return <div className="student-empty">{icon}<strong>{title}</strong><p>{detail}</p></div>;
}

function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="student-progress" aria-label={label ?? `${value}% complete`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function ProgressRing({ value, size = 92 }: { value: number; size?: number }) {
  return (
    <div className="student-progress-ring" style={{ "--progress": `${value * 3.6}deg`, "--ring-size": `${size}px` } as React.CSSProperties} aria-label={`${value}% complete`}>
      <span>{value}<small>%</small></span>
    </div>
  );
}

function CourseCover({ course }: { course: Course }) {
  return (
    <div className="student-course-cover" style={{ backgroundColor: course.accent }}>
      <img src={course.image} alt="" />
      <span>{course.subject}</span>
    </div>
  );
}

function Metric({ icon, value, label, helper }: { icon: ReactNode; value: string; label: string; helper?: string }) {
  return (
    <article className="student-metric">
      <span className="student-metric__icon">{icon}</span>
      <div><strong>{value}</strong><span>{label}</span>{helper && <small>{helper}</small>}</div>
    </article>
  );
}

function DashboardPage() {
  const [goal, setGoal] = useStudentLocalState("weekly-goal", 300);
  const studied = 247;
  const maxActivity = Math.max(...weeklyActivity.map((item) => item.minutes));
  return (
    <>
      <div className="student-dashboard-intro">
        <div>
          <p className="student-eyebrow">Friday, 12 September</p>
          <h1>Good morning, Layla.</h1>
          <p>You’re one focused session away from your weekly goal.</p>
        </div>
        <div className="student-streak-pill"><span>7</span><div><strong>day streak</strong><small>Personal best: 12</small></div></div>
      </div>

      <section className="student-resume-card">
        <div className="student-resume-card__visual">
          <img src="/assets/lesson-video.webp" alt="Cell structure lesson preview" />
          <span className="student-resume-card__play"><Play fill="currentColor" size={19} /></span>
          <span className="student-resume-card__duration">16:42</span>
        </div>
        <div className="student-resume-card__copy">
          <p className="student-eyebrow">Continue learning</p>
          <h2>The plasma membrane</h2>
          <p>Cell Structure and Function · Module 2</p>
          <ProgressBar value={68} />
          <div className="student-resume-card__meta"><span>68% course complete</span><span>8 lessons left</span></div>
          <Link className="student-button student-button--amber" to="/student/learn/cell-structure-and-function">Resume lesson <ArrowRight size={17} /></Link>
        </div>
        <div className="student-resume-card__next"><span>Up next</span><strong>Transport across membranes</strong><small>18 min video</small></div>
      </section>

      <div className="student-metrics-grid">
        <Metric icon={<Clock3 />} value="14h 22m" label="Focused study" helper="+2h 10m this week" />
        <Metric icon={<BookOpen />} value="2 of 4" label="Active courses" helper="1 completed" />
        <Metric icon={<Target />} value="86%" label="Average score" helper="Top 18% of learners" />
        <Metric icon={<Award />} value="4" label="Badges earned" helper="2 almost unlocked" />
      </div>

      <div className="student-dashboard-grid">
        <section className="student-panel student-weekly-panel">
          <div className="student-panel__head"><div><p className="student-eyebrow">Study rhythm</p><h2>This week</h2></div><select aria-label="Chart period"><option>7 days</option><option>30 days</option></select></div>
          <div className="student-weekly-chart" aria-label="Weekly study activity">
            {weeklyActivity.map((item) => <div key={item.day}><span className="student-weekly-chart__bar"><i style={{ height: `${(item.minutes / maxActivity) * 100}%` }}><b>{item.minutes}m</b></i></span><small>{item.day}</small></div>)}
          </div>
          <div className="student-weekly-summary">
            <ProgressRing value={Math.min(100, Math.round((studied / goal) * 100))} size={78} />
            <div><strong>{formatMinutes(studied)} of {formatMinutes(goal)}</strong><span>Weekly focus goal</span><button className="student-text-button" onClick={() => setGoal(goal === 300 ? 420 : 300)}><Pencil size={14} /> {goal === 300 ? "Raise to 7 hours" : "Reset goal"}</button></div>
          </div>
        </section>

        <section className="student-panel student-plan-panel">
          <div className="student-panel__head"><div><p className="student-eyebrow">Today’s plan</p><h2>Three clear steps</h2></div><span className="student-chip">45 min</span></div>
          <ol className="student-plan-list">
            <li className="is-complete"><CircleCheck size={20} /><div><strong>Review cell organelles</strong><span>Completed · 12 min</span></div><Check size={16} /></li>
            <li className="is-current"><span className="student-plan-list__marker">2</span><div><strong>Watch: The plasma membrane</strong><span>Current lesson · 16 min</span></div><Link to="/student/learn/cell-structure-and-function"><Play size={15} /></Link></li>
            <li><span className="student-plan-list__marker">3</span><div><strong>Answer the knowledge check</strong><span>8 questions · about 10 min</span></div><ChevronRight size={17} /></li>
          </ol>
          <div className="student-plan-callout"><Sparkles size={19} /><p><strong>A smart stopping point</strong><span>Finish these steps and your module reaches 75%.</span></p></div>
        </section>
      </div>

      <div className="student-dashboard-grid student-dashboard-grid--bottom">
        <section className="student-panel">
          <div className="student-panel__head"><div><p className="student-eyebrow">Your courses</p><h2>Keep your momentum</h2></div><Link className="student-text-link" to="/student/courses">View all <ArrowRight size={15} /></Link></div>
          <div className="student-mini-courses">
            {courses.slice(0, 3).map((course) => <Link to={course.progress ? "/student/courses/cell-structure-and-function" : "/student/courses"} key={course.id} className="student-mini-course"><CourseCover course={course} /><div><strong>{course.title}</strong><span>{course.nextLesson}</span><ProgressBar value={course.progress} /><small>{course.progress}% complete</small></div><ChevronRight size={18} /></Link>)}
          </div>
        </section>
        <section className="student-panel student-upcoming-panel">
          <div className="student-panel__head"><div><p className="student-eyebrow">Coming up</p><h2>Learning calendar</h2></div><CalendarDays size={20} /></div>
          <div className="student-upcoming-date"><span><b>13</b>Sep</span><div><strong>Live revision clinic</strong><small>11:00 · 60 min · Dr. Ola</small></div><button className="student-icon-button" aria-label="Open event"><ChevronRight size={18} /></button></div>
          <div className="student-upcoming-date"><span><b>16</b>Sep</span><div><strong>Module two assessment</strong><small>Due by 23:59 · 12 questions</small></div><button className="student-icon-button" aria-label="Open assessment"><ChevronRight size={18} /></button></div>
          <Link className="student-button student-button--soft student-button--wide" to="/student/announcements">See all updates</Link>
        </section>
      </div>
    </>
  );
}

function CoursesPage({ page }: StudentPageProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const visible = courses.filter((course) => (status === "All" || course.status === status) && course.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHeading page={page} action={<Link className="student-button student-button--primary" to="/courses">Browse courses <ArrowRight size={16} /></Link>} />
      <div className="student-filterbar">
        <label className="student-search-input"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your courses" /></label>
        <div className="student-segmented" role="group" aria-label="Course status">
          {["All", "In progress", "Completed", "Not started"].map((item) => <button key={item} className={status === item ? "is-active" : ""} onClick={() => setStatus(item)}>{item}{item === "All" ? ` ${courses.length}` : ""}</button>)}
        </div>
        <select aria-label="Sort courses"><option>Recently active</option><option>Course title</option><option>Progress</option></select>
      </div>
      {visible.length ? <div className="student-course-grid">{visible.map((course) => (
        <article className="student-course-card" key={course.id}>
          <CourseCover course={course} />
          <div className="student-course-card__body">
            <div className="student-course-card__topline"><span className={`student-status student-status--${course.status.toLowerCase().replaceAll(" ", "-")}`}>{course.status}</span><button className="student-icon-button" aria-label={`More options for ${course.title}`}><MoreHorizontal size={18} /></button></div>
            <h2>{course.title}</h2><p>{course.instructor}</p>
            <div className="student-course-card__stats"><span><BookOpen size={15} /> {course.lessons} lessons</span><span><Clock3 size={15} /> {course.duration}</span></div>
            <ProgressBar value={course.progress} /><div className="student-course-card__progress"><strong>{course.progress}%</strong><span>{course.progress === 100 ? "Course completed" : course.nextLesson}</span></div>
            <Link className={`student-button student-button--wide ${course.progress ? "student-button--primary" : "student-button--soft"}`} to={course.id === "cell-structure-and-function" ? (course.progress === 100 ? "/student/courses/cell-structure-and-function" : "/student/learn/cell-structure-and-function") : "/student/courses/cell-structure-and-function"}>{course.progress === 100 ? "Review course" : course.progress ? "Continue learning" : "Start course"}<ArrowRight size={16} /></Link>
          </div>
        </article>
      ))}</div> : <EmptyState icon={<Search size={28} />} title="No courses found" detail="Try another search or status filter." />}
    </>
  );
}

function CourseDetailsPage({ page }: StudentPageProps) {
  const [tab, setTab] = useState("Overview");
  const course = courses[0];
  return (
    <>
      <Link className="student-back-link" to="/student/courses"><ArrowLeft size={16} /> My courses</Link>
      <section className="student-course-hero">
        <CourseCover course={course} />
        <div className="student-course-hero__copy"><span className="student-chip">{course.level} · {course.subject}</span><h1>{page.title.replace("My course details", course.title)}</h1><p>Understand the structures that make life possible, from organelles and membranes to energy pathways and cell division.</p><div className="student-course-hero__meta"><span><UserRound size={17} /> {course.instructor}</span><span><BookOpen size={17} /> 4 modules, {course.lessons} lessons</span><span><Clock3 size={17} /> {course.duration}</span></div><Link className="student-button student-button--amber" to="/student/learn/cell-structure-and-function"><Play size={16} fill="currentColor" /> Continue: The plasma membrane</Link></div>
        <div className="student-course-hero__progress"><ProgressRing value={68} /><strong>Course progress</strong><span>16 of 24 lessons complete</span><small>Last studied today</small></div>
      </section>
      <div className="student-tabbar" role="tablist">{["Overview", "Modules", "Resources", "Course Q&A"].map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "is-active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === "Overview" && <div className="student-course-detail-grid"><div className="student-panel student-prose"><h2>What you’ll master</h2><p>This course uses visual models, short guided lessons, and exam-style practice to connect cell structures with their functions.</p><div className="student-outcomes"><span><CheckCircle2 /> Explain the fluid mosaic model precisely</span><span><CheckCircle2 /> Compare passive and active transport</span><span><CheckCircle2 /> Connect organelles to cellular processes</span><span><CheckCircle2 /> Analyze microscopy and experimental data</span></div><h2>Your next milestone</h2><div className="student-milestone"><span>Module 2</span><div><strong>Inside the cell</strong><p>Complete three lessons and the module assessment.</p><ProgressBar value={50} /></div><b>3 / 6</b></div></div><aside className="student-panel"><h2>Course team</h2><div className="student-instructor"><img src="/assets/cta-instructor-pointing.png" alt="Dr. Ola" /><div><strong>Dr. Ola</strong><span>Molecular biology educator</span></div></div><p className="student-muted">10+ years teaching biology through visual models and real laboratory examples.</p><Link className="student-button student-button--soft student-button--wide" to="/student/messages">Message instructor</Link><hr /><h3>Course certificate</h3><p className="student-muted">Complete every lesson and score at least 70% on the final assessment.</p><span className="student-certificate-progress"><Award size={20} /> 68% toward eligibility</span></aside></div>}
      {tab === "Modules" && <ModuleList compact />}
      {tab === "Resources" && <div className="student-resource-list">{savedResources.slice(0, 4).map((resource) => <div key={resource.id} className="student-resource-row"><span className={`student-resource-icon student-resource-icon--${resource.color}`}><FileText /></span><div><strong>{resource.title}</strong><span>{resource.type} · {resource.detail}</span></div><button className="student-button student-button--soft"><Download size={16} /> Download</button></div>)}</div>}
      {tab === "Course Q&A" && <div className="student-inline-callout"><MessageCircleMore size={28} /><div><h2>Learn with the course community</h2><p>Browse 28 answered questions or ask Dr. Ola and your peers.</p></div><Link className="student-button student-button--primary" to="/student/qa">Open course Q&A</Link></div>}
    </>
  );
}

function ModuleList({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<string[]>(["cell-anatomy"]);
  const toggle = (id: string) => setOpen((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <div className={`student-modules ${compact ? "student-modules--compact" : ""}`}>{courseModules.map((module, moduleIndex) => {
    const isOpen = open.includes(module.id);
    const complete = module.completed === module.lessons.length;
    return <section className="student-module" key={module.id}><button className="student-module__head" onClick={() => toggle(module.id)} aria-expanded={isOpen}><span className={`student-module__number ${complete ? "is-complete" : ""}`}>{complete ? <Check size={18} /> : moduleIndex + 1}</span><div><span>Module {moduleIndex + 1}</span><h2>{module.title}</h2><p>{module.summary}</p></div><div className="student-module__meta"><strong>{module.completed} / {module.lessons.length}</strong><ProgressBar value={(module.completed / module.lessons.length) * 100} /></div><ChevronDown className={isOpen ? "is-open" : ""} size={19} /></button>{isOpen && <div className="student-lesson-list">{module.lessons.map((lesson, index) => <Link className={`student-lesson-row ${lesson.completed ? "is-complete" : ""} ${lesson.id === "membrane" ? "is-current" : ""} ${lesson.locked ? "is-locked" : ""}`} to={lesson.locked ? "#" : "/student/learn/cell-structure-and-function"} key={lesson.id} onClick={(event) => lesson.locked && event.preventDefault()}><span>{lesson.locked ? <Lock size={15} /> : lesson.completed ? <Check size={15} /> : lesson.type === "quiz" ? <ListChecks size={16} /> : lesson.type === "reading" ? <FileText size={16} /> : <Play size={15} />}</span><div><strong>{index + 1}. {lesson.title}</strong><small>{lesson.type} · {lesson.duration}</small></div>{lesson.id === "membrane" && <b>Continue</b>}<ChevronRight size={17} /></Link>)}</div>}</section>;
  })}</div>;
}

function ModulesPage({ page }: StudentPageProps) {
  const lessons = courseModules.flatMap((module) => module.lessons);
  const complete = lessons.filter((lesson) => lesson.completed).length;
  return <><PageHeading page={page} action={<Link className="student-button student-button--primary" to="/student/learn/cell-structure-and-function">Continue learning <ArrowRight size={16} /></Link>} /><section className="student-module-summary"><div><span>Cell Structure and Function</span><h2>Your course pathway</h2><p>Complete modules in order to unlock each new stage.</p></div><div><ProgressRing value={Math.round((complete / lessons.length) * 100)} size={82} /><span><strong>{complete} of {lessons.length}</strong> lessons complete</span></div><div className="student-module-summary__stats"><span><Clock3 /> 3h 54m watched</span><span><Target /> 90% quiz average</span><span><Award /> Certificate at 100%</span></div></section><ModuleList /></>;
}

function CoursePlayerPage() {
  const allLessons = courseModules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, module: module.title })));
  const [lessonId, setLessonId] = useStudentLocalState("current-lesson", "membrane");
  const [completed, setCompleted] = useStudentLocalState<string[]>("completed-lessons", allLessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id));
  const [notes, setNotes] = useStudentLocalState("lesson-note-membrane", "");
  const [tab, setTab] = useState("Overview");
  const [playing, setPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia("(min-width: 981px)").matches);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const currentIndex = Math.max(0, allLessons.findIndex((lesson) => lesson.id === lessonId));
  const current = allLessons[currentIndex];
  const markComplete = () => {
    if (!completed.includes(current.id)) setCompleted([...completed, current.id]);
    setToast({ title: "Lesson marked complete", detail: "Your course progress has been updated." });
  };
  const goTo = (direction: -1 | 1) => {
    const next = allLessons[currentIndex + direction];
    if (next && !next.locked) {
      setLessonId(next.id);
      setPlaying(false);
      setAnswer("");
      setChecked(false);
    }
  };
  return (
    <div className={`student-player ${sidebarOpen ? "student-player--sidebar" : ""}`}>
      <ToastNotice toast={toast} onClose={() => setToast(null)} />
      <div className="student-player__main">
        <div className="student-player__coursebar">
          <Link to="/student/courses/cell-structure-and-function"><ArrowLeft size={17} /> Exit course</Link>
          <div><span>Cell Structure and Function</span><ProgressBar value={68} /><b>68%</b></div>
          <button className="student-button student-button--dark-soft" onClick={() => setSidebarOpen((value) => !value)}><BookOpen size={16} /> {sidebarOpen ? "Hide" : "Show"} lessons</button>
        </div>

        <section className={`student-learning-stage student-learning-stage--${current.type}`}>
          {current.type === "video" && <div className="student-video-stage">
            <img src={current.id === "membrane" ? "/assets/lesson-video.webp" : "/assets/course-cell.webp"} alt="Biology lesson visual" />
            <div className="student-video-stage__shade" />
            {!playing && <button className="student-video-stage__center" onClick={() => setPlaying(true)} aria-label="Play lesson"><Play fill="currentColor" size={28} /></button>}
            {playing && <div className="student-video-stage__playing"><span /><strong>Lesson preview playing</strong><small>This front-end demo simulates local playback.</small></div>}
            <div className="student-video-controls">
              <button onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
              <span className="student-video-controls__track"><i style={{ width: playing ? "46%" : "31%" }} /></span>
              <small>{playing ? "07:48" : "05:10"} / {current.duration}</small>
              <button aria-label="Volume"><Volume2 /></button>
              <button className="student-video-controls__quality">HD</button>
            </div>
          </div>}
          {current.type === "reading" && <article className="student-reading-stage"><p className="student-eyebrow">Guided reading · {current.duration}</p><h1>{current.title}</h1><p className="student-reading-lead">Cells constantly exchange material with their environment. The direction and energy requirements of that movement reveal which transport mechanism is at work.</p><h2>A useful comparison</h2><div className="student-reading-comparison"><div><strong>Passive transport</strong><p>Moves substances down a concentration gradient without direct cellular energy.</p><span>Diffusion · osmosis · facilitated diffusion</span></div><div><strong>Active transport</strong><p>Uses energy to move substances against a concentration gradient.</p><span>Protein pumps · bulk transport</span></div></div><div className="student-reading-note"><Info size={20} /><p><strong>Exam language</strong>Always name the direction of the concentration gradient and whether ATP is required.</p></div></article>}
          {current.type === "quiz" && <div className="student-quiz-stage"><div className="student-quiz-stage__head"><span>Question 1 of 3</span><ProgressBar value={33} /></div><p className="student-eyebrow">Knowledge check</p><h1>Which membrane component is primarily responsible for selective transport?</h1><div className="student-quiz-options">{["Phospholipid tails", "Transport proteins", "Cholesterol molecules", "Carbohydrate chains"].map((option) => <label className={`${answer === option ? "is-selected" : ""} ${checked && option === "Transport proteins" ? "is-correct" : ""} ${checked && answer === option && answer !== "Transport proteins" ? "is-wrong" : ""}`} key={option}><input type="radio" name="quiz" value={option} checked={answer === option} onChange={() => { setAnswer(option); setChecked(false); }} /><span>{answer === option ? <CircleCheck /> : <Circle />}</span><strong>{option}</strong>{checked && option === "Transport proteins" && <Check size={17} />}</label>)}</div>{checked && <div className={`student-quiz-feedback ${answer === "Transport proteins" ? "is-correct" : "is-wrong"}`}><strong>{answer === "Transport proteins" ? "Correct." : "Not quite."}</strong><span>Channels and carriers give the membrane precise control over which substances cross.</span></div>}<button className="student-button student-button--primary" disabled={!answer} onClick={() => setChecked(true)}>Check answer</button></div>}
        </section>

        <div className="student-lesson-toolbar">
          <button className="student-button student-button--soft" disabled={currentIndex === 0} onClick={() => goTo(-1)}><ChevronLeft size={17} /> Previous</button>
          <div><p className="student-eyebrow">{current.module}</p><h1>{current.title}</h1><p>{current.summary ?? `${current.type === "video" ? "Video lesson" : current.type === "reading" ? "Guided reading" : "Knowledge check"} · ${current.duration}`}</p></div>
          <button className={`student-button ${completed.includes(current.id) ? "student-button--complete" : "student-button--primary"}`} onClick={markComplete}>{completed.includes(current.id) ? <Check size={16} /> : null}{completed.includes(current.id) ? "Completed" : "Mark complete"}</button>
          <button className="student-icon-button student-next-icon" disabled={currentIndex === allLessons.length - 1 || allLessons[currentIndex + 1]?.locked} onClick={() => goTo(1)} aria-label="Next lesson"><ChevronRight size={20} /></button>
        </div>

        <div className="student-player__below">
          <div className="student-tabbar student-tabbar--compact" role="tablist">{["Overview", "Transcript", "My notes", "Resources"].map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)} key={item}>{item}{item === "My notes" && notes && <i />}</button>)}</div>
          {tab === "Overview" && <div className="student-player-copy"><h2>Lesson outcomes</h2><p>By the end of this lesson, you can describe the fluid mosaic model, connect membrane components to their functions, and predict how different molecules cross the plasma membrane.</p><div className="student-key-points"><span><CheckCircle2 /> Describe phospholipid orientation</span><span><CheckCircle2 /> Explain selective permeability</span><span><CheckCircle2 /> Identify six membrane protein roles</span></div></div>}
          {tab === "Transcript" && <div className="student-transcript"><div className="student-transcript__tools"><label className="student-search-input"><Search size={16} /><input placeholder="Search transcript" /></label><button className="student-button student-button--soft"><Download size={15} /> Download</button></div>{transcript.map((line) => <button key={line.time} onClick={() => setPlaying(true)}><time>{line.time}</time><span>{line.text}</span></button>)}</div>}
          {tab === "My notes" && <div className="student-notes-editor"><div><h2>Notes for this lesson</h2><span>Saved automatically on this device</span></div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Capture a key idea, exam phrase, or question..." /><div><span>{notes.length} characters</span><button className="student-button student-button--primary" onClick={() => setToast({ title: "Notes saved", detail: "Your notes are available when you return." })}>Save notes</button></div></div>}
          {tab === "Resources" && <div className="student-resource-row"><span className="student-resource-icon student-resource-icon--teal"><FileText /></span><div><strong>Plasma membrane summary sheet</strong><span>Annotated diagram · PDF · 2.4 MB</span></div><button className="student-button student-button--soft" onClick={() => downloadTextFile("plasma-membrane-notes.txt", "BIOPHLO — Plasma membrane summary\nFluid mosaic model, selective permeability, and transport proteins.")}><Download size={16} /> Download</button></div>}
        </div>
      </div>

      <aside className="student-player__sidebar">
        <div className="student-player__sidebar-head"><div><p className="student-eyebrow">Course content</p><h2>24 lessons</h2></div><button className="student-icon-button" onClick={() => setSidebarOpen(false)} aria-label="Hide lessons"><X size={18} /></button></div>
        <div className="student-player-modules">{courseModules.map((module, moduleIndex) => <section key={module.id}><div className="student-player-module-title"><span>Module {moduleIndex + 1}</span><strong>{module.title}</strong><small>{module.completed}/{module.lessons.length}</small></div>{module.lessons.map((lesson) => <button key={lesson.id} disabled={lesson.locked} onClick={() => setLessonId(lesson.id)} className={`${lesson.id === current.id ? "is-current" : ""} ${completed.includes(lesson.id) ? "is-complete" : ""}`}><span>{lesson.locked ? <Lock size={13} /> : completed.includes(lesson.id) ? <Check size={14} /> : lesson.type === "video" ? <Play size={13} /> : lesson.type === "quiz" ? <ListChecks size={14} /> : <FileText size={14} />}</span><div><strong>{lesson.title}</strong><small>{lesson.duration}</small></div></button>)}</section>)}</div>
      </aside>
    </div>
  );
}

function ProgressPage({ page }: StudentPageProps) {
  const [period, setPeriod] = useState("Last 30 days");
  const month = [42, 25, 55, 30, 72, 49, 86, 51, 66, 94, 61, 78];
  return <><PageHeading page={page} action={<select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Progress reporting period"><option>Last 7 days</option><option>Last 30 days</option><option>This year</option></select>} />
    <section className="student-progress-hero"><div><p className="student-eyebrow">Learning momentum</p><h2>Strong and consistent</h2><p>You studied on 18 of the last 30 days. That is four more active days than your previous period.</p><div className="student-progress-hero__legend"><span><i /> Focused minutes</span><strong>14h 22m total</strong></div></div><div className="student-spark-chart">{month.map((height, index) => <span key={index}><i style={{ height: `${height}%` }} /></span>)}</div><div className="student-progress-hero__score"><ProgressRing value={84} size={116} /><strong>Momentum score</strong><span>Up 6 points</span></div></section>
    <div className="student-metrics-grid"><Metric icon={<Clock3 />} value="4h 07m" label="Study time" helper="This week" /><Metric icon={<CheckCircle2 />} value="23" label="Lessons completed" helper="Last 30 days" /><Metric icon={<Target />} value="86%" label="Average score" helper="+4% from August" /><Metric icon={<Zap />} value="7 days" label="Current streak" helper="Best: 12 days" /></div>
    <div className="student-analytics-grid"><section className="student-panel"><div className="student-panel__head"><div><p className="student-eyebrow">Course progress</p><h2>Completion by course</h2></div><Link className="student-text-link" to="/student/courses">Open courses</Link></div><div className="student-course-progress-list">{courses.map((course) => <div key={course.id}><CourseCover course={course} /><div><strong>{course.title}</strong><span>{course.progress === 100 ? "Completed" : `${course.progress}% complete`}</span><ProgressBar value={course.progress} /></div><b>{course.progress}%</b></div>)}</div></section><section className="student-panel"><div className="student-panel__head"><div><p className="student-eyebrow">Competency</p><h2>Topic mastery</h2></div><Info size={18} /></div><div className="student-mastery-list">{[["Cell structure",92],["Membrane transport",81],["Genetics",76],["Scientific skills",88],["Plant systems",95]].map(([label, value]) => <div key={label}><span><strong>{label}</strong><b>{value}%</b></span><ProgressBar value={Number(value)} /></div>)}</div><div className="student-insight"><Sparkles size={19} /><p><strong>Your next best focus</strong><span>One short review of active transport could raise your membrane mastery.</span></p></div></section></div>
    <section className="student-panel student-history-panel"><div className="student-panel__head"><div><p className="student-eyebrow">Recent activity</p><h2>Learning history</h2></div><button className="student-button student-button--soft"><Download size={15} /> Export progress</button></div><div className="student-activity-timeline"><div><span><Play /></span><p><strong>Completed “The nucleus and genetic control”</strong><small>Cell Structure and Function · Today, 09:12</small></p><b>+12 min</b></div><div><span><Target /></span><p><strong>Scored 92% on Cell anatomy assessment</strong><small>11 of 12 answers correct · 10 Sep</small></p><b>Passed</b></div><div><span><BookOpen /></span><p><strong>Completed Genetics module 2</strong><small>Genetics and Inheritance · 8 Sep</small></p><b>+1 module</b></div><div><span><Award /></span><p><strong>Earned Cell Explorer badge</strong><small>Achievement · 7 Sep</small></p><b>Unlocked</b></div></div></section>
  </>;
}

function AttemptsPage({ page }: StudentPageProps) {
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [selected, setSelected] = useState<(typeof attempts)[number] | null>(null);
  const visible = courseFilter === "All courses" ? attempts : attempts.filter((attempt) => attempt.course.includes(courseFilter));
  return <><PageHeading page={page} action={<Link className="student-button student-button--soft" to="/student/progress"><Activity size={16} /> View progress</Link>} />
    <div className="student-score-strip"><div><ProgressRing value={86} size={94} /><span><strong>86%</strong>Overall average</span></div><div><strong>5</strong><span>Assessments attempted</span></div><div><strong>4</strong><span>Passed first time</span></div><div><strong>92%</strong><span>Best recent score</span></div></div>
    <div className="student-filterbar"><select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} aria-label="Filter attempts by course"><option>All courses</option><option>Cell Structure</option><option>Genetics</option><option>Plant Biology</option></select><select aria-label="Filter attempts by status"><option>All results</option><option>Passed</option><option>Needs review</option></select><div className="student-filterbar__spacer" /><button className="student-button student-button--soft"><Download size={15} /> Export results</button></div>
    <section className="student-table-card"><div className="student-table student-attempts-table"><div className="student-table__head"><span>Assessment</span><span>Date</span><span>Result</span><span>Score</span><span>Time</span><span /></div>{visible.map((attempt) => <button className="student-table__row" key={attempt.assessment} onClick={() => setSelected(attempt)}><span><strong>{attempt.assessment}</strong><small>{attempt.course}</small></span><span>{attempt.date}</span><span><i className={`student-dot ${attempt.status === "Passed" ? "is-good" : "is-warning"}`} />{attempt.status}</span><span><b className={attempt.score >= 80 ? "student-score-good" : ""}>{attempt.score}%</b><small>{attempt.questions}</small></span><span>{attempt.time}</span><span><ChevronRight size={17} /></span></button>)}</div></section>
    {selected && <div className="student-modal-layer" onMouseDown={(event) => event.currentTarget === event.target && setSelected(null)}><section className="student-modal student-attempt-modal" role="dialog" aria-modal="true" aria-label="Attempt details"><div className="student-modal__head"><div><p className="student-eyebrow">Attempt details</p><h2>{selected.assessment}</h2></div><button className="student-icon-button" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button></div><div className="student-attempt-score"><ProgressRing value={selected.score} size={110} /><div><span className={`student-status ${selected.status === "Passed" ? "student-status--completed" : "student-status--review"}`}>{selected.status}</span><h3>{selected.questions} correct</h3><p>Completed {selected.date} in {selected.time}</p></div></div><div className="student-answer-review"><h3>Answer review</h3>{[true,true,true,false,true].map((correct,index) => <div key={index}><span className={correct ? "is-correct" : "is-wrong"}>{correct ? <Check size={14} /> : <X size={14} />}</span><p><strong>Question {index + 1}</strong><small>{correct ? "Correct answer" : "Review selective permeability"}</small></p><button>Review</button></div>)}</div><div className="student-modal__actions"><button className="student-button student-button--soft" onClick={() => setSelected(null)}>Close</button><Link className="student-button student-button--primary" to="/student/learn/cell-structure-and-function">Review lesson</Link></div></section></div>}
  </>;
}

function AchievementsPage({ page }: StudentPageProps) {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? badges : badges.filter((badge) => filter === "Earned" ? badge.earned : !badge.earned);
  return <><PageHeading page={page} />
    <section className="student-achievement-hero"><div className="student-achievement-orbit"><span>🏆</span><i /><i /><i /></div><div><p className="student-eyebrow">Achievement level 4</p><h2>Knowledge is becoming a habit.</h2><p>You’ve earned 4 of 8 current badges. Two more focused lessons unlock your next milestone.</p><div className="student-level-progress"><ProgressBar value={72} /><span><strong>1,440 XP</strong><b>2,000 XP to level 5</b></span></div></div><div className="student-achievement-stats"><span><strong>4</strong>earned</span><span><strong>3</strong>this month</span><span><strong>72%</strong>next level</span></div></section>
    <div className="student-section-head"><div><h2>Badge collection</h2><p>Milestones from your learning activity.</p></div><div className="student-segmented">{["All","Earned","In progress"].map((item) => <button className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div></div>
    <div className="student-badge-grid">{visible.map((badge) => <article className={`student-badge-card ${badge.earned ? "is-earned" : "is-locked"}`} key={badge.name}><span className={`student-badge-card__mark student-badge-card__mark--${badge.color}`}>{badge.earned ? badge.icon : <Lock size={23} />}</span><div><span>{badge.earned ? "Earned" : "In progress"}</span><h3>{badge.name}</h3><p>{badge.detail}</p></div>{badge.earned ? <small><CheckCircle2 size={14} /> {badge.date}</small> : <div className="student-badge-card__progress"><ProgressBar value={badge.progress ?? 0} /><small>{badge.progress}% complete</small></div>}</article>)}</div>
    <section className="student-panel student-next-achievement"><div><p className="student-eyebrow">Closest milestone</p><h2>Course finisher</h2><p>Complete one more course to add this badge to your collection.</p></div><div className="student-next-achievement__courses">{courses.slice(0,3).map((course) => <span key={course.id}><i className={course.progress === 100 ? "is-done" : ""}>{course.progress === 100 ? <Check /> : `${course.progress}%`}</i><b>{course.title}</b></span>)}</div><Link className="student-button student-button--primary" to="/student/courses">Continue a course</Link></section>
  </>;
}

function CertificatesPage({ page }: StudentPageProps) {
  const [toast, setToast] = useState<Toast>(null);
  const download = (title: string) => { downloadTextFile("BIOPHLO-certificate-BIO-2026-10482.txt", `BIOPHLO CERTIFICATE OF COMPLETION\n\n${title}\nAwarded to Layla Hassan\nCertificate BIO-2026-10482`); setToast({ title: "Certificate downloaded", detail: "A local certificate file has been created." }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} />
    <section className="student-certificate-feature"><div className="student-certificate-feature__seal"><Award size={42} /><i /></div><div><p className="student-eyebrow">Most recent certificate</p><h2>Introduction to Plant Biology</h2><p>Awarded to <strong>Layla Hassan</strong> on 18 August 2026</p><div className="student-certificate-feature__meta"><span><BadgeCheck size={16} /> Credential verified</span><span>Certificate BIO-2026-10482</span></div><div><Link className="student-button student-button--primary" to="/student/certificates/BIO-2026-10482">View certificate</Link><button className="student-button student-button--soft" onClick={() => download("Introduction to Plant Biology")}><Download size={16} /> Download PDF</button></div></div><div className="student-certificate-art"><img src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" /><span>Certificate of completion</span><strong>Introduction to<br />Plant Biology</strong><i>Layla Hassan</i><small>BIO-2026-10482</small></div></section>
    <div className="student-section-head"><div><h2>Your credentials</h2><p>1 earned · 2 in progress</p></div><button className="student-button student-button--soft"><Globe2 size={16} /> Public credential profile</button></div>
    <div className="student-credential-list"><article><span className="student-credential-list__icon"><Award /></span><div><strong>Introduction to Plant Biology</strong><span>Issued 18 Aug 2026 · Grade 96%</span></div><span className="student-status student-status--completed">Issued</span><Link className="student-icon-button" to="/student/certificates/BIO-2026-10482" aria-label="View certificate"><ChevronRight /></Link></article><article><span className="student-credential-list__icon is-progress"><ProgressRing value={68} size={52} /></span><div><strong>Cell Structure and Function</strong><span>16 of 24 lessons complete</span><ProgressBar value={68} /></div><span className="student-status student-status--in-progress">In progress</span><Link className="student-icon-button" to="/student/learn/cell-structure-and-function"><ChevronRight /></Link></article><article><span className="student-credential-list__icon is-progress"><ProgressRing value={42} size={52} /></span><div><strong>Genetics and Inheritance</strong><span>8 of 19 lessons complete</span><ProgressBar value={42} /></div><span className="student-status student-status--in-progress">In progress</span><Link className="student-icon-button" to="/student/courses"><ChevronRight /></Link></article></div>
  </>;
}

function CertificateDetailsPage({ page }: StudentPageProps) {
  const [toast, setToast] = useState<Toast>(null);
  const certificateText = "BIOPHLO Certificate BIO-2026-10482 — Introduction to Plant Biology — Layla Hassan — Issued 18 August 2026";
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><Link className="student-back-link" to="/student/certificates"><ArrowLeft size={16} /> Certificates</Link><PageHeading page={page} action={<div className="student-button-row"><button className="student-button student-button--soft" onClick={() => { copyText("BIO-2026-10482"); setToast({ title: "Certificate ID copied" }); }}><Copy size={16} /> Copy ID</button><button className="student-button student-button--primary" onClick={() => downloadTextFile("BIOPHLO-certificate.txt", certificateText)}><Download size={16} /> Download</button></div>} />
    <div className="student-certificate-detail-grid"><section className="student-certificate-full" aria-label="Certificate preview"><div className="student-certificate-full__border"><header><img src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" /><span>Science made clear</span></header><p>Certificate of completion</p><h2>This certifies that</h2><strong>Layla Hassan</strong><h3>has successfully completed</h3><b>Introduction to Plant Biology</b><div className="student-certificate-full__facts"><span><i>Final score</i><strong>96%</strong></span><span><i>Learning time</i><strong>5h 05m</strong></span><span><i>Completed</i><strong>18 Aug 2026</strong></span></div><footer><span><i>Dr. Ola</i><b>Course instructor</b></span><span className="student-certificate-full__seal"><Award /></span><span><i>BIO-2026-10482</i><b>Credential ID</b></span></footer></div></section><aside className="student-certificate-record"><section className="student-panel"><div className="student-verified-title"><BadgeCheck size={24} /><div><strong>Verified credential</strong><span>This BIOPHLO certificate is valid.</span></div></div><dl><div><dt>Recipient</dt><dd>Layla Hassan</dd></div><div><dt>Course</dt><dd>Introduction to Plant Biology</dd></div><div><dt>Issued</dt><dd>18 August 2026</dd></div><div><dt>Credential ID</dt><dd>BIO-2026-10482</dd></div><div><dt>Status</dt><dd><span className="student-status student-status--completed">Active</span></dd></div></dl></section><section className="student-panel"><h3>Share your achievement</h3><p className="student-muted">Anyone with the verification link can confirm this credential.</p><button className="student-button student-button--soft student-button--wide" onClick={() => { copyText(`${window.location.origin}/verify-certificate?id=BIO-2026-10482`); setToast({ title: "Verification link copied" }); }}><Copy size={16} /> Copy verification link</button><button className="student-button student-button--soft student-button--wide"><ExternalLink size={16} /> Add to LinkedIn</button></section></aside></div>
  </>;
}

function AnnouncementsPage({ page }: StudentPageProps) {
  const [items, setItems] = useStudentLocalState("announcements", announcements);
  const [filter, setFilter] = useState("All updates");
  const [selected, setSelected] = useState<number | null>(1);
  const visible = items.filter((item) => filter === "All updates" || item.category === filter);
  const markRead = (id: number) => setItems(items.map((item) => item.id === id ? { ...item, unread: false } : item));
  return <><PageHeading page={page} action={<button className="student-button student-button--soft" onClick={() => setItems(items.map((item) => ({ ...item, unread: false })))}><CheckCheckIcon /> Mark all read</button>} />
    <div className="student-filterbar"><div className="student-segmented">{["All updates","Course update","Live session","Community","Platform"].map((item) => <button className={filter === item ? "is-active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    <div className="student-announcement-list">{visible.map((item) => (
      <article className={`${item.unread ? "is-unread" : ""} ${item.important ? "is-important" : ""}`} key={item.id}>
        <button
          className="student-announcement-list__main"
          type="button"
          aria-expanded={selected === item.id}
          onClick={() => { setSelected(selected === item.id ? null : item.id); markRead(item.id); }}
        >
          <span className="student-announcement-list__date">{item.date.split(" ")[0]}<small>{item.date.split(" ").slice(1).join(" ")}</small></span>
          <div><span className="student-chip">{item.category}</span><h2>{item.title}</h2><p>{item.excerpt}</p><small>{item.author}</small></div>
          <ChevronDown className={selected === item.id ? "is-open" : ""} />
        </button>
        {selected === item.id && (
          <div className="student-announcement-expanded">
            <p>The session will be recorded and added to your course resources within 24 hours. Submit questions in Course Q&amp;A before 09:00 on Saturday so the instructor can include them in the clinic.</p>
            <div><button type="button" className="student-button student-button--primary">Add to calendar</button><Link className="student-button student-button--soft" to="/student/qa">Submit a question</Link></div>
          </div>
        )}
      </article>
    ))}</div>
  </>;
}

function CheckCheckIcon() { return <span className="student-double-check"><Check size={13} /><Check size={13} /></span>; }

function QaPage({ page }: StudentPageProps) {
  const [questions, setQuestions] = useStudentLocalState<Question[]>("course-questions", initialQuestions);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All questions");
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [lesson, setLesson] = useState("The plasma membrane");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const visible = questions.filter((question) => (filter === "All questions" || (filter === "Solved" ? question.solved : !question.solved)) && `${question.title} ${question.body}`.toLowerCase().includes(query.toLowerCase()));
  const submit = (event: FormEvent) => { event.preventDefault(); if (title.trim().length < 10 || body.trim().length < 20) { setError("Add a specific title and at least 20 characters of context."); return; } setQuestions([{ id: Date.now(), title: title.trim(), body: body.trim(), lesson, author: "Layla Hassan", answers: 0, votes: 0, solved: false, date: "Just now" }, ...questions]); setTitle(""); setBody(""); setError(""); setModal(false); setToast({ title: "Question published", detail: "Your course community can now respond." }); };
  const vote = (id: number) => setQuestions(questions.map((question) => question.id === id ? { ...question, votes: question.votes + 1 } : question));
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} action={<button className="student-button student-button--primary" onClick={() => setModal(true)}><Plus size={16} /> Ask a question</button>} />
    <section className="student-qa-banner"><CircleHelp size={27} /><div><strong>Before you ask</strong><p>Search first, name the lesson, and share what you have already tried. Clear questions get clearer answers.</p></div><Link to="/student/courses/cell-structure-and-function">Course overview <ArrowRight size={15} /></Link></section>
    <div className="student-filterbar"><label className="student-search-input"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 28 course questions" /></label><div className="student-segmented">{["All questions","Unanswered","Solved"].map((item) => <button className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><select aria-label="Sort questions"><option>Most recent</option><option>Most helpful</option><option>Most answers</option></select></div>
    <div className="student-qa-layout"><section className="student-question-list">{visible.map((question) => <article key={question.id}><button className="student-vote-button" onClick={() => vote(question.id)} aria-label={`Upvote ${question.title}`}><ChevronUpIcon /><strong>{question.votes}</strong><span>votes</span></button><div><div className="student-question-list__meta"><span>{question.lesson}</span>{question.solved && <b><CheckCircle2 size={14} /> Solved</b>}</div><h2>{question.title}</h2><p>{question.body}</p><footer><span className="student-avatar student-avatar--small">{question.author.split(" ").map((name) => name[0]).join("")}</span><span>Asked by <strong>{question.author}</strong> · {question.date}</span><b><MessageCircle size={14} /> {question.answers} answers</b></footer></div></article>)}{!visible.length && <EmptyState icon={<MessageCircleMore size={27} />} title="No questions match" detail="Try a broader search or ask a new question." />}</section><aside className="student-panel student-qa-side"><h3>Course Q&amp;A</h3><p>Cell Structure and Function</p><dl><div><dt>Questions</dt><dd>{questions.length + 24}</dd></div><div><dt>Solved</dt><dd>91%</dd></div><div><dt>Typical reply</dt><dd>&lt; 8h</dd></div></dl><hr /><h3>Top contributors</h3>{["Dr. Ola","Maya Nasser","Omar Haddad"].map((name,index) => <span className="student-contributor" key={name}><i>{name.split(" ").map((word) => word[0]).join("")}</i><b>{name}</b><small>{18 - index * 5} answers</small></span>)}</aside></div>
    {modal && <div className="student-modal-layer" onMouseDown={(event) => event.currentTarget === event.target && setModal(false)}><form className="student-modal student-question-modal" onSubmit={submit}><div className="student-modal__head"><div><p className="student-eyebrow">Cell Structure and Function</p><h2>Ask a course question</h2></div><button type="button" className="student-icon-button" onClick={() => setModal(false)} aria-label="Close"><X /></button></div><label className="student-field"><span>Lesson</span><select value={lesson} onChange={(event) => setLesson(event.target.value)}>{courseModules.flatMap((module) => module.lessons).map((item) => <option key={item.id}>{item.title}</option>)}</select></label><label className="student-field"><span>Question title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Summarize the question in one sentence" maxLength={120} /><small>{title.length}/120</small></label><label className="student-field"><span>Context and what you tried</span><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Explain where you got stuck and what you understand so far..." rows={6} /></label>{error && <p className="student-form-error"><Info size={15} /> {error}</p>}<div className="student-modal__actions"><button type="button" className="student-button student-button--soft" onClick={() => setModal(false)}>Cancel</button><button className="student-button student-button--primary">Publish question</button></div></form></div>}
  </>;
}

function ChevronUpIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6" /></svg>; }

function MessagesPage({ page }: StudentPageProps) {
  const [conversationId, setConversationId] = useState("ola");
  const [messages, setMessages] = useStudentLocalState("chat-ola", initialChat);
  const [draft, setDraft] = useState("");
  const active = conversations.find((conversation) => conversation.id === conversationId) ?? conversations[0];
  const send = (event: FormEvent) => { event.preventDefault(); if (!draft.trim()) return; setMessages([...messages, { id: Date.now(), sender: "me", text: draft.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]); setDraft(""); };
  return <><PageHeading page={page} action={<button className="student-button student-button--primary"><Plus size={16} /> New message</button>} />
    <section className="student-messages-shell">
      <aside className="student-conversation-list"><label className="student-search-input"><Search size={16} /><input placeholder="Search messages" /></label><div className="student-conversation-list__head"><strong>Conversations</strong><button className="student-icon-button"><Filter size={16} /></button></div>{conversations.map((conversation) => <button key={conversation.id} onClick={() => setConversationId(conversation.id)} className={conversationId === conversation.id ? "is-active" : ""}><span className="student-avatar">{conversation.avatar}<i className={conversation.online ? "is-online" : ""} /></span><div><strong>{conversation.name}</strong><small>{conversation.preview}</small></div><span><time>{conversation.time}</time>{conversation.unread > 0 && <b>{conversation.unread}</b>}</span></button>)}</aside>
      <div className="student-chat"><header><div className="student-avatar">{active.avatar}<i className={active.online ? "is-online" : ""} /></div><div><strong>{active.name}</strong><span>{active.role} · {active.online ? "Online" : "Usually replies within a day"}</span></div><button className="student-icon-button" aria-label="Conversation options"><MoreHorizontal /></button></header><div className="student-chat__context"><BookOpen size={16} /><span>Related course: <strong>Cell Structure and Function</strong></span><Link to="/student/courses/cell-structure-and-function">Open course</Link></div><div className="student-chat__messages"><span className="student-chat__day">Today</span>{messages.map((message) => <div className={`student-chat-bubble student-chat-bubble--${message.sender}`} key={message.id}>{message.sender === "them" && <span className="student-avatar student-avatar--small">SA</span>}<div><p>{message.text}</p><time>{message.time}{message.sender === "me" && <Check size={13} />}</time></div></div>)}</div><form className="student-chat-composer" onSubmit={send}><div><button type="button" aria-label="Attach file"><Paperclip size={19} /></button><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." rows={1} /><button type="button" aria-label="Add resource"><BookMarked size={19} /></button><button className="student-chat-composer__send" disabled={!draft.trim()} aria-label="Send message"><Send size={18} /></button></div><span>Enter to send · Keep course questions in Q&amp;A so others can benefit.</span></form></div>
      <aside className="student-chat-details"><div className="student-chat-details__profile"><span className="student-avatar student-avatar--large">{active.avatar}</span><h3>{active.name}</h3><p>{active.role}</p></div><div><strong>Shared resources</strong><span><FileText /> Membrane feedback.pdf <Download size={15} /></span><span><Image /> Cell diagram.png <Download size={15} /></span></div><div><strong>Conversation settings</strong><button><Bell size={17} /> Notifications <span>On</span></button><button><Search size={17} /> Search conversation</button></div></aside>
    </section>
  </>;
}

function NotificationsPage({ page }: StudentPageProps) {
  const [items, setItems] = useStudentLocalState("notifications", initialNotifications);
  const [filter, setFilter] = useState("All");
  const filtered = items.filter((item) => filter === "All" || (filter === "Unread" ? item.unread : item.kind === filter.toLowerCase()));
  const iconFor = (kind: string) => kind === "course" ? <BookOpen /> : kind === "answer" ? <MessageCircle /> : kind === "achievement" ? <Award /> : kind === "billing" ? <ReceiptText /> : <AlarmClock />;
  return <><PageHeading page={page} action={<div className="student-button-row"><button className="student-button student-button--soft" onClick={() => setItems(items.map((item) => ({ ...item, unread: false })))}><Check size={16} /> Mark all read</button><Link className="student-button student-button--soft" to="/student/preferences"><Settings2 size={16} /> Preferences</Link></div>} />
    <div className="student-filterbar"><div className="student-segmented">{["All","Unread","Course","Answer","Achievement","Billing"].map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}{item === "Unread" && ` ${items.filter((entry) => entry.unread).length}`}</button>)}</div></div>
    <section className="student-notification-list">{filtered.map((item) => <article className={item.unread ? "is-unread" : ""} key={item.id}><span className={`student-notification-list__icon is-${item.kind}`}>{iconFor(item.kind)}</span><button onClick={() => setItems(items.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry))}><div><strong>{item.title}</strong>{item.unread && <i />}</div><p>{item.detail}</p><time>{item.time}</time></button><button className="student-icon-button" onClick={() => setItems(items.filter((entry) => entry.id !== item.id))} aria-label={`Remove ${item.title}`}><X size={16} /></button></article>)}{!filtered.length && <EmptyState icon={<Bell size={28} />} title="Nothing here" detail="You’re all caught up in this category." />}</section>
  </>;
}

function BillingPage({ page }: StudentPageProps) {
  const [query, setQuery] = useState("");
  const visible = orders.filter((order) => `${order.id} ${order.item}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeading page={page} action={<Link className="student-button student-button--soft" to="/student/subscription"><CreditCard size={16} /> Manage subscription</Link>} />
    <section className="student-billing-summary"><div><span className="student-billing-summary__brand">VISA</span><div><p className="student-eyebrow">Default payment method</p><strong>Visa ending in 4821</strong><span>Expires 08/29</span></div><button className="student-button student-button--soft">Update</button></div><div><span className="student-billing-summary__plan"><Sparkles /></span><div><p className="student-eyebrow">Current plan</p><strong>BIOPHLO Plus</strong><span>Renews 1 Sep 2027 · $119/year</span></div><Link className="student-button student-button--soft" to="/student/subscription">View plan</Link></div></section>
    <div className="student-section-head"><div><h2>Order history</h2><p>Receipts and payment records for your account.</p></div><label className="student-search-input"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order ID or item" /></label></div>
    <section className="student-table-card"><div className="student-table student-orders-table"><div className="student-table__head"><span>Order</span><span>Date</span><span>Payment method</span><span>Total</span><span>Status</span><span /></div>{visible.map((order) => <Link to="/student/billing/invoice/BIO-10482" className="student-table__row" key={order.id}><span><strong>{order.item}</strong><small>{order.id}</small></span><span>{order.date}</span><span>{order.method}</span><span><b>{order.total}</b></span><span><i className={`student-status student-status--${order.status.toLowerCase()}`}>{order.status}</i></span><span><ChevronRight size={17} /></span></Link>)}</div></section>
    <section className="student-tax-note"><FileCheck2 size={20} /><div><strong>Need a billing document with school details?</strong><p>Update your billing profile before downloading a new invoice.</p></div><button className="student-text-button">Edit billing profile</button></section>
  </>;
}

function InvoicePage({ page }: StudentPageProps) {
  const [toast, setToast] = useState<Toast>(null);
  const downloadInvoice = () => { downloadTextFile("BIOPHLO-invoice-BIO-10482.txt", "BIOPHLO INVOICE\nInvoice: BIO-10482\nIssued: 1 September 2026\nBIOPHLO Plus — Annual: $119.00\nTax: $0.00\nTotal paid: $119.00\nVisa ending in 4821"); setToast({ title: "Invoice downloaded" }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><Link className="student-back-link" to="/student/billing"><ArrowLeft size={16} /> Orders and billing</Link><PageHeading page={page} action={<div className="student-button-row"><button className="student-button student-button--soft" onClick={() => window.print()}><ReceiptText size={16} /> Print</button><button className="student-button student-button--primary" onClick={downloadInvoice}><Download size={16} /> Download invoice</button></div>} />
    <div className="student-invoice-layout"><section className="student-invoice"><header><img src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" /><div><span>Invoice</span><strong>BIO-10482</strong></div></header><div className="student-invoice__addresses"><div><span>Issued by</span><strong>BIOPHLO Learning Ltd.</strong><p>Digital learning services<br />support@biophlo.com</p></div><div><span>Billed to</span><strong>Layla Hassan</strong><p>Beirut International College<br />Beirut, Lebanon<br />layla.hassan@example.com</p></div><div><span>Invoice details</span><dl><div><dt>Issue date</dt><dd>1 Sep 2026</dd></div><div><dt>Status</dt><dd><b>Paid</b></dd></div><div><dt>Currency</dt><dd>USD</dd></div></dl></div></div><div className="student-invoice__items"><div className="student-invoice__items-head"><span>Description</span><span>Qty</span><span>Unit price</span><span>Amount</span></div><div><span><strong>BIOPHLO Plus — annual plan</strong><small>Access period: 1 Sep 2026 – 31 Aug 2027</small></span><span>1</span><span>$119.00</span><span>$119.00</span></div></div><div className="student-invoice__totals"><dl><div><dt>Subtotal</dt><dd>$119.00</dd></div><div><dt>Tax</dt><dd>$0.00</dd></div><div><dt>Total paid</dt><dd>$119.00</dd></div></dl></div><footer><span><CheckCircle2 /> Paid on 1 September 2026 with Visa ending in 4821</span><p>Thank you for learning with BIOPHLO. For billing help, quote invoice BIO-10482.</p></footer></section><aside><section className="student-panel"><h3>Payment summary</h3><dl className="student-detail-list"><div><dt>Payment status</dt><dd><span className="student-status student-status--paid">Paid</span></dd></div><div><dt>Transaction</dt><dd>pi_••••4836</dd></div><div><dt>Payment method</dt><dd>Visa •••• 4821</dd></div><div><dt>Billing country</dt><dd>Lebanon</dd></div></dl></section><section className="student-panel"><h3>Need help?</h3><p className="student-muted">Our billing team typically replies within one business day.</p><Link className="student-button student-button--soft student-button--wide" to="/student/support">Contact billing support</Link></section></aside></div>
  </>;
}

function SubscriptionPage({ page }: StudentPageProps) {
  const [annual, setAnnual] = useStudentLocalState("billing-cycle", true);
  const [renew, setRenew] = useStudentLocalState("auto-renew", true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} />
    <section className="student-plan-card"><div className="student-plan-card__brand"><Sparkles /><span>Current plan</span></div><div className="student-plan-card__copy"><div><span className="student-status student-status--completed">Active</span><h2>BIOPHLO Plus</h2><p>Complete course access, progress analytics, certificates, and instructor Q&amp;A.</p></div><div className="student-plan-card__price"><strong>${annual ? "119" : "14"}<small>/{annual ? "year" : "month"}</small></strong><span>{annual ? "Equivalent to $9.92/month" : "Billed monthly"}</span></div></div><div className="student-plan-card__renewal"><CalendarDays /><div><strong>{renew ? "Renews 1 September 2027" : "Ends 31 August 2027"}</strong><span>{renew ? "We’ll charge Visa ending in 4821." : "Access continues until the current term ends."}</span></div><button className={`student-switch ${renew ? "is-on" : ""}`} onClick={() => setRenew(!renew)} role="switch" aria-checked={renew}><i /></button></div><div className="student-plan-card__actions"><button className="student-button student-button--soft" onClick={() => setModal(true)}>Change plan</button><button className="student-text-button student-text-button--danger" onClick={() => setRenew(false)}>Turn off renewal</button></div></section>
    <div className="student-subscription-grid"><section className="student-panel"><div className="student-panel__head"><div><p className="student-eyebrow">Included with Plus</p><h2>Your plan benefits</h2></div><BadgeCheck size={21} /></div><div className="student-benefit-list"><span><Check /> Full access to 50+ biology courses</span><span><Check /> Downloadable study guides and diagrams</span><span><Check /> Verified course certificates</span><span><Check /> Instructor Q&amp;A and private messages</span><span><Check /> Detailed progress and score insights</span></div></section><section className="student-panel"><div className="student-panel__head"><div><p className="student-eyebrow">Payment</p><h2>Billing details</h2></div><CreditCard size={21} /></div><div className="student-payment-method"><span>VISA</span><div><strong>Visa ending in 4821</strong><small>Expires 08/29</small></div><CheckCircle2 /></div><button className="student-button student-button--soft student-button--wide">Update payment method</button><hr /><div className="student-next-charge"><span>Next charge</span><strong>$119.00</strong><small>1 September 2027</small></div></section></div>
    {modal && <div className="student-modal-layer" onMouseDown={(event) => event.currentTarget === event.target && setModal(false)}><section className="student-modal"><div className="student-modal__head"><div><p className="student-eyebrow">Plan options</p><h2>Choose your billing cycle</h2></div><button className="student-icon-button" onClick={() => setModal(false)}><X /></button></div><div className="student-billing-options"><button className={!annual ? "is-selected" : ""} onClick={() => setAnnual(false)}><span><strong>Monthly</strong><small>Flexible billing</small></span><b>$14<small>/month</small></b></button><button className={annual ? "is-selected" : ""} onClick={() => setAnnual(true)}><span><strong>Annual</strong><small>Save $49 per year</small></span><b>$119<small>/year</small></b></button></div><p className="student-modal-note"><Info size={16} /> Your plan updates at the next renewal. Current access is unchanged.</p><div className="student-modal__actions"><button className="student-button student-button--soft" onClick={() => setModal(false)}>Cancel</button><button className="student-button student-button--primary" onClick={() => { setModal(false); setToast({ title: "Billing cycle updated", detail: `Your next term will be billed ${annual ? "annually" : "monthly"}.` }); }}>Confirm change</button></div></section></div>}
  </>;
}

function SavedResourcesPage({ page }: StudentPageProps) {
  const [items, setItems] = useStudentLocalState("saved-resources", savedResources);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All resources");
  const [toast, setToast] = useState<Toast>(null);
  const filtered = items.filter((item) => (type === "All resources" || item.type === type) && `${item.title} ${item.topic}`.toLowerCase().includes(query.toLowerCase()));
  const remove = (id: number) => { setItems(items.filter((item) => item.id !== id)); setToast({ title: "Removed from saved", detail: "You can save it again from the resource library.", tone: "info" }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} action={<Link className="student-button student-button--primary" to="/resources">Explore library <ArrowRight size={16} /></Link>} />
    <div className="student-library-summary"><span><Library size={23} /></span><div><strong>{items.length} saved resources</strong><p>Available from this browser whenever you study.</p></div><div><b>4</b><span>topics</span></div><div><b>3</b><span>formats</span></div></div>
    <div className="student-filterbar"><label className="student-search-input"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved resources" /></label><select value={type} onChange={(event) => setType(event.target.value)}><option>All resources</option><option>Study guide</option><option>Diagram</option><option>Video</option><option>Past paper</option><option>Worksheet</option><option>Article</option></select><select><option>Recently saved</option><option>Title A–Z</option><option>Resource type</option></select></div>
    {filtered.length ? <div className="student-resource-grid">{filtered.map((resource) => <article key={resource.id}><div className={`student-resource-grid__visual is-${resource.color}`}>{resource.type === "Video" ? <Play /> : resource.type === "Past paper" ? <FileCheck2 /> : resource.type === "Diagram" ? <Image /> : <FileText />}<span>{resource.type}</span></div><div><span>{resource.topic}</span><h2>{resource.title}</h2><p>{resource.detail}</p><small>{resource.date}</small></div><footer><button className="student-button student-button--soft" onClick={() => downloadTextFile(`${resource.title}.txt`, `BIOPHLO RESOURCE\n${resource.title}\n${resource.topic}\n${resource.detail}`)}>{resource.type === "Video" ? <Play size={15} /> : <Download size={15} />}{resource.type === "Video" ? "Watch" : "Open"}</button><button className="student-icon-button is-saved" onClick={() => remove(resource.id)} aria-label={`Remove ${resource.title} from saved`}><Bookmark size={18} fill="currentColor" /></button></footer></article>)}</div> : <EmptyState icon={<Bookmark size={29} />} title="No saved resources match" detail="Change the filter or explore the resource library." />}
  </>;
}

type ProfileData = typeof profileDefaults;

function ProfilePage({ page }: StudentPageProps) {
  const [profile, setProfile] = useStudentLocalState<ProfileData>("profile", profileDefaults);
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [toast, setToast] = useState<Toast>(null);
  const update = (key: keyof ProfileData, value: string) => setDraft({ ...draft, [key]: value });
  const submit = (event: FormEvent) => { event.preventDefault(); const nextErrors: Record<string,string> = {}; if (!draft.firstName.trim()) nextErrors.firstName = "First name is required."; if (!/^\S+@\S+\.\S+$/.test(draft.email)) nextErrors.email = "Enter a valid email address."; if (draft.bio.length > 240) nextErrors.bio = "Keep your bio under 240 characters."; setErrors(nextErrors); if (Object.keys(nextErrors).length) return; setProfile(draft); setToast({ title: "Profile updated", detail: "Your changes have been saved locally." }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} />
    <form className="student-settings-layout" onSubmit={submit}><aside className="student-settings-nav"><a className="is-active" href="#personal">Personal details</a><a href="#learning">Learning profile</a><a href="#public">Public profile</a><Link to="/student/preferences">Preferences</Link><Link to="/student/security">Security</Link></aside><div className="student-settings-content"><section className="student-settings-card" id="personal"><div className="student-settings-card__head"><div><h2>Profile photo</h2><p>Shown in course Q&amp;A and conversations.</p></div></div><div className="student-avatar-editor"><span className="student-avatar student-avatar--xlarge">LH</span><div><button type="button" className="student-button student-button--soft"><Upload size={15} /> Upload photo</button><button type="button" className="student-text-button student-text-button--danger">Remove</button><small>JPG or PNG, up to 5 MB.</small></div></div></section><section className="student-settings-card"><div className="student-settings-card__head"><div><h2>Personal details</h2><p>Used for your account and course certificates.</p></div></div><div className="student-form-grid"><label className="student-field"><span>First name</span><input value={draft.firstName} onChange={(event) => update("firstName", event.target.value)} />{errors.firstName && <small className="is-error">{errors.firstName}</small>}</label><label className="student-field"><span>Last name</span><input value={draft.lastName} onChange={(event) => update("lastName", event.target.value)} /></label><label className="student-field student-field--wide"><span>Email address</span><input type="email" value={draft.email} onChange={(event) => update("email", event.target.value)} />{errors.email && <small className="is-error">{errors.email}</small>}</label><label className="student-field"><span>Phone number</span><input value={draft.phone} onChange={(event) => update("phone", event.target.value)} /></label><label className="student-field"><span>Country</span><select value={draft.country} onChange={(event) => update("country", event.target.value)}><option>Lebanon</option><option>Jordan</option><option>United Arab Emirates</option><option>United Kingdom</option></select></label><label className="student-field"><span>City</span><input value={draft.city} onChange={(event) => update("city", event.target.value)} /></label></div></section><section className="student-settings-card" id="learning"><div className="student-settings-card__head"><div><h2>Learning profile</h2><p>Helps BIOPHLO shape relevant recommendations.</p></div></div><div className="student-form-grid"><label className="student-field"><span>School or institution</span><input value={draft.school} onChange={(event) => update("school", event.target.value)} /></label><label className="student-field"><span>Current grade or level</span><select value={draft.grade} onChange={(event) => update("grade", event.target.value)}><option>Grade 10</option><option>Grade 11</option><option>Grade 12</option><option>Undergraduate</option><option>Independent learner</option></select></label><label className="student-field student-field--wide"><span>About your learning goals</span><textarea value={draft.bio} onChange={(event) => update("bio", event.target.value)} rows={4} /><small>{draft.bio.length}/240</small>{errors.bio && <small className="is-error">{errors.bio}</small>}</label></div></section><div className="student-settings-actions"><span>Last updated today</span><button type="button" className="student-button student-button--soft" onClick={() => setDraft(profile)}>Discard changes</button><button className="student-button student-button--primary">Save changes</button></div></div></form>
  </>;
}

type Preferences = { weeklyGoal: string; sessionLength: string; reminderTime: string; reminders: boolean; courseUpdates: boolean; answers: boolean; billing: boolean; digest: boolean; autoplay: boolean; captions: boolean; speed: string; examBoard: string; level: string; };
const preferenceDefaults: Preferences = { weeklyGoal: "300", sessionLength: "25", reminderTime: "18:30", reminders: true, courseUpdates: true, answers: true, billing: true, digest: false, autoplay: false, captions: true, speed: "1", examBoard: "AQA", level: "A-level" };

function ToggleRow({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="student-toggle-row"><div><strong>{label}</strong><span>{detail}</span></div><button type="button" className={`student-switch ${checked ? "is-on" : ""}`} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}><i /></button></div>;
}

function PreferencesPage({ page }: StudentPageProps) {
  const [saved, setSaved] = useStudentLocalState<Preferences>("learning-preferences", preferenceDefaults);
  const [draft, setDraft] = useState(saved);
  const [toast, setToast] = useState<Toast>(null);
  const patch = <K extends keyof Preferences>(key: K, value: Preferences[K]) => setDraft({ ...draft, [key]: value });
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} />
    <div className="student-settings-layout"><aside className="student-settings-nav"><a className="is-active" href="#goals">Study routine</a><a href="#content">Content</a><a href="#playback">Playback</a><a href="#notifications">Notifications</a></aside><div className="student-settings-content"><section className="student-settings-card" id="goals"><div className="student-settings-card__head"><div><h2>Study routine</h2><p>Set a realistic rhythm. You can change it whenever life changes.</p></div><Target /></div><div className="student-form-grid"><label className="student-field"><span>Weekly study goal</span><select value={draft.weeklyGoal} onChange={(event) => patch("weeklyGoal", event.target.value)}><option value="180">3 hours</option><option value="300">5 hours</option><option value="420">7 hours</option><option value="600">10 hours</option></select></label><label className="student-field"><span>Preferred session length</span><select value={draft.sessionLength} onChange={(event) => patch("sessionLength", event.target.value)}><option value="15">15 minutes</option><option value="25">25 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label><label className="student-field"><span>Study reminder time</span><input type="time" value={draft.reminderTime} onChange={(event) => patch("reminderTime", event.target.value)} /></label></div><ToggleRow label="Daily study reminder" detail="A gentle prompt when you have not studied that day." checked={draft.reminders} onChange={(value) => patch("reminders", value)} /></section><section className="student-settings-card" id="content"><div className="student-settings-card__head"><div><h2>Content alignment</h2><p>Prioritize material that matches what you are studying.</p></div><BookOpen /></div><div className="student-form-grid"><label className="student-field"><span>Exam board</span><select value={draft.examBoard} onChange={(event) => patch("examBoard", event.target.value)}><option>AQA</option><option>Cambridge International</option><option>Edexcel</option><option>IB</option><option>Other</option></select></label><label className="student-field"><span>Study level</span><select value={draft.level} onChange={(event) => patch("level", event.target.value)}><option>GCSE</option><option>A-level</option><option>IB Diploma</option><option>Undergraduate</option></select></label></div></section><section className="student-settings-card" id="playback"><div className="student-settings-card__head"><div><h2>Lesson playback</h2><p>Applied whenever you open a video lesson.</p></div><Video /></div><ToggleRow label="Show captions by default" detail="Use English captions when they are available." checked={draft.captions} onChange={(value) => patch("captions", value)} /><ToggleRow label="Autoplay next lesson" detail="Start the next video after a 10-second countdown." checked={draft.autoplay} onChange={(value) => patch("autoplay", value)} /><label className="student-field student-field--inline"><span>Default playback speed</span><select value={draft.speed} onChange={(event) => patch("speed", event.target.value)}><option value="0.75">0.75×</option><option value="1">1× Normal</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label></section><section className="student-settings-card" id="notifications"><div className="student-settings-card__head"><div><h2>Notification choices</h2><p>Essential security messages are always sent.</p></div><Bell /></div><ToggleRow label="Course updates" detail="New lessons, resources, and live sessions." checked={draft.courseUpdates} onChange={(value) => patch("courseUpdates", value)} /><ToggleRow label="Answers and messages" detail="Replies from instructors, support, and peers." checked={draft.answers} onChange={(value) => patch("answers", value)} /><ToggleRow label="Billing messages" detail="Renewals, payment receipts, and plan changes." checked={draft.billing} onChange={(value) => patch("billing", value)} /><ToggleRow label="Weekly learning digest" detail="A Sunday summary of progress and next steps." checked={draft.digest} onChange={(value) => patch("digest", value)} /></section><div className="student-settings-actions"><button className="student-button student-button--soft" onClick={() => setDraft(saved)}>Reset changes</button><button className="student-button student-button--primary" onClick={() => { setSaved(draft); setToast({ title: "Preferences saved", detail: "Your learning experience has been updated." }); }}>Save preferences</button></div></div></div>
  </>;
}

function SecurityPage({ page }: StudentPageProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!current) return setError("Enter your current password."); if (next.length < 10 || !/[A-Z]/.test(next) || !/[0-9]/.test(next)) return setError("Use at least 10 characters, one capital, and one number."); if (next !== confirm) return setError("New passwords do not match."); setError(""); setCurrent(""); setNext(""); setConfirm(""); setToast({ title: "Password updated", detail: "Other active sessions remain signed in." }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} />
    <section className="student-security-score"><div className="student-security-score__icon"><ShieldCheck /></div><div><p className="student-eyebrow">Account protection</p><h2>Your security is strong</h2><p>Two-factor authentication is enabled and your recent sign-ins look familiar.</p><ProgressBar value={92} /></div><strong>92<span>/100</span></strong></section>
    <div className="student-security-grid"><section className="student-settings-card"><div className="student-settings-card__head"><div><h2>Password</h2><p>Last changed 4 months ago.</p></div><LockKeyhole /></div><form onSubmit={submit} className="student-password-form"><label className="student-field"><span>Current password</span><div className="student-password-input"><input type={showPasswords ? "text" : "password"} value={current} onChange={(event) => setCurrent(event.target.value)} autoComplete="current-password" /><button type="button" onClick={() => setShowPasswords(!showPasswords)} aria-label={showPasswords ? "Hide passwords" : "Show passwords"}>{showPasswords ? <EyeOff /> : <Eye />}</button></div></label><div className="student-form-grid"><label className="student-field"><span>New password</span><input type={showPasswords ? "text" : "password"} value={next} onChange={(event) => setNext(event.target.value)} autoComplete="new-password" /></label><label className="student-field"><span>Confirm new password</span><input type={showPasswords ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" /></label></div><div className="student-password-rules"><span className={next.length >= 10 ? "is-met" : ""}><Check /> 10+ characters</span><span className={/[A-Z]/.test(next) ? "is-met" : ""}><Check /> One capital letter</span><span className={/[0-9]/.test(next) ? "is-met" : ""}><Check /> One number</span></div>{error && <p className="student-form-error"><Info size={15} /> {error}</p>}<button className="student-button student-button--primary">Update password</button></form></section><div className="student-security-stack"><section className="student-security-option"><span className="student-security-option__icon"><Smartphone /></span><div><span className="student-status student-status--completed">Enabled</span><h2>Two-factor authentication</h2><p>An authenticator code is required on new devices.</p><Link className="student-text-link" to="/student/security/two-factor">Manage two-factor <ArrowRight size={14} /></Link></div></section><section className="student-security-option"><span className="student-security-option__icon"><Laptop /></span><div><span className="student-status student-status--in-progress">3 active</span><h2>Sessions and devices</h2><p>Review browsers and devices signed in to your account.</p><Link className="student-text-link" to="/student/security/sessions">Review sessions <ArrowRight size={14} /></Link></div></section><section className="student-security-option"><span className="student-security-option__icon"><Mail /></span><div><span className="student-status student-status--completed">Verified</span><h2>Recovery email</h2><p>layla.hassan@example.com</p><button className="student-text-link">Change recovery email <ArrowRight size={14} /></button></div></section></div></div>
    <section className="student-login-glance"><div><div className="student-panel__head"><div><p className="student-eyebrow">Recent access</p><h2>Latest sign-in</h2></div><Link className="student-text-link" to="/student/security/sessions">View all</Link></div><div className="student-login-device"><span><Laptop /></span><div><strong>Chrome on Windows</strong><small>Beirut, Lebanon · Current session</small></div><time>Today, 10:42</time></div></div><div className="student-security-help"><CircleHelp /><div><strong>Think someone accessed your account?</strong><p>Change your password, revoke unfamiliar sessions, then contact support.</p></div><Link to="/student/support">Get help</Link></div></section>
  </>;
}

function TwoFactorPage({ page }: StudentPageProps) {
  const [enabled, setEnabled] = useStudentLocalState("two-factor-enabled", false);
  const [step, setStep] = useState(enabled ? 3 : 1);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const verify = () => { if (code !== "482193") { setError("That code is not valid. For this local demo, enter 482193."); return; } setEnabled(true); setStep(3); setError(""); setToast({ title: "Two-factor authentication enabled", detail: "Save your recovery codes somewhere secure." }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><Link className="student-back-link" to="/student/security"><ArrowLeft size={16} /> Security and devices</Link><PageHeading page={page} />
    <div className="student-setup-layout"><aside className="student-setup-steps">{[[1,"Get an app","Install an authenticator"],[2,"Scan and verify","Connect your account"],[3,"Recovery codes","Secure a backup"]].map(([number,title,detail]) => <button key={number} className={`${step === number ? "is-active" : ""} ${step > Number(number) || enabled ? "is-complete" : ""}`} onClick={() => (Number(number) <= step || enabled) && setStep(Number(number))}><span>{step > Number(number) || enabled ? <Check /> : number}</span><div><strong>{title}</strong><small>{detail}</small></div></button>)}</aside><section className="student-setup-card">{step === 1 && <div className="student-setup-pane"><span className="student-setup-pane__icon"><Smartphone /></span><p className="student-eyebrow">Step 1 of 3</p><h2>Get an authenticator app</h2><p>Use any time-based authenticator you trust. It generates a new six-digit code every 30 seconds and works without mobile service.</p><div className="student-app-options"><span><i>A</i><div><strong>Google Authenticator</strong><small>iOS and Android</small></div></span><span><i>2F</i><div><strong>2FAS Auth</strong><small>iOS and Android</small></div></span><span><i>1P</i><div><strong>1Password</strong><small>Desktop and mobile</small></div></span></div><button className="student-button student-button--primary" onClick={() => setStep(2)}>I have an app <ArrowRight size={16} /></button></div>}{step === 2 && <div className="student-setup-pane"><p className="student-eyebrow">Step 2 of 3</p><h2>Scan this QR code</h2><p>Open your authenticator app, add a new account, then scan the code.</p><div className="student-qr-wrap"><div className="student-qr" aria-label="Demo QR code"><span /></div><div><strong>Can’t scan it?</strong><p>Enter this setup key manually:</p><button onClick={() => copyText("BIOP HL04 8219 LAYA")}><code>BIOP HL04 8219 LAYA</code><Copy size={15} /></button></div></div><label className="student-field"><span>Enter the six-digit code</span><input className="student-code-input" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g,""))} placeholder="000000" /></label>{error && <p className="student-form-error"><Info size={15} /> {error}</p>}<div className="student-button-row"><button className="student-button student-button--soft" onClick={() => setStep(1)}>Back</button><button className="student-button student-button--primary" onClick={verify} disabled={code.length !== 6}>Verify and enable</button></div></div>}{step === 3 && <div className="student-setup-pane"><span className="student-setup-pane__icon is-success"><ShieldCheck /></span><p className="student-eyebrow">Protected</p><h2>Save your recovery codes</h2><p>Each code can be used once if you lose access to your authenticator. Store them in a secure password manager.</p><div className="student-recovery-codes">{["BP7K-4R2M","DQ9L-X8NP","T5CV-2A6J","W3HZ-9M1Q","K8SF-6U4E","N2RB-7Y5T"].map((item) => <code key={item}>{item}</code>)}</div><div className="student-button-row"><button className="student-button student-button--soft" onClick={() => downloadTextFile("biophlo-recovery-codes.txt", "BIOPHLO recovery codes\nBP7K-4R2M\nDQ9L-X8NP\nT5CV-2A6J\nW3HZ-9M1Q\nK8SF-6U4E\nN2RB-7Y5T")}><Download size={16} /> Download codes</button><button className="student-button student-button--primary" onClick={() => setToast({ title: "Recovery codes acknowledged" })}>I saved these codes</button></div>{enabled && <button className="student-text-button student-text-button--danger" onClick={() => { setEnabled(false); setStep(1); }}>Disable two-factor authentication</button>}</div>}</section><aside className="student-setup-help"><ShieldCheck /><h3>Why use two-factor?</h3><p>A password can be guessed or reused. A rotating code adds another proof that it is really you.</p><span><Check /> Protects certificates</span><span><Check /> Protects billing details</span><span><Check /> Warns on new devices</span></aside></div>
  </>;
}

type SessionItem = { id: number; device: string; browser: string; location: string; activity: string; current: boolean; icon: "desktop" | "mobile" };
const defaultSessions: SessionItem[] = [
  { id: 1, device: "Windows desktop", browser: "Chrome 128", location: "Beirut, Lebanon", activity: "Active now", current: true, icon: "desktop" },
  { id: 2, device: "iPhone 16", browser: "Safari Mobile", location: "Beirut, Lebanon", activity: "Today, 08:14", current: false, icon: "mobile" },
  { id: 3, device: "MacBook Air", browser: "Safari 18", location: "Jounieh, Lebanon", activity: "8 Sep 2026", current: false, icon: "desktop" },
];

function SessionsPage({ page }: StudentPageProps) {
  const [sessions, setSessions] = useStudentLocalState<SessionItem[]>("sessions", defaultSessions);
  const [toast, setToast] = useState<Toast>(null);
  const revoke = (id: number) => { setSessions(sessions.filter((session) => session.id !== id)); setToast({ title: "Session signed out", detail: "That device will need your password to reconnect." }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><Link className="student-back-link" to="/student/security"><ArrowLeft size={16} /> Security and devices</Link><PageHeading page={page} action={<button className="student-button student-button--soft" onClick={() => setSessions(sessions.filter((session) => session.current))}><LogOutIcon /> Sign out other sessions</button>} />
    <section className="student-current-session"><span><Laptop /></span><div><span className="student-status student-status--completed">Current session</span><h2>Windows desktop · Chrome 128</h2><p>Beirut, Lebanon · IP 185.•••.74.19</p></div><div><i className="student-pulse-dot" /> Active now</div></section>
    <div className="student-section-head"><div><h2>Other active sessions</h2><p>Sessions stay active for up to 30 days.</p></div><span>{Math.max(0, sessions.length - 1)} devices</span></div><section className="student-session-list">{sessions.filter((session) => !session.current).map((session) => <article key={session.id}><span className="student-session-list__icon">{session.icon === "mobile" ? <Smartphone /> : <Laptop />}</span><div><strong>{session.device}</strong><span>{session.browser}</span></div><div><strong>{session.location}</strong><span><MapPin size={13} /> Approximate location</span></div><time>{session.activity}</time><button className="student-button student-button--soft" onClick={() => revoke(session.id)}>Sign out</button></article>)}{sessions.length === 1 && <EmptyState icon={<ShieldCheck size={29} />} title="No other active sessions" detail="Only this browser has access to your account." />}</section>
    <section className="student-panel student-login-history"><div className="student-panel__head"><div><p className="student-eyebrow">Last 30 days</p><h2>Login history</h2></div><button className="student-button student-button--soft"><Download size={15} /> Export</button></div>{[["Today, 10:42","Chrome on Windows","Beirut, Lebanon","Successful"],["Today, 08:14","Safari on iPhone","Beirut, Lebanon","Successful"],["10 Sep, 22:08","Chrome on Windows","Beirut, Lebanon","Successful"],["8 Sep, 14:17","Safari on MacBook","Jounieh, Lebanon","Successful"],["2 Sep, 03:11","Unknown browser","Amman, Jordan","Blocked"]].map((row) => <div className="student-login-history__row" key={row[0]}><span><i className={row[3] === "Blocked" ? "is-blocked" : ""} />{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span><b className={row[3] === "Blocked" ? "is-blocked" : ""}>{row[3]}</b></div>)}</section>
  </>;
}

function LogOutIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /></svg>; }

function SupportPage({ page }: StudentPageProps) {
  const [tickets, setTickets] = useStudentLocalState("support-tickets", supportTickets);
  const [modal, setModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Course content");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const submit = (event: FormEvent) => { event.preventDefault(); if (subject.trim().length < 8 || message.trim().length < 20) { setError("Add a clear subject and at least 20 characters of detail."); return; } const id = `BIO-${Math.floor(3000 + Math.random() * 6000)}`; setTickets([{ id, subject: subject.trim(), category, status: "Open", updated: "Just now", created: "12 Sep 2026", priority }, ...tickets]); setSubject(""); setMessage(""); setFile(""); setError(""); setModal(false); setToast({ title: `Request ${id} created`, detail: "Support usually responds within one business day." }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><PageHeading page={page} action={<button className="student-button student-button--primary" onClick={() => setModal(true)}><Plus size={16} /> New request</button>} />
    <section className="student-support-hero"><div><span className="student-support-hero__icon"><Headphones /></span><div><p className="student-eyebrow">Learner support</p><h2>How can we help?</h2><p>Search practical answers or send the team a request.</p></div></div><label className="student-search-input student-search-input--large"><Search size={20} /><input placeholder="Search help articles, payments, courses..." /></label><div className="student-support-quicklinks"><Link to="/faq"><BookOpen />Getting started<ChevronRight /></Link><Link to="/faq"><CreditCard />Payments &amp; plans<ChevronRight /></Link><Link to="/faq"><Video />Lesson playback<ChevronRight /></Link><Link to="/student/security"><ShieldCheck />Account security<ChevronRight /></Link></div></section>
    <div className="student-section-head"><div><h2>Your support requests</h2><p>Track replies and continue open conversations.</p></div><select aria-label="Support request filter"><option>All requests</option><option>Open</option><option>Resolved</option></select></div><section className="student-ticket-list"><div className="student-ticket-list__head"><span>Request</span><span>Category</span><span>Updated</span><span>Status</span><span /></div>{tickets.map((ticket) => <Link to="/student/support/BIO-2847" key={ticket.id}><span><strong>{ticket.subject}</strong><small>{ticket.id} · Created {ticket.created}</small></span><span>{ticket.category}<small>{ticket.priority} priority</small></span><time>{ticket.updated}</time><span><i className={`student-status student-status--${ticket.status.toLowerCase().replaceAll(" ", "-")}`}>{ticket.status}</i></span><ChevronRight /></Link>)}</section>
    <div className="student-support-footer"><div><Clock3 /><span><strong>Typical reply time</strong><small>Under one business day</small></span></div><div><Mail /><span><strong>Email support</strong><small>support@biophlo.com</small></span></div><div><Globe2 /><span><strong>Help center</strong><small>Available in English and Arabic</small></span></div></div>
    {modal && <div className="student-modal-layer" onMouseDown={(event) => event.currentTarget === event.target && setModal(false)}><form className="student-modal student-ticket-modal" onSubmit={submit}><div className="student-modal__head"><div><p className="student-eyebrow">Learner support</p><h2>Create a support request</h2></div><button type="button" className="student-icon-button" onClick={() => setModal(false)}><X /></button></div><div className="student-form-grid"><label className="student-field"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Course content</option><option>Technical</option><option>Billing</option><option>Account access</option><option>Certificate</option><option>Other</option></select></label><label className="student-field"><span>Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>Normal</option><option>High</option></select></label><label className="student-field student-field--wide"><span>Subject</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="A concise summary of the issue" /></label><label className="student-field student-field--wide"><span>What happened?</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Include the page or lesson, what you expected, and what happened instead..." rows={6} /></label><label className="student-file-field student-field--wide"><input type="file" onChange={(event) => setFile(event.target.files?.[0]?.name ?? "")} /><Upload /><span><strong>{file || "Attach a screenshot or file"}</strong><small>PNG, JPG, or PDF up to 10 MB</small></span></label></div>{error && <p className="student-form-error"><Info size={15} /> {error}</p>}<div className="student-modal__actions"><button type="button" className="student-button student-button--soft" onClick={() => setModal(false)}>Cancel</button><button className="student-button student-button--primary">Create request</button></div></form></div>}
  </>;
}

type TicketReply = { id: number; author: "support" | "student"; text: string; time: string };
const initialTicketReplies: TicketReply[] = [
  { id: 1, author: "student", text: "In lesson 2.3, the captions are about four seconds ahead of the audio from 06:20 onward. I tested Chrome and Safari and see the same issue.", time: "9 Sep · 16:44" },
  { id: 2, author: "support", text: "Thanks for the precise timestamp, Layla. We reproduced the issue and published a corrected caption track. Could you refresh the lesson and confirm it now stays in sync?", time: "Today · 09:32" },
];

function SupportDetailsPage({ page }: StudentPageProps) {
  const [replies, setReplies] = useStudentLocalState<TicketReply[]>("ticket-BIO-2847", initialTicketReplies);
  const [draft, setDraft] = useState("");
  const [resolved, setResolved] = useStudentLocalState("ticket-BIO-2847-resolved", false);
  const [toast, setToast] = useState<Toast>(null);
  const send = (event: FormEvent) => { event.preventDefault(); if (draft.trim().length < 3) return; setReplies([...replies, { id: Date.now(), author: "student", text: draft.trim(), time: "Just now" }]); setDraft(""); setToast({ title: "Reply sent", detail: "The support team has been notified." }); };
  return <><ToastNotice toast={toast} onClose={() => setToast(null)} /><Link className="student-back-link" to="/student/support"><ArrowLeft size={16} /> Support requests</Link><div className="student-ticket-title"><div><div><span className={`student-status student-status--${resolved ? "resolved" : "waiting-for-you"}`}>{resolved ? "Resolved" : "Waiting for you"}</span><span>Course content</span></div><h1>{page.title.replace("Support request details", "Captions out of sync in lesson 2.3")}</h1><p>Request BIO-2847 · Created 9 September 2026</p></div><button className="student-button student-button--soft" onClick={() => { setResolved(!resolved); setToast({ title: !resolved ? "Request marked resolved" : "Request reopened" }); }}>{resolved ? <RefreshCw size={16} /> : <CheckCircle2 size={16} />}{resolved ? "Reopen request" : "Mark resolved"}</button></div>
    <div className="student-ticket-detail-layout"><section className="student-ticket-thread"><div className="student-ticket-thread__notice"><Info /><span><strong>{resolved ? "This request is resolved." : "Support replied and is waiting for your confirmation."}</strong><small>{resolved ? "Reopen it if you still need help." : "Check the updated captions, then reply or mark this resolved."}</small></span></div>{replies.map((reply) => <article className={`student-ticket-message is-${reply.author}`} key={reply.id}><div className="student-ticket-message__avatar">{reply.author === "support" ? "BS" : "LH"}</div><div><header><strong>{reply.author === "support" ? "Nour · BIOPHLO Support" : "Layla Hassan"}</strong><time>{reply.time}</time></header><p>{reply.text}</p>{reply.id === 1 && <span className="student-message-attachment"><Image size={17} /><b>caption-timing.png</b><small>842 KB</small><Download size={15} /></span>}</div></article>)}<form className="student-ticket-reply" onSubmit={send}><label><span>Reply to support</span><textarea rows={5} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Tell us whether the update solved the issue..." /></label><div><button type="button" className="student-button student-button--soft"><Paperclip size={15} /> Attach file</button><span>Replies also arrive by email.</span><button className="student-button student-button--primary" disabled={!draft.trim()}><Send size={15} /> Send reply</button></div></form></section><aside className="student-ticket-sidebar"><section className="student-panel"><h3>Request details</h3><dl className="student-detail-list"><div><dt>Request ID</dt><dd>BIO-2847</dd></div><div><dt>Status</dt><dd>{resolved ? "Resolved" : "Waiting for you"}</dd></div><div><dt>Category</dt><dd>Course content</dd></div><div><dt>Priority</dt><dd>Normal</dd></div><div><dt>Assigned to</dt><dd>Nour K.</dd></div></dl></section><section className="student-panel"><h3>Related lesson</h3><div className="student-related-lesson"><img src="/assets/lesson-video.webp" alt="" /><div><strong>The plasma membrane</strong><span>Cell Structure and Function</span></div></div><Link className="student-button student-button--soft student-button--wide" to="/student/learn/cell-structure-and-function"><Play size={15} /> Open lesson</Link></section><section className="student-support-sla"><Clock3 /><div><strong>Next response</strong><span>Usually within one business day</span></div></section></aside></div>
  </>;
}

function StudentPageBody({ page }: StudentPageProps) {
  switch (page.id) {
    case "student-home": return <DashboardPage />;
    case "student-courses": return <CoursesPage page={page} />;
    case "student-course-details": return <CourseDetailsPage page={page} />;
    case "course-player": return <CoursePlayerPage />;
    case "course-modules": return <ModulesPage page={page} />;
    case "progress-results": return <ProgressPage page={page} />;
    case "attempts-scores": return <AttemptsPage page={page} />;
    case "achievements": return <AchievementsPage page={page} />;
    case "certificates": return <CertificatesPage page={page} />;
    case "certificate-details": return <CertificateDetailsPage page={page} />;
    case "announcements": return <AnnouncementsPage page={page} />;
    case "course-qa": return <QaPage page={page} />;
    case "messages": return <MessagesPage page={page} />;
    case "notifications": return <NotificationsPage page={page} />;
    case "orders-billing": return <BillingPage page={page} />;
    case "invoice-details": return <InvoicePage page={page} />;
    case "subscription": return <SubscriptionPage page={page} />;
    case "saved-resources": return <SavedResourcesPage page={page} />;
    case "student-profile": return <ProfilePage page={page} />;
    case "learning-preferences": return <PreferencesPage page={page} />;
    case "security-devices": return <SecurityPage page={page} />;
    case "two-factor-setup": return <TwoFactorPage page={page} />;
    case "active-sessions": return <SessionsPage page={page} />;
    case "support-requests": return <SupportPage page={page} />;
    case "support-request-details": return <SupportDetailsPage page={page} />;
    default: return <><PageHeading page={page} /><EmptyState icon={<BookOpen size={30} />} title="This learning page is ready" detail="Choose a destination from the student navigation." /></>;
  }
}

export function StudentPage({ page }: StudentPageProps) {
  return <StudentLayout page={page} fullBleed={page.id === "course-player"}><StudentPageBody page={page} /></StudentLayout>;
}
