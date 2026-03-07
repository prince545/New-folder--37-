import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function TreeViz({ problemId }) {
    // Simple binary tree representation
    const treeConfig = {
        104: { // Max Depth
            nodes: [{ id: 1, val: 3, x: 50, y: 10 }, { id: 2, val: 9, x: 30, y: 40 }, { id: 3, val: 20, x: 70, y: 40 }, { id: 4, val: 15, x: 60, y: 70 }, { id: 5, val: 7, x: 80, y: 70 }],
            edges: [[1, 2], [1, 3], [3, 4], [3, 5]],
            root: 1
        },
        226: { // Invert Tree
            nodes: [{ id: 1, val: 4, x: 50, y: 10 }, { id: 2, val: 2, x: 30, y: 40 }, { id: 3, val: 7, x: 70, y: 40 }, { id: 4, val: 1, x: 20, y: 70 }, { id: 5, val: 3, x: 40, y: 70 }, { id: 6, val: 6, x: 60, y: 70 }, { id: 7, val: 9, x: 80, y: 70 }],
            edges: [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7]],
            root: 1
        }
    };

    const config = treeConfig[problemId] || treeConfig[104];
    const [step, setStep] = useState(0);
    const steps = [];

    const getChildren = (nodeId) => {
        const children = [];
        config.edges.forEach(e => {
            if (e[0] === nodeId) children.push(e[1]);
        });
        return children;
    };

    if (problemId === 104) { // Max Depth DFS
        const dfsSearch = (nodeId, depth) => {
            steps.push({ visiting: nodeId, depth, maxDepth: Math.max(...steps.map(s => s.maxDepth || 0), depth), phase: "down" });
            const children = getChildren(nodeId);
            let currentMax = depth;
            for (let child of children) {
                currentMax = Math.max(currentMax, dfsSearch(child, depth + 1));
            }
            steps.push({ visiting: nodeId, depth, maxDepth: currentMax, phase: "up" });
            return currentMax;
        };
        dfsSearch(config.root, 1);
    } else { // Invert Tree BFS
        const queue = [config.root];
        const invertedNodes = new Set();
        // Need positions mapping to show swap
        const originalPos = {};
        config.nodes.forEach(n => { originalPos[n.id] = { x: n.x, y: n.y }; });

        let currentPositions = { ...originalPos };

        while (queue.length > 0) {
            const curr = queue.shift();
            const children = getChildren(curr);

            steps.push({ visiting: curr, inverted: new Set(invertedNodes), positions: { ...currentPositions }, phase: "visit" });

            if (children.length > 0) {
                const [leftId, rightId] = children.length === 2 ? children : (children[0] < curr ? [children[0], null] : [null, children[0]]);

                if (leftId && rightId) {
                    const leftPos = currentPositions[leftId];
                    const rightPos = currentPositions[rightId];
                    currentPositions = { ...currentPositions, [leftId]: rightPos, [rightId]: leftPos };
                }
                invertedNodes.add(curr);
                steps.push({ visiting: curr, inverted: new Set(invertedNodes), positions: { ...currentPositions }, phase: "swap" });

                if (leftId) queue.push(leftId);
                if (rightId) queue.push(rightId);
            }
        }
        steps.push({ visiting: null, inverted: new Set(invertedNodes), positions: { ...currentPositions }, phase: "done" });
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%", position: "relative" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                {problemId === 104 ? "Maximum Depth of Binary Tree" : "Invert Binary Tree"}
            </div>

            <div style={{ position: "relative", width: "100%", height: 200, background: "#0f172a", borderRadius: 8, border: "1px solid #334155", overflow: "hidden", marginBottom: 16 }}>
                {/* Draw Edges */}
                <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                    {config.edges.map((e, i) => {
                        const pos1 = problemId === 226 && s?.positions ? s.positions[e[0]] : config.nodes.find(n => n.id === e[0]);
                        const pos2 = problemId === 226 && s?.positions ? s.positions[e[1]] : config.nodes.find(n => n.id === e[1]);
                        return (
                            <line key={i} x1={`${pos1.x}%`} y1={`${pos1.y}%`} x2={`${pos2.x}%`} y2={`${pos2.y}%`} stroke={(s?.visiting === e[0] || s?.visiting === e[1]) ? "#818cf8" : "#334155"} strokeWidth="2" />
                        );
                    })}
                </svg>

                {/* Draw Nodes */}
                {config.nodes.map(n => {
                    const pos = problemId === 226 && s?.positions ? s.positions[n.id] : n;
                    const isVisiting = parseInt(s?.visiting) === parseInt(n.id);
                    const isInverted = problemId === 226 && s?.inverted?.has(n.id);

                    return (
                        <div
                            key={n.id}
                            style={{
                                position: "absolute",
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: "translate(-50%, -50%)",
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: isVisiting ? "#6366f1" : (isInverted ? "#14532d" : "#1e293b"),
                                border: `2px solid ${isVisiting ? "#818cf8" : (isInverted ? "#4ade80" : "#475569")}`,
                                fontSize: 14,
                                color: "#e2e8f0",
                                transition: "all 0.5s ease"
                            }}
                        >
                            {n.val}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", minHeight: 28 }}>
                {problemId === 104 ? (
                    <>
                        {s?.visiting && <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#a78bfa" }}>Node: {config.nodes.find(n => n.id === s.visiting)?.val}</span>}
                        {s?.depth && <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#60a5fa" }}>Current Depth: {s.depth}</span>}
                        <span style={{ background: "#14532d", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>Max Depth: {s?.maxDepth}</span>
                        {s?.phase && <span style={{ background: "#0f172a", border: "1px solid #334155", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#94a3b8" }}>{s.phase === "down" ? "Going Deeper ↓" : "Returning ↑"}</span>}
                    </>
                ) : (
                    <>
                        {s?.visiting && <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#a78bfa" }}>Visiting: {config.nodes.find(n => n.id === s.visiting)?.val}</span>}
                        {s?.phase === "swap" && <span style={{ background: "#b45309", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#fef3c7" }}>Swapping Children ⟷</span>}
                        {s?.phase === "done" && <span style={{ background: "#14532d", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#4ade80" }}>✓ Tree Inverted</span>}
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
