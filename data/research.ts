export type ResearchItem = {
  id: string;
  title: string;
  venue: string;
  date: string;
  location?: string;
  summary: string;
  keyFindings?: string[];
  latestUpdates?: string[];
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
    title: "Enhancing Academic Advising using AI Chatbots",
    venue: "ACM SIGCSE Technical Symposium 2025",
    date: "2025-02-27",
    location: "Pittsburgh, PA",
    summary:
      "This paper investigates the implementation of AI-driven chatbots as a solution to streamline academic advising and improve the student experience. Through a review of preliminary results from the Nittany Advisor chatbot, we show how AI chatbots can boost advising efficiency, increase student satisfaction, and examine how chatbots can provide information on course requirements, prerequisites, and academic policies while suggesting the need for human intervention for more complex queries. We conclude that AI chatbots hold considerable promise for transforming academic advising by addressing routine questions, streamlining access to crucial information, and fostering a more responsive and supportive educational environment.",
    keyFindings: [
      "Preliminary results are promising but more studies to further assess and quantify the outcomes is crucial.",
      "Overlapping intent categories remain a challenge for ML classifiers.",
      "A hybrid advising model that leverages both AI and human advisors remains the long-term goal.",
    ],
    latestUpdates: [
      "Paper accepted at ACM SIGCSE 2025.",
      "Integrated live web scraping via industry partnership which enables real-time updates",
      "Designing a two-part human-centered study to evaluate the chatbot's effectiveness in both student facing and advisor-facing roles.",
      "Pursuing a research study with the College of IST, Penn State Advising and Industry Partners"
    ],
    tags: ["Chatbots", "Academic Research", "Academic Advising", "NLP", "OpenAI API", "AI/ML", "Human-Computer Interaction"],
    image: {
      src: "/ACMPosterPresentation.JPG",
      alt: "Picture from ACM Symposium",
      width: 1200,
      height: 800,
    },
    links: {
      publication: "https://dl.acm.org/doi/10.1145/3641555.3705026",
      notion: "https://meerav.notion.site/Enhancing-Academic-Advising-with-AI-Chatbots-Bridging-the-Information-Gap-for-Students-176c954ecea18028b99fea5b3e4520f9",
      linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7307395376381091840/",
    },
  },
  {
    id: "uav-icing",
    title: "Using Torque and RPM Loss to Estimate the Presence of Icing Clouds with UAVs",
    venue: "ASEE MidAt Spring 2025",
    date: "2025-04-02",
    location: "Reading, PA",
    summary:
      "Drones struggle to fly in icing and cloudy conditions, especially when the two are combined. This research project focuses on the automation of drones for monitoring rotational speed (RPM) and torque loss when traversing cloud and icing conditions. Cameras and radar systems are either not reliable or too complicated to mount on a compact UAV. By monitoring the UAV's torque and RPM loss, the project aims to precisely measure the impact of cloud and icing environments on drone performance using the Han-Palacios correlation between icing conditions and torque loss to estimate the volume of water within the clouds and assess general icing severity.",
    tags: ["Aviation", "Machine Learning", "Drone Engineering", "Academic Research"],
    image: {
      src: "/ASEE-Poster-Presentation.jpg",
      alt: "Picture from ASEE Symposium",
      width: 1200,
      height: 800,
    },
    links: {
      publication: "https://sites.google.com/psu.edu/meeravshah/mc-reu-research",
      linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7316121042987417601/",
      notion: "https://meerav.notion.site/Using-Torque-and-RPM-Loss-to-estimate-presence-of-Icing-clouds-with-UAVs-1c5c954ecea1808681b0fa920de07f8f"
    },
  },
];

