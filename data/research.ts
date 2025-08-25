export type ResearchItem = {
  id: string;
  title: string;
  venue: string;
  date: string;
  location?: string;
  summary: string;
  keyFindings?: string[];
  role?: string;
  impact?: string;
  tags: string[];
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  links: {
    publication?: string;
    linkedin?: string;
    notion?: string;
    website?: string;
    slides?: string;
    poster?: string;
  };
};

export const research: ResearchItem[] = [
  {
    id: "adaptive-tutoring",
    title: "Adaptive Tutoring Agents",
    venue: "ACM Learning@Scale",
    date: "2024-03-01",
    location: "Boston, MA",
    summary:
      "Investigated AI tutors that personalize explanations and feedback using large language models. Conducted a classroom deployment with 120 students over six weeks to study learning gains and user perceptions.",
    keyFindings: [
      "Adaptive prompts improved quiz scores by 12% over control.",
      "Students preferred conversational tone over formal feedback.",
      "Teachers valued analytics for tracking misconceptions.",
    ],
    role: "Led the study design and implemented the tutoring agent.",
    impact: "Insights inform the next iteration of our platform for fall 2024.",
    tags: ["AI in Education", "Chatbots"],
    image: {
      src: "/planet.png",
      alt: "Students interacting with an adaptive tutoring agent",
      width: 1200,
      height: 800,
    },
    links: {
      publication: "https://example.com/adaptive-tutoring",
      slides: "https://example.com/adaptive-slides.pdf",
      website: "https://example.com",
      linkedin: "https://linkedin.com/in/example",
    },
  },
  {
    id: "uav-icing",
    title: "UAV Icing Detection",
    venue: "AIAA Aviation Forum",
    date: "2023-06-15",
    location: "San Diego, CA",
    summary:
      "Analyzed propeller telemetry to identify icing events on unmanned aerial vehicles. Built a dataset of 300 flight hours and developed a real-time mitigation algorithm.",
    keyFindings: [
      "Frequency-domain features predicted icing 5 seconds before performance drop.",
      "Algorithm runs on edge hardware with under 5% CPU overhead.",
      "Open-source dataset enables future icing research.",
    ],
    role: "Implemented data collection pipeline and anomaly detection algorithm.",
    impact: "Technique will be integrated into our next-generation UAV platform.",
    tags: ["Aviation", "Machine Learning"],
    image: {
      src: "/satellite.png",
      alt: "UAV flying through icy conditions",
      width: 1200,
      height: 800,
    },
    links: {
      publication: "https://example.com/uav-icing",
      poster: "https://example.com/uav-icing-poster.pdf",
    },
  },
];

