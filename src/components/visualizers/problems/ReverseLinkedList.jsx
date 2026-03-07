import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ReverseLinkedList({ approach = "optimal" }) {
    const nodes = [1, 2, 3, 4, 5];
    const [step, setStep] = useState(0);
    const steps = [];
    let prev = -1, curr = 0;
    steps.push({ prev, curr, list: [...nodes], action: "Init: prev=null, curr=head" });
    while (curr < nodes.length) {
        const next = curr + 1;
        steps.push({ prev, curr, next: next < nodes.length ? next : -1, list: [...nodes], action: `next=${next < nodes.length ? next : "null"}, curr.next=prev, prev=curr, curr=next` });
        prev = curr; curr = next;
    }
    steps.push({ prev, curr: -1, done: true, reversed: [...nodes].reverse(), action: "✓ List reversed!" });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const display = s.done ? s.reversed : nodes;

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Reverse: 1→2→3→4→5 → 5→4→3→2→1. Three pointers: prev, curr, next.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
                {display.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i === s.curr ? "#6366f1" : i === s.prev ? "#065f46" : "#1e293b", border: `2px solid ${i === s.curr ? "#818cf8" : i === s.prev ? "#4ade80" : "#334155"}`, fontSize: 14, color: "#e2e8f0", transition: "all 0.3s" }}>{v}</div>
                        {i < display.length - 1 && <div style={{ color: s.done ? "#4ade80" : "#334155", fontSize: 18, margin: "0 2px" }}>{s.done ? "←" : "→"}</div>}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {s.prev >= 0 && <span style={{ background: "#065f46", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#4ade80" }}>prev={nodes[s.prev]}</span>}
                {s.curr >= 0 && <span style={{ background: "#1e293b", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#818cf8" }}>curr={nodes[s.curr]}</span>}
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
