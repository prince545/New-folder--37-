import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function TrappingRainWater({ approach = "optimal" }) {
    const height = [0, 1, 0, 2, 1, 0, 1, 3, 1, 0, 1, 2];
    const [step, setStep] = useState(0);
    const steps = [];
    let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
    steps.push({ l, r, lMax, rMax, water, action: "Init: l=0, r=11, lMax=0, rMax=0" });

    while (l < r) {
        if (height[l] < height[r]) {
            if (height[l] >= lMax) lMax = height[l];
            else water += lMax - height[l];
            steps.push({ l, r, lMax, rMax, water, collect: lMax - height[l] > 0 ? lMax - height[l] : 0, action: `h[l]=${height[l]} < h[r]=${height[r]}: collect ${Math.max(0, lMax - height[l])} at L. l++` });
            l++;
        } else {
            if (height[r] >= rMax) rMax = height[r];
            else water += rMax - height[r];
            steps.push({ l, r, lMax, rMax, water, collect: rMax - height[r] > 0 ? rMax - height[r] : 0, action: `h[r]=${height[r]} ≤ h[l]=${height[l]}: collect ${Math.max(0, rMax - height[r])} at R. r--` });
            r--;
        }
    }
    steps.push({ l, r, lMax, rMax, water, done: true, action: `✓ Total water trapped = ${water}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const maxH = Math.max(...height);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Two-pointer: always process the shorter side. Water collected = max_seen − current_height.
            </div>

            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 100, marginBottom: 8 }}>
                {height.map((h, i) => {
                    const isL = i === s.l, isR = i === s.r;
                    const inRange = i >= s.l && i <= s.r;
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 22, height: `${(h / maxH) * 80}px`, background: isL ? "#6366f1" : isR ? "#0891b2" : inRange ? "#334155" : "#1e293b", border: `1px solid ${isL ? "#818cf8" : isR ? "#38bdf8" : "#475569"}`, borderRadius: "2px 2px 0 0", transition: "all 0.3s" }} />
                            <div style={{ fontSize: 8, color: "#64748b", marginTop: 2 }}>{h}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#818cf8" }}>L={s.l}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#38bdf8" }}>R={s.r}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>lMax={s.lMax}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>rMax={s.rMax}</span>
                <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80", fontWeight: "bold" }}>water={s.water}</span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>{s.action}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
