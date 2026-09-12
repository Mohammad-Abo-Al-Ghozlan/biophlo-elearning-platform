import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Filter,
  Globe2,
  GraduationCap,
  Headphones,
  Heart,
  Leaf,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  MonitorPlay,
  Play,
  Plus,
  Quote,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { PublicShell } from "../../components/public/PublicShell";
import type { PageDefinition } from "../../types";
import "../../styles/public-pages.css";

type Feedback = { tone: "success" | "danger" | "info"; text: string } | null;

type Course = {
  id: string;
  title: string;
  subject: string;
  level: string;
  board: string;
  image: string;
  rating: number;
  reviews: number;
  lessons: number;
  hours: number;
  price: number;
  featured?: boolean;
};

const courses: Course[] = [
  { id: "cell", title: "Cell Structure and Function", subject: "Cell biology", level: "IGCSE", board: "Cambridge", image: "/assets/course-cell.webp", rating: 4.9, reviews: 426, lessons: 28, hours: 8.5, price: 59, featured: true },
  { id: "genetics", title: "Genetics and Inheritance", subject: "Genetics", level: "A Level", board: "Edexcel", image: "/assets/course-genetics.webp", rating: 4.9, reviews: 310, lessons: 34, hours: 11, price: 69, featured: true },
  { id: "plants", title: "Introduction to Plant Biology", subject: "Plant biology", level: "Foundation", board: "All curricula", image: "/assets/course-plant.webp", rating: 4.8, reviews: 320, lessons: 21, hours: 6, price: 39 },
  { id: "human", title: "Human Physiology: Systems in Sync", subject: "Human biology", level: "IGCSE", board: "Cambridge", image: "/assets/course-cell.webp", rating: 4.8, reviews: 184, lessons: 31, hours: 9, price: 59 },
  { id: "ecology", title: "Ecology and Our Living Planet", subject: "Ecology", level: "Middle school", board: "International", image: "/assets/course-plant.webp", rating: 4.7, reviews: 208, lessons: 18, hours: 5.5, price: 35 },
  { id: "molecular", title: "Molecular Biology Essentials", subject: "Molecular biology", level: "A Level", board: "AQA", image: "/assets/course-genetics.webp", rating: 4.9, reviews: 142, lessons: 38, hours: 13, price: 79 },
];

const FieldError = ({ children }: { children?: string }) => children ? <span className="field-error"><AlertCircle size={14} />{children}</span> : null;

function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <div className={`feedback feedback--${feedback.tone}`} role="status">
      {feedback.tone === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span>{feedback.text}</span>
    </div>
  );
}

function PageHero({ page, kicker, children, actions }: { page: PageDefinition; kicker?: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="page-hero__molecule" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="page-container page-hero__inner">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><ChevronRight size={14} /><span>{page.title}</span>
        </nav>
        {kicker && <span className="page-kicker">{kicker}</span>}
        <h1>{page.title}</h1>
        <p>{children ?? page.description}</p>
        {actions && <div className="page-hero__actions">{actions}</div>}
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return <span className="stars" aria-label={`${rating} out of 5 stars`}><Star size={15} fill="currentColor" />{rating.toFixed(1)}</span>;
}

function CourseCard({ course }: { course: Course }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="course-card">
      <div className="course-card__image">
        <img src={course.image} alt="" />
        <span className="level-badge">{course.level}</span>
        <button type="button" aria-label={saved ? `Remove ${course.title} from saved courses` : `Save ${course.title}`} className={`save-button${saved ? " is-saved" : ""}`} onClick={() => setSaved((value) => !value)}><Heart size={18} fill={saved ? "currentColor" : "none"} /></button>
      </div>
      <div className="course-card__body">
        <span className="course-card__subject">{course.subject} · {course.board}</span>
        <h2><a href="/courses/cell-structure-and-function">{course.title}</a></h2>
        <div className="course-card__meta"><Stars rating={course.rating} /><span>({course.reviews})</span><span><MonitorPlay size={15} /> {course.lessons} lessons</span></div>
        <div className="course-card__footer"><strong>${course.price}</strong><a href="/courses/cell-structure-and-function" aria-label={`View ${course.title}`}>View course <ArrowRight size={16} /></a></div>
      </div>
    </article>
  );
}

function CatalogPage({ page }: { page: PageDefinition }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase()) &&
      (subject === "All subjects" || course.subject === subject) &&
      (level === "All levels" || course.level === level),
    );
    return [...filtered].sort((a, b) => sort === "Price: low to high" ? a.price - b.price : sort === "Rating" ? b.rating - a.rating : Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [query, subject, level, sort]);

  return (
    <>
      <PageHero page={page} kicker="Find your next breakthrough">
        Explore focused, visual courses that turn difficult biology into ideas you can explain with confidence.
      </PageHero>
      <section className="catalog page-container section-space">
        <div className="catalog-toolbar">
          <label className="search-field"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by course or topic" /></label>
          <button type="button" className="button button--outline filter-toggle" onClick={() => setFiltersOpen((value) => !value)}><Filter size={17} /> Filters</button>
          <label className="select-field"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Rating</option><option>Price: low to high</option></select></label>
        </div>
        <div className="catalog-layout">
          <aside className={`filter-panel${filtersOpen ? " is-open" : ""}`}>
            <div className="filter-panel__heading"><div><span>Filters</span><small>{visible.length} courses</small></div><button type="button" onClick={() => { setSubject("All subjects"); setLevel("All levels"); setQuery(""); }}>Clear all</button></div>
            <fieldset><legend>Subject</legend>{["All subjects", "Cell biology", "Genetics", "Plant biology", "Human biology", "Ecology", "Molecular biology"].map((value) => <label className="radio-row" key={value}><input type="radio" name="subject" checked={subject === value} onChange={() => setSubject(value)} /><span>{value}</span></label>)}</fieldset>
            <fieldset><legend>Level</legend>{["All levels", "Foundation", "Middle school", "IGCSE", "A Level"].map((value) => <label className="radio-row" key={value}><input type="radio" name="level" checked={level === value} onChange={() => setLevel(value)} /><span>{value}</span></label>)}</fieldset>
            <div className="filter-note"><Sparkles size={18} /><p><strong>Not sure where to begin?</strong> Take our 2-minute level finder.</p></div>
          </aside>
          <div className="catalog-results">
            <div className="result-summary"><p><strong>{visible.length}</strong> courses found</p><span>Instant access · Learn at your pace</span></div>
            {visible.length ? <div className="course-grid">{visible.map((course) => <CourseCard course={course} key={course.id} />)}</div> : <div className="empty-state"><Search size={34} /><h2>No courses match those filters</h2><p>Try a broader subject or remove your search term.</p><button className="button button--teal" onClick={() => { setSubject("All subjects"); setLevel("All levels"); setQuery(""); }} type="button">Reset filters</button></div>}
          </div>
        </div>
      </section>
    </>
  );
}

const modules = [
  { title: "Cells as the units of life", detail: "5 lessons · 52 min", lessons: ["The cell theory", "Prokaryotic and eukaryotic cells", "Scale and microscopy"] },
  { title: "Organelles and their functions", detail: "7 lessons · 1 hr 18 min", lessons: ["The nucleus and genetic control", "Mitochondria and energy", "Membranes and transport"] },
  { title: "Specialised cells", detail: "6 lessons · 58 min", lessons: ["Structure meets function", "Plant cell specialisation", "Exam-style application"] },
  { title: "Cell division and growth", detail: "8 lessons · 1 hr 42 min", lessons: ["The cell cycle", "Mitosis step by step", "Cancer and uncontrolled division"] },
];

function CourseDetailPage({ page }: { page: PageDefinition }) {
  const [tab, setTab] = useState("Overview");
  const [openModule, setOpenModule] = useState(0);
  const [license, setLicense] = useState<"single" | "family">("single");
  const [added, setAdded] = useState(false);
  const [preview, setPreview] = useState(false);

  return (
    <>
      <section className="course-detail-hero" aria-label={page.title}>
        <div className="page-container course-detail-hero__grid">
          <div>
            <nav className="breadcrumbs breadcrumbs--light" aria-label="Breadcrumb"><a href="/courses">Courses</a><ChevronRight size={14} /><span>Cell biology</span></nav>
            <span className="detail-badge">Bestseller · Updated August 2026</span>
            <h1>Cell Structure and Function</h1>
            <p>See cells as living systems—not lists of labels. Build a clear mental model through animation, guided diagrams, and exam-ready practice.</p>
            <div className="course-detail-hero__rating"><Stars rating={4.9} /><span>426 learner reviews</span><span><Users size={17} /> 3,842 learners</span></div>
            <div className="instructor-chip"><img src="/assets/instructor.webp" alt="Dr. Sarah Ahmed" /><span>Created and taught by <a href="/instructor">Dr. Sarah Ahmed</a></span></div>
          </div>
          <button className="course-preview" type="button" onClick={() => setPreview(true)} aria-label="Play course preview">
            <img src="/assets/lesson-video.webp" alt="A biology lesson preview" /><span className="course-preview__play"><Play fill="currentColor" /> Preview this course</span>
          </button>
        </div>
      </section>
      <div className="page-container detail-layout section-space">
        <div className="detail-content">
          <div className="outcome-panel">
            <h2>What you’ll be able to do</h2>
            <div className="outcome-grid">
              {["Compare prokaryotic and eukaryotic cells", "Explain how organelle structure supports function", "Interpret microscope images and calculate scale", "Apply cell biology concepts to unfamiliar exam questions"].map((item) => <span key={item}><CheckCircle2 size={18} />{item}</span>)}
            </div>
          </div>
          <div className="tab-list" role="tablist" aria-label="Course information">
            {["Overview", "Curriculum", "Reviews"].map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)} type="button" key={item}>{item}</button>)}
          </div>
          {tab === "Overview" && <div className="prose-block"><h2>Understand the cell from the inside out</h2><p>This course replaces memorisation with a connected understanding of why cells look and behave as they do. Each lesson moves from a familiar observation to a biological model, then gives you a focused chance to use it.</p><p>Animated explanations and hand-drawn diagrams make invisible processes concrete. Knowledge checks show exactly where your reasoning is strong and where a concept needs another look.</p><h3>Designed for meaningful progress</h3><ul><li>Short, focused video explanations with searchable transcripts</li><li>Downloadable diagram packs and guided notes</li><li>Auto-marked checks after every concept</li><li>Four exam-style assessments with worked solutions</li><li>A verified completion certificate</li></ul></div>}
          {tab === "Curriculum" && <div className="curriculum"><div className="curriculum__summary"><h2>4 modules · 28 lessons</h2><span>8.5 hours total</span></div>{modules.map((module, index) => <div className="module" key={module.title}><button type="button" onClick={() => setOpenModule(openModule === index ? -1 : index)} aria-expanded={openModule === index}><span><small>Module {index + 1}</small><strong>{module.title}</strong></span><span>{module.detail}<ChevronDown size={18} /></span></button>{openModule === index && <div className="module__lessons">{module.lessons.map((lesson, lessonIndex) => <span key={lesson}><Play size={15} />{lesson}<small>{11 + lessonIndex * 3} min</small></span>)}</div>}</div>)}</div>}
          {tab === "Reviews" && <div className="reviews"><div className="rating-summary"><strong>4.9</strong><Stars rating={4.9} /><span>426 verified reviews</span></div>{[["Lina K.", "The diagrams finally made membrane transport click. I moved from guessing to explaining my answers."], ["Omar H.", "Clear pacing, excellent questions, and every lesson feels intentional. This became my revision backbone."], ["Nour A.", "Dr. Sarah explains the ‘why’ behind each structure. That changed how I approach application questions."]].map(([name, text]) => <blockquote key={name}><Quote size={20} /><p>{text}</p><footer><strong>{name}</strong><span>Verified learner</span><Stars rating={5} /></footer></blockquote>)}</div>}
        </div>
        <aside className="purchase-card">
          <span className="purchase-card__label">Complete course access</span>
          <div className="purchase-card__price"><strong>${license === "single" ? "59" : "89"}</strong><span>one-time payment</span></div>
          <div className="license-choice"><button type="button" className={license === "single" ? "is-active" : ""} onClick={() => setLicense("single")}><strong>One learner</strong><span>Personal access</span></button><button type="button" className={license === "family" ? "is-active" : ""} onClick={() => setLicense("family")}><strong>Family</strong><span>Up to 3 learners</span></button></div>
          <button className="button button--orange button--wide" onClick={() => setAdded(true)} type="button">{added ? <><Check size={18} /> Added to cart</> : <><ShoppingBag size={18} /> Add to cart</>}</button>
          {added && <a className="button button--teal button--wide" href="/cart">View cart</a>}
          <p className="purchase-card__guarantee"><ShieldCheck size={17} /> 14-day learning guarantee</p>
          <hr />
          <h3>This course includes</h3>
          <ul><li><Video size={17} /> 8.5 hours of video</li><li><FileText size={17} /> 24 downloadable resources</li><li><BarChart3 size={17} /> Practice and final assessments</li><li><Award size={17} /> Completion certificate</li><li><Globe2 size={17} /> Lifetime access on any device</li></ul>
          <a className="gift-link" href="/contact">Buying for a school? Talk to us <ArrowRight size={15} /></a>
        </aside>
      </div>
      {preview && <div className="media-modal" role="dialog" aria-modal="true" aria-label="Course preview" onMouseDown={(event) => event.target === event.currentTarget && setPreview(false)}><div className="media-modal__panel"><button type="button" aria-label="Close preview" onClick={() => setPreview(false)}><X /></button><div className="video-placeholder"><img src="/assets/lesson-video.webp" alt="Cell structure video lesson" /><span><Play fill="currentColor" /></span></div><h2>A clearer way to see the cell</h2><p>Preview lesson · 2:14</p></div></div>}
    </>
  );
}

const taxonomyData = {
  subjects: {
    intro: "Start with the part of biology that sparks your curiosity. Each pathway connects concepts, courses, and free resources.",
    labels: [
      ["Cell biology", "Build from membranes and organelles to division and signalling.", "12 courses", "cell"],
      ["Genetics", "Trace information from DNA to inheritance and variation.", "9 courses", "dna"],
      ["Human biology", "Understand how body systems coordinate and respond.", "11 courses", "human"],
      ["Plant biology", "Explore transport, photosynthesis, growth, and response.", "7 courses", "plant"],
      ["Ecology", "Connect organisms, environments, cycles, and change.", "8 courses", "eco"],
      ["Molecular biology", "Look closely at the chemistry that makes life possible.", "6 courses", "molecular"],
    ],
  },
  curricula: {
    intro: "Study to the language, depth, and assessment style of your curriculum—without losing sight of the bigger biological picture.",
    labels: [
      ["Cambridge International", "IGCSE 0610 and AS & A Level 9700 mapped by syllabus point.", "53 mapped topics", "cambridge"],
      ["Pearson Edexcel", "International GCSE and A Level lessons with specification links.", "48 mapped topics", "edexcel"],
      ["AQA", "GCSE and A Level Biology organised by required knowledge and skills.", "46 mapped topics", "aqa"],
      ["OCR", "Gateway, Twenty First Century, and A Level biology support.", "41 mapped topics", "ocr"],
      ["IB Biology", "SL and HL pathways aligned to the current subject guide.", "39 mapped topics", "ib"],
      ["Independent learning", "A flexible concept-first pathway for curious learners.", "6 learning tracks", "independent"],
    ],
  },
  grades: {
    intro: "Choose the depth that meets you where you are. Every level builds durable understanding for the next one.",
    labels: [
      ["Foundation · Ages 10–12", "A visual introduction to cells, organisms, and ecosystems.", "Begin here", "foundation"],
      ["Lower secondary · Ages 12–14", "Connect core ideas and begin scientific reasoning.", "18 courses", "lower"],
      ["IGCSE / GCSE", "Syllabus-aligned understanding and confident exam application.", "24 courses", "igcse"],
      ["AS Level", "Bridge school biology and deeper analytical thinking.", "13 courses", "as"],
      ["A Level", "Master mechanisms, data analysis, and extended response.", "16 courses", "alevel"],
      ["Beyond the syllabus", "Topic deep-dives for aspiring bioscientists.", "9 explorations", "beyond"],
    ],
  },
} as const;

function TaxonomyPage({ page }: { page: PageDefinition }) {
  const data = taxonomyData[page.id as keyof typeof taxonomyData] ?? taxonomyData.subjects;
  const [selected, setSelected] = useState(0);
  return (
    <>
      <PageHero page={page} kicker="Choose your learning pathway">{data.intro}</PageHero>
      <section className="page-container taxonomy section-space">
        <div className="taxonomy__intro"><div><span className="section-mark">Explore the map</span><h2>{page.id === "grades" ? "Built for each stage of learning" : page.id === "curricula" ? "Aligned without becoming narrow" : "The living world, connected"}</h2></div><p>Choose a pathway to see its focus and available learning. You can switch paths at any time; concepts remain connected across BIOPHLO.</p></div>
        <div className="taxonomy-grid">
          {data.labels.map(([title, description, meta, key], index) => (
            <article className={`taxonomy-card taxonomy-card--${key}${selected === index ? " is-selected" : ""}`} key={title}>
              <button type="button" onClick={() => setSelected(index)} aria-pressed={selected === index}>
                <span className="taxonomy-card__icon">{page.id === "curricula" ? <BookMarked /> : page.id === "grades" ? <GraduationCap /> : index % 2 ? <Sparkles /> : <Leaf />}</span>
                <span><small>{meta}</small><strong>{title}</strong><p>{description}</p></span>
                <ChevronRight />
              </button>
            </article>
          ))}
        </div>
        <div className="taxonomy-feature">
          <div><span>Your selected pathway</span><h2>{data.labels[selected][0]}</h2><p>{data.labels[selected][1]} Start with a carefully sequenced course or browse an individual topic.</p><div className="button-row"><a className="button button--orange" href="/courses">Browse matching courses <ArrowRight size={17} /></a><a className="button button--outline" href="/resources">View free resources</a></div></div>
          <div className="taxonomy-feature__diagram" aria-hidden="true"><i>Observe</i><i>Connect</i><i>Explain</i><i>Apply</i><span /></div>
        </div>
        <div className="guidance-band"><CircleHelp size={30} /><div><h2>Need help choosing?</h2><p>Tell us what you’re studying and what you want to improve. We’ll point you to the right starting place.</p></div><a className="button button--teal" href="/contact">Ask a learning adviser</a></div>
      </section>
    </>
  );
}

function AboutPage({ page }: { page: PageDefinition }) {
  return (
    <>
      <PageHero page={page} kicker="Our reason for learning">Biology is full of astonishing ideas. We built BIOPHLO so those ideas feel connected, visible, and genuinely understandable.</PageHero>
      <section className="about-story page-container section-space">
        <div className="about-story__image"><img src="/assets/instructor.webp" alt="Dr. Sarah Ahmed working at a microscope" /><span><strong>10,000+</strong> learners growing with us</span></div>
        <div className="about-story__copy"><span className="section-mark">The BIOPHLO story</span><h2>Learning should create a mental model, not a pile of facts.</h2><p>BIOPHLO began with one recurring moment in the classroom: a learner could recite every organelle, but could not explain how a cell stays alive. The problem was not effort. It was fragmented teaching.</p><p>Dr. Sarah Ahmed started drawing biology as connected systems—showing how shape, location, and process answer a biological need. Those sketches became lessons, the lessons became a community, and BIOPHLO became a complete learning environment.</p><a className="text-link" href="/instructor">Meet Dr. Sarah Ahmed <ArrowRight size={17} /></a></div>
      </section>
      <section className="beliefs-section"><div className="page-container"><div className="center-heading"><span className="section-mark">How we teach</span><h2>Three promises behind every lesson</h2></div><div className="belief-grid">{[
        ["Make the invisible visible", "Diagrams, motion, and analogy reveal the structures and processes learners cannot see.", Eye],
        ["Connect before you test", "Every new idea joins a larger biological model before assessment begins.", Zap],
        ["Practise thinking, not guessing", "Feedback explains the reasoning so each answer improves the next one.", BarChart3],
      ].map(([title, text, Icon]) => <article key={String(title)}><span><Icon /></span><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div></div></section>
      <section className="impact page-container section-space"><div><span className="section-mark">Measured in understanding</span><h2>Built in the classroom. Improved with learners.</h2></div><div className="impact-stats"><div><strong>52</strong><span>focused courses</span></div><div><strong>4.8/5</strong><span>average rating</span></div><div><strong>30+</strong><span>countries reached</span></div><div><strong>91%</strong><span>complete a started course</span></div></div></section>
      <section className="about-cta page-container"><img src="/assets/cta-biology.webp" alt="Biology illustration with a leaf and DNA" /><div><h2>Curiosity is where learning starts.</h2><p>Find the topic that makes you want to look closer.</p><a href="/courses" className="button button--orange">Explore courses <ArrowRight size={17} /></a></div></section>
    </>
  );
}

function InstructorPage({ page }: { page: PageDefinition }) {
  const [bioExpanded, setBioExpanded] = useState(false);
  return (
    <>
      <PageHero page={page} kicker="Educator · Researcher · Lifelong learner">Meet the person behind the diagrams, questions, and “now I get it” moments.</PageHero>
      <section className="instructor-profile page-container section-space">
        <div className="instructor-profile__portrait"><img src="/assets/instructor.webp" alt="Dr. Sarah Ahmed in her biology laboratory" /><div><span>“Knowledge grows when we connect it.”</span></div></div>
        <div className="instructor-profile__bio"><span className="section-mark">Your instructor</span><h2>Hi, I’m Dr. Sarah Ahmed.</h2><p className="lead">I’m a molecular biology educator who believes scientific confidence begins when learners can explain an idea in their own words.</p><p>For more than a decade, I have taught learners across secondary, international, and pre-university programmes. My research training shaped how I ask questions; the classroom taught me how differently people build understanding.</p>{bioExpanded && <><p>I created BIOPHLO to bring the clarity of an excellent one-to-one explanation to every learner. I write and review each core lesson, working with curriculum specialists and accessibility reviewers to keep the learning rigorous, current, and inclusive.</p><p>Outside the studio, you’ll usually find me sketching a new diagram, tending an unruly collection of plants, or helping early-career science teachers turn difficult topics into teachable stories.</p></>}<button className="text-link" type="button" onClick={() => setBioExpanded((value) => !value)}>{bioExpanded ? "Show less" : "Read Sarah’s full story"} <ChevronDown size={17} /></button>
          <div className="credential-list"><span><GraduationCap /><strong>PhD, Molecular Biology</strong><small>University College London</small></span><span><BookOpen /><strong>12+ years teaching</strong><small>IGCSE, IB and A Level</small></span><span><Users /><strong>10,000+ learners</strong><small>Across 30+ countries</small></span></div>
        </div>
      </section>
      <section className="teaching-method"><div className="page-container"><div className="center-heading"><span className="section-mark">Sarah’s teaching method</span><h2>From observation to confident explanation</h2></div><div className="method-track">{[["01", "Notice", "Begin with something real, visual, or surprising."], ["02", "Model", "Build a simple explanation, then add precision."], ["03", "Challenge", "Test the model with a new example or question."], ["04", "Express", "Explain it clearly in your own language."]].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="page-container instructor-courses section-space"><div className="section-heading-row"><div><span className="section-mark">Learn with Sarah</span><h2>Popular courses</h2></div><a className="text-link" href="/courses">View all courses <ArrowRight size={17} /></a></div><div className="course-grid course-grid--three">{courses.slice(0, 3).map((course) => <CourseCard course={course} key={course.id} />)}</div></section>
    </>
  );
}

const plans = [
  { name: "Explorer", monthly: 0, annual: 0, description: "Build a study habit with selected lessons and resources.", features: ["12 starter lessons", "Free resource library", "Progress snapshots", "Community Q&A"], cta: "Start free" },
  { name: "Complete", monthly: 19, annual: 190, description: "Unlimited learning for one ambitious biology student.", features: ["Every course and new release", "Past-paper walkthroughs", "Assessments and certificates", "Downloadable study packs", "Priority question support"], cta: "Choose Complete", featured: true },
  { name: "Family", monthly: 29, annual: 290, description: "Individual learning spaces for up to three learners.", features: ["Everything in Complete", "3 separate learner profiles", "Shared billing and renewals", "Family progress overview", "Priority support"], cta: "Choose Family" },
];

function PricingPage({ page }: { page: PageDefinition }) {
  const [annual, setAnnual] = useState(true);
  const [selected, setSelected] = useState("Complete");
  return (
    <>
      <PageHero page={page} kicker="Simple, transparent access" actions={<div className="billing-toggle" role="group" aria-label="Billing period"><button type="button" className={!annual ? "is-active" : ""} onClick={() => setAnnual(false)}>Monthly</button><button type="button" className={annual ? "is-active" : ""} onClick={() => setAnnual(true)}>Yearly <span>Save 17%</span></button></div>}>Learn deeply without surprise fees. Start free, subscribe for the full library, or purchase individual courses forever.</PageHero>
      <section className="page-container pricing-section section-space">
        <div className="pricing-grid">{plans.map((plan) => <article className={`pricing-card${plan.featured ? " pricing-card--featured" : ""}${selected === plan.name ? " is-selected" : ""}`} key={plan.name}>{plan.featured && <span className="pricing-card__flag">Most chosen</span>}<h2>{plan.name}</h2><p>{plan.description}</p><div className="plan-price"><strong>${annual ? Math.round(plan.annual / 12) : plan.monthly}</strong><span>/ month</span></div>{annual && plan.annual > 0 && <small>Billed ${plan.annual} once a year</small>}{plan.annual === 0 && <small>No card required</small>}<button className={`button button--wide ${plan.featured ? "button--orange" : "button--outline"}`} type="button" onClick={() => setSelected(plan.name)}>{selected === plan.name ? <><Check size={17} /> Selected</> : plan.cta}</button><ul>{plan.features.map((feature) => <li key={feature}><CheckCircle2 size={17} />{feature}</li>)}</ul></article>)}</div>
        <div className="pricing-note"><ShieldCheck /><span><strong>Learn with confidence.</strong> Cancel subscriptions any time. Your progress remains saved, and individual course purchases never expire.</span><a href="/legal/refunds">Read our refund policy</a></div>
      </section>
      <section className="comparison-section"><div className="page-container"><div className="center-heading"><span className="section-mark">Compare access</span><h2>Choose based on how you learn</h2></div><div className="comparison-table" role="table" aria-label="Plan comparison"><div className="comparison-row comparison-row--head" role="row"><span>Included</span><strong>Explorer</strong><strong>Complete</strong><strong>Family</strong></div>{[["Full course library", false, true, true], ["Downloadable resources", "Limited", true, true], ["Certificates", false, true, true], ["Learner profiles", "1", "1", "3"], ["Priority support", false, true, true]].map(([label, ...values]) => <div className="comparison-row" role="row" key={String(label)}><span>{String(label)}</span>{values.map((value, index) => <span key={index}>{typeof value === "boolean" ? value ? <CheckCircle2 aria-label="Included" /> : <Minus aria-label="Not included" /> : String(value)}</span>)}</div>)}</div></div></section>
      <section className="page-container school-callout"><div><span className="section-mark">Schools and cohorts</span><h2>Planning access for a class or department?</h2><p>Get central enrolment, educator reporting, curriculum mapping, and volume pricing shaped around your learners.</p></div><a className="button button--teal" href="/contact">Talk to our education team</a></section>
    </>
  );
}

const resources = [
  { title: "Cell Division: Visual Study Guide", type: "Study guide", level: "IGCSE", topic: "Cell biology", pages: "18 pages", image: "/assets/course-cell.webp" },
  { title: "Genetic Crosses Practice Pack", type: "Worksheet", level: "A Level", topic: "Genetics", pages: "24 questions", image: "/assets/course-genetics.webp" },
  { title: "Photosynthesis Diagram Set", type: "Diagram pack", level: "IGCSE", topic: "Plant biology", pages: "9 diagrams", image: "/assets/course-plant.webp" },
  { title: "Human Organ Systems Revision Map", type: "Revision notes", level: "Middle school", topic: "Human biology", pages: "12 pages", image: "/assets/course-cell.webp" },
  { title: "Ecology Fieldwork Checklist", type: "Checklist", level: "IGCSE", topic: "Ecology", pages: "6 pages", image: "/assets/course-plant.webp" },
  { title: "DNA Replication Guided Notes", type: "Guided notes", level: "A Level", topic: "Genetics", pages: "14 pages", image: "/assets/course-genetics.webp" },
];

const videos = [
  { title: "Cellular Respiration, Clearly Explained", topic: "Cell biology", level: "IGCSE", duration: "12:42", image: "/assets/lesson-video.webp", views: "18.4K" },
  { title: "DNA Replication: From Unzipping to Proofreading", topic: "Genetics", level: "A Level", duration: "16:08", image: "/assets/course-genetics.webp", views: "12.9K" },
  { title: "Why Leaves Look Green", topic: "Plant biology", level: "Foundation", duration: "07:35", image: "/assets/course-plant.webp", views: "21.2K" },
  { title: "Enzymes and Activation Energy", topic: "Molecular biology", level: "IGCSE", duration: "11:20", image: "/assets/course-cell.webp", views: "15.1K" },
  { title: "Building a Food Web", topic: "Ecology", level: "Middle school", duration: "09:48", image: "/assets/course-plant.webp", views: "8.7K" },
  { title: "The Heart as a Double Pump", topic: "Human biology", level: "IGCSE", duration: "14:03", image: "/assets/lesson-video.webp", views: "17.8K" },
];

function ResourceListingPage({ page }: { page: PageDefinition }) {
  const isVideos = page.id === "videos";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const list = isVideos ? videos : resources;
  const filters = isVideos ? ["All", "Cell biology", "Genetics", "Plant biology", "Human biology", "Ecology"] : ["All", "Study guide", "Worksheet", "Diagram pack", "Revision notes", "Checklist", "Guided notes"];
  const visible = list.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || ("type" in item ? item.type === filter : item.topic === filter)));
  const toggleSaved = (title: string) => {
    setSaved((values) => values.includes(title) ? values.filter((value) => value !== title) : [...values, title]);
    setFeedback({ tone: "success", text: saved.includes(title) ? "Removed from your saved library." : "Saved to your personal library." });
  };
  return (
    <>
      <PageHero page={page} kicker={isVideos ? "Watch one idea at a time" : "Learn beyond the lesson"} actions={<a className="button button--orange" href={isVideos ? "/courses" : "/auth/sign-up"}>{isVideos ? "Explore full courses" : "Create a free account"} <ArrowRight size={17} /></a>} />
      <section className="page-container library section-space">
        <div className="library-toolbar"><label className="search-field"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${isVideos ? "videos" : "resources"}`} /></label><div className="chip-list" aria-label="Filter results">{filters.map((item) => <button className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)} type="button" key={item}>{item}</button>)}</div></div>
        <FeedbackBanner feedback={feedback} />
        <div className={`resource-grid${isVideos ? " resource-grid--videos" : ""}`}>
          {visible.map((item) => {
            const href = isVideos ? "/videos/cellular-respiration" : "/resources/cell-division-study-guide";
            return <article className="resource-card" key={item.title}><a className="resource-card__image" href={href}><img src={item.image} alt="" />{isVideos ? <><span className="video-play"><Play fill="currentColor" /></span><small>{"duration" in item ? item.duration : ""}</small></> : <span className="resource-type"><FileText size={15} />{"type" in item ? item.type : "Video"}</span>}</a><div className="resource-card__body"><span>{item.topic} · {item.level}</span><h2><a href={href}>{item.title}</a></h2><div>{isVideos ? <small><Eye size={14} />{"views" in item ? item.views : "0"} views</small> : <small><FileText size={14} />{"pages" in item ? item.pages : ""}</small>}<button type="button" className={saved.includes(item.title) ? "is-saved" : ""} onClick={() => toggleSaved(item.title)}><Heart size={17} fill={saved.includes(item.title) ? "currentColor" : "none"} />{saved.includes(item.title) ? "Saved" : "Save"}</button></div></div></article>;
          })}
        </div>
        {!visible.length && <div className="empty-state"><Search size={34} /><h2>Nothing matched that search</h2><p>Try a different phrase or select “All”.</p><button className="button button--teal" type="button" onClick={() => { setQuery(""); setFilter("All"); }}>Show everything</button></div>}
        <div className="library-signup"><div><BookMarked /><span><strong>Build your own revision library</strong><p>Save resources, track watched videos, and pick up where you left off.</p></span></div><a className="button button--outline" href="/auth/sign-up">Create free account</a></div>
      </section>
    </>
  );
}

const papers = [
  { board: "Cambridge", syllabus: "IGCSE Biology 0610", session: "May / June 2025", paper: "Paper 42 · Extended", level: "IGCSE", marks: 80 },
  { board: "Cambridge", syllabus: "IGCSE Biology 0610", session: "Oct / Nov 2024", paper: "Paper 41 · Extended", level: "IGCSE", marks: 80 },
  { board: "Pearson Edexcel", syllabus: "International GCSE Biology", session: "June 2025", paper: "Paper 1BR", level: "IGCSE", marks: 110 },
  { board: "AQA", syllabus: "A Level Biology 7402", session: "June 2025", paper: "Paper 1", level: "A Level", marks: 91 },
  { board: "Cambridge", syllabus: "AS & A Level Biology 9700", session: "May / June 2025", paper: "Paper 22 · AS Structured", level: "AS Level", marks: 60 },
  { board: "OCR", syllabus: "A Level Biology A H420", session: "June 2024", paper: "Biological processes", level: "A Level", marks: 100 },
];

function PastPapersPage({ page }: { page: PageDefinition }) {
  const [board, setBoard] = useState("All boards");
  const [level, setLevel] = useState("All levels");
  const [query, setQuery] = useState("");
  const [downloaded, setDownloaded] = useState("");
  const visible = papers.filter((paper) => (board === "All boards" || paper.board === board) && (level === "All levels" || paper.level === level) && `${paper.syllabus} ${paper.paper}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHero page={page} kicker="Practise with purpose">Find original-format papers, mark schemes, and a clear route from every mistake to the concept behind it.</PageHero>
      <section className="page-container papers section-space">
        <div className="paper-filters"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search syllabus or paper" /></label><label><span>Exam board</span><select value={board} onChange={(event) => setBoard(event.target.value)}><option>All boards</option><option>Cambridge</option><option>Pearson Edexcel</option><option>AQA</option><option>OCR</option></select></label><label><span>Level</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>All levels</option><option>IGCSE</option><option>AS Level</option><option>A Level</option></select></label></div>
        {downloaded && <FeedbackBanner feedback={{ tone: "success", text: `${downloaded} is ready in your local downloads queue.` }} />}
        <div className="paper-table"><div className="paper-table__head"><span>Paper</span><span>Session</span><span>Marks</span><span>Files</span></div>{visible.map((paper) => <article key={`${paper.syllabus}${paper.paper}${paper.session}`}><div><span className="board-tag">{paper.board}</span><h2>{paper.syllabus}</h2><p>{paper.paper} · {paper.level}</p></div><span>{paper.session}</span><span>{paper.marks}</span><div className="paper-actions"><button type="button" onClick={() => setDownloaded("Question paper")}><FileText size={16} /> Question</button><button type="button" onClick={() => setDownloaded("Mark scheme")}><FileCheck2 size={16} /> Mark scheme</button></div></article>)}</div>
        {!visible.length && <div className="empty-state"><FileText size={34} /><h2>No papers found</h2><p>Adjust the exam board, level, or search text.</p></div>}
        <div className="exam-help"><div><span className="exam-help__icon"><BookOpen /></span><div><h2>Don’t just mark it—learn from it.</h2><p>Use our worked-exam courses to turn missed marks into a focused revision plan.</p></div></div><a className="button button--orange" href="/courses">View exam preparation</a></div>
      </section>
    </>
  );
}

function ResourceDetailPage({ page }: { page: PageDefinition }) {
  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  return (
    <>
      <section className="resource-detail-hero" aria-label={page.title}><div className="page-container resource-detail-hero__grid"><div><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/resources">Resources</a><ChevronRight size={14} /><span>Study guides</span></nav><span className="detail-badge">Free study guide · IGCSE</span><h1>Cell Division: Visual Study Guide</h1><p>A diagram-led guide to the cell cycle, mitosis, growth, and the mistakes that cost marks in exam questions.</p><div className="resource-detail-hero__meta"><span><FileText /> 18 illustrated pages</span><span><Clock3 /> 25-minute review</span><span><Download /> PDF · 8.4 MB</span></div><div className="button-row"><button className="button button--orange" type="button" onClick={() => setDownloaded(true)}><Download size={18} /> Download free guide</button><button className="button button--outline" type="button" onClick={() => setSaved((value) => !value)}><Heart size={18} fill={saved ? "currentColor" : "none"} />{saved ? "Saved" : "Save for later"}</button></div>{downloaded && <FeedbackBanner feedback={{ tone: "success", text: "Your guide has been prepared for download." }} />}</div><div className="guide-preview"><div className="guide-preview__page"><span>BIOPHLO visual study guide</span><h2>Cell division</h2><img src="/assets/course-cell.webp" alt="Microscopic cell structures" /><p>The cell cycle is a controlled sequence—not just mitosis.</p><small>01 / 18</small></div><div className="guide-preview__page guide-preview__page--back" /></div></div></section>
      <section className="page-container guide-body section-space"><article><h2>What’s inside</h2><p>This guide connects each visible stage of mitosis to the events happening inside the cell. It is designed for a fast first pass and useful repeat revision.</p><div className="guide-contents">{[["01", "Cell-cycle overview", "See interphase, mitosis, and cytokinesis as one controlled loop."], ["02", "Mitosis stage by stage", "Use chromosome position—not memorised drawings—to identify stages."], ["03", "Growth and repair", "Connect cell division to tissue growth, replacement, and healing."], ["04", "Exam application", "Work through four common question patterns with annotated answers."]].map(([number, title, text]) => <div key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></article><aside><h3>Resource details</h3><dl><div><dt>Author</dt><dd>Dr. Sarah Ahmed</dd></div><div><dt>Last reviewed</dt><dd>22 August 2026</dd></div><div><dt>Level</dt><dd>IGCSE / GCSE</dd></div><div><dt>Curricula</dt><dd>Cambridge, Edexcel, AQA</dd></div><div><dt>Licence</dt><dd>Personal learning use</dd></div></dl><hr /><h3>Pair it with</h3><a className="paired-course" href="/courses/cell-structure-and-function"><img src="/assets/course-cell.webp" alt="" /><span><small>Complete course</small><strong>Cell Structure and Function</strong><em>View course <ArrowRight size={14} /></em></span></a></aside></section>
    </>
  );
}

function VideoDetailPage({ page }: { page: PageDefinition }) {
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState("Transcript");
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHero page={page} kicker="Free biology explainer">Follow glucose through glycolysis, the Krebs cycle, and oxidative phosphorylation without losing the big picture.</PageHero>
      <section className="page-container video-detail section-space">
        <div className={`video-stage${playing ? " is-playing" : ""}`}><img src="/assets/lesson-video.webp" alt="Dr. Sarah teaching cellular respiration" /><button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause video" : "Play video"}>{playing ? <span className="pause-icon">Ⅱ</span> : <Play fill="currentColor" />}</button><div className="video-stage__controls"><span>{playing ? "03:18" : "00:00"}</span><i><b style={{ width: playing ? "26%" : "0%" }} /></i><span>12:42</span><small>HD</small></div></div>
        <div className="video-heading"><div><span>Cell biology · IGCSE / A Level</span><h1>Cellular Respiration, Clearly Explained</h1><p>18,420 views · Published 14 August 2026</p></div><button className="button button--outline" type="button" onClick={() => setSaved((value) => !value)}><Heart size={17} fill={saved ? "currentColor" : "none"} />{saved ? "Saved" : "Save video"}</button></div>
        <div className="video-info-grid"><div><div className="tab-list" role="tablist">{["Transcript", "Key ideas", "Resources"].map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>{tab === "Transcript" && <div className="transcript"><p><button type="button">00:00</button><span>Every living cell needs a usable supply of energy. Cellular respiration is the set of reactions that transfers energy from glucose into ATP—the molecule that powers cellular work.</span></p><p><button type="button">01:26</button><span>Rather than memorising three disconnected stages, picture a controlled transfer. High-energy electrons are collected, carried, and finally used to build a proton gradient.</span></p><p><button type="button">04:51</button><span>Glycolysis begins in the cytoplasm. It invests two ATP, splits a six-carbon glucose, and produces two three-carbon pyruvate molecules.</span></p><p><button type="button">08:34</button><span>The electron transport chain turns those collected electrons into a gradient across the inner mitochondrial membrane. ATP synthase provides a route back—and captures that flow as ATP.</span></p></div>}{tab === "Key ideas" && <ul className="key-ideas"><li><CheckCircle2 />Respiration transfers energy; it does not “create” it.</li><li><CheckCircle2 />Glycolysis occurs in the cytoplasm and does not require oxygen.</li><li><CheckCircle2 />Most ATP is formed through oxidative phosphorylation.</li><li><CheckCircle2 />Oxygen is the final electron acceptor in aerobic respiration.</li></ul>}{tab === "Resources" && <div className="download-list"><button type="button"><FileText /><span><strong>Guided video notes</strong><small>PDF · 6 pages</small></span><Download /></button><button type="button"><FileCheck2 /><span><strong>Knowledge-check questions</strong><small>PDF · 12 questions</small></span><Download /></button></div>}</div><aside className="video-instructor"><img src="/assets/instructor.webp" alt="Dr. Sarah Ahmed" /><div><span>Your instructor</span><h2>Dr. Sarah Ahmed</h2><p>Molecular biology educator making complex processes visual and connected.</p><a className="text-link" href="/instructor">Meet Sarah <ArrowRight size={15} /></a></div></aside></div>
      </section>
    </>
  );
}

const faqs = [
  { category: "Courses", question: "How do I know which course is right for me?", answer: "Start with your level, curriculum, and current goal. Every course page lists prerequisites, outcomes, lesson count, and a preview. If two courses look suitable, send our learning team your curriculum and target—we’ll recommend a sequence." },
  { category: "Courses", question: "How long can I access an individual course?", answer: "An individual course purchase includes lifetime access to that course, its future lesson updates, downloadable resources, assessments, and certificate. Subscription access continues while your plan is active." },
  { category: "Learning", question: "Can I study on a phone or tablet?", answer: "Yes. Lessons, transcripts, quizzes, notes, and progress tracking work across modern phones, tablets, and computers. Your place syncs when you sign in on another device." },
  { category: "Learning", question: "Are courses aligned to my exam board?", answer: "Curriculum-aligned courses clearly list the mapped board, syllabus, and specification version. Concept courses may support several boards and show the precise overlap on the course page." },
  { category: "Payments", question: "Can I cancel a subscription at any time?", answer: "Yes. You can cancel before your next renewal from your account. You keep access through the paid billing period, and your learning history remains saved if you return." },
  { category: "Payments", question: "What is the refund policy?", answer: "Eligible individual course purchases and first subscription payments can be requested within 14 days, provided less than 25% of paid content has been completed. See the refund policy for the full criteria." },
  { category: "Account", question: "Can more than one learner use an account?", answer: "Personal accounts support one learner so progress and certificates remain accurate. Choose the Family plan for three separate learner profiles, or contact us for school access." },
  { category: "Account", question: "How are certificates verified?", answer: "Every earned certificate has a unique BIOPHLO reference and verification link. Schools and employers can enter the reference on the public verification page without accessing private learner data." },
];

function FAQPage({ page }: { page: PageDefinition }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(0);
  const visible = faqs.filter((faq) => (category === "All" || faq.category === category) && `${faq.question} ${faq.answer}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHero page={page} kicker="Answers, without the searching" actions={<label className="hero-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a question" /></label>}>Find clear answers about learning, access, payments, accounts, and BIOPHLO certificates.</PageHero>
      <section className="page-container faq-layout section-space">
        <aside><strong>Browse by topic</strong>{["All", "Courses", "Learning", "Payments", "Account"].map((item) => <button type="button" className={category === item ? "is-active" : ""} onClick={() => setCategory(item)} key={item}>{item}<span>{item === "All" ? faqs.length : faqs.filter((faq) => faq.category === item).length}</span></button>)}</aside>
        <div className="faq-list"><div className="faq-list__heading"><span className="section-mark">{category === "All" ? "All questions" : category}</span><h2>{visible.length} answers to explore</h2></div>{visible.map((faq) => { const index = faqs.indexOf(faq); return <article className={open === index ? "is-open" : ""} key={faq.question}><button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}><span>{faq.question}<small>{faq.category}</small></span><Plus /></button>{open === index && <div><p>{faq.answer}</p>{faq.category === "Payments" && <a href="/legal/refunds">Read the refund policy <ArrowRight size={14} /></a>}</div>}</article>; })}{!visible.length && <div className="empty-state"><CircleHelp size={34} /><h2>No answer matched your search</h2><p>Try fewer words, or ask our support team.</p></div>}</div>
      </section>
      <section className="page-container support-strip"><MessageCircle /><div><h2>Still have a question?</h2><p>Our learner support team usually replies within one working day.</p></div><a className="button button--teal" href="/contact">Contact BIOPHLO</a></section>
    </>
  );
}

type ContactValues = { name: string; email: string; role: string; topic: string; message: string; consent: boolean };

function ContactPage({ page }: { page: PageDefinition }) {
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", role: "Learner", topic: "Course guidance", message: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.message.trim().length < 20) next.message = "Add at least 20 characters so we can help properly.";
    if (!values.consent) next.consent = "Confirm that we may reply to your message.";
    setErrors(next);
    setFeedback(Object.keys(next).length ? { tone: "danger", text: "Check the highlighted fields and try again." } : { tone: "success", text: "Message received. Your reference is BIO-C-4821; we’ll reply within one working day." });
    if (!Object.keys(next).length) setValues({ name: "", email: "", role: "Learner", topic: "Course guidance", message: "", consent: false });
  };
  return (
    <>
      <PageHero page={page} kicker="Start a conversation">Course question, school enquiry, or a little help choosing? Send the details and the right person will reply.</PageHero>
      <section className="page-container contact-layout section-space">
        <form className="form-card" onSubmit={submit} noValidate><div className="form-card__heading"><span className="section-mark">Send a message</span><h2>What can we help with?</h2><p>Fields marked * are required.</p></div><FeedbackBanner feedback={feedback} /><div className="form-grid"><label><span>Full name *</span><input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} aria-invalid={Boolean(errors.name)} placeholder="Your full name" /><FieldError>{errors.name}</FieldError></label><label><span>Email address *</span><input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} aria-invalid={Boolean(errors.email)} placeholder="name@example.com" /><FieldError>{errors.email}</FieldError></label><label><span>I’m a</span><select value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value })}><option>Learner</option><option>Parent or carer</option><option>Teacher</option><option>School leader</option><option>Other</option></select></label><label><span>Topic</span><select value={values.topic} onChange={(event) => setValues({ ...values, topic: event.target.value })}><option>Course guidance</option><option>School access</option><option>Account support</option><option>Billing and payments</option><option>Partnerships</option><option>Other</option></select></label><label className="form-grid__full"><span>Message *</span><textarea rows={6} value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} aria-invalid={Boolean(errors.message)} placeholder="Tell us what you’re working toward and what you need help with." /><small>{values.message.length}/1000</small><FieldError>{errors.message}</FieldError></label><label className="check-row form-grid__full"><input type="checkbox" checked={values.consent} onChange={(event) => setValues({ ...values, consent: event.target.checked })} /><span>I’m happy for BIOPHLO to use these details to reply to my enquiry.</span></label><FieldError>{errors.consent}</FieldError></div><button className="button button--orange" type="submit">Send message <ArrowRight size={17} /></button></form>
        <aside className="contact-aside"><div><span className="contact-aside__icon"><Mail /></span><h2>Email us</h2><p>For general and learning enquiries</p><a href="mailto:hello@biophlo.com">hello@biophlo.com</a></div><div><span className="contact-aside__icon"><Clock3 /></span><h2>Response times</h2><p>Sunday–Thursday, 9:00–17:00 GMT+3</p><strong>Usually within one working day</strong></div><div><span className="contact-aside__icon"><MapPin /></span><h2>Learning everywhere</h2><p>BIOPHLO is online-first, supporting learners in more than 30 countries.</p></div><div className="contact-aside__notice"><ShieldCheck /><p>Never send passwords or payment card details in this form.</p></div></aside>
      </section>
    </>
  );
}

const supportArticles = [
  ["Getting started", "Choose your first course, set a study goal, and understand your dashboard.", BookOpen],
  ["Courses and progress", "Resume lessons, reset an activity, or understand completion status.", BarChart3],
  ["Account and sign-in", "Update your email, reset a password, or protect your account.", UserRound],
  ["Billing and subscriptions", "Find invoices, manage renewal, and understand a payment status.", ShoppingBag],
  ["Technical troubleshooting", "Resolve video, download, browser, and device problems.", MonitorPlay],
  ["Certificates", "Download, share, and verify a course certificate.", Award],
] as const;

function SupportPage({ page }: { page: PageDefinition }) {
  const [query, setQuery] = useState("");
  const [issue, setIssue] = useState("");
  const filtered = supportArticles.filter(([title, text]) => `${title} ${text}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHero page={page} kicker="BIOPHLO help centre" actions={<label className="hero-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What do you need help with?" /></label>}>Find a quick answer or tell us where you’re stuck. Learning support and account help live in one place.</PageHero>
      <section className="page-container support-page section-space"><div className="support-articles"><div className="section-heading-row"><div><span className="section-mark">Browse help</span><h2>Help by topic</h2></div><a className="text-link" href="/faq">View common questions <ArrowRight size={16} /></a></div><div className="support-grid">{filtered.map(([title, text, Icon]) => <button type="button" onClick={() => setIssue(String(title))} className={issue === title ? "is-selected" : ""} key={String(title)}><span><Icon /></span><h3>{String(title)}</h3><p>{String(text)}</p><em>Open articles <ArrowRight size={15} /></em></button>)}</div>{issue && <div className="article-preview"><button type="button" aria-label="Close article preview" onClick={() => setIssue("")}><X /></button><span className="section-mark">Suggested guide</span><h2>{issue}</h2><p>Start with the guided checks for {issue.toLowerCase()}. They cover the most common causes and preserve your learning data.</p><ol><li>Check that you’re signed in to the correct learner profile.</li><li>Refresh the page once and retry the action.</li><li>If the issue remains, note the page and any message you see.</li></ol><a className="button button--teal" href="/contact">Contact support with details</a></div>}</div><aside className="support-contact"><span className="support-contact__art"><Headphones /></span><span className="section-mark">Need a person?</span><h2>We’re ready to help.</h2><p>Send us the details once and your request will reach the team best placed to solve it.</p><a className="button button--orange button--wide" href="/contact"><MessageCircle size={17} /> Send a support request</a><hr /><dl><div><dt>Standard response</dt><dd>Within 1 working day</dd></div><div><dt>Account security</dt><dd>Prioritised immediately</dd></div><div><dt>Support hours</dt><dd>Sun–Thu, 09:00–17:00</dd></div></dl></aside></section>
    </>
  );
}

function CertificatePage({ page }: { page: PageDefinition }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const verify = (event: FormEvent) => { event.preventDefault(); setStatus(code.trim().toUpperCase() === "BIO-2026-10482" && name.trim().length > 1 ? "valid" : "invalid"); };
  return (
    <>
      <PageHero page={page} kicker="Public certificate record">Confirm that a certificate was issued by BIOPHLO. Verification reveals only the learning record shown on the certificate.</PageHero>
      <section className="page-container verify-layout section-space"><form className="verify-form" onSubmit={verify}><span className="verify-icon"><BadgeCheck /></span><h2>Enter certificate details</h2><p>You’ll find the reference beneath the QR code. Try <button type="button" onClick={() => { setCode("BIO-2026-10482"); setName("Layla Hassan"); }}>BIO-2026-10482</button> for this local demo.</p><label><span>Certificate reference</span><input value={code} onChange={(event) => { setCode(event.target.value.toUpperCase()); setStatus("idle"); }} placeholder="BIO-YYYY-00000" /></label><label><span>Learner surname or full name</span><input value={name} onChange={(event) => { setName(event.target.value); setStatus("idle"); }} placeholder="Name shown on certificate" /></label><button className="button button--orange button--wide" type="submit"><Search size={17} /> Verify certificate</button><small><Lock size={14} /> Details are matched securely and are not stored.</small></form><div className={`verification-result verification-result--${status}`}>{status === "idle" && <><FileCheck2 /><h2>Verification result</h2><p>Enter both details to view the public certificate record.</p><div className="result-skeleton"><i /><i /><i /></div></>}{status === "invalid" && <><AlertCircle /><h2>We couldn’t verify that record</h2><p>Check the reference and learner name exactly as printed. A revoked or replaced certificate may also return no result.</p><button className="text-link" type="button" onClick={() => { setCode(""); setName(""); setStatus("idle"); }}>Try again <RefreshCw size={15} /></button></>}{status === "valid" && <><span className="valid-seal"><BadgeCheck /></span><small>Valid BIOPHLO certificate</small><h2>Cell Structure and Function</h2><dl><div><dt>Learner</dt><dd>Layla Hassan</dd></div><div><dt>Certificate ID</dt><dd>BIO-2026-10482</dd></div><div><dt>Issued</dt><dd>28 August 2026</dd></div><div><dt>Learning time</dt><dd>8.5 hours</dd></div><div><dt>Final assessment</dt><dd>92%</dd></div><div><dt>Status</dt><dd><CheckCircle2 /> Active</dd></div></dl><p>Issued by BIOPHLO Learning · Verified {new Date().toLocaleDateString("en-GB")}</p></>}</div></section>
    </>
  );
}

function PasswordField({ value, onChange, label = "Password", placeholder = "Enter your password", error, autoComplete = "current-password" }: { value: string; onChange: (value: string) => void; label?: string; placeholder?: string; error?: string; autoComplete?: string }) {
  const [visible, setVisible] = useState(false);
  return <label><span>{label}</span><div className="password-field"><input type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} /><button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><FieldError>{error}</FieldError></label>;
}

function AuthFrame({ page, children, footer }: { page: PageDefinition; children: ReactNode; footer?: ReactNode }) {
  return <section className="auth-page"><div className="auth-page__visual"><div className="auth-page__molecule" aria-hidden="true"><i /><i /><i /><i /><i /></div><div><span className="auth-page__quote"><Quote /></span><blockquote>“Biology stopped feeling like separate facts. I can finally see how the ideas fit together.”</blockquote><p><strong>Layla Hassan</strong><span>IGCSE learner · BIOPHLO member</span></p></div></div><div className="auth-page__content"><div className="auth-card"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={14} /><span>{page.title}</span></nav><div className="auth-card__heading"><span className="section-mark">Secure learner access</span><h1>{page.title}</h1><p>{page.description}</p></div>{children}{footer && <div className="auth-card__footer">{footer}</div>}<div className="auth-trust"><ShieldCheck size={16} /><span>Your connection and account details are protected.</span></div></div></div></section>;
}

function SignUpForm({ page }: { page: PageDefinition }) {
  const [values, setValues] = useState({ first: "", last: "", email: "", role: "Student", level: "IGCSE / GCSE", password: "", terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const submit = (event: FormEvent) => { event.preventDefault(); const next: Record<string, string> = {}; if (values.first.trim().length < 2) next.first = "Enter your first name."; if (values.last.trim().length < 2) next.last = "Enter your last name."; if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address."; if (values.password.length < 10 || !/[A-Z]/.test(values.password) || !/\d/.test(values.password)) next.password = "Use 10+ characters with a capital letter and number."; if (!values.terms) next.terms = "Accept the terms to create your account."; setErrors(next); setFeedback(Object.keys(next).length ? { tone: "danger", text: "Review the highlighted account details." } : { tone: "success", text: "Account created locally. Check your inbox for the six-digit verification code." }); };
  const strength = Math.min(4, Number(values.password.length >= 10) + Number(/[A-Z]/.test(values.password)) + Number(/\d/.test(values.password)) + Number(/[^A-Za-z0-9]/.test(values.password)));
  return <AuthFrame page={page} footer={<>Already have an account? <a href="/auth/login">Log in</a></>}><form className="auth-form" onSubmit={submit} noValidate><FeedbackBanner feedback={feedback} /><div className="form-grid form-grid--compact"><label><span>First name</span><input autoComplete="given-name" value={values.first} onChange={(event) => setValues({ ...values, first: event.target.value })} placeholder="First name" aria-invalid={Boolean(errors.first)} /><FieldError>{errors.first}</FieldError></label><label><span>Last name</span><input autoComplete="family-name" value={values.last} onChange={(event) => setValues({ ...values, last: event.target.value })} placeholder="Last name" aria-invalid={Boolean(errors.last)} /><FieldError>{errors.last}</FieldError></label></div><label><span>Email address</span><input type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} /><FieldError>{errors.email}</FieldError></label><div className="form-grid form-grid--compact"><label><span>I’m joining as</span><select value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value })}><option>Student</option><option>Parent or carer</option><option>Teacher</option></select></label><label><span>Current level</span><select value={values.level} onChange={(event) => setValues({ ...values, level: event.target.value })}><option>Foundation</option><option>Lower secondary</option><option>IGCSE / GCSE</option><option>AS Level</option><option>A Level</option><option>Other</option></select></label></div><PasswordField value={values.password} onChange={(password) => setValues({ ...values, password })} label="Create a password" placeholder="At least 10 characters" error={errors.password} autoComplete="new-password" /><div className="password-strength" aria-label={`Password strength ${strength} of 4`}><span>{[1, 2, 3, 4].map((item) => <i className={strength >= item ? "is-filled" : ""} key={item} />)}</span><small>{strength < 2 ? "Use a capital letter, number, and symbol" : strength < 4 ? "Good—one more variation makes it stronger" : "Strong password"}</small></div><label className="check-row"><input type="checkbox" checked={values.terms} onChange={(event) => setValues({ ...values, terms: event.target.checked })} /><span>I agree to the <a href="/legal/terms">terms</a> and acknowledge the <a href="/legal/privacy">privacy policy</a>.</span></label><FieldError>{errors.terms}</FieldError><button className="button button--orange button--wide" type="submit">Create learner account <ArrowRight size={17} /></button></form></AuthFrame>;
}

function LoginForm({ page }: { page: PageDefinition }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [remember, setRemember] = useState(true); const [feedback, setFeedback] = useState<Feedback>(null);
  const submit = (event: FormEvent) => { event.preventDefault(); setFeedback(/^\S+@\S+\.\S+$/.test(email) && password.length >= 6 ? { tone: "success", text: "Signed in locally. Your learner dashboard is ready." } : { tone: "danger", text: "Enter a valid email and a password of at least 6 characters." }); };
  return <AuthFrame page={page} footer={<>New to BIOPHLO? <a href="/auth/sign-up">Create a free account</a></>}><form className="auth-form" onSubmit={submit}><FeedbackBanner feedback={feedback} /><label><span>Email address</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label><PasswordField value={password} onChange={setPassword} /><div className="auth-form__options"><label className="check-row"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>Keep me signed in</span></label><a href="/auth/forgot-password">Forgot password?</a></div><button className="button button--orange button--wide" type="submit">Log in <ArrowRight size={17} /></button><div className="auth-divider"><span>or</span></div><button className="button button--outline button--wide social-login" type="button"><Globe2 size={18} /> Continue with Google</button></form></AuthFrame>;
}

function CodeInput({ value, onChange, label = "Six-digit verification code" }: { value: string; onChange: (value: string) => void; label?: string }) {
  return <label className="code-field"><span>{label}</span><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={value} onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))} placeholder="000000" /><small>{value.length}/6 digits</small></label>;
}

function VerifyEmailForm({ page }: { page: PageDefinition }) {
  const [code, setCode] = useState(""); const [feedback, setFeedback] = useState<Feedback>(null); const [resent, setResent] = useState(false);
  return <AuthFrame page={page} footer={<>Wrong email? <a href="/auth/sign-up">Update account details</a></>}><form className="auth-form" onSubmit={(event) => { event.preventDefault(); setFeedback(code.length === 6 ? { tone: "success", text: "Email verified. Your learner account is active." } : { tone: "danger", text: "Enter all six digits from your verification email." }); }}><div className="auth-message-icon"><Mail /></div><p className="auth-instruction">We sent a code to <strong>your-email@example.com</strong>. It expires in 10 minutes.</p><FeedbackBanner feedback={feedback} /><CodeInput value={code} onChange={setCode} /><button className="button button--orange button--wide" type="submit">Verify email</button><button className="text-button" type="button" onClick={() => setResent(true)}>{resent ? <><Check size={15} /> New code sent</> : "Didn’t receive it? Send another code"}</button></form></AuthFrame>;
}

function ForgotPasswordForm({ page }: { page: PageDefinition }) {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  return <AuthFrame page={page} footer={<a href="/auth/login"><ArrowLeft size={15} /> Back to log in</a>}>{sent ? <div className="auth-success"><CheckCircle2 /><h2>Check your inbox</h2><p>If an account exists for <strong>{email}</strong>, a secure reset link is on its way. It expires in 30 minutes.</p><button className="button button--outline button--wide" type="button" onClick={() => setSent(false)}>Use a different email</button></div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) setError("Enter the email address connected to your account."); else { setError(""); setSent(true); } }}><p className="auth-instruction">Enter your account email. We’ll send a time-limited link to create a new password.</p><label><span>Email address</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" aria-invalid={Boolean(error)} /><FieldError>{error}</FieldError></label><button className="button button--orange button--wide" type="submit">Send reset link <ArrowRight size={17} /></button></form>}</AuthFrame>;
}

function ResetPasswordForm({ page }: { page: PageDefinition }) {
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [feedback, setFeedback] = useState<Feedback>(null);
  return <AuthFrame page={page} footer={<a href="/auth/login"><ArrowLeft size={15} /> Back to log in</a>}><form className="auth-form" onSubmit={(event) => { event.preventDefault(); setFeedback(password.length >= 10 && /[A-Z]/.test(password) && /\d/.test(password) && password === confirm ? { tone: "success", text: "Password updated. You can now log in securely." } : { tone: "danger", text: password !== confirm ? "The two passwords do not match." : "Use 10+ characters with a capital letter and number." }); }}><PasswordField value={password} onChange={setPassword} label="New password" autoComplete="new-password" /><PasswordField value={confirm} onChange={setConfirm} label="Confirm new password" autoComplete="new-password" /><div className="password-rules"><strong>Your password must include</strong><span className={password.length >= 10 ? "is-met" : ""}><Check /> At least 10 characters</span><span className={/[A-Z]/.test(password) ? "is-met" : ""}><Check /> One capital letter</span><span className={/\d/.test(password) ? "is-met" : ""}><Check /> One number</span></div><FeedbackBanner feedback={feedback} /><button className="button button--orange button--wide" type="submit">Save new password</button></form></AuthFrame>;
}

function TwoFactorForm({ page }: { page: PageDefinition }) {
  const [code, setCode] = useState(""); const [trust, setTrust] = useState(false); const [feedback, setFeedback] = useState<Feedback>(null);
  return <AuthFrame page={page} footer={<a href="/auth/recovery">Use a recovery code instead</a>}><form className="auth-form" onSubmit={(event) => { event.preventDefault(); setFeedback(code.length === 6 ? { tone: "success", text: "Identity confirmed. This device is cleared to continue." } : { tone: "danger", text: "Enter the current six-digit authenticator code." }); }}><div className="auth-message-icon"><ShieldCheck /></div><p className="auth-instruction">Open your authenticator app and enter the current code for BIOPHLO.</p><CodeInput value={code} onChange={setCode} label="Authenticator code" /><label className="check-row"><input type="checkbox" checked={trust} onChange={(event) => setTrust(event.target.checked)} /><span>Trust this private device for 30 days</span></label><FeedbackBanner feedback={feedback} /><button className="button button--orange button--wide" type="submit">Confirm and continue</button></form></AuthFrame>;
}

function RecoveryForm({ page }: { page: PageDefinition }) {
  const [code, setCode] = useState(""); const [feedback, setFeedback] = useState<Feedback>(null);
  return <AuthFrame page={page} footer={<a href="/auth/two-factor"><ArrowLeft size={15} /> Use authenticator code</a>}><form className="auth-form" onSubmit={(event) => { event.preventDefault(); setFeedback(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code) ? { tone: "success", text: "Recovery code accepted. This one-time code is now retired." } : { tone: "danger", text: "Enter a recovery code in the format XXXX-XXXX." }); }}><div className="auth-message-icon"><Lock /></div><p className="auth-instruction">Enter one of the one-time recovery codes you saved when two-factor authentication was enabled.</p><label><span>Recovery code</span><input className="recovery-input" value={code} maxLength={9} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="XXXX-XXXX" autoComplete="off" /></label><FeedbackBanner feedback={feedback} /><button className="button button--orange button--wide" type="submit">Recover account</button><div className="security-note"><AlertCircle /><p><strong>No recovery codes?</strong> Contact support. We’ll verify account ownership before changing security settings.</p></div></form></AuthFrame>;
}

function AuthPage({ page }: { page: PageDefinition }) {
  if (page.id === "sign-up") return <SignUpForm page={page} />;
  if (page.id === "login") return <LoginForm page={page} />;
  if (page.id === "verify-email") return <VerifyEmailForm page={page} />;
  if (page.id === "forgot-password") return <ForgotPasswordForm page={page} />;
  if (page.id === "reset-password") return <ResetPasswordForm page={page} />;
  if (page.id === "two-factor-challenge") return <TwoFactorForm page={page} />;
  return <RecoveryForm page={page} />;
}

type CartItem = { id: string; title: string; access: string; price: number; image: string; quantity: number };

function OrderSummary({ subtotal, discount = 0, action }: { subtotal: number; discount?: number; action?: ReactNode }) {
  const total = Math.max(0, subtotal - discount);
  return <aside className="order-summary"><h2>Order summary</h2><dl><div><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>{discount > 0 && <div className="discount-row"><dt>Learning discount</dt><dd>−${discount.toFixed(2)}</dd></div>}<div><dt>Tax</dt><dd>Calculated at checkout</dd></div></dl><div className="order-total"><span>Total</span><strong>${total.toFixed(2)} <small>USD</small></strong></div>{action}<div className="secure-checkout"><ShieldCheck /><p><strong>Secure checkout</strong><span>Encrypted payment · 14-day guarantee</span></p></div></aside>;
}

function CartPage({ page }: { page: PageDefinition }) {
  const [items, setItems] = useState<CartItem[]>([
    { id: "cell", title: "Cell Structure and Function", access: "Lifetime access · One learner", price: 59, image: "/assets/course-cell.webp", quantity: 1 },
    { id: "genetics", title: "Genetics and Inheritance", access: "Lifetime access · One learner", price: 69, image: "/assets/course-genetics.webp", quantity: 1 },
  ]);
  const [promo, setPromo] = useState(""); const [discount, setDiscount] = useState(0); const [feedback, setFeedback] = useState<Feedback>(null);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const updateQuantity = (id: string, quantity: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(5, quantity)) } : item));
  const applyPromo = () => { if (promo.trim().toUpperCase() === "LEARN10") { setDiscount(subtotal * 0.1); setFeedback({ tone: "success", text: "LEARN10 applied: 10% off your courses." }); } else { setDiscount(0); setFeedback({ tone: "danger", text: "That code isn’t valid. Try LEARN10 in this local demo." }); } };
  return <><PageHero page={page} kicker="Your learning selection">Review access, update quantities, and move to secure checkout when everything looks right.</PageHero><section className="page-container cart-layout section-space"><div className="cart-main"><div className="cart-heading"><h2>{items.length} {items.length === 1 ? "course" : "courses"} in your cart</h2><a href="/courses">Continue browsing</a></div>{items.length ? <div className="cart-items">{items.map((item) => <article key={item.id}><img src={item.image} alt="" /><div className="cart-item__copy"><span>Complete BIOPHLO course</span><h3>{item.title}</h3><p>{item.access}</p><button type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}><Trash2 size={15} /> Remove</button></div><label className="quantity"><span>Qty</span><div><button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus /></button><input aria-label={`Quantity for ${item.title}`} type="number" min="1" max="5" value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} /><button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity"><Plus /></button></div></label><strong>${(item.price * item.quantity).toFixed(2)}</strong></article>)}</div> : <div className="empty-state empty-state--large"><ShoppingBag size={42} /><h2>Your cart is ready for a discovery</h2><p>Choose a focused course and it will appear here.</p><a className="button button--orange" href="/courses">Explore courses</a></div>}<div className="promo-box"><label><span>Have a learning code?</span><div><input value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Enter code" /><button className="button button--outline" type="button" onClick={applyPromo}>Apply</button></div></label><FeedbackBanner feedback={feedback} /></div><div className="cart-assurances">{[[ShieldCheck, "14-day guarantee", "Eligible purchases can be refunded."], [Globe2, "Lifetime access", "For every individual course."], [Lock, "Secure payment", "Encrypted from start to finish."]].map(([Icon, title, text]) => <div key={String(title)}><Icon /><span><strong>{String(title)}</strong><small>{String(text)}</small></span></div>)}</div></div><OrderSummary subtotal={subtotal} discount={discount} action={items.length > 0 ? <a className="button button--orange button--wide" href="/checkout">Continue to checkout <ArrowRight size={17} /></a> : undefined} /></section></>;
}

type CheckoutValues = { first: string; last: string; email: string; country: string; address: string; city: string; postcode: string; cardName: string; cardNumber: string; expiry: string; cvc: string; agree: boolean };

function CheckoutPage({ page }: { page: PageDefinition }) {
  const [values, setValues] = useState<CheckoutValues>({ first: "", last: "", email: "", country: "Lebanon", address: "", city: "", postcode: "", cardName: "", cardNumber: "", expiry: "", cvc: "", agree: false });
  const [method, setMethod] = useState<"card" | "paypal">("card"); const [errors, setErrors] = useState<Record<string, string>>({}); const [complete, setComplete] = useState(false);
  const set = (key: keyof CheckoutValues, value: string | boolean) => setValues((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); const next: Record<string, string> = {}; if (values.first.trim().length < 2) next.first = "Enter your first name."; if (values.last.trim().length < 2) next.last = "Enter your last name."; if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid receipt email."; if (values.address.trim().length < 5) next.address = "Enter your billing address."; if (values.city.trim().length < 2) next.city = "Enter your city."; if (method === "card") { if (values.cardName.trim().length < 3) next.cardName = "Enter the name shown on the card."; if (values.cardNumber.replace(/\s/g, "").length !== 16) next.cardNumber = "Enter a 16-digit card number."; if (!/^\d{2}\/\d{2}$/.test(values.expiry)) next.expiry = "Use MM/YY."; if (!/^\d{3,4}$/.test(values.cvc)) next.cvc = "Enter 3 or 4 digits."; } if (!values.agree) next.agree = "Accept the purchase terms to continue."; setErrors(next); if (!Object.keys(next).length) setComplete(true); };
  if (complete) return <section className="checkout-complete"><span><CheckCircle2 /></span><small>Order BIO-10482</small><h1>Your local checkout is complete.</h1><p>No real payment was processed. The front-end flow validated your details and created a demonstration enrollment.</p><div><a className="button button--orange" href="/checkout/success">View confirmation</a><a className="button button--outline" href="/courses">Keep exploring</a></div></section>;
  return <><PageHero page={page} kicker="Secure checkout">Complete your billing details. Your receipt and course access will be linked to the email below.</PageHero><section className="page-container checkout-layout section-space"><form className="checkout-form" onSubmit={submit} noValidate><div className="checkout-progress"><span className="is-complete"><Check /> Cart</span><i /><span className="is-current"><b>2</b> Details</span><i /><span><b>3</b> Access</span></div><section><div className="form-section-heading"><span>1</span><div><h2>Contact details</h2><p>We’ll send your receipt and access instructions here.</p></div></div><div className="form-grid"><label><span>First name *</span><input value={values.first} onChange={(event) => set("first", event.target.value)} autoComplete="given-name" aria-invalid={Boolean(errors.first)} /><FieldError>{errors.first}</FieldError></label><label><span>Last name *</span><input value={values.last} onChange={(event) => set("last", event.target.value)} autoComplete="family-name" aria-invalid={Boolean(errors.last)} /><FieldError>{errors.last}</FieldError></label><label className="form-grid__full"><span>Email for access and receipt *</span><input type="email" value={values.email} onChange={(event) => set("email", event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} placeholder="name@example.com" /><FieldError>{errors.email}</FieldError></label></div></section><section><div className="form-section-heading"><span>2</span><div><h2>Billing address</h2><p>Used to calculate any applicable tax.</p></div></div><div className="form-grid"><label className="form-grid__full"><span>Country / region *</span><select value={values.country} onChange={(event) => set("country", event.target.value)}><option>Lebanon</option><option>United Arab Emirates</option><option>United Kingdom</option><option>United States</option><option>Saudi Arabia</option><option>Other</option></select></label><label className="form-grid__full"><span>Street address *</span><input value={values.address} onChange={(event) => set("address", event.target.value)} autoComplete="street-address" aria-invalid={Boolean(errors.address)} /><FieldError>{errors.address}</FieldError></label><label><span>City *</span><input value={values.city} onChange={(event) => set("city", event.target.value)} autoComplete="address-level2" aria-invalid={Boolean(errors.city)} /><FieldError>{errors.city}</FieldError></label><label><span>Postcode</span><input value={values.postcode} onChange={(event) => set("postcode", event.target.value)} autoComplete="postal-code" /></label></div></section><section><div className="form-section-heading"><span>3</span><div><h2>Payment method</h2><p>This demonstration stores and charges nothing.</p></div></div><div className="payment-tabs"><button type="button" onClick={() => setMethod("card")} className={method === "card" ? "is-active" : ""}><span>Card</span><small>Visa · Mastercard · Amex</small><Check /></button><button type="button" onClick={() => setMethod("paypal")} className={method === "paypal" ? "is-active" : ""}><span>PayPal</span><small>Continue with your PayPal account</small><Check /></button></div>{method === "card" ? <div className="card-fields"><label><span>Name on card *</span><input value={values.cardName} onChange={(event) => set("cardName", event.target.value)} autoComplete="cc-name" aria-invalid={Boolean(errors.cardName)} /><FieldError>{errors.cardName}</FieldError></label><label><span>Card number *</span><div className="card-input"><input inputMode="numeric" value={values.cardNumber} onChange={(event) => set("cardNumber", event.target.value.replace(/[^\d ]/g, "").slice(0, 19))} autoComplete="cc-number" placeholder="4242 4242 4242 4242" aria-invalid={Boolean(errors.cardNumber)} /><Lock /></div><FieldError>{errors.cardNumber}</FieldError></label><div className="form-grid"><label><span>Expiry *</span><input value={values.expiry} onChange={(event) => set("expiry", event.target.value.slice(0, 5))} autoComplete="cc-exp" placeholder="MM/YY" aria-invalid={Boolean(errors.expiry)} /><FieldError>{errors.expiry}</FieldError></label><label><span>Security code *</span><input inputMode="numeric" value={values.cvc} onChange={(event) => set("cvc", event.target.value.replace(/\D/g, "").slice(0, 4))} autoComplete="cc-csc" placeholder="CVC" aria-invalid={Boolean(errors.cvc)} /><FieldError>{errors.cvc}</FieldError></label></div></div> : <div className="paypal-note"><Globe2 /><p><strong>Pay with PayPal</strong><span>After reviewing the order, the local demo will simulate a secure PayPal handoff.</span></p></div>}</section><label className="check-row checkout-agree"><input type="checkbox" checked={values.agree} onChange={(event) => set("agree", event.target.checked)} /><span>I agree to the <a href="/legal/terms">purchase terms</a> and understand the <a href="/legal/refunds">refund policy</a>.</span></label><FieldError>{errors.agree}</FieldError><button className="button button--orange button--wide checkout-submit" type="submit"><Lock size={17} /> Complete secure order · $128.00</button></form><div><OrderSummary subtotal={128} /><div className="checkout-products"><h3>Your courses</h3>{courses.slice(0, 2).map((course) => <div key={course.id}><img src={course.image} alt="" /><span><strong>{course.title}</strong><small>Lifetime access</small></span><b>${course.price}</b></div>)}</div></div></section></>;
}

const legalContent: Record<string, { intro: string; updated: string; sections: { title: string; body: string[]; list?: string[] }[] }> = {
  privacy: { intro: "This policy explains what personal information BIOPHLO uses, why we use it, and the choices available to learners and account holders.", updated: "1 September 2026", sections: [
    { title: "Information we collect", body: ["We collect account details you provide, including your name, email address, learner level, and communication preferences. We also record learning activity such as lesson progress, assessment answers, saved resources, and certificates.", "Payment providers process card and wallet details. BIOPHLO receives transaction references, payment status, billing location, and limited card metadata—not full card numbers."], list: ["Account and profile information", "Course activity and assessment history", "Purchase, invoice, and subscription records", "Support messages and service diagnostics"] },
    { title: "How we use information", body: ["We use personal information to deliver learning, preserve progress, personalise recommendations, issue certificates, process purchases, protect accounts, and answer support requests. Optional analytics and marketing use depends on your cookie and communication choices."] },
    { title: "Sharing and processors", body: ["We share only the information needed with vetted providers that support hosting, video delivery, payment processing, email, analytics, and customer support. We do not sell personal information."] },
    { title: "Retention and security", body: ["Account and learning records are retained while your account is active and for the periods required for certification, accounting, security, and legal obligations. We use access controls, encryption in transit, monitoring, and regular review to reduce risk."] },
    { title: "Your choices and rights", body: ["Depending on your location, you may request access, correction, export, restriction, objection, or deletion. Some records must be retained for legal or certificate-integrity reasons. Contact privacy@biophlo.com to make a request."] },
  ] },
  terms: { intro: "These terms define the agreement between you and BIOPHLO when you use our website, learning content, and services.", updated: "1 September 2026", sections: [
    { title: "Using BIOPHLO", body: ["You must provide accurate account information, keep credentials confidential, and use the platform lawfully. A personal learner account may not be shared. Parents or guardians are responsible for accounts they create for minors."] },
    { title: "Courses and licences", body: ["BIOPHLO grants a limited, personal, non-transferable licence to access purchased or subscribed content. Course text, videos, diagrams, downloads, and assessments remain BIOPHLO intellectual property unless stated otherwise."], list: ["Do not redistribute or sell course content", "Do not bypass access or security controls", "Do not automate extraction or recording", "Use classroom licences only within the licensed cohort"] },
    { title: "Payments and subscriptions", body: ["Prices and billing periods are shown before purchase. Subscriptions renew automatically until cancelled. Taxes and currency conversion may depend on billing location and payment provider."] },
    { title: "Learning and certification", body: ["Completion certificates confirm the stated learning activity; they are not academic degrees or professional licences. We may investigate irregular assessment or account activity to protect certificate integrity."] },
    { title: "Availability and changes", body: ["We work to keep BIOPHLO reliable and current. We may update lessons, features, or these terms, and may suspend access for security, maintenance, or material breach. Significant changes will be communicated clearly."] },
  ] },
  refunds: { intro: "We want you to feel confident choosing BIOPHLO. This policy explains when purchases and subscriptions may be refunded or cancelled.", updated: "1 September 2026", sections: [
    { title: "Individual course purchases", body: ["You may request a refund within 14 days of purchase when less than 25% of the paid course has been completed and no certificate has been issued. Approved refunds return to the original payment method."] },
    { title: "Subscriptions", body: ["You can cancel at any time before renewal. Access continues to the end of the current paid period. A first subscription payment may be refundable within 14 days if usage remains below the individual-course threshold."], list: ["Cancellation prevents the next renewal", "Past charges are not automatically refunded", "Saved progress remains on your account", "Promotional and gifted access may have separate terms"] },
    { title: "Technical access issues", body: ["If a confirmed platform issue prevents meaningful access and we cannot resolve it promptly, we may extend access or issue an appropriate partial or full refund."] },
    { title: "How to request a refund", body: ["Contact billing@biophlo.com from the purchase email and include the order reference and reason. We usually respond within three working days. Banks may take an additional 5–10 working days to post an approved refund."] },
  ] },
  cookies: { intro: "This policy explains how BIOPHLO uses browser storage and similar technologies, and how you can control optional categories.", updated: "1 September 2026", sections: [
    { title: "Essential cookies", body: ["Essential cookies keep sessions secure, remember privacy choices, support checkout, and maintain core accessibility preferences. The service cannot operate correctly without them."] },
    { title: "Analytics cookies", body: ["With permission, analytics help us understand aggregate navigation, lesson performance, and device issues. We use this information to improve learning and reliability rather than identify individual learners for advertising."] },
    { title: "Preference and media storage", body: ["Preference storage remembers items such as language, playback speed, captions, and display settings. Embedded media providers may store identifiers required to stream content."] },
    { title: "Managing choices", body: ["You can update optional cookie choices from the footer or browser settings. Blocking some storage may reset preferences or require you to sign in again."] },
  ] },
  accessibility: { intro: "BIOPHLO is committed to making biology learning usable by people with a wide range of abilities, technologies, and learning needs.", updated: "1 September 2026", sections: [
    { title: "Our target", body: ["We aim to meet WCAG 2.2 Level AA across the public website and core learner experience. Accessibility is included in design, development, content production, and quality review."] },
    { title: "What we support", body: ["Our interface supports keyboard navigation, visible focus, semantic structure, zoom, responsive reflow, and screen-reader labels. Learning videos include captions; core visual explanations include text alternatives or transcripts."], list: ["Keyboard-first navigation and controls", "Colour contrast and non-colour status cues", "Captions and written transcripts", "Reduced-motion preferences", "Consistent headings, labels, and error guidance"] },
    { title: "Known limitations", body: ["Some older downloadable diagrams and third-party Articulate activities may not yet meet every target. We prioritise alternatives and remediation based on learner impact."] },
    { title: "Tell us about a barrier", body: ["Email accessibility@biophlo.com with the page, task, assistive technology, and problem. We aim to acknowledge reports within two working days and provide an accessible alternative while we investigate."] },
  ] },
};

function LegalPage({ page }: { page: PageDefinition }) {
  const content = legalContent[page.id] ?? legalContent.terms;
  const [active, setActive] = useState(0);
  return <><PageHero page={page} kicker={`Last updated ${content.updated}`}>{content.intro}</PageHero><section className="page-container legal-layout section-space"><aside><span>On this page</span>{content.sections.map((section, index) => <a className={active === index ? "is-active" : ""} href={`#legal-${index}`} onClick={() => setActive(index)} key={section.title}>{section.title}</a>)}<a href="/contact">Questions about this policy?</a></aside><article className="legal-document"><div className="legal-summary"><ShieldCheck /><p><strong>Plain-language summary</strong><span>We write policies to be read. Headings summarise each commitment; the text beneath gives its scope.</span></p></div>{content.sections.map((section, index) => <section id={`legal-${index}`} key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.list && <ul>{section.list.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul>}</div></section>)}<footer><h2>Contact and governing entity</h2><p>BIOPHLO Learning operates this service. Policy or rights requests can be sent to <a href="mailto:privacy@biophlo.com">privacy@biophlo.com</a>. General enquiries belong in the <a href="/contact">contact form</a>.</p></footer></article></section></>;
}

const systemConfig = {
  "payment-success": { code: "Payment confirmed", icon: CheckCircle2, title: "You’re ready to start learning.", text: "Order BIO-10482 is complete. Course access and a receipt have been prepared for learner@example.com.", primary: ["Go to my courses", "/student/courses"], secondary: ["View receipt", "/student/billing/invoice/BIO-10482"], tone: "success" },
  "payment-failed": { code: "Payment not completed", icon: AlertCircle, title: "Your courses are still waiting.", text: "No charge was made. Review the payment details or choose another method, then try again.", primary: ["Return to checkout", "/checkout"], secondary: ["Get billing help", "/support"], tone: "danger" },
  "not-found": { code: "404 · Page not found", icon: Search, title: "This path doesn’t lead to a lesson.", text: "The page may have moved, the address may be incomplete, or the content may no longer be available.", primary: ["Go to homepage", "/"], secondary: ["Browse courses", "/courses"], tone: "info" },
  "access-denied": { code: "403 · Access denied", icon: Lock, title: "This page needs different access.", text: "Your current account does not have permission to view this area. Sign in with an authorised account or ask for help.", primary: ["Log in again", "/auth/login"], secondary: ["Contact support", "/support"], tone: "danger" },
  maintenance: { code: "Scheduled care", icon: RefreshCw, title: "BIOPHLO is taking a short study break.", text: "We’re applying a planned platform update. Learning will be available again at 14:30 GMT+3 today.", primary: ["Check again", "/"], secondary: ["Read support updates", "/support"], tone: "info" },
} as const;

function SystemPage({ page }: { page: PageDefinition }) {
  const config = systemConfig[page.id as keyof typeof systemConfig] ?? systemConfig["not-found"];
  const Icon = config.icon;
  return <section className={`system-page system-page--${config.tone}`}><div className="system-page__molecule" aria-hidden="true"><i /><i /><i /><i /></div><div className="system-card"><span className="system-card__icon"><Icon /></span><small>{config.code}</small><h1>{config.title}</h1><p>{config.text}</p>{page.id === "payment-success" && <div className="system-order"><div><span>Cell Structure and Function</span><strong>$59.00</strong></div><div><span>Genetics and Inheritance</span><strong>$69.00</strong></div><div><span>Total paid</span><strong>$128.00 USD</strong></div></div>}{page.id === "maintenance" && <div className="maintenance-progress"><span><i /></span><small>Database update · final checks in progress</small></div>}<div className="button-row"><a className="button button--orange" href={config.primary[1]}>{config.primary[0]} <ArrowRight size={17} /></a><a className="button button--outline" href={config.secondary[1]}>{config.secondary[0]}</a></div>{page.id === "payment-failed" && <span className="system-help"><ShieldCheck /> Your cart and learning code have been preserved.</span>}</div></section>;
}

function GenericPublicPage({ page }: { page: PageDefinition }) {
  return <><PageHero page={page} /><section className="page-container section-space"><div className="empty-state empty-state--large"><Leaf size={42} /><h2>{page.title}</h2><p>{page.description}</p><a className="button button--orange" href="/courses">Explore BIOPHLO</a></div></section></>;
}

export function PublicPage({ page }: { page: PageDefinition }) {
  const isAuth = page.kind === "auth";
  const isSystem = page.kind === "system";
  let content: ReactNode;

  switch (page.id) {
    case "course-catalog": content = <CatalogPage page={page} />; break;
    case "course-details": content = <CourseDetailPage page={page} />; break;
    case "subjects": case "curricula": case "grades": content = <TaxonomyPage page={page} />; break;
    case "about": content = <AboutPage page={page} />; break;
    case "instructor": content = <InstructorPage page={page} />; break;
    case "pricing": content = <PricingPage page={page} />; break;
    case "resources": case "videos": content = <ResourceListingPage page={page} />; break;
    case "past-papers": content = <PastPapersPage page={page} />; break;
    case "resource-details": content = <ResourceDetailPage page={page} />; break;
    case "video-details": content = <VideoDetailPage page={page} />; break;
    case "faq": content = <FAQPage page={page} />; break;
    case "contact": content = <ContactPage page={page} />; break;
    case "support": content = <SupportPage page={page} />; break;
    case "certificate-verification": content = <CertificatePage page={page} />; break;
    case "cart": content = <CartPage page={page} />; break;
    case "checkout": content = <CheckoutPage page={page} />; break;
    case "privacy": case "terms": case "refunds": case "cookies": case "accessibility": content = <LegalPage page={page} />; break;
    default: content = isAuth ? <AuthPage page={page} /> : isSystem ? <SystemPage page={page} /> : <GenericPublicPage page={page} />;
  }

  return <PublicShell page={page} minimal={isAuth || isSystem}>{content}</PublicShell>;
}
