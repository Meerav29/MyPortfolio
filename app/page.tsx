"use client";

import { ExternalLink } from "lucide-react";
import Hero from "@/components/Hero";
import { links } from "@/lib/links";

export default function Page() {
  const projects = [
    {
      title: "Academic Advising Chatbot (College of IST)",
      tags: ["LLM", "OpenAI API", "Python", "Prompting", "Research", "Machine Learning"],
      summary:
        "Built an advising assistant that answers routine queries and supports course planning; reduced advising load and improved answer depth.",
      link: "https://github.com/Meerav29?tab=repositories",
    },
    {
      title: "Autonomous UAV Icing Research (MCREU)",
      tags: ["UAV", "Torque/RPM", "Data Analysis", "Research", "Machine Learning"],
      summary:
        "Studied how cloud/icing conditions affect UAV performance using onboard telemetry; proposed real-time mitigation algorithms.",
      link: "#",
    },
    {
      title: "Autonomous Vehicle Behavior Study (HTI Lab)",
      tags: ["Simulation", "STISIM3", "Human Factors"],
      summary:
        "Designed driving-sim scenarios to analyze interactions between AVs and human-driven vehicles at varying market penetrations.",
      link: "#",
    },
    {
      title: "NASA Big Idea Challenge — Lunar Regolith Construction",
      tags: ["Aerospace", "Systems Engineering", "Leadership"],
      summary:
        "Led a 15-member team exploring inflatable tech to 3D-print structures on the Moon using lunar regolith.",
      link: "#",
    },
  ];

  const experience = [
    {
      org: "Penn State — MCREU",
      role: "Undergraduate Researcher (PI)",
      time: "Jun 2024 – Aug 2024",
      points: [
        "Analyzed UAV propeller performance under icing/cloud conditions via torque & RPM telemetry.",
        "Outlined real-time processing to detect and mitigate icing effects in flight.",
      ],
    },
    {
      org: "Penn State — HTI Lab",
      role: "Undergraduate Researcher",
      time: "Sep 2023 – May 2024",
      points: [
        "Developed STISIM3 scenarios; evaluated driver behavior with mixed AV/HV traffic.",
      ],
    },
    {
      org: "IST 130: AI & Art",
      role: "Lead Learning Assistant",
      time: "Jan 2024 – Present",
      points: ["Mentor 14+ LAs; design coursework and documentation for 400+ students/semester."],
    },
    {
      org: "SSPL — NASA Big Idea",
      role: "Team Lead; Researcher",
      time: "Oct 2023 – Feb 2024",
      points: ["Coordinated 15-member effort on lunar regolith additive construction systems."],
    },
  ];

  const skills = [
    "Python",
    "Java",
    "C/C++",
    "JavaScript",
    "HTML/CSS",
    "SQL",
    "NoSQL",
    "PyTorch",
    "NumPy",
    "Linux",
    "Git",
    "Cloud",
    "Data Science",
  ];

  return (
    <div>
      <Hero id="top" />
      <main className="mx-auto max-w-6xl px-6">
        <About />
        <Projects projects={projects} />
        <Experience items={experience} />
        <Skills items={skills} />
        <Contact links={links} />
      </main>
      <Footer />
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <section id={id} className="py-14 md:py-20 border-t border-white/10">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        <a href="#top" className="text-sm text-slate-400 hover:text-slate-200">
          Back to top
        </a>
      </div>
      {children}
    </section>
  );
}

function About() {
  return (
    <Section id="about" title="About">
      <p className="text-slate-300 leading-relaxed max-w-3xl">
        I’m an undergraduate senior in Computer Science at Penn State, minoring in Astrophysics. I build practical, minimal tools—
        from advising assistants that free up faculty time to UAV analytics that make flight safer in icing conditions. I care about
        clean design, clear impact, and shipping real things.
      </p>
    </Section>
  );
}

function Projects({ projects }: { projects: any[] }) {
  return (
    <Section id="projects" title="Featured Projects">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <a
            key={p.title}
            href={(p.link as string) || "#"}
            className="group rounded-2xl border border-white/10 p-6 bg-slate-900/50 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="text-lg font-medium leading-snug text-[#64FFDA]">{p.title}</h3>
              <ExternalLink size={16} className="shrink-0 opacity-70 group-hover:opacity-100" />
            </div>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {p.tags?.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs text-[#64FFDA] rounded-full border border-[#64FFDA] px-2 py-1 bg-slate-900/40"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

function Experience({ items }: { items: any[] }) {
  return (
    <Section id="experience" title="Experience">
      <div className="grid gap-4">
        {items.map((job) => (
          <div
            key={job.org + job.time}
            className="rounded-2xl border border-white/10 p-6 bg-slate-900/50"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                  <h3 className="font-medium text-[#64FFDA]">
                    {job.role} · <span className="text-[#64FFDA]">{job.org}</span>
                  </h3>
                <div className="text-sm text-slate-400">{job.time}</div>
              </div>
            </div>
              <ul className="mt-3 space-y-2 list-disc pl-5 text-[#64FFDA] text-sm">
                {job.points.map((pt: string) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Skills({ items }: { items: string[] }) {
  return (
    <Section id="skills" title="Skills">
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
              <span
                key={s}
                className="text-sm text-[#64FFDA] rounded-full border border-[#64FFDA] px-3 py-1.5 bg-slate-900/40"
              >
                {s}
              </span>
        ))}
      </div>
    </Section>
  );
}

function Contact({ links }: { links: any }) {
  return (
    <Section id="contact" title="Get in touch">
      <div className="rounded-2xl border p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <h3 className="text-xl font-semibold">Let’s build something.</h3>
        <p className="mt-2 text-white/80 max-w-2xl">
          I’m open to research collaborations, product work, and internships in AI, aerospace, and ed-tech.
        </p>

        {/* Contact Form */}
        <form
          action="https://formspree.io/f/mrblrpnp"
          method="POST"
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="flex-1 rounded-xl px-4 py-2 text-slate-900 placeholder-slate-500"
          />
          <input
            type="text"
            name="message"
            placeholder="Say hello..."
            required
            className="flex-1 rounded-xl px-4 py-2 text-slate-900 placeholder-slate-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-white text-slate-900 px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
          >
            Send
          </button>
        </form>

        {/* Optional quick links */}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            href={`mailto:${links.email}`}
            className="rounded-xl border border-white/30 px-4 py-2 hover:bg-white/10"
          >
            Email Me
          </a>
          <a
            href={links.linkedin}
            className="rounded-xl border border-white/30 px-4 py-2 hover:bg-white/10"
          >
            LinkedIn
          </a>
          <a
            href={links.site}
            className="rounded-xl border border-white/30 px-4 py-2 hover:bg-white/10"
          >
            Current Site
          </a>
        </div>
      </div>
    </Section>
  );
}


function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} Meerav Shah</span>
        <span className="opacity-80">Built with Next.js + Tailwind · Minimal, blue/black/white.</span>
      </div>
    </footer>
  );
}
