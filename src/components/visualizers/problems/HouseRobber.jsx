import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function HouseRobber({ approach = "optimal" }) {
    const nums = [2, 7, 9, 3, 1];
    const [step, setStep] = useState(0);
    const steps = [];
    const dp = new Array(nums.length + 1).fill(0);
    dp[1] = nums[0];
    steps.push({ dp: [...dp], i: 1, action: `dp[1] = nums[0] = ${nums[0]}` });

    for (let i = 2; i <= nums.length; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
        steps.push({ dp: [...dp], i, action: `dp[${i}] = max(dp[${i - 1}]=${dp[i - 1]}, dp[${i - 2}]=${dp[i - 2]}+nums[${i - 1}]=${nums[i - 1]}) = ${dp[i]}` });
    }
    steps.push({ dp: [...dp], done: true, action: `✓ Max money = dp[${nums.length}] = ${dp[nums.length]}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                nums=[{nums.join(",")}] — dp[i] = max(rob house i + dp[i-2], skip = dp[i-1])
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                {nums.map((v, i) => (
                    <div key={i} style={{ width: 48, height: 64, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i + 1 === s.i ? "#6366f1" : "#1e293b", border: `2px solid ${i + 1 === s.i ? "#818cf8" : "#334155"}`, fontSize: 12, color: "#e2e8f0", gap: 4 }}>
                        <div style={{ fontSize: 18 }}>🏠</div>
                        <div>${v}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
                {s.dp.slice(1).map((v, i) => (
                    <div key={i} style={{ minWidth: 40, height: 44, borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i + 1 === s.i ? "#6366f1" : v > 0 ? "#1e3a5f" : "#0f172a", border: `2px solid ${i + 1 === s.i ? "#818cf8" : v > 0 ? "#3b82f6" : "#334155"}`, fontSize: 13, color: "#e2e8f0", transition: "all 0.3s" }}>
                        <div>{v}</div>
                        <div style={{ fontSize: 8, color: "#64748b" }}>dp[{i + 1}]</div>
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
