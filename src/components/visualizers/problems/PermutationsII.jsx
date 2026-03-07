import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function PermutationsII({ approach = "optimal" }) {
    const nums = [1, 1, 2]; // has duplicates
    const [step, setStep] = useState(0);
    const steps = [];
    const results = [];
    const sortedNums = [...nums].sort((a, b) => a - b);

    const bt = (curr, used) => {
        if (curr.length === sortedNums.length) {
            results.push([...curr]);
            steps.push({ curr: [...curr], used: [...used], results: results.map(r => [...r]), found: true, action: `✓ Added [${curr.join(",")}]` });
            return;
        }
        for (let i = 0; i < sortedNums.length; i++) {
            if (used[i]) { steps.push({ curr: [...curr], used: [...used], results: results.map(r => [...r]), skip: true, action: `Skip: used[${i}]=${sortedNums[i]} already in path` }); continue; }
            if (i > 0 && sortedNums[i] === sortedNums[i - 1] && !used[i - 1]) {
                steps.push({ curr: [...curr], used: [...used], results: results.map(r => [...r]), skip: true, action: `Skip duplicate: nums[${i}]=${sortedNums[i]} == nums[${i - 1}]=${sortedNums[i - 1]} and prev not used` });
                continue;
            }
            used[i] = true;
            curr.push(sortedNums[i]);
            steps.push({ curr: [...curr], used: [...used], results: results.map(r => [...r]), action: `Add nums[${i}]=${sortedNums[i]}` });
            bt(curr, used);
            used[i] = false;
            curr.pop();
            steps.push({ curr: [...curr], used: [...used], results: results.map(r => [...r]), action: `Backtrack: remove nums[${i}]=${sortedNums[i]}` });
        }
    };
    bt([], new Array(sortedNums.length).fill(false));

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                nums=[{nums.join(",")}] — Permutations with duplicates. Sort first, skip duplicate siblings.
            </div>

            <div style={{ background: "#1e293b", padding: 10, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Sorted: [{sortedNums.join(",")}] — Current path:</div>
                <div style={{ display: "flex", gap: 5 }}>
                    {(s.curr || []).map((v, i) => (
                        <div key={i} style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "#6366f1", border: "2px solid #818cf8", fontSize: 13, color: "#e2e8f0" }}>{v}</div>
                    ))}
                    {(s.curr || []).length === 0 && <span style={{ color: "#475569", fontSize: 12 }}>[]</span>}
                </div>
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.skip ? "#f59e0b" : s.found ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.skip ? "#fb923c" : s.found ? "#4ade80" : "#a78bfa" }}>
                {s.action}
            </div>

            <div style={{ background: "#1e293b", padding: 10, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Unique results ({(s.results || []).length}):</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {(s.results || []).map((r, i) => (
                        <span key={i} style={{ background: "#14532d", border: "1px solid #4ade80", borderRadius: 5, padding: "2px 7px", fontSize: 12, color: "#4ade80" }}>[{r.join(",")}]</span>
                    ))}
                </div>
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
