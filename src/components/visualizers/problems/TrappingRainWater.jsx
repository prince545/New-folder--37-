import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

const CHART_PX = 260;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function parseHeights(input) {
  const parts = input
    .split(/[\s,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  const nums = parts.map((p) => Number(p));
  if (nums.length === 0 || nums.some((x) => !Number.isFinite(x) || x < 0)) return null;
  return nums.map((x) => Math.floor(x));
}

export default function TrappingRainWater() {
  const defaultHeights = useMemo(() => [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], []);
  const [heights, setHeights] = useState(defaultHeights);
  const [heightsText, setHeightsText] = useState(defaultHeights.join(", "));

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1100);

  const states = useMemo(() => {
    const n = heights.length;
    const leftMax = new Array(n);
    const rightMax = new Array(n);
    let lm = 0;
    for (let i = 0; i < n; i++) {
      lm = Math.max(lm, heights[i]);
      leftMax[i] = lm;
    }
    let rm = 0;
    for (let i = n - 1; i >= 0; i--) {
      rm = Math.max(rm, heights[i]);
      rightMax[i] = rm;
    }

    const water = new Array(n).fill(0);
    const steps = [];

    steps.push({
      currentI: -1,
      water: [...water],
      leftMax: [...leftMax],
      rightMax: [...rightMax],
      total: 0,
      desc:
        "Goal: for each index i, water[i] = max(0, min(leftMax[i], rightMax[i]) - height[i]). Sum water[i] for the answer.",
      formula: "",
    });

    let total = 0;
    for (let i = 0; i < n; i++) {
      const minH = Math.min(leftMax[i], rightMax[i]);
      const trapped = Math.max(0, minH - heights[i]);
      water[i] = trapped;
      total += trapped;
      steps.push({
        currentI: i,
        water: [...water],
        leftMax: [...leftMax],
        rightMax: [...rightMax],
        total,
        desc: `i=${i}: leftMax=${leftMax[i]}, rightMax=${rightMax[i]}, height=${heights[i]}.`,
        formula: `water[i] = max(0, min(${leftMax[i]}, ${rightMax[i]}) - ${heights[i]}) = ${trapped}`,
      });
    }

    steps.push({
      currentI: -1,
      water: [...water],
      leftMax: [...leftMax],
      rightMax: [...rightMax],
      total,
      desc: `Done. Total trapped water = ${total}.`,
      formula: "",
    });

    return steps;
  }, [heights]);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [heights]);

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < states.length - 1) {
      timer = setTimeout(() => setStepIndex((s) => s + 1), speedMs);
    } else if (stepIndex >= states.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, speedMs, states.length, stepIndex]);

  const current = states[clamp(stepIndex, 0, states.length - 1)];
  const maxH = Math.max(3, ...heights, ...(current.leftMax || []), ...(current.rightMax || []));

  const applyHeights = () => {
    const parsed = parseHeights(heightsText);
    if (!parsed) return;
    setHeights(parsed);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto pb-6">
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-l-4 border-blue-400 p-5 rounded-md mb-6 shadow-lg relative mx-4 mt-4">
        <div className="absolute -top-3 left-4 bg-[#0B0C10] px-2 text-xs font-bold text-blue-300">
          Step {stepIndex + 1} of {states.length}
        </div>
        <h3 className="text-white text-lg font-medium leading-relaxed">{current.desc}</h3>
        {current.formula && (
          <div className="mt-4 bg-black/40 border border-white/10 rounded px-4 py-3 font-mono text-pink-300 shadow-inner whitespace-pre-line inline-block">
            {current.formula}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-xs font-semibold text-white/70">Heights</div>
            <input
              value={heightsText}
              onChange={(e) => setHeightsText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyHeights();
              }}
              className="flex-1 min-w-[240px] rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="e.g. 0,1,0,2,1,0,1,3,2,1,2,1"
              spellCheck={false}
            />
            <button
              onClick={applyHeights}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              type="button"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setHeights(defaultHeights);
                setHeightsText(defaultHeights.join(", "));
              }}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              type="button"
            >
              Reset sample
            </button>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-xs font-semibold text-white/70">
              Total so far: <span className="text-cyan-300">{current.total}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-white/70">Speed</span>
              <select
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white"
              >
                <option value={1700}>0.65×</option>
                <option value={1100}>1×</option>
                <option value={700}>1.6×</option>
                <option value={450}>2.4×</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-end justify-center gap-2 overflow-x-auto py-4">
            {heights.map((h, i) => {
              const w = current.water?.[i] ?? 0;
              const isActive = i === current.currentI;
              const lm = current.leftMax?.[i] ?? 0;
              const rm = current.rightMax?.[i] ?? 0;
              const minH = Math.min(lm, rm);

              const solidPx = (h / maxH) * CHART_PX;
              const waterPx = (w / maxH) * CHART_PX;
              const capPx = (minH / maxH) * CHART_PX;

              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="relative w-10" style={{ height: CHART_PX + 32 }}>
                    {/* cap guide (only for active index) */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute left-0 right-0 border-t border-dashed border-cyan-300/60"
                        style={{ bottom: capPx }}
                      />
                    )}

                    {/* water (above the bar, not from the ground) */}
                    <AnimatePresence>
                      {w > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: waterPx, opacity: 0.95 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className={
                            "absolute left-0 right-0 rounded-t-sm border border-blue-200/20 " +
                            (isActive ? "bg-gradient-to-t from-blue-500/50 to-cyan-300/70" : "bg-gradient-to-t from-blue-500/35 to-cyan-300/55")
                          }
                          style={{ bottom: solidPx }}
                        />
                      )}
                    </AnimatePresence>

                    {/* solid bar */}
                    <motion.div
                      animate={{ height: solidPx }}
                      transition={{ duration: 0.35 }}
                      className={
                        "absolute left-0 right-0 bottom-0 rounded-t-md border shadow-sm flex items-end justify-center " +
                        (isActive
                          ? "bg-gradient-to-t from-purple-600/35 to-purple-300/40 border-purple-300/30 shadow-[0_0_22px_rgba(168,85,247,0.25)]"
                          : "bg-gradient-to-t from-slate-700/50 to-slate-400/40 border-white/10")
                      }
                    >
                      <div className="pb-1 text-[11px] font-bold text-white/80 select-none">{h > 0 ? h : ""}</div>
                    </motion.div>

                    {/* pointer marker */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-pink-300"
                        >
                          i
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* mini stats (active only) */}
                    {isActive && (
                      <div className="absolute -right-44 top-2 hidden lg:block w-40 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/80">
                        <div className="flex justify-between">
                          <span className="text-white/60">leftMax</span>
                          <span className="text-cyan-300 font-mono">{lm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">rightMax</span>
                          <span className="text-cyan-300 font-mono">{rm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">min</span>
                          <span className="text-cyan-300 font-mono">{minH}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">water[i]</span>
                          <span className="text-pink-300 font-mono">{w}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-white/50 font-mono">{i}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-white/60 font-semibold">
              {stepIndex + 1}/{states.length}
            </span>
            <input
              type="range"
              min={0}
              max={states.length - 1}
              value={stepIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIndex(Number(e.target.value));
              }}
              className="w-full"
              aria-label="Step scrubber"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-6 pb-4">
        <button
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          onClick={() => {
            setStepIndex(0);
            setIsPlaying(false);
          }}
          type="button"
        >
          <RotateCcw size={20} className="text-gray-300" />
        </button>
        <button
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          onClick={() => {
            setIsPlaying(false);
            setStepIndex((s) => clamp(s - 1, 0, states.length - 1));
          }}
          disabled={stepIndex === 0}
          type="button"
        >
          <SkipBack size={20} className="text-gray-300" />
        </button>
        <button
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          onClick={() => setIsPlaying((p) => !p)}
          type="button"
        >
          {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
        </button>
        <button
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          onClick={() => setStepIndex((s) => clamp(s + 1, 0, states.length - 1))}
          disabled={stepIndex === states.length - 1}
          type="button"
        >
          <SkipForward size={20} className="text-gray-300" />
        </button>
      </div>
    </div>
  );
}
