import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, Trash2, Download, Save, Undo, Sparkles, Image as ImageIcon } from "lucide-react";
import { SavedSketch } from "../types";

export default function Sketchpad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#4f46e5"); // indigo-600
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  
  // History for undo
  const [history, setHistory] = useState<string[]>([]);
  const [savedSketches, setSavedSketches] = useState<SavedSketch[]>([]);

  useEffect(() => {
    initCanvas();
    loadSavedSketches();

    // Resize listener with Observer to keep canvas responsive without standard window bounds
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    
    const container = canvasRef.current?.parentElement;
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set display size based on parent container width
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width || 500;
    const height = 320;

    canvas.width = width * 2; // high DPI support
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;

    // Fill white canvas background
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    
    // Save initial state to history
    const initialData = canvas.toDataURL();
    setHistory([initialData]);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    const newWidth = rect?.width || 500;
    const newHeight = 320;

    // Keep current drawing by creating a temporary copy
    const tempImage = new Image();
    const currentData = canvas.toDataURL();
    tempImage.src = currentData;

    tempImage.onload = () => {
      canvas.width = newWidth * 2;
      canvas.height = newHeight * 2;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;

      contextRef.current!.scale(2, 2);
      contextRef.current!.lineCap = "round";
      contextRef.current!.lineJoin = "round";

      // Restore white background and drawing
      contextRef.current!.fillStyle = "#ffffff";
      contextRef.current!.fillRect(0, 0, newWidth, newHeight);
      contextRef.current!.drawImage(tempImage, 0, 0, newWidth, newHeight);
    };
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    let clientX = 0;
    let clientY = 0;

    if (nativeEvent instanceof TouchEvent) {
      if (nativeEvent.touches.length === 0) return;
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
      // Prevent scrolling while sketching on mobile
      nativeEvent.preventDefault();
    } else if (nativeEvent instanceof MouseEvent) {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    // Apply color/brush settings
    contextRef.current.strokeStyle = isEraser ? "#ffffff" : brushColor;
    contextRef.current.lineWidth = brushSize;

    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    let clientX = 0;
    let clientY = 0;

    if (nativeEvent instanceof TouchEvent) {
      if (nativeEvent.touches.length === 0) return;
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
      nativeEvent.preventDefault();
    } else if (nativeEvent instanceof MouseEvent) {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);

    // Push state to undo stack
    const currentData = canvasRef.current.toDataURL();
    setHistory((prev) => {
      const next = [...prev, currentData];
      if (next.length > 20) next.shift(); // Limit history stack to 20
      return next;
    });
  };

  const undo = () => {
    if (history.length <= 1 || !canvasRef.current || !contextRef.current) return;
    
    const prevHistory = [...history];
    prevHistory.pop(); // Remove current state
    const targetState = prevHistory[prevHistory.length - 1];

    const img = new Image();
    img.src = targetState;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      contextRef.current!.fillStyle = "#ffffff";
      contextRef.current!.fillRect(0, 0, w, h);
      contextRef.current!.drawImage(img, 0, 0, w, h);
      
      setHistory(prevHistory);
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    contextRef.current.fillStyle = "#ffffff";
    contextRef.current.fillRect(0, 0, w, h);

    const initialData = canvas.toDataURL();
    setHistory([initialData]);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    const newSketch: SavedSketch = {
      id: Math.random().toString(36).substr(2, 9),
      dataUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [newSketch, ...savedSketches].slice(0, 4); // Store up to 4 sketches
    setSavedSketches(updated);
    localStorage.setItem("saved_sketches", JSON.stringify(updated));
  };

  const loadSavedSketches = () => {
    const stored = localStorage.getItem("saved_sketches");
    if (stored) {
      try {
        setSavedSketches(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const clearGallery = () => {
    setSavedSketches([]);
    localStorage.removeItem("saved_sketches");
  };

  const loadSketchToCanvas = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      contextRef.current!.fillStyle = "#ffffff";
      contextRef.current!.fillRect(0, 0, w, h);
      contextRef.current!.drawImage(img, 0, 0, w, h);

      setHistory((prev) => [...prev, dataUrl]);
    };
  };

  const COLORS = [
    { color: "#4f46e5", label: "Indigo" },
    { color: "#0d9488", label: "Teal" },
    { color: "#e11d48", label: "Rose" },
    { color: "#d97706", label: "Amber" },
    { color: "#18181b", label: "Charcoal" },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 shadow-sm transition">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-5 h-5 text-teal-500" />
          <h2 className="text-base font-sans font-semibold text-zinc-900 dark:text-zinc-50">
            Interactive Sketchpad
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 dark:text-zinc-400 disabled:opacity-35 transition"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-rose-500 transition"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900">
        {/* Colors selector */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((item) => (
            <button
              key={item.color}
              onClick={() => {
                setBrushColor(item.color);
                setIsEraser(false);
              }}
              style={{ backgroundColor: item.color }}
              className={`w-6 h-6 rounded-full border-2 transition ${
                brushColor === item.color && !isEraser
                  ? "border-zinc-900 dark:border-zinc-50 scale-110 shadow"
                  : "border-transparent hover:scale-105"
              }`}
              title={item.label}
            />
          ))}
          <button
            onClick={() => setIsEraser(true)}
            className={`p-1.5 rounded-lg border transition ${
              isEraser
                ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 border-zinc-900"
                : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50"
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Brush Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">Size:</span>
          <div className="flex items-center gap-1">
            {[2, 5, 10, 15].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium flex items-center justify-center transition border ${
                  brushSize === size
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-50"
                    : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drawing Canvas Area */}
      <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden cursor-crosshair bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="block touch-none"
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <button
          onClick={saveToGallery}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold rounded-xl transition shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save to Workspace</span>
        </button>

        <button
          onClick={downloadCanvas}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export PNG</span>
        </button>
      </div>

      {/* Local Gallery */}
      {savedSketches.length > 0 && (
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Saved Board ({savedSketches.length})
            </span>
            <button
              onClick={clearGallery}
              className="text-[10px] font-mono text-rose-500 hover:underline"
            >
              Clear gallery
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {savedSketches.map((sketch) => (
              <button
                key={sketch.id}
                onClick={() => loadSketchToCanvas(sketch.dataUrl)}
                className="group relative aspect-[5/3.2] bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:scale-105 transition duration-200 hover:shadow-sm"
                title={`Load snapshot saved at ${sketch.timestamp}`}
              >
                <img
                  src={sketch.dataUrl}
                  alt="Saved board snapshot"
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-mono font-medium text-white">
                  Load
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
