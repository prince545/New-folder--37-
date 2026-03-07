import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function CourseSchedule({ approach = "optimal" }) {
    const numCourses = 4;
    const prereqs = [[1, 0], [2, 0], [3, 1], [3, 2]];
    const [step, setStep] = useState(0);
    const steps = [];

    const graph = Array.from({ length: numCourses }, () => []);
    const inDegree = new Array(numCourses).fill(0);
    for (const [a, b] of prereqs) { graph[b].push(a); inDegree[a]++; }

    let queue = inDegree.map((d, i) => d === 0 ? i : -1).filter(i => i >= 0);
    const ind = [...inDegree];
    let order = 0;
    steps.push({ queue: [...queue], ind: [...ind], order, action: "Init: course 0 has in-degree 0 → add to queue" });

    while (queue.length) {
        const curr = queue.shift();
        order++;
        for (const nb of graph[curr]) { ind[nb]--; if (ind[nb] === 0) queue.push(nb); }
        steps.push({ queue: [...queue], ind: [...ind], order, current: curr, action: `Take course ${curr} (out=${order}), reduce in-degrees of its dependents` });
    }
    const canFinish = order === numCourses;
    steps.push({ done: true, order, canFinish, action: canFinish ? `✓ Took ${order}/${numCourses} courses → Can finish! (No cycle)` : `✗ Only took ${order}/${numCourses} courses → CYCLE DETECTED` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    const nodePos = [[120, 20], [60, 90], [180, 90], [120, 160]];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                {numCourses} courses, prereqs: {prereqs.map(([a, b]) => `${a}←${b}`).join(", ")} — Kahn's BFS topo-sort detects cycles.
            </div>

            <div style={{ display: "flex", gap: 12 }}>
                <svg width={250} height={195} style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155", marginBottom: 12 }}>
                    {prereqs.map(([a, b], i) => (
                        <line key={i} x1={nodePos[b][0]} y1={nodePos[b][1]} x2={nodePos[a][0]} y2={nodePos[a][1]} stroke="#334155" strokeWidth={1.5} markerEnd="url(#arr)" />
                    ))}
                    <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#334155" /></marker></defs>
                    {Array.from({ length: numCourses }, (_, i) => (
                        <g key={i}>
                            <circle cx={nodePos[i][0]} cy={nodePos[i][1]} r={22} fill={i === s.current ? "#6366f1" : s.queue?.includes(i) ? "#1e3a5f" : "#1e293b"} stroke={i === s.current ? "#818cf8" : s.queue?.includes(i) ? "#3b82f6" : "#334155"} strokeWidth={2} />
                            <text x={nodePos[i][0]} y={nodePos[i][1] + 5} textAnchor="middle" fill="#e2e8f0" fontSize={13}>{i}</text>
                            <text x={nodePos[i][0]} y={nodePos[i][1] + 22} textAnchor="middle" fill="#64748b" fontSize={10}>in={s.ind?.[i]}</text>
                        </g>
                    ))}
                </svg>

                <div style={{ flex: 1 }}>
                    <div style={{ background: "#1e293b", padding: "8px 12px", borderRadius: 8, marginBottom: 8, fontSize: 12 }}>
                        <div style={{ color: "#64748b", marginBottom: 4 }}>Queue:</div>
                        <div style={{ color: "#818cf8" }}>[{s.queue?.join(", ")}]</div>
                    </div>
                    <div style={{ background: "#1e293b", padding: "8px 12px", borderRadius: 8, fontSize: 12 }}>
                        <div style={{ color: "#64748b", marginBottom: 4 }}>Processed:</div>
                        <div style={{ color: "#4ade80" }}>{s.order}/{numCourses}</div>
                    </div>
                </div>
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
