import { useState, useEffect } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function EditDistance({ approach = "optimal" }) {
    const s1 = "horse", s2 = "ros";
    const [step, setStep] = useState(0);
    const [cells, setCells] = useState([]);

    useEffect(() => {
        const m = s1.length, n = s2.length;
        const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
        const allCells = [];
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                allCells.push({ i, j, dp: dp.map(r => [...r]), op: s1[i - 1] === s2[j - 1] ? "match" : dp[i][j] === dp[i - 1][j - 1] + 1 ? "replace" : dp[i][j] === dp[i - 1][j] + 1 ? "delete" : "insert" });
            }
        }
        setCells(allCells);
    }, []);

    const s = cells[Math.min(step, cells.length - 1)];
    if (!s) return <div style={{ color: "#94a3b8" }}>Loading...</div>;

    const opColor = { match: "#4ade80", replace: "#f59e0b", delete: "#f87171", insert: "#60a5fa" };

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Edit Distance: "{s1}" → "{s2}" | ops: replace/delete/insert (each costs 1)
            </div>

            <div style={{ overflowX: "auto", marginBottom: 12 }}>
                <table style={{ borderCollapse: "separate", borderSpacing: 2 }}>
                    <thead>
                        <tr>
                            <td style={{ width: 28 }} />
                            <td style={{ width: 28, textAlign: "center", color: "#64748b", fontSize: 11 }}>""</td>
                            {s2.split("").map((c, j) => <td key={j} style={{ width: 28, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>{c}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {s.dp.map((row, i) => (
                            <tr key={i}>
                                <td style={{ textAlign: "center", color: "#94a3b8", fontSize: 12 }}>{i === 0 ? '""' : s1[i - 1]}</td>
                                {row.map((v, j) => (
                                    <td key={j} style={{ width: 28, height: 28, textAlign: "center", background: i === s.i && j === s.j ? "#6366f1" : (i < s.i || (i === s.i && j < s.j)) ? "#1e293b" : "#0f172a", borderRadius: 5, border: `1px solid ${i === s.i && j === s.j ? "#818cf8" : "#334155"}`, fontSize: 12, color: "#e2e8f0" }}>{v}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>
                    '{s1[s.i - 1]}' vs '{s2[s.j - 1]}' →
                    <span style={{ marginLeft: 6, color: opColor[s.op], fontWeight: "bold" }}>{s.op}</span>
                </span>
                <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#4ade80" }}>
                    Answer: dp[{s1.length}][{s2.length}] = {s.dp[s1.length][s2.length]}
                </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(cells.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{cells.length}</span>
            </div>
        </div>
    );
}
