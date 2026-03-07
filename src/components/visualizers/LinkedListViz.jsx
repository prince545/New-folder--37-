import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function LinkedListViz({ problemId }) {
    // Middle of Linked List or Reverse Linked List
    const arr = [1, 2, 3, 4, 5];
    const [step, setStep] = useState(0);
    const steps = [];

    if (problemId === 876) {
        // Middle of the Linked List (Fast/Slow Pointers)
        let slow = 0, fast = 0;
        while (fast < arr.length && fast + 1 < arr.length) {
            steps.push({ slow, fast, phase: "moving" });
            slow += 1;
            fast += 2;
        }
        steps.push({ slow, fast: Math.min(fast, arr.length - 1), phase: "found" });
    } else {
        // Reverse Linked List (assumed if not 876)
        let curr = 0;
        let prev = -1;
        let reversedList = [];
        while (curr < arr.length) {
            steps.push({ curr, prev, phase: "reversing", tempReversed: [...reversedList] });
            reversedList.unshift(arr[curr]);
            prev = curr;
            curr += 1;
        }
        steps.push({ curr: -1, prev, phase: "done", tempReversed: [...reversedList] });
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                {problemId === 876 ? "Find Middle (Fast/Slow Pointers)" : "Reverse Linked List"}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                {arr.map((v, i) => (
                    <React.Fragment key={i}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 22, display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            background: problemId === 876 ? (i === s?.slow && s?.phase === "found" ? "#14532d" : (i === s?.slow ? "#6366f1" : i === s?.fast ? "#0891b2" : "#0f172a"))
                                : (i === s?.curr ? "#6366f1" : i === s?.prev ? "#0891b2" : "#0f172a"),
                            border: `2px solid ${problemId === 876 ? (i === s?.slow && s?.phase === "found" ? "#4ade80" : (i === s?.slow ? "#818cf8" : i === s?.fast ? "#38bdf8" : "#334155"))
                                : (i === s?.curr ? "#818cf8" : i === s?.prev ? "#38bdf8" : "#334155")}`,
                            fontSize: 16, color: "#e2e8f0", transition: "all 0.3s"
                        }}>
                            {v}
                        </div>
                        {i < arr.length - 1 && (
                            <div style={{ color: s?.phase === "done" || (s?.curr !== undefined && i < s.curr) ? "#334155" : "#64748b", fontSize: 14 }}>
                                {problemId !== 876 && (s?.phase === "done" || (s?.curr !== undefined && i < s.curr)) ? "" : "→"}
                            </div>
                        )}
                    </React.Fragment>
                ))}
                {problemId === 876 && s?.phase !== "done" && <div style={{ color: "#64748b", fontSize: 14 }}>→ null</div>}
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                {arr.map((_, i) => (
                    <div key={i} style={{ width: 44, textAlign: "center", fontSize: 11, color: "transparent" }}>
                        {/* Spacing for pointers beneath nodes */}
                        {problemId === 876 ? (
                            <span style={{ color: i === s?.slow ? "#818cf8" : i === s?.fast ? "#38bdf8" : "transparent" }}>
                                {i === s?.slow && i === s?.fast ? "S/F" : i === s?.slow ? "Slow" : i === s?.fast ? "Fast" : ""}
                            </span>
                        ) : (
                            <span style={{ color: i === s?.curr ? "#818cf8" : i === s?.prev ? "#38bdf8" : "transparent" }}>
                                {i === s?.curr ? "Curr" : i === s?.prev ? "Prev" : ""}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {problemId !== 876 && s?.tempReversed && s.tempReversed.length > 0 && (
                <div style={{ marginBottom: 16, padding: 12, background: "#1e293b", borderRadius: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Reversed Output (so far):</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {s.tempReversed.map((v, i) => (
                            <React.Fragment key={i}>
                                <div style={{ width: 32, height: 32, borderRadius: 16, background: "#0f172a", border: "1px solid #4ade80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#4ade80" }}>{v}</div>
                                {i < s.tempReversed.length - 1 && <span style={{ color: "#4ade80" }}>→</span>}
                            </React.Fragment>
                        ))}
                        <span style={{ color: "#64748b" }}>→ null</span>
                    </div>
                </div>
            )}

            {problemId === 876 && s?.phase === "found" && (
                <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "#14532d", padding: "6px 12px", borderRadius: 6, fontSize: 14, color: "#4ade80" }}>
                        ✓ Middle is {arr[s.slow]}
                    </span>
                </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
