import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function NQueens({ approach = "optimal" }) {
    const n = 4;
    const [step, setStep] = useState(0);
    const solutions = [[1, 3, 0, 2], [2, 0, 3, 1]]; // row indices where queen is placed per col
    const steps = [
        { board: Array(n).fill(Array(n).fill(0)), queenAt: [], action: "Start: empty 4×4 board" },
        { board: null, queenAt: [[0, 1]], action: "Col 0, try row 1 → place queen at (0,1)" },
        { board: null, queenAt: [[0, 1], [1, 3]], action: "Col 1, try row 3 → no conflict → place queen at (1,3)" },
        { board: null, queenAt: [[0, 1], [1, 3], [2, 0]], action: "Col 2, try row 0 → place queen at (2,0)" },
        { board: null, queenAt: [[0, 1], [1, 3], [2, 0], [3, 2]], found: true, solution: solutions[0], action: "Col 3, row 2 → Valid! Found solution #1: [1,3,0,2]" },
        { board: null, queenAt: [[0, 2], [1, 0], [2, 3], [3, 1]], found: true, solution: solutions[1], action: "Backtrack, try more: Found solution #2: [2,0,3,1]" },
        { done: true, solutions, action: `✓ All ${solutions.length} solutions found for N=4 Queens!` },
    ];

    const s = steps[Math.min(step, steps.length - 1)] || steps[0];
    const displayBoard = s.solution || (s.queenAt && s.queenAt.length ? (() => {
        const b = Array.from({ length: n }, () => Array(n).fill(0));
        s.queenAt.forEach(([col, row]) => { b[col][row] = 1; });
        return b.map((col, c) => col.map((v, r) => v));
    })() : null);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                N-Queens (n=4): Place 4 queens so no two attack each other. Backtrack column by column.
            </div>

            {displayBoard ? (
                <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${n}, 44px)`, gap: 2, marginBottom: 14 }}>
                    {Array.from({ length: n }, (_, row) =>
                        Array.from({ length: n }, (_, col) => {
                            const hasQueen = s.queenAt?.some(([c, r]) => c === col && r === row) || (s.solution && s.solution[row] === col);
                            const isLight = (row + col) % 2 === 0;
                            return (
                                <div key={`${row}-${col}`} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: hasQueen ? "#4f46e5" : isLight ? "#1e293b" : "#0f172a", border: `1px solid ${hasQueen ? "#818cf8" : "#334155"}`, borderRadius: 4, fontSize: 22, transition: "all 0.3s" }}>
                                    {hasQueen ? "♛" : ""}
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div style={{ width: 44 * n + 6, height: 44 * n + 6, background: "#0f172a", border: "2px solid #334155", borderRadius: 8, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 12 }}>empty board</div>
            )}

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.found || s.done ? "#4ade80" : "#334155"}`, marginBottom: 12, fontSize: 12, color: s.found || s.done ? "#4ade80" : "#a78bfa" }}>{s.action}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}
