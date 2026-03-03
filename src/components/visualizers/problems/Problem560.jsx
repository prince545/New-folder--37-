import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function Problem560({ approach = "optimal" }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Reset step index when approach changes
    useEffect(() => {
        setStepIndex(0);
        setIsPlaying(false);
    }, [approach]);

    // BRUTE FORCE LOGIC (O(N^3) or O(N^2))
    const stepsBrute = [
        {
            desc: "Brute Force O(N^2) Approach: We use two nested loops to check all possible subarrays. i marks the start, j traverses to the end.",
            formula: "k = 7",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 0 },
            scalars: { approach: "Brute Force O(N^2)" }
        },
        {
            desc: "For each starting element i, we keep adding elements with j and checking if sum == k.",
            formula: "sum = 3 + 4 = 7 (Found!)",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 0, j: 1 },
            scalars: { sum: 7, count: 1 }
        }
    ];

    // BETTER LOGIC (Prefix Sum Array - O(N^2))
    const stepsBetter = [
        {
            desc: "Better Approach O(N^2): We precompute a prefix sum array. Then check all pairs.",
            formula: "prefix[i] - prefix[j] == k",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 0 },
            scalars: { approach: "Better (Prefix Array)" }
        }
    ];

    // OPTIMAL LOGIC (Prefix Map - O(N))
    const stepsOptimal = [
        {
            desc: "Initial State: We want to find continuous subarrays that sum to k=7. We initialize a running sum and a prefixMap with {0: 1} to handle subarrays starting at index 0.",
            formula: "k = 7",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: {},
            scalars: { running_sum: 0, total_subarrays: 0 },
            prefixMap: { 0: 1 }
        },
        {
            desc: "i=0: Add nums[0] to running_sum. Check if (sum - k) exists in our map.",
            formula: "sum = 0 + 3 = 3\\nsum - k = 3 - 7 = -4 (Not in map)",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 0 },
            scalars: { running_sum: 3, total_subarrays: 0 },
            prefixMap: { 0: 1, 3: 1 }
        },
        {
            desc: "i=1: Add nums[1]=4 to sum. sum is now 7. Is (7 - 7 = 0) in map? Yes! Our map has {0: 1}. This means the subarray right from the start up to index 1 equals 7.",
            formula: "sum = 3 + 4 = 7\\nsum - k = 7 - 7 = 0 (Found in map, freq: 1)",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 1 },
            scalars: { running_sum: 7, total_subarrays: 1 },
            prefixMap: { 0: 1, 3: 1, 7: 1 }
        },
        {
            desc: "i=2: Add nums[2]=7 to sum. sum is now 14. Is (14 - 7 = 7) in our map? Yes, we stored sum=7 at index 1. This means the slice between index 1 and 2 sums to 7!",
            formula: "sum = 7 + 7 = 14\\nsum - k = 14 - 7 = 7 (Found in map, freq: 1)",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 2 },
            scalars: { running_sum: 14, total_subarrays: 2 },
            prefixMap: { 0: 1, 3: 1, 7: 1, 14: 1 }
        },
        {
            desc: "i=3: Add nums[3]=2 to sum. sum is 16. Is (16 - 7 = 9) in map? No.",
            formula: "sum = 14 + 2 = 16\\nsum - k = 16 - 7 = 9 (Not found)",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 3 },
            scalars: { running_sum: 16, total_subarrays: 2 },
            prefixMap: { 0: 1, 3: 1, 7: 1, 14: 1, 16: 1 }
        },
        {
            desc: "i=4: Add nums[4]=-3. sum drops back to 13. (13 - 7 = 6) not in map.",
            formula: "sum = 16 - 3 = 13\\nsum - k = 13 - 7 = 6 (Not found)",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 4 },
            scalars: { running_sum: 13, total_subarrays: 2 },
            prefixMap: { 0: 1, 3: 1, 7: 1, 14: 1, 16: 1, 13: 1 }
        },
        {
            desc: "i=5: Add nums[5]=1. sum is 14. Is (14 - 7 = 7) in map? Yes! {7: 1}. This represents the subarray [2, -3, 1, 4, 2]",
            formula: "sum = 13 + 1 = 14\\nsum - k = 14 - 7 = 7 (Found in map, freq: 1)",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: { i: 5 },
            scalars: { running_sum: 14, total_subarrays: 3 },
            prefixMap: { 0: 1, 3: 1, 7: 1, 14: 2, 16: 1, 13: 1 }
        },
        {
            desc: "Algorithm completes. The Prefix Map gracefully tracked all running sums, allowing an O(N) single-pass lookup!",
            formula: "Total Subarrays = 3",
            data: [3, 4, 7, 2, -3, 1, 4, 2],
            pointers: {},
            scalars: { running_sum: 14, total_subarrays: 3 },
            prefixMap: { 0: 1, 3: 1, 7: 1, 14: 2, 16: 1, 13: 1 }
        }
    ];

    const steps = approach === "brute" ? stepsBrute : approach === "better" ? stepsBetter : stepsOptimal;

    useEffect(() => {
        let timer;
        if (isPlaying && stepIndex < steps.length - 1) {
            timer = setTimeout(() => {
                setStepIndex(s => s + 1);
            }, 3000); // 3s per step to read
        } else if (stepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, steps.length]);

    const currentStep = steps[stepIndex];

    return (
        <div className="w-full h-full flex flex-col justify-between overflow-y-auto pb-6">
            <div className="bg-gradient-to-r from-blue-900/30 to-teal-900/30 border-l-4 border-teal-500 p-5 rounded-md mb-6 shadow-lg relative mx-4 mt-4">
                <div className="absolute -top-3 left-4 bg-[#0B0C10] px-2 text-xs font-bold text-teal-300 uppercase">
                    Step {stepIndex + 1} of {steps.length} | {approach}
                </div>
                <h3 className="text-white text-lg font-medium leading-relaxed">{currentStep.desc}</h3>
                {currentStep.formula && (
                    <div className="mt-4 bg-black/40 border border-white/10 rounded px-4 py-3 font-mono text-pink-300 shadow-inner whitespace-pre-line inline-block">
                        {currentStep.formula}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[300px]">

                {/* Scalars & Prefix Map */}
                <div className="flex gap-8 mb-12 flex-wrap justify-center items-start w-full px-8">
                    <div className="flex flex-col gap-3">
                        {currentStep.scalars && Object.entries(currentStep.scalars).map(([key, val]) => (
                            <motion.div key={key} layout className="bg-[#1A1B2B] border border-cyan-500/30 px-5 py-3 rounded-lg flex items-center justify-between gap-6 shadow-[0_0_15px_rgba(6,182,212,0.15)] w-64">
                                <span className="text-cyan-400 font-bold font-mono">{key}</span>
                                <span className="text-white font-mono text-2xl">{val}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-[#1A1B2B] border border-purple-500/30 px-6 py-4 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.15)] flex-1 max-w-md">
                        <div className="text-purple-400 font-bold font-mono mb-3 border-b border-purple-500/30 pb-2">prefixMap (sum -&gt; count)</div>
                        <div className="grid grid-cols-4 gap-2">
                            {currentStep.prefixMap && Object.entries(currentStep.prefixMap).map(([sum, count]) => (
                                <motion.div key={sum} layout className="bg-black/40 rounded p-2 text-center border border-white/5">
                                    <div className="text-gray-400 text-xs text-center border-b border-white/10 mb-1 pb-1">{sum}</div>
                                    <div className="text-white font-bold">{count}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-end justify-center w-full overflow-x-auto p-6 bg-black/20 rounded-xl border border-white/5 relative mx-4">
                    {currentStep.data.map((val, idx) => {
                        const activePointers = Object.entries(currentStep.pointers || {})
                            .filter(([_, pointerIdx]) => pointerIdx === idx)
                            .map(([name]) => name);
                        const isTarget = activePointers.length > 0;

                        return (
                            <div key={idx} className="flex flex-col items-center gap-3 relative">
                                <AnimatePresence>
                                    {isTarget && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-14 flex flex-col items-center">
                                            <div className="bg-pink-500 text-white font-bold px-3 py-1.5 rounded shadow-lg text-sm whitespace-nowrap tracking-wider">
                                                {activePointers.join(', ')}
                                            </div>
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-pink-500 mt-1" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <motion.div layout className={"w-16 h-16 flex items-center justify-center rounded-xl text-2xl font-bold border-2 transition-all " + (isTarget ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10 scale-110" : "bg-gray-800/80 border-gray-600 text-gray-300")}>
                                    {val}
                                </motion.div>
                                <span className="text-xs text-gray-500 font-mono mt-2 text-center w-full">idx: {idx}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-6 pb-4">
                <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10" onClick={() => { setStepIndex(0); setIsPlaying(false); }}>
                    <RotateCcw size={20} className="text-gray-300" />
                </button>
                <button className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(20,184,166,0.4)]" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </button>
                <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10" onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} disabled={stepIndex === steps.length - 1}>
                    <SkipForward size={20} className="text-gray-300" />
                </button>
            </div>
        </div>
    );
}
