import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function CoinChange({ approach = "optimal" }) {
    const coins = [1, 5, 6, 9];
    const amount = 11;
    const [step, setStep] = useState(0);
    const steps = [];

    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    steps.push({ dp: dp.map(v => v === Infinity ? "∞" : v), i: 0, action: "Init: dp[0]=0, rest=∞" });

    for (let i = 1; i <= amount; i++) {
        for (const c of coins) {
            if (c <= i && dp[i - c] + 1 < dp[i]) dp[i] = dp[i - c] + 1;
        }
        steps.push({ dp: dp.map(v => v === Infinity ? "∞" : v), i, action: `dp[${i}] = min(dp[${i}-c]+1 for c in coins) = ${dp[i]}` });
    }
    steps.push({ dp: dp.map(v => v === Infinity ? "∞" : v), i: amount, done: true, action: `✓ Minimum coins for amount=${amount}: dp[${amount}]=${dp[amount]}` });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                coins=[{coins.join(",")}] amount={amount} — dp[i] = min(dp[i-c]+1) for c in coins
            </div>

            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 12 }}>
                {(s.dp || []).map((v, i) => (
                    <div key={i} style={{ minWidth: 34, height: 44, borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: i === s.i ? "#6366f1" : v === "∞" ? "#0f172a" : "#1e293b", border: `2px solid ${i === s.i ? "#818cf8" : "#334155"}`, fontSize: 11, color: "#e2e8f0", padding: "0 2px", transition: "all 0.25s" }}>
                        <div style={{ color: v === "∞" ? "#475569" : "#e2e8f0", fontSize: 12, fontWeight: i === s.i ? "bold" : "normal" }}>{v}</div>
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
