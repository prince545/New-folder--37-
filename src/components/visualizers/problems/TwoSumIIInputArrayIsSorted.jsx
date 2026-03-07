import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function TwoSumIIInputArrayIsSorted({ approach = "optimal" }) {
    const arr = [2, 7, 11, 15];
    const target = 9;
    const [step, setStep] = useState(0);
    const steps = [];
    let l = 0, r = arr.length - 1;

    while (l < r) {
        const sum = arr[l] + arr[r];
        steps.push({ l, r, sum, found: sum === target });
        if (sum === target) break;
        else if (sum < target) l++;
        else r--;
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Sorted: [{arr.join(", ")}] — target={target}. Two-pointer, no extra space.
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {arr.map((v, i) => {
                    const isL = i === s.l, isR = i === s.r;
                    return (
                        <div key={i} style={{ width: 52, height: 52, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isL && isR ? "#7c3aed" : isL ? "#6366f1" : isR ? "#0891b2" : "#0f172a", border: `2px solid ${isL || isR ? "#818cf8" : "#334155"}`, fontSize: 16, fontWeight: "bold", color: "#e2e8f0", transition: "all 0.3s" }}>
                            {v}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {arr.map((_, i) => (
                    <div key={i} style={{ width: 52, textAlign: "center", fontSize: 12, color: i === s.l ? "#818cf8" : i === s.r ? "#38bdf8" : "transparent" }}>
                        {i === s.l ? "L" : i === s.r ? "R" : ""}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>sum={arr[s.l]}+{arr[s.r]}=<span style={{ color: s.found ? "#4ade80" : "#fb923c" }}>{s.sum}</span></span>
                {s.found && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>✓ Found! indices [{s.l + 1},{s.r + 1}] (1-indexed)</span>}
                {!s.found && s.sum < target && <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#818cf8" }}>{s.sum} &lt; {target} → move L right</span>}
                {!s.found && s.sum > target && <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#38bdf8" }}>{s.sum} &gt; {target} → move R left</span>}
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
