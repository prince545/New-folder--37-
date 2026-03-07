import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function Permutations({ approach = "optimal" }) {
    const nums = [1, 2, 3];
    const [step, setStep] = useState(0);
    const steps = [];
    const results = [];

    const bt = (curr, remaining) => {
        if (!remaining.length) {
            results.push([...curr]);
            steps.push({ curr: [...curr], remaining: [], results: results.map(r => [...r]), found: true, action: `✓ Found permutation: [${curr.join(",")}]` });
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            const next = [...remaining];
            const chosen = next.splice(i, 1)[0];
            curr.push(chosen);
            steps.push({ curr: [...curr], remaining: [...next], results: results.map(r => [...r]), action: `Choose ${chosen}, remaining=[${next.join(",")}]` });
            bt(curr, next);
            curr.pop();
            steps.push({ curr: [...curr], remaining, results: results.map(r => [...r]), action: `Backtrack: remove ${chosen}` });
        }
    };
    bt([], [...nums]);

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                nums=[{nums.join(",")}] — All 3!=6 permutations. Pick one element at each level.
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ background: "#1e293b", padding: 10, borderRadius: 8, flex: 1 }}>
                    <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Path:</div>
                    <div style={{ display: "flex", gap: 4 }}>
                        {(s.curr || []).map((v, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "#6366f1", border: "2px solid #818cf8", fontSize: 13, color: "#e2e8f0" }}>{v}</div>)}
                        {!s.curr?.length && <span style={{ color: "#475569", fontSize: 12 }}>[]</span>}
                    </div>
                    <div style={{ color: "#64748b", fontSize: 11, marginTop: 8, marginBottom: 4 }}>Remaining:</div>
                    <div style={{ display: "flex", gap: 4 }}>
                        {(s.remaining || []).map((v, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "#1e3a5f", border: "1px solid #334155", fontSize: 13, color: "#94a3b8" }}>{v}</div>)}
                        {!s.remaining?.length && <span style={{ color: "#475569", fontSize: 12 }}>[]</span>}
                    </div>
                </div>
                <div style={{ background: "#1e293b", padding: 10, borderRadius: 8, flex: 2, maxHeight: 120, overflowY: "auto" }}>
                    <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>Results ({(s.results || []).length}/6):</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(s.results || []).map((r, i) => <span key={i} style={{ background: "#14532d", border: "1px solid #4ade80", borderRadius: 5, padding: "2px 7px", fontSize: 12, color: "#4ade80" }}>[{r.join(",")}]</span>)}
                    </div>
                </div>
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.found ? "#4ade80" : s.action?.includes("Back") ? "#f59e0b" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.found ? "#4ade80" : s.action?.includes("Back") ? "#fb923c" : "#a78bfa" }}>{s.action}</div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
