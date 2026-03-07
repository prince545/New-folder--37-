import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function NumberofProvinces({ approach = "optimal" }) {
    const n = 6;
    const connections = [[0, 1], [1, 2], [3, 4]]; // 3 provinces: {0,1,2}, {3,4}, {5}
    const [step, setStep] = useState(0);
    const steps = [];

    const parent = Array.from({ length: n }, (_, i) => i);
    const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };

    steps.push({ parent: [...parent], provinces: n, action: "Init: each city is its own province" });

    for (const [a, b] of connections) {
        const pa = find(a), pb = find(b);
        if (pa !== pb) { parent[pa] = pb; }
        const currentProvinces = new Set(Array.from({ length: n }, (_, i) => find(i))).size;
        steps.push({ parent: [...parent], provinces: currentProvinces, merged: [a, b], action: `Union(${a},${b}): merge provinces ${pa} and ${pb} → now ${currentProvinces} provinces` });
    }
    const finalProvinces = new Set(Array.from({ length: n }, (_, i) => find(i))).size;
    steps.push({ parent: [...parent], provinces: finalProvinces, done: true, action: `✓ Total provinces = ${finalProvinces}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const nodePos = [[40, 30], [110, 30], [180, 30], [40, 110], [110, 110], [220, 60]];
    const friendColors = (node) => { const root = s.parent?.[node]; const val = root; return ["#6366f1", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"][val % 6]; };

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Number of Provinces using Union-Find. Connected cities = same province.
            </div>

            <div style={{ display: "flex", gap: 12 }}>
                <svg width={265} height={155} style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155", marginBottom: 12 }}>
                    {connections.map(([a, b], i) => (
                        <line key={i} x1={nodePos[a][0]} y1={nodePos[a][1]} x2={nodePos[b][0]} y2={nodePos[b][1]} stroke={s.merged && s.merged[0] === a && s.merged[1] === b ? "#818cf8" : "#334155"} strokeWidth={s.merged && s.merged[0] === a && s.merged[1] === b ? 2.5 : 1.5} />
                    ))}
                    {Array.from({ length: n }, (_, i) => (
                        <g key={i}>
                            <circle cx={nodePos[i][0]} cy={nodePos[i][1]} r={20} fill={friendColors(i)} stroke="#e2e8f0" strokeWidth={1.5} opacity={0.9} />
                            <text x={nodePos[i][0]} y={nodePos[i][1] + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">{i}</text>
                        </g>
                    ))}
                </svg>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                    <div style={{ background: "#14532d", padding: "12px 18px", borderRadius: 10, textAlign: "center" }}>
                        <div style={{ color: "#64748b", fontSize: 11 }}>Provinces</div>
                        <div style={{ color: "#4ade80", fontSize: 28, fontWeight: "bold" }}>{s.provinces}</div>
                    </div>
                </div>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>{s.action}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
