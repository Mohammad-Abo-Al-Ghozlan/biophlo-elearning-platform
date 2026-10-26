import {
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  Check,
  Globe2,
  GraduationCap,
  Laptop,
  LockKeyhole,
  Menu,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";

import "../../styles/landing.css";

const benefits = [
  {
    title: "Flexible Learning",
    text: "Learn anytime, anywhere at your own pace.",
    icon: CalendarClock,
    featured: false,
  },
  {
    title: "Expert-Led Courses",
    text: "Real-world explanations and practical examples.",
    icon: GraduationCap,
    featured: true,
  },
  {
    title: "Supportive Community",
    text: "Join a growing community of biology learners.",
    icon: Users,
    featured: false,
  },
] as const;

const journey = [
  {
    number: "01",
    title: "Explore",
    text: "Discover the amazing world of living things.",
    image: "/assets/journey-leaf.webp",
    alt: "A student examining a green leaf",
    side: "right",
  },
  {
    number: "02",
    title: "Understand",
    text: "Make sense of how life works.",
    image: "/assets/journey-microscope.webp",
    alt: "Student using a microscope",
    side: "left",
  },
  {
    number: "03",
    title: "Practise",
    text: "Build your skills step by step.",
    image: "/assets/journey-cell.webp",
    alt: "Student drawing a plant cell",
    side: "right",
  },
  {
    number: "04",
    title: "Progress",
    text: "Grow your confidence for what’s next.",
    image: "/assets/journey-student.webp",
    alt: "Student reflecting outdoors",
    side: "left",
  },
] as const;

const stats = [
  { value: "10k+", label: "Students", icon: Users },
  { value: "50+", label: "Courses", icon: BookOpenCheck },
  { value: "4.8/5", label: "Average Rating", icon: Star },
  { value: "30+", label: "Countries", icon: Globe2 },
] as const;

const courses = [
  {
    level: "Beginner",
    title: "Introduction to Plant Biology",
    rating: "4.8",
    reviews: "(320)",
    image: "/assets/course-plant.webp",
    alt: "Close-up of a vibrant green plant leaf",
  },
  {
    level: "Intermediate",
    title: "Genetics and Inheritance",
    rating: "4.9",
    reviews: "(410)",
    image: "/assets/course-genetics.webp",
    alt: "A glowing DNA double helix",
  },
  {
    level: "Advanced",
    title: "Cell Structure and Function",
    rating: "4.7",
    reviews: "(260)",
    image: "/assets/course-cell.webp",
    alt: "Microscopic blue cells",
  },
] as const;

const learningAdvantages = [
  {
    title: "Secure & Reliable",
    text: "Your learning progress and data are always safe.",
    icon: LockKeyhole,
  },
  {
    title: "Learn on Any Device",
    text: "Access your courses on web, tablet, or mobile.",
    icon: Laptop,
  },
  {
    title: "No Hidden Fees",
    text: "Transparent pricing, no surprises.",
    icon: Wallet,
  },
] as const;

type DialogName = "search" | "intro" | null;

export default function HomePage() {
  const navigate = useNavigate();
  const newsletterId = useId();
  const searchId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogName>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("Nucleus");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".bio-home .reveal");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("in-view"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeDialog) return undefined;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      if (activeDialog === "search") searchInputRef.current?.focus();
      else closeButtonRef.current?.focus();
    });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveDialog(null);
    };

    const keepFocusInDialog = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>(".bio-home .site-dialog");
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("keydown", keepFocusInDialog);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("keydown", keepFocusInDialog);
      previouslyFocused?.focus();
    };
  }, [activeDialog]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    setActiveDialog(null);
    navigate(query ? `/courses?search=${encodeURIComponent(query)}` : "/courses");
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterStatus("Enter your email address to subscribe.");
      return;
    }
    window.localStorage.setItem("biophlo-newsletter-email", email);
    setNewsletterStatus(`Thanks — ${email} is on the BIOPHLO updates list.`);
    setNewsletterEmail("");
  };

  return (
    <main className="bio-home site-shell" id="main-content">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand-link" to="/" aria-label="BIOPHLO home">
            <img className="brand-logo" src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a
              className="nav-link active"
              href="#home"
              aria-current="page"
              onClick={(event) => {
                event.preventDefault();
                scrollTo("home");
              }}
            >
              Home
            </a>
            <Link className="nav-link" to="/courses">Courses</Link>
            <Link className="nav-link" to="/about">About</Link>
            <Link className="nav-link" to="/resources">Blog</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Search BIOPHLO"
              onClick={() => setActiveDialog("search")}
            >
              <Search size={22} strokeWidth={2.2} />
            </button>
            <Link className="button button-login button-compact" to="/auth/login">Log in</Link>
            <Link className="button button-primary button-compact" to="/courses">Start Learning</Link>
            <button
              className="mobile-menu-button"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="biophlo-mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>

          {menuOpen && (
            <nav className="mobile-nav" id="biophlo-mobile-menu" aria-label="Mobile navigation">
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo("home");
                }}
              >
                Home
              </a>
              <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/resources" onClick={() => setMenuOpen(false)}>Blog</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link className="button button-primary" to="/courses" onClick={() => setMenuOpen(false)}>
                Start Learning
              </Link>
            </nav>
          )}
        </div>
      </header>

      <section className="hero" id="home">
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="eyebrow">Learn · Explore · Grow</p>
            <h1>
              Biology<br />
              Made Clear<br />
              for a <span>Brighter<br />Tomorrow</span>
            </h1>
            <p className="hero-copy">
              High-quality biology courses designed to help you understand life,
              from the smallest cells to the biggest ecosystems.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/courses">
                Explore Courses <ArrowRight size={18} />
              </Link>
              <button className="button button-outline" type="button" onClick={() => setActiveDialog("intro")}>
                <span className="round-play"><Play size={13} fill="currentColor" /></span>
                Watch Video
              </button>
            </div>
            <div className="learner-row">
              <span className="avatar-stack" aria-hidden="true">
                <span className="avatar avatar-one" />
                <span className="avatar avatar-two" />
                <span className="avatar avatar-three" />
                <span className="avatar avatar-four" />
              </span>
              <span>Join 10,000+ learners worldwide</span>
            </div>
          </div>

        </div>
      </section>

      <section className="benefits" aria-label="Learning benefits">
        <div className="container benefit-grid">
          {benefits.map(({ title, text, icon: Icon, featured }) => (
            <article className={`benefit-card${featured ? " featured" : ""}`} key={title}>
              <span className="benefit-icon"><Icon size={35} strokeWidth={1.8} /></span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="journey-section section-pad" id="journey">
        <img className="molecule-art molecule-art-left" src="/assets/molecule-amber.png" alt="" aria-hidden="true" />
        <img className="molecule-art molecule-art-right" src="/assets/molecule-aqua.png" alt="" aria-hidden="true" />
        <div className="container">
          <header className="section-heading reveal">
            <h2>Your learning journey</h2>
            <span />
          </header>

          <div className="journey-flow">
            <div className="journey-line" aria-hidden="true" />
            {journey.map((step, index) => (
              <article className={`journey-step step-${step.side} reveal`} key={step.number}>
                <div className="journey-number"><span>{step.number}</span></div>
                <div className="journey-media"><img src={step.image} alt={step.alt} /></div>
                <div className="journey-copy">
                  <h3>{step.title}</h3>
                  <span className="title-mark" />
                  <p>{step.text}</p>
                </div>
                {index < journey.length - 1 && <span className="journey-node" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="better-way-section section-pad" id="why-biophlo">
        <div className="container">
          <header className="better-way-heading reveal">
            <p className="mini-label">Why BIOPHLO</p>
            <h2>A Better Way to Learn Biology</h2>
          </header>
          <div className="better-way-grid">
            {learningAdvantages.map(({ title, text, icon: Icon }, index) => (
              <article
                className={`better-way-card${index === 1 ? " better-way-card-featured" : ""} reveal`}
                key={title}
              >
                <span className="better-way-icon"><Icon size={30} strokeWidth={1.8} /></span>
                <div className="better-way-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                {index === 1 && (
                  <span className="device-art" aria-hidden="true">
                    <img src="/assets/a-better-way-to-learn-biology.png" alt="" />
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="container about-grid reveal">
          <div className="about-photo">
            <img src="/assets/cta-instructor-pointing.png" alt="Dr. Ola working with a microscope" />
          </div>
          <div className="about-copy">
            <p className="mini-label">About the instructor</p>
            <h2>Hi, I’m <span>Dr. Ola</span></h2>
            <p className="about-intro">
              Biology educator, researcher, and lifelong learner. My passion is making biology
              simple, engaging, and relevant to real life. Through BioPhlo, I help students
              around the world build confidence in understanding the science of life.
            </p>
            <ul className="credentials">
              <li><GraduationCap size={22} /> PhD in Molecular Biology</li>
              <li><BookOpen size={22} /> 10+ Years Teaching Experience</li>
              <li><Users size={22} /> 10,000+ Students Worldwide</li>
            </ul>
            <Link className="button button-outline about-button" to="/instructor">
              More About Me <ArrowRight size={18} />
            </Link>
          </div>
          <img
            className="molecule-decoration"
            src="/assets/molecule-aqua.png"
            alt=""
            aria-hidden="true"
            width={407}
            height={627}
            decoding="async"
          />
        </div>
      </section>

      <section className="stats-band" aria-label="BIOPHLO in numbers">
        <div className="container stats-grid">
          {stats.map(({ value, label, icon: Icon }) => (
            <article className="stat-item reveal" key={label}>
              <Icon size={42} strokeWidth={1.8} />
              <div><strong>{value}</strong><span>{label}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="science-banner reveal" aria-label="Biology discovery banner">
        <img src="/assets/banner.jpeg" alt="Microscope, laboratory glassware, molecules, and a glowing idea bulb" />
        <div className="science-banner-copy">
          <p>Learn · Explore · Grow</p>
          <h2>Discover the Science of Life</h2>
        </div>
      </section>

      <section className="courses-section section-pad" id="courses">
        <div className="container">
          <div className="courses-heading reveal">
            <div>
              <p className="mini-label">Featured courses</p>
              <h2>Popular Biology Courses</h2>
            </div>
            <Link className="text-link" to="/courses">
              View All Courses <ArrowRight size={18} />
            </Link>
          </div>

          <div className="course-grid">
            {courses.map((course) => (
              <article className="course-card reveal" key={course.title}>
                <img className="course-image" src={course.image} alt={course.alt} />
                <div className="course-body">
                  <div className="course-title-row"><h3>{course.title}</h3><span className={`course-level ${course.level.toLowerCase()}`}>{course.level}</span></div>
                  <div className="rating-row">
                    <span className="rating-stars" aria-label={`${course.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star size={16} fill="currentColor" key={index} aria-hidden="true" />
                      ))}
                    </span>
                    <span>{course.rating} {course.reviews}</span>
                  </div>
                  <div className="course-footer">
                    <div className="instructor-mini">
                      <span className="teacher-avatar" aria-hidden="true" />
                      <span>Dr. Ola</span>
                    </div>
                    <Link
                      className="circle-arrow"
                      to="/courses/cell-structure-and-function"
                      aria-label={`Open ${course.title}`}
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lesson-section section-pad" id="lesson">
        <div className="container">
          <h2 className="lesson-heading reveal">Learn one idea at a time.</h2>
          <div className={`lesson-card reveal${videoPlaying ? " lesson-is-playing" : ""}`}>
            <button
              className="video-panel"
              type="button"
              aria-label={videoPlaying ? "Pause cell structure lesson" : "Play cell structure lesson"}
              aria-pressed={videoPlaying}
              onClick={() => setVideoPlaying((value) => !value)}
            >
              <img src="/assets/lesson-video.webp" alt="Teacher explaining a plant cell diagram" />
              <span className="lesson-play-toggle" aria-hidden="true">
                {videoPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              </span>
              {videoPlaying && <span className="playing-badge">Playing lesson</span>}
            </button>

            <div className="quiz-panel">
              <h3>Cell structure</h3>
              <p>Which part controls the cell?</p>
              <div className="answer-list" role="radiogroup" aria-label="Cell structure question">
                {["Nucleus", "Cell wall", "Cytoplasm"].map((answer) => (
                  <button
                    className={`answer-option${selectedAnswer === answer ? " selected" : ""}${selectedAnswer === answer && answer === "Nucleus" ? " correct" : ""}`}
                    type="button"
                    role="radio"
                    aria-checked={selectedAnswer === answer}
                    key={answer}
                    onClick={() => setSelectedAnswer(answer)}
                  >
                    <span className="radio-dot" aria-hidden="true" />
                    {answer}
                  </button>
                ))}
              </div>
              <div className={`answer-result ${selectedAnswer === "Nucleus" ? "is-correct" : "try-again"}`} aria-live="polite">
                {selectedAnswer === "Nucleus" ? <Check size={20} /> : <X size={20} />}
                {selectedAnswer === "Nucleus" ? "Correct" : "Try again"}
              </div>
            </div>

            <div className="lesson-progress" aria-label="Lesson stages">
              <span className="progress-line" />
              <div><i /><span>Watch</span></div>
              <div><i /><span>Answer</span></div>
              <div><i /><span>Remember</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-card reveal">
          <div className="cta-copy">
            <p>Ready to start?</p>
            <h2>Unlock the Wonders of Biology</h2>
            <span>Join thousands of learners and take the next step in your biology journey.</span>
            <Link className="button button-primary" to="/courses">
              Start Learning Today <ArrowRight size={18} />
            </Link>
          </div>
          <div className="cta-instructor">
            <img src="/assets/cta-instructor-pointing.png" alt="Biology instructor pointing toward the invitation to start learning" />
          </div>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" />
            <div className="social-links" aria-label="Social media">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on Facebook">f</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on Instagram">◎</a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on YouTube">▶</a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on LinkedIn">in</a>
            </div>
          </div>

          <div className="footer-column">
            <h2>Quick Links</h2>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/about">About</Link>
            <Link to="/resources">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-column">
            <h2>Resources</h2>
            <Link to="/support">Help Center</Link>
            <Link to="/resources">Student Guide</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/legal/privacy">Privacy Policy</Link>
            <Link to="/legal/terms">Terms of Service</Link>
          </div>

          <div className="footer-subscribe">
            <h2>Subscribe</h2>
            <p>Get the latest updates and new courses.</p>
            <form onSubmit={submitNewsletter}>
              <label className="sr-only" htmlFor={newsletterId}>Your email address</label>
              <input
                id={newsletterId}
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  setNewsletterStatus("");
                }}
                required
              />
              <button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button>
            </form>
            {newsletterStatus && <p className="subscribe-status" role="status">{newsletterStatus}</p>}
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Biophlo. All rights reserved.</span>
          <span>Science today. A brighter tomorrow. <ShieldCheck size={17} /></span>
        </div>
      </footer>

      {activeDialog === "search" && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActiveDialog(null);
          }}
        >
          <section className="site-dialog home-search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
            <button
              className="dialog-close"
              type="button"
              ref={closeButtonRef}
              aria-label="Close search"
              onClick={() => setActiveDialog(null)}
            >
              <X size={22} />
            </button>
            <p className="mini-label">Explore BIOPHLO</p>
            <h2 id="search-dialog-title">What do you want to learn?</h2>
            <form onSubmit={submitSearch}>
              <label className="sr-only" htmlFor={searchId}>Search courses</label>
              <Search size={21} aria-hidden="true" />
              <input
                ref={searchInputRef}
                id={searchId}
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Try genetics, cells, ecology…"
              />
              <button className="button button-primary" type="submit">Search</button>
            </form>
          </section>
        </div>
      )}

      {activeDialog === "intro" && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActiveDialog(null);
          }}
        >
          <section className="site-dialog video-dialog" role="dialog" aria-modal="true" aria-labelledby="intro-dialog-title">
            <button
              ref={closeButtonRef}
              className="dialog-close"
              type="button"
              aria-label="Close introduction"
              onClick={() => setActiveDialog(null)}
            >
              <X size={22} />
            </button>
            <div className="dialog-video-frame">
              <img src="/assets/lesson-video.webp" alt="Dr. Ola introducing a cell-structure lesson" />
              <span><Play size={28} fill="currentColor" /></span>
            </div>
            <div className="dialog-copy">
              <p className="mini-label">BIOPHLO introduction</p>
              <h2 id="intro-dialog-title">See biology in action</h2>
              <p>Clear visual explanations, practical examples, and purposeful checks for understanding—one idea at a time.</p>
              <Link className="button button-primary" to="/videos" onClick={() => setActiveDialog(null)}>
                Browse Video Lessons <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
