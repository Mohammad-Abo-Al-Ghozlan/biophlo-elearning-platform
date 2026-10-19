import type { LucideIcon } from "lucide-react";
import {
  Award,
  Bell,
  BookMarked,
  BookOpen,
  CircleHelp,
  CreditCard,
  Gauge,
  GraduationCap,
  Library,
  LockKeyhole,
  MessageCircleMore,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";

export type StudentNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  match?: string[];
};

export type StudentNavGroup = {
  label: string;
  items: StudentNavItem[];
};

export const studentNavigation: StudentNavGroup[] = [
  {
    label: "Study",
    items: [
      { label: "Overview", path: "/student", icon: Gauge, match: ["student-home"] },
      {
        label: "My courses",
        path: "/student/courses",
        icon: BookOpen,
        match: ["student-courses", "student-course-details", "course-modules", "course-player"],
      },
      { label: "Saved resources", path: "/student/saved", icon: Library, match: ["saved-resources"] },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "Progress", path: "/student/progress", icon: GraduationCap, match: ["progress-results", "attempts-scores"] },
      { label: "Achievements", path: "/student/achievements", icon: Sparkles, match: ["achievements"] },
      { label: "Certificates", path: "/student/certificates", icon: Award, match: ["certificates", "certificate-details"] },
    ],
  },
  {
    label: "Connect",
    items: [
      { label: "Announcements", path: "/student/announcements", icon: Bell, badge: "3", match: ["announcements", "notifications"] },
      { label: "Course Q&A", path: "/student/qa", icon: CircleHelp, match: ["course-qa"] },
      { label: "Messages", path: "/student/messages", icon: MessageCircleMore, badge: "2", match: ["messages"] },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", path: "/student/profile", icon: UserRound, match: ["student-profile"] },
      { label: "Preferences", path: "/student/preferences", icon: Settings2, match: ["learning-preferences"] },
      { label: "Security", path: "/student/security", icon: LockKeyhole, match: ["security-devices", "two-factor-setup", "active-sessions"] },
      { label: "Billing", path: "/student/billing", icon: CreditCard, match: ["orders-billing", "invoice-details", "subscription"] },
      { label: "Support", path: "/student/support", icon: BookMarked, match: ["support-requests", "support-request-details"] },
    ],
  },
];

export type CourseStatus = "In progress" | "Completed" | "Not started";

export type Course = {
  id: string;
  title: string;
  subject: string;
  level: string;
  instructor: string;
  image: string;
  progress: number;
  status: CourseStatus;
  lessons: number;
  duration: string;
  nextLesson: string;
  lastActive: string;
  accent: string;
};

export const courses: Course[] = [
  {
    id: "cell-structure-and-function",
    title: "Cell Structure and Function",
    subject: "Cell biology",
    level: "Advanced",
    instructor: "Dr. Ola",
    image: "/assets/course-cell.webp",
    progress: 68,
    status: "In progress",
    lessons: 24,
    duration: "8h 40m",
    nextLesson: "The plasma membrane",
    lastActive: "Today",
    accent: "#087f89",
  },
  {
    id: "genetics-inheritance",
    title: "Genetics and Inheritance",
    subject: "Genetics",
    level: "Intermediate",
    instructor: "Dr. Ola",
    image: "/assets/course-genetics.webp",
    progress: 42,
    status: "In progress",
    lessons: 19,
    duration: "6h 15m",
    nextLesson: "Punnett squares",
    lastActive: "Yesterday",
    accent: "#f2a72d",
  },
  {
    id: "plant-biology",
    title: "Introduction to Plant Biology",
    subject: "Botany",
    level: "Beginner",
    instructor: "Dr. Ola",
    image: "/assets/course-plant.webp",
    progress: 100,
    status: "Completed",
    lessons: 16,
    duration: "5h 05m",
    nextLesson: "Review course",
    lastActive: "6 Sep 2026",
    accent: "#48b8ad",
  },
  {
    id: "human-physiology",
    title: "Human Physiology Essentials",
    subject: "Physiology",
    level: "Intermediate",
    instructor: "Dr. Lina Karam",
    image: "/assets/lesson-video.webp",
    progress: 0,
    status: "Not started",
    lessons: 21,
    duration: "7h 30m",
    nextLesson: "Welcome and course map",
    lastActive: "Not started",
    accent: "#144f68",
  },
];

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  completed: boolean;
  locked?: boolean;
  summary?: string;
};

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  completed: number;
  lessons: Lesson[];
};

export const courseModules: CourseModule[] = [
  {
    id: "foundations",
    title: "Foundations of cell biology",
    summary: "Build a precise vocabulary for examining life at the cellular scale.",
    completed: 4,
    lessons: [
      { id: "welcome", title: "Welcome and course map", duration: "04:12", type: "video", completed: true },
      { id: "cell-theory", title: "Modern cell theory", duration: "11:08", type: "video", completed: true },
      { id: "scale", title: "Scale and microscopy", duration: "8 min", type: "reading", completed: true },
      { id: "foundations-check", title: "Foundations knowledge check", duration: "8 questions", type: "quiz", completed: true },
    ],
  },
  {
    id: "cell-anatomy",
    title: "Inside the cell",
    summary: "Connect each organelle's structure to the work it performs.",
    completed: 3,
    lessons: [
      { id: "organelles", title: "Organelles at work", duration: "14:35", type: "video", completed: true },
      { id: "nucleus", title: "The nucleus and genetic control", duration: "12:18", type: "video", completed: true },
      { id: "membrane", title: "The plasma membrane", duration: "16:42", type: "video", completed: true, summary: "Explore the fluid mosaic model and selective permeability." },
      { id: "transport", title: "Transport across membranes", duration: "18:04", type: "video", completed: false },
      { id: "cell-lab", title: "Interactive cell lab", duration: "20 min", type: "reading", completed: false },
      { id: "anatomy-check", title: "Cell anatomy assessment", duration: "12 questions", type: "quiz", completed: false },
    ],
  },
  {
    id: "energy",
    title: "Energy and cellular processes",
    summary: "Trace how cells capture, transform, and use energy.",
    completed: 0,
    lessons: [
      { id: "atp", title: "ATP: the cell's energy currency", duration: "13:22", type: "video", completed: false },
      { id: "respiration", title: "Cellular respiration", duration: "21:10", type: "video", completed: false },
      { id: "photosynthesis", title: "Photosynthesis", duration: "19:44", type: "video", completed: false },
      { id: "energy-check", title: "Energy pathways assessment", duration: "15 questions", type: "quiz", completed: false },
    ],
  },
  {
    id: "division",
    title: "Cell growth and division",
    summary: "Understand the cell cycle, mitosis, and the control of cell growth.",
    completed: 0,
    lessons: [
      { id: "cycle", title: "The cell cycle", duration: "16:05", type: "video", completed: false, locked: true },
      { id: "mitosis", title: "Mitosis step by step", duration: "17:31", type: "video", completed: false, locked: true },
      { id: "cancer", title: "When cell control fails", duration: "9 min", type: "reading", completed: false, locked: true },
      { id: "final", title: "Final course assessment", duration: "25 questions", type: "quiz", completed: false, locked: true },
    ],
  },
];

export const transcript = [
  { time: "00:00", text: "Every cell is surrounded by a boundary that is far more dynamic than it first appears." },
  { time: "00:18", text: "The plasma membrane separates the cell from its surroundings while controlling what enters and leaves." },
  { time: "01:06", text: "Its structure is described by the fluid mosaic model: a flexible phospholipid bilayer with embedded proteins." },
  { time: "02:24", text: "The hydrophilic heads face water, while hydrophobic tails turn inward, away from water." },
  { time: "03:42", text: "Membrane proteins act as channels, carriers, receptors, enzymes, and anchors." },
  { time: "05:10", text: "This selective permeability lets the cell maintain conditions needed for life." },
];

export const weeklyActivity = [
  { day: "Mon", minutes: 42 },
  { day: "Tue", minutes: 68 },
  { day: "Wed", minutes: 34 },
  { day: "Thu", minutes: 82 },
  { day: "Fri", minutes: 55 },
  { day: "Sat", minutes: 105 },
  { day: "Sun", minutes: 26 },
];

export const attempts = [
  { assessment: "Cell anatomy assessment", course: "Cell Structure and Function", score: 92, questions: "11 / 12", date: "10 Sep 2026", time: "08:42", status: "Passed" },
  { assessment: "Foundations knowledge check", course: "Cell Structure and Function", score: 88, questions: "7 / 8", date: "7 Sep 2026", time: "05:18", status: "Passed" },
  { assessment: "Mendelian inheritance quiz", course: "Genetics and Inheritance", score: 76, questions: "10 / 13", date: "2 Sep 2026", time: "11:05", status: "Passed" },
  { assessment: "DNA structure quick check", course: "Genetics and Inheritance", score: 64, questions: "7 / 11", date: "29 Aug 2026", time: "09:36", status: "Review" },
  { assessment: "Plant tissues assessment", course: "Introduction to Plant Biology", score: 96, questions: "24 / 25", date: "18 Aug 2026", time: "17:22", status: "Passed" },
];

export const badges = [
  { name: "Cell Explorer", detail: "Completed the cell foundations module", icon: "🧫", earned: true, date: "7 Sep 2026", color: "teal" },
  { name: "Seven-day rhythm", detail: "Learned for seven days in a row", icon: "🔥", earned: true, date: "5 Sep 2026", color: "amber" },
  { name: "Quiz precision", detail: "Scored 90% or above on an assessment", icon: "🎯", earned: true, date: "10 Sep 2026", color: "blue" },
  { name: "Curious mind", detail: "Asked five thoughtful course questions", icon: "💬", earned: true, date: "30 Aug 2026", color: "violet" },
  { name: "Course finisher", detail: "Complete three BIOPHLO courses", icon: "🏁", earned: false, progress: 67, color: "teal" },
  { name: "Study marathon", detail: "Reach 25 hours of focused study", icon: "⏱️", earned: false, progress: 72, color: "amber" },
  { name: "Perfect score", detail: "Score 100% on a graded assessment", icon: "💯", earned: false, progress: 92, color: "blue" },
  { name: "Helpful peer", detail: "Have an answer endorsed by an instructor", icon: "🤝", earned: false, progress: 40, color: "violet" },
];

export const announcements = [
  { id: 1, title: "Live revision clinic this Saturday", category: "Live session", date: "11 Sep 2026", author: "Dr. Ola", excerpt: "Bring your questions on membranes, transport, and cell signaling. The one-hour clinic includes a worked exam question.", important: true, unread: true },
  { id: 2, title: "New diagrams added to module two", category: "Course update", date: "9 Sep 2026", author: "BIOPHLO Learning Team", excerpt: "Downloadable organelle maps and a membrane transport comparison sheet are now available in resources.", important: false, unread: true },
  { id: 3, title: "September study challenge", category: "Community", date: "1 Sep 2026", author: "BIOPHLO Community", excerpt: "Complete four focused sessions each week to unlock the limited Study Rhythm badge.", important: false, unread: true },
  { id: 4, title: "Scheduled platform maintenance complete", category: "Platform", date: "28 Aug 2026", author: "BIOPHLO Support", excerpt: "Video playback and saved notes are operating normally following the planned maintenance window.", important: false, unread: false },
];

export type Question = {
  id: number;
  title: string;
  body: string;
  lesson: string;
  author: string;
  answers: number;
  votes: number;
  solved: boolean;
  date: string;
};

export const initialQuestions: Question[] = [
  { id: 1, title: "Why can cholesterol both stabilize and fluidize the membrane?", body: "I understand each effect separately, but how can the same molecule do both depending on temperature?", lesson: "The plasma membrane", author: "Maya Nasser", answers: 3, votes: 18, solved: true, date: "2h ago" },
  { id: 2, title: "Is facilitated diffusion always faster than simple diffusion?", body: "Does the presence of carrier proteins guarantee a faster transport rate?", lesson: "Transport across membranes", author: "Omar Haddad", answers: 2, votes: 9, solved: true, date: "Yesterday" },
  { id: 3, title: "How should I label cristae in the exam diagram?", body: "Would the examiner accept inner membrane folds, or does the exact term matter?", lesson: "Organelles at work", author: "Layla Hassan", answers: 1, votes: 7, solved: false, date: "2 days ago" },
  { id: 4, title: "Mnemonic for the stages of mitosis", body: "Does anyone have a good way to remember the sequence and the key event in each stage?", lesson: "Mitosis step by step", author: "Zaid Rahal", answers: 5, votes: 23, solved: false, date: "4 days ago" },
];

export const conversations = [
  { id: "ola", name: "Dr. Ola", role: "Course instructor", avatar: "OA", preview: "Your reasoning is strong—look again at how...", time: "10:24", unread: 2, online: true },
  { id: "support", name: "BIOPHLO Support", role: "Learner support", avatar: "BS", preview: "We have attached the updated invoice.", time: "Yesterday", unread: 0, online: true },
  { id: "study", name: "Cell Biology study circle", role: "6 learners", avatar: "CB", preview: "Maya: I shared my membrane diagram.", time: "Tue", unread: 0, online: false },
];

export const initialChat = [
  { id: 1, sender: "them", text: "Hi Layla — I reviewed your answer on selective permeability. You identified the right factors.", time: "09:54" },
  { id: 2, sender: "me", text: "Thank you! I’m still unsure how molecule polarity relates to the phospholipid bilayer.", time: "10:07" },
  { id: 3, sender: "them", text: "Your reasoning is strong—look again at how the hydrophobic interior interacts with polar molecules. What would happen without a protein channel?", time: "10:24" },
];

export const initialNotifications = [
  { id: 1, kind: "course", title: "New lesson available", detail: "Transport across membranes is ready in Cell Structure and Function.", time: "18 min ago", unread: true },
  { id: 2, kind: "answer", title: "Dr. Ola answered your question", detail: "Your question about carrier saturation has a new instructor response.", time: "2h ago", unread: true },
  { id: 3, kind: "achievement", title: "You earned Quiz precision", detail: "A score above 90% unlocked a new badge.", time: "Yesterday", unread: true },
  { id: 4, kind: "billing", title: "Payment receipt available", detail: "Your receipt for BIOPHLO Plus is ready to download.", time: "3 days ago", unread: false },
  { id: 5, kind: "reminder", title: "Keep your learning rhythm", detail: "A 20-minute session today will preserve your seven-day streak.", time: "5 days ago", unread: false },
];

export const orders = [
  { id: "BIO-10482", date: "1 Sep 2026", item: "BIOPHLO Plus — annual", total: "$119.00", status: "Paid", method: "Visa •••• 4821" },
  { id: "BIO-09817", date: "14 Mar 2026", item: "Genetics exam preparation", total: "$34.00", status: "Paid", method: "Visa •••• 4821" },
  { id: "BIO-08129", date: "3 Jan 2026", item: "Plant Biology complete course", total: "$29.00", status: "Refunded", method: "Mastercard •••• 1963" },
];

export const savedResources = [
  { id: 1, type: "Study guide", title: "Cell division: visual study guide", topic: "Cell biology", detail: "18 pages · PDF", date: "Saved 10 Sep", color: "teal" },
  { id: 2, type: "Diagram", title: "Plasma membrane annotated map", topic: "Cell biology", detail: "High-resolution · PNG", date: "Saved 8 Sep", color: "blue" },
  { id: 3, type: "Video", title: "Osmosis in five minutes", topic: "Cell transport", detail: "05:14 · Captions", date: "Saved 4 Sep", color: "amber" },
  { id: 4, type: "Past paper", title: "AQA Biology Paper 1 — 2025", topic: "Exam practice", detail: "Paper + mark scheme", date: "Saved 1 Sep", color: "violet" },
  { id: 5, type: "Worksheet", title: "Mitosis sequencing practice", topic: "Cell division", detail: "12 questions · PDF", date: "Saved 29 Aug", color: "teal" },
  { id: 6, type: "Article", title: "Why cells stay small", topic: "Cell biology", detail: "8 min read", date: "Saved 20 Aug", color: "blue" },
];

export const supportTickets = [
  { id: "BIO-2847", subject: "Captions out of sync in lesson 2.3", category: "Course content", status: "Waiting for you", updated: "Today, 09:32", created: "9 Sep 2026", priority: "Normal" },
  { id: "BIO-2714", subject: "Invoice needs my school address", category: "Billing", status: "Resolved", updated: "2 Sep 2026", created: "30 Aug 2026", priority: "Normal" },
  { id: "BIO-2598", subject: "Progress did not sync after quiz", category: "Technical", status: "Resolved", updated: "18 Aug 2026", created: "17 Aug 2026", priority: "High" },
];

export const profileDefaults = {
  firstName: "Layla",
  lastName: "Hassan",
  email: "layla.hassan@example.com",
  phone: "+961 70 555 014",
  country: "Lebanon",
  city: "Beirut",
  school: "Beirut International College",
  grade: "Grade 11",
  bio: "Biology learner preparing for A-level exams. Especially interested in genetics and cell biology.",
};

export const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}h ${remainder}m` : `${remainder}m`;
};

