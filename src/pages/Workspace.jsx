import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Box, Key, Play, Sparkles, Lightbulb, BookOpen, Bug, Code, PenLine,
    ChevronRight, ChevronLeft, RotateCcw, Save,
    AlertCircle, Clock, Layers, GitBranch,
    Eye, EyeOff, Zap, Shield, Maximize2, Minimize2, Target
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useDebounce } from "use-debounce";

import DynamicVisualizer from "../components/visualizers/DynamicVisualizer.jsx";
import ProblemVisualizers from "../components/visualizers/problems";
import problems from "../data/problems.json";

import {
    Badge, Button, Card, CardContent, CardHeader, CardTitle,
    Input, Tabs, TabsList, TabsTrigger,
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
    Alert, AlertDescription, AlertTitle,
    Progress, Slider, Switch, Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "../components/ui";

import { EnhancedGeminiService } from "../services/geminiService";
import { DIFFICULTY_BADGES, LEARNING_TIPS } from "../constants/workspaceConstants.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useVisualizerPlayback } from "../hooks/useVisualizerPlayback";
import { getLeetCodeUrl } from "../utils/problemUtils";

// ==================== SUB-COMPONENTS ====================

const ComplexityBadge = ({ time, space }) => (
    <div className="flex gap-2 text-xs">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded cursor-help">
                        <Clock size={12} /> {time}
                    </div>
                </TooltipTrigger>
                <TooltipContent>Time Complexity</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded cursor-help">
                        <Layers size={12} /> {space}
                    </div>
                </TooltipTrigger>
                <TooltipContent>Space Complexity</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
);

const ApiKeyInput = ({ value, onChange }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                    <Key className="text-muted-foreground" size={16} />
                    <Input
                        type="password"
                        placeholder="Gemini API Key…"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full md:w-80 bg-white/5 border-white/10"
                    />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Get your free API key from makersuite.google.com</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const LearningModeSelect = ({ value, onChange }) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-32 bg-white/5 border-white/10">
            <SelectValue placeholder="Learning Mode" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="beginner">🌱 Beginner</SelectItem>
            <SelectItem value="intermediate">⚡ Intermediate</SelectItem>
            <SelectItem value="advanced">🎯 Advanced</SelectItem>
        </SelectContent>
    </Select>
);

const FontSizeSelect = ({ value, onChange }) => (
    <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
        <SelectTrigger className="w-16 h-8">
            <SelectValue />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="12">12px</SelectItem>
            <SelectItem value="14">14px</SelectItem>
            <SelectItem value="16">16px</SelectItem>
            <SelectItem value="18">18px</SelectItem>
        </SelectContent>
    </Select>
);

const WorkspaceHeader = ({
    problem, approach, geminiKey, setGeminiKey,
    learningMode, setLearningMode, showHints, setShowHints, handleSaveCode
}) => (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm font-semibold">
                <span className="text-cyan-300 mr-2">#{problem.id}</span>
                {problem.title}
            </div>
            {DIFFICULTY_BADGES[problem.difficulty]}
            <ComplexityBadge
                time={problem.complexities?.[approach] || "O(n)"}
                space={problem.spaceComplexities?.[approach] || "O(1)"}
            />
        </div>
        <div className="flex items-center gap-2">
            <ApiKeyInput value={geminiKey} onChange={setGeminiKey} />
            <LearningModeSelect value={learningMode} onChange={setLearningMode} />
            <Button variant="ghost" size="icon" onClick={() => setShowHints(!showHints)}>
                {showHints ? <Eye size={16} /> : <EyeOff size={16} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSaveCode}>
                <Save size={16} />
            </Button>
        </div>
    </div>
);

const LearningTipsAlert = ({ approach, showHints }) => {
    if (!showHints) return null;
    return (
        <Alert className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <AlertTitle>Learning Tips for {approach.toUpperCase()} Approach</AlertTitle>
            <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                    {LEARNING_TIPS[approach]?.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
            </AlertDescription>
        </Alert>
    );
};

const ProblemPanel = ({ problem, showPanel, setShowPanel }) => {
    const leetcodeUrl = useMemo(() => getLeetCodeUrl(problem?.title), [problem?.title]);
    return (
        <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Target size={16} className="text-cyan-300" />
                        Problem
                    </div>
                    <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowPanel(v => !v)}>
                        {showPanel ? "Hide" : "Show"}
                    </Button>
                </div>
            </CardHeader>
            {showPanel && (
                <CardContent className="pt-0 text-sm">
                    <div className="grid gap-2 md:grid-cols-2">
                        <div>
                            <span className="text-muted-foreground">Category:</span>{" "}
                            <span>{problem.category || "—"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Source:</span>{" "}
                            <a href={leetcodeUrl} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                                Open on LeetCode
                            </a>
                        </div>
                    </div>
                    {problem.note && (
                        <div className="mt-3 text-muted-foreground text-sm">
                            <span className="text-foreground font-medium">Note:</span> {problem.note}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

const AIActionBar = ({ aiApproach, setAiApproach, isAiThinking, handleAiAction }) => (
    <div className="flex items-center gap-1">
        <Select value={aiApproach} onValueChange={setAiApproach}>
            <SelectTrigger className="h-8 w-[110px] bg-white/5 border-white/10">
                <SelectValue placeholder="Approach" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="brute">Brute</SelectItem>
                <SelectItem value="better">Better</SelectItem>
                <SelectItem value="optimal">Optimal</SelectItem>
            </SelectContent>
        </Select>
        <Button variant="secondary" size="sm" className="h-8 px-2" onClick={() => handleAiAction("algorithm", aiApproach)} disabled={isAiThinking}>
            <GitBranch size={14} className="mr-1" /> Algorithm
        </Button>
        <Button variant="secondary" size="sm" className="h-8 px-2" onClick={() => handleAiAction("pseudocode", aiApproach)} disabled={isAiThinking}>
            <PenLine size={14} className="mr-1" /> Pseudocode
        </Button>
    </div>
);

const TerminalOutput = ({ output }) => (
    <div className="h-full overflow-auto">
        <pre className="text-xs text-emerald-200/90 whitespace-pre-wrap font-mono">
            {output || "🚀 Click 'Run' to compile your code..."}
        </pre>
    </div>
);

const ChatMessage = ({ message }) => (
    <div className={`rounded-lg border border-white/10 p-2 ${message.role === "user" ? "bg-white/5" : "bg-black/30"}`}>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
            {message.role === "user" ? "You" : "AI"}
        </div>
        <div className="text-xs prose prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ inline, className, children, ...props }) {
                        return !inline ? (
                            <pre className="bg-black/60 p-3 rounded-md overflow-x-auto text-[0.7rem]">
                                <code className={className} {...props}>{children}</code>
                            </pre>
                        ) : (
                            <code className="bg-black/40 px-1.5 py-0.5 rounded text-[0.7rem]" {...props}>{children}</code>
                        );
                    }
                }}
            >
                {message.content || ""}
            </ReactMarkdown>
        </div>
    </div>
);

const AiChatPanel = ({ messages, input, setInput, onSend, isThinking, endRef }) => (
    <div className="flex flex-col gap-3 h-full min-h-0">
        <div className="flex-1 min-h-0 space-y-2 overflow-auto pr-1">
            {messages.length === 0 && (
                <div className="text-xs text-muted-foreground p-2">
                    Ask a question about your code, edge cases, complexity, or the next step to try.
                </div>
            )}
            {messages.map((m, idx) => <ChatMessage key={idx} message={m} />)}
            {isThinking && (
                <div className="text-xs text-muted-foreground animate-pulse p-2">🧠 Thinking...</div>
            )}
            <div ref={endRef} />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
                placeholder="Ask the AI…"
                className="bg-white/5 border-white/10"
                disabled={isThinking}
            />
            <Button onClick={onSend} disabled={isThinking || !input.trim()} size="sm">
                Send
            </Button>
        </div>
    </div>
);

const Scratchpad = ({ value, onChange }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-transparent border-none text-xs resize-none focus:outline-none font-mono p-2"
        placeholder="📝 Jot down your thoughts, edge cases, or pseudocode here..."
    />
);

const SpeedControl = ({ speed, onSpeedChange }) => (
    <div className="flex items-center gap-2 pl-2">
        <span className="text-[11px] text-muted-foreground whitespace-nowrap">Speed</span>
        <div className="w-20 sm:w-24">
            <Slider value={[speed]} min={0.5} max={3} step={0.5} onValueChange={(v) => onSpeedChange(v?.[0] ?? 1)} />
        </div>
        <span className="text-[11px] w-10 text-right tabular-nums">{speed}x</span>
    </div>
);

const VisualizerControls = ({ steps, currentStep, onStepChange, onPlay, isPlaying, speed, onSpeedChange }) => (
    <div className="flex items-center gap-2 mt-2 p-2 bg-black/20 rounded-lg">
        <Button variant="ghost" size="sm" onClick={() => onStepChange(currentStep - 1)} disabled={currentStep === 0}>
            <ChevronLeft size={16} />
        </Button>
        <Button variant={isPlaying ? "secondary" : "default"} size="sm" onClick={onPlay}>
            {isPlaying ? "Pause" : "Play"}
        </Button>
        <span className="text-xs whitespace-nowrap">Step {currentStep + 1} of {steps.length}</span>
        <Button variant="ghost" size="sm" onClick={() => onStepChange(currentStep + 1)} disabled={currentStep === steps.length - 1}>
            <ChevronRight size={16} />
        </Button>
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="flex-1 h-1" />
        <SpeedControl speed={speed} onSpeedChange={onSpeedChange} />
    </div>
);

const VisualizerPlaceholder = ({ hasCompiled, SpecificVisualizer, problem, approach }) => {
    if (!hasCompiled) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <Box size={40} className="mb-3 text-white/20" />
                <h3 className="text-base font-semibold mb-1 text-foreground">Run code to enable visualization</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    After you run your solution, click <span className="text-purple-300 font-medium">Generate</span> to create a trace.
                </p>
            </div>
        );
    }
    if (SpecificVisualizer) return <SpecificVisualizer approach={approach} />;
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <Box size={48} className="mb-4 text-white/20" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">{problem.title}</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
                {problem.description || "Visualize your algorithm step by step with AI-powered explanations."}
            </p>
            <div className="flex gap-2">
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                    <Zap size={12} className="mr-1" /> {problem.complexities?.[approach] || "O(n)"}
                </Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    <Shield size={12} className="mr-1" /> {problem.spaceComplexities?.[approach] || "O(1)"}
                </Badge>
            </div>
        </div>
    );
};

const FullscreenEditor = ({ isOpen, onClose, code, setCode, fontSize, showLineNumbers, isCompiling, handleRunCode, isAiThinking, handleAiAction, autoSave, setAutoSave }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm">
            <div className="h-full w-full px-4 py-4">
                <div className="mx-auto max-w-7xl h-full flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                            <Code size={16} className="text-cyan-300" />
                            Editor
                            <Badge variant="outline" className="border-white/10 text-slate-200 bg-white/5">Esc to close</Badge>
                        </div>
                        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10" onClick={onClose}>
                            <Minimize2 size={16} className="mr-2" /> Exit fullscreen
                        </Button>
                    </div>
                    <div className="flex-1 min-h-0 border border-white/10 rounded-xl overflow-hidden bg-black/40">
                        <Editor height="100%" defaultLanguage="cpp" value={code} onChange={(v) => setCode(v || '')} theme="vs-dark"
                            options={{ minimap: { enabled: false }, fontSize, lineNumbers: showLineNumbers ? 'on' : 'off', scrollBeyondLastLine: false, automaticLayout: true }}
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={handleRunCode} disabled={isCompiling} className="gap-2">
                                <Play size={16} /> {isCompiling ? "Compiling..." : "Run (Ctrl+Enter)"}
                            </Button>
                            <Button onClick={() => handleAiAction('hint')} variant="secondary" disabled={isAiThinking}><Lightbulb size={14} className="mr-1" /> Hint</Button>
                            <Button onClick={() => handleAiAction('explain')} variant="secondary" disabled={isAiThinking}><BookOpen size={14} className="mr-1" /> Explain</Button>
                            <Button onClick={() => handleAiAction('debug')} variant="secondary" disabled={isAiThinking}><Bug size={14} className="mr-1" /> Debug</Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                            <span className="text-xs text-slate-300">Auto-save</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Output Panel (shared Terminal / AI Chat / Scratchpad) ──────────────────

const OutputPanel = ({ editorTab, setEditorTab, aiApproach, setAiApproach, handleAiAction, isAiThinking, aiMessages, aiInput, setAiInput, handleAiChatSend, notepadText, setNotepadText, output, aiEndRef, tabBarClass = "" }) => (
    <Tabs value={editorTab} onValueChange={setEditorTab} className="h-full flex flex-col">
        <div className={`flex items-center justify-between gap-2 border-b border-white/10 ${tabBarClass}`}>
            <TabsList className="flex-1 justify-start bg-transparent rounded-none p-0">
                <TabsTrigger value="terminal" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cyan-400">Terminal</TabsTrigger>
                <TabsTrigger value="ai" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-400">AI Assistant</TabsTrigger>
                <TabsTrigger value="notepad" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400">Scratchpad</TabsTrigger>
            </TabsList>
            <AIActionBar aiApproach={aiApproach} setAiApproach={setAiApproach} isAiThinking={isAiThinking} handleAiAction={handleAiAction} />
        </div>
        <div className="flex-1 p-3 overflow-hidden">
            {editorTab === "terminal" && <TerminalOutput output={output} />}
            {editorTab === "ai" && <AiChatPanel messages={aiMessages} input={aiInput} setInput={setAiInput} onSend={handleAiChatSend} isThinking={isAiThinking} endRef={aiEndRef} />}
            {editorTab === "notepad" && <Scratchpad value={notepadText} onChange={setNotepadText} />}
        </div>
    </Tabs>
);

// ==================== MAIN COMPONENT ====================

export default function Workspace() {
    const [searchParams] = useSearchParams();
    const problemId = parseInt(searchParams.get("problem")) || 560;
    const problem = problems.find((p) => p.id === problemId) || problems[0];
    const SpecificVisualizer = ProblemVisualizers[problem.id];

    // ── State ──────────────────────────────────────────────────────────────
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isCompiling, setIsCompiling] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [geminiKey, setGeminiKey] = useLocalStorage("gemini_key", "");
    const [approach, setApproach] = useState("optimal");
    const [aiApproach, setAiApproach] = useState("optimal");
    const [visualizerSteps, setVisualizerSteps] = useState(null);
    const [visualizerError, setVisualizerError] = useState("");
    const [aiMessages, setAiMessages] = useState([]);
    const [aiInput, setAiInput] = useState("");
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [editorTab, setEditorTab] = useState("terminal");
    const [notepadText, setNotepadText] = useLocalStorage(`notepad_${problemId}`, "");
    const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") === "visualizer" ? "visualizer" : "editor");
    const [showHints, setShowHints] = useState(true);
    const [showProblemPanel, setShowProblemPanel] = useState(true);
    const [learningMode, setLearningMode] = useState("beginner");
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1);
    const [savedCodes, setSavedCodes] = useLocalStorage('saved_codes', {});
    const [autoSave, setAutoSave] = useState(true);
    const [userProgress, setUserProgress] = useLocalStorage(`progress_${problemId}`, {});
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [fontSize, setFontSize] = useState(14);
    const [isEditorExpanded, setIsEditorExpanded] = useState(false);

    const aiEndRef = useRef(null);
    const geminiService = useMemo(() => new EnhancedGeminiService(geminiKey), [geminiKey]);
    const [debouncedCode] = useDebounce(code, 1000);

    // ── Custom hooks ───────────────────────────────────────────────────────
    useKeyboardShortcuts({
        onRun: handleRunCode,
        onVisualize: handleVisualizeWithAI,
        onSave: handleSaveCode,
        onExpandToggle: () => setIsEditorExpanded(prev => !prev),
        isExpanded: isEditorExpanded,
    });

    useVisualizerPlayback({
        isPlaying,
        steps: visualizerSteps,
        speed: playSpeed,
        onStepChange: setCurrentStep,
        onPlayEnd: () => setIsPlaying(false),
    });

    // ── Effects ────────────────────────────────────────────────────────────
    useEffect(() => {
        const savedCode = localStorage.getItem(`code_${problemId}`);
        setCode(savedCode || getDefaultCode(problem, approach));
    }, [problemId, approach, problem]);

    useEffect(() => {
        if (autoSave && debouncedCode) {
            localStorage.setItem(`code_${problemId}`, debouncedCode);
        }
    }, [debouncedCode, problemId, autoSave]);

    // ── Handlers ───────────────────────────────────────────────────────────
    async function handleRunCode() {
        setIsCompiling(true);
        setOutput("🚀 Compiling your code...\n");
        const messages = [
            "✅ Lexical analysis complete",
            "🔧 Parsing syntax tree...",
            "⚡ Optimizing code...",
            "📦 Generating machine code...",
            "🎯 Linking libraries..."
        ];
        for (const msg of messages) {
            await new Promise(r => setTimeout(r, 300));
            setOutput(prev => prev + msg + "\n");
        }
        const timeComplexity = problem.complexities?.[approach] || "O(n)";
        const spaceComplexity = problem.spaceComplexities?.[approach] || "O(1)";
        setOutput(
            `✅ Compilation Successful! (0 Errors, 0 Warnings)\n\n` +
            `📊 Complexity Analysis:\n   Time: ${timeComplexity}\n   Space: ${spaceComplexity}\n\n` +
            `💡 Tip: Click "Generate Trace" to visualize your algorithm!\n   Use the AI Assistant for hints and explanations.`
        );
        setIsCompiling(false);
        updateProgress('compiled', true);
    }

    async function handleVisualizeWithAI() {
        if (!geminiKey) {
            setVisualizerError("🔑 Please provide a Gemini API Key first!");
            setEditorTab("ai");
            return;
        }
        setIsVisualizing(true);
        setVisualizerError("");
        setVisualizerSteps(null);
        try {
            const steps = await geminiService.generateSteps(code, problem.title, approach, problem.complexities?.[approach] || "O(n²)");
            setVisualizerSteps(steps);
            setCurrentStep(0);
            updateProgress('visualized', true);
        } catch (err) {
            setVisualizerError(`❌ Visualization Error: ${err.message}\n\nTry:\n1. Check your API key\n2. Simplify your code\n3. Add more comments`);
        } finally {
            setIsVisualizing(false);
        }
    }

    async function handleAiAction(actionType, variantOverride) {
        if (!geminiKey) {
            setEditorTab("ai");
            setAiMessages(prev => [...prev, { role: "assistant", content: "🔑 Please enter your Gemini API Key first!" }]);
            return;
        }
        setIsAiThinking(true);
        setEditorTab("ai");
        try {
            const variant = variantOverride || aiApproach;
            const variantLabel = variant === "brute" ? "Brute Force" : variant === "better" ? "Better" : "Optimal";
            let response;
            switch (actionType) {
                case 'hint': response = await geminiService.getHint(code, problem.title); break;
                case 'explain': response = await geminiService.explainCode(code, problem.title); break;
                case 'debug': response = await geminiService.debugCode(code, problem.title); break;
                case 'algorithm':
                    response = await geminiService.generate(
                        `You are an expert algorithm teacher.\nCreate an algorithm for the problem "${problem.title}" based on the user's CURRENT solution and approach.\n\nTarget approach: ${variantLabel}\nUser code (C++):\n${code}\n\nRules:\n- Output EXACTLY 5 steps, numbered 1 to 5.\n- Each step must be 1-2 short sentences describing WHAT to do and WHY.\n- Mention key data structures/variables used.\n- Do NOT output C++ code or pseudocode.\n- End with a final line: "Complexity: Time <...>, Space <...>"`
                    ); break;
                case 'pseudocode':
                    response = await geminiService.generate(
                        `Write clear pseudocode for the problem "${problem.title}" using the ${variantLabel} approach.\n\nContext:\n- The user is coding in C++.\n- User code (for reference):\n${code}\n\nRules:\n- Do NOT output any C++ code. Use language-agnostic pseudocode.\n- Output EXACTLY ONE version (the ${variantLabel} version).\n- Include:\n  - A short 1-line idea summary\n  - A pseudocode block in triple backticks\n  - A final line: "Complexity: Time <...>, Space <...>"\n- Keep it concise and beginner-friendly.`
                    ); break;
                case 'solution':
                    response = await geminiService.generate(
                        `Provide the C++17 code implementation for ${problem.title}.\nUse ONLY C++ in your answer (no Java, Python, or other languages).\nInclude three distinct sections, each as a fenced C++ code block with a short label above it:\n1. Brute Force Code\n2. Better Code\n3. Optimal Code\nFor each code block:\n- Wrap it in \`\`\`cpp ... \`\`\`\n- Add brief time and space complexity comments at the top of the code.\nAvoid long theory; focus on clean, idiomatic C++.`
                    ); break;
                default: response = "Unknown action";
            }
            const userMsg = getUserMessageForAction(actionType, variantLabel);
            setAiMessages(prev => [...prev, { role: "user", content: userMsg }, { role: "assistant", content: response }]);
            updateProgress(`ai_${actionType}`, true);
            scrollToAiBottom();
        } catch (err) {
            setAiMessages(prev => [...prev, { role: "assistant", content: `❌ Error: ${err.message}` }]);
        } finally {
            setIsAiThinking(false);
        }
    }

    async function handleAiChatSend() {
        const text = aiInput.trim();
        if (!text) return;
        if (!geminiKey) {
            setEditorTab("ai");
            setAiMessages(prev => [...prev, { role: "assistant", content: "🔑 Please enter your Gemini API Key first!" }]);
            return;
        }
        setEditorTab("ai");
        setIsAiThinking(true);
        setAiInput("");
        setAiMessages(prev => [...prev, { role: "user", content: text }]);
        try {
            const systemContext = `You are a patient DSA tutor helping a student solve a coding problem.\nProblem: ${problem.title}\nCategory: ${problem.category || "N/A"}\nDifficulty: ${problem.difficulty || "N/A"}\nNote: ${problem.note || "N/A"}\nCurrent approach focus: ${approach}\nUser code (C++):\n${code}\n\nRules:\n- Ask clarifying questions if needed.\n- Prefer hints and reasoning over full solutions unless explicitly requested.\n- Keep answers structured and concise.`;
            const recentMessages = aiMessages.slice(-12).map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }));
            const contents = [
                { role: "user", parts: [{ text: systemContext }] },
                ...recentMessages,
                { role: "user", parts: [{ text: text }] }
            ];
            const reply = await geminiService.generateWithContents(contents, { temperature: 0.7 });
            setAiMessages(prev => [...prev, { role: "assistant", content: reply }]);
            scrollToAiBottom();
        } catch (err) {
            setAiMessages(prev => [...prev, { role: "assistant", content: `❌ Error: ${err.message}` }]);
        } finally {
            setIsAiThinking(false);
        }
    }

    function handleSaveCode() {
        const name = prompt("Save this solution as:", `${problem.title}_${approach}`);
        if (name) {
            const newSaved = { ...savedCodes, [name]: { code, problem: problem.title, approach, timestamp: Date.now() } };
            setSavedCodes(newSaved);
            setOutput(prev => prev + `\n✅ Code saved as "${name}"`);
        }
    }

    function resetVisualizer() {
        setVisualizerSteps(null);
        setVisualizerError("");
        setCurrentStep(0);
        setIsPlaying(false);
    }

    function updateProgress(key, value) {
        setUserProgress(prev => ({ ...prev, [key]: value, lastActive: Date.now() }));
    }

    function scrollToAiBottom() {
        setTimeout(() => aiEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    }

    const hasCompiled = Boolean(userProgress?.compiled);

    // ── Shared panel props ─────────────────────────────────────────────────
    const outputPanelProps = {
        editorTab, setEditorTab, aiApproach, setAiApproach,
        handleAiAction, isAiThinking, aiMessages, aiInput,
        setAiInput, handleAiChatSend, notepadText, setNotepadText,
        output, aiEndRef,
    };

    const visualizerPanelContent = (
        <>
            {visualizerSteps ? (
                <div className="p-4">
                    <DynamicVisualizer steps={visualizerSteps} currentStep={currentStep} error={visualizerError} />
                    <VisualizerControls
                        steps={visualizerSteps} currentStep={currentStep}
                        onStepChange={setCurrentStep} onPlay={() => setIsPlaying(!isPlaying)}
                        isPlaying={isPlaying} speed={playSpeed} onSpeedChange={setPlaySpeed}
                    />
                </div>
            ) : visualizerError ? (
                <div className="p-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Visualization Error</AlertTitle>
                        <AlertDescription>{visualizerError}</AlertDescription>
                    </Alert>
                </div>
            ) : (
                <VisualizerPlaceholder hasCompiled={hasCompiled} SpecificVisualizer={SpecificVisualizer} problem={problem} approach={approach} />
            )}
        </>
    );

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <TooltipProvider>
            <div className="h-[calc(100vh-56px)] px-4 py-4 overflow-y-auto">
                <div className="mx-auto max-w-7xl h-full flex flex-col gap-4">

                    {/* Fullscreen Editor Modal */}
                    <FullscreenEditor
                        isOpen={isEditorExpanded}
                        onClose={() => setIsEditorExpanded(false)}
                        code={code} setCode={setCode}
                        fontSize={fontSize} showLineNumbers={showLineNumbers}
                        isCompiling={isCompiling} handleRunCode={handleRunCode}
                        isAiThinking={isAiThinking} handleAiAction={handleAiAction}
                        autoSave={autoSave} setAutoSave={setAutoSave}
                    />

                    {/* Header */}
                    <WorkspaceHeader
                        problem={problem} approach={approach}
                        geminiKey={geminiKey} setGeminiKey={setGeminiKey}
                        learningMode={learningMode} setLearningMode={setLearningMode}
                        showHints={showHints} setShowHints={setShowHints}
                        handleSaveCode={handleSaveCode}
                    />

                    {/* Learning Tips */}
                    <LearningTipsAlert approach={approach} showHints={showHints} />

                    {/* Problem Panel */}
                    <ProblemPanel problem={problem} showPanel={showProblemPanel} setShowPanel={setShowProblemPanel} />

                    {/* ── Mobile View ──────────────────────────────────── */}
                    <div className="md:hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full bg-white/5 border border-white/10">
                                <TabsTrigger value="editor" className="flex-1"><Code size={14} className="mr-2" /> Editor</TabsTrigger>
                                <TabsTrigger value="visualizer" className="flex-1"><Box size={14} className="mr-2" /> Visualizer</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="mt-4 h-[calc(100vh-250px)] overflow-auto">
                            {activeTab === "editor" ? (
                                <Card className="bg-white/5 border-white/10">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="border border-white/10 rounded-lg overflow-hidden">
                                            <Editor height="400px" defaultLanguage="cpp" value={code} onChange={(v) => setCode(v || '')} theme="vs-dark"
                                                options={{ minimap: { enabled: false }, fontSize, lineNumbers: showLineNumbers ? 'on' : 'off', scrollBeyondLastLine: false, automaticLayout: true, suggestOnTriggerCharacters: true, quickSuggestions: true }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2 flex-wrap">
                                                <Button onClick={handleRunCode} disabled={isCompiling} className="gap-2"><Play size={16} /> {isCompiling ? "Compiling..." : "Run"}</Button>
                                                <Button onClick={() => handleAiAction('hint')} variant="secondary" size="sm"><Lightbulb size={14} className="mr-1" /> Hint</Button>
                                                <Button onClick={() => handleAiAction('explain')} variant="secondary" size="sm"><BookOpen size={14} className="mr-1" /> Explain</Button>
                                                <Button onClick={() => handleAiAction('debug')} variant="secondary" size="sm"><Bug size={14} className="mr-1" /> Debug</Button>
                                            </div>
                                            <div className="flex items-center gap-2"><Switch checked={autoSave} onCheckedChange={setAutoSave} /><span className="text-xs">Auto-save</span></div>
                                        </div>
                                        <div className="border border-white/10 bg-black/40 rounded-lg min-h-[150px] max-h-[200px] overflow-hidden flex flex-col">
                                            <OutputPanel {...outputPanelProps} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="bg-white/5 border-white/10">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Tabs value={approach} onValueChange={setApproach}>
                                                <TabsList className="bg-black/40 border border-white/10">
                                                    <TabsTrigger value="brute">Brute Force</TabsTrigger>
                                                    <TabsTrigger value="better">Better</TabsTrigger>
                                                    <TabsTrigger value="optimal">Optimal</TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                            <div className="flex gap-2">
                                                <Button onClick={handleVisualizeWithAI} disabled={isVisualizing || !hasCompiled} className="bg-gradient-to-r from-purple-600 to-pink-600">
                                                    <Sparkles size={16} className="mr-2" />
                                                    {!hasCompiled ? "Run code first" : isVisualizing ? "Generating..." : "Generate Trace"}
                                                </Button>
                                                {visualizerSteps && <Button variant="ghost" size="icon" onClick={resetVisualizer}><RotateCcw size={16} /></Button>}
                                            </div>
                                        </div>
                                        <div className="border border-white/10 bg-black/40 rounded-lg min-h-[400px] p-4">
                                            {visualizerPanelContent}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* ── Desktop View ─────────────────────────────────── */}
                    <div className={`hidden md:grid ${isEditorExpanded ? 'grid-cols-1' : 'grid-cols-2'} gap-4 flex-1 min-h-0`}>
                        {/* Editor Panel */}
                        <Card className="bg-white/5 border-white/10 flex flex-col">
                            <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Code className="text-cyan-300" size={18} /> Code Editor
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button onClick={handleRunCode} disabled={isCompiling} size="sm" className="gap-2">
                                        <Play size={14} /> {isCompiling ? "Running..." : "Run"}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setShowLineNumbers(!showLineNumbers)}>
                                        {showLineNumbers ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditorExpanded(!isEditorExpanded)} title={isEditorExpanded ? "Minimize" : "Maximize"}>
                                        {isEditorExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                    </Button>
                                    <FontSizeSelect value={fontSize} onChange={setFontSize} />
                                    <div className="flex items-center gap-1">
                                        <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                                        <span className="text-xs text-slate-300">Auto</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col p-4 pt-0 overflow-y-auto scroll-smooth">
                                <div className="flex-1 min-h-[400px] flex-shrink-0 border border-white/10 rounded-lg overflow-hidden">
                                    <Editor height="100%" defaultLanguage="cpp" value={code} onChange={(v) => setCode(v || '')} theme="vs-dark"
                                        options={{ minimap: { enabled: false }, fontSize, lineNumbers: showLineNumbers ? 'on' : 'off', scrollBeyondLastLine: false, automaticLayout: true }}
                                    />
                                </div>
                                {/* AI action buttons */}
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("hint")} disabled={isAiThinking}><Lightbulb size={14} className="mr-1" /> Hint</Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("explain")} disabled={isAiThinking}><BookOpen size={14} className="mr-1" /> Explain</Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("debug")} disabled={isAiThinking}><Bug size={14} className="mr-1" /> Debug</Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("solution")} disabled={isAiThinking}><Code size={14} className="mr-1" /> Solution</Button>
                                </div>
                                {/* Output area */}
                                <div className="mt-4 flex-shrink-0 min-h-[350px] border border-white/10 rounded-lg bg-black/40 flex flex-col">
                                    <OutputPanel {...outputPanelProps} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visualizer Panel */}
                        {!isEditorExpanded && (
                            <Card className="bg-white/5 border-white/10 flex flex-col">
                                <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Box className="text-cyan-300" size={18} /> Algorithm Visualizer
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Tabs value={approach} onValueChange={setApproach}>
                                            <TabsList className="bg-black/40 border border-white/10">
                                                <TabsTrigger value="brute">Brute</TabsTrigger>
                                                <TabsTrigger value="better">Better</TabsTrigger>
                                                <TabsTrigger value="optimal">Optimal</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <Button onClick={handleVisualizeWithAI} disabled={isVisualizing || !hasCompiled} size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                                            <Sparkles size={14} className="mr-1" />
                                            {!hasCompiled ? "Run code first" : isVisualizing ? "Thinking..." : "Generate"}
                                        </Button>
                                        {visualizerSteps && <Button variant="ghost" size="icon" onClick={resetVisualizer}><RotateCcw size={14} /></Button>}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 min-h-0 p-4 pt-0">
                                    <div className="h-full border border-white/10 rounded-lg bg-black/40 overflow-auto">
                                        {visualizerPanelContent}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}

// ==================== HELPER FUNCTIONS ====================

function getDefaultCode(problem, approach) {
    return `// ${problem.title} - ${problem.difficulty} Problem
// Time Complexity Goal: ${problem.complexities?.[approach] || "O(n)"}
// Space Complexity Goal: ${problem.spaceComplexities?.[approach] || "O(1)"}

#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    ${problem.signature || "int solve(vector<int>& nums) {"}
        // TODO: Implement ${approach} solution
        // Hint: Think about ${problem.hints?.[approach] || "the approach"}
        
        return 0;
    }
};

int main() {
    Solution solution;
    
    // Test cases
    vector<int> nums = {1, 2, 3, 4, 5};
    
    cout << "Result: " << solution.solve(nums) << endl;
    return 0;
}`;
}

function getUserMessageForAction(actionType, variantLabel) {
    switch (actionType) {
        case 'hint': return "Give me a hint (without full solution).";
        case 'explain': return "Explain my solution and its complexity.";
        case 'debug': return "Debug my solution and point out issues.";
        case 'algorithm': return `Write the algorithm in 5 steps (${variantLabel}).`;
        case 'pseudocode': return `Write pseudocode (${variantLabel}).`;
        case 'solution': return "Provide brute/better/optimal C++ solutions.";
        default: return `Action: ${actionType}`;
    }
}
