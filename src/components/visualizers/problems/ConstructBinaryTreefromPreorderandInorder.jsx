import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ConstructBinaryTreefromPreorderandInorder({ approach = "optimal" }) {
    const preorder = [3, 9, 20, 15, 7];
    const inorder = [9, 3, 15, 20, 7];
    const [step, setStep] = useState(0);

    const steps = [
        { root: 3, leftIn: [9], rightIn: [15, 20, 7], action: "preorder[0]=3 is root. In inorder: left=[9], right=[15,20,7]" },
        { root: 9, leftIn: [], rightIn: [], parent: 3, side: "left", action: "preorder[1]=9 is root of left subtree. Leaf node." },
        { root: 20, leftIn: [15], rightIn: [7], parent: 3, side: "right", action: "preorder[2]=20 is root of right subtree. left=[15], right=[7]" },
        { root: 15, leftIn: [], rightIn: [], parent: 20, side: "left", action: "preorder[3]=15 is left of 20. Leaf." },
        { root: 7, leftIn: [], rightIn: [], parent: 20, side: "right", action: "preorder[4]=7 is right of 20. Leaf." },
        { done: true, action: "✓ Tree built! Root=3, left=9, right={15,20,7}" },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const treeLayout = [
        { val: 3, x: 150, y: 25, depth: 0 },
        { val: 9, x: 80, y: 80, depth: 1 },
        { val: 20, x: 220, y: 80, depth: 1 },
        { val: 15, x: 170, y: 140, depth: 2 },
        { val: 7, x: 270, y: 140, depth: 2 },
    ];
    const treeEdges = [[0, 1], [0, 2], [2, 3], [2, 4]];
    const builtDepth = s.done ? 3 : steps.indexOf(s);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                preorder=[{preorder.join(",")}]  inorder=[{inorder.join(",")}]
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {["preorder", "inorder"].map((label, li) => {
                    const arr = li === 0 ? preorder : inorder;
                    return (
                        <div key={label} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <span style={{ color: "#64748b", fontSize: 11, width: 62 }}>{label}:</span>
                            {arr.map((v, i) => (
                                <div key={i} style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: v === s.root ? "#6366f1" : "#1e293b", border: `1px solid ${v === s.root ? "#818cf8" : "#334155"}`, fontSize: 12, color: "#e2e8f0" }}>{v}</div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <svg width={310} height={175} style={{ background: "#0f172a", borderRadius: 10, marginBottom: 12, border: "1px solid #334155" }}>
                {treeEdges.map(([a, b], i) => {
                    const isBuilt = treeLayout[a].depth < builtDepth && treeLayout[b].depth <= builtDepth;
                    return <line key={i} x1={treeLayout[a].x} y1={treeLayout[a].y} x2={treeLayout[b].x} y2={treeLayout[b].y} stroke={isBuilt ? "#334155" : "#1a2535"} strokeWidth={2} />;
                })}
                {treeLayout.map((n, i) => {
                    const isActive = n.val === s.root;
                    const isBuilt = n.depth < builtDepth;
                    return (
                        <g key={i}>
                            <circle cx={n.x} cy={n.y} r={18} fill={isActive ? "#6366f1" : isBuilt ? "#1e3a5f" : "#0f172a"} stroke={isActive ? "#818cf8" : isBuilt ? "#3b82f6" : "#334155"} strokeWidth={2} />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill={isActive || isBuilt ? "#e2e8f0" : "#475569"} fontSize={13}>{n.val}</text>
                        </g>
                    );
                })}
            </svg>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>{s.action}</div>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
