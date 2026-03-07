import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function BinarySearchViz({ problemId }) {
    const arr = problemId === 153 ? [4, 5, 6, 7, 0, 1, 2] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const target = 7;
    const [step, setStep] = useState(0);
    const steps = [];

    if (problemId === 153) {
        let l = 0, r = arr.length - 1;
        while (l < r) {
            const m = Math.floor((l + r) / 2);
            steps.push({ l, r, m, val: arr[m] });
            if (arr[m] > arr[r]) {
                l = m + 1;
            } else {
                r = m;
            }
        }
        steps.push({ l, r, m: l, val: arr[l], found: true });
    } else {
        // Standard Binary Search
        let l = 0, r = arr.length - 1;
        while (l <= r) {
            const m = Math.floor((l + r) / 2);
            steps.push({ l, r, m, val: arr[m] });
            if (arr[m] === target) {
                steps.push({ l, r, m, val: arr[m], found: true });
                break;
            } else if (arr[m] < target) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                {problemId === 153 ? "Find Minimum in Rotated Sorted Array" : `Binary Search for ${target}`}
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {arr.map((v, i) => (
                    <div key={i} style={{ width: 40, height: 40, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: i === s?.m ? "#6366f1" : (i >= s?.l && i <= s?.r) ? "#1e293b" : "#0f172a", border: `2px solid ${i === s?.m ? "#818cf8" : (i >= s?.l && i <= s?.r) ? "#4f46e5" : "#334155"}`, fontSize: 14, color: "#e2e8f0", transition: "all 0.25s" }}>
                        {v}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {arr.map((_, i) => (
                    <div key={i} style={{ width: 40, textAlign: "center", fontSize: 11, color: i === s?.l ? "#818cf8" : i === s?.r ? "#38bdf8" : i === s?.m ? "#a78bfa" : "transparent" }}>
                        {i === s?.l && i === s?.r && i === s?.m ? "L,R,M" : i === s?.l && i === s?.r ? "L,R" : i === s?.l && i === s?.m ? "L,M" : i === s?.r && i === s?.m ? "R,M" : i === s?.l ? "L" : i === s?.r ? "R" : i === s?.m ? "M" : "."}
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>L=<span style={{ color: "#60a5fa" }}>{s?.l}</span></span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>R=<span style={{ color: "#60a5fa" }}>{s?.r}</span></span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>Mid=<span style={{ color: "#a78bfa" }}>{s?.m}</span> (Val: {s?.val})</span>
                {s?.found && (
                    <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>
                        ✓ {problemId === 153 ? `Found Min: ${s.val}` : `Found Target: ${target}`}
                    </span>
                )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
