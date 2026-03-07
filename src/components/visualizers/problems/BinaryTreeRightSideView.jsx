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

export default function BinaryTreeRightSideView({ approach = "optimal" }) {
    const [step, setStep] = useState(0);
    // BFS levels: [1], [2,3], [4,5]
    // Right side: 1, 3, 5
    const levels = [[1], [2, 3], [4, 5]];
    const rightView = [1, 3, 5];
    const steps = [
        { level: 0, visited: [1], rightmost: 1, action: "Level 0: [1] → right side sees node 1" },
        { level: 1, visited: [1, 2, 3], rightmost: 3, action: "Level 1: [2, 3] → right side sees node 3 (last)" },
        { level: 2, visited: [1, 2, 3, 4, 5], rightmost: 5, action: "Level 2: [4, 5] → right side sees node 5 (last)" },
        { level: 2, visited: [1, 2, 3, 4, 5], rightmost: 5, done: true, action: "✓ Right side view: [1, 3, 5]" },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Binary Tree Right Side View — BFS, take last node at each level.
            </div>
            <div style={{ display: "flex", gap: 16 }}>
                <svg width={270} height={185} style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155" }}>
                    {edges.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#334155" strokeWidth={2} />)}
                    {treeNodes.map(n => {
                        const isRightmost = n.val === s.rightmost;
                        const isVisited = s.visited?.includes(n.val);
                        return (
                            <g key={n.id}>
                                <circle cx={n.x} cy={n.y} r={18} fill={isRightmost ? "#4f46e5" : isVisited ? "#1e3a5f" : "#1e293b"} stroke={isRightmost ? "#4ade80" : isVisited ? "#3b82f6" : "#334155"} strokeWidth={2} />
                                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{n.val}</text>
                            </g>
                        );
                    })}
                    {/* Right side arrow */}
                    <text x={255} y={30} fill="#4ade80" fontSize={18}>←</text>
                    <text x={255} y={85} fill="#4ade80" fontSize={18}>←</text>
                    <text x={255} y={145} fill="#4ade80" fontSize={18}>←</text>
                </svg>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Right View:</div>
                    {rightView.map((v, i) => (
                        <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i <= s.level ? "#14532d" : "#1e293b", border: `2px solid ${i <= s.level ? "#4ade80" : "#334155"}`, fontSize: 14, color: "#e2e8f0" }}>
                            {v}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginTop: 12, marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>
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
