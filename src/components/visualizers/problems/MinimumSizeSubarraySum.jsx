import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function MinimumSizeSubarraySum({ approach = "optimal" }) {
    const arr = [2, 3, 1, 2, 4, 3];
    const target = 7;
    const [step, setStep] = useState(0);
    const steps = [];
    let l = 0, sum = 0, minLen = Infinity;

    for (let r = 0; r < arr.length; r++) {
        sum += arr[r];
        while (sum >= target) {
            minLen = Math.min(minLen, r - l + 1);
            steps.push({ l, r, sum, minLen, shrink: true });
            sum -= arr[l];
            l++;
        }
        steps.push({ l, r, sum, minLen: minLen === Infinity ? "∞" : minLen });
    }
    steps.push({ l, r: arr.length - 1, sum, minLen, done: true });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                [{arr.join(", ")}] — target = {target}. Find min-length subarray with sum ≥ target.
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {arr.map((v, i) => (
                    <div key={i} style={{
                        width: 40, height: 40, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                        background: i >= s.l && i <= s.r ? (s.shrink ? "#7c3aed" : "#6366f1") : "#0f172a",
                        border: `2px solid ${i >= s.l && i <= s.r ? "#818cf8" : "#334155"}`,
                        fontSize: 14, color: "#e2e8f0", transition: "all 0.25s"
                    }}>{v}</div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                {arr.map((_, i) => (
                    <div key={i} style={{ width: 40, textAlign: "center", fontSize: 10, color: i === s.l ? "#818cf8" : i === s.r ? "#38bdf8" : "transparent" }}>
                        {i === s.l && i === s.r ? "L/R" : i === s.l ? "L" : i === s.r ? "R" : ""}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>L=<span style={{ color: "#818cf8" }}>{s.l}</span></span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>R=<span style={{ color: "#38bdf8" }}>{s.r}</span></span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#fb923c" }}>sum={s.sum}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>minLen={s.minLen}</span>
                {s.shrink && <span style={{ background: "#312e81", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#a5b4fc" }}>sum ≥ {target} → shrink left!</span>}
            </div>
            {s.done && <div style={{ color: "#4ade80", marginBottom: 12, fontSize: 13 }}>✓ Answer: {s.minLen}</div>}
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
