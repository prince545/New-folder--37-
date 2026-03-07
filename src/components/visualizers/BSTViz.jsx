import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function BSTViz({ problemId }) {
    // Simple BST representation
    const treeConfig = {
        98: { // Validate BST
            nodes: [{ id: 1, val: 5, x: 50, y: 10 }, { id: 2, val: 1, x: 30, y: 40 }, { id: 3, val: 4, x: 70, y: 40 }, { id: 4, val: 3, x: 60, y: 70 }, { id: 5, val: 6, x: 80, y: 70 }],
            edges: [[1, 2], [1, 3], [3, 4], [3, 5]],
            root: 1,
            // (Expected False for visualizer demo: root is 5, right child is 4 (invalid))
        },
        230: { // Kth Smallest
            nodes: [{ id: 1, val: 5, x: 50, y: 10 }, { id: 2, val: 3, x: 30, y: 40 }, { id: 3, val: 6, x: 70, y: 40 }, { id: 4, val: 2, x: 20, y: 70 }, { id: 5, val: 4, x: 40, y: 70 }, { id: 6, val: 1, x: 10, y: 100 }],
            edges: [[1, 2], [1, 3], [2, 4], [2, 5], [4, 6]],
            root: 1,
            k: 3 // Target k=3 (val=3)
        }
    };

    const config = treeConfig[problemId] || treeConfig[98];
    const [step, setStep] = useState(0);
    const steps = [];

    const getChildren = (nodeId) => {
        const children = [];
        config.edges.forEach(e => {
            if (e[0] === nodeId) children.push(e[1]);
        });
        return children;
    };

    if (problemId === 98) { // Validate BST (DFS with ranges)
        let isValidOverall = true;
        const validate = (nodeId, minVal, maxVal) => {
            const node = config.nodes.find(n => n.id === nodeId);
            const isValid = node.val > minVal && node.val < maxVal;
            if (!isValid) isValidOverall = false;

            steps.push({ visiting: nodeId, minVal, maxVal, currentVal: node.val, isValid, phase: "check" });

            if (!isValidOverall) return false;

            const children = getChildren(nodeId);
            // Simplified left/right mapping for visualizer
            const leftNode = children.find(c => config.nodes.find(n => n.id === c).x < node.x);
            const rightNode = children.find(c => config.nodes.find(n => n.id === c).x > node.x);

            if (leftNode) validate(leftNode, minVal, node.val);
            if (rightNode && isValidOverall) validate(rightNode, node.val, maxVal);

            return isValid;
        };
        validate(config.root, -Infinity, Infinity);
        steps.push({ visiting: null, phase: "done", finalResult: isValidOverall });
    } else { // Kth Smallest (Inorder Traversal)
        const inorder = [];
        const traverse = (nodeId) => {
            const node = config.nodes.find(n => n.id === nodeId);
            const children = getChildren(nodeId);
            const leftNode = children.find(c => config.nodes.find(n => n.id === c).x < node.x);
            const rightNode = children.find(c => config.nodes.find(n => n.id === c).x > node.x);

            steps.push({ visiting: nodeId, inorder: [...inorder], phase: "visit" });

            if (leftNode) traverse(leftNode);

            inorder.push(node.val);
            const isTarget = inorder.length === config.k;
            steps.push({ visiting: nodeId, inorder: [...inorder], phase: "process", isTarget, targetVal: isTarget ? node.val : null });

            if (inorder.length >= config.k) return;

            if (rightNode) traverse(rightNode);
        };
        traverse(config.root);
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%", position: "relative" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                {problemId === 98 ? "Validate Binary Search Tree" : `Kth Smallest Element (k=${config.k})`}
            </div>

            <div style={{ position: "relative", width: "100%", height: 240, background: "#0f172a", borderRadius: 8, border: "1px solid #334155", overflow: "hidden", marginBottom: 16 }}>
                {/* Draw Edges */}
                <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                    {config.edges.map((e, i) => {
                        const pos1 = config.nodes.find(n => n.id === e[0]);
                        const pos2 = config.nodes.find(n => n.id === e[1]);
                        return (
                            <line key={i} x1={`${pos1.x}%`} y1={`${pos1.y}%`} x2={`${pos2.x}%`} y2={`${pos2.y}%`} stroke={(s?.visiting === e[0] || s?.visiting === e[1]) ? "#818cf8" : "#334155"} strokeWidth="2" />
                        );
                    })}
                </svg>

                {/* Draw Nodes */}
                {config.nodes.map(n => {
                    const isVisiting = s?.visiting === n.id;
                    let bgColor = "#1e293b";
                    let borderColor = "#475569";

                    if (isVisiting) { bgColor = "#6366f1"; borderColor = "#818cf8"; }
                    else if (problemId === 98 && s?.isValid === false && isVisiting) { bgColor = "#991b1b"; borderColor = "#ef4444"; }
                    else if (problemId === 230 && s?.inorder?.includes(n.val)) {
                        bgColor = s?.isTarget && s.targetVal === n.val ? "#14532d" : "#0f172a";
                        borderColor = s?.isTarget && s.targetVal === n.val ? "#4ade80" : "#38bdf8";
                    }

                    return (
                        <div
                            key={n.id}
                            style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)", width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: bgColor, border: `2px solid ${borderColor}`, fontSize: 14, color: "#e2e8f0", transition: "all 0.3s" }}
                        >
                            {n.val}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", minHeight: 28 }}>
                {problemId === 98 ? (
                    <>
                        {s?.visiting && <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#a78bfa" }}>Checking Node: {s.currentVal}</span>}
                        {s?.visiting && <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>Range: ({s.minVal === -Infinity ? "-∞" : s.minVal}, {s.maxVal === Infinity ? "∞" : s.maxVal})</span>}
                        {s?.isValid === false && <span style={{ background: "#7f1d1d", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#fca5a5" }}>✗ Invalid BST</span>}
                        {s?.phase === "done" && s?.finalResult && <span style={{ background: "#14532d", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>✓ Valid BST</span>}
                    </>
                ) : (
                    <>
                        {s?.inorder && s.inorder.length > 0 && <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#38bdf8" }}>Inorder: [{s.inorder.join(", ")}]</span>}
                        {s?.isTarget && <span style={{ background: "#14532d", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>✓ Found Kth Smallest: {s.targetVal}</span>}
                    </>
                )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
