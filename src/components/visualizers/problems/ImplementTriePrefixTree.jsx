import { useState } from "react";

const btnStyle = { background: "#4f46e5", color: "#e2e8f0", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" };

export default function ImplementTriePrefixTree({ approach = "optimal" }) {
    const [step, setStep] = useState(0);
    const ops = [
        { op: "insert", word: "apple", path: [], action: 'insert("apple") — create nodes a→p→p→l→e, mark e as end' },
        { op: "insert", word: "apple", path: ["a", "p", "p", "l", "e"], action: 'Trie after inserting "apple"' },
        { op: "search", word: "apple", path: ["a", "p", "p", "l", "e"], found: true, action: 'search("apple") → follow path, end=true → true' },
        { op: "search", word: "app", path: ["a", "p", "p"], found: false, action: 'search("app") → path exists, but end=false → false' },
        { op: "startsWith", word: "app", path: ["a", "p", "p"], found: true, action: 'startsWith("app") → all nodes exist → true' },
        { op: "insert", word: "app", path: ["a", "p", "p"], action: 'insert("app") — mark "p" at pos 3 as end' },
        { op: "search", word: "app", path: ["a", "p", "p"], found: true, action: 'search("app") → end=true now → true' },
    ];

    const s = ops[Math.min(step, ops.length - 1)] || ops[0];
    const chars = ["a", "p", "p", "l", "e"];
    const isEndMark = s.word === "apple" ? 5 : s.word === "app" ? 3 : 0;

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
                Trie: each node = char + children map + isEnd flag.
            </div>

            <div style={{ background: "#1e293b", padding: 12, borderRadius: 10, marginBottom: 12 }}>
                <div style={{ color: "#64748b", fontSize: 11, marginBottom: 8 }}>Current Trie path for "{s.word}":</div>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#475569", border: "2px solid #64748b", fontSize: 12, color: "#e2e8f0" }}>root</div>
                    {chars.map((c, i) => {
                        const inPath = i < (s.path?.length || 0) && chars.slice(0, i + 1).every((ch, j) => s.word[j] === ch);
                        const isEnd = inPath && ((s.op === "insert" && i === s.word.length - 1) || (["search", "startsWith"].includes(s.op) && i === s.path.length - 1 && s.found !== false));
                        return (
                            <div key={i} style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ color: inPath ? "#818cf8" : "#334155", fontSize: 14, margin: "0 2px" }}>→</div>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: inPath ? "#6366f1" : "#0f172a", border: `2px solid ${isEnd ? "#4ade80" : inPath ? "#818cf8" : "#334155"}`, fontSize: 13, color: "#e2e8f0", transition: "all 0.3s" }}>
                                    {c}
                                    {isEnd && <div style={{ fontSize: 7, color: "#4ade80" }}>end</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <span style={{ background: s.op === "insert" ? "#312e81" : s.op === "search" ? "#065f46" : "#1e3a5f", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: "#e2e8f0" }}>{s.op}("{s.word}")</span>
                {s.found !== undefined && (
                    <span style={{ background: s.found ? "#14532d" : "#450a0a", padding: "4px 10px", borderRadius: 6, fontSize: 13, color: s.found ? "#4ade80" : "#f87171" }}>→ {String(s.found)}</span>
                )}
            </div>

            <div style={{ background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", marginBottom: 12, fontSize: 12, color: "#a78bfa" }}>{s.action}</div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} style={btnStyle}>← Prev</button>
                <button onClick={() => setStep(s => Math.min(ops.length - 1, s + 1))} style={btnStyle}>Next →</button>
                <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "#1e293b" }}>Reset</button>
                <span style={{ color: "#64748b", fontSize: 11, alignSelf: "center" }}>{step + 1}/{ops.length}</span>
            </div>
        </div>
    );
}
