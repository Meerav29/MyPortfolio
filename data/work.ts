// data/work.ts

export type WorkItem = {
  id: string;
  period: string;          // e.g. "Jun 2025 – Present"
  org: string;             // company or institution
  role: string;            // job title or researcher role
  description: string;     // 1–2 sentences, plain prose
  link?: string;           // optional external or internal URL
  featured?: boolean;      // true = show on home page
  category: "industry" | "research" | "early";
};

export const workItems: WorkItem[] = [
  // ── Industry ──────────────────────────────────────────────────────────────
  {
    id: "rolai-engineer",
    period: "Jun 2026–Present",
    org: "Rolai",
    role: "Applied AI Engineer",
    description: "Leading development of new product offering :)",
    featured: true,
    category: "industry",
  },
  {
    id: "rolai-intern",
    period: "Sep 2025–Jun 2026",
    org: "Rolai",
    role: "AI Engineering Intern",
    description:
      "Built & deployed 32+ client-facing AI solutions on the Rolai platform; engineered Monday.com integration bringing 130+ API actions to end users; improved delivery time 20%.",
    featured: true,
    category: "industry",
  },
  {
    id: "rolai-research",
    period: "Jun–Aug 2025",
    org: "Rolai",
    role: "Applied Research Intern",
    description:
      "Deployed an academic advising chatbot with live web-scraping, reducing content maintenance ~50%. Co-authored 3 white papers on AI in education; developed 45 AI automation use-cases.",
    category: "industry",
  },
  {
    id: "psu-avt",
    period: "Jan–Mar 2026",
    org: "Penn State Advanced Vehicle Team",
    role: "Perception Engineer",
    description:
      "Refactored LiDAR–camera depth fusion pipeline to ±0.2m accuracy — 60% beyond spec. Implemented unit testing in ROS2-based perception stack.",
    category: "industry",
  },
  {
    id: "perplexity",
    period: "Aug 2024–May 2025",
    org: "Perplexity",
    role: "Campus Strategist",
    description:
      "Grew Penn State to 774 sign-ups. Planned and organized campus PR events for Perplexity.ai.",
    category: "industry",
  },

  // ── Research & Leadership ─────────────────────────────────────────────────
  {
    id: "ist-research",
    period: "Jun 2024–Jun 2026",
    org: "College of IST, Penn State",
    role: "Undergraduate Research Assistant",
    description:
      "Built LLM-powered academic advising chatbot reducing advising load 35%. Published at ACM SIGCSE 2025.",
    link: "https://dl.acm.org/doi/10.1145/3641555.3705026",
    category: "research",
  },
  {
    id: "uav-icing",
    period: "Jun–Jul 2024",
    org: "Penn State College of Engineering (MC REU)",
    role: "Researcher",
    description:
      "Investigated UAV icing detection using torque and RPM loss signals. Presented at ASEE MidAtlantic 2025.",
    link: "https://sites.google.com/psu.edu/meeravshah/mc-reu-research",
    category: "research",
  },
  {
    id: "av-research",
    period: "Aug 2023–May 2024",
    org: "Penn State Research",
    role: "Undergraduate Researcher",
    description:
      "Driving simulator study on human–AV interaction using STISIM3. Built 4 road scenarios to test driver behavior around autonomous vehicles.",
    category: "research",
  },
  {
    id: "nasa-big-idea",
    period: "Oct 2023–May 2024",
    org: "NASA BIG Idea Challenge — SSPL",
    role: "Team Lead & Researcher",
    description:
      "Led 15-person team on lunar regolith 3D printing system — inflatable dome enclosing a robotic arm 3D printer, fully self-deployed.",
    category: "research",
  },
  {
    id: "ist-la",
    period: "Jan 2024–May 2025",
    org: "Penn State College of IST",
    role: "Lead Learning Assistant",
    description:
      "Led team of 14 LAs for IST 130 (AI & Art). Managed grading, operations, correspondence. Curated 50+ AI tools for 500+ students.",
    category: "research",
  },

  // ── Early Projects ────────────────────────────────────────────────────────
  {
    id: "lirem",
    period: "2020",
    org: "Lirem",
    role: "Founder",
    description:
      "Launched a neighborhood reading program; grew city-wide volunteer network until COVID halted ops. Learned ownership, rapid decision-making, and validation.",
    category: "early",
  },
  {
    id: "code-warriors",
    period: "Jun 2020–Jun 2021",
    org: "Code Warriors Club, DPS Bopal",
    role: "Director",
    description:
      "Grew club to 100+ members during COVID by going fully online. Ran Technovanza — city-wide tech-fest with 1,000+ attendees.",
    category: "early",
  },
  {
    id: "electrobotic",
    period: "Sep–Oct 2019",
    org: "Electrobotic Manufacturing",
    role: "Intern",
    description:
      "Built AWD robot with 4-axis arm. Led team to national finals at Nirma University Robocon — ranked 9th overall.",
    category: "early",
  },
];
