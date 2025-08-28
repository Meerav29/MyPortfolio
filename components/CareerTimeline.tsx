"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Microscope, Building2, Trophy, Rocket, Search, X, CalendarDays, GraduationCap } from "lucide-react";


const CATEGORY_STYLES = {
  Research: "bg-indigo-500/15 text-indigo-600 ring-1 ring-inset ring-indigo-500/30",
  Internship: "bg-emerald-500/15 text-emerald-600 ring-1 ring-inset ring-emerald-500/30",
  "Awards & Milestones": "bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/30",
  "Early Projects": "bg-rose-500/15 text-rose-600 ring-1 ring-inset ring-rose-500/30",
  "Campus involvement": "bg-sky-500/15 text-sky-600 ring-1 ring-inset ring-sky-500/30",
} as const;

type Category = keyof typeof CATEGORY_STYLES;

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Research: <Microscope className="h-4 w-4" />,
  Internship: <Building2 className="h-4 w-4" />,
  "Awards & Milestones": <Trophy className="h-4 w-4" />,
  "Early Projects": <Rocket className="h-4 w-4" />,
  "Campus involvement": <GraduationCap className="h-4 w-4" />,
};


type Section = "Recent Work Experience" | "Awards & Milestones" | "Early Projects";

type Item = {
  section: Section;
  categories: Category[]; // supports multiple categories per item
  org: string; // Company/Org — shown as title
  role: string; // italic subtitle
  dateRange: string; // e.g., "Jun 2024 – Present"
  summary?: string; // muted one-liner (e.g., project name)
  highlights: string[]; // bullets
  href?: string; // optional link
};

// ---------------------- Data ----------------------
const ITEMS: Item[] = [
  // Work Experience (ALL visible)
  {
    section: "Recent Work Experience",
    categories: ["Research", "Internship"],
    org: "College of IST, Penn State",
    role: "Undergraduate Researcher, Primary Investigator",
    dateRange: "Jun 2024 – Present",
    summary: "Project: AI Solutions for Advising",
    highlights: [
      "Built an academic advising chatbot with commercial LLMs & APIs; reduced student advising load by ~35%.",
      "Studying deployment impact and student outcomes; writing up results for SIGCSE (2025).",
    ],
    href: "/research",
  },
  {
    section: "Recent Work Experience",
    categories: ["Research"],
    org: "Vertical Lift Research Center of Excellence (MCREU), Penn State",
    role: "Undergraduate Researcher, Primary Investigator",
    dateRange: "Jun 2024 – Aug 2024",
    summary: "Project: Autonomous UAV Research (Icing)",
    highlights: [
      "Analyzed torque & RPM signals to estimate icing impact on UAV performance (±25%).",
      "Prototyped real-time propeller monitoring and proposed mitigation algorithms.",
    ],
  },
  {
    section: "Recent Work Experience",
    categories: ["Research"],
    org: "Human–Technology Interaction (HTI) Lab, Penn State",
    role: "Undergraduate Researcher",
    dateRange: "Sep 2023 – May 2024",
    summary: "Project: Autonomous Vehicle Studies (STISIM3)",
    highlights: [
      "Ran simulator studies across AV market-penetration levels (0–100%).",
      "Built four custom road scenarios and internal documentation in STISIM3.",
    ],
  },
  {
    section: "Recent Work Experience",
    categories: ["Campus involvement"],
    org: "IST 130 — Intro to AI & Art",
    role: "Lead Learning Assistant",
    dateRange: "Jan 2024 – Present",
    highlights: [
      "Lead 14 LAs; manage ops, grading, and correspondence; designed handoff documentation.",
    ],
  },
  {
    section: "Recent Work Experience",
    categories: ["Research", "Campus involvement"],
    org: "NASA BIG Idea Challenge — SSPL",
    role: "Team Lead; Researcher",
    dateRange: "Oct 2023 – Feb 2024",
    highlights: [
      "Led 15-member team developing inflatable lunar regolith construction concepts.",
    ],
  },
  {
    section: "Recent Work Experience",
    categories: ["Internship", "Campus involvement"],
    org: "Perplexity",
    role: "Campus Strategist — Penn State",
    dateRange: "Jan 2024 – Present",
    highlights: [
      "Drove campus growth; 774 total sign-ups with significant late-stage acceleration.",
    ],
  },

  // Awards & Milestones
  {
    section: "Awards & Milestones",
    categories: ["Awards & Milestones"],
    org: "Emerging Undergraduate Researcher of the Year",
    role: "Penn State",
    dateRange: "Spring 2024",
    highlights: [
      "Recognized for impact across AI-in-Education and UAV reliability research.",
    ],
  },
  {
    section: "Awards & Milestones",
    categories: ["Awards & Milestones"],
    org: "MC REU (Research Experience for Undergraduates)",
    role: "Summer '24 Cohort",
    dateRange: "Jun 2024",
    highlights: [
      "Got accepted into the MC REU (Research Experience for Undergraduates) Program for the Summer'24 cohort.",
    ],
  },
  {
    section: "Awards & Milestones",
    categories: ["Awards & Milestones"],
    org: "Title: Enhancing Student Engagement through AI-driven Chatbots",
    role: "Undergrad Researcher",
    dateRange: "Feb 2025",
    highlights: [
      "Got accepted to & presented paper at ACM SIGCSE TS'25 Conference.",
      "Read more about publications and works in progress.",
    ],
    href: "/research",
  },

  {section: "Awards & Milestones",
  categories: ["Awards & Milestones"],
  org: "Title: Using RPM & Torque Loss to Predict UAV Icing Effects",
  role: "Undergrad Researcher",
  dateRange: "Apr 2025",
  highlights: [
    "Got accepted to & presented UAV Icing/Drone Engineering paper at ASEE MidAtlantic'25 Conference.",
    "Read more about publications and works in progress.",
  ],
  href: "/research",
},

  // Early Projects
  {
    section: "Early Projects",
    categories: ["Early Projects"],
    org: "Lirem",
    role: "Founder",
    dateRange: "2020",
    highlights: [
      "Launched a neighborhood reading program; grew city-wide volunteer network until COVID halted ops.",
      "Learned ownership, rapid decision-making, and validation.",
    ],
  },
  {
    section: "Early Projects",
    categories: ["Early Projects"],
    org: "Tide Foundation",
    role: "Contributor (Education, Ops)",
    dateRange: "2022",
    highlights: [
      "Worked across logistics, marketing, operations, course design, and teaching for underprivileged students.",
    ],
  },
  {
    section: "Early Projects",
    categories: ["Early Projects"],
    org: "Electrobotics, Ahmedabad",
    role: "Intern, Robocon Team Lead",
    dateRange: "Sep 2019 – Oct 2019",
    highlights: [
      "Shadowed drone engineering team; explored AWD platform and 4-axis arm prototyping.",
    ],
  },
  {
    section: "Early Projects",
    categories: ["Early Projects"],
    org: "National Robotics Finalist",
    role: "Team Lead",
    dateRange: "2019",
    highlights: [
      "Led AWD RC car with 4-axis arm build; qualified for national finals.",
    ],
  },
];

// ---------------------- Helpers ----------------------
function classNames(...arr: (string | false | null | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

const SECTION_ORDER: Section[] = [
  "Recent Work Experience",
  "Awards & Milestones",
  "Early Projects",
];

function groupBySection(items: Item[]) {
  const map = new Map<Section, Item[]>();
  SECTION_ORDER.forEach((s) => map.set(s, []));
  items.forEach((it) => map.get(it.section)!.push(it));
  return SECTION_ORDER.map((s) => [s, map.get(s)!] as const);
}

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
  spring: 4, summer: 7, fall: 10, autumn: 10, winter: 1,
};

function parseRangeToKey(range: string) {
  // Prefer the end date; treat "Present" as far future.
  const parts = range.split("–").map((s) => s.trim());
  let right = parts[1] || parts[0];
  if (/present/i.test(right)) return 9999 * 12 + 12;
  const tokens = right.toLowerCase().split(/\s|\u2013|-/).filter(Boolean);
  const year = Number(tokens.find((t) => /\d{4}/.test(t)) || "0");
  const monthToken = tokens.find((t) => MONTHS[t]);
  const month = monthToken ? MONTHS[monthToken] : 6; // middle of year if missing
  return year * 12 + month;
}

// ---------------------- UI Bits ----------------------
function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={classNames("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs", CATEGORY_STYLES[category])}>
      {CATEGORY_ICONS[category]}
      {category}
    </span>
  );
}

function TimelineDot({ category }: { category: Category }) {
  const color = {
    Research: "bg-indigo-500",
    Internship: "bg-emerald-500",
    "Awards & Milestones": "bg-amber-500",
    "Early Projects": "bg-rose-500",
    "Campus involvement": "bg-sky-500",
  }[category];
  return <span className={classNames("absolute -left-2.5 top-2 h-2.5 w-2.5 rounded-full ring-4 ring-background", color)} />;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
        active ? "border-foreground/20 bg-foreground/10" : "border-foreground/10 hover:bg-foreground/5"
      )}
    >
      {children}
    </button>
  );
}

function TimelineCard({ item }: { item: Item }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative ml-6 rounded-2xl border border-foreground/10 bg-card/50 p-4 shadow-sm backdrop-blur"
    >
      <TimelineDot category={item.categories[0]} />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold leading-tight">{item.org}</h3>
          <p className="text-sm italic text-muted-foreground">{item.role}</p>
          {item.summary && (
            <p className="mt-1 text-xs text-muted-foreground">{item.summary}</p>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> {item.dateRange}
        </div>
      </div>

      {/* Bullets */}
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        {item.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      {/* Optional link */}
      {item.href && (
        <div className="mt-3">
          <Link href={item.href} className="text-sm underline underline-offset-4 hover:opacity-90">
            Read more here →
          </Link>
        </div>
      )}
    </motion.li>
  );
}

function SectionBlock({ title, items }: { title: Section; items: Item[] }) {
  // Always sort newest-first within section using parsed end-date key
  const sorted = [...items].sort((a, b) => parseRangeToKey(b.dateRange) - parseRangeToKey(a.dateRange));
  return (
    <section>
      <h2 className="sticky top-0 z-10 mb-3 bg-background/60 px-1 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
        {title}
      </h2>
      <ol className="relative border-l border-foreground/10 pl-3">
        <div className="absolute -left-[1px] top-0 h-full w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
        <div className="ml-1 space-y-4">
          {sorted.map((it) => (
            <TimelineCard key={`${title}-${it.org}-${it.dateRange}`} item={it} />
          ))}
        </div>
      </ol>
    </section>
  );
}

export default function CareerTimeline() {
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<Category[]>([]);

  const categories = Object.keys(CATEGORY_STYLES) as Category[];

  const filtered = useMemo(() => {
    let list = [...ITEMS];
    if (activeCats.length) list = list.filter((i) => activeCats.some((c) => i.categories.includes(c)));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((i) => [i.org, i.role, i.summary, ...i.highlights]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q));
    }
    return list;
  }, [activeCats, query]);

  const grouped = useMemo(() => groupBySection(filtered), [filtered]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Timeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter by category; newest entries appear first within each section.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orgs, roles, highlights…"
            className="w-full rounded-xl border border-foreground/10 bg-background px-9 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-foreground/20"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-2 rounded-full p-1 hover:bg-foreground/10" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter chips */}
      <div className="mb-6 flex flex-wrap gap-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))}
            className={classNames(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
              activeCats.includes(c) ? "border-foreground/20 bg-foreground/10" : "border-foreground/10 hover:bg-foreground/5"
            )}
          >
            <span className="mr-1">{CATEGORY_ICONS[c]}</span>
            {c}
          </button>
        ))}
        {activeCats.length > 0 && (
          <button className="text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={() => setActiveCats([])}>
            Reset
          </button>
        )}
      </div>

      {/* Sections in fixed order */}
      <div className="space-y-10">
        {grouped.map(([era, items]) => (
          <SectionBlock key={era} title={era as Section} items={items} />
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">For more information on any of my research work, or to access any of my work, please feel free to reach out.</p>
    </div>
  );
}
