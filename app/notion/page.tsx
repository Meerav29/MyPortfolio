import Image from "next/image";

export default function NotionPage() {
  const templates = [
    {
      title: "Grad School Application Tracker",
      image: "/Grad-schl-tracker.png",
      alt: "Grad School Application Tracker screenshot",
      link: "https://meerav.notion.site/Grad-School-Tracker-Template-273c954ecea180669b9dfe846e56edd6?source=copy_link",
      description:
        "Stay on top of your grad school applications with ease. This template helps you organize universities, track deadlines, manage recommendation letters, and keep notes on professors you may want to work with. Use built-in views like calendar, board, and timeline to stay on track and reduce the stress of application season.",
    },
    {
      title: "Task Manager Template",
      image: "/CTM-Template.png",
      alt: "Task Manager template screenshot",
      link: "https://meerav.notion.site/Task-Manager-Template-CTM-274c954ecea1803fb74ccf333119da5a?source=copy_link",
      description:
        "I have personally been using this for the last 2 years. A simple yet powerful system to keep your work and personal tasks organized. This template helps you capture to-dos, set priorities, and track progress with board, calendar, and list views. Whether it’s assignments, projects, or daily habits, everything stays in one place so nothing slips through the cracks.",
    },
    {
      title: "Notes & Reminders Organizer",
      image: "/notepad-org-template.png",
      alt: "Notes and reminders organizer screenshot",
      link: "https://meerav.notion.site/NotePad-Organizer-Template-9f5388c607914fecbb648be02c0abc9c?source=copy_link",
      description:
        "Take too many notes? Try organizing them so they're easier to access and more useful. Use this template to seamlessly categorize notes and reminders into distinct sections—Work, Classes, Research, Projects and more—offering a structured approach to task management.",
    },
    {
      title: "Notion Degree Planner Template",
      image: "/DegreePlanner-template.png",
      alt: "Notion Degree Planner template screenshot",
      link: "https://meerav.notion.site/Degree-Planner-e898a23f91624fafbeda2a1976932d99?source=copy_link",
      description:
        "Plan your degree with ease. Pursuing a 4 year degree? Planning to double major or add a minor? Program planning across disciplines can be a chaotic mess. Use this straightforward template to map out your entire curriculum and make sure you don't miss any requirements.",
    }
  ];

  return (
    <div className="px-6 py-20 space-y-24">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12">
        {templates.map((t) => (
          <section
            key={t.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src={t.image}
              alt={t.alt}
              width={1200}
              height={675}
              className="w-full object-cover"
            />
            <div className="flex flex-col gap-4 p-6">
              <h2 className="text-2xl font-semibold">{t.title}</h2>
              <a
                href={t.link}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center px-4 py-2 bg-card text-foreground border border-border rounded-md"
              >
                Go to FREE Template
              </a>
              <p className="text-muted">{t.description}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-4xl flex flex-col md:flex-row items-center md:items-start md:gap-10">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Hi, I am Meerav 👋</h2>
          <p className="text-muted">
            I am the creator of these Notion templates. I&apos;ve been using Notion for a long time for personal use—everything from
            planning my degree, to taking notes every day in a scratch pad, to coordinating the workloads and timelines in different
            projects that I&apos;m working on. I make templates out of my Notion workspaces to organize my academics and other
            opportunities. If you have any feedback or questions, please feel free to reach out 😅. This is what AI thinks I look like ;) 
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <Image
            src="/msaiart.png"
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



