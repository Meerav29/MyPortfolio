export type ResearchItem = {
  title: string;
  summary: string;
  link?: string;
};

export const research: ResearchItem[] = [
  {
    title: "Adaptive Tutoring Agents",
    summary:
      "Investigated AI tutors that personalize explanations and feedback using large language models.",
    link: "https://example.com/adaptive-tutoring",
  },
  {
    title: "UAV Icing Detection",
    summary:
      "Analyzed propeller telemetry to identify icing events and propose real-time mitigation algorithms.",
    link: "https://example.com/uav-icing",
  },
  {
    title: "Driver Behavior in Mixed Autonomy Traffic",
    summary:
      "Designed driving-simulator studies exploring interactions between human drivers and autonomous vehicles.",
  },
];

