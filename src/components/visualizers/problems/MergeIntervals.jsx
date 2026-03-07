import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function MergeIntervals({ approach = "optimal" }) {
    const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
    const [step, setStep] = useState(0);
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    const steps = [];
    const result = [sorted[0]];
    steps.push({ result: [[...sorted[0]]], current: null, action: `Sort by start. Add first: [${sorted[0]}]` });

    for (let i = 1; i < sorted.length; i++) {
        const last = result[result.length - 1];
        const curr = sorted[i];
        if (curr[0] <= last[1]) {
            last[1] = Math.max(last[1], curr[1]);
            steps.push({ result: result.map(r => [...r]), current: curr, merged: true, action: `[${curr}] overlaps with [${last[0]},${last[1]}] → merge → [${last}]` });
        } else {
            result.push([...curr]);
            steps.push({ result: result.map(r => [...r]), current: curr, merged: false, action: `[${curr}] no overlap → add new interval` });
        }
    }
    steps.push({ result: result.map(r => [...r]), done: true, action: `✓ Merged: ${result.map(r => `[${r}]`).join(", ")}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const maxEnd = Math.max(...intervals.flat());

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                [{intervals.map(i => `[${i}]`).join(",")}] — sort by start, merge overlapping.
            </div>

            <div style={{ position: "relative", marginBottom: 14 }}>
                <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>Original (sorted):</div>
                {sorted.map((iv, i) => (
                    <div key={i} style={{ position: "relative", height: 26, marginBottom: 4 }}>
                        <div style={{ position: "absolute", left: `${(iv[0] / maxEnd) * 280}px`, width: `${((iv[1] - iv[0]) / maxEnd) * 280}px`, height: "100%", background: s.current && s.current[0] === iv[0] && s.current[1] === iv[1] ? "#312e81" : "#1e3a5f", border: `1.5px solid ${s.current && s.current[0] === iv[0] ? "#818cf8" : "#3b82f6"}`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>[{iv[0]},{iv[1]}]</div>
                    </div>
                ))}
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 10, marginBottom: 6 }}>Result:</div>
                {s.result.map((iv, i) => (
                    <div key={i} style={{ position: "relative", height: 28, marginBottom: 4 }}>
                        <div style={{ position: "absolute", left: `${(iv[0] / maxEnd) * 280}px`, width: `${((iv[1] - iv[0]) / maxEnd) * 280}px`, minWidth: 40, height: "100%", background: "#14532d", border: "2px solid #4ade80", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#4ade80" }}>[{iv[0]},{iv[1]}]</div>
                    </div>
                ))}
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : s.merged ? "#7c3aed" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>{s.action}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
