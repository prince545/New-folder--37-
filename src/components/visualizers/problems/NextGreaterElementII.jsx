import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function NextGreaterElementII({ approach = "optimal" }) {
    const arr = [1, 2, 1];
    const [step, setStep] = useState(0);
    const steps = [];
    const stack = [], result = new Array(arr.length).fill(0);

    for (let i = 0; i < arr.length * 2; i++) {
        const idx = i % arr.length;
        while (stack.length && arr[stack[stack.length - 1]] < arr[idx]) {
            const popped = stack.pop();
            result[popped] = arr[idx];
            steps.push({ i: idx, pass: Math.floor(i / arr.length) + 1, stack: [...stack], popped, result: [...result], action: `Pop [${popped}]=${arr[popped]}, NGE=${arr[idx]}` });
        }
        if (i < arr.length) stack.push(i);
        steps.push({ i: idx, pass: Math.floor(i / arr.length) + 1, stack: [...stack], result: [...result], action: i < arr.length ? `Push index ${idx}` : `Check pass 2, idx=${idx}` });
    }
    steps.push({ done: true, result: [...result] });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Circular Array: [{arr.join(", ")}] — Next Greater Element II (2 passes)
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {arr.map((v, i) => (
                    <div key={i} style={{
                        width: 40, height: 40, borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        background: i === s.i ? "#6366f1" : s.stack?.includes(i) ? "#1e293b" : "#0f172a",
                        border: `2px solid ${i === s.i ? "#818cf8" : s.stack?.includes(i) ? "#4f46e5" : "#334155"}`,
                        fontSize: 12, color: "#e2e8f0"
                    }}>
                        <div>{v}</div><div style={{ fontSize: 9, color: "#64748b" }}>[{i}]</div>
                    </div>
                ))}
                <div style={{ color: "#475569", alignSelf: "center", fontSize: 14, marginLeft: 4 }}>↩ circular</div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>Pass <span style={{ color: "#f59e0b" }}>{s.pass}</span>/2</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>Stack: [<span style={{ color: "#818cf8" }}>{s.stack?.join(", ")}</span>]</span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>
                {s.action || (s.done ? "Done!" : "")}
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {arr.map((_, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{ width: 40, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: s.result?.[i] > 0 ? "#14532d" : "#1e293b", border: `1px solid ${s.result?.[i] > 0 ? "#4ade80" : "#334155"}`, fontSize: 14, color: s.result?.[i] > 0 ? "#4ade80" : "#64748b" }}>
                            {s.result?.[i] === 0 ? "-1" : s.result?.[i]}
                        </div>
                        <div style={{ fontSize: 9, color: "#64748b" }}>res[{i}]</div>
                    </div>
                ))}
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
