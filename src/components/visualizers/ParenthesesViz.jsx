import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ParenthesesViz({ problemId }) {
    const str = problemId === 32 ? ")()())" : "()[]{}";
    const [step, setStep] = useState(0);
    const steps = [];

    if (problemId === 32) {
        const stack = [-1];
        let maxLen = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === "(") {
                stack.push(i);
                steps.push({ i, char: str[i], stack: [...stack], maxLen });
            } else {
                stack.pop();
                if (stack.length === 0) {
                    stack.push(i);
                } else {
                    maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
                }
                steps.push({ i, char: str[i], stack: [...stack], maxLen });
            }
        }
    } else {
        const stack = [];
        const map = { ")": "(", "}": "{", "]": "[" };
        let valid = true;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === "(" || char === "{" || char === "[") {
                stack.push(char);
                steps.push({ i, char, stack: [...stack], valid });
            } else {
                if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
                    valid = false;
                    steps.push({ i, char, stack: [...stack], valid });
                    break;
                }
                stack.pop();
                steps.push({ i, char, stack: [...stack], valid });
            }
        }
        if (valid && stack.length === 0) {
            steps.push({ i: str.length, char: "", stack: [...stack], valid: true, done: true });
        } else if (valid && stack.length > 0) {
            steps.push({ i: str.length, char: "", stack: [...stack], valid: false, done: true });
        }
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>String: "{str}"</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {str.split("").map((char, i) => (
                    <div key={i} style={{ width: 36, height: 36, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === s?.i ? "#6366f1" : (s?.i !== undefined && i < s.i) ? "#1e293b" : "#0f172a", border: `2px solid ${i === s?.i ? "#818cf8" : "#334155"}`, fontSize: 16, color: "#e2e8f0", transition: "all 0.2s" }}>
                        {char}
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Stack</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, minHeight: 120, justifyContent: "flex-end" }}>
                        {s?.stack?.map((item, idx) => (
                            <div key={idx} style={{ background: "#334155", padding: "6px 0", textAlign: "center", borderRadius: 4, color: "#e2e8f0" }}>
                                {item}
                            </div>
                        ))}
                        {(!s?.stack || s.stack.length === 0) && <div style={{ textAlign: "center", color: "#64748b", fontStyle: "italic", fontSize: 13, padding: "6px 0" }}>Empty</div>}
                    </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {problemId === 32 ? (
                        <div style={{ background: "#1e293b", padding: 12, borderRadius: 8, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Current Max Length</div>
                            <div style={{ fontSize: 24, color: "#4ade80", fontWeight: "bold" }}>{s?.maxLen || 0}</div>
                        </div>
                    ) : (
                        <div style={{ background: "#1e293b", padding: 12, borderRadius: 8, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Status</div>
                            <div style={{ fontSize: 18, color: s?.valid === false ? "#ef4444" : s?.done ? "#4ade80" : "#60a5fa", fontWeight: "bold" }}>
                                {s?.valid === false ? "Invalid (Mismatch or Extra)" : s?.done ? "Valid!" : "Processing..."}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
