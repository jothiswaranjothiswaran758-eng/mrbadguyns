import React from "react";
import Header from "./components/Header";
import ZenBreathing from "./components/ZenBreathing";
import Sketchpad from "./components/Sketchpad";
import ProjectShowcase from "./components/ProjectShowcase";
import SnippetCanvas from "./components/SnippetCanvas";
import ContactForm from "./components/ContactForm";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 selection:bg-indigo-500 selection:text-white antialiased transition duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
        {/* Top Header Section */}
        <Header />

        {/* Core Workspace Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Row 1: Focus Exercise (4 cols) & Creative Sketchpad (8 cols) */}
          <section className="lg:col-span-4 h-full" id="focus-section">
            <ZenBreathing />
          </section>

          <section className="lg:col-span-8 h-full" id="sketchpad-section">
            <Sketchpad />
          </section>

          {/* Row 2: Projects Showcase (Full 12 cols) */}
          <section className="lg:col-span-12" id="portfolio-section">
            <ProjectShowcase />
          </section>

          {/* Row 3: Text Formatter (6 cols) & Contact Portal (6 cols) */}
          <section className="lg:col-span-6 h-full" id="snippet-section">
            <SnippetCanvas />
          </section>

          <section className="lg:col-span-6 h-full" id="contact-section">
            <ContactForm />
          </section>
        </main>

        {/* Professional Minimalist Footer */}
        <footer className="w-full text-center border-t border-zinc-150/80 mt-12 pt-6 pb-2 text-xs font-mono text-zinc-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>Creative Workspace Portal &bull; Client-Side Sandbox</span>
          <span>Crafted with React, Tailwind &amp; Motion</span>
        </footer>
      </div>
    </div>
  );
}
