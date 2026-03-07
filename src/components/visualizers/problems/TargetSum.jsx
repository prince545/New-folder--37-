import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function TargetSum({ approach = "optimal" }) {
    const nums = [1, 1, 1, 1, 1];
    const target = 3;
    const [step, setStep] = useState(0);
    const steps = [];

    // Transform: S+ - S- = target, S+ + S- = sum → S+ = (sum + target) / 2
    const sum = nums.reduce((a, b) => a + b, 0);
    const newTarget = (sum + target) / 2;

    const dp = new Array(newTarget + 1).fill(0);
    dp[0] = 1;
    steps.push({ dp: [...dp], n: null, action: `Transform: find subsets summing to (sum+target)/2 = ${newTarget}. dp[0]=1` });

    for (const n of nums) {
        for (let j = newTarget; j >= n; j--) dp[j] += dp[j - n];
        steps.push({ dp: [...dp], n, action: `Process num=${n}: update dp backwards. Ways to reach each sum.` });
    }
    steps.push({ dp: [...dp], done: true, action: `✓ Total ways = dp[${newTarget}] = ${dp[newTarget]}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                nums=[{nums.join(",")}] target={target} — assign +/- to reach target. Total ways = {dp[newTarget]}
            </div>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 12, background: "#1e293b", padding: "6px 10px", borderRadius: 6 }}>
                S+ − S- = {target} and S+ + S- = {sum} → S+ = ({sum}+{target})/2 = {newTarget}. Count subsets summing to {newTarget}.
            </div>

            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                {(s.dp || []).map((v, i) => (
                    <div key={i} style={{ minWidth: 36, height: 44, borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === newTarget ? "#14532d" : v > 0 ? "#1e3a5f" : "#0f172a", border: `2px solid ${i === newTarget ? "#4ade80" : v > 0 ? "#3b82f6" : "#334155"}`, fontSize: 12, color: "#e2e8f0" }}>
                        <div style={{ fontWeight: "bold" }}>{v}</div>
                        <div style={{ fontSize: 8, color: "#64748b" }}>[{i}]</div>
                    </div>
                ))}
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
