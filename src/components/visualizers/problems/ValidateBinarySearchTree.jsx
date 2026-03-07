import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

const bstNodes = [
    { id: 1, val: 5, x: 150, y: 25, left: 2, right: 3 },
    { id: 2, val: 3, x: 80, y: 85, left: 4, right: 5 },
    { id: 3, val: 6, x: 220, y: 85, left: null, right: null },
    { id: 4, val: 2, x: 40, y: 145, left: null, right: null },
    { id: 5, val: 4, x: 120, y: 145, left: null, right: null },
];

export default function ValidateBinarySearchTree({ approach = "optimal" }) {
    const [step, setStep] = useState(0);
    const steps = [
        { visiting: 1, min: -Infinity, max: Infinity, valid: true, action: "Root=5. Range (-∞, ∞) — OK" },
        { visiting: 2, min: -Infinity, max: 5, valid: true, action: "Node 3 (left of 5). Range (-∞, 5) — 3 < 5 ✓" },
        { visiting: 4, min: -Infinity, max: 3, valid: true, action: "Node 2 (left of 3). Range (-∞, 3) — 2 < 3 ✓" },
        { visiting: 5, min: 3, max: 5, valid: true, action: "Node 4 (right of 3). Range (3, 5) — 3 < 4 < 5 ✓" },
        { visiting: 3, min: 5, max: Infinity, valid: true, action: "Node 6 (right of 5). Range (5, ∞) — 6 > 5 ✓" },
        { done: true, valid: true, action: "✓ Valid BST! All nodes satisfy min < val < max constraint." },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const visited = steps.slice(0, step + 1).map(st => st.visiting).filter(Boolean);
    const edges = bstNodes.flatMap(n => [n.left && { from: n, to: bstNodes.find(x => x.id === n.left) }, n.right && { from: n, to: bstNodes.find(x => x.id === n.right) }].filter(Boolean));

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Validate BST using range [min, max] constraints not just parent comparison.
            </div>
            <svg width={295} height={185} style={{ background: "#0f172a", borderRadius: 10, marginBottom: 12, border: "1px solid #334155" }}>
                {edges.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#334155" strokeWidth={2} />)}
                {bstNodes.map(n => {
                    const isVisiting = s.visiting === n.id;
                    const isVisited = visited.includes(n.id) && !isVisiting;
                    return (
                        <g key={n.id}>
                            <circle cx={n.x} cy={n.y} r={18} fill={isVisiting ? "#6366f1" : isVisited ? "#065f46" : "#1e293b"} stroke={isVisiting ? "#818cf8" : isVisited ? "#4ade80" : "#334155"} strokeWidth={2} />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{n.val}</text>
                        </g>
                    );
                })}
            </svg>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>
                {s.action}
            </div>
            {s.done && <div style={{ fontSize: 14, color: "#4ade80", fontWeight: "bold", marginBottom: 12 }}>✓ Valid BST</div>}

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
