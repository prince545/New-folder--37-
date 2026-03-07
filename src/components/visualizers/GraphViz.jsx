import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function GraphViz({ problemId }) {
    // representation of Number of Islands (200) or Course Schedule (207)
    const [step, setStep] = useState(0);
    const steps = [];

    const graphConfig = {
        200: { // Grid / Islands
            grid: [
                ['1', '1', '0', '0', '0'],
                ['1', '1', '0', '0', '0'],
                ['0', '0', '1', '0', '0'],
                ['0', '0', '0', '1', '1']
            ], // 3 islands
        },
        207: { // Directed Graph / cycle detection
            numCourses: 4,
            prerequisites: [[1, 0], [2, 1], [3, 2], [1, 3]], // Cycle 1->3->2->1
            nodes: [{ id: 0, x: 20, y: 50 }, { id: 1, x: 40, y: 20 }, { id: 2, x: 80, y: 50 }, { id: 3, x: 60, y: 80 }]
        }
    };

    const config = graphConfig[problemId] || graphConfig[200];

    if (problemId === 200) {
        // Number of islands (BFS/DFS)
        const grid = JSON.parse(JSON.stringify(config.grid));
        let islands = 0;
        let visitedCells = new Set();

        const getVizState = (phase, cell = null, q = [], queueOp = "") => {
            return {
                grid: JSON.parse(JSON.stringify(grid)),
                visited: new Set(visitedCells),
                islands,
                phase,
                activeCell: cell,
                queue: [...q],
                queueOp
            };
        };

        steps.push(getVizState("start"));

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (grid[r][c] === '1') {
                    islands++;
                    let queue = [[r, c]];
                    grid[r][c] = '0'; // mark visited locally for logic
                    visitedCells.add(`${r},${c}`);
                    steps.push(getVizState("found_island", [r, c], queue, "Found new land"));

                    while (queue.length > 0) {
                        const [currR, currC] = queue.shift();
                        steps.push(getVizState("visiting", [currR, currC], queue, `Popped [${currR},${currC}]`));

                        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                        for (let [dr, dc] of dirs) {
                            const nr = currR + dr, nc = currC + dc;
                            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] === '1') {
                                queue.push([nr, nc]);
                                grid[nr][nc] = '0';
                                visitedCells.add(`${nr},${nc}`);
                                steps.push(getVizState("adding_neighbor", [nr, nc], queue, `Added neighbor [${nr},${nc}]`));
                            }
                        }
                    }
                }
            }
        }
        steps.push(getVizState("done"));

    } else {
        // Course Schedule (Cycle Detection using DFS or Kahn's)
        const adj = Array.from({ length: config.numCourses }, () => []);
        config.prerequisites.forEach(([crs, pre]) => {
            adj[pre].push(crs);
        });

        const vizState = (phase, node = null, visitState = null, cycle = false) => {
            return { phase, activeNode: node, visitState: { ...visitState }, hasCycle: cycle };
        };

        const visitMap = {}; // 0 = unvisited, 1 = visiting, 2 = visited
        for (let i = 0; i < config.numCourses; i++) visitMap[i] = 0;

        let cycleDetected = false;
        steps.push(vizState("start", null, visitMap));

        const hasCycle = (crs) => {
            if (visitMap[crs] === 1) return true;
            if (visitMap[crs] === 2) return false;

            visitMap[crs] = 1; // visiting
            steps.push(vizState("visiting", crs, visitMap));

            for (let next of adj[crs]) {
                steps.push(vizState("checking_edge", crs, visitMap)); // edge crs->next
                if (hasCycle(next)) return true;
            }

            visitMap[crs] = 2; // visited
            steps.push(vizState("visited_node", crs, visitMap));
            return false;
        };

        for (let i = 0; i < config.numCourses; i++) {
            if (visitMap[i] === 0) {
                if (hasCycle(i)) {
                    cycleDetected = true;
                    break;
                }
            }
        }

        steps.push(vizState("done", null, visitMap, cycleDetected));
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%", position: "relative" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                {problemId === 200 ? "Number of Islands (BFS)" : "Course Schedule (Cycle Detection)"}
            </div>

            <div style={{ display: "flex", gap: 16 }}>

                {problemId === 200 ? (
                    <div style={{ flex: 1 }}>
                        {/* Grid Rendering */}
                        <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, background: "#0f172a", padding: 8, borderRadius: 8, border: "1px solid #334155" }}>
                            {config.grid.map((row, r) => (
                                <div key={r} style={{ display: "flex", gap: 4 }}>
                                    {row.map((cell, c) => {
                                        const isLand = cell === '1';
                                        const isVisited = s?.visited?.has(`${r},${c}`);
                                        const isActive = s?.activeCell?.[0] === r && s?.activeCell?.[1] === c;

                                        let bg = "#1e293b"; // water or default
                                        let border = "#334155";

                                        if (isLand) {
                                            bg = "#ca8a04"; // land color
                                            border = "#eab308";
                                        }
                                        if (isVisited) {
                                            bg = "#4ade80"; // visited land
                                            border = "#22c55e";
                                        }
                                        if (!isLand && isVisited) { // Should not happen in pure logic, but just in case
                                            bg = "#1e293b";
                                        }
                                        if (isActive) {
                                            bg = "#6366f1";
                                            border = "#818cf8";
                                        }

                                        return (
                                            <div key={c} style={{ width: 36, height: 36, borderRadius: 4, background: bg, border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: isLand && !isVisited ? "#1c1917" : "#e2e8f0", transition: "all 0.2s" }}>
                                                {isLand ? "1" : "0"}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ flex: 1, position: "relative", height: 200, background: "#0f172a", borderRadius: 8, border: "1px solid #334155", overflow: "hidden" }}>
                        {/* Graph Rendering */}
                        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                            {config.prerequisites.map((e, i) => {
                                const pos1 = config.nodes.find(n => n.id === e[1]); // pre
                                const pos2 = config.nodes.find(n => n.id === e[0]); // crs

                                const isActiveEdge = s?.phase === "checking_edge" && s?.activeNode === e[1];
                                return (
                                    <line key={i} x1={`${pos1.x}%`} y1={`${pos1.y}%`} x2={`${pos2.x}%`} y2={`${pos2.y}%`} stroke={isActiveEdge ? "#818cf8" : "#334155"} strokeWidth={isActiveEdge ? 3 : 2} markerEnd="url(#arrowhead)" />
                                );
                            })}
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                                </marker>
                            </defs>
                        </svg>
                        {config.nodes.map(n => {
                            const isActive = s?.activeNode === n.id;
                            const visitStatus = s?.visitState ? s.visitState[n.id] : 0;

                            let bg = "#1e293b";
                            let border = "#475569";
                            if (visitStatus === 1) { bg = "#b45309"; border = "#f59e0b"; } // visiting
                            if (visitStatus === 2) { bg = "#14532d"; border = "#4ade80"; } // fully visited
                            if (isActive) { bg = "#6366f1"; border = "#818cf8"; }

                            return (
                                <div key={n.id} style={{
                                    position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)",
                                    width: 36, height: 36, borderRadius: 18, background: bg, border: `2px solid ${border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#e2e8f0", zIndex: 10
                                }}>
                                    {n.id}
                                </div>
                            )
                        })}
                    </div>
                )}

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#1e293b", padding: "12px", borderRadius: 8, height: "100%", display: "flex", flexDirection: "column" }}>
                        <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Status</div>
                        {problemId === 200 ? (
                            <>
                                <div style={{ fontSize: 14, color: "#cbd5e1", marginBottom: 8 }}>Number of Islands: <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 18 }}>{s?.islands || 0}</span></div>
                                {s?.queueOp && <div style={{ fontSize: 13, color: "#a78bfa", marginBottom: 8 }}>{s.queueOp}</div>}
                                <div style={{ color: "#64748b", fontSize: 12 }}>Queue size: {s?.queue?.length || 0}</div>
                                <div style={{ color: "#60a5fa", fontSize: 12, display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                                    {s?.queue?.map((item, i) => <span key={i}>[{item[0]},{item[1]}]</span>)}
                                </div>
                            </>
                        ) : (
                            <>
                                {s?.phase === "start" && <div style={{ fontSize: 14, color: "#cbd5e1" }}>Starting cycle detection...</div>}
                                {s?.phase === "visiting" && <div style={{ fontSize: 14, color: "#fb923c" }}>Visiting node {s.activeNode} (Marking Yellow)</div>}
                                {s?.phase === "checking_edge" && <div style={{ fontSize: 14, color: "#a78bfa" }}>Checking dependencies of Node {s.activeNode}...</div>}
                                {s?.phase === "visited_node" && <div style={{ fontSize: 14, color: "#4ade80" }}>Node {s.activeNode} fully explored (Marking Green)</div>}
                                {s?.phase === "done" && (
                                    <div style={{ fontSize: 16, color: s.hasCycle ? "#ef4444" : "#4ade80", fontWeight: "bold", marginTop: 8 }}>
                                        {s.hasCycle ? "✗ Cycle Detected! Cannot complete." : "✓ No Cycles. Can complete."}
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: 8, marginTop: "auto", fontSize: 11 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#1e293b" }}></div> Unvisited</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#b45309" }}></div> Visiting</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#14532d" }}></div> Visited</div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
