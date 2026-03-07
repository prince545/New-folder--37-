import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ConvertSortedArrayToBST({ approach = "optimal" }) {
    const nums = [-10, -3, 0, 5, 9];
    const [step, setStep] = useState(0);

    const steps = [
        { mid: 2, l: 0, r: 4, built: [], action: "Full array [-10,-3,0,5,9]. Pick mid=2 → val=0 as root" },
        { mid: 0, l: 0, r: 1, sub: "left", built: [0], action: "Left half [-10,-3]. Pick mid=0 → val=-10" },
        { mid: null, l: null, r: null, sub: "left-left", built: [0, -10], action: "Left-left: empty → null" },
        { mid: 1, l: 1, r: 1, sub: "left-right", built: [0, -10], action: "Left-right: [-3]. Pick mid=1 → val=-3" },
        { mid: 3, l: 3, r: 4, sub: "right", built: [0, -10, -3], action: "Right half [5,9]. Pick mid=3 → val=5" },
        { mid: 4, l: 4, r: 4, sub: "right-right", built: [0, -10, -3, 5], action: "Right-right: [9]. Pick mid=4 → val=9" },
        { done: true, built: [0, -10, -3, 5, 9], action: "✓ Balanced BST built! Height-balanced: each subtree differs by at most 1" },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    const treeNodes = [
        { val: 0, x: 140, y: 20 },
        { val: -10, x: 60, y: 80 },
        { val: -3, x: 130, y: 140 },
        { val: 5, x: 220, y: 80 },
        { val: 9, x: 280, y: 140 },
    ];
    const treeEdges = [[0, 1], [0, 3], [1, 2], [3, 4]];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                nums=[{nums.join(", ")}] — always pick the middle element as root for balance.
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {nums.map((v, i) => (
                    <div key={i} style={{ width: 44, height: 44, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === s.mid ? "#6366f1" : (s.l !== null && i >= s.l && i <= s.r) ? "#1e3a5f" : "#0f172a", border: `2px solid ${i === s.mid ? "#818cf8" : "#334155"}`, fontSize: 13, color: "#e2e8f0" }}>
                        <div>{v}</div><div style={{ fontSize: 9, color: "#64748b" }}>[{i}]</div>
                    </div>
                ))}
            </div>

            <svg width={310} height={190} style={{ background: "#0f172a", borderRadius: 10, marginBottom: 12, border: "1px solid #334155" }}>
                {treeEdges.map(([a, b], i) => (
                    <line key={i} x1={treeNodes[a].x} y1={treeNodes[a].y} x2={treeNodes[b].x} y2={treeNodes[b].y} stroke="#334155" strokeWidth={2} />
                ))}
                {treeNodes.map((n, i) => {
                    const isBuilt = s.built?.includes(n.val) || s.done;
                    return (
                        <g key={i}>
                            <circle cx={n.x} cy={n.y} r={18} fill={isBuilt ? "#1e3a5f" : "#0f172a"} stroke={isBuilt ? "#3b82f6" : "#334155"} strokeWidth={2} />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill={isBuilt ? "#e2e8f0" : "#475569"} fontSize={12}>{n.val}</text>
                        </g>
                    );
                })}
            </svg>

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
