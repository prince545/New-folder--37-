import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function FindMedianfromDataStream({ approach = "optimal" }) {
    const stream = [5, 15, 1, 3, 2, 8];
    const [step, setStep] = useState(0);
    const steps = [];
    const lo = [], hi = []; // lo = max-heap (stored neg), hi = min-heap

    const pushLo = (v) => { lo.push(v); lo.sort((a, b) => b - a); };
    const pushHi = (v) => { hi.push(v); hi.sort((a, b) => a - b); };

    for (const n of stream) {
        if (!lo.length || n <= lo[0]) pushLo(n); else pushHi(n);
        if (lo.length > hi.length + 1) { pushHi(lo.shift()); }
        else if (hi.length > lo.length) { pushLo(hi.shift()); }
        const median = lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2;
        steps.push({ n, lo: [...lo], hi: [...hi], median, action: `Add ${n} → lo=[${lo.join(",")}] hi=[${hi.join(",")}] → median=${median}` });
    }
    steps.push({ done: true, lo: [...lo], hi: [...hi], median: lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2, action: `✓ Final median = ${lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Two heaps: lo=max-heap (lower half), hi=min-heap (upper half). Median = lo.top or avg.
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                {[{ label: "lo (max-heap)", arr: s.lo, color: "#6366f1", borderColor: "#818cf8" },
                { label: "hi (min-heap)", arr: s.hi, color: "#0891b2", borderColor: "#38bdf8" }].map(({ label, arr, color, borderColor }) => (
                    <div key={label} style={{ flex: 1, background: "#1e293b", padding: 10, borderRadius: 8 }}>
                        <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>{label}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {arr.map((v, i) => (
                                <div key={i} style={{ width: 38, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? color : "#0f172a", border: `2px solid ${i === 0 ? borderColor : "#334155"}`, fontSize: 13, color: "#e2e8f0" }}>{v}</div>
                            ))}
                            {arr.length === 0 && <span style={{ color: "#475569", fontSize: 12 }}>empty</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                <span style={{ color: "#64748b", fontSize: 12 }}>Median:</span>
                <span style={{ background: "#14532d", padding: "6px 16px", borderRadius: 8, fontSize: 16, color: "#4ade80", fontWeight: "bold" }}>{s.median}</span>
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
