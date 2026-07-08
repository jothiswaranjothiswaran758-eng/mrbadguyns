import React, { useState, useEffect } from "react";
import { Code, Copy, Check, Palette, FileText, Sparkles, Folder } from "lucide-react";

interface SnippetPreset {
  id: string;
  title: string;
  language: string;
  content: string;
  theme: string;
}

const THEMES = [
  { id: "sunset", name: "Sunset Horizon", bg: "bg-gradient-to-br from-orange-400 via-rose-500 to-indigo-600", text: "text-zinc-50" },
  { id: "slate", name: "Slate Minimal", bg: "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800", text: "text-zinc-800 dark:text-zinc-100" },
  { id: "cyber", name: "Cyberpunk Glow", bg: "bg-gradient-to-tr from-purple-900 via-violet-950 to-blue-900", text: "text-cyan-100" },
  { id: "emerald", name: "Mint Emerald", bg: "bg-gradient-to-br from-emerald-400 to-teal-700", text: "text-zinc-50" },
  { id: "cosmic", name: "Cosmic Indigo", bg: "bg-gradient-to-br from-indigo-900 via-slate-900 to-zinc-950", text: "text-indigo-50" },
];

const DEFAULT_SNIPPET = `// Welcome to your Workspace Snippet Canvas!
// You can format, style, and copy beautiful text blocks here.

function greetCreator(name) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : "Hello";
  console.log(\`\${greeting}, \${name}! Keep building.\`);
}

greetCreator("Creative Mind");`;

export default function SnippetCanvas() {
  const [snippetText, setSnippetText] = useState(DEFAULT_SNIPPET);
  const [fileName, setFileName] = useState("main.js");
  const [language, setLanguage] = useState("JavaScript");
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [copied, setCopied] = useState(false);
  const [savedPresets, setSavedPresets] = useState<SnippetPreset[]>([]);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    const stored = localStorage.getItem("workspace_snippets");
    if (stored) {
      try {
        setSavedPresets(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(snippetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savePreset = () => {
    const newPreset: SnippetPreset = {
      id: Math.random().toString(36).substr(2, 9),
      title: fileName,
      language,
      content: snippetText,
      theme: activeTheme.id,
    };

    const updated = [newPreset, ...savedPresets].slice(0, 3); // Store last 3
    setSavedPresets(updated);
    localStorage.setItem("workspace_snippets", JSON.stringify(updated));
  };

  const loadPreset = (preset: SnippetPreset) => {
    setFileName(preset.title);
    setLanguage(preset.language);
    setSnippetText(preset.content);
    const theme = THEMES.find((t) => t.id === preset.theme) || THEMES[0];
    setActiveTheme(theme);
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPresets.filter((p) => p.id !== id);
    setSavedPresets(updated);
    localStorage.setItem("workspace_snippets", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 shadow-sm transition">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-sans font-semibold text-zinc-900 dark:text-zinc-50">
            Snippet Canvas & Styler
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copySnippet}
            className="flex items-center gap-1.5 py-1 px-2.5 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 rounded-lg border border-zinc-150 dark:border-zinc-800 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Filename</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="script.js"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option>JavaScript</option>
            <option>TypeScript</option>
            <option>Python</option>
            <option>HTML / CSS</option>
            <option>Markdown</option>
            <option>Plain Text</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Background Card Theme</label>
          <div className="flex items-center gap-1.5 h-8">
            {THEMES.map((theme) => {
              const isSelected = activeTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`w-5 h-5 rounded-full ${theme.bg.split(" ")[0]} border transition ${
                    isSelected ? "ring-2 ring-indigo-500 scale-110" : "opacity-75 hover:opacity-100"
                  }`}
                  title={theme.name}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* The Styled Snippet Container */}
      <div className="flex-1 flex flex-col justify-center py-2">
        <div className={`rounded-xl p-6 transition duration-300 ${activeTheme.bg} shadow-md`}>
          {/* Mock Window Window Head / Header */}
          <div className="bg-zinc-950/85 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 shadow-lg text-left">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-zinc-500 tracking-wide font-medium">
                {fileName}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded uppercase">
                {language}
              </span>
            </div>

            {/* Core code typing space */}
            <div className="flex p-4">
              {/* Line numbers column */}
              <div className="flex flex-col text-right select-none pr-3 mr-3 border-r border-white/5 font-mono text-xs text-zinc-600">
                {snippetText.split("\n").map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>

              {/* Editable code text field */}
              <textarea
                value={snippetText}
                onChange={(e) => setSnippetText(e.target.value)}
                spellCheck={false}
                rows={8}
                className="flex-1 bg-transparent text-xs font-mono text-zinc-200 outline-none border-none resize-none leading-relaxed overflow-x-auto whitespace-pre focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls & Saved list */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <button
          onClick={savePreset}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 transition shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Save Preset</span>
        </button>
      </div>

      {savedPresets.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900">
          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mb-2">
            <Folder className="w-3.5 h-3.5 text-zinc-400" /> Configured Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {savedPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset)}
                className="flex items-center gap-2 text-xs py-1 px-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-150 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition"
              >
                <FileText className="w-3 h-3 text-indigo-500" />
                <span className="font-mono">{preset.title}</span>
                <span
                  onClick={(e) => deletePreset(preset.id, e)}
                  className="text-zinc-400 hover:text-rose-500 pl-1 font-sans text-[10px]"
                >
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
