import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

const CODE_LINES = [
    { line: "int orangesRotting(vector<vector<int>>& g) {" },
    { line: "  int R=g.size(), C=g[0].size();" },
    { line: "  queue<tuple<int,int,int>> q;" },
    { line: "  int fresh=0, minutes=0;" },
    { line: "  for(int r=0;r<R;r++) for(int c=0;c<C;c++)" },
    { line: "    if(g[r][c]==2) q.push({r,c,0});" },
    { line: "    else if(g[r][c]==1) fresh++;" },
    { line: "  int dx[]={0,0,1,-1}, dy[]={1,-1,0,0};" },
    { line: "  while(!q.empty()) {" },
    { line: "    auto[r,c,t] = q.front(); q.pop();" },
    { line: "    minutes = max(minutes, t);" },
    { line: "    for(int d=0;d<4;d++) {" },
    { line: "      int nr=r+dx[d], nc=c+dy[d];" },
    { line: "      if(nr<0||nr>=R||nc<0||nc>=C) continue;" },
    { line: "      if(g[nr][nc]==1) {" },
    { line: "        g[nr][nc]=2; fresh--;" },
    { line: "        q.push({nr,nc,t+1}); }}" },
    { line: "  return fresh==0 ? minutes : -1; }" },
];

export default function RottingOranges({ approach = "optimal" }) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]],
            time: 0,
            fresh: 6,
            queue: "[(0,0,t=0)]",
            codeLine: 5,
            action: "Init: rotten at (0,0) added to queue. fresh=6.",
        },
        {
            grid: [[2, 2, 1], [2, 1, 0], [0, 1, 1]],
            time: 1,
            fresh: 4,
            queue: "[(0,1,t=1),(1,0,t=1)]",
            codeLine: 14,
            action: "t=1: (0,0) infects → (0,1) and (1,0). fresh=4.",
        },
        {
            grid: [[2, 2, 2], [2, 2, 0], [0, 1, 1]],
            time: 2,
            fresh: 2,
            queue: "[(0,2,t=2),(1,1,t=2)]",
            codeLine: 14,
            action: "t=2: (0,1)→(0,2), (1,0)→(1,1). fresh=2.",
        },
        {
            grid: [[2, 2, 2], [2, 2, 0], [0, 2, 1]],
            time: 3,
            fresh: 1,
            queue: "[(2,1,t=3)]",
            codeLine: 14,
            action: "t=3: (1,1)→(2,1). fresh=1.",
        },
        {
            grid: [[2, 2, 2], [2, 2, 0], [0, 2, 2]],
            time: 4,
            fresh: 0,
            queue: "[]",
            codeLine: 14,
            action: "t=4: (2,1)→(2,2). fresh=0. Queue empty.",
        },
        {
            grid: [[2, 2, 2], [2, 2, 0], [0, 2, 2]],
            time: 4,
            fresh: 0,
            queue: "[]",
            codeLine: 16,
            done: true,
            action: "✓ fresh==0 → return minutes=4",
        },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Multi-source BFS — all rotten oranges start simultaneously. Answer = BFS levels needed.
            </div>

            {/* Two-column layout: grid + code */}
            <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>

                {/* Left: Grid + state */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(3, 46px)", gap: 3 }}>
                        {s.grid.flatMap((row, r) => row.map((cell, c) => (
                            <div key={`${r}-${c}`} style={{
                                width: 46, height: 46, borderRadius: 8,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: cell === 2 ? "#4338ca" : cell === 1 ? "#065f46" : "#0f172a",
                                border: `2px solid ${cell === 2 ? "#818cf8" : cell === 1 ? "#4ade80" : "#1e293b"}`,
                                fontSize: 22, transition: "all 0.35s"
                            }}>
                                {cell === 2 ? "🟣" : cell === 1 ? "🟢" : ""}
                            </div>
                        )))}
                    </div>

                    {/* State badges */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ background: "#1e293b", padding: "3px 8px", borderRadius: 5, fontSize: 12, color: "#f59e0b" }}>t={s.time}</span>
                        <span style={{ background: "#1e293b", padding: "3px 8px", borderRadius: 5, fontSize: 12, color: "#4ade80" }}>fresh={s.fresh}</span>
                    </div>
                    <div style={{ background: "#1e293b", padding: "5px 10px", borderRadius: 6, fontSize: 11, color: "#94a3b8", maxWidth: 180 }}>
                        queue: <span style={{ color: "#818cf8" }}>{s.queue}</span>
                    </div>

                    {/* Legend */}
                    <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#64748b" }}>
                        <span>🟣 rotten</span>
                        <span>🟢 fresh</span>
                    </div>
                </div>

                {/* Right: Code panel */}
                <div style={{ flex: 1, minWidth: 220, background: "#0a0f1e", borderRadius: 10, border: "1px solid #1e3a5f", overflow: "hidden" }}>
                    <div style={{ background: "#0f172a", padding: "5px 12px", fontSize: 11, color: "#475569", borderBottom: "1px solid #1e3a5f" }}>
                        C++ · optimal · BFS
                    </div>
                    <div style={{ padding: "6px 0" }}>
                        {CODE_LINES.map((cl, i) => (
                            <div key={i} style={{
                                padding: "2px 12px",
                                background: i === s.codeLine ? "rgba(99,102,241,0.18)" : "transparent",
                                borderLeft: `3px solid ${i === s.codeLine ? "#6366f1" : "transparent"}`,
                                transition: "background 0.3s"
                            }}>
                                <span style={{ color: "#475569", marginRight: 8, fontSize: 10, userSelect: "none" }}>{(i + 1).toString().padStart(2, " ")}</span>
                                <span style={{ fontSize: 11, color: i === s.codeLine ? "#c7d2fe" : "#64748b", fontWeight: i === s.codeLine ? "bold" : "normal" }}>
                                    {cl.line}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action log */}
            <div style={{
                background: "#0f172a", padding: "8px 12px", borderRadius: 8,
                border: `1px solid ${s.done ? "#4ade80" : "#334155"}`,
                marginBottom: 12, fontSize: 12,
                color: s.done ? "#4ade80" : "#a78bfa"
            }}>
                {s.action}
            </div>

            {/* Complexity */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, fontSize: 11, color: "#64748b" }}>
                <span style={{ background: "#1e293b", padding: "2px 8px", borderRadius: 4 }}>Time: O(m×n)</span>
                <span style={{ background: "#1e293b", padding: "2px 8px", borderRadius: 4 }}>Space: O(m×n)</span>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
