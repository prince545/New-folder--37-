import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    Pause,
    Play,
    RotateCcw,
    SkipBack,
    SkipForward,
    Info,
    Code,
    Eye,
    EyeOff,
    Download,
    Maximize2,
    Minimize2,
    BookOpen,
    Sparkles,
    BarChart,
    Clock,
    Cpu,
    Zap,
    ChevronLeft,
    ChevronRight,
    HelpCircle
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Card } from "../ui/card";

// Helper function to format values
const formatValue = (val) => {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'string') return val;
    return String(val);
};

// Color-coded pointer badges
const PointerBadge = ({ name, color = "pink" }) => {
    const colors = {
        pink: "bg-pink-500 text-white border-pink-400",
        cyan: "bg-cyan-500 text-white border-cyan-400",
        purple: "bg-purple-500 text-white border-purple-400",
        green: "bg-green-500 text-white border-green-400",
        yellow: "bg-yellow-500 text-white border-yellow-400",
        blue: "bg-blue-500 text-white border-blue-400"
    };

    return (
        <span className={`${colors[color] || colors.pink} px-2 py-0.5 rounded-full text-xs font-bold border shadow-lg`}>
            {name}
        </span>
    );
};

// Step explanation card with enhanced formatting
const StepExplanation = ({ step, currentStep, totalSteps }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 border-l-4 border-blue-400 p-5 rounded-lg mb-6 shadow-lg relative"
        >
            {/* Step indicator */}
            <div className="absolute -top-3 left-4 bg-[#0B0C10] px-3 py-1 rounded-full border border-blue-400/30">
                <span className="text-xs font-bold text-blue-300">
                    Step {currentStep} / {totalSteps}
                </span>
            </div>

            {/* Expand/Collapse button */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Main description */}
            <h3 className="text-white text-lg font-medium leading-relaxed pr-8">
                {step.desc}
            </h3>

            {/* Expanded content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {/* Formula with syntax highlighting */}
                        {step.formula && (
                            <div className="mt-4 bg-black/60 border border-cyan-500/30 rounded-lg overflow-hidden">
                                <div className="bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 font-mono border-b border-cyan-500/30">
                                    Formula
                                </div>
                                <div className="px-4 py-3 font-mono text-cyan-300">
                                    {step.formula}
                                </div>
                            </div>
                        )}

                        {/* Additional context if available */}
                        {step.note && (
                            <div className="mt-3 text-sm text-gray-400 italic border-l-2 border-gray-600 pl-3">
                                💡 {step.note}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick action buttons */}
            <div className="mt-3 flex gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs bg-white/5 hover:bg-white/10"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? <EyeOff size={12} className="mr-1" /> : <Eye size={12} className="mr-1" />}
                    {expanded ? 'Less' : 'More'}
                </Button>
                {step.complexity && (
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                        <Cpu size={10} className="mr-1" /> {step.complexity}
                    </Badge>
                )}
            </div>
        </motion.div>
    );
};

// Scalar values display with animations
const ScalarDisplay = ({ scalars }) => {
    return (
        <div className="flex gap-3 mb-6 flex-wrap justify-center">
            <AnimatePresence>
                {Object.entries(scalars).map(([key, val], index) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative bg-[#1A1B2B] border border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg">
                            <span className="text-cyan-400 font-bold font-mono text-sm">{key}</span>
                            <span className="text-white font-mono text-lg">{formatValue(val)}</span>

                            {/* Value change indicator */}
                            {val !== scalars[key] && (
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full text-[10px] flex items-center justify-center"
                                >
                                    ↑
                                </motion.span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Array/Grid visualization with enhanced features
const DataVisualization = ({ data, pointers = {}, stepIndex }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Determine if it's a 2D grid
    const is2D = Array.isArray(data[0]);

    // Get pointer color based on name
    const getPointerColor = (pointerName) => {
        const colors = ['pink', 'cyan', 'purple', 'green', 'yellow', 'blue'];
        const hash = pointerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    if (is2D) {
        return (
            <div className="flex flex-col gap-2 relative">
                {data.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-2 justify-center">
                        {row.map((val, cIdx) => {
                            // Find all pointers pointing to this cell
                            const activePointers = Object.entries(pointers)
                                .filter(([_, p]) => {
                                    if (typeof p === 'object' && p !== null) {
                                        const pr = p.r ?? p[0];
                                        const pc = p.c ?? p[1];
                                        return pr === rIdx && pc === cIdx;
                                    }
                                    return p === `${rIdx},${cIdx}`;
                                })
                                .map(([name]) => name);

                            const isTarget = activePointers.length > 0;
                            const isHovered = hoveredIndex === `${rIdx}-${cIdx}`;

                            return (
                                <motion.div
                                    key={`${rIdx}-${cIdx}`}
                                    layout
                                    className="relative"
                                    onHoverStart={() => setHoveredIndex(`${rIdx}-${cIdx}`)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                >
                                    {/* Pointer labels */}
                                    <AnimatePresence>
                                        {(isTarget || isHovered) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
                                            >
                                                <div className="flex gap-1">
                                                    {activePointers.map(name => (
                                                        <PointerBadge
                                                            key={name}
                                                            name={name}
                                                            color={getPointerColor(name)}
                                                        />
                                                    ))}
                                                    {isHovered && !isTarget && (
                                                        <span className="bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs">
                                                            [{rIdx},{cIdx}]
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[5px] border-t-pink-500 mt-0.5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Cell */}
                                    <motion.div
                                        className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg text-lg md:text-xl font-bold border-2 transition-all ${isTarget
                                                ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-110"
                                                : isHovered
                                                    ? "bg-gray-700/80 border-gray-500 text-gray-200 scale-105"
                                                    : "bg-gray-800/80 border-gray-600 text-gray-300"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {formatValue(val)}
                                    </motion.div>

                                    {/* Index label */}
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">
                                        {rIdx},{cIdx}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    }

    // 1D Array visualization
    return (
        <div className="flex gap-3 items-end justify-center flex-wrap">
            {data.map((val, idx) => {
                const activePointers = Object.entries(pointers)
                    .filter(([_, p]) => p === idx)
                    .map(([name]) => name);

                const isTarget = activePointers.length > 0;
                const isHovered = hoveredIndex === idx;

                return (
                    <motion.div
                        key={idx}
                        layout
                        className="flex flex-col items-center gap-2 relative"
                        onHoverStart={() => setHoveredIndex(idx)}
                        onHoverEnd={() => setHoveredIndex(null)}
                    >
                        {/* Pointer labels */}
                        <AnimatePresence>
                            {(isTarget || isHovered) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -top-12 flex flex-col items-center"
                                >
                                    <div className="flex gap-1">
                                        {activePointers.map(name => (
                                            <PointerBadge key={name} name={name} color={getPointerColor(name)} />
                                        ))}
                                        {isHovered && !isTarget && (
                                            <span className="bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs">
                                                index {idx}
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-pink-500 mt-1" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Value box */}
                        <motion.div
                            className={`w-16 h-16 flex items-center justify-center rounded-xl text-xl font-bold border-2 transition-all ${isTarget
                                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110"
                                    : isHovered
                                        ? "bg-gray-700/80 border-gray-500 text-gray-200 scale-105"
                                        : "bg-gray-800/80 border-gray-600 text-gray-300"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {formatValue(val)}
                        </motion.div>

                        {/* Index label */}
                        <span className="text-xs text-gray-500 font-mono">{idx}</span>

                        {/* Value change animation */}
                        <AnimatePresence>
                            {stepIndex > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -bottom-6 text-[10px] text-green-400"
                                >
                                    {val}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};

// Speed control with presets
const SpeedControl = ({ speedMs, onSpeedChange }) => {
    const speeds = [
        { value: 3200, label: '0.6×', icon: '🐢' },
        { value: 2000, label: '1×', icon: '⚡' },
        { value: 1200, label: '1.7×', icon: '🚀' },
        { value: 750, label: '2.6×', icon: '⚡' }
    ];

    return (
        <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <select
                value={speedMs}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
                {speeds.map(s => (
                    <option key={s.value} value={s.value}>
                        {s.icon} {s.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Main component
export default function DynamicVisualizer({ steps, error }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMs, setSpeedMs] = useState(2000);
    const [showInfo, setShowInfo] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);
    const containerRef = useRef(null);

    // Error state
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-red-400 p-6 text-center"
            >
                <AlertTriangle size={64} className="mb-4 text-red-500 animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">Visualization Error</h3>
                <p className="text-gray-400 max-w-md">{error}</p>
                <Button
                    variant="outline"
                    className="mt-6 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => window.location.reload()}
                >
                    <RotateCcw size={14} className="mr-2" /> Retry
                </Button>
            </motion.div>
        );
    }

    // Empty state
    if (!steps || steps.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center"
            >
                <BookOpen size={64} className="mb-4 text-gray-600" />
                <h3 className="text-xl font-bold mb-2">Ready to Visualize</h3>
                <p className="text-sm max-w-md">
                    Click "Generate Trace" with your code and Gemini API key to see step-by-step execution.
                </p>
                <div className="mt-6 flex gap-2 text-xs">
                    <Badge variant="outline" className="border-purple-500/30">
                        <Sparkles size={10} className="mr-1" /> AI-Powered
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500/30">
                        <Cpu size={10} className="mr-1" /> Real-time
                    </Badge>
                </div>
            </motion.div>
        );
    }

    const maxIndex = steps.length - 1;
    const safeIndex = Math.min(stepIndex, maxIndex);
    const currentStep = steps[safeIndex];

    // Reset when steps change
    useEffect(() => {
        setStepIndex(0);
        setIsPlaying(false);
    }, [steps]);

    // Auto-play effect
    useEffect(() => {
        let timer;
        if (isPlaying && safeIndex < maxIndex) {
            timer = setTimeout(() => {
                setStepIndex(s => s + 1);
            }, speedMs);
        } else if (safeIndex >= maxIndex) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, safeIndex, speedMs, maxIndex]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(p => !p);
            } else if (e.key === 'ArrowLeft') {
                setStepIndex(s => Math.max(0, s - 1));
                setIsPlaying(false);
            } else if (e.key === 'ArrowRight') {
                setStepIndex(s => Math.min(maxIndex, s + 1));
                setIsPlaying(false);
            } else if (e.key === 'Home') {
                setStepIndex(0);
                setIsPlaying(false);
            } else if (e.key === 'End') {
                setStepIndex(maxIndex);
                setIsPlaying(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [maxIndex]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    }, []);

    return (
        <TooltipProvider>
            <div
                ref={containerRef}
                className={`visualizer-wrapper w-full h-full flex flex-col transition-all ${fullscreen ? 'fixed inset-0 z-50 bg-[#0B0C10] p-6' : ''
                    }`}
            >
                {/* Header with controls */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-blue-500/30">
                            <BarChart size={12} className="mr-1" /> {steps.length} Steps
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setShowInfo(!showInfo)}
                        >
                            <Info size={14} className={showInfo ? "text-cyan-400" : "text-gray-500"} />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <SpeedControl speedMs={speedMs} onSpeedChange={setSpeedMs} />
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleFullscreen}>
                            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </Button>
                    </div>
                </div>

                {/* Step explanation */}
                {showInfo && (
                    <StepExplanation
                        step={currentStep}
                        currentStep={safeIndex + 1}
                        totalSteps={steps.length}
                    />
                )}

                {/* Main visualization area */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[300px]">
                    {/* Scalar values */}
                    {currentStep.scalars && Object.keys(currentStep.scalars).length > 0 && (
                        <ScalarDisplay scalars={currentStep.scalars} />
                    )}

                    {/* Data visualization */}
                    {Array.isArray(currentStep.data) && currentStep.data.length > 0 && (
                        <div className="w-full overflow-x-auto p-6 bg-black/20 rounded-xl border border-white/5">
                            <DataVisualization
                                data={currentStep.data}
                                pointers={currentStep.pointers || {}}
                                stepIndex={safeIndex}
                            />
                        </div>
                    )}

                    {/* Step scrubber */}
                    <div className="mt-6 w-full max-w-3xl flex items-center gap-3">
                        <span className="text-xs text-white/60 font-mono min-w-[40px]">
                            {safeIndex + 1}/{steps.length}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={maxIndex}
                            value={safeIndex}
                            onChange={(e) => {
                                setIsPlaying(false);
                                setStepIndex(Number(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
                            aria-label="Step scrubber"
                        />
                    </div>
                </div>

                {/* Control buttons */}
                <div className="visualizer-controls mt-4 flex justify-center gap-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 disabled:opacity-30"
                                onClick={() => { setStepIndex(0); setIsPlaying(false); }}
                                disabled={safeIndex === 0}
                            >
                                <RotateCcw size={18} className="text-gray-300" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Reset (Home)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 disabled:opacity-30"
                                onClick={() => {
                                    setIsPlaying(false);
                                    setStepIndex(s => Math.max(0, s - 1));
                                }}
                                disabled={safeIndex === 0}
                            >
                                <SkipBack size={18} className="text-gray-300" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Previous (←)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ?
                                    <Pause size={24} className="text-white" /> :
                                    <Play size={24} className="text-white ml-1" />
                                }
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{isPlaying ? 'Pause' : 'Play'} (Space)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 disabled:opacity-30"
                                onClick={() => setStepIndex(Math.min(maxIndex, stepIndex + 1))}
                                disabled={safeIndex === maxIndex}
                            >
                                <SkipForward size={18} className="text-gray-300" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Next (→)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 disabled:opacity-30"
                                onClick={() => setStepIndex(maxIndex)}
                                disabled={safeIndex === maxIndex}
                            >
                                <ChevronRight size={18} className="text-gray-300" />
                                <ChevronRight size={18} className="text-gray-300 -ml-3" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Last (End)</TooltipContent>
                    </Tooltip>
                </div>

                {/* Keyboard shortcuts hint */}
                <div className="mt-3 text-center text-[10px] text-gray-600">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Space</kbd> play/pause ·
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 ml-1">←</kbd>/<kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">→</kbd> step
                </div>
            </div>
        </TooltipProvider>
    );
}
