import { uid } from "@/lib/utils";
import type { Subject } from "@/store/types";

interface PaperSeed {
  name: string;
  chapters: string[];
}

interface SubjectSeed {
  name: string;
  color: string;
  papers: PaperSeed[];
}

/**
 * Default NCTB HSC Science syllabus (factual curriculum structure).
 * Chapter names shown bilingual: English · বাংলা
 */
const SEED: SubjectSeed[] = [
  {
    name: "Physics",
    color: "#10b981",
    papers: [
      {
        name: "1st Paper",
        chapters: [
          "Physical World & Measurement · ভৌত জগৎ ও পরিমাপ",
          "Vectors · ভেক্টর",
          "Kinematics · গতিবিদ্যা",
          "Newtonian Mechanics · নিউটনীয় বলবিদ্যা",
          "Work, Energy & Power · কাজ, শক্তি ও ক্ষমতা",
          "Gravitation & Gravity · মহাকর্ষ ও অভিকর্ষ",
          "Structural Properties of Matter · পদার্থের গাঠনিক ধর্ম",
          "Periodic Motion · পর্যাবৃত্ত গতি",
          "Waves · তরঙ্গ",
          "Ideal Gas & Kinetic Theory · আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব",
        ],
      },
      {
        name: "2nd Paper",
        chapters: [
          "Thermodynamics · তাপগতিবিদ্যা",
          "Static Electricity · স্থির তড়িৎ",
          "Current Electricity · চল তড়িৎ",
          "Electromagnetic Induction & AC · তড়িচ্চুম্বক আবেশ ও পর্যাবৃত্ত প্রবাহ",
          "Intro to Modern Physics · আধুনিক পদার্থবিজ্ঞানের সূচনা",
          "Atomic Models & Nuclear Physics · পরমাণুর মডেল ও নিউক্লীয় পদার্থবিজ্ঞান",
          "Semiconductors & Electronics · সেমিকন্ডাক্টর ও ইলেকট্রনিক্স",
          "Physical Optics · ভৌত আলোকবিজ্ঞান",
          "Geometrical Optics · জ্যামিতিক আলোকবিজ্ঞান",
        ],
      },
    ],
  },
  {
    name: "Chemistry",
    color: "#38bdf8",
    papers: [
      {
        name: "1st Paper",
        chapters: [
          "Safe Use of Laboratory · ল্যাবরেটরির নিরাপদ ব্যবহার",
          "Qualitative Chemistry · গুণগত রসায়ন",
          "Periodic Properties & Chemical Bonding · মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন",
          "Chemical Changes · রাসায়নিক পরিবর্তন",
          "Applied Chemistry · কর্মমুখী রসায়ন",
        ],
      },
      {
        name: "2nd Paper",
        chapters: [
          "Environmental Chemistry · পরিবেশ রসায়ন",
          "Organic Chemistry · জৈব রসায়ন",
          "Quantitative Chemistry · পরিমাণগত রসায়ন",
          "Electrochemistry · তড়িৎ রসায়ন",
          "Economic Chemistry · অর্থনৈতিক রসায়ন",
        ],
      },
    ],
  },
  {
    name: "Higher Math",
    color: "#8b5cf6",
    papers: [
      {
        name: "1st Paper",
        chapters: [
          "Matrices & Determinants · ম্যাট্রিক্স ও নির্ণায়ক",
          "Vectors · ভেক্টর",
          "Straight Lines · সরলরেখা",
          "Circles · বৃত্ত",
          "Permutations & Combinations · বিন্যাস ও সমাবেশ",
          "Trigonometric Ratios · ত্রিকোণমিতিক অনুপাত",
          "Compound & Associated Angles · যৌগিক ও সংযুক্ত কোণের অনুপাত",
          "Functions & Graphs · ফাংশন ও ফাংশনের লেখচিত্র",
          "Differentiation · অন্তরীকরণ",
          "Integration · যোগজীকরণ",
        ],
      },
      {
        name: "2nd Paper",
        chapters: [
          "Complex Numbers · জটিল সংখ্যা",
          "Polynomials & Equations · বহুপদ ও বহুপদ সমীকরণ",
          "Conics · কণিক",
          "Inverse Trig Functions & Equations · বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ",
          "Statics · স্থিতিবিদ্যা",
          "Particle Dynamics · সমতলে বস্তুকণার গতি",
          "Dispersion & Probability · বিচ্ছুরণ ও সম্ভাবনা",
        ],
      },
    ],
  },
  {
    name: "Biology",
    color: "#84cc16",
    papers: [
      {
        name: "1st Paper",
        chapters: [
          "Cell & Its Structure · কোষ ও এর গঠন",
          "Cell Division · কোষ বিভাজন",
          "Cell Chemistry · কোষ রসায়ন",
          "Microorganisms · অণুজীব",
          "Algae & Fungi · শৈবাল ও ছত্রাক",
          "Bryophyta & Pteridophyta · ব্রায়োফাইটা ও টেরিডোফাইটা",
          "Gymnosperms & Angiosperms · নগ্নবীজী ও আবৃতবীজী উদ্ভিদ",
          "Tissue & Tissue System · টিস্যু ও টিস্যুতন্ত্র",
          "Plant Physiology · উদ্ভিদ শারীরস্থান",
          "Plant Reproduction · উদ্ভিদ প্রজনন",
          "Biotechnology · প্রাণপ্রযুক্তি",
          "Environment & Conservation · জীবের পরিবেশ ও সংরক্ষণ",
        ],
      },
      {
        name: "2nd Paper",
        chapters: [
          "Animal Diversity & Classification · প্রাণীর বিভিন্নতা ও শ্রেণীবিন্যাস",
          "Introduction to Animals · প্রাণীর পরিচিতি",
          "Digestion & Absorption · পরিপাক ও শোষণ",
          "Blood & Circulation · রক্ত ও সঞ্চালন",
          "Respiration · শ্বাসক্রিয়া ও শ্বসন",
          "Excretion · বর্জ্য ও নিষ্কাশন",
          "Locomotion & Movement · চলন ও অঙ্গ চালনা",
          "Coordination & Control · সমন্বয় ও নিয়ন্ত্রণ",
          "Human Reproduction · মানব জীবনের ধারাবাহিকতা",
          "Immune System · মানবদেহের প্রতিরক্ষা",
          "Genetics & Evolution · জিনতত্ত্ব ও বিবর্তন",
          "Animal Behavior · প্রাণীর আচরণ",
        ],
      },
    ],
  },
  {
    name: "ICT",
    color: "#f59e0b",
    papers: [
      {
        name: "Full Syllabus",
        chapters: [
          "ICT: World & Bangladesh · তথ্য ও যোগাযোগ প্রযুক্তি",
          "Number Systems & Digital Devices · সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস",
          "Computer & Cyber Security · কম্পিউটার ও সাইবার নিরাপত্তা",
          "Internet & Web Design (HTML) · ইন্টারনেট ও ওয়েব ডিজাইন",
          "Office Applications · অফিস অ্যাপ্লিকেশন",
          "Multimedia & Graphics · মাল্টিমিডিয়া ও গ্রাফিক্স",
          "Database Management System · ডেটাবেজ ব্যবস্থাপনা সিস্টেম",
          "Programming Language · প্রোগ্রামিং ভাষা",
        ],
      },
    ],
  },
  {
    name: "English",
    color: "#fb7185",
    papers: [
      {
        name: "1st Paper",
        chapters: [
          "Reading Part A: Seen Comprehension",
          "Reading Part B: Unseen Comprehension",
          "Information Transfer / Flow Chart",
          "Summary Writing",
          "Cloze Test with Clues",
          "Cloze Test without Clues",
          "Rearranging Sentences",
          "Paragraph Writing",
          "Story Writing",
          "Graph / Chart Description",
          "Letter & Email Writing",
        ],
      },
      {
        name: "2nd Paper",
        chapters: [
          "Article",
          "Preposition",
          "Special Construction / Phrase",
          "Completing Sentences",
          "Right Form of Verbs",
          "Narration (Direct–Indirect)",
          "Transformation of Sentences",
          "Modifiers",
          "Connectors / Linkers",
          "Synonyms & Antonyms",
          "Punctuation & Capitalization",
          "Formal Letter / Application / CV",
          "Composition Writing",
        ],
      },
    ],
  },
  {
    name: "Bangla",
    color: "#2dd4bf",
    papers: [
      {
        name: "1st Paper",
        chapters: [
          "Prose — গদ্য অংশ",
          "Poetry — পদ্য অংশ",
          "Novel / Drama — উপন্যাস ও নাটক",
          "Bangla Language History · বাংলা ভাষার ইতিহাস",
          "Language Movement Literature · ভাষা আন্দোলন বিষয়ক সাহিত্য",
        ],
      },
      {
        name: "2nd Paper",
        chapters: [
          "অপপ্রয়োগ ও শুদ্ধ প্রয়োগ",
          "বানান শুদ্ধিকরণ",
          "বাক্যতত্ত্ব ও বাক্য শুদ্ধিকরণ",
          "বাগধারা ও শব্দযুগল",
          "সমার্থক ও বিপরীত শব্দ",
          "সন্ধি ও সমাস",
          "বিরাম চিহ্ন ও ধ্বনিতত্ত্ব",
          "সারাংশ ও সারমর্ম",
          "ভাবসম্প্রসারণ",
          "পত্র ও প্রতিবেদন রচনা",
        ],
      },
    ],
  },
];

export const buildDefaultSubjects = (): Subject[] =>
  SEED.map((s) => ({
    id: uid(),
    name: s.name,
    color: s.color,
    papers: s.papers.map((p) => ({
      id: uid(),
      name: p.name,
      chapters: p.chapters.map((c) => ({ id: uid(), name: c, completed: false })),
    })),
  }));

export const DEFAULT_EXAM_DATE = "2026-07-01";
