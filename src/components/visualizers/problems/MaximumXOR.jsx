import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function MaximumXOR({ approach = "optimal" }) {
    const arr = [3, 10, 5, 25, 2, 8];
    const [step, setStep] = useState(0);
    const steps = [];
    let maxXor = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            const x = arr[i] ^ arr[j];
            if (x > maxXor) {
                maxXor = x;
                steps.push({ a: arr[i], b: arr[j], xor: x, maxXor, aBin: arr[i].toString(2).padStart(5, "0"), bBin: arr[j].toString(2).padStart(5, "0"), xBin: x.toString(2).padStart(5, "0"), action: `${arr[i]} XOR ${arr[j]} = ${x} → new max!` });
            }
        }
    }
    steps.push({ done: true, maxXor, action: `✓ Maximum XOR = ${maxXor} (${maxXor.toString(2)})` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                [{arr.join(", ")}] — Find pair with maximum XOR.
            </div>

            {s.a !== undefined && (
                <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #334155", marginBottom: 12, fontFamily: "monospace" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                        <div style={{ color: "#818cf8", fontSize: 13 }}>{s.a}</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>=</div>
                        <div style={{ color: "#60a5fa", fontSize: 13, letterSpacing: 4 }}>{s.aBin}</div>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                        <div style={{ color: "#818cf8", fontSize: 13 }}>{s.b}</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>=</div>
                        <div style={{ color: "#fb923c", fontSize: 13, letterSpacing: 4 }}>{s.bBin}</div>
                    </div>
                    <div style={{ borderTop: "1px solid #334155", paddingTop: 8, marginTop: 4 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={{ color: "#4ade80", fontSize: 13 }}>{s.xor}</div>
                            <div style={{ color: "#64748b", fontSize: 11 }}>XOR =</div>
                            <div style={{ color: "#4ade80", fontSize: 13, letterSpacing: 4 }}>{s.xBin}</div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "#14532d", padding: "4px 12px", borderRadius: 6, fontSize: 14, color: "#4ade80", fontWeight: "bold" }}>
                    maxXOR = {s.maxXor}
                </span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>
                {s.action}
            </div>

            <div style={{ color: "#64748b", fontSize: 11, marginBottom: 12 }}>
                Note: Optimal uses a Trie of binary representations for O(n·L) time. This shows O(n²) brute force for visualization.
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
