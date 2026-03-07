import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function TrieViz({ problemId }) {
    // Implement Trie
    const [step, setStep] = useState(0);
    const steps = [];

    const operations = [
        { type: "insert", word: "apple" },
        { type: "search", word: "apple", expected: true },
        { type: "search", word: "app", expected: false },
        { type: "startsWith", word: "app", expected: true },
        { type: "insert", word: "app" },
        { type: "search", word: "app", expected: true }
    ];

    class TrieNode {
        constructor(char = "") {
            this.char = char;
            this.children = {};
            this.isEnd = false;
            this.id = Math.random().toString(36).substr(2, 9);
        }
    }

    const root = new TrieNode("Root");
    let currentNodes = [{ id: root.id, char: "Root", parent: null, isEnd: false, x: 50, y: 10 }];
    let currentEdges = [];

    const updateVisualizationState = (op, wordPart, phase, result = null, activeNodes = []) => {
        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)), // Deep copy approx
            edges: JSON.parse(JSON.stringify(currentEdges)),
            op: op.type,
            word: op.word,
            wordPart,
            phase,
            result,
            activeNodes: [...activeNodes]
        });
    };

    // Pre-calculate steps
    operations.forEach(op => {
        updateVisualizationState(op, "", "start");
        let node = root;
        let activeNodes = [node.id];
        let found = true;

        for (let i = 0; i < op.word.length; i++) {
            const char = op.word[i];
            const wordPart = op.word.substring(0, i + 1);

            if (op.type === "insert") {
                if (!node.children[char]) {
                    const newNode = new TrieNode(char);
                    node.children[char] = newNode;

                    // Layout approx calculation
                    const parentVisual = currentNodes.find(n => n.id === node.id);
                    const siblingsCount = Object.keys(node.children).length;
                    const xOffset = (siblingsCount - 1) * 15 - 7.5; // Spread children

                    currentNodes.push({ id: newNode.id, char, parent: node.id, isEnd: false, x: parentVisual.x + xOffset, y: parentVisual.y + 25 });
                    currentEdges.push({ source: node.id, target: newNode.id, char });
                }
                node = node.children[char];
                activeNodes.push(node.id);
                updateVisualizationState(op, wordPart, "inserting", null, activeNodes);
            } else {
                // Search or startsWith
                if (!node.children[char]) {
                    found = false;
                    updateVisualizationState(op, wordPart, "failed", false, activeNodes);
                    break;
                }
                node = node.children[char];
                activeNodes.push(node.id);
                updateVisualizationState(op, wordPart, "searching", null, activeNodes);
            }
        }

        if (op.type === "insert") {
            node.isEnd = true;
            const visNode = currentNodes.find(n => n.id === node.id);
            if (visNode) visNode.isEnd = true;
            updateVisualizationState(op, op.word, "done", true, activeNodes);
        } else if (found) {
            const res = op.type === "startsWith" || node.isEnd;
            updateVisualizationState(op, op.word, "done", res, activeNodes);
        }
    });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%", position: "relative" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>Implement Trie (Prefix Tree)</div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "#1e293b", padding: "8px 12px", borderRadius: 8, fontSize: 13, flex: 1, color: "#cbd5e1" }}>
                    <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Operation log:</div>
                    {operations.map((op, i) => {
                        const isActive = steps.findIndex(st => st.op === op.type && st.word === op.word) <= step
                            && step < steps.findIndex((st, idx) => idx > step && st.phase === "start") || (i === operations.length - 1 && step === steps.length - 1);
                        return (
                            <div key={i} style={{ color: isActive ? "#ffffff" : "#475569", fontWeight: isActive ? "bold" : "normal" }}>
                                {op.type}("{op.word}")
                            </div>
                        )
                    })}
                </div>

                <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 8 }}>
                    {s?.op && (
                        <div style={{ background: "#0f172a", padding: "12px", borderRadius: 8, border: "1px solid #334155" }}>
                            <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Current Action:</div>
                            <div style={{ fontSize: 16, color: "#38bdf8" }}>{s.op}("{s.word}")</div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                <span style={{ color: "#94a3b8", fontSize: 13 }}>Status:</span>
                                {s.phase === "start" && <span style={{ color: "#cbd5e1", fontSize: 13 }}>Starting...</span>}
                                {(s.phase === "inserting" || s.phase === "searching") && <span style={{ color: "#a78bfa", fontSize: 13 }}>Processing: "{s.wordPart}"</span>}
                                {s.phase === "done" && <span style={{ color: s.result ? "#4ade80" : "#ef4444", fontSize: 13 }}>{s.result ? "✓ Success / True" : "✗ False"}</span>}
                                {s.phase === "failed" && <span style={{ color: "#ef4444", fontSize: 13 }}>✗ Failed at "{s.wordPart}"</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ position: "relative", width: "100%", height: 260, background: "#0f172a", borderRadius: 8, border: "1px solid #334155", overflow: "hidden", marginBottom: 16 }}>
                {/* Draw Edges */}
                <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                    {s?.edges?.map((e, i) => {
                        const pos1 = s.nodes.find(n => n.id === e.source);
                        const pos2 = s.nodes.find(n => n.id === e.target);
                        if (!pos1 || !pos2) return null;
                        const isActive = s.activeNodes?.includes(e.source) && s.activeNodes?.includes(e.target);
                        return (
                            <line key={i} x1={`${pos1.x}%`} y1={`${pos1.y}%`} x2={`${pos2.x}%`} y2={`${pos2.y}%`} stroke={isActive ? "#818cf8" : "#334155"} strokeWidth={isActive ? "3" : "2"} />
                        );
                    })}
                </svg>

                {/* Draw Nodes */}
                {s?.nodes?.map(n => {
                    const isActive = s.activeNodes?.includes(n.id);
                    const isLastActive = s.activeNodes && s.activeNodes[s.activeNodes.length - 1] === n.id;

                    return (
                        <div
                            key={n.id}
                            style={{
                                position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)",
                                width: n.char === "Root" ? 40 : 28, height: n.char === "Root" ? 24 : 28, borderRadius: n.char === "Root" ? 4 : 14,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: isLastActive ? "#4f46e5" : isActive ? "#6366f1" : "#1e293b",
                                border: `2px solid ${isLastActive ? "#a78bfa" : isActive ? "#818cf8" : (n.isEnd ? "#4ade80" : "#475569")}`,
                                fontSize: n.char === "Root" ? 10 : 14, color: "#e2e8f0", transition: "all 0.3s"
                            }}
                        >
                            {n.char}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
