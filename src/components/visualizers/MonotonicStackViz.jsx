import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function MonotonicStackViz({ problemId }) {
    const arr = problemId === 739 ? [73, 74, 75, 71, 69, 72, 76, 73] : [1, 2, 1];
    const [step, setStep] = useState(0);
    const steps = [];
    const stack = [], result = new Array(arr.length).fill(0);
    for (let i = 0; i < (problemId === 739 ? arr.length : arr.length * 2); i++) {
        const idx = i % arr.length;
        while (stack.length && arr[stack[stack.length - 1]] < arr[idx]) {
            const popped = stack.pop();
            result[popped] = problemId === 739 ? i - popped : arr[idx];
            steps.push({ i: idx, stack: [...stack], popped, result: [...result] });
        }
        if (i < arr.length) stack.push(i);
        steps.push({ i: idx, stack: [...stack], result: [...result] });
    }
    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>Array: [{arr.join(", ")}]</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {arr.map((v, i) => (
                    <div key={i} style={{ width: 40, height: 40, borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === s?.i ? "#6366f1" : s?.stack?.includes(i) ? "#1e293b" : "#0f172a", border: `2px solid ${i === s?.i ? "#818cf8" : s?.stack?.includes(i) ? "#4f46e5" : "#334155"}`, fontSize: 12, color: "#e2e8f0" }}>
                        <div>{v}</div><div style={{ fontSize: 9, color: "#64748b" }}>[{i}]</div>
                    </div>
                ))}
            </div>
            <div style={{ marginBottom: 12 }}>
                <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>Stack (indices): [{s?.stack?.join(", ")}]</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>Result: [{s?.result?.map(v => v || "0").join(", ")}]</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div >
    );
}
