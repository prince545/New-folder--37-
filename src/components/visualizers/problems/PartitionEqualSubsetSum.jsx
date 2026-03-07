import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function PartitionEqualSubsetSum({ approach = "optimal" }) {
    const nums = [1, 5, 11, 5];
    const total = nums.reduce((a, b) => a + b, 0);
    const target = total / 2; // 11
    const [step, setStep] = useState(0);
    const steps = [];

    if (total % 2 !== 0) {
        steps.push({ dp: [], done: true, action: "Total is odd → impossible to partition equally!" });
    } else {
        const dp = new Array(target + 1).fill(false);
        dp[0] = true;
        steps.push({ dp: [...dp], n: null, action: `Init: dp[0]=true (empty subset). Target=${target}` });

        for (const n of nums) {
            for (let j = target; j >= n; j--) {
                if (!dp[j] && dp[j - n]) dp[j] = true;
            }
            steps.push({ dp: [...dp], n, action: `Process num=${n}: update dp backwards. dp[${target}]=${dp[target]}` });
        }
        steps.push({ dp: [...dp], done: true, action: `✓ dp[${target}]=${dp[target]} → Can${dp[target] ? "" : "NOT"} partition into equal subsets!` });
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                nums=[{nums.join(",")}] sum={total}, target={target}. Can we pick a subset summing to {target}?
            </div>

            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 14 }}>
                {(s.dp || []).map((v, i) => (
                    <div key={i} style={{ minWidth: 30, height: 44, borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === target ? (v ? "#14532d" : "#450a0a") : v ? "#1e3a5f" : "#0f172a", border: `2px solid ${i === target ? (v ? "#4ade80" : "#f87171") : v ? "#3b82f6" : "#334155"}`, fontSize: 11, color: "#e2e8f0", transition: "all 0.3s" }}>
                        <div style={{ color: v ? "#4ade80" : "#475569" }}>{v ? "T" : "F"}</div>
                        <div style={{ fontSize: 8, color: "#64748b" }}>[{i}]</div>
                    </div>
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
