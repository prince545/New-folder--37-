import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function PivotIndexViz({ problemId }) {
    const arr = [1, 7, 3, 6, 5, 6];
    const [idx, setIdx] = useState(0);
    const total = arr.reduce((a, b) => a + b, 0);
    let left = 0;
    const results = arr.map((v, i) => { const r = { left, right: total - left - v, val: v }; left += v; return r; });
    const r = results[idx];
    const isPivot = r.left === r.right;
    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>Find index where leftSum == rightSum. Total={total}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {arr.map((v, i) => (
                    <div key={i} onClick={() => setIdx(i)} style={{ width: 44, height: 44, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === idx ? (isPivot ? "#14532d" : "#6366f1") : "#0f172a", border: `2px solid ${i === idx ? (isPivot ? "#4ade80" : "#818cf8") : "#334155"}`, cursor: "pointer", fontSize: 13, color: "#e2e8f0" }}>
                        <span>{v}</span><span style={{ fontSize: 9, color: "#64748b" }}>[{i}]</span>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#60a5fa" }}>leftSum={r.left}</span>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#fb923c" }}>rightSum={r.right}</span>
                {isPivot && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>✓ Pivot at index {idx}!</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setIdx(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setIdx(s => Math.min(arr.length - 1, s + 1))} style={btnStyle}>Next →</button>
            </div>
        </div >
    );
}
