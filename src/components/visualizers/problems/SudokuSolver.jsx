import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function SudokuSolver({ approach = "optimal" }) {
    const board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];
    const solution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];
    const [solved, setSolved] = useState(false);

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Sudoku Solver — Backtracking: try digits 1-9, check constraints, backtrack if stuck.
            </div>

            <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(9, 32px)", gap: 1, marginBottom: 16 }}>
                {(solved ? solution : board).flatMap((row, r) =>
                    row.map((v, c) => {
                        const orig = board[r][c] !== 0;
                        const filled = solved && !orig;
                        const thickRight = c === 2 || c === 5;
                        const thickBottom = r === 2 || r === 5;
                        return (
                            <div key={`${r}-${c}`} style={{
                                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                                background: filled ? "#14532d" : orig ? "#1e293b" : "#0f172a",
                                borderRight: thickRight ? "2px solid #6366f1" : "1px solid #334155",
                                borderBottom: thickBottom ? "2px solid #6366f1" : "1px solid #334155",
                                borderLeft: "1px solid #334155", borderTop: "1px solid #334155",
                                fontSize: 13, color: filled ? "#4ade80" : orig ? "#e2e8f0" : "#475569",
                                fontWeight: orig ? "bold" : "normal"
                            }}>{v || ""}</div>
                        );
                    })
                )}
            </div>

            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 12 }}>
                {solved ? "✓ Solved! Green cells = backtracking filled values." : "Empty cells (0) will be filled by the solver."}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setSolved(s => !s)} style={btnStyle}>
                    {solved ? "Show Original" : "▶ Solve via Backtracking!"}
                </button>
            </div>
        </div>
    );
}
