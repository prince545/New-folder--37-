import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";

export default function DynamicVisualizer({ steps, error }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMs, setSpeedMs] = useState(2000);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-400 p-6 text-center">
                <AlertTriangle size={48} className="mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2">Visualization Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!steps || steps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>No visualization steps loaded.</p>
                <p className="text-sm mt-2">Run your code with Gemini AI enabled to generate steps.</p>
            </div>
        );
    }

    const maxIndex = Math.max(0, (steps?.length || 1) - 1);
    const safeIndex = Math.max(0, Math.min(stepIndex, maxIndex));
    const currentStep = steps[safeIndex];

    useEffect(() => {
        setStepIndex(0);
        setIsPlaying(false);
    }, [steps]);

    useEffect(() => {
        let timer;
        if (isPlaying && safeIndex < steps.length - 1) {
            timer = setTimeout(() => {
                setStepIndex(s => s + 1);
            }, speedMs);
        } else if (safeIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, safeIndex, speedMs, steps.length]);

    return (
        <div className="visualizer-wrapper w-full h-full flex flex-col justify-between overflow-y-auto pb-6">
            <div className="visualizer-info bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-l-4 border-blue-400 p-5 rounded-md mb-6 shadow-lg relative">
                <div className="absolute -top-3 left-4 bg-[#0B0C10] px-2 text-xs font-bold text-blue-300">
                    Step {safeIndex + 1} of {steps.length}
                </div>
                <h3 className="text-white text-lg font-medium leading-relaxed">{currentStep.desc}</h3>

                {/* Mathematical Formula Display */}
                {currentStep.formula && (
                    <div className="mt-4 bg-black/40 border border-white/10 rounded px-4 py-2 font-mono text-pink-300 shadow-inner">
                        {currentStep.formula}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[300px]">
                {/* Scalar Variables Display */}
                {currentStep.scalars && Object.keys(currentStep.scalars).length > 0 && (
                    <div className="flex gap-4 mb-8 flex-wrap justify-center">
                        {Object.entries(currentStep.scalars).map(([key, val]) => (
                            <motion.div
                                key={key}
                                layout
                                className="bg-[#1A1B2B] border border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                            >
                                <span className="text-cyan-400 font-bold font-mono">{key}</span>
                                <span className="text-white font-mono text-lg">{typeof val === 'object' ? JSON.stringify(val) : val}</span>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Render Array if data is present */}
                {Array.isArray(currentStep.data) && currentStep.data.length > 0 && (
                    <div className="flex gap-3 items-end justify-center w-full overflow-x-auto p-4 bg-black/20 rounded-xl border border-white/5 relative">
                        {currentStep.data.map((val, idx) => {
                            // Determine if this index has a pointer pointing to it
                            const activePointers = Object.entries(currentStep.pointers || {})
                                .filter(([_, pointerIdx]) => pointerIdx === idx)
                                .map(([name]) => name);

                            const isTarget = activePointers.length > 0;

                            return (
                                <div key={idx} className="flex flex-col items-center gap-3 relative">
                                    <AnimatePresence>
                                        {isTarget && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute -top-12 flex flex-col items-center"
                                            >
                                                <div className="bg-pink-500 text-white font-bold px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                                                    {activePointers.join(', ')}
                                                </div>
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-pink-500 mt-1" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div
                                        layout
                                        className={"w-16 h-16 flex items-center justify-center rounded-xl text-xl font-bold border-2 transition-all " +
                                            (isTarget ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10 scale-110" : "bg-gray-800/80 border-gray-600 text-gray-300")}
                                    >
                                        {typeof val === 'object' ? JSON.stringify(val) : val}
                                    </motion.div>
                                    <span className="text-xs text-gray-500 font-mono mt-1">{idx}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Step scrubber */}
                <div className="mt-6 w-full max-w-3xl flex items-center gap-3">
                    <span className="text-xs text-white/60 font-semibold">
                        {safeIndex + 1}/{steps.length}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={steps.length - 1}
                        value={safeIndex}
                        onChange={(e) => {
                            setIsPlaying(false);
                            setStepIndex(Number(e.target.value));
                        }}
                        className="w-full"
                        aria-label="Step scrubber"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">Speed</span>
                        <select
                            value={speedMs}
                            onChange={(e) => setSpeedMs(Number(e.target.value))}
                            className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white"
                        >
                            <option value={3200}>0.6×</option>
                            <option value={2000}>1×</option>
                            <option value={1200}>1.7×</option>
                            <option value={750}>2.6×</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="visualizer-controls mt-4 flex justify-center gap-6">
                <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10" onClick={() => { setStepIndex(0); setIsPlaying(false); }}>
                    <RotateCcw size={20} className="text-gray-300" />
                </button>
                <button
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    onClick={() => {
                        setIsPlaying(false);
                        setStepIndex((s) => Math.max(0, s - 1));
                    }}
                    disabled={safeIndex === 0}
                >
                    <SkipBack size={20} className="text-gray-300" />
                </button>
                <button
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </button>
                <button
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}
                    disabled={safeIndex === steps.length - 1}
                >
                    <SkipForward size={20} className="text-gray-300" />
                </button>
            </div>
        </div>
    );
}
