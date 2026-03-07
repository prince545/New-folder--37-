import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function HeapViz({ problemId }) {
    // Array to visualize Min Heap operations
    const initialArr = [3, 2, 1, 5, 6, 4];
    const k = 2; // For Kth Largest setup
    const [step, setStep] = useState(0);
    const steps = [];

    // Simulation of Kth Largest using Min Heap of size K
    const heap = [];

    steps.push({ arr: [...initialArr], heap: [...heap], phase: "start" });

    for (let i = 0; i < initialArr.length; i++) {
        const val = initialArr[i];
        heap.push(val);
        heap.sort((a, b) => a - b); // Simulate min heap logic for visualizer simplicity

        steps.push({ arr: [...initialArr], heap: [...heap], currIdx: i, phase: "push", val });

        if (heap.length > k) {
            const popped = heap.shift(); // Remove min
            steps.push({ arr: [...initialArr], heap: [...heap], currIdx: i, phase: "pop", popped });
        }
    }

    steps.push({ arr: [...initialArr], heap: [...heap], phase: "done", result: heap[0] });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%", position: "relative" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                Kth Largest Element (using Min-Heap of size K = {k})
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {initialArr.map((v, i) => (
                    <div key={i} style={{
                        width: 44, height: 44, borderRadius: 8, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        background: i === s?.currIdx ? "#6366f1" : (s?.currIdx !== undefined && i < s.currIdx) ? "#1e293b" : "#0f172a",
                        border: `2px solid ${i === s?.currIdx ? "#818cf8" : "#334155"}`,
                        fontSize: 14, color: "#e2e8f0"
                    }}>
                        {v}
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Min-Heap (size {k})</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
                        {s?.heap && s.heap.map((v, i) => (
                            <div key={i} style={{
                                width: 40, height: Math.max(20, v * 10), background: i === 0 ? "#14532d" : "#334155",
                                border: `1px solid ${i === 0 ? "#4ade80" : "#475569"}`, borderRadius: "4px 4px 0 0",
                                display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "4px 0",
                                color: i === 0 ? "#4ade80" : "#e2e8f0", fontSize: 14, transition: "all 0.3s"
                            }}>
                                {v}
                            </div>
                        ))}
                        {(!s?.heap || s.heap.length === 0) && <div style={{ color: "#64748b", fontStyle: "italic", fontSize: 13, paddingBottom: 8 }}>Empty</div>}
                    </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#0f172a", padding: "12px", borderRadius: 8, border: "1px solid #334155", height: "100%" }}>
                        <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Current Action:</div>
                        {s?.phase === "start" && <div style={{ fontSize: 14, color: "#cbd5e1" }}>Ready to process array</div>}
                        {s?.phase === "push" && <div style={{ fontSize: 14, color: "#60a5fa" }}>Push {s.val} to Heap</div>}
                        {s?.phase === "pop" && <div style={{ fontSize: 14, color: "#fb923c" }}>Heap &gt; K. Pop min: {s.popped}</div>}
                        {s?.phase === "done" && (
                            <div>
                                <div style={{ fontSize: 14, color: "#4ade80", marginBottom: 4 }}>Finished processing</div>
                                <div style={{ fontSize: 13, color: "#e2e8f0" }}>Result (Heap Min): <span style={{ fontWeight: "bold", color: "#4ade80" }}>{s.result}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
