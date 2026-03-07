import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function BitManipulationViz({ problemId }) {
    // 191: Number of 1 Bits (Hamming Weight)
    // 338: Counting Bits
    const [step, setStep] = useState(0);
    const steps = [];

    const toBinary = (n, bits = 8) => n.toString(2).padStart(bits, "0");

    if (problemId === 191) {
        // Number of 1 Bits
        let n = 11; // 0b00001011
        let count = 0;
        steps.push({ n, bits: toBinary(n), count, phase: "start" });

        while (n !== 0) {
            const lsb = n & 1;
            count += lsb;
            steps.push({ n, bits: toBinary(n), count, lsb, phase: lsb === 1 ? "found_one" : "zero_bit" });
            n = n >>> 1; // unsigned right shift
            steps.push({ n, bits: toBinary(n), count, phase: "shifted" });
        }
        steps.push({ n: 0, bits: toBinary(0), count, phase: "done" });
    } else {
        // Counting Bits (338)
        const n = 5;
        const dp = new Array(n + 1).fill(0);
        const binaryReps = [];
        steps.push({ dp: [...dp], n, i: 0, phase: "start", binaryReps: [] });

        dp[0] = 0;
        binaryReps.push(toBinary(0, 4));
        steps.push({ dp: [...dp], n, i: 0, phase: "base_case", binaryReps: [...binaryReps] });

        for (let i = 1; i <= n; i++) {
            dp[i] = dp[i >> 1] + (i & 1);
            binaryReps.push(toBinary(i, 4));
            steps.push({
                dp: [...dp], n, i, phase: "calculated", binaryReps: [...binaryReps],
                formula: `dp[${i}] = dp[${i >> 1}] + (${i} & 1) = ${dp[i >> 1]} + ${i & 1} = ${dp[i]}`
            });
        }
        steps.push({ dp: [...dp], n, i: n, phase: "done", binaryReps: [...binaryReps] });
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                {problemId === 191 ? "Number of 1 Bits (n = 11 = 0b00001011)" : "Counting Bits (n = 5)"}
            </div>

            {problemId === 191 ? (
                <>
                    {/* Bit Display */}
                    <div style={{ marginBottom: 16, background: "#0f172a", padding: 16, borderRadius: 8, border: "1px solid #334155" }}>
                        <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Binary Representation</div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                            {(s?.bits || "00000000").split("").map((bit, i) => {
                                const isLSB = i === 7; // rightmost bit (LSB)
                                const isChecked = s?.phase === "found_one" && isLSB;
                                return (
                                    <div key={i} style={{
                                        width: 36, height: 36, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                                        background: bit === "1" ? (isChecked ? "#6366f1" : "#1e293b") : "#0f172a",
                                        border: `2px solid ${isChecked ? "#818cf8" : bit === "1" ? "#475569" : "#334155"}`,
                                        fontSize: 18, color: bit === "1" ? "#e2e8f0" : "#475569",
                                        transition: "all 0.3s"
                                    }}>
                                        {bit}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                            {["7", "6", "5", "4", "3", "2", "1", "0"].map(b => (
                                <div key={b} style={{ width: 36, textAlign: "center", fontSize: 11, color: "#475569" }}>{b}</div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                            <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>n (decimal)</div>
                            <div style={{ color: "#60a5fa", fontSize: 22, fontWeight: "bold" }}>{s?.n}</div>
                        </div>
                        <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                            <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>n & 1 (LSB)</div>
                            <div style={{ color: s?.lsb === 1 ? "#4ade80" : "#94a3b8", fontSize: 22, fontWeight: "bold" }}>{s?.lsb !== undefined ? s.lsb : "-"}</div>
                        </div>
                        <div style={{ flex: 1, background: "#14532d", padding: 12, borderRadius: 8 }}>
                            <div style={{ color: "#86efac", fontSize: 12, marginBottom: 4 }}>Count of 1s</div>
                            <div style={{ color: "#4ade80", fontSize: 22, fontWeight: "bold" }}>{s?.count}</div>
                        </div>
                    </div>

                    <div style={{ background: "#1e293b", padding: 12, borderRadius: 8, marginBottom: 16, minHeight: 40 }}>
                        {s?.phase === "start" && <span style={{ color: "#94a3b8" }}>Starting... n = 11 in decimal</span>}
                        {s?.phase === "found_one" && <span style={{ color: "#4ade80" }}>LSB is 1 → count++ = {s.count}. Then shift n right by 1.</span>}
                        {s?.phase === "zero_bit" && <span style={{ color: "#94a3b8" }}>LSB is 0 → count stays {s.count}. Then shift n right by 1.</span>}
                        {s?.phase === "shifted" && <span style={{ color: "#a78bfa" }}>n = n {">>>"} 1 = {s.n} (0b{s.bits})</span>}
                        {s?.phase === "done" && <span style={{ color: "#4ade80", fontWeight: "bold" }}>✓ Done! Hamming weight = {s.count}</span>}
                    </div>
                </>
            ) : (
                <>
                    {/* Counting Bits DP */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                        {s?.dp?.map((v, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    background: i === s?.i ? "#14532d" : i < s?.i ? "#1e293b" : "#0f172a",
                                    border: `2px solid ${i === s?.i ? "#4ade80" : i < s?.i ? "#475569" : "#334155"}`,
                                    fontSize: 16, color: i === s?.i ? "#4ade80" : "#e2e8f0", transition: "all 0.3s"
                                }}>
                                    {v}
                                </div>
                                <div style={{ fontSize: 10, color: "#64748b" }}>
                                    {s?.binaryReps?.[i] || ""}
                                </div>
                                <div style={{ fontSize: 10, color: "#64748b" }}>dp[{i}]</div>
                            </div>
                        ))}
                    </div>

                    {s?.formula && (
                        <div style={{ background: "#1e293b", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14, color: "#a78bfa" }}>
                            {s.formula}
                        </div>
                    )}
                    {s?.phase === "done" && (
                        <div style={{ background: "#14532d", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14, color: "#4ade80", fontWeight: "bold" }}>
                            ✓ Result: [{s.dp?.join(", ")}]
                        </div>
                    )}
                </>
            )}

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 12, alignSelf: "center" }}>Step {Math.min(step + 1, steps.length)}/{steps.length}</span>
            </div>
        </div>
    );
}
