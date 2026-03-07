import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function WordLadder({ approach = "optimal" }) {
    const beginWord = "hit", endWord = "cog";
    const bfsLevels = [["hit"], ["hot"], ["dot", "lot"], ["dog", "log"], ["cog"]];
    const [step, setStep] = useState(0);
    const visible = bfsLevels.slice(0, step + 1);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                "{beginWord}" → "{endWord}" — BFS finds shortest word transformation path.
            </div>

            <div style={{ marginBottom: 12 }}>
                {visible.map((level, li) => (
                    <div key={li} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: "#64748b", fontSize: 11, width: 54 }}>Level {li}:</span>
                        <div style={{ display: "flex", gap: 4 }}>
                            {level.map((w, i) => (
                                <div key={i} style={{ padding: "6px 12px", borderRadius: 8, background: w === endWord ? "#14532d" : li === visible.length - 1 ? "#4f46e5" : "#1e3a5f", border: `1px solid ${w === endWord ? "#4ade80" : li === visible.length - 1 ? "#6366f1" : "#3b82f6"}`, color: "#e2e8f0", fontSize: 13, fontWeight: "bold" }}>{w}</div>
                            ))}
                        </div>
                        {li < visible.length - 1 && <span style={{ color: "#334155", fontSize: 16 }}>↓</span>}
                    </div>
                ))}
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>
                {step < bfsLevels.length - 1
                    ? `BFS Level ${step}: change 1 char from each word, add valid dictionary words`
                    : `✓ Reached "${endWord}"! Shortest path = ${bfsLevels.length} transformations`}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(bfsLevels.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{bfsLevels.length}</span>
            </div>
        </div>
    );
}
