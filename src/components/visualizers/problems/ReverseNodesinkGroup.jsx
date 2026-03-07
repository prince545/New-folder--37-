import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ReverseNodesinkGroup({ approach = "optimal" }) {
    const k = 3;
    const steps = [
        { label: "Original", lists: [[1, 2, 3, 4, 5]], action: "Reverse Nodes in k-Group (k=3). Process each k-node chunk." },
        { label: "Identify group 1", lists: [[1, 2, 3], [4, 5]], highlight: [0, 1, 2], action: "Group 1: nodes [1,2,3] of size k=3 → reverse them" },
        { label: "Reverse group 1", lists: [[3, 2, 1], [4, 5]], reversed: [0], action: "3→2→1 (group 1 reversed). Connect to remaining." },
        { label: "Identify group 2", lists: [[3, 2, 1], [4, 5]], highlight: [3, 4], action: "Group 2: only [4,5] — size < k → leave as-is" },
        { label: "Done", lists: [[3, 2, 1, 4, 5]], reversed: [0], action: "✓ Result: 3→2→1→4→5" },
    ];
    const [step, setStep] = useState(0);
    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                k={k}. Reverse each group of k nodes. Leave remainder as-is.
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
                {s.lists.map((list, gi) => (
                    <div key={gi} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        {list.map((v, i) => {
                            const isReversed = s.reversed?.includes(gi);
                            return (
                                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isReversed ? "#065f46" : s.highlight && gi === 0 && i < k ? "#6366f1" : "#1e293b", border: `2px solid ${isReversed ? "#4ade80" : s.highlight && gi === 0 && i < k ? "#818cf8" : "#334155"}`, fontSize: 14, color: "#e2e8f0", transition: "all 0.3s" }}>{v}</div>
                                    {i < list.length - 1 && <div style={{ color: isReversed ? "#4ade80" : "#334155", fontSize: 16, margin: "0 2px" }}>{isReversed ? "←" : "→"}</div>}
                                </div>
                            );
                        })}
                        {gi < s.lists.length - 1 && <div style={{ color: "#475569", fontSize: 16, margin: "0 6px" }}>→</div>}
                    </div>
                ))}
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
