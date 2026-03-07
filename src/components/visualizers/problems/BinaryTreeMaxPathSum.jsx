import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

// Tree: -10→9,20; 20→15,7
const treeNodes = [
    { id: 1, val: -10, x: 150, y: 30, children: [2, 3] },
    { id: 2, val: 9, x: 80, y: 90, children: [] },
    { id: 3, val: 20, x: 220, y: 90, children: [4, 5] },
    { id: 4, val: 15, x: 160, y: 150, children: [] },
    { id: 5, val: 7, x: 280, y: 150, children: [] },
];
const edges = treeNodes.flatMap(n => n.children.map(c => ({ from: n, to: treeNodes.find(x => x.id === c) })));

export default function BinaryTreeMaxPathSum({ approach = "optimal" }) {
    const [step, setStep] = useState(0);

    // DFS post-order: 2(9), 4(15), 5(7), 3(20), 1(-10)
    // gains: node2=9, node4=15, node5=7
    // at node3: path = 15+20+7=42, return 15+20=35
    // at node1: path = 9+-10+35=34 but max stays 42
    const steps = [
        { visiting: null, maxPath: -Infinity, action: "Start DFS post-order traversal" },
        { visiting: 2, gains: { 2: 9 }, maxPath: 9, action: "Node 9 (leaf): gain=9, maxPath=9" },
        { visiting: 4, gains: { 2: 9, 4: 15 }, maxPath: 15, action: "Node 15 (leaf): gain=15, maxPath=15" },
        { visiting: 5, gains: { 2: 9, 4: 15, 5: 7 }, maxPath: 15, action: "Node 7 (leaf): gain=7, maxPath stays 15" },
        { visiting: 3, gains: { 2: 9, 4: 15, 5: 7, 3: 35 }, maxPath: 42, action: "Node 20: path=15+20+7=42 ✓. Return max(15,7)+20=35" },
        { visiting: 1, gains: { 2: 9, 4: 15, 5: 7, 3: 35, 1: 25 }, maxPath: 42, action: "Node -10: path=9+(-10)+35=34 < 42. Return 35+(-10)=25" },
        { visiting: null, maxPath: 42, done: true, action: "✓ Maximum Path Sum = 42 (path: 15→20→7)" },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Binary Tree Maximum Path Sum — any path through any nodes.
            </div>
            <svg width={320} height={190} style={{ background: "#0f172a", borderRadius: 10, marginBottom: 12, border: "1px solid #334155" }}>
                {edges.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#334155" strokeWidth={2} />)}
                {treeNodes.map(n => {
                    const isVisiting = s.visiting === n.id;
                    const hasGain = s.gains?.[n.id] !== undefined;
                    return (
                        <g key={n.id}>
                            <circle cx={n.x} cy={n.y} r={20} fill={isVisiting ? "#6366f1" : hasGain ? "#1e3a5f" : "#1e293b"} stroke={isVisiting ? "#818cf8" : hasGain ? "#3b82f6" : "#334155"} strokeWidth={2} />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{n.val}</text>
                            {hasGain && <text x={n.x} y={n.y - 26} textAnchor="middle" fill="#60a5fa" fontSize={10}>+{s.gains[n.id]}</text>}
                        </g>
                    );
                })}
            </svg>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "#14532d", padding: "4px 12px", borderRadius: 6, fontSize: 14, color: "#4ade80", fontWeight: "bold" }}>
                    maxPath = {s.maxPath === -Infinity ? "-∞" : s.maxPath}
                </span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>
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
