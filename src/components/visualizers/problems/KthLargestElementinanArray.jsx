import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function KthLargestElementinanArray({ approach = "optimal" }) {
    const nums = [3, 2, 1, 5, 6, 4];
    const k = 2;
    const [step, setStep] = useState(0);
    const steps = [];
    const heap = []; // min-heap of size k

    const push = (h, v) => { h.push(v); h.sort((a, b) => a - b); };
    const pop = (h) => h.shift();

    for (const n of nums) {
        push(heap, n);
        if (heap.length > k) pop(heap);
        steps.push({ n, heap: [...heap], action: heap.length < k ? `Add ${n} to heap. Size=${heap.length}` : `Add ${n}, if size > ${k} pop min. Heap=[${[...heap].join(",")}]` });
    }
    steps.push({ done: true, heap: [...heap], answer: heap[0], action: `✓ heap[0] = ${heap[0]} = Kth (k=${k}) largest element` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                [{nums.join(", ")}] — k={k}. Min-heap of size k: heap[0] = kth largest.
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {nums.map((v, i) => {
                    const isCurrent = step < steps.length && steps[step]?.n === v && nums.indexOf(v) === i;
                    return (
                        <div key={i} style={{ width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: isCurrent ? "#6366f1" : step > i ? "#1e293b" : "#0f172a", border: `2px solid ${isCurrent ? "#818cf8" : "#334155"}`, fontSize: 14, color: "#e2e8f0" }}>{v}</div>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "flex-end", marginBottom: 14 }}>
                <div style={{ color: "#64748b", fontSize: 11, alignSelf: "center", marginRight: 4 }}>Min-heap:</div>
                {(s.heap || []).map((v, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "#14532d" : "#1e3a5f", border: `2px solid ${i === 0 ? "#4ade80" : "#3b82f6"}`, fontSize: 16, fontWeight: "bold", color: "#e2e8f0" }}>{v}</div>
                        {i === 0 && <div style={{ fontSize: 9, color: "#4ade80" }}>min/ans</div>}
                    </div>
                ))}
                {Array(k - (s.heap || []).length).fill(0).map((_, i) => (
                    <div key={i} style={{ width: 46, height: 46, borderRadius: 10, border: "2px dashed #334155" }} />
                ))}
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
