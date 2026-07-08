import React, { useState, useEffect, useRef } from "react";
import { Play, Square, RefreshCw, Wind, Moon, Sun, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BreathingMode } from "../types";

const BREATHING_MODES: BreathingMode[] = [
  {
    id: "box",
    name: "Box Breathing",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: "Ideal for clearing stress and leveling concentration.",
  },
  {
    id: "relax",
    name: "Deep Relax (4-7-8)",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: "Calms the nervous system and grounds your mood.",
  },
  {
    id: "energize",
    name: "Vibrant Energy",
    inhale: 3,
    hold1: 1,
    exhale: 3,
    hold2: 1,
    description: "A fast rhythm to spark creativity and focus.",
  },
];

export default function ZenBreathing() {
  const [selectedMode, setSelectedMode] = useState<BreathingMode>(BREATHING_MODES[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [secondsRemaining, setSecondsRemaining] = useState(selectedMode.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const activeModeRef = useRef(selectedMode);
  const phaseRef = useRef(phase);
  const secondsRemainingRef = useRef(secondsRemaining);

  useEffect(() => {
    activeModeRef.current = selectedMode;
  }, [selectedMode]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    secondsRemainingRef.current = secondsRemaining;
  }, [secondsRemaining]);

  // Reset breathing state when selecting a different mode
  useEffect(() => {
    setIsActive(false);
    setPhase("inhale");
    setSecondsRemaining(selectedMode.inhale);
    setCyclesCompleted(0);
  }, [selectedMode]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
        const currentSecs = secondsRemainingRef.current;
        const currentPhase = phaseRef.current;
        const currentMode = activeModeRef.current;

        if (currentSecs > 1) {
          setSecondsRemaining(currentSecs - 1);
        } else {
          // Transition phase
          let nextPhase: "inhale" | "hold1" | "exhale" | "hold2" = "inhale";
          let nextDuration = 0;

          if (currentPhase === "inhale") {
            if (currentMode.hold1 > 0) {
              nextPhase = "hold1";
              nextDuration = currentMode.hold1;
            } else {
              nextPhase = "exhale";
              nextDuration = currentMode.exhale;
            }
          } else if (currentPhase === "hold1") {
            nextPhase = "exhale";
            nextDuration = currentMode.exhale;
          } else if (currentPhase === "exhale") {
            if (currentMode.hold2 > 0) {
              nextPhase = "hold2";
              nextDuration = currentMode.hold2;
            } else {
              nextPhase = "inhale";
              nextDuration = currentMode.inhale;
              setCyclesCompleted((prev) => prev + 1);
            }
          } else if (currentPhase === "hold2") {
            nextPhase = "inhale";
            nextDuration = currentMode.inhale;
            setCyclesCompleted((prev) => prev + 1);
          }

          setPhase(nextPhase);
          setSecondsRemaining(nextDuration);
        }
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setSecondsRemaining(selectedMode.inhale);
    setCyclesCompleted(0);
  };

  // Visual text and color options based on stage
  const getPhaseDetails = () => {
    switch (phase) {
      case "inhale":
        return {
          text: "Inhale",
          instruction: "Fill your lungs with inspiration",
          color: "text-indigo-600 dark:text-indigo-400 border-indigo-400",
          ringColor: "bg-indigo-500/10 border-indigo-500/30",
          scale: 1.4,
          duration: selectedMode.inhale,
        };
      case "hold1":
        return {
          text: "Hold",
          instruction: "Savor the quiet moment",
          color: "text-amber-600 dark:text-amber-400 border-amber-400",
          ringColor: "bg-amber-500/10 border-amber-500/30",
          scale: 1.4,
          duration: selectedMode.hold1,
        };
      case "exhale":
        return {
          text: "Exhale",
          instruction: "Release any pressure and tension",
          color: "text-teal-600 dark:text-teal-400 border-teal-400",
          ringColor: "bg-teal-500/10 border-teal-500/30",
          scale: 1.0,
          duration: selectedMode.exhale,
        };
      case "hold2":
        return {
          text: "Hold",
          instruction: "Prepare to receive",
          color: "text-rose-600 dark:text-rose-400 border-rose-400",
          ringColor: "bg-rose-500/10 border-rose-500/30",
          scale: 1.0,
          duration: selectedMode.hold2,
        };
    }
  };

  const details = getPhaseDetails();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 shadow-sm transition">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-sans font-semibold text-zinc-900 dark:text-zinc-50">
            Focus & Breath Space
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded-md text-xs font-mono text-zinc-500">
          <span>Cycles: {cyclesCompleted}</span>
        </div>
      </div>

      {/* Mode selection buttons */}
      <div className="grid grid-cols-3 gap-1.5 mb-6">
        {BREATHING_MODES.map((mode) => {
          const isSelected = selectedMode.id === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode)}
              disabled={isActive}
              className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition flex flex-col items-center justify-center gap-1 border ${
                isSelected
                  ? "bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50 text-white dark:text-zinc-950 shadow-sm"
                  : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {mode.id === "box" && <Moon className="w-3.5 h-3.5" />}
              {mode.id === "relax" && <Sun className="w-3.5 h-3.5" />}
              {mode.id === "energize" && <Flame className="w-3.5 h-3.5" />}
              <span className="truncate max-w-full px-1">{mode.name}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mb-6 leading-relaxed italic min-h-[32px]">
        "{selectedMode.description}"
      </p>

      {/* Animated breathing sphere */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
        <div className="w-48 h-48 flex items-center justify-center relative">
          {/* Pulsing ring in background */}
          <motion.div
            animate={{
              scale: isActive ? details.scale : 1.0,
            }}
            transition={{
              duration: details.duration,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 rounded-full border-2 transition-colors duration-1000 ${details.ringColor}`}
          />

          {/* Core sphere */}
          <motion.div
            animate={{
              scale: isActive ? details.scale : 1.0,
            }}
            transition={{
              duration: details.duration,
              ease: "easeInOut",
            }}
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 shadow-lg bg-zinc-50 dark:bg-zinc-900 z-10 transition-all duration-1000 ${details.color}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={phase + isActive}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col items-center text-center px-4"
              >
                <span className="text-xl md:text-2xl font-sans font-black tracking-tight uppercase">
                  {isActive ? details.text : "Ready"}
                </span>
                <span className="text-3xl font-mono font-bold mt-1">
                  {isActive ? secondsRemaining : "0"}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Guided instruction text */}
        <div className="text-center mt-6 h-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase + isActive}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300 px-4"
            >
              {isActive ? details.instruction : "Click Start to begin breathing cycles"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <button
          onClick={handleToggle}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition shadow-sm ${
            isActive
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isActive ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Breath</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl border border-zinc-150 dark:border-zinc-800 transition"
          title="Reset sequence"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
