import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function RemoveDuplicates({ approach = "optimal" }) {
    const arr = [1, 1, 2, 2, 3];
    const [step, setStep] = useState(0);
    const steps = [];
    let slow = 0;
    steps.push({ slow, fast: 0 });
    for (let fast = 1; fast < arr.length; fast++) {
        steps.push({ slow, fast, dup: arr[fast] === arr[slow] });
        if (arr[fast] !== arr[slow]) { slow++; }
    }
    steps.push({ slow, fast: arr.length - 1, done: true });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Remove duplicates in-place from sorted array: [{arr.join(", ")}]
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {arr.map((v, i) => {
                    const isSlow = i === s.slow;
                    const isFast = i === s.fast;
                    return (
                        <div key={i} style={{
                            width: 44, height: 44, borderRadius: 8, display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            background: isSlow && isFast ? "#7c3aed" : isSlow ? "#6366f1" : isFast ? "#0891b2" : i <= (s.slow ?? 0) ? "#065f46" : "#0f172a",
                            border: `2px solid ${isSlow || isFast ? "#818cf8" : "#334155"}`,
                            fontSize: 14, color: "#e2e8f0"
                        }}>
                            {v}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {arr.map((_, i) => {
                    const isSlow = i === s.slow;
                    const isFast = i === s.fast;
                    return (
                        <div key={i} style={{ width: 44, textAlign: "center", fontSize: 11, color: isSlow ? "#818cf8" : isFast ? "#38bdf8" : "transparent" }}>
                            {isSlow && isFast ? "s/f" : isSlow ? "slow" : isFast ? "fast" : "."}
                        </div>
                    );
                })}
            </div>
            {s.dup !== undefined && (
                <div style={{ marginBottom: 12, fontSize: 13, color: "#94a3b8" }}>
                    arr[fast]={arr[s.fast]} {s.dup
                        ? <span style={{ color: "#f87171" }}>== arr[slow]={arr[s.slow]} → skip (duplicate)</span>
                        : <span style={{ color: "#4ade80" }}>!= arr[slow]={arr[s.slow]} → slow++, write</span>}
                </div>
            )}
            {s.done && (
                <div style={{ marginBottom: 12, fontSize: 13, color: "#4ade80" }}>
                    ✓ Done! Unique count = {s.slow + 1}. Array prefix = [{arr.slice(0, s.slow + 1).join(", ")}]
                </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
