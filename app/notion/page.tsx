import Image from "next/image";

export default function NotionPage() {
  const templates = [
    {
      title: "Notion Degree Planner Template",
      image: "/degree-planner-template.png",
      alt: "Notion Degree Planner template screenshot",
      link: "#",
      description:
        "Plan your degree with ease. Pursuing a 4 year degree? Planning to double major or add a minor? Program planning across disciplines can be a chaotic mess. Use this straightforward template to map out your entire curriculum and make sure you don't miss any requirements.",
    },
    {
      title: "Notes & Reminders Organizer",
      image: "/notes-reminders-organizer.png",
      alt: "Notes and reminders organizer screenshot",
      link: "#",
      description:
        "Take too many notes? Try organizing them so they're easier to access and more useful. Use this template to seamlessly categorize notes and reminders into distinct sections—Work, Classes, Research, Projects and more—offering a structured approach to task management.",
    },
  ];

  return (
    <div className="px-6 py-20 space-y-24">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12">
        {templates.map((t) => (
          <section key={t.title} className="flex flex-col">
            <Image
              src={t.image}
              alt={t.alt}
              width={1200}
              height={675}
              className="rounded-lg shadow-lg"
            />
            <h2 className="text-2xl font-semibold mt-6 mb-4">{t.title}</h2>
            <a
              href={t.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4 px-4 py-2 bg-white text-slate-900 rounded-md"
            >
              Go to FREE Template
            </a>
            <p className="text-slate-300">{t.description}</p>
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-4xl flex flex-col md:flex-row items-center md:items-start md:gap-10">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Hi, I am Meerav 👋</h2>
          <p className="text-slate-300">
            I am the creator of these Notion templates. I&apos;ve been using Notion for a long time for personal use—everything from
            planning my degree, to taking notes every day in a scratch pad, to coordinating the workloads and timelines in different
            projects that I&apos;m working on. I make templates out of my Notion workspaces to organize my academics and other
            opportunities. If you have any feedback or questions, please feel free to reach out 😅. This is what AI thinks I look like ;)
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <Image
            src="/meerav-avatar.png"
            alt="Cartoon profile picture of Meerav holding a cup"
            width={160}
            height={160}
            className="rounded-full"
          />
        </div>
      </section>
    </div>
  );
}

