import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function CombinationSum({ approach = "optimal" }) {
    const candidates = [2, 3, 6, 7];
    const target = 7;
    const [step, setStep] = useState(0);
    const steps = [];
    const results = [];

    const bt = (start, curr, rem) => {
        if (rem === 0) {
            results.push([...curr]);
            steps.push({ curr: [...curr], rem, results: results.map(r => [...r]), found: true, action: `✓ Found: [${curr.join(",")}]` });
            return;
        }
        for (let i = start; i < candidates.length && candidates[i] <= rem; i++) {
            curr.push(candidates[i]);
            steps.push({ curr: [...curr], rem: rem - candidates[i], results: results.map(r => [...r]), action: `Add ${candidates[i]}, remaining=${rem - candidates[i]}` });
            bt(i, curr, rem - candidates[i]);
            const removed = curr.pop();
            steps.push({ curr: [...curr], rem, results: results.map(r => [...r]), action: `Backtrack: remove ${removed}` });
        }
    };
    bt(0, [], target);
    steps.push({ curr: [], rem: 0, results: results.map(r => [...r]), done: true, action: `✓ All combinations found: ${results.length} results` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                candidates=[{candidates.join(",")}] target={target} — elements can be reused.
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Current path</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", minHeight: 38 }}>
                        {(s.curr || []).map((v, i) => (
                            <div key={i} style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "#6366f1", border: "2px solid #818cf8", fontSize: 13, color: "#e2e8f0" }}>{v}</div>
                        ))}
                        {(s.curr || []).length === 0 && <div style={{ color: "#475569", fontSize: 12, alignSelf: "center" }}>[]</div>}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>remaining: <span style={{ color: s.rem === 0 ? "#4ade80" : "#fb923c" }}>{s.rem}</span></div>
                </div>

                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Results ({(s.results || []).length})</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 80, overflowY: "auto" }}>
                        {(s.results || []).map((r, i) => (
                            <span key={i} style={{ background: "#14532d", border: "1px solid #4ade80", borderRadius: 5, padding: "2px 7px", fontSize: 12, color: "#4ade80" }}>[{r.join(",")}]</span>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.found ? "#4ade80" : s.action?.includes("Backtrack") ? "#f59e0b" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.found ? "#4ade80" : s.action?.includes("Backtrack") ? "#fb923c" : "#a78bfa" }}>
                {s.action}
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
