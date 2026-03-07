import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ValidParentheses({ approach = "optimal" }) {
    const str = "({[]})";
    const [step, setStep] = useState(0);
    const steps = [];
    const stack = [];
    const match = { ")": "(", "}": "{", "]": "[" };

    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if ("({[".includes(c)) {
            stack.push(c);
            steps.push({ i, stack: [...stack], valid: null, action: `'${c}' is open → push to stack` });
        } else {
            const top = stack[stack.length - 1];
            const ok = match[c] === top;
            if (ok) stack.pop();
            steps.push({ i, stack: [...stack], matched: ok, action: ok ? `'${c}' matches '${top}' → pop stack` : `'${c}' does NOT match '${top}' → INVALID!` });
        }
    }
    steps.push({ i: str.length, stack: [...stack], valid: stack.length === 0, action: stack.length === 0 ? "✓ Stack empty → Valid!" : "✗ Stack not empty → Invalid!" });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                "{str}" — push open brackets, pop and match on close.
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                {str.split("").map((c, i) => (
                    <div key={i} style={{ width: 38, height: 38, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: i === s.i ? "#6366f1" : i < s.i ? "#1e293b" : "#0f172a", border: `2px solid ${i === s.i ? "#818cf8" : "#334155"}`, fontSize: 18, fontWeight: "bold", color: "#e2e8f0" }}>{c}</div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>Stack: [<span style={{ color: "#818cf8" }}>{s.stack?.join(", ")}</span>]</span>
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.valid === true ? "#4ade80" : s.valid === false ? "#f87171" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.valid === true ? "#4ade80" : s.valid === false ? "#f87171" : "#a78bfa" }}>
                {s.action}
            </div>
            {s.valid !== null && s.valid !== undefined && (
                <div style={{ fontSize: 14, fontWeight: "bold", color: s.valid ? "#4ade80" : "#f87171", marginBottom: 12 }}>
                    {s.valid ? "✓ VALID" : "✗ INVALID"}
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
