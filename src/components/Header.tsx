import React, { useState, useEffect } from "react";
import { Sparkles, Edit2, Check, Clock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Header() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("workspace_user_name") || "Creative Thinker";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      setUserName(trimmed);
      localStorage.setItem("workspace_user_name", trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setTempName(userName);
      setIsEditing(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <header className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Creative Hub</span>
        </div>
        
        <div className="flex items-center gap-2 group mt-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyDown}
                className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-indigo-500 focus:outline-none px-1 py-0.5 max-w-[240px] md:max-w-sm rounded"
                autoFocus
                maxLength={25}
              />
              <button
                onClick={handleSaveName}
                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md transition"
                title="Save name"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Welcome back, {userName}
              </h1>
              <button
                onClick={() => {
                  setTempName(userName);
                  setIsEditing(true);
                }}
                className="p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded transition duration-200"
                title="Edit name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your client-side digital workstation for focus, code, sketching, and showcases.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        {/* Date Display */}
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 px-3 py-1.5 rounded-lg">
          <span>{formatDate(currentTime)}</span>
        </div>

        {/* Local Clock */}
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 px-3 py-1.5 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{formatTime(currentTime)}</span>
        </div>

        {/* Workspace State */}
        <div className="hidden sm:flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>ONLINE</span>
        </div>
      </div>
    </header>
  );
}
