// data/work.ts

export type WorkItem = {
  id: string;
  period: string;          // e.g. "Jun 2025 – Present"
  org: string;             // company or institution
  role: string;            // job title or researcher role
  description: string;     // 1–2 sentences, plain prose
  link?: string;           // optional external or internal URL
  featured?: boolean;      // true = show on home page (max 3)
};

export const workItems: WorkItem[] = [
  {
    id: "rolai",
    period: "Jun 2025 – Present",
    org: "Rolai",
    role: "AI Engineering & Applied Research Intern",
    description:
      "Deployed an academic advising chatbot on the Rolai platform with live web-scraping, cutting manual content maintenance by ~50%. Co-authored 3 white papers and leading a human-centered study measuring chatbot impact for 50+ students.",
    featured: true,
  },
  {
    id: "ist-research",
    period: "Jun 2024 – Present",
    org: "College of IST, Penn State",
    role: "Undergraduate Researcher — AI Solutions for Advising",
    description:
      "Built and evaluated an LLM-powered advising chatbot that reduced student advising load by ~35%. Published results at ACM SIGCSE 2025.",
    link: "https://dl.acm.org/doi/10.1145/3641555.3705026",
    featured: true,
  },
  {
    id: "perplexity",
    period: "Jan 2024 – Present",
    org: "Perplexity",
    role: "Campus Strategist — Penn State",
    description:
      "Drove campus growth to 774 sign-ups through targeted outreach and community programming.",
  },
  {
    id: "learning-assistant",
    period: "Jan 2024 – Present",
    org: "IST 130 — Intro to AI & Art, Penn State",
    role: "Lead Learning Assistant",
    description:
      "Lead a team of 14 LAs; manage operations, grading, and correspondence for an AI literacy course.",
  },
  {
    id: "uav-icing",
    period: "Jun 2024 – Aug 2024",
    org: "Vertical Lift Research Center (MCREU), Penn State",
    role: "Undergraduate Researcher — Autonomous UAV Icing",
    description:
      "Analyzed torque and RPM signals to estimate icing impact on UAV performance. Proposed real-time mitigation algorithms; presented at ASEE MidAtlantic 2025.",
    link: "https://sites.google.com/psu.edu/meeravshah/mc-reu-research",
    featured: true,
  },
  {
    id: "nasa",
    period: "Oct 2023 – Feb 2024",
    org: "NASA BIG Idea Challenge — SSPL",
    role: "Team Lead & Researcher",
    description:
      "Led a 15-member team developing inflatable lunar regolith construction concepts for the NASA BIG Idea Challenge.",
  },
  {
    id: "hti-lab",
    period: "Sep 2023 – May 2024",
    org: "Human–Technology Interaction Lab, Penn State",
    role: "Undergraduate Researcher — Autonomous Vehicle Studies",
    description:
      "Built four STISIM3 road scenarios and ran simulator studies across AV market-penetration levels to model human–AV interaction.",
  },
  {
    id: "lirem",
    period: "2020",
    org: "Lirem",
    role: "Founder",
    description:
      "Launched a neighborhood reading program that grew into a city-wide volunteer network before COVID halted operations.",
  },
];
