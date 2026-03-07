import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function DailyTemperatures({ approach = "optimal" }) {
    const temps = [73, 74, 75, 71, 69, 72, 76, 73];
    const [step, setStep] = useState(0);
    const steps = [];
    const stack = [];
    const result = new Array(temps.length).fill(0);

    for (let i = 0; i < temps.length; i++) {
        while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
            const j = stack.pop();
            result[j] = i - j;
            steps.push({ i, stack: [...stack], popped: j, result: [...result], action: `temps[${j}]=${temps[j]} < temps[${i}]=${temps[i]} → wait=${i - j} days` });
        }
        stack.push(i);
        steps.push({ i, stack: [...stack], result: [...result], action: `Push index ${i} (temp=${temps[i]})` });
    }
    steps.push({ done: true, result: [...result], stack: [], action: `✓ Result: [${result.join(",")}]` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const maxH = Math.max(...temps);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Temps: [{temps.join(", ")}] — monotonic decreasing stack. Pop when warmer day found.
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", marginBottom: 8, height: 80 }}>
                {temps.map((t, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>{t}</div>
                        <div style={{ width: 30, height: `${(t / maxH) * 60}px`, background: i === s.i ? "#6366f1" : s.stack?.includes(i) ? "#1e3a5f" : "#334155", border: `2px solid ${i === s.i ? "#818cf8" : s.stack?.includes(i) ? "#3b82f6" : "#475569"}`, borderRadius: "3px 3px 0 0", transition: "all 0.3s" }} />
                        <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>[{i}]</div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>Stack idxs: [<span style={{ color: "#818cf8" }}>{s.stack?.join(", ")}</span>]</span>
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>{s.action}</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {(s.result || []).map((v, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: v > 0 ? "#14532d" : "#1e293b", border: `1px solid ${v > 0 ? "#4ade80" : "#334155"}`, fontSize: 11, color: v > 0 ? "#4ade80" : "#64748b" }}>{v}</div>
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
