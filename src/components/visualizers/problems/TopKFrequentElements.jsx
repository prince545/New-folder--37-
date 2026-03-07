import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function TopKFrequentElements({ approach = "optimal" }) {
    const nums = [1, 1, 1, 2, 2, 3];
    const k = 2;
    const [step, setStep] = useState(0);
    const steps = [];
    const freq = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;
    steps.push({ phase: "count", freq: { ...freq }, heap: [], action: "Step 1: Count frequencies" });

    const heap = [];
    for (const [num, count] of Object.entries(freq)) {
        heap.push({ num: Number(num), count });
        heap.sort((a, b) => a.count - b.count); // min-heap by count
        if (heap.length > k) heap.shift();
        steps.push({ phase: "heap", freq: { ...freq }, heap: [...heap], action: `Push num=${num}(freq=${count}) → heap size=${Math.min(heap.length, k)} (min-heap of size k=${k})` });
    }
    steps.push({ phase: "done", freq, heap, result: heap.map(h => h.num), action: `✓ Top-${k} frequent = [${heap.map(h => h.num).join(", ")}]` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                [{nums.join(", ")}] — Find top k={k} frequent elements.
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                {/* Frequency map */}
                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Frequency Map</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {Object.entries(s.freq || {}).map(([num, count]) => (
                            <div key={num} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 6, padding: "4px 8px", fontSize: 13, color: "#e2e8f0" }}>
                                <span style={{ color: "#60a5fa" }}>{num}</span>: <span style={{ color: "#fb923c" }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Min-heap */}
                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Min-Heap (size {k})</div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {(s.heap || []).map((item, i) => (
                            <div key={i} style={{ width: 48, height: 48, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === 0 ? "#1e3a5f" : "#0f172a", border: `2px solid ${i === 0 ? "#3b82f6" : "#334155"}`, fontSize: 13, color: "#e2e8f0" }}>
                                <div>{item.num}</div>
                                <div style={{ fontSize: 10, color: "#64748b" }}>f={item.count}</div>
                            </div>
                        ))}
                        {(s.heap || []).length < k && Array(k - (s.heap || []).length).fill(0).map((_, i) => (
                            <div key={i} style={{ width: 48, height: 48, borderRadius: 8, border: "2px dashed #334155" }} />
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>
                {s.action}
            </div>

            {s.result && (
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {s.result.map((v, i) => (
                        <div key={i} style={{ width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#14532d", border: "2px solid #4ade80", fontSize: 16, color: "#4ade80", fontWeight: "bold" }}>{v}</div>
                    ))}
                </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
