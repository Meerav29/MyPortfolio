export type Project = {
  slug: string;
  title: string;
  tags: string[];
  summary: string;
  content: string;
  source?: string;
};

export const projects: Project[] = [
  {
    slug: "academic-advising-chatbot",
    title: "Academic Advising Chatbot (College of IST)",
    tags: ["LLM", "OpenAI API", "Python", "Prompting", "Research", "Machine Learning"],
    summary:
      "Built an advising assistant that answers routine queries and supports course planning; reduced advising load and improved answer depth.",
    content:
      "Built an advising assistant that answers routine queries and supports course planning. Integrated the OpenAI API with carefully designed prompts and a Python backend, reducing advising load while increasing answer depth.",
    source: "https://github.com/Meerav29?tab=repositories",
  },
  {
    slug: "autonomous-uav-icing",
    title: "Autonomous UAV Icing Research (MCREU)",
    tags: ["UAV", "Torque/RPM", "Data Analysis", "Research", "Machine Learning"],
    summary:
      "Studied how cloud/icing conditions affect UAV performance using onboard telemetry; proposed real-time mitigation algorithms.",
    content:
      "Studied how cloud and icing conditions affect UAV performance using onboard torque and RPM telemetry. Analyzed collected data and proposed real-time mitigation algorithms to maintain control authority during adverse conditions.",
  },
  {
    slug: "autonomous-vehicle-behavior",
    title: "Autonomous Vehicle Behavior Study (HTI Lab)",
    tags: ["Simulation", "STISIM3", "Human Factors"],
    summary:
      "Designed driving-sim scenarios to analyze interactions between AVs and human-driven vehicles at varying market penetrations.",
    content:
      "Designed STISIM3 driving simulation scenarios to analyze interactions between autonomous vehicles and human-driven traffic at varying market penetrations. Evaluated driver responses and traffic flow metrics across conditions.",
  },
  {
    slug: "nasa-big-idea-lunar-regolith",
    title: "NASA Big Idea Challenge — Lunar Regolith Construction",
    tags: ["Aerospace", "Systems Engineering", "Leadership"],
    summary:
      "Led a 15-member team exploring inflatable tech to 3D-print structures on the Moon using lunar regolith.",
    content:
      "Led a 15-member team exploring inflatable technology to 3D-print structures on the Moon using lunar regolith. Coordinated research, systems engineering, and outreach for the NASA Big Idea Challenge.",
  },
];

