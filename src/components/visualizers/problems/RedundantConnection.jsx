import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function RedundantConnection({ approach = "optimal" }) {
    const n = 5;
    const connections = [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5]]; // [2,3] is redundant
    const [step, setStep] = useState(0);
    const steps = [];

    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const find = (x) => { while (parent[x] !== x) x = parent[x]; return x; };

    steps.push({ parent: [...parent], current: null, action: "Init: each node is its own parent" });

    for (const [u, v] of connections) {
        const pu = find(u), pv = find(v);
        const isCycle = pu === pv;
        if (!isCycle) parent[pu] = pv;
        steps.push({ parent: [...parent], current: [u, v], pu, pv, isCycle, action: isCycle ? `Union(${u},${v}): root(${u})=${pu}==root(${v})=${pv} → CYCLE! Redundant edge: [${u},${v}]` : `Union(${u},${v}): root(${u})=${pu} → root(${v})=${pv}. Merged.` });
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const nodePos = { 1: [70, 30], 2: [20, 90], 3: [120, 90], 4: [120, 150], 5: [60, 150] };

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Find redundant edge that creates a cycle using Union-Find.
            </div>

            <div style={{ display: "flex", gap: 16 }}>
                <svg width={160} height={190} style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155", marginBottom: 12 }}>
                    {connections.map(([a, b], i) => {
                        const isActive = s.current && s.current[0] === a && s.current[1] === b;
                        const isCycleEdge = isActive && s.isCycle;
                        return <line key={i} x1={nodePos[a][0]} y1={nodePos[a][1]} x2={nodePos[b][0]} y2={nodePos[b][1]} stroke={isCycleEdge ? "#ef4444" : isActive ? "#818cf8" : "#334155"} strokeWidth={isCycleEdge ? 3 : 2} />;
                    })}
                    {Array.from({ length: n }, (_, i) => {
                        const node = i + 1;
                        const isActive = s.current && (s.current[0] === node || s.current[1] === node);
                        return (
                            <g key={node}>
                                <circle cx={nodePos[node][0]} cy={nodePos[node][1]} r={18} fill={isActive ? "#6366f1" : "#1e293b"} stroke={isActive && s.isCycle ? "#ef4444" : isActive ? "#818cf8" : "#334155"} strokeWidth={2} />
                                <text x={nodePos[node][0]} y={nodePos[node][1] + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{node}</text>
                            </g>
                        );
                    })}
                </svg>

                <div style={{ flex: 1 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>parent[] array:</div>
                    <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
                        {Array.from({ length: n }, (_, i) => i + 1).map(node => (
                            <div key={node} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12 }}>
                                <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}>{node}</div>
                                <span style={{ color: "#64748b" }}>→</span>
                                <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", border: "1px solid #334155", color: "#60a5fa" }}>{s.parent?.[node]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.isCycle ? "#ef4444" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.isCycle ? "#f87171" : "#a78bfa" }}>
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
