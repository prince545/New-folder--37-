import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function SlidingWindowViz({ problemId }) {
    const str = "abcabcbb";
    const arr = [2, 3, 1, 2, 4, 3]; const target = 7;
    const [step, setStep] = useState(0);
    const steps = [];
    if (problemId === 3) {
        let map = new Map(), l = 0, maxLen = 0;
        for (let r = 0; r < str.length; r++) {
            while (map.has(str[r])) { map.delete(str[l]); l++; }
            map.set(str[r], r);
            maxLen = Math.max(maxLen, r - l + 1);
            steps.push({ l, r, maxLen, window: str.slice(l, r + 1) });
        }
    } else {
        let l = 0, sum = 0, minLen = Infinity;
        for (let r = 0; r < arr.length; r++) {
            sum += arr[r];
            while (sum >= target) { minLen = Math.min(minLen, r - l + 1); steps.push({ l, r, sum, minLen }); sum -= arr[l]; l++; }
            if (steps.length === 0 || steps[steps.length - 1].r !== r) steps.push({ l, r, sum, minLen });
        }
    }
    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const data = problemId === 3 ? str.split("") : arr;
    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>{problemId === 3 ? `"${str}"` : `[${arr.join(",")}] target=${target}`}</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {data.map((v, i) => (
                    <div key={i} style={{ width: 40, height: 40, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: i >= s?.l && i <= s?.r ? "#6366f1" : "#0f172a", border: `2px solid ${i >= s?.l && i <= s?.r ? "#818cf8" : "#334155"}`, fontSize: 14, color: "#e2e8f0", transition: "all 0.25s" }}>{v}</div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>L=<span style={{ color: "#60a5fa" }}>{s?.l}</span></span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>R=<span style={{ color: "#60a5fa" }}>{s?.r}</span></span>
                {problemId === 3 ? <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>maxLen={s?.maxLen}</span>
                    : <><span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#fb923c" }}>sum={s?.sum}</span><span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>minLen={s?.minLen === Infinity ? "∞" : s?.minLen}</span></>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div >
    );
}
