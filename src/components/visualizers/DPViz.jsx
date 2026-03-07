import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function DPViz({ problemId }) {
    // DP Visualization 
    // 70: Climbing Stairs (1D DP)
    // 322: Coin Change (1D DP)
    const [step, setStep] = useState(0);
    const steps = [];

    const updateVisualizationState = (arr, phase, activeIdx = -1, prevIndices = [], result = null) => {
        steps.push({
            dp: [...arr],
            phase,
            activeIdx,
            prevIndices: [...prevIndices],
            result
        });
    };

    if (problemId === 70) {
        // Climbing Stairs (n=5 for visualizer)
        const n = 5;
        const dp = new Array(n + 1).fill(0);

        updateVisualizationState(dp, "start");

        dp[1] = 1;
        updateVisualizationState(dp, "base_case", 1, [], 1);

        if (n >= 2) {
            dp[2] = 2;
            updateVisualizationState(dp, "base_case", 2, [], 2);
        }

        for (let i = 3; i <= n; i++) {
            updateVisualizationState(dp, "calculating", i, [i - 1, i - 2]);
            dp[i] = dp[i - 1] + dp[i - 2];
            updateVisualizationState(dp, "calculated", i, [i - 1, i - 2], dp[i]);
        }

        updateVisualizationState(dp, "done", n, [], dp[n]);
    } else {
        // Coin Change (amount=11, coins=[1,2,5] for visualizer)
        const amount = 11;
        const coins = [1, 2, 5];
        const dp = new Array(amount + 1).fill(amount + 1);

        updateVisualizationState(dp, "start");

        dp[0] = 0;
        updateVisualizationState(dp, "base_case", 0, [], 0);

        for (let i = 1; i <= amount; i++) {
            updateVisualizationState(dp, "calculating", i, []);

            let usedCoins = [];
            for (let coin of coins) {
                if (i - coin >= 0) {
                    usedCoins.push(i - coin);
                    updateVisualizationState(dp, "checking_coin", i, [i - coin]);
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
            updateVisualizationState(dp, "calculated", i, usedCoins, dp[i] === amount + 1 ? "∞" : dp[i]);
        }

        const res = dp[amount] === amount + 1 ? -1 : dp[amount];
        updateVisualizationState(dp, "done", amount, [], res);
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                {problemId === 70 ? "Climbing Stairs (n=5)" : "Coin Change (amount=11, coins=[1,2,5])"}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {s?.dp?.map((v, i) => {
                    const isActive = i === s.activeIdx;
                    const isPrev = s.prevIndices?.includes(i);
                    const displayVal = problemId !== 70 && v > 11 ? "∞" : v;

                    let bg = "#0f172a";
                    let border = "#334155";
                    if (isPrev) { bg = "#b45309"; border = "#f59e0b"; }
                    if (isActive) { bg = "#6366f1"; border = "#818cf8"; }
                    if (s.phase === "calculated" && isActive) { bg = "#14532d"; border = "#4ade80"; }
                    if (s.phase === "done" && isActive) { bg = "#14532d"; border = "#4ade80"; }

                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 8, background: bg, border: `2px solid ${border}`,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#e2e8f0", transition: "all 0.3s"
                            }}>
                                {displayVal}
                            </div>
                            <div style={{ fontSize: 11, color: isActive ? "#818cf8" : isPrev ? "#f59e0b" : "#64748b" }}>
                                dp[{i}]
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={{ background: "#1e293b", padding: "12px", borderRadius: 8, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>Status</div>
                {s?.phase === "start" && <div style={{ fontSize: 14, color: "#cbd5e1" }}>Initializing DP Array... {problemId !== 70 && "(Infinity = Unreachable)"}</div>}
                {s?.phase === "base_case" && <div style={{ fontSize: 14, color: "#4ade80" }}>Setting Base Case: dp[{s.activeIdx}] = {s.result}</div>}

                {problemId === 70 ? (
                    <>
                        {s?.phase === "calculating" && <div style={{ fontSize: 14, color: "#a78bfa" }}>Calculating dp[{s.activeIdx}] using dp[{s.activeIdx - 1}] and dp[{s.activeIdx - 2}]</div>}
                        {s?.phase === "calculated" && <div style={{ fontSize: 14, color: "#4ade80" }}>dp[{s.activeIdx}] = dp[{s.activeIdx - 1}] + dp[{s.activeIdx - 2}] = {s.result}</div>}
                        {s?.phase === "done" && <div style={{ fontSize: 16, color: "#4ade80", fontWeight: "bold" }}>Result for n=5: {s.result} ways</div>}
                    </>
                ) : (
                    <>
                        {s?.phase === "calculating" && <div style={{ fontSize: 14, color: "#a78bfa" }}>Calculating dp[{s.activeIdx}]... checking all coins</div>}
                        {s?.phase === "checking_coin" && <div style={{ fontSize: 14, color: "#f59e0b" }}>Checking subproblem: dp[{s.prevIndices[0]}] + 1</div>}
                        {s?.phase === "calculated" && <div style={{ fontSize: 14, color: "#4ade80" }}>dp[{s.activeIdx}] = min(prev) + 1 = {s.result}</div>}
                        {s?.phase === "done" && <div style={{ fontSize: 16, color: "#4ade80", fontWeight: "bold" }}>Result for amount=11: {s.result} coins minimum</div>}
                    </>
                )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
            </div>
        </div>
    );
}
