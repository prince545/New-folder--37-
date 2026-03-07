import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function NonOverlappingIntervals({ approach = "optimal" }) {
    const intervals = [[1, 2], [2, 3], [3, 4], [1, 3]];
    const [step, setStep] = useState(0);
    const steps = [];

    const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
    let end = -Infinity, kept = 0, removed = 0;
    steps.push({ sorted, kept: [], removed: [], end: -Infinity, action: "Sort by end time (greedy: keep earliest-ending intervals)" });

    for (let i = 0; i < sorted.length; i++) {
        const [s, e] = sorted[i];
        if (s >= end) {
            end = e;
            kept++;
            steps.push({ sorted, keptIdx: [...(steps[steps.length - 1]?.keptIdx || []), i], removedIdx: steps[steps.length - 1]?.removedIdx || [], kept, removed, end, action: `Keep [${s},${e}]: starts >= end(${end <= e ? s >= end ? 'old ' : '' : ''}) → new end=${e}` });
        } else {
            removed++;
            steps.push({ sorted, keptIdx: steps[steps.length - 1]?.keptIdx || [], removedIdx: [...(steps[steps.length - 1]?.removedIdx || []), i], kept, removed, end, action: `Remove [${s},${e}]: overlaps with end=${end}` });
        }
    }
    steps.push({ done: true, keptIdx: steps[steps.length - 1]?.keptIdx, removedIdx: steps[steps.length - 1]?.removedIdx, kept, removed, action: `✓ Min removals = ${removed} (kept ${kept} non-overlapping)` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const maxEnd = Math.max(...intervals.flat());

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                intervals=[{intervals.map(i => `[${i}]`).join(",")}] — Min removals for non-overlapping.
            </div>
            <div style={{ color: "#64748b", fontSize: 11, marginBottom: 8 }}>Sorted by end: [{sorted.map(i => `[${i}]`).join(",")}]</div>

            <div style={{ position: "relative", marginBottom: 16 }}>
                {sorted.map(([a, b], i) => {
                    const isKept = s.keptIdx?.includes(i);
                    const isRemoved = s.removedIdx?.includes(i);
                    return (
                        <div key={i} style={{ position: "relative", height: 28, marginBottom: 4 }}>
                            <div style={{ position: "absolute", left: `${(a / maxEnd) * 260}px`, width: `${((b - a) / maxEnd) * 260}px`, height: "100%", background: isRemoved ? "#450a0a" : isKept ? "#065f46" : "#1e3a5f", border: `2px solid ${isRemoved ? "#f87171" : isKept ? "#4ade80" : "#3b82f6"}`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#e2e8f0", transition: "all 0.3s" }}>
                                [{a},{b}] {isKept ? "✓" : isRemoved ? "✗" : ""}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>Kept: {s.kept}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#f87171" }}>Removed: {s.removed}</span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>
                {s.action}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
