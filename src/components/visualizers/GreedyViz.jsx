import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function GreedyViz({ problemId }) {
    // 55: Jump Game
    // 53: Maximum Subarray (Kadane's is essentially greedy)
    const arr = problemId === 55 ? [2, 3, 1, 1, 4] : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const [step, setStep] = useState(0);
    const steps = [];

    if (problemId === 55) {
        // Jump Game
        let maxReach = 0;
        steps.push({ i: -1, maxReach: 0, phase: "start" });

        for (let i = 0; i < arr.length; i++) {
            if (i > maxReach) {
                steps.push({ i, maxReach, phase: "failed", val: arr[i] });
                break;
            }
            const prevReach = maxReach;
            maxReach = Math.max(maxReach, i + arr[i]);
            steps.push({ i, maxReach, prevReach, phase: "eval", val: arr[i], canReachEnd: maxReach >= arr.length - 1 });

            if (maxReach >= arr.length - 1) {
                steps.push({ i, maxReach, phase: "success", val: arr[i] });
                break;
            }
        }
    } else {
        // Maximum Subarray (Kadane's)
        let currSum = 0;
        let maxSum = -Infinity;
        let bestStart = 0;
        let bestEnd = 0;
        let currStart = 0;

        steps.push({ i: -1, currSum: 0, maxSum: 0, phase: "start" });

        for (let i = 0; i < arr.length; i++) {
            const val = arr[i];
            if (currSum < 0) {
                currSum = 0;
                currStart = i;
            }
            currSum += val;

            const isNewMax = currSum > maxSum;
            if (isNewMax) {
                maxSum = currSum;
                bestStart = currStart;
                bestEnd = i;
            }

            steps.push({
                i,
                val,
                currSum,
                maxSum,
                currStart,
                bestStart,
                bestEnd,
                phase: isNewMax ? "new_max" : "eval"
            });
        }
        steps.push({ ...steps[steps.length - 1], phase: "done" });
    }

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                {problemId === 55 ? "Jump Game (Greedy Reach)" : "Maximum Subarray (Kadane's Algorithm)"}
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", justifyContent: "flex-start", maxWidth: "100%" }}>
                {arr.map((v, i) => {
                    const isActive = i === s?.i;

                    let bg = "#0f172a";
                    let border = "#334155";
                    let opacity = 1;

                    if (problemId === 55) {
                        const isReachable = i <= s?.maxReach;
                        const isCurrentReach = i === s?.maxReach && s?.phase !== "start";

                        if (!isReachable) opacity = 0.5;
                        if (isReachable) { bg = "#1e293b"; border = "#475569"; }
                        if (isActive) { bg = "#6366f1"; border = "#818cf8"; opacity = 1; }
                        if (isCurrentReach && !isActive) { bg = "#14532d"; border = "#4ade80"; }
                        if (s?.phase === "failed" && isActive) { bg = "#991b1b"; border = "#ef4444"; }

                    } else {
                        // Maximum Subarray colors
                        const inCurrentWindow = i >= s?.currStart && i <= s?.i;
                        const inBestWindow = s?.phase === "done" && i >= s?.bestStart && i <= s?.bestEnd;

                        if (inCurrentWindow && s?.phase !== "done") { bg = "#1e293b"; border = "#475569"; }
                        if (inBestWindow) { bg = "#14532d"; border = "#4ade80"; opacity = 1; }
                        else if (s?.phase === "done") { opacity = 0.3; } // fade out non-best at end

                        if (isActive && s?.phase !== "done") { bg = s?.currSum < 0 ? "#991b1b" : "#6366f1"; border = s?.currSum < 0 ? "#ef4444" : "#818cf8"; opacity = 1; }
                    }

                    return (
                        <div key={i} style={{
                            width: 44, height: 44, borderRadius: 8, background: bg, border: `2px solid ${border}`,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            fontSize: 14, color: "#e2e8f0", transition: "all 0.3s", opacity
                        }}>
                            <div>{v}</div>
                            <div style={{ fontSize: 9, color: isActive ? "#e2e8f0" : "#64748b" }}>[{i}]</div>
                        </div>
                    )
                })}
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>Variables & Status</div>

                    {problemId === 55 ? (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#cbd5e1", fontSize: 14 }}>Current Index (i):</span>
                                <span style={{ color: "#818cf8", fontSize: 16, fontWeight: "bold" }}>{s?.i >= 0 ? s.i : "-"}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#cbd5e1", fontSize: 14 }}>Max Reach (max(i + arr[i])):</span>
                                <span style={{ color: "#4ade80", fontSize: 16, fontWeight: "bold" }}>{s?.maxReach}</span>
                            </div>
                            <div style={{ marginTop: 8, padding: 8, background: "#0f172a", borderRadius: 6, fontSize: 13 }}>
                                {s?.phase === "start" && <span style={{ color: "#94a3b8" }}>Ready</span>}
                                {s?.phase === "eval" && <span style={{ color: "#a78bfa" }}>From index {s.i}, can reach up to {s.i} + {s.val} = {s.i + s.val}</span>}
                                {s?.phase === "success" && <span style={{ color: "#4ade80", fontWeight: "bold" }}>✓ Reach &gt;= {arr.length - 1} (End)</span>}
                                {s?.phase === "failed" && <span style={{ color: "#ef4444", fontWeight: "bold" }}>✗ i &gt; maxReach. Cannot reach end.</span>}
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#cbd5e1", fontSize: 13 }}>Sum of Current Subarray:</span>
                                <span style={{ color: s?.currSum < 0 ? "#ef4444" : "#818cf8", fontSize: 16, fontWeight: "bold" }}>{s?.currSum !== undefined ? s.currSum : "-"}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#cbd5e1", fontSize: 13 }}>Max Sum Recorded:</span>
                                <span style={{ color: "#4ade80", fontSize: 16, fontWeight: "bold" }}>{s?.maxSum !== undefined && s?.maxSum !== -Infinity ? s.maxSum : "-"}</span>
                            </div>
                            <div style={{ marginTop: 8, padding: 8, background: "#0f172a", borderRadius: 6, fontSize: 13 }}>
                                {s?.phase === "start" && <span style={{ color: "#94a3b8" }}>Ready</span>}
                                {s?.phase === "eval" && (
                                    <span style={{ color: "#a78bfa" }}>
                                        {s.currSum - s.val === 0 && s.val > 0 ? "Started new subarray" : "Adding to subarray. "}
                                        {s.currSum < 0 ? "(Negative sum, will reset next turn)" : "Sum is positive, keep going."}
                                    </span>
                                )}
                                {s?.phase === "new_max" && <span style={{ color: "#4ade80", fontWeight: "bold" }}>Found new maximum sum: {s.maxSum}</span>}
                                {s?.phase === "done" && <span style={{ color: "#4ade80", fontWeight: "bold" }}>Done. Maximum Subarray Sum is {s.maxSum}</span>}
                            </div>
                        </>
                    )}
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
