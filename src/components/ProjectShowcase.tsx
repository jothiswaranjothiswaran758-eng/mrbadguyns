import React, { useState } from "react";
import { FolderGit2, ArrowUpRight, Code, Palette, ShieldAlert, Heart, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "../types";

const INITIAL_PROJECTS: Project[] = [
  {
    id: "quantum-flow",
    title: "Quantum Flow Optimizer",
    tagline: "AI-native resource orchestration framework",
    description: "An advanced cloud routing layer designed to automatically balance high-performance clusters based on contextual inference models. It provides milliseconds cold-start latency reductions, live memory remapping, and visual debugging dashboards styled with luxury Swiss-Modern guidelines.",
    tags: ["TypeScript", "Rust", "WebAssembly", "Cloud"],
    image: "https://picsum.photos/seed/quantum/800/500",
    accentColor: "from-indigo-500 to-cyan-500",
    links: [
      { label: "View Source", url: "#" },
      { label: "Live Demo", url: "#" },
    ],
  },
  {
    id: "vector-canvas",
    title: "Vector Ink Engine",
    tagline: "A custom mathematical vector sketching platform",
    description: "An interactive canvas framework allowing designers to author geometric designs by inputting standard mathematical expressions. Features hardware-accelerated drawing pipelines, export to optimized SVGs, and absolute state persistence.",
    tags: ["React", "HTML5 Canvas", "Bezier", "Design"],
    image: "https://picsum.photos/seed/vectorcanvas/800/500",
    accentColor: "from-teal-400 to-emerald-600",
    links: [
      { label: "GitHub Repo", url: "#" },
      { label: "Launch App", url: "#" },
    ],
  },
  {
    id: "zen-workspace",
    title: "Zen Minimalist Work Space",
    tagline: "Distraction-free ambient task board",
    description: "A gorgeous single-screen task dashboard utilizing generative sound frequencies, local data storage, and customized deep focus techniques to elevate user creative output and deep work durations.",
    tags: ["Next.js", "Audio Synth", "Tailwind", "Focus"],
    image: "https://picsum.photos/seed/zenworkspace/800/500",
    accentColor: "from-rose-500 to-amber-500",
    links: [
      { label: "Read Study", url: "#" },
      { label: "Explore Project", url: "#" },
    ],
  },
];

export default function ProjectShowcase() {
  const [filter, setFilter] = useState<"All" | "Development" | "Design" | "Focus">("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({
    "quantum-flow": 42,
    "vector-canvas": 28,
    "zen-workspace": 67,
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const filteredProjects = INITIAL_PROJECTS.filter((proj) => {
    if (filter === "All") return true;
    if (filter === "Development") return proj.tags.includes("TypeScript") || proj.tags.includes("Rust");
    if (filter === "Design") return proj.tags.includes("Design") || proj.tags.includes("Bezier");
    if (filter === "Focus") return proj.tags.includes("Focus");
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 shadow-sm transition">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-sans font-semibold text-zinc-900 dark:text-zinc-50">
            Project Showcase & Lab
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 p-1 rounded-lg">
          {(["All", "Development", "Design", "Focus"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                filter === cat
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group cursor-pointer flex flex-col bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-xl overflow-hidden hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition duration-300"
          >
            {/* Visual Header Banner */}
            <div className="relative aspect-video overflow-hidden bg-zinc-200 dark:bg-zinc-850">
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent opacity-60" />
              <div className="absolute top-2 right-2">
                <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-white bg-zinc-950/80 px-2 py-0.5 rounded-full backdrop-blur-md">
                  <Heart className="w-2.5 h-2.5 fill-rose-500 stroke-rose-500" />
                  {likes[project.id]}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col flex-1">
              <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider">
                {project.tags[0]} / {project.tags[1] || "LAB"}
              </span>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mt-1 flex items-center justify-between">
                <span>{project.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-zinc-500" />
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                {project.tagline}
              </p>

              {/* Tags and Action Footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-150/40 dark:border-zinc-800/40">
                <div className="flex gap-1">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono bg-zinc-150/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => handleLike(project.id, e)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition text-zinc-400 hover:text-rose-500"
                  title="Like project"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Project Detail Overlay Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl relative"
            >
              {/* Banner visual */}
              <div className="relative h-48 bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${selectedProject.accentColor} opacity-20`} />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-zinc-950/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-zinc-950 transition text-sm font-bold"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-500 uppercase font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Interactive Case Study</span>
                </div>

                <h3 className="text-xl font-bold font-sans text-zinc-900 dark:text-zinc-50 mt-1">
                  {selectedProject.title}
                </h3>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mt-1">
                  {selectedProject.tagline}
                </p>

                <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-100 dark:border-zinc-900">
                  {selectedProject.description}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-150 dark:border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Links */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  {selectedProject.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Successfully simulated navigation to ${link.label}!`);
                      }}
                      className="flex-1 text-center py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold rounded-xl transition shadow-xs"
                    >
                      {link.label}
                    </a>
                  ))}
                  <button
                    onClick={(e) => {
                      handleLike(selectedProject.id, e);
                    }}
                    className="flex items-center gap-2 py-2.5 px-4 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold transition"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>{likes[selectedProject.id]} Likes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
