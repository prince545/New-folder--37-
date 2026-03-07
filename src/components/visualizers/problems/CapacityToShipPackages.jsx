import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function CapacityToShipPackages({ approach = "optimal" }) {
    const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const D = 5;
    const [step, setStep] = useState(0);
    const steps = [];
    let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);

    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        let days = 1, cur = 0;
        for (const w of weights) { if (cur + w > mid) { days++; cur = 0; } cur += w; }
        const feasible = days <= D;
        steps.push({ lo, hi, mid, days, feasible, action: feasible ? `days=${days} ≤ D=${D} → feasible, try smaller → hi=mid` : `days=${days} > D=${D} → too slow → lo=mid+1` });
        if (feasible) hi = mid; else lo = mid + 1;
    }
    steps.push({ lo, hi, mid: lo, done: true, action: `Answer = ${lo}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const range = hi > 0 ? hi : 55;

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Weights: [{weights.join(", ")}] — D={D} days. Find minimum ship capacity.
            </div>

            <div style={{ position: "relative", height: 44, background: "#0f172a", borderRadius: 8, marginBottom: 12, border: "1px solid #334155" }}>
                <div style={{ position: "absolute", left: `${(s.lo / 55) * 100}%`, right: `${((55 - s.hi) / 55) * 100}%`, height: "100%", background: "#1e3a5f", borderRadius: 8, transition: "all 0.3s" }} />
                <div style={{ position: "absolute", left: `${(s.mid / 55) * 100}%`, width: "4%", height: "100%", background: s.done ? "#14532d" : "#6366f1", borderRadius: 4, transition: "all 0.3s" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#94a3b8" }}>
                    lo={s.lo}  mid={s.mid}  hi={s.hi}
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>days=<span style={{ color: "#fb923c" }}>{s.days}</span></span>
                {s.feasible !== undefined && (
                    <span style={{ background: s.feasible ? "#14532d" : "#450a0a", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: s.feasible ? "#4ade80" : "#f87171" }}>
                        {s.feasible ? "✓ feasible → hi=mid" : "✗ too slow → lo=mid+1"}
                    </span>
                )}
                {s.done && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>✓ Answer = {s.mid}</span>}
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>
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
