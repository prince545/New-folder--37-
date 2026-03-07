import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function LinkedListCycle({ approach = "optimal" }) {
    const nodes = [1, 2, 3, 4, 5];
    const [step, setStep] = useState(0);
    const steps = [];
    // Cycle: node at index 4 points back to index 2
    let slow = 0, fast = 0;
    const nextFast = [1, 2, 3, 4, 2]; // indices (fast cycles at 2)
    steps.push({ slow, fast, meet: false, action: "Init: slow=0, fast=0" });
    for (let i = 0; i < 8; i++) {
        slow = (slow + 1) % nodes.length;
        fast = nextFast[fast];
        const meet = slow === fast;
        steps.push({ slow, fast, meet, action: meet ? `✓ slow=fast=${slow} → Cycle detected!` : `slow=${slow}, fast=${fast}` });
        if (meet) break;
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Floyd's cycle detection: slow moves 1 step, fast moves 2 steps. Cycle at node 4→2.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
                {nodes.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i === s.slow && i === s.fast ? "#7c3aed" : i === s.slow ? "#6366f1" : i === s.fast ? "#0891b2" : "#1e293b", border: `2px solid ${i === s.slow || i === s.fast ? "#818cf8" : "#334155"}`, fontSize: 14, color: "#e2e8f0", transition: "all 0.3s" }}>{v}</div>
                        {i < nodes.length - 1 && <div style={{ color: "#334155", fontSize: 18, margin: "0 2px" }}>→</div>}
                    </div>
                ))}
                <div style={{ marginLeft: 8, color: "#475569", fontSize: 12 }}>↩ (4→2)</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#818cf8" }}>slow={s.slow}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#38bdf8" }}>fast={s.fast}</span>
                {s.meet && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#4ade80" }}>✓ Cycle detected!</span>}
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.meet ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.meet ? "#4ade80" : "#a78bfa" }}>{s.action}</div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
