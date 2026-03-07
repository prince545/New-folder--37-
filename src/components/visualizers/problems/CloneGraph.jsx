import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

const nodes = [1, 2, 3, 4];
const edges = [[1, 2], [1, 4], [2, 3], [3, 4]];
const pos = { 1: [65, 20], 2: [20, 80], 3: [65, 120], 4: [110, 80] };

export default function CloneGraph({ approach = "optimal" }) {
    const [step, setStep] = useState(0);
    const dfsOrder = [1, 2, 3, 4];
    const visited = dfsOrder.slice(0, step + 1);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Clone Graph via DFS + visited map. Cloned nodes shown in green.
            </div>
            <div style={{ display: "flex", gap: 24 }}>
                {["Original", "Cloned"].map((label, side) => (
                    <div key={side} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>{label}</div>
                        <svg width={140} height={150} style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155" }}>
                            {edges.map(([a, b], i) => {
                                const isClonedEdge = side === 1 && visited.includes(a) && visited.includes(b);
                                return (
                                    <line key={i} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]}
                                        stroke={isClonedEdge ? "#4ade80" : "#334155"} strokeWidth={2} />
                                );
                            })}
                            {nodes.map(n => {
                                const isActive = side === 0 && visited[visited.length - 1] === n;
                                const isCloned = side === 1 && visited.includes(n);
                                return (
                                    <g key={n}>
                                        <circle cx={pos[n][0]} cy={pos[n][1]} r={18}
                                            fill={isCloned ? "#065f46" : isActive ? "#4f46e5" : "#1e293b"}
                                            stroke={isCloned ? "#4ade80" : isActive ? "#818cf8" : "#334155"} strokeWidth={2} />
                                        <text x={pos[n][0]} y={pos[n][1] + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{n}</text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 12, background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", fontSize: 12, color: "#a78bfa", marginBottom: 12 }}>
                {step < dfsOrder.length
                    ? `DFS visiting node ${dfsOrder[step]} → create clone, recurse into neighbors`
                    : "✓ Deep clone complete! All nodes and edges duplicated."}
            </div>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 12 }}>Cloned: {visited.map(n => `node${n}`).join(", ")}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(nodes.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{nodes.length}</span>
            </div>
        </div>
    );
}
