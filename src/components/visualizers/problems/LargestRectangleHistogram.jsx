import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function LargestRectangleHistogram({ approach = "optimal" }) {
    const heights = [2, 1, 5, 6, 2, 3];
    const [step, setStep] = useState(0);
    const steps = [];
    const stack = [];
    let maxArea = 0;

    for (let i = 0; i <= heights.length; i++) {
        const h = i === heights.length ? 0 : heights[i];
        while (stack.length && heights[stack[stack.length - 1]] > h) {
            const height = heights[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
            steps.push({ i: i < heights.length ? i : heights.length - 1, stack: [...stack], height, width, area: height * width, maxArea, action: `Pop h=${height}, width=${width} → area=${height * width}. MaxArea=${maxArea}` });
        }
        if (i < heights.length) {
            stack.push(i);
            steps.push({ i, stack: [...stack], maxArea, action: `Push index ${i} (h=${heights[i]}) onto stack` });
        }
    }
    steps.push({ done: true, maxArea, action: `✓ Largest Rectangle = ${maxArea}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const maxH = Math.max(...heights);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                heights=[{heights.join(",")}] — Monotonic stack finds largest rectangle.
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100, marginBottom: 8, padding: "0 4px" }}>
                {heights.map((h, i) => (
                    <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>{h}</div>
                        <div style={{ width: 34, height: `${(h / maxH) * 80}px`, background: i === s.i ? "#6366f1" : s.stack?.includes(i) ? "#1e3a5f" : "#334155", border: `2px solid ${i === s.i ? "#818cf8" : s.stack?.includes(i) ? "#3b82f6" : "#475569"}`, borderRadius: "3px 3px 0 0", transition: "all 0.3s" }} />
                        <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>[{i}]</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#94a3b8" }}>
                    Stack: [<span style={{ color: "#818cf8" }}>{s.stack?.join(", ")}</span>]
                </span>
                {s.area && <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#fb923c" }}>area = {s.height}×{s.width} = {s.area}</span>}
                <span style={{ background: "#14532d", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#4ade80", fontWeight: "bold" }}>Max = {s.maxArea}</span>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.done ? "#4ade80" : "#a78bfa" }}>
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
