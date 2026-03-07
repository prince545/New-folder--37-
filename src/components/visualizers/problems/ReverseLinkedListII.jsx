import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ReverseLinkedListII({ approach = "optimal" }) {
    // Reverse nodes from position m=2 to n=4: 1→2→3→4→5 becomes 1→4→3→2→5
    const original = [1, 2, 3, 4, 5];
    const m = 2, n = 4;
    const [step, setStep] = useState(0);
    const steps = [
        { arr: [1, 2, 3, 4, 5], highlight: [], action: "Original list: 1 → 2 → 3 → 4 → 5" },
        { arr: [1, 2, 3, 4, 5], highlight: [1], action: `Find position m=${m}. Connect dummy node before it.` },
        { arr: [1, 3, 2, 4, 5], highlight: [1, 2], action: "Step 1: Move node at pos 3 next to node before m" },
        { arr: [1, 4, 3, 2, 5], highlight: [1, 3], action: "Step 2: Move node at pos 4 next to node before m" },
        { arr: [1, 4, 3, 2, 5], highlight: [1, 2, 3, 4], action: "✓ Done! Reversed positions 2..4: 1→4→3→2→5" },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Reverse positions m={m} to n={n}: 1→2→3→4→5 → 1→4→3→2→5
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
                {s.arr.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            background: s.highlight?.includes(i) ? "#6366f1" : i === 0 || i === 4 ? "#065f46" : "#1e293b",
                            border: `2px solid ${s.highlight?.includes(i) ? "#818cf8" : i === 0 || i === 4 ? "#4ade80" : "#334155"}`,
                            fontSize: 14, color: "#e2e8f0", transition: "all 0.3s"
                        }}>{v}</div>
                        {i < s.arr.length - 1 && <div style={{ color: "#334155", fontSize: 18, margin: "0 2px" }}>→</div>}
                    </div>
                ))}
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
