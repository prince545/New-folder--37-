import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function LongestValidParentheses({ approach = "optimal" }) {
    const str = ")(()((";
    const [step, setStep] = useState(0);
    const steps = [];
    const stack = [-1];
    let maxLen = 0;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === "(") {
            stack.push(i);
            steps.push({ i, stack: [...stack], maxLen, action: `Push index ${i} '('` });
        } else {
            stack.pop();
            if (stack.length === 0) {
                stack.push(i);
                steps.push({ i, stack: [...stack], maxLen, action: `Stack empty → push ${i} as new base` });
            } else {
                maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
                steps.push({ i, stack: [...stack], maxLen, action: `len = ${i} - stack_top(${stack[stack.length - 1]}) = ${i - stack[stack.length - 1]}` });
            }
        }
    }
    steps.push({ done: true, stack: [...stack], maxLen });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                String: "{str}" — Find longest valid parentheses substring.
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {str.split("").map((c, i) => (
                    <div key={i} style={{
                        width: 36, height: 36, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                        background: i === s.i ? "#6366f1" : i < s.i ? "#1e293b" : "#0f172a",
                        border: `2px solid ${i === s.i ? "#818cf8" : "#334155"}`,
                        fontSize: 16, color: "#e2e8f0", fontWeight: "bold"
                    }}>{c}</div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>
                    Stack: [<span style={{ color: "#818cf8" }}>{s.stack?.join(", ")}</span>]
                </span>
                <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>
                    maxLen = {s.maxLen}
                </span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa", minHeight: 28 }}>
                {s.action || (s.done ? `✓ Answer: ${s.maxLen}` : "")}
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
