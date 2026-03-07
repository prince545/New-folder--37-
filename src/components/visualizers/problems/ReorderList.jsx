import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ReorderList({ approach = "optimal" }) {
    const steps = [
        { label: "Original", list: [[1], [2], [3], [4], [5]], action: "Start: 1→2→3→4→5" },
        { label: "Find Middle", list: [[1], [2, "←slow"], [3], [4], [5]], action: "Step 1: slow-fast pointers find middle (node 3)" },
        { label: "Split", listA: [1, 2, 3], listB: [4, 5], action: "Step 2: Split into [1,2,3] and [4,5]" },
        { label: "Reverse 2nd Half", listA: [1, 2, 3], listB: [5, 4], action: "Step 3: Reverse second half → [5,4]" },
        { label: "Merge", list: [[1], [5], [2], [4], [3]], action: "Step 4: Merge alternately → 1→5→2→4→3" },
    ];

    const [step, setStep] = useState(0);
    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Reorder List: L0→Ln→L1→Ln-1→… in O(n) time O(1) space.
            </div>

            <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ color: "#6366f1", fontSize: 11, marginBottom: 8 }}>{s.label}</div>

                {s.list ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        {s.list.map((nodeInfo, i) => {
                            const val = Array.isArray(nodeInfo) ? nodeInfo[0] : nodeInfo;
                            const label = Array.isArray(nodeInfo) && nodeInfo[1];
                            return (
                                <div key={i} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step === 3 && (i === 1 || i === 3) ? "#6366f1" : "#1e293b", border: "2px solid #334155", fontSize: 14, color: "#e2e8f0" }}>{val}</div>
                                        {i < s.list.length - 1 && <div style={{ color: "#334155", fontSize: 16, margin: "0 2px" }}>→</div>}
                                    </div>
                                    {label && <div style={{ fontSize: 9, color: "#818cf8", marginTop: 2 }}>{label}</div>}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: 16 }}>
                        {[{ arr: s.listA, label: "First half" }, { arr: s.listB, label: s.label === "Reverse 2nd Half" ? "Reversed" : "Second half" }].map(({ arr, label }) => (
                            <div key={label}>
                                <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>{label}</div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {arr.map((v, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center" }}>
                                            <div style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b", border: "2px solid #334155", fontSize: 14, color: "#e2e8f0" }}>{v}</div>
                                            {i < arr.length - 1 && <div style={{ color: "#334155", fontSize: 16, margin: "0 2px" }}>→</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
