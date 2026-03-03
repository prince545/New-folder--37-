import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function Problem20({ approach = "optimal" }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Reset step index when approach changes
    useEffect(() => {
        setStepIndex(0);
        setIsPlaying(false);
    }, [approach]);

    // BRUTE FORCE LOGIC
    const stepsBrute = [
        { desc: "Brute Force approach for Valid Parentheses", data: [1, 2, 3, 4], pointers: { i: 0 }, scalars: { approach: "Brute Force O(N^2) or worse" } },
        { desc: "Nested loops processing...", data: [1, 2, 3, 4], pointers: { i: 0, j: 1 }, scalars: { approach: "Brute Force" } }
    ];

    // BETTER LOGIC
    const stepsBetter = [
        { desc: "Better approach for Valid Parentheses", data: [1, 2, 3, 4], pointers: { i: 0 }, scalars: { approach: "Better (e.g. O(N log N))" } },
        { desc: "Optimizing state...", data: [1, 2, 3, 4], pointers: { i: 0, j: 1 }, scalars: { approach: "Better" } }
    ];

    // OPTIMAL LOGIC
    const stepsOptimal = [
        { desc: "Optimal approach for Valid Parentheses", data: [1, 2, 3, 4], pointers: { left: 0, right: 3 }, scalars: { approach: "Optimal O(N)" } },
        { desc: "Directly solving...", data: [1, 2, 3, 4], pointers: { left: 1, right: 2 }, scalars: { approach: "Optimal" } }
    ];

    const steps = approach === "brute" ? stepsBrute : approach === "better" ? stepsBetter : stepsOptimal;

    useEffect(() => {
        let timer;
        if (isPlaying && stepIndex < steps.length - 1) {
            timer = setTimeout(() => {
                setStepIndex(s => s + 1);
            }, 1000);
        } else if (stepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, steps.length]);

    const currentStep = steps[stepIndex] || steps[0];

    return (
        <div className="w-full h-full flex flex-col justify-between overflow-y-auto pb-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-l-4 border-purple-500 p-5 rounded-md mb-6 shadow-lg relative mx-4 mt-4">
                <div className="absolute -top-3 left-4 bg-[#0B0C10] px-2 text-xs font-bold text-purple-300">
                    Step {stepIndex + 1} of {steps.length} | {approach.toUpperCase()}
                </div>
                <h3 className="text-white text-lg font-medium">{currentStep.desc}</h3>
                {currentStep.formula && (
                    <div className="mt-4 bg-black/40 border border-white/10 rounded px-4 py-2 font-mono text-pink-300 shadow-inner inline-block">
                        {currentStep.formula}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[300px]">
                {currentStep.scalars && Object.keys(currentStep.scalars).length > 0 && (
                    <div className="flex gap-4 mb-8 flex-wrap justify-center">
                        {Object.entries(currentStep.scalars).map(([key, val]) => (
                            <motion.div key={key} layout className="bg-[#1A1B2B] border border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                                <span className="text-cyan-400 font-bold font-mono">{key}</span>
                                <span className="text-white font-mono text-lg">{val}</span>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 items-end justify-center w-full overflow-x-auto p-4 bg-black/20 rounded-xl border border-white/5 relative">
                    {/* Render Grid or Array conditionally */}
                    {Array.isArray(currentStep.data[0]) ? (
                        <div className="flex flex-col gap-2 relative mt-4">
                            {currentStep.data.map((row, rIdx) => (
                                <div key={rIdx} className="flex gap-2">
                                    {row.map((val, cIdx) => {
                                        const activePointers = Object.entries(currentStep.pointers || {})
                                            .filter(([_, pointerVal]) => {
                                                if (typeof pointerVal === 'object' && pointerVal !== null) {
                                                    const pr = pointerVal.r !== undefined ? pointerVal.r : pointerVal[0];
                                                    const pc = pointerVal.c !== undefined ? pointerVal.c : pointerVal[1];
                                                    return pr === rIdx && pc === cIdx;
                                                }
                                                return String(pointerVal) === `${rIdx},${cIdx}`;
                                            })
                                            .map(([name]) => name);

                                        const isTarget = activePointers.length > 0;

                                        return (
                                            <div key={`${rIdx}-${cIdx}`} className="relative">
                                                 <AnimatePresence>
                                                    {isTarget && (
                                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                                                            <div className="bg-pink-500 text-white font-bold px-2 py-0.5 rounded shadow-lg text-[10px] whitespace-nowrap">
                                                                {activePointers.join(', ')}
                                                            </div>
                                                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-pink-500 mt-0.5" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                <motion.div layout className={"w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold border-2 transition-all " + (isTarget ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] z-10 scale-110" : "bg-gray-800/80 border-gray-600 text-gray-300")}>
                                                    {val}
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ) : (
                        currentStep.data.map((val, idx) => {
                            const activePointers = Object.entries(currentStep.pointers || {})
                                .filter(([_, pointerIdx]) => pointerIdx === idx)
                                .map(([name]) => name);
                            const isTarget = activePointers.length > 0;

                            return (
                                <div key={idx} className="flex flex-col items-center gap-3 relative w-16">
                                    <AnimatePresence>
                                        {isTarget && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-12 flex flex-col items-center">
                                                <div className="bg-pink-500 text-white font-bold px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                                                    {activePointers.join(', ')}
                                                </div>
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-pink-500 mt-1" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <motion.div layout className={"w-16 h-16 flex items-center justify-center rounded-xl text-xl font-bold border-2 transition-all " + (isTarget ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10 scale-110" : "bg-gray-800/80 border-gray-600 text-gray-300")}>
                                        {val}
                                    </motion.div>
                                    <span className="text-xs text-gray-500 font-mono mt-1">{idx}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-6">
                <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10" onClick={() => { setStepIndex(0); setIsPlaying(false); }}>
                    <RotateCcw size={20} className="text-gray-300" />
                </button>
                <button className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </button>
                <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10" onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} disabled={stepIndex === steps.length - 1}>
                    <SkipForward size={20} className="text-gray-300" />
                </button>
            </div>
        </div>
    );
}
