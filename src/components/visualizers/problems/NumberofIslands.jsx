import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function NumberofIslands({ approach = "optimal" }) {
    const grid = [
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1],
    ];
    const [step, setStep] = useState(0);
    const steps = [];
    const visited = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));
    let islandCount = 0;

    const dfs = (r, c, islandId) => {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || visited[r][c] || !grid[r][c]) return;
        visited[r][c] = true;
        steps.push({ visited: visited.map(row => [...row]), islandCount, current: [r, c], islandId, action: `DFS from (${r},${c}) — island #${islandId}` });
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) dfs(r + dr, c + dc, islandId);
    };

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (!visited[r][c] && grid[r][c]) {
                islandCount++;
                steps.push({ visited: visited.map(row => [...row]), islandCount, current: [r, c], islandId: islandCount, action: `New unvisited land at (${r},${c}) → Island #${islandCount}! Start DFS.` });
                dfs(r, c, islandCount);
            }
        }
    }
    steps.push({ visited: visited.map(row => [...row]), islandCount, done: true, action: `✓ Total islands = ${islandCount}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const islandColors = ["#6366f1", "#0891b2", "#059669", "#d97706"];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                DFS flood-fill: for each unvisited land cell, count as new island and mark entire island.
            </div>

            <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${grid[0].length}, 40px)`, gap: 2, marginBottom: 14 }}>
                {grid.flatMap((row, r) => row.map((cell, c) => {
                    const isCurrent = s.current?.[0] === r && s.current?.[1] === c;
                    const isVisited = s.visited?.[r]?.[c];
                    return (
                        <div key={`${r}-${c}`} style={{ width: 40, height: 40, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: !cell ? "#0f172a" : isCurrent ? "#818cf8" : isVisited ? (islandColors[(s.islandId || 1) - 1] || "#334155") : "#475569", border: `2px solid ${isCurrent ? "#e2e8f0" : isVisited ? "#334155" : cell ? "#64748b" : "#1e293b"}`, fontSize: 16, color: "#e2e8f0", transition: "all 0.3s" }}>
                            {cell ? (isVisited ? "✓" : "◼") : ""}
                        </div>
                    );
                }))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "#14532d", padding: "4px 12px", borderRadius: 6, fontSize: 16, color: "#4ade80", fontWeight: "bold" }}>Islands = {s.islandCount}</span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>{s.action}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
