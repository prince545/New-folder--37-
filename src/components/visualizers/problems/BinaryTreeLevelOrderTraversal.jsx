import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

const treeNodes = [
    { id: 1, val: 1, x: 150, y: 25, children: [2, 3] },
    { id: 2, val: 2, x: 75, y: 80, children: [4, 5] },
    { id: 3, val: 3, x: 225, y: 80, children: [] },
    { id: 4, val: 4, x: 35, y: 140, children: [] },
    { id: 5, val: 5, x: 115, y: 140, children: [] },
];
const edges = treeNodes.flatMap(n => n.children.map(c => ({ from: n, to: treeNodes.find(x => x.id === c) })));

export default function BinaryTreeLevelOrderTraversal({ approach = "optimal" }) {
    const [step, setStep] = useState(0);
    // BFS: Level 0: [1], Level 1: [2,3], Level 2: [4,5]
    const bfsLevels = [[1], [2, 3], [4, 5]];
    const allSteps = [];
    for (let l = 0; l < bfsLevels.length; l++) {
        for (let i = 0; i < bfsLevels[l].length; i++) {
            allSteps.push({ level: l, current: bfsLevels[l][i], visited: bfsLevels.slice(0, l).flat().concat(bfsLevels[l].slice(0, i + 1)), queue: bfsLevels[l].slice(i + 1).concat(l + 1 < bfsLevels.length ? bfsLevels[l + 1] : []), result: bfsLevels.slice(0, l + 1) });
        }
    }
    allSteps.push({ done: true, visited: [1, 2, 3, 4, 5], result: bfsLevels, action: "✓ Done! Level-order: [[1],[2,3],[4,5]]" });

    const s = allSteps[Math.min(step, allSteps.length - 1)] || allSteps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                BFS with queue. Process all nodes at each level before going deeper.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
                <svg width={270} height={175} style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155", marginBottom: 12 }}>
                    {edges.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#334155" strokeWidth={2} />)}
                    {treeNodes.map(n => {
                        const isCurrent = n.val === s.current;
                        const isVisited = s.visited?.includes(n.val) && !isCurrent;
                        const nodeLevel = n.id <= 1 ? 0 : n.id <= 3 ? 1 : 2;
                        const levelColors = ["#7c3aed", "#1d4ed8", "#065f46"];
                        return (
                            <g key={n.id}>
                                <circle cx={n.x} cy={n.y} r={18} fill={isCurrent ? "#6366f1" : isVisited ? levelColors[nodeLevel] : "#1e293b"} stroke={isCurrent ? "#818cf8" : isVisited ? "#4ade80" : "#334155"} strokeWidth={2} />
                                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{n.val}</text>
                            </g>
                        );
                    })}
                </svg>
                <div style={{ flex: 1 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Result:</div>
                    {bfsLevels.map((level, li) => (
                        <div key={li} style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "center" }}>
                            <span style={{ color: "#64748b", fontSize: 11, width: 50 }}>L{li}:</span>
                            {level.map((v, i) => (
                                <div key={i} style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: s.visited?.includes(v) ? (li === 0 ? "#7c3aed" : li === 1 ? "#1d4ed8" : "#065f46") : "#0f172a", border: "1px solid #334155", fontSize: 12, color: "#e2e8f0" }}>{v}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "3px 8px", borderRadius: 5, fontSize: 11, color: "#94a3b8" }}>Level: <span style={{ color: "#f59e0b" }}>{s.level}</span></span>
                {s.queue && <span style={{ background: "#1e293b", padding: "3px 8px", borderRadius: 5, fontSize: 11, color: "#94a3b8" }}>Queue: [<span style={{ color: "#818cf8" }}>{s.queue?.join(",")}</span>]</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(allSteps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{allSteps.length}</span>
            </div>
        </div>
    );
}
