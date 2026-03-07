import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function KokoEatingBananas({ approach = "optimal" }) {
    const piles = [3, 6, 7, 11];
    const H = 8;
    const [step, setStep] = useState(0);
    const steps = [];
    let lo = 1, hi = Math.max(...piles);

    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        let days = 0;
        for (const p of piles) days += Math.ceil(p / mid);
        const feasible = days <= H;
        steps.push({ lo, hi, mid, days, feasible, action: feasible ? `speed=${mid}: days=${days} ≤ H=${H} → feasible, try slower → hi=mid` : `speed=${mid}: days=${days} > H=${H} → too slow → lo=mid+1` });
        if (feasible) hi = mid; else lo = mid + 1;
    }
    steps.push({ lo, hi, mid: lo, done: true, action: `✓ Minimum speed = ${lo} bananas/hour` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Piles: [{piles.join(", ")}] H={H} hours. Find minimum speed k bananas/hr.
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "flex-end" }}>
                {piles.map((p, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>🍌×{p}</div>
                        <div style={{ width: 44, height: `${(p / 11) * 70}px`, background: "#1e3a5f", border: "2px solid #3b82f6", borderRadius: "4px 4px 0 0", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 2, fontSize: 13, color: "#60a5fa" }}>{p}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>hrs={s.mid ? Math.ceil(p / s.mid) : "?"}</div>
                    </div>
                ))}
            </div>

            <div style={{ position: "relative", height: 40, background: "#0f172a", borderRadius: 8, marginBottom: 12, border: "1px solid #334155" }}>
                <div style={{ position: "absolute", left: `${((s.lo - 1) / hi) * 100}%`, right: `${((hi - s.hi) / hi) * 100}%`, height: "100%", background: "#1e3a5f", borderRadius: 8, transition: "all 0.3s" }} />
                <div style={{ position: "absolute", left: `${((s.mid - 1) / hi) * 100}%`, width: `${(1 / hi) * 100}%`, height: "100%", background: s.done ? "#14532d" : "#6366f1", transition: "all 0.3s" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#94a3b8" }}>
                    lo={s.lo}  mid={s.mid}  hi={s.hi}
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>days=<span style={{ color: "#fb923c" }}>{s.days}</span></span>
                {s.feasible !== undefined && (
                    <span style={{ background: s.feasible ? "#14532d" : "#450a0a", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: s.feasible ? "#4ade80" : "#f87171" }}>
                        {s.feasible ? "✓ feasible" : "✗ too slow"}
                    </span>
                )}
                {s.done && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80", fontWeight: "bold" }}>Answer = {s.mid}</span>}
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>{s.action}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
