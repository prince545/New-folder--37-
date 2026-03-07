import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function TwoPointersViz({ problemId }) {
    const arr = problemId === 167 ? [2, 7, 11, 15] : [1, 1, 2, 2, 3];
    const target = 9;
    const [step, setStep] = useState(0);
    const steps = [];
    if (problemId === 167) {
        let l = 0, r = arr.length - 1;
        while (l < r) {
            const s = arr[l] + arr[r];
            steps.push({ l, r, sum: s, found: s === target });
            if (s === target) break;
            else if (s < target) l++;
            else r--;
        }
    } else {
        let slow = 0;
        for (let fast = 1; fast < arr.length; fast++) {
            steps.push({ slow, fast, dup: arr[fast] === arr[slow] });
            if (arr[fast] !== arr[slow]) { slow++; }
        }
    }
    const s = steps[Math.min(step, steps.length - 1)] || { l: 0, r: arr.length - 1 };
    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>{problemId === 167 ? `Target=${target}` : "Remove duplicates in-place"}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {arr.map((v, i) => {
                    const isL = problemId === 167 ? i === s.l : i === s.slow;
                    const isR = problemId === 167 ? i === s.r : i === s.fast;
                    return (
                        <div key={i} style={{ width: 44, height: 44, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isL && isR ? "#7c3aed" : isL ? "#6366f1" : isR ? "#0891b2" : "#0f172a", border: `2px solid ${isL || isR ? "#818cf8" : "#334155"}`, fontSize: 14, color: "#e2e8f0" }}>
                            {v}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {arr.map((_, i) => {
                    const isL = problemId === 167 ? i === s.l : i === s.slow;
                    const isR = problemId === 167 ? i === s.r : i === s.fast;
                    return <div key={i} style={{ width: 44, textAlign: "center", fontSize: 11, color: isL ? "#818cf8" : isR ? "#38bdf8" : "transparent" }}>{isL ? (problemId === 167 ? "L" : "slow") : isR ? (problemId === 167 ? "R" : "fast") : "."}</div>;
                })}
            </div>
            {problemId === 167 && s.sum !== undefined && <div style={{ marginBottom: 12, fontSize: 13, color: "#94a3b8" }}>sum = {s.sum} {s.found ? <span style={{ color: "#4ade80" }}>✓ Found!</span> : s.sum < target ? "< target → move L right" : "> target → move R left"}</div>}
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div >
    );
}
