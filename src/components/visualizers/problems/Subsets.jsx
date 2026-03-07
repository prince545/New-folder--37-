import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function Subsets({ approach = "optimal" }) {
    const nums = [1, 2, 3];
    const [step, setStep] = useState(0);
    const steps = [];
    const results = [];

    const bt = (start, curr) => {
        results.push([...curr]);
        steps.push({ curr: [...curr], results: results.map(r => [...r]), action: `Add [${curr.join(",")}] to results` });
        for (let i = start; i < nums.length; i++) {
            curr.push(nums[i]);
            steps.push({ curr: [...curr], results: results.map(r => [...r]), action: `Include nums[${i}]=${nums[i]}` });
            bt(i + 1, curr);
            curr.pop();
            steps.push({ curr: [...curr], results: results.map(r => [...r]), action: `Backtrack: remove nums[${i}]=${nums[i]}` });
        }
    };
    bt(0, []);

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                nums=[{nums.join(",")}] — Generate all 2^n subsets via backtracking.
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ background: "#1e293b", padding: 10, borderRadius: 8, flex: 1 }}>
                    <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>Current path:</div>
                    <div style={{ display: "flex", gap: 4, minHeight: 34 }}>
                        {(s.curr || []).map((v, i) => (
                            <div key={i} style={{ width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "#6366f1", border: "2px solid #818cf8", fontSize: 13, color: "#e2e8f0" }}>{v}</div>
                        ))}
                        {(s.curr || []).length === 0 && <span style={{ color: "#475569", fontSize: 12 }}>[]</span>}
                    </div>
                </div>
                <div style={{ background: "#1e293b", padding: 10, borderRadius: 8, flex: 2, maxHeight: 120, overflowY: "auto" }}>
                    <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>Results ({(s.results || []).length}/8):</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(s.results || []).map((r, i) => (
                            <span key={i} style={{ background: "#14532d", border: "1px solid #4ade80", borderRadius: 5, padding: "2px 7px", fontSize: 12, color: "#4ade80" }}>[{r.join(",")}]</span>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.action?.includes("Add") ? "#4ade80" : s.action?.includes("Back") ? "#f59e0b" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.action?.includes("Add") ? "#4ade80" : s.action?.includes("Back") ? "#fb923c" : "#a78bfa" }}>{s.action}</div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
