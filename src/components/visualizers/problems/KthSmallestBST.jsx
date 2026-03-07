import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

const bstNodes = [
    { id: 4, val: 4, x: 150, y: 25, left: 2, right: 6 },
    { id: 2, val: 2, x: 80, y: 85, left: 1, right: 3 },
    { id: 6, val: 6, x: 220, y: 85, left: 5, right: 7 },
    { id: 1, val: 1, x: 40, y: 145, left: null, right: null },
    { id: 3, val: 3, x: 120, y: 145, left: null, right: null },
    { id: 5, val: 5, x: 185, y: 145, left: null, right: null },
    { id: 7, val: 7, x: 260, y: 145, left: null, right: null },
];

export default function KthSmallestBST({ approach = "optimal" }) {
    const k = 3;
    const [step, setStep] = useState(0);
    // In-order: 1, 2, 3, 4, 5, 6, 7
    const inorder = [1, 2, 3, 4, 5, 6, 7];
    const steps = inorder.map((v, i) => ({
        current: v,
        count: i + 1,
        found: i + 1 === k,
        visited: inorder.slice(0, i + 1),
        action: i + 1 === k ? `count=${i + 1} == k=${k} → Found! answer = ${v}` : `visit node ${v}, count=${i + 1} (need k=${k})`
    }));
    steps.push({ done: true, current: 3, count: k, found: true, visited: inorder.slice(0, k), action: `✓ Kth (k=${k}) smallest = 3` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const edges = bstNodes.flatMap(n => [n.left && { from: n, to: bstNodes.find(x => x.id === n.left) }, n.right && { from: n, to: bstNodes.find(x => x.id === n.right) }].filter(Boolean));

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Kth Smallest Element in BST (k={k}) — in-order traversal gives sorted order.
            </div>
            <svg width={300} height={185} style={{ background: "#0f172a", borderRadius: 10, marginBottom: 12, border: "1px solid #334155" }}>
                {edges.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#334155" strokeWidth={2} />)}
                {bstNodes.map(n => {
                    const isCurrent = n.val === s.current;
                    const isFound = s.found && n.val === s.current;
                    const isVisited = s.visited?.includes(n.val) && !isCurrent;
                    return (
                        <g key={n.id}>
                            <circle cx={n.x} cy={n.y} r={16} fill={isFound ? "#14532d" : isCurrent ? "#6366f1" : isVisited ? "#1e293b" : "#0f172a"} stroke={isFound ? "#4ade80" : isCurrent ? "#818cf8" : isVisited ? "#475569" : "#334155"} strokeWidth={2} />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e2e8f0" fontSize={12}>{n.val}</text>
                        </g>
                    );
                })}
            </svg>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>
                    In-order count: <span style={{ color: "#818cf8" }}>{s.count}</span> / {k}
                </span>
                {s.found && <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>✓ Answer = {s.current}</span>}
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
