import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function MiddleLinkedList({ approach = "optimal" }) {
    const nodes = [1, 2, 3, 4, 5];
    const [step, setStep] = useState(0);
    const steps = [];
    let slow = 0, fast = 0;
    steps.push({ slow, fast });
    while (fast < nodes.length - 1) {
        slow += 1;
        fast = Math.min(fast + 2, nodes.length - 1);
        steps.push({ slow, fast });
        if (fast >= nodes.length - 1) break;
    }
    steps.push({ slow, fast, done: true });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Find middle of: 1 → 2 → 3 → 4 → 5. Fast moves 2x, slow moves 1x.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
                {nodes.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            background: i === s.slow && i === s.fast ? "#7c3aed" : i === s.slow ? "#6366f1" : i === s.fast ? "#0891b2" : "#1e293b",
                            border: `2px solid ${i === s.slow || i === s.fast ? "#818cf8" : "#334155"}`,
                            fontSize: 14, color: "#e2e8f0", transition: "all 0.3s"
                        }}>{v}</div>
                        {i < nodes.length - 1 && <div style={{ color: "#334155", fontSize: 18, margin: "0 2px" }}>→</div>}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                {nodes.map((_, i) => (
                    <div key={i} style={{ width: 42, textAlign: "center", fontSize: 11, color: i === s.slow && i === s.fast ? "#c084fc" : i === s.slow ? "#818cf8" : i === s.fast ? "#38bdf8" : "transparent" }}>
                        {i === s.slow && i === s.fast ? "s/f" : i === s.slow ? "slow" : i === s.fast ? "fast" : ""}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#818cf8" }}>slow={s.slow}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#38bdf8" }}>fast={s.fast}</span>
                {s.done && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#4ade80" }}>✓ Middle = node {nodes[s.slow]} (index {s.slow})</span>}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
