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

export default function DiameterofBinaryTree({ approach = "optimal" }) {
    const [step, setStep] = useState(0);
    // DFS post-order. Diameter at node 2 = leftH(2) + rightH(1) = 2+1 = 3
    const steps = [
        { visiting: 4, depths: {}, diameter: 0, action: "Visit leaf 4: height=1" },
        { visiting: 5, depths: { 4: 1 }, diameter: 0, action: "Visit leaf 5: height=1" },
        { visiting: 2, depths: { 4: 1, 5: 1 }, diameter: 2, action: "Node 2: left=1, right=1 → local_diam=2. height=2" },
        { visiting: 3, depths: { 4: 1, 5: 1, 2: 2 }, diameter: 2, action: "Visit leaf 3: height=1" },
        { visiting: 1, depths: { 4: 1, 5: 1, 2: 2, 3: 1 }, diameter: 3, action: "Node 1: left=2, right=1 → local_diam=3 ✓. height=3" },
        { done: true, visiting: null, depths: { 4: 1, 5: 1, 2: 2, 3: 1, 1: 3 }, diameter: 3, action: "✓ Diameter = 3 (path: 4→2→1→3 or 5→2→1→3)" },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Diameter = longest path between any two nodes. DFS returns subtree height.
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <svg width={270} height={175} style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155" }}>
                    {edges.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#334155" strokeWidth={2} />)}
                    {treeNodes.map(n => {
                        const depth = s.depths?.[n.id];
                        const isVisiting = s.visiting === n.id;
                        return (
                            <g key={n.id}>
                                <circle cx={n.x} cy={n.y} r={18} fill={isVisiting ? "#6366f1" : depth ? "#1e3a5f" : "#1e293b"} stroke={isVisiting ? "#818cf8" : depth ? "#3b82f6" : "#334155"} strokeWidth={2} />
                                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{n.val}</text>
                                {depth && <text x={n.x} y={n.y - 24} textAnchor="middle" fill="#60a5fa" fontSize={10}>h={depth}</text>}
                            </g>
                        );
                    })}
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                    <div style={{ background: "#14532d", padding: "10px 16px", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ color: "#64748b", fontSize: 11 }}>Diameter</div>
                        <div style={{ color: "#4ade80", fontSize: 24, fontWeight: "bold" }}>{s.diameter}</div>
                    </div>
                </div>
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginTop: 12, marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>{s.action}</div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
