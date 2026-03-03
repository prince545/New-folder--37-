import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Info } from "lucide-react";

const CHART_PX = 260;

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

// Problem: Longest Common Subsequence (LeetCode 1143)
// Pattern: 2D DP / LCS
// Difficulty: Medium
// Theme: 2D DP table

const VISUALIZATION_STEPS = [
    {
        "desc": "Comparing 'a' with 'a'",
        "formula": "Match! +1",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 0,
            "j": 0
        },
        "scalars": {
            "lcs": 0,
            "match": 1
        }
    },
    {
        "desc": "Comparing 'b' with 'c'",
        "formula": "No match, take max",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 1,
            "j": 1
        },
        "scalars": {
            "lcs": 1,
            "match": 0
        }
    },
    {
        "desc": "Comparing 'c' with 'e'",
        "formula": "No match, take max",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 2,
            "j": 2
        },
        "scalars": {
            "lcs": 2,
            "match": 0
        }
    },
    {
        "desc": "Comparing 'd' with 'e'",
        "formula": "No match, take max",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 3,
            "j": 2
        },
        "scalars": {
            "lcs": 2,
            "match": 0
        }
    },
    {
        "desc": "Comparing 'e' with 'e'",
        "formula": "Match! +1",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 4,
            "j": 2
        },
        "scalars": {
            "lcs": 2,
            "match": 1
        }
    },
    {
        "desc": "Comparing 'e' with 'e'",
        "formula": "Match! +1",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 4,
            "j": 2
        },
        "scalars": {
            "lcs": 2,
            "match": 1
        }
    },
    {
        "desc": "Comparing 'e' with 'e'",
        "formula": "Match! +1",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 4,
            "j": 2
        },
        "scalars": {
            "lcs": 2,
            "match": 1
        }
    },
    {
        "desc": "Comparing 'e' with 'e'",
        "formula": "Match! +1",
        "data": [
            "a",
            "b",
            "c",
            "d",
            "e"
        ],
        "pointers": {
            "i": 4,
            "j": 2
        },
        "scalars": {
            "lcs": 2,
            "match": 1
        }
    }
];

export default function LongestCommonSubsequence() {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMs, setSpeedMs] = useState(1200);
    const [showInfo, setShowInfo] = useState(true);

    const maxIndex = VISUALIZATION_STEPS.length - 1;
    const currentStep = VISUALIZATION_STEPS[stepIndex] || VISUALIZATION_STEPS[0];
    const maxValue = Math.max(...currentStep.data.filter(v => typeof v === 'number'));

    useEffect(() => {
        let timer;
        if (isPlaying && stepIndex < maxIndex) {
            timer = setTimeout(() => setStepIndex(s => s + 1), speedMs);
        } else if (stepIndex >= maxIndex) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, maxIndex, speedMs]);

    const renderData = () => {
        return (
            <div className="flex items-end justify-center gap-2 overflow-x-auto py-4">
                {currentStep.data.map((val, idx) => {
                    const isActive = Object.values(currentStep.pointers || {}).includes(idx);
                    const pointerName = Object.keys(currentStep.pointers || {}).find(key => currentStep.pointers[key] === idx);
                    
                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="relative w-12" style={{ height: CHART_PX }}>
                                {/* Value bar */}
                                <motion.div
                                    animate={{ height: (Math.abs(val) / maxValue) * CHART_PX }}
                                    transition={{ duration: 0.35 }}
                                    className={`absolute bottom-0 left-0 right-0 rounded-t-md border ${
                                        isActive 
                                            ? "bg-gradient-to-t from-purple-500 to-pink-500 border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
                                            : "bg-gradient-to-t from-cyan-500 to-blue-500 border-cyan-300"
                                    }`}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white">
                                        {val}
                                    </div>
                                </motion.div>

                                {/* Pointer indicator */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute -top-12 left-1/2 -translate-x-1/2"
                                        >
                                            <div className="bg-pink-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                                {pointerName} ↑
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className="mt-2 text-xs text-gray-400 font-mono">{idx}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col justify-between overflow-y-auto pb-6">
            {/* Info Panel */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-l-4 border-blue-400 p-5 rounded-md mb-6 shadow-lg relative mx-4 mt-4">
                <div className="absolute -top-3 left-4 bg-[#0B0C10] px-2 text-xs font-bold text-blue-300">
                    Step {stepIndex + 1} of {VISUALIZATION_STEPS.length}
                </div>
                
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-white text-lg font-medium leading-relaxed pr-8">
                            {currentStep.desc}
                        </h3>
                        
                        <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                2D DP / LCS
                            </span>
                            <span className={`text-xs ${
                                'Medium' === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                'Medium' === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                            } px-2 py-1 rounded`}>
                                Medium
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Info size={16} className={showInfo ? "text-cyan-400" : "text-gray-500"} />
                    </button>
                </div>
                
                {showInfo && currentStep.formula && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 bg-black/40 border border-white/10 rounded px-4 py-3 font-mono text-pink-300 shadow-inner"
                    >
                        {currentStep.formula}
                    </motion.div>
                )}

                {/* Scalars Display */}
                {currentStep.scalars && Object.keys(currentStep.scalars).length > 0 && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                        {Object.entries(currentStep.scalars).map(([key, val]) => (
                            <motion.div 
                                key={key}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="bg-black/40 border border-cyan-500/30 px-3 py-2 rounded-lg"
                            >
                                <span className="text-cyan-400 text-xs mr-2">{key}:</span>
                                <span className="text-white font-mono">{String(val)}</span>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Speed Control */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-white/70">Speed</span>
                        <select
                            value={speedMs}
                            onChange={(e) => setSpeedMs(Number(e.target.value))}
                            className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white"
                        >
                            <option value={1800}>0.7×</option>
                            <option value={1200}>1×</option>
                            <option value={800}>1.5×</option>
                            <option value={500}>2.4×</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-black/20 p-4">
                    {renderData()}

                    {/* Step Scrubber */}
                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-xs text-white/60 font-mono">
                            {stepIndex + 1}/{VISUALIZATION_STEPS.length}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={maxIndex}
                            value={stepIndex}
                            onChange={(e) => {
                                setIsPlaying(false);
                                setStepIndex(Number(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            aria-label="Step scrubber"
                        />
                    </div>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="mt-4 flex justify-center gap-6 pb-4">
                <button
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    onClick={() => { setStepIndex(0); setIsPlaying(false); }}
                >
                    <RotateCcw size={20} className="text-gray-300" />
                </button>
                
                <button
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    onClick={() => setStepIndex(s => clamp(s - 1, 0, maxIndex))}
                    disabled={stepIndex === 0}
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
                    onClick={() => setStepIndex(s => clamp(s + 1, 0, maxIndex))}
                    disabled={stepIndex === maxIndex}
                >
                    <SkipForward size={20} className="text-gray-300" />
                </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="text-center text-[10px] text-gray-600">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Space</kbd> play/pause · 
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded ml-1">←</kbd>/<kbd className="px-1.5 py-0.5 bg-gray-800 rounded">→</kbd> step ·
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded ml-1">H</kbd> toggle info
            </div>
        </div>
    );
}
