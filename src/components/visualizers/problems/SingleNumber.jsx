import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function SingleNumber({ approach = "optimal" }) {
    const nums = [4, 1, 2, 1, 2];
    const [step, setStep] = useState(0);
    const steps = [];
    let xor = 0;
    steps.push({ xor, i: -1, action: "Init: xor=0. XOR all numbers — pairs cancel out, unique remains." });
    for (let i = 0; i < nums.length; i++) {
        const prev = xor;
        xor ^= nums[i];
        steps.push({ xor, i, action: `xor = ${prev} XOR ${nums[i]} = ${xor} (${prev.toString(2).padStart(4, "0")} XOR ${nums[i].toString(2).padStart(4, "0")} = ${xor.toString(2).padStart(4, "0")})` });
    }
    steps.push({ xor, done: true, action: `✓ Single number = ${xor} (all pairs cancelled via XOR)` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                [{nums.join(", ")}] — XOR all: a⊕a=0, a⊕0=a. Pairs cancel, unique survives.
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
                {nums.map((v, i) => (
                    <div key={i} style={{ width: 42, height: 42, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: i === s.i ? "#6366f1" : "#1e293b", border: `2px solid ${i === s.i ? "#818cf8" : "#334155"}`, fontSize: 14, color: i === s.i ? "#e2e8f0" : "#94a3b8" }}>{v}</div>
                ))}
            </div>
            <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "12px 16px", marginBottom: 12, fontFamily: "monospace" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ color: "#64748b", fontSize: 12 }}>xor =</span>
                    <span style={{ color: "#60a5fa", fontSize: 16, fontWeight: "bold" }}>{s.xor}</span>
                    <span style={{ color: "#475569", fontSize: 12 }}>= {(s.xor || 0).toString(2).padStart(4, "0")}</span>
                </div>
                {s.done && <div style={{ color: "#4ade80", fontSize: 14, marginTop: 4 }}>✓ Answer: {s.xor}</div>}
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>{s.action}</div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
