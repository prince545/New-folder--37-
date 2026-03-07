import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function PrefixSumViz({ problemId }) {
    const arr = [3, 4, -7, 1, 3, 3, 1, -4];
    const k = 7;
    const [step, setStep] = useState(0);
    const prefixMap = new Map([[0, 1]]);
    const steps = [];
    let sum = 0, count = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (prefixMap.has(sum - k)) { count += prefixMap.get(sum - k); steps.push({ i, sum, found: true, count, map: new Map(prefixMap) }); }
        else steps.push({ i, sum, found: false, count, map: new Map(prefixMap) });
        prefixMap.set(sum, (prefixMap.get(sum) || 0) + 1);
    }
    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ marginBottom: 12, color: "#94a3b8", fontSize: 13 }}>Array: [{arr.join(", ")}]  k={k}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {arr.map((v, i) => (
                    <div key={i} style={{ width: 44, height: 44, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === s?.i ? "#6366f1" : i < (s?.i ?? -1) ? "#1e293b" : "#0f172a", border: `2px solid ${i === s?.i ? "#818cf8" : "#334155"}`, transition: "all 0.3s", fontSize: 13, color: "#e2e8f0" }}>
                        <span>{v}</span><span style={{ fontSize: 9, color: "#64748b" }}>[{i}]</span>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, color: "#94a3b8", fontSize: 13 }}>prefix_sum = <span style={{ color: "#60a5fa" }}>{s?.sum}</span></span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, color: "#94a3b8", fontSize: 13 }}>count = <span style={{ color: "#4ade80" }}>{s?.count}</span></span>
                {s?.found && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, color: "#4ade80", fontSize: 13 }}>✓ Found! sum-k={s.sum - k} in map</span>}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
                {s?.map && [...s.map.entries()].map(([key, val]) => (
                    <span key={key} style={{ background: key === s.sum - k && s.found ? "#14532d" : "#1e293b", border: `1px solid ${key === s.sum - k && s.found ? "#4ade80" : "#334155"}`, borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#94a3b8" }}>{key}:{val}</span>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 12, alignSelf: "center" }}>Step {step + 1}/{steps.length}</span>
            </div>
        </div >
    );
}
