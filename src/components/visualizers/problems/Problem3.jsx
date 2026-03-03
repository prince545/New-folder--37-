import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function Problem3() {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Hardcoded logic for Longest Substring Without Repeating Characters (s = "abcabcbb")
    // Let's use string "pwwkew"
    const steps = [
        {
            desc: "Input: 'pwwkew'. We need to find the longest substring without repeating characters. We use a Sliding Window approach (left and right pointers) and a Set to track seen characters in the current window.",
            formula: "max_len = 0",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 0, right: 0 },
            scalars: { max_length: 0 },
            charSet: []
        },
        {
            desc: "Add 'p' to our set and expand the window by moving 'right'.",
            formula: "Set does not contain 'p'\\nmax_len = max(0, 1) = 1",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 0, right: 1 },
            scalars: { max_length: 1, current_char: 'p' },
            charSet: ['p']
        },
        {
            desc: "Add 'w' to our set. Expand window.",
            formula: "Set does not contain 'w'\\nmax_len = max(1, 2) = 2",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 0, right: 2 },
            scalars: { max_length: 2, current_char: 'w' },
            charSet: ['p', 'w']
        },
        {
            desc: "Next char is 'w'. Uh oh! It's already in our set. We must shrink the window from the 'left' until 'w' is removed from the set.",
            formula: "Set CONTAINS 'w' !\\nShrinking window: remove 'p'",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 1, right: 2 },
            scalars: { max_length: 2, current_char: 'w', shrinking: true },
            charSet: ['w']
        },
        {
            desc: "Still contains 'w'. Remove the first 'w' from the left to clear the duplicate. Now it's safe to add the new 'w' on the right.",
            formula: "Set CONTAINS 'w' !\\nShrinking window: remove 'w'",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 2, right: 3 },
            scalars: { max_length: 2, current_char: 'w', shrinking: false },
            charSet: ['w']
        },
        {
            desc: "Add 'k' to our set. Expand window.",
            formula: "Set does not contain 'k'\\nmax_len = max(2, 2) = 2",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 2, right: 4 },
            scalars: { max_length: 2, current_char: 'k' },
            charSet: ['w', 'k']
        },
        {
            desc: "Add 'e' to our set. Expand window. The window [w, k, e] is now length 3!",
            formula: "Set does not contain 'e'\\nmax_len = max(2, 3) = 3",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 2, right: 5 },
            scalars: { max_length: 3, current_char: 'e' },
            charSet: ['w', 'k', 'e']
        },
        {
            desc: "Add 'w' to our set. But 'w' is already there, shrink left!",
            formula: "Set CONTAINS 'w' !\\nShrinking window: remove 'w'",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: { left: 3, right: 6 },
            scalars: { max_length: 3, current_char: 'w' },
            charSet: ['k', 'e', 'w']
        },
        {
            desc: "Algorithm completes. The Sliding Window pattern kept our time complexity exactly O(n), bypassing nested loops!",
            formula: "Final max_length = 3\\nSubtitle: 'wke'",
            data: ['p', 'w', 'w', 'k', 'e', 'w'],
            pointers: {},
            scalars: { max_length: 3 },
            charSet: ['k', 'e', 'w']
        }
    ];

    useEffect(() => {
        let timer;
        if (isPlaying && stepIndex < steps.length - 1) {
            timer = setTimeout(() => {
                setStepIndex(s => s + 1);
            }, 3000); // 3s per step
        } else if (stepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, steps.length]);

    const currentStep = steps[stepIndex];

    return (
        <div className="w-full h-full flex flex-col justify-between overflow-y-auto pb-6">
            <div className="bg-gradient-to-r from-orange-900/30 to-rose-900/30 border-l-4 border-orange-500 p-5 rounded-md mb-6 shadow-lg relative mx-4 mt-4">
                <div className="absolute -top-3 left-4 bg-[#0B0C10] px-2 text-xs font-bold text-orange-300">
                    Step {stepIndex + 1} of {steps.length}
                </div>
                <h3 className="text-white text-lg font-medium leading-relaxed">{currentStep.desc}</h3>
                {currentStep.formula && (
                    <div className="mt-4 bg-black/40 border border-white/10 rounded px-4 py-3 font-mono text-pink-300 shadow-inner whitespace-pre-line inline-block">
                        {currentStep.formula}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[300px]">

                {/* Scalars & Character Set */}
                <div className="flex gap-8 mb-12 flex-wrap justify-center items-start w-full px-8">
                    <div className="flex flex-col gap-3">
                        {currentStep.scalars && Object.entries(currentStep.scalars).map(([key, val]) => (
                            <motion.div key={key} layout className={"border px-5 py-3 rounded-lg flex items-center justify-between gap-6 shadow-lg w-64 " + (key === 'shrinking' ? "bg-red-900/40 border-red-500/50" : "bg-[#1A1B2B] border-cyan-500/30")}>
                                <span className={key === 'shrinking' ? "text-red-400 font-bold font-mono" : "text-cyan-400 font-bold font-mono"}>{key}</span>
                                <span className="text-white font-mono text-2xl">{typeof val === 'boolean' ? val.toString() : val}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-[#1A1B2B] border border-orange-500/30 px-6 py-4 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.15)] flex-1 max-w-sm">
                        <div className="text-orange-400 font-bold font-mono mb-3 border-b border-orange-500/30 pb-2">Active Character Set</div>
                        <div className="flex gap-2 flex-wrap h-12">
                            <AnimatePresence>
                                {currentStep.charSet && currentStep.charSet.map((char) => (
                                    <motion.div
                                        key={char}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="bg-black/40 rounded p-2 text-center w-10 border border-white/10 text-white font-bold text-xl shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                    >
                                        {char}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* The "String" Array */}
                <div className="flex justify-center w-full px-6 py-10 bg-black/20 rounded-xl border border-white/5 relative mx-4">

                    {/* Sliding Window Highlight Background Box */}
                    {currentStep.pointers.left !== undefined && currentStep.pointers.right !== undefined && currentStep.pointers.left < currentStep.pointers.right && (
                        <div
                            className="absolute top-6 bottom-6 bg-blue-500/20 border border-blue-400/50 rounded pointer-events-none transition-all duration-300"
                            style={{
                                // Approximating width based on flex gap + size
                                left: `${(currentStep.pointers.left * 76) + 24}px`,
                                width: `${(currentStep.pointers.right - currentStep.pointers.left) * 76}px`,
                            }}
                        />
                    )}

                    <div className="flex gap-3 relative z-10 w-max" style={{ position: 'relative' }}>
                        {currentStep.data.map((val, idx) => {
                            const activePointers = Object.entries(currentStep.pointers || {})
                                .filter(([_, pointerIdx]) => pointerIdx === idx)
                                .map(([name]) => name);
                            const isTarget = activePointers.length > 0;
                            const isLeft = activePointers.includes('left');
                            const isRight = activePointers.includes('right');

                            return (
                                <div key={idx} className="flex flex-col items-center relative w-16">
                                    <AnimatePresence>
                                        {isTarget && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-14 flex flex-col items-center">
                                                <div className={"text-white font-bold px-3 py-1.5 rounded shadow-lg text-sm whitespace-nowrap tracking-wider " + (isLeft ? "bg-cyan-500" : "bg-purple-500")}>
                                                    {activePointers.join(', ')}
                                                </div>
                                                <div className={"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mt-1 " + (isLeft ? "border-t-cyan-500" : "border-t-purple-500")} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div layout className={"w-16 h-16 flex items-center justify-center rounded border-2 transition-all font-mono text-3xl font-bold " +
                                        (isTarget
                                            ? (isLeft ? "bg-cyan-500/20 border-cyan-400 text-white" : "bg-purple-500/20 border-purple-400 text-white")
                                            : "bg-gray-800 border-gray-600 text-gray-300")
                                    }>
                                        {val}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-6 pb-4">
                <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10" onClick={() => { setStepIndex(0); setIsPlaying(false); }}>
                    <RotateCcw size={20} className="text-gray-300" />
                </button>
                <button className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.4)]" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </button>
                <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10" onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} disabled={stepIndex === steps.length - 1}>
                    <SkipForward size={20} className="text-gray-300" />
                </button>
            </div>
        </div>
    );
}
