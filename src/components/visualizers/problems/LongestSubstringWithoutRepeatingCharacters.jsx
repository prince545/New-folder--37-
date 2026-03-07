import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function LongestSubstringWithoutRepeatingCharacters({ approach = "optimal" }) {
    const str = "abcabcbb";
    const [step, setStep] = useState(0);
    const steps = [];
    let map = new Map(), l = 0, maxLen = 0;

    for (let r = 0; r < str.length; r++) {
        while (map.has(str[r])) { map.delete(str[l]); l++; }
        map.set(str[r], r);
        maxLen = Math.max(maxLen, r - l + 1);
        steps.push({ l, r, maxLen, window: str.slice(l, r + 1), chars: new Set(map.keys()) });
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                "{str}" — sliding window, expand right, shrink left on duplicates.
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {str.split("").map((c, i) => (
                    <div key={i} style={{ width: 38, height: 38, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: i >= s.l && i <= s.r ? "#6366f1" : "#0f172a", border: `2px solid ${i >= s.l && i <= s.r ? "#818cf8" : "#334155"}`, fontSize: 15, fontWeight: "bold", color: "#e2e8f0", transition: "all 0.25s" }}>{c}</div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {str.split("").map((_, i) => (
                    <div key={i} style={{ width: 38, textAlign: "center", fontSize: 10, color: i === s.l ? "#818cf8" : i === s.r ? "#38bdf8" : "transparent" }}>
                        {i === s.l && i === s.r ? "L/R" : i === s.l ? "L" : i === s.r ? "R" : ""}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>window="<span style={{ color: "#60a5fa" }}>{s.window}</span>"</span>
                <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>maxLen={s.maxLen}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>len={s.r - s.l + 1}</span>
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
