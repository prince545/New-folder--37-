import React, { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function BacktrackingViz({ problemId }) {
    // Subsets (78) or Permutations (46)
    const nums = [1, 2, 3];
    const [step, setStep] = useState(0);
    const steps = [];

    const updateVisualizationState = (currentPath, resultList, phase, activeIdx = -1) => {
        steps.push({
            path: [...currentPath],
            results: [...resultList.map(r => [...r])],
            phase,
            activeIdx
        });
    };

    if (problemId === 78) {
        // Subsets
        const results = [];
        const backtrack = (start, currentPath) => {
            updateVisualizationState(currentPath, results, "visiting", start);

            results.push([...currentPath]);
            updateVisualizationState(currentPath, results, "added_result", start);

            for (let i = start; i < nums.length; i++) {
                currentPath.push(nums[i]);
                updateVisualizationState(currentPath, results, "explore_down", i);
                backtrack(i + 1, currentPath);
                currentPath.pop();
                updateVisualizationState(currentPath, results, "backtrack_up", i);
            }
        };
        backtrack(0, []);
    } else {
        // Permutations
        const results = [];
        const backtrack = (currentPath, used) => {
            updateVisualizationState(currentPath, results, "visiting", -1);

            if (currentPath.length === nums.length) {
                results.push([...currentPath]);
                updateVisualizationState(currentPath, results, "added_result", -1);
                return;
            }
            for (let i = 0; i < nums.length; i++) {
                if (used[i]) continue;
                used[i] = true;
                currentPath.push(nums[i]);
                updateVisualizationState(currentPath, results, "explore_down", i);
                backtrack(currentPath, used);
                used[i] = false;
                currentPath.pop();
                updateVisualizationState(currentPath, results, "backtrack_up", i);
            }
        };
        backtrack([], new Array(nums.length).fill(false));
    }

    steps.push({ ...steps[steps.length - 1], phase: "done", activeIdx: -1 });

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];

    return (
        <div style={{ fontFamily: "monospace", width: "100%" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                {problemId === 78 ? "Subsets (Backtracking)" : "Permutations (Backtracking)"} - Input: [{nums.join(",")}]
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8, height: 160, display: "flex", flexDirection: "column" }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Current Path</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1, alignContent: "flex-start" }}>
                        {s?.path && s.path.length > 0 ? s.path.map((v, i) => (
                            <div key={i} style={{
                                width: 32, height: 32, borderRadius: 16, background: "#6366f1", border: "2px solid #818cf8",
                                display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0", fontSize: 14,
                                transition: "all 0.2s transform", transform: "scale(1.1)"
                            }}>
                                {v}
                            </div>
                        )) : (
                            <div style={{ color: "#64748b", fontStyle: "italic", fontSize: 13, width: "100%", padding: "4px 0" }}>Empty []</div>
                        )}
                    </div>
                    <div style={{ marginTop: "auto", display: "flex", gap: 8, fontSize: 13 }}>
                        <span style={{ color: "#94a3b8" }}>State:</span>
                        {s?.phase === "visiting" && <span style={{ color: "#cbd5e1" }}>Visiting Node</span>}
                        {s?.phase === "added_result" && <span style={{ color: "#4ade80" }}>Added to Results</span>}
                        {s?.phase === "explore_down" && <span style={{ color: "#a78bfa" }}>Exploring Down ↓</span>}
                        {s?.phase === "backtrack_up" && <span style={{ color: "#fb923c" }}>Backtracking Up ↑</span>}
                        {s?.phase === "done" && <span style={{ color: "#4ade80" }}>Done</span>}
                    </div>
                </div>

                <div style={{ flex: 1, background: "#1e293b", padding: 12, borderRadius: 8, height: 160, display: "flex", flexDirection: "column" }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Results ({s?.results?.length || 0})</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1, alignContent: "flex-start", overflowY: "auto" }}>
                        {s?.results && s.results.length > 0 ? s.results.map((res, i) => (
                            <div key={i} style={{
                                background: "#0f172a", border: "1px solid #334155", padding: "4px 8px", borderRadius: 6,
                                color: "#38bdf8", fontSize: 13, display: "flex", alignItems: "center"
                            }}>
                                [{res.join(",")}]
                            </div>
                        )) : (
                            <div style={{ color: "#64748b", fontStyle: "italic", fontSize: 13, width: "100%", padding: "4px 0" }}>Empty</div>
                        )}
                    </div>
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
