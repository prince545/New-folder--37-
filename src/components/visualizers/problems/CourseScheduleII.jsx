import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function CourseScheduleII({ approach = "optimal" }) {
    const numCourses = 4;
    const prereqs = [[1, 0], [2, 1], [3, 2]];
    const [step, setStep] = useState(0);
    const steps = [];

    const graph = Array.from({ length: numCourses }, () => []);
    const inDegree = new Array(numCourses).fill(0);
    for (const [a, b] of prereqs) { graph[b].push(a); inDegree[a]++; }

    let queue = inDegree.map((d, i) => d === 0 ? i : -1).filter(i => i >= 0);
    const order = [];
    const ind = [...inDegree];
    steps.push({ queue: [...queue], order: [], inDegree: [...ind], action: "Start: courses with in-degree 0 go into queue" });

    while (queue.length) {
        const curr = queue.shift();
        order.push(curr);
        for (const nb of graph[curr]) {
            ind[nb]--;
            if (ind[nb] === 0) queue.push(nb);
        }
        steps.push({ queue: [...queue], order: [...order], inDegree: [...ind], current: curr, action: `Take course ${curr} → reduce neighbors' in-degrees` });
    }
    steps.push({ queue: [], order: [...order], inDegree: [...ind], done: true, action: order.length === numCourses ? `✓ All courses completed! Order: [${order.join("→")}]` : "✗ Cycle detected — cannot complete all courses" });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                {numCourses} courses, prereqs: {prereqs.map(([a, b]) => `${a}←${b}`).join(", ")} — Kahn's algorithm (BFS topo-sort)
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {Array.from({ length: numCourses }, (_, i) => (
                    <div key={i} style={{ width: 56, height: 56, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === s.current ? "#6366f1" : s.order?.includes(i) ? "#065f46" : "#1e293b", border: `2px solid ${i === s.current ? "#818cf8" : s.order?.includes(i) ? "#4ade80" : "#334155"}`, fontSize: 14, color: "#e2e8f0", transition: "all 0.3s" }}>
                        <div>{i}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>in={s.inDegree?.[i]}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>
                    Queue: [<span style={{ color: "#818cf8" }}>{s.queue?.join(", ")}</span>]
                </div>
                <div style={{ background: "#1e293b", padding: "6px 12px", borderRadius: 6, fontSize: 12, color: "#4ade80" }}>
                    Order: [{s.order?.join("→")}]
                </div>
            </div>

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
