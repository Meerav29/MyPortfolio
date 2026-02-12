"use client";

import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail, FileText, ChevronRight } from "lucide-react";
import { projects } from "@/lib/projects";
import { links } from "@/lib/links";

export default function PitchPage() {
    // Select top 3 projects
    const topProjects = projects.slice(0, 3);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/20">
            <main className="flex-1 mx-auto max-w-2xl w-full px-6 py-12 md:py-20 flex flex-col justify-center">

                {/* Header / Intro */}
                <section className="mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Hi, I&apos;m Meerav.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted leading-relaxed">
                        Building at the intersection of <span className="text-foreground font-medium">AI</span>, <span className="text-foreground font-medium">Aerospace</span>, and <span className="text-foreground font-medium">Ed-Tech</span>.
                    </p>
                </section>

                {/* Selected Work */}
                <section className="mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-backwards">
                    <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-6">
                        Selected Work
                    </h2>
                    <div className="flex flex-col gap-4">
                        {topProjects.map((project) => (
                            <Link
                                key={project.slug}
                                href={`/projects/${project.slug}`}
                                className="group block p-4 -mx-4 rounded-xl hover:bg-card/50 transition-colors border border-transparent hover:border-border/50"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                                        {project.title}
                                    </h3>
                                    <ChevronRight size={16} className="text-muted group-hover:text-accent transition-transform group-hover:translate-x-1" />
                                </div>
                                <p className="text-muted/80 text-sm leading-relaxed line-clamp-2">
                                    {project.summary}
                                </p>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Link href="/#projects" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors">
                            View all projects <ArrowUpRight size={14} className="ml-1" />
                        </Link>
                    </div>
                </section>

                {/* Connect / Links */}
                <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href={links.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-2 sm:col-span-1 flex items-center gap-3 p-4 rounded-xl border border-border bg-card/30 hover:bg-card hover:border-accent/50 transition-all group"
                        >
                            <FileText size={20} className="text-muted group-hover:text-foreground transition-colors" />
                            <span className="font-medium">Resume</span>
                        </a>

                        <a
                            href={links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-2 sm:col-span-1 flex items-center gap-3 p-4 rounded-xl border border-border bg-card/30 hover:bg-card hover:border-blue-500/30 transition-all group"
                        >
                            <Linkedin size={20} className="text-muted group-hover:text-[#0077b5] transition-colors" />
                            <span className="font-medium">LinkedIn</span>
                        </a>

                        <a
                            href={links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-2 sm:col-span-1 flex items-center gap-3 p-4 rounded-xl border border-border bg-card/30 hover:bg-card hover:border-foreground/30 transition-all group"
                        >
                            <Github size={20} className="text-muted group-hover:text-foreground transition-colors" />
                            <span className="font-medium">GitHub</span>
                        </a>

                        <a
                            href={`mailto:${links.email}`}
                            className="col-span-2 sm:col-span-1 flex items-center gap-3 p-4 rounded-xl border border-border bg-card/30 hover:bg-card hover:border-green-500/30 transition-all group"
                        >
                            <Mail size={20} className="text-muted group-hover:text-green-500 transition-colors" />
                            <span className="font-medium">Email</span>
                        </a>

                        <Link
                            href="/"
                            className="col-span-2 flex items-center justify-center gap-2 p-4 mt-4 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                        >
                            Enter Full Portfolio
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
