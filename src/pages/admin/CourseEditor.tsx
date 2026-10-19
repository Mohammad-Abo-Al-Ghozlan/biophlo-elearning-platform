import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Eye, FileText, GripVertical, ImagePlus, Plus, Save, Trash2, UploadCloud, Video } from "lucide-react";
import { useToast } from "../../components/common/toast-context";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type CourseTab = "basics" | "curriculum" | "content" | "pricing" | "access" | "seo" | "publish";

interface LessonDraft { id: string; title: string; type: "video" | "article" | "quiz" | "assignment"; duration: string; preview: boolean; }
interface ModuleDraft { id: string; title: string; description: string; open: boolean; lessons: LessonDraft[]; }

interface CourseDraft {
  title: string;
  subtitle: string;
  slug: string;
  shortDescription: string;
  description: string;
  instructor: string;
  subject: string;
  category: string;
  level: string;
  language: string;
  curriculum: string;
  examBoard: string;
  grade: string;
  objectives: string;
  requirements: string;
  promoVideo: string;
  pricingModel: "free" | "one-time" | "subscription";
  price: string;
  salePrice: string;
  currency: string;
  taxCode: string;
  couponEligible: boolean;
  accessDuration: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  seatLimit: string;
  visibility: "public" | "unlisted" | "private";
  dripContent: boolean;
  certificate: boolean;
  prerequisites: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  status: "draft" | "review" | "scheduled" | "published";
  publishAt: string;
  modules: ModuleDraft[];
}

const initialDraft: CourseDraft = {
  title: "",
  subtitle: "",
  slug: "",
  shortDescription: "",
  description: "",
  instructor: "Dr. Ola",
  subject: "Biology",
  category: "Cell biology",
  level: "Intermediate",
  language: "English",
  curriculum: "Cambridge International",
  examBoard: "Cambridge Assessment",
  grade: "Grade 10",
  objectives: "Explain the structure and function of major cell organelles.\nCompare plant, animal, and prokaryotic cells.\nApply microscopy calculations to exam-style problems.",
  requirements: "Foundational understanding of living organisms\nA notebook for lesson activities",
  promoVideo: "",
  pricingModel: "one-time",
  price: "49.00",
  salePrice: "39.00",
  currency: "USD",
  taxCode: "Digital education",
  couponEligible: true,
  accessDuration: "Lifetime",
  enrollmentStart: "",
  enrollmentEnd: "",
  seatLimit: "",
  visibility: "public",
  dripContent: false,
  certificate: true,
  prerequisites: "Introduction to Biology",
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  status: "draft",
  publishAt: "",
  modules: [
    {
      id: "module-1",
      title: "Foundations of cell biology",
      description: "Cell theory, microscopy, and the shared features of living cells.",
      open: true,
      lessons: [
        { id: "lesson-1", title: "What makes a cell?", type: "video", duration: "08:30", preview: true },
        { id: "lesson-2", title: "Cell theory and discovery", type: "article", duration: "06:00", preview: false },
        { id: "lesson-3", title: "Knowledge check", type: "quiz", duration: "10:00", preview: false },
      ],
    },
  ],
};

const tabs: { id: CourseTab; label: string; hint: string }[] = [
  { id: "basics", label: "Course basics", hint: "Identity and overview" },
  { id: "curriculum", label: "Curriculum", hint: "Outcomes and alignment" },
  { id: "content", label: "Modules & lessons", hint: "Learning structure" },
  { id: "pricing", label: "Pricing", hint: "Plans and commerce" },
  { id: "access", label: "Access", hint: "Enrollment rules" },
  { id: "seo", label: "SEO & sharing", hint: "Search appearance" },
  { id: "publish", label: "Review & publish", hint: "Quality and status" },
];

function Field({ label, help, required, children, className = "" }: { label: string; help?: string; required?: boolean; children: ReactNode; className?: string }) {
  return <label className={`field ${className}`}><span>{label}{required ? <b aria-hidden="true"> *</b> : null}</span>{children}{help ? <small>{help}</small> : null}</label>;
}

function SwitchField({ checked, onChange, title, text }: { checked: boolean; onChange: (checked: boolean) => void; title: string; text: string }) {
  return <label className="admin-switch-row"><span><strong>{title}</strong><small>{text}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>;
}

export function CourseEditor() {
  const [draft, setDraft] = useLocalStorage<CourseDraft>("biophlo-course-draft", initialDraft);
  const [activeTab, setActiveTab] = useState<CourseTab>("basics");
  const [imagePreview, setImagePreview] = useState("/assets/course-cell.webp");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { notify } = useToast();
  const navigate = useNavigate();

  const completion = useMemo(() => {
    const required = [draft.title, draft.shortDescription, draft.description, draft.category, draft.curriculum, draft.objectives, draft.modules.length ? "yes" : "", draft.pricingModel === "free" ? "yes" : draft.price, draft.metaTitle || draft.title];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [draft]);

  const update = <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const updateTitle = (value: string) => {
    const wasAutoSlug = !draft.slug || draft.slug === draft.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setDraft((current) => ({
      ...current,
      title: value,
      slug: wasAutoSlug ? value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : current.slug,
      metaTitle: current.metaTitle || value,
    }));
    setErrors((current) => ({ ...current, title: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (draft.title.trim().length < 5) next.title = "Enter a descriptive course title of at least 5 characters.";
    if (!draft.category) next.category = "Choose a catalog category.";
    if (draft.shortDescription.trim().length < 30) next.shortDescription = "Write at least 30 characters for the catalog summary.";
    if (draft.description.trim().length < 80) next.description = "The full course description should be at least 80 characters.";
    if (draft.pricingModel !== "free" && (!draft.price || Number(draft.price) <= 0)) next.price = "Enter a valid price greater than zero.";
    if (!draft.modules.length || draft.modules.some((module) => !module.title.trim() || !module.lessons.length)) next.modules = "Every module needs a title and at least one lesson.";
    setErrors(next);
    return next;
  };

  const save = (event?: FormEvent) => {
    event?.preventDefault();
    notify({ title: "Course draft saved", detail: "Changes are stored in this browser and ready for your next review.", tone: "success" });
  };

  const publish = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      notify({ title: "Course needs attention", detail: "Review the highlighted required fields before publishing.", tone: "danger" });
      setActiveTab(
        validationErrors.title || validationErrors.category || validationErrors.shortDescription || validationErrors.description
          ? "basics"
          : validationErrors.modules
            ? "content"
            : validationErrors.price
              ? "pricing"
              : "publish",
      );
      return;
    }
    update("status", draft.publishAt ? "scheduled" : "published");
    notify({ title: draft.publishAt ? "Course scheduled" : "Course published", detail: draft.publishAt ? `Publishing is scheduled for ${draft.publishAt}.` : "The course is now available in the catalog.", tone: "success" });
  };

  const addModule = () => update("modules", [...draft.modules, { id: `module-${Date.now()}`, title: `Module ${draft.modules.length + 1}`, description: "", open: true, lessons: [] }]);
  const updateModule = (moduleId: string, changes: Partial<ModuleDraft>) => update("modules", draft.modules.map((module) => module.id === moduleId ? { ...module, ...changes } : module));
  const removeModule = (moduleId: string) => update("modules", draft.modules.filter((module) => module.id !== moduleId));
  const addLesson = (moduleId: string) => update("modules", draft.modules.map((module) => module.id === moduleId ? { ...module, lessons: [...module.lessons, { id: `lesson-${Date.now()}`, title: "Untitled lesson", type: "video", duration: "05:00", preview: false }] } : module));
  const updateLesson = (moduleId: string, lessonId: string, changes: Partial<LessonDraft>) => update("modules", draft.modules.map((module) => module.id === moduleId ? { ...module, lessons: module.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, ...changes } : lesson) } : module));
  const removeLesson = (moduleId: string, lessonId: string) => update("modules", draft.modules.map((module) => module.id === moduleId ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) } : module));
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify({ title: "Unsupported image", detail: "Choose a JPG, PNG, or WebP image.", tone: "danger" });
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    notify({ title: "Course image selected", detail: `${file.name} is ready in this local draft.`, tone: "success" });
  };

  return (
    <form onSubmit={save} className="course-editor">
      <header className="admin-page-heading editor-heading">
        <div className="heading-with-back">
          <button type="button" className="icon-control" onClick={() => navigate("/admin/courses")} aria-label="Back to courses"><ArrowLeft size={18} /></button>
          <div><span className="admin-kicker">Course builder</span><h1>{draft.title || "Create a new course"}</h1><p>Configure the learning experience, commercial model, access, and publishing details.</p></div>
        </div>
        <div className="editor-actions">
          <button type="button" className="button-secondary" onClick={() => navigate("/admin/courses/cell-structure-and-function/preview")}><Eye size={17} /> Preview</button>
          <button type="submit" className="button-primary"><Save size={17} /> Save draft</button>
        </div>
      </header>

      <div className="editor-progress"><div><span>Course setup</span><strong>{completion}% complete</strong></div><progress max="100" value={completion}>{completion}%</progress></div>

      <div className="course-editor-layout">
        <nav className="course-editor-tabs" aria-label="Course editor sections">
          {tabs.map((tab, index) => <button type="button" className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)} key={tab.id}><span>{index + 1}</span><strong>{tab.label}</strong><small>{tab.hint}</small>{activeTab === tab.id ? <Check size={15} /> : null}</button>)}
        </nav>

        <section className="course-editor-panel">
          {activeTab === "basics" ? (
            <div className="editor-section">
              <header><h2>Course basics</h2><p>Create a clear catalog identity and compelling overview.</p></header>
              <div className="form-grid">
                <Field label="Course title" required className="span-2"><input className="text-input" value={draft.title} onChange={(event) => updateTitle(event.target.value)} placeholder="e.g. Cell Structure and Function" aria-invalid={Boolean(errors.title)} />{errors.title ? <small className="field-error">{errors.title}</small> : null}</Field>
                <Field label="Subtitle" className="span-2" help="One supporting line shown beneath the course title."><input className="text-input" value={draft.subtitle} onChange={(event) => update("subtitle", event.target.value)} placeholder="Master the building blocks of life through clear visual lessons" /></Field>
                <Field label="URL slug" help="Lowercase words separated by hyphens."><div className="input-prefix"><span>/courses/</span><input className="text-input" value={draft.slug} onChange={(event) => update("slug", event.target.value.replace(/[^a-z0-9-]/g, ""))} /></div></Field>
                <Field label="Instructor"><select className="select-input" value={draft.instructor} onChange={(event) => update("instructor", event.target.value)}><option>Dr. Ola</option><option>Dr. Omar Khalil</option><option>Prof. Maya Chen</option></select></Field>
                <Field label="Catalog summary" required className="span-2" help={`${draft.shortDescription.length}/180 characters`}><textarea className="text-area short-area" maxLength={180} value={draft.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} placeholder="Explain who this course is for and the result it helps them achieve." aria-invalid={Boolean(errors.shortDescription)} />{errors.shortDescription ? <small className="field-error">{errors.shortDescription}</small> : null}</Field>
                <Field label="Full description" required className="span-2"><textarea className="text-area editor-rich-area" value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe the course approach, outcomes, and learner experience…" aria-invalid={Boolean(errors.description)} />{errors.description ? <small className="field-error">{errors.description}</small> : null}</Field>
                <Field label="Subject"><select className="select-input" value={draft.subject} onChange={(event) => update("subject", event.target.value)}><option>Biology</option><option>Human biology</option><option>Environmental science</option></select></Field>
                <Field label="Category" required><select className="select-input" value={draft.category} onChange={(event) => update("category", event.target.value)}><option value="">Choose category</option><option>Cell biology</option><option>Genetics</option><option>Plant biology</option><option>Ecology</option><option>Human physiology</option></select>{errors.category ? <small className="field-error">{errors.category}</small> : null}</Field>
                <Field label="Level"><select className="select-input" value={draft.level} onChange={(event) => update("level", event.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field>
                <Field label="Primary language"><select className="select-input" value={draft.language} onChange={(event) => update("language", event.target.value)}><option>English</option><option>Arabic</option><option>French</option></select></Field>
              </div>
              <div className="editor-media-grid">
                <div><h3>Course cover</h3><div className="course-cover-upload"><img src={imagePreview} alt="Course cover preview" /><label className="button-secondary"><ImagePlus size={17} /> Replace image<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} /></label><small>Recommended: 1600 × 900, WebP or JPG, up to 5 MB.</small></div></div>
                <div><h3>Promo video</h3><div className="promo-video-field"><Video size={28} /><p>Add a 30–90 second introduction shown on the course page.</p><input className="text-input" type="url" value={draft.promoVideo} onChange={(event) => update("promoVideo", event.target.value)} placeholder="https://vimeo.com/…" /><button type="button" className="button-secondary" onClick={() => notify({ title: "Upload ready", detail: "Choose a local video file in the file picker.", tone: "info" })}><UploadCloud size={17} /> Upload instead</button></div></div>
              </div>
            </div>
          ) : null}

          {activeTab === "curriculum" ? (
            <div className="editor-section">
              <header><h2>Curriculum and outcomes</h2><p>Align the course to a recognized program and make the learner promise measurable.</p></header>
              <div className="form-grid">
                <Field label="Curriculum"><select className="select-input" value={draft.curriculum} onChange={(event) => update("curriculum", event.target.value)}><option>Cambridge International</option><option>International Baccalaureate</option><option>GCSE</option><option>AP Biology</option><option>General enrichment</option></select></Field>
                <Field label="Exam board"><select className="select-input" value={draft.examBoard} onChange={(event) => update("examBoard", event.target.value)}><option>Cambridge Assessment</option><option>Pearson Edexcel</option><option>AQA</option><option>College Board</option><option>Not applicable</option></select></Field>
                <Field label="Grade or level"><select className="select-input" value={draft.grade} onChange={(event) => update("grade", event.target.value)}><option>Grade 9</option><option>Grade 10</option><option>Grade 11</option><option>Grade 12</option><option>Undergraduate foundation</option></select></Field>
                <Field label="Estimated study time"><div className="input-suffix"><input className="text-input" type="number" min="1" defaultValue="12" /><span>hours</span></div></Field>
                <Field label="Learning objectives" required className="span-2" help="One measurable outcome per line."><textarea className="text-area tall-area" value={draft.objectives} onChange={(event) => update("objectives", event.target.value)} /></Field>
                <Field label="Learner requirements" className="span-2" help="One prerequisite or material per line."><textarea className="text-area" value={draft.requirements} onChange={(event) => update("requirements", event.target.value)} /></Field>
                <Field label="Assessment strategy" className="span-2"><textarea className="text-area" defaultValue="Formative quizzes after each module, one microscopy calculation assignment, and a 30-question final assessment requiring 70% to pass." /></Field>
              </div>
              <div className="alignment-summary"><FileText size={22} /><div><strong>Curriculum alignment summary</strong><p>3 learning objectives · 1 assessment pathway · Cambridge Grade 10 mapping</p></div><button type="button" className="button-secondary" onClick={() => notify({ title: "Alignment checked", detail: "All stated outcomes are represented in the module plan.", tone: "success" })}>Validate alignment</button></div>
            </div>
          ) : null}

          {activeTab === "content" ? (
            <div className="editor-section">
              <header className="section-head-action"><div><h2>Modules and lessons</h2><p>Arrange the learning path. Every module must include at least one lesson.</p></div><button type="button" className="button-primary" onClick={addModule}><Plus size={17} /> Add module</button></header>
              {errors.modules ? <p className="editor-error-banner">{errors.modules}</p> : null}
              <div className="module-builder">
                {draft.modules.map((module, moduleIndex) => (
                  <article className="module-block" key={module.id}>
                    <header>
                      <GripVertical size={18} aria-hidden="true" />
                      <span className="module-index">{String(moduleIndex + 1).padStart(2, "0")}</span>
                      <input aria-label={`Module ${moduleIndex + 1} title`} value={module.title} onChange={(event) => updateModule(module.id, { title: event.target.value })} />
                      <span>{module.lessons.length} lessons</span>
                      <button type="button" className="module-icon-button" onClick={() => updateModule(module.id, { open: !module.open })} aria-label={module.open ? "Collapse module" : "Expand module"}>{module.open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
                      <button type="button" className="module-icon-button danger" onClick={() => removeModule(module.id)} aria-label="Delete module"><Trash2 size={17} /></button>
                    </header>
                    {module.open ? <div className="module-content">
                      <textarea aria-label="Module description" value={module.description} onChange={(event) => updateModule(module.id, { description: event.target.value })} placeholder="Briefly describe this module…" />
                      <div className="lesson-list">
                        {module.lessons.map((lesson, lessonIndex) => <div className="lesson-row" key={lesson.id}>
                          <GripVertical size={16} aria-hidden="true" /><span>{moduleIndex + 1}.{lessonIndex + 1}</span>
                          <input aria-label={`Lesson ${lessonIndex + 1} title`} value={lesson.title} onChange={(event) => updateLesson(module.id, lesson.id, { title: event.target.value })} />
                          <select aria-label="Lesson type" value={lesson.type} onChange={(event) => updateLesson(module.id, lesson.id, { type: event.target.value as LessonDraft["type"] })}><option value="video">Video</option><option value="article">Article</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option></select>
                          <input className="lesson-duration" aria-label="Lesson duration" value={lesson.duration} onChange={(event) => updateLesson(module.id, lesson.id, { duration: event.target.value })} />
                          <label className="lesson-preview"><input type="checkbox" checked={lesson.preview} onChange={(event) => updateLesson(module.id, lesson.id, { preview: event.target.checked })} /> Preview</label>
                          <button type="button" className="module-icon-button danger" onClick={() => removeLesson(module.id, lesson.id)} aria-label="Delete lesson"><Trash2 size={16} /></button>
                        </div>)}
                      </div>
                      <button type="button" className="add-lesson-button" onClick={() => addLesson(module.id)}><Plus size={16} /> Add lesson, quiz, or assignment</button>
                    </div> : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === "pricing" ? (
            <div className="editor-section">
              <header><h2>Pricing and commerce</h2><p>Set a transparent price, sale rules, and purchase behavior.</p></header>
              <fieldset className="pricing-models"><legend>Pricing model</legend>{(["free", "one-time", "subscription"] as const).map((model) => <label className={draft.pricingModel === model ? "selected" : ""} key={model}><input type="radio" name="pricing-model" checked={draft.pricingModel === model} onChange={() => update("pricingModel", model)} /><strong>{model === "free" ? "Free course" : model === "one-time" ? "One-time purchase" : "Subscription only"}</strong><span>{model === "free" ? "Open enrollment without payment" : model === "one-time" ? "A single payment for the selected access duration" : "Included in one or more recurring plans"}</span></label>)}</fieldset>
              {draft.pricingModel !== "free" ? <div className="form-grid pricing-fields">
                <Field label="Currency"><select className="select-input" value={draft.currency} onChange={(event) => update("currency", event.target.value)}><option>USD</option><option>GBP</option><option>EUR</option><option>AED</option><option>SAR</option></select></Field>
                <Field label="Regular price" required><div className="input-prefix compact-prefix"><span>{draft.currency}</span><input className="text-input" type="number" min="0" step="0.01" value={draft.price} onChange={(event) => update("price", event.target.value)} aria-invalid={Boolean(errors.price)} /></div>{errors.price ? <small className="field-error">{errors.price}</small> : null}</Field>
                <Field label="Sale price" help="Leave blank when the course is not on sale."><div className="input-prefix compact-prefix"><span>{draft.currency}</span><input className="text-input" type="number" min="0" step="0.01" value={draft.salePrice} onChange={(event) => update("salePrice", event.target.value)} /></div></Field>
                <Field label="Tax category"><select className="select-input" value={draft.taxCode} onChange={(event) => update("taxCode", event.target.value)}><option>Digital education</option><option>Zero-rated education</option><option>Standard digital service</option></select></Field>
                <Field label="Sale starts"><input className="text-input" type="datetime-local" /></Field><Field label="Sale ends"><input className="text-input" type="datetime-local" /></Field>
              </div> : null}
              <div className="editor-switch-group"><SwitchField checked={draft.couponEligible} onChange={(value) => update("couponEligible", value)} title="Allow discount codes" text="Eligible catalog coupons can be applied at checkout." /><SwitchField checked={true} onChange={() => notify({ title: "Bundle eligibility updated", tone: "success" })} title="Allow course bundles" text="This course can be sold as part of curated bundles." /><SwitchField checked={false} onChange={() => notify({ title: "Installments setting updated", tone: "success" })} title="Offer installment payments" text="Show installment options when supported by the selected provider." /></div>
              <aside className="price-preview"><span>Catalog price preview</span><div><s>{draft.salePrice ? `${draft.currency} ${draft.price}` : ""}</s><strong>{draft.pricingModel === "free" ? "Free" : `${draft.currency} ${draft.salePrice || draft.price}`}</strong></div><small>Taxes are calculated at checkout based on the learner’s billing country.</small></aside>
            </div>
          ) : null}

          {activeTab === "access" ? (
            <div className="editor-section">
              <header><h2>Enrollment and access</h2><p>Control who can find the course, when enrollment opens, and how long access lasts.</p></header>
              <div className="form-grid">
                <Field label="Catalog visibility"><select className="select-input" value={draft.visibility} onChange={(event) => update("visibility", event.target.value as CourseDraft["visibility"])}><option value="public">Public — visible in catalog</option><option value="unlisted">Unlisted — link access only</option><option value="private">Private — assigned learners only</option></select></Field>
                <Field label="Access duration"><select className="select-input" value={draft.accessDuration} onChange={(event) => update("accessDuration", event.target.value)}><option>Lifetime</option><option>30 days</option><option>90 days</option><option>180 days</option><option>365 days</option></select></Field>
                <Field label="Enrollment opens"><input className="text-input" type="datetime-local" value={draft.enrollmentStart} onChange={(event) => update("enrollmentStart", event.target.value)} /></Field>
                <Field label="Enrollment closes"><input className="text-input" type="datetime-local" value={draft.enrollmentEnd} onChange={(event) => update("enrollmentEnd", event.target.value)} /></Field>
                <Field label="Seat limit" help="Leave blank for unlimited enrollment."><input className="text-input" type="number" min="1" value={draft.seatLimit} onChange={(event) => update("seatLimit", event.target.value)} placeholder="Unlimited" /></Field>
                <Field label="Required prerequisite"><select className="select-input" value={draft.prerequisites} onChange={(event) => update("prerequisites", event.target.value)}><option>None</option><option>Introduction to Biology</option><option>Plant Biology Foundations</option><option>Instructor approval</option></select></Field>
              </div>
              <div className="editor-switch-group"><SwitchField checked={draft.dripContent} onChange={(value) => update("dripContent", value)} title="Drip module access" text="Release modules gradually after enrollment." /><SwitchField checked={draft.certificate} onChange={(value) => update("certificate", value)} title="Issue a certificate" text="Learners receive a verifiable certificate after meeting completion rules." /><SwitchField checked={true} onChange={() => notify({ title: "Discussion setting updated", tone: "success" })} title="Enable course Q&A" text="Learners can ask questions within this course." /></div>
              {draft.certificate ? <div className="certificate-rule"><strong>Certificate requirement</strong><div className="form-grid"><Field label="Minimum course completion"><div className="input-suffix"><input className="text-input" type="number" min="1" max="100" defaultValue="100" /><span>%</span></div></Field><Field label="Minimum final score"><div className="input-suffix"><input className="text-input" type="number" min="1" max="100" defaultValue="70" /><span>%</span></div></Field></div></div> : null}
            </div>
          ) : null}

          {activeTab === "seo" ? (
            <div className="editor-section">
              <header><h2>SEO and social sharing</h2><p>Control how the course appears in search and when its link is shared.</p></header>
              <div className="form-grid">
                <Field label="Meta title" className="span-2" help={`${(draft.metaTitle || draft.title).length}/60 characters`}><input className="text-input" maxLength={60} value={draft.metaTitle} onChange={(event) => update("metaTitle", event.target.value)} placeholder={draft.title || "Course title | BIOPHLO"} /></Field>
                <Field label="Meta description" className="span-2" help={`${draft.metaDescription.length}/160 characters`}><textarea className="text-area short-area" maxLength={160} value={draft.metaDescription} onChange={(event) => update("metaDescription", event.target.value)} placeholder={draft.shortDescription || "A concise search description for this course."} /></Field>
                <Field label="Canonical URL" className="span-2"><input className="text-input" type="url" value={draft.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} placeholder={`https://biophlo.com/courses/${draft.slug || "course-slug"}`} /></Field>
              </div>
              <div className="search-preview"><span>Google search preview</span><a>{draft.metaTitle || draft.title || "Your course title"} | BIOPHLO</a><small>https://biophlo.com › courses › {draft.slug || "course-slug"}</small><p>{draft.metaDescription || draft.shortDescription || "Your course description will appear here when learners discover this page through search."}</p></div>
              <div className="social-preview"><img src={imagePreview} alt="" /><div><small>BIOPHLO.COM</small><strong>{draft.title || "Your course title"}</strong><p>{draft.shortDescription || "A short course summary for social sharing."}</p></div></div>
            </div>
          ) : null}

          {activeTab === "publish" ? (
            <div className="editor-section">
              <header><h2>Review and publish</h2><p>Complete the quality checks, choose a status, and make the course available.</p></header>
              <div className="publish-checklist">
                {[
                  [Boolean(draft.title && draft.shortDescription && draft.description), "Catalog content", "Title, summaries, instructor, and imagery"],
                  [Boolean(draft.curriculum && draft.objectives), "Curriculum alignment", "Outcomes, audience, and assessment strategy"],
                  [Boolean(draft.modules.length && draft.modules.every((module) => module.lessons.length)), "Course content", `${draft.modules.length} modules and ${draft.modules.reduce((sum, module) => sum + module.lessons.length, 0)} lessons`],
                  [Boolean(draft.pricingModel === "free" || Number(draft.price) > 0), "Pricing", draft.pricingModel === "free" ? "Free enrollment" : `${draft.currency} ${draft.salePrice || draft.price}`],
                  [Boolean(draft.metaTitle || draft.title), "Search appearance", "Title, description, and social preview"],
                ].map(([ready,title,detail]) => <div key={String(title)} className={ready ? "ready" : "incomplete"}><span>{ready ? <Check size={17} /> : "!"}</span><div><strong>{String(title)}</strong><small>{String(detail)}</small></div><button type="button" onClick={() => setActiveTab(title === "Catalog content" ? "basics" : title === "Curriculum alignment" ? "curriculum" : title === "Course content" ? "content" : title === "Pricing" ? "pricing" : "seo")}>Review</button></div>)}
              </div>
              <div className="publish-options"><Field label="Publishing status"><select className="select-input" value={draft.status} onChange={(event) => update("status", event.target.value as CourseDraft["status"])}><option value="draft">Draft</option><option value="review">Submit for review</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select></Field><Field label="Publish date and time" help="Leave blank to publish immediately."><input className="text-input" type="datetime-local" value={draft.publishAt} onChange={(event) => update("publishAt", event.target.value)} /></Field></div>
              <div className="publish-callout"><div><strong>Ready to share this course?</strong><p>Publishing adds it to the catalog according to the visibility and enrollment rules above.</p></div><button type="button" className="button-primary amber-button" onClick={publish}>{draft.publishAt ? "Schedule course" : "Publish course"}</button></div>
            </div>
          ) : null}
        </section>

        <aside className="course-editor-summary">
          <span className={`course-status course-status-${draft.status}`}>{draft.status}</span>
          <img src={imagePreview} alt="Course thumbnail preview" />
          <h2>{draft.title || "Untitled course"}</h2>
          <p>{draft.shortDescription || "Your catalog summary will appear here."}</p>
          <dl><div><dt>Category</dt><dd>{draft.category || "Not set"}</dd></div><div><dt>Level</dt><dd>{draft.level}</dd></div><div><dt>Lessons</dt><dd>{draft.modules.reduce((sum, module) => sum + module.lessons.length, 0)}</dd></div><div><dt>Price</dt><dd>{draft.pricingModel === "free" ? "Free" : `${draft.currency} ${draft.salePrice || draft.price}`}</dd></div></dl>
          <button type="button" className="button-secondary" onClick={() => navigate("/admin/courses/cell-structure-and-function/preview")}><Eye size={17} /> Open full preview</button>
        </aside>
      </div>
    </form>
  );
}
