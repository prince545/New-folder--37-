import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function SearchinRotatedSortedArray({ approach = "optimal" }) {
    const arr = [4, 5, 6, 7, 0, 1, 2];
    const target = 0;
    const [step, setStep] = useState(0);
    const steps = [];
    let l = 0, r = arr.length - 1;

    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (arr[mid] === target) { steps.push({ l, r, mid, found: true, action: `arr[${mid}]=${arr[mid]} == target → Found!` }); break; }
        if (arr[l] <= arr[mid]) {
            if (arr[l] <= target && target < arr[mid]) { steps.push({ l, r, mid, action: `Left sorted [${arr[l]}..${arr[mid]}], target ${target} in range → r=mid-1` }); r = mid - 1; }
            else { steps.push({ l, r, mid, action: `Left sorted, target NOT in [${arr[l]}..${arr[mid]}] → l=mid+1` }); l = mid + 1; }
        } else {
            if (arr[mid] < target && target <= arr[r]) { steps.push({ l, r, mid, action: `Right sorted [${arr[mid]}..${arr[r]}], target in range → l=mid+1` }); l = mid + 1; }
            else { steps.push({ l, r, mid, action: `Right sorted, target NOT in [${arr[mid]}..${arr[r]}] → r=mid-1` }); r = mid - 1; }
        }
    }
    if (!steps.some(s => s.found)) steps.push({ done: true, action: "Not found → return -1" });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                [{arr.join(", ")}] target={target} — rotated array binary search.
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {arr.map((v, i) => (
                    <div key={i} style={{ width: 42, height: 42, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === s.mid ? (s.found ? "#14532d" : "#6366f1") : i === s.l || i === s.r ? "#1e40af" : (i < s.l || i > s.r) ? "#0f172a" : "#0f172a", border: `2px solid ${i === s.mid ? (s.found ? "#4ade80" : "#818cf8") : i === s.l || i === s.r ? "#3b82f6" : "#334155"}`, opacity: (i < s.l || i > s.r) ? 0.3 : 1, fontSize: 13, color: "#e2e8f0", transition: "all 0.3s" }}>
                        <div>{v}</div><div style={{ fontSize: 9, color: "#64748b" }}>[{i}]</div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                {arr.map((_, i) => <div key={i} style={{ width: 42, textAlign: "center", fontSize: 10, color: i === s.mid ? "#818cf8" : i === s.l ? "#60a5fa" : i === s.r ? "#60a5fa" : "transparent" }}>{i === s.mid ? "mid" : i === s.l ? "L" : i === s.r ? "R" : ""}</div>)}
            </div>
            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.found ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.found ? "#4ade80" : "#a78bfa" }}>
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
