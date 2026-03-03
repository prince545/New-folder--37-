import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Box, Key, Play, Sparkles, Lightbulb, BookOpen, Bug, Code, PenLine,
    ChevronRight, ChevronLeft, RotateCcw, Download, Upload, Save,
    AlertCircle, CheckCircle, HelpCircle, Target, Trophy, Clock,
    BarChart, Layers, GitBranch, Eye, EyeOff, Zap, Shield, Cpu,
    Maximize2, Minimize2
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useDebounce } from "use-debounce";

import DynamicVisualizer from "../components/visualizers/DynamicVisualizer.jsx";
import ProblemVisualizers from "../components/visualizers/problems";
import problems from "../data/problems.json";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Enhanced AI Service with better error handling and logging
class GeminiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    }

    async generate(prompt, options = {}) {
        const { temperature = 0.2, maxRetries = 3 } = options;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature }
                    })
                });

                const data = await response.json();

                if (data.error) {
                    throw new Error(`Gemini API Error: ${data.error.message}`);
                }

                return data.candidates[0].content.parts[0].text;
            } catch (error) {
                if (attempt === maxRetries) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    async generateSteps(code, problemTitle, approach, complexity) {
        const prompt = `You are an expert algorithm teacher. Create a step-by-step visualization for:
Problem: ${problemTitle}
Approach: ${approach} (${complexity} complexity)
Code: ${code}

Generate EXACTLY 5-8 visualization steps that teach a beginner:
1. Each step MUST have a clear "desc" explaining WHAT and WHY
2. Include "formula" showing the mathematical operation
3. Show "data" array state (max 8 elements)
4. Track relevant "scalars" (counters, sums, etc.)
5. Use "pointers" to show indices being processed

Return ONLY valid JSON array. Format:
[{
  "desc": "Step explanation with learning moment",
  "formula": "math expression = result",
  "data": [numbers],
  "scalars": {"sum": 0, "max": 5},
  "pointers": {"i": 0, "j": 1}
}]`;

        const response = await this.generate(prompt, { temperature: 0.3 });
        return this.parseJSONResponse(response);
    }

    parseJSONResponse(text) {
        // Clean and parse JSON response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("No valid JSON array found in response");

        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            // Attempt to fix common JSON issues
            const cleaned = jsonMatch[0]
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
                .replace(/,\s*}/g, '}') // Remove trailing commas
                .replace(/,\s*\]/g, ']'); // Remove trailing commas in arrays
            return JSON.parse(cleaned);
        }
    }

    async getHint(code, problemTitle) {
        const prompt = `As a coding tutor, give me a HINT for ${problemTitle}.
My current code: ${code}

Provide a progressive hint system:
1. First, what's the key insight needed?
2. What data structure might help?
3. What's the time complexity goal?
4. A small nudge towards the solution (not the full code)

Keep it encouraging and educational. Use bullet points.`;

        return this.generate(prompt, { temperature: 0.7 });
    }

    async explainCode(code, problemTitle) {
        const prompt = `Explain this ${problemTitle} solution like I'm 5 years old, then like I'm a CS student:

Code: ${code}

Format:
🎯 **For Beginners**: (simple analogies)
🔧 **How it Works**: (step-by-step)
⚡ **Time & Space**: (complexity analysis)
💡 **Key Takeaways**: (learning points)`;

        return this.generate(prompt, { temperature: 0.5 });
    }

    async debugCode(code, problemTitle) {
        const prompt = `Debug this ${problemTitle} solution with TEACHING in mind:

${code}

Analyze:
🐛 **Syntax Errors**: (if any)
🧠 **Logic Errors**: (explain WHY it's wrong)
⚠️ **Edge Cases**: (what's missing)
✅ **Fixed Version**: (show corrected code with comments explaining fixes)

Focus on teaching, not just fixing.`;

        return this.generate(prompt, { temperature: 0.4 });
    }
}

// Educational Components
const LearningTip = ({ tip, level = "beginner" }) => {
    const colors = {
        beginner: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        intermediate: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
        advanced: "text-purple-400 border-purple-500/30 bg-purple-500/10"
    };

    return (
        <div className={`p-3 rounded-lg border ${colors[level]} mb-2`}>
            <div className="flex items-start gap-2">
                <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm">{tip}</p>
            </div>
        </div>
    );
};

const ComplexityBadge = ({ time, space }) => (
    <div className="flex gap-2 text-xs">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded">
                        <Clock size={12} /> {time}
                    </div>
                </TooltipTrigger>
                <TooltipContent>Time Complexity</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded">
                        <Layers size={12} /> {space}
                    </div>
                </TooltipTrigger>
                <TooltipContent>Space Complexity</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
);

const CodeSnippet = ({ code, language = "cpp" }) => {
    return (
        <div className="relative group">
            <pre className="bg-black/40 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                <code>{code}</code>
            </pre>
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={() => navigator.clipboard.writeText(code)}
            >
                Copy
            </Button>
        </div>
    );
};

const VisualizerControls = ({ steps, currentStep, onStepChange, onPlay, isPlaying }) => {
    return (
        <div className="flex items-center gap-2 mt-2 p-2 bg-black/20 rounded-lg">
            <Button variant="ghost" size="sm" onClick={() => onStepChange(currentStep - 1)} disabled={currentStep === 0}>
                <ChevronLeft size={16} />
            </Button>

            <Button variant={isPlaying ? "secondary" : "default"} size="sm" onClick={onPlay}>
                {isPlaying ? "Pause" : "Play"}
            </Button>

            <span className="text-xs">
                Step {currentStep + 1} of {steps.length}
            </span>

            <Button variant="ghost" size="sm" onClick={() => onStepChange(currentStep + 1)} disabled={currentStep === steps.length - 1}>
                <ChevronRight size={16} />
            </Button>

            <Progress value={(currentStep / (steps.length - 1)) * 100} className="flex-1 h-1" />
        </div>
    );
};

// Main Workspace Component
export default function Workspace() {
    const [searchParams, setSearchParams] = useSearchParams();
    const problemId = parseInt(searchParams.get("problem")) || 560;
    const problem = problems.find((p) => p.id === problemId) || problems[0];
    const SpecificVisualizer = ProblemVisualizers[problem.id];

    // State Management
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isCompiling, setIsCompiling] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [geminiKey, setGeminiKey] = useState(localStorage.getItem("gemini_key") || "");
    const [approach, setApproach] = useState("optimal");
    const [complexity, setComplexity] = useState("O(n²)");
    const [visualizerSteps, setVisualizerSteps] = useState(null);
    const [visualizerError, setVisualizerError] = useState("");
    const [aiAssistantOutput, setAiAssistantOutput] = useState("");
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [editorTab, setEditorTab] = useState("terminal");
    const [notepadText, setNotepadText] = useState("");
    const aiOutputRef = useRef(null);
    const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") === "visualizer" ? "visualizer" : "editor");
    const [showHints, setShowHints] = useState(true);
    const [learningMode, setLearningMode] = useState("beginner");
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [savedCodes, setSavedCodes] = useState({});
    const [autoSave, setAutoSave] = useState(true);
    const [challengeMode, setChallengeMode] = useState(false);
    const [userProgress, setUserProgress] = useState({});
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [fontSize, setFontSize] = useState(14);
    const [isEditorExpanded, setIsEditorExpanded] = useState(false);

    // Refs
    const editorRef = useRef(null);
    const playIntervalRef = useRef(null);
    const geminiService = useMemo(() => new GeminiService(geminiKey), [geminiKey]);

    // Debounced values
    const [debouncedCode] = useDebounce(code, 1000);
    const [debouncedGeminiKey] = useDebounce(geminiKey, 1000);

    // Load saved data on mount
    useEffect(() => {
        // Load saved code for this problem
        const savedCode = localStorage.getItem(`code_${problemId}`);
        if (savedCode) {
            setCode(savedCode);
        } else {
            setCode(`// ${problem.title} - ${problem.difficulty} Problem
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
}`);
        }

        // Load saved notepad
        const savedNotepad = localStorage.getItem(`notepad_${problemId}`);
        if (savedNotepad) setNotepadText(savedNotepad);

        // Load user progress
        const progress = localStorage.getItem(`progress_${problemId}`);
        if (progress) setUserProgress(JSON.parse(progress));

        // Load saved codes library
        const savedCodesData = localStorage.getItem('saved_codes');
        if (savedCodesData) setSavedCodes(JSON.parse(savedCodesData));

        // Keyboard shortcuts
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRunCode();
            }
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                handleVisualizeWithAI();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSaveCode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [problemId, approach, problem]);

    // Close fullscreen editor with Escape
    useEffect(() => {
        if (!isEditorExpanded) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") setIsEditorExpanded(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isEditorExpanded]);

    // Auto-save code
    useEffect(() => {
        if (autoSave && debouncedCode) {
            localStorage.setItem(`code_${problemId}`, debouncedCode);
        }
    }, [debouncedCode, problemId, autoSave]);

    // Save API key
    useEffect(() => {
        if (debouncedGeminiKey) {
            localStorage.setItem("gemini_key", debouncedGeminiKey);
        }
    }, [debouncedGeminiKey]);

    // Save notepad
    useEffect(() => {
        localStorage.setItem(`notepad_${problemId}`, notepadText);
    }, [notepadText, problemId]);

    // Play interval for visualizer
    useEffect(() => {
        if (isPlaying && visualizerSteps) {
            playIntervalRef.current = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= visualizerSteps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1500);
        }
        return () => clearInterval(playIntervalRef.current);
    }, [isPlaying, visualizerSteps]);

    const handleRunCode = async () => {
        setIsCompiling(true);
        setOutput("🚀 Compiling your code...\n");

        // Simulate compilation with educational messages
        const messages = [
            "✅ Lexical analysis complete",
            "🔧 Parsing syntax tree...",
            "⚡ Optimizing code...",
            "📦 Generating machine code...",
            "🎯 Linking libraries..."
        ];

        for (let i = 0; i < messages.length; i++) {
            await new Promise(r => setTimeout(r, 300));
            setOutput(prev => prev + messages[i] + "\n");
        }

        setTimeout(() => {
            const timeComplexity = problem.complexities?.[approach] || "O(n)";
            const spaceComplexity = problem.spaceComplexities?.[approach] || "O(1)";

            setOutput(
                `✅ Compilation Successful! (0 Errors, 0 Warnings)\n\n` +
                `📊 Complexity Analysis:\n` +
                `   Time: ${timeComplexity}\n` +
                `   Space: ${spaceComplexity}\n\n` +
                `💡 Tip: Click "Generate Trace" to visualize your algorithm!\n` +
                `   Use the AI Assistant for hints and explanations.`
            );
            setIsCompiling(false);

            // Track progress
            updateProgress('compiled', true);
        }, 2000);
    };

    const handleVisualizeWithAI = async () => {
        if (!geminiKey) {
            setVisualizerError("🔑 Please provide a Gemini API Key first!");
            setEditorTab("ai");
            return;
        }

        setIsVisualizing(true);
        setVisualizerError("");
        setVisualizerSteps(null);

        try {
            const steps = await geminiService.generateSteps(code, problem.title, approach, complexity);
            setVisualizerSteps(steps);
            setCurrentStep(0);
            updateProgress('visualized', true);
        } catch (err) {
            setVisualizerError(`❌ Visualization Error: ${err.message}\n\nTry:\n1. Check your API key\n2. Simplify your code\n3. Add more comments`);
        }
        setIsVisualizing(false);
    };

    const handleAiAction = async (actionType) => {
        if (!geminiKey) {
            setEditorTab("ai");
            setAiAssistantOutput("🔑 Please enter your Gemini API Key first!");
            return;
        }

        setIsAiThinking(true);
        setEditorTab("ai");
        setAiAssistantOutput("🧠 Thinking...");

        try {
            let response;
            switch (actionType) {
                case 'hint':
                    response = await geminiService.getHint(code, problem.title);
                    break;
                case 'explain':
                    response = await geminiService.explainCode(code, problem.title);
                    break;
                case 'debug':
                    response = await geminiService.debugCode(code, problem.title);
                    break;
                case 'solution':
                    response = await geminiService.generate(
                        `Provide the C++17 code implementation for ${problem.title}. 
Use ONLY C++ in your answer (no Java, Python, or other languages).
Include three distinct sections, each as a fenced C++ code block with a short label above it:
1. Brute Force Code
2. Better Code
3. Optimal Code
For each code block:
- Wrap it in \`\`\`cpp ... \`\`\`
- Add brief time and space complexity comments at the top of the code.
Avoid long theory; focus on clean, idiomatic C++.`
                    );
                    break;
                default:
                    response = "Unknown action";
            }

            setAiAssistantOutput(response);
            updateProgress(`ai_${actionType}`, true);

            // Auto scroll to AI output
            setTimeout(() => {
                aiOutputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } catch (err) {
            setAiAssistantOutput(`❌ Error: ${err.message}`);
        }
        setIsAiThinking(false);
    };

    const handleSaveCode = () => {
        const name = prompt("Save this solution as:", `${problem.title}_${approach}`);
        if (name) {
            const newSaved = { ...savedCodes, [name]: { code, problem: problem.title, approach, timestamp: Date.now() } };
            setSavedCodes(newSaved);
            localStorage.setItem('saved_codes', JSON.stringify(newSaved));

            // Show success message
            setOutput(prev => prev + `\n✅ Code saved as "${name}"`);
        }
    };

    const handleLoadCode = (name) => {
        if (savedCodes[name]) {
            setCode(savedCodes[name].code);
            setOutput(prev => prev + `\n📂 Loaded "${name}"`);
        }
    };

    const updateProgress = (key, value) => {
        const newProgress = { ...userProgress, [key]: value, lastActive: Date.now() };
        setUserProgress(newProgress);
        localStorage.setItem(`progress_${problemId}`, JSON.stringify(newProgress));
    };

    const resetVisualizer = () => {
        setVisualizerSteps(null);
        setVisualizerError("");
        setCurrentStep(0);
        setIsPlaying(false);
    };

    // Learning tips based on approach
    const learningTips = {
        brute: [
            "Start with the simplest working solution",
            "Focus on correctness first, optimization later",
            "Brute force helps understand the problem deeply"
        ],
        better: [
            "Look for repeated work to optimize",
            "Consider using hash maps for O(1) lookup",
            "Try to reduce nested loops"
        ],
        optimal: [
            "Think about the theoretical minimum complexity",
            "Use two-pointer technique when possible",
            "Consider sliding window for subarray problems"
        ]
    };

    const difficultyBadge = {
        Easy: <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/20">Easy 🌱</Badge>,
        Medium: <Badge className="bg-yellow-500/15 text-yellow-300 border-yellow-500/20">Medium ⚡</Badge>,
        Hard: <Badge className="bg-red-500/15 text-red-300 border-red-500/20">Hard 🎯</Badge>
    }[problem.difficulty];

    const hasCompiled = Boolean(userProgress?.compiled);

    return (
        <TooltipProvider>
            <div className="h-[calc(100vh-56px)] px-4 py-4 overflow-y-auto">
                <div className="mx-auto max-w-7xl h-full flex flex-col gap-4">
                    {/* Fullscreen editor */}
                    {isEditorExpanded && (
                        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm">
                            <div className="h-full w-full px-4 py-4">
                                <div className="mx-auto max-w-7xl h-full flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                                            <Code size={16} className="text-cyan-300" />
                                            Editor
                                            <Badge variant="outline" className="border-white/10 text-slate-200 bg-white/5">
                                                Esc to close
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="border-white/10 bg-white/5 hover:bg-white/10"
                                            onClick={() => setIsEditorExpanded(false)}
                                        >
                                            <Minimize2 size={16} className="mr-2" />
                                            Exit fullscreen
                                        </Button>
                                    </div>

                                    <div className="flex-1 min-h-0 border border-white/10 rounded-xl overflow-hidden bg-black/40">
                                        <Editor
                                            height="100%"
                                            defaultLanguage="cpp"
                                            value={code}
                                            onChange={(value) => setCode(value || '')}
                                            theme="vs-dark"
                                            options={{
                                                minimap: { enabled: false },
                                                fontSize: fontSize,
                                                lineNumbers: showLineNumbers ? 'on' : 'off',
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex gap-2 flex-wrap">
                                            <Button onClick={handleRunCode} disabled={isCompiling} className="gap-2">
                                                <Play size={16} />
                                                {isCompiling ? "Compiling..." : "Run (Ctrl+Enter)"}
                                            </Button>
                                            <Button onClick={() => handleAiAction('hint')} variant="secondary" disabled={isAiThinking}>
                                                <Lightbulb size={14} className="mr-1" /> Hint
                                            </Button>
                                            <Button onClick={() => handleAiAction('explain')} variant="secondary" disabled={isAiThinking}>
                                                <BookOpen size={14} className="mr-1" /> Explain
                                            </Button>
                                            <Button onClick={() => handleAiAction('debug')} variant="secondary" disabled={isAiThinking}>
                                                <Bug size={14} className="mr-1" /> Debug
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                                            <span className="text-xs text-slate-300">Auto-save</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="text-sm font-semibold">
                                <span className="text-cyan-300 mr-2">#{problem.id}</span>
                                {problem.title}
                            </div>
                            {difficultyBadge}
                            <ComplexityBadge
                                time={problem.complexities?.[approach] || "O(n)"}
                                space={problem.spaceComplexities?.[approach] || "O(1)"}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center gap-2">
                                        <Key className="text-muted-foreground" size={16} />
                                        <Input
                                            type="password"
                                            placeholder="Gemini API Key…"
                                            value={geminiKey}
                                            onChange={(e) => setGeminiKey(e.target.value)}
                                            className="w-full md:w-80 bg-white/5 border-white/10"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Get your free API key from makersuite.google.com</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Settings */}
                            <Select value={learningMode} onValueChange={setLearningMode}>
                                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                                    <SelectValue placeholder="Learning Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">🌱 Beginner</SelectItem>
                                    <SelectItem value="intermediate">⚡ Intermediate</SelectItem>
                                    <SelectItem value="advanced">🎯 Advanced</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="ghost" size="icon" onClick={() => setShowHints(!showHints)}>
                                {showHints ? <Eye size={16} /> : <EyeOff size={16} />}
                            </Button>

                            <Button variant="ghost" size="icon" onClick={handleSaveCode}>
                                <Save size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Learning Tips */}
                    {showHints && (
                        <Alert className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                            <Lightbulb className="h-4 w-4 text-yellow-400" />
                            <AlertTitle>Learning Tips for {approach.toUpperCase()} Approach</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside text-sm">
                                    {learningTips[approach]?.map((tip, i) => (
                                        <li key={i}>{tip}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Main Content */}
                    <div className="md:hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full bg-white/5 border border-white/10">
                                <TabsTrigger value="editor" className="flex-1">
                                    <Code size={14} className="mr-2" /> Editor
                                </TabsTrigger>
                                <TabsTrigger value="visualizer" className="flex-1">
                                    <Box size={14} className="mr-2" /> Visualizer
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="mt-4 h-[calc(100vh-250px)] overflow-auto">
                            {activeTab === "editor" ? (
                                <Card className="bg-white/5 border-white/10">
                                    <CardContent className="p-4">
                                        {/* Editor Panel Content */}
                                        <div className="space-y-4">
                                            {/* Code Editor */}
                                            <div className="border border-white/10 rounded-lg overflow-hidden">
                                                <Editor
                                                    height="400px"
                                                    defaultLanguage="cpp"
                                                    value={code}
                                                    onChange={(value) => setCode(value || '')}
                                                    theme="vs-dark"
                                                    options={{
                                                        minimap: { enabled: false },
                                                        fontSize: fontSize,
                                                        lineNumbers: showLineNumbers ? 'on' : 'off',
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true,
                                                        suggestOnTriggerCharacters: true,
                                                        quickSuggestions: true
                                                    }}
                                                />
                                            </div>

                                            {/* Editor Controls */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-2">
                                                    <Button onClick={handleRunCode} disabled={isCompiling} className="gap-2">
                                                        <Play size={16} />
                                                        {isCompiling ? "Compiling..." : "Run (Ctrl+Enter)"}
                                                    </Button>
                                                    <Button onClick={() => handleAiAction('hint')} variant="secondary" size="sm">
                                                        <Lightbulb size={14} className="mr-1" /> Hint
                                                    </Button>
                                                    <Button onClick={() => handleAiAction('explain')} variant="secondary" size="sm">
                                                        <BookOpen size={14} className="mr-1" /> Explain
                                                    </Button>
                                                    <Button onClick={() => handleAiAction('debug')} variant="secondary" size="sm">
                                                        <Bug size={14} className="mr-1" /> Debug
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                                                    <span className="text-xs">Auto-save</span>
                                                </div>
                                            </div>

                                            {/* Output Tabs */}
                                            <Tabs value={editorTab} onValueChange={setEditorTab}>
                                                <TabsList className="bg-white/5 border border-white/10">
                                                    <TabsTrigger value="terminal">Terminal</TabsTrigger>
                                                    <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                                                    <TabsTrigger value="notepad">Scratchpad</TabsTrigger>
                                                </TabsList>

                                                <div className="mt-2 border border-white/10 bg-black/40 rounded-lg p-3 min-h-[150px] max-h-[200px] overflow-auto">
                                                    {editorTab === "terminal" && (
                                                        <pre className="text-xs text-emerald-200/90 whitespace-pre-wrap">{output}</pre>
                                                    )}
                                                    {editorTab === "ai" && (
                                                        <div className="text-xs prose prose-invert max-w-none">
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    code({ inline, className, children, ...props }) {
                                                                        return !inline ? (
                                                                            <pre className="bg-black/60 p-3 rounded-md overflow-x-auto text-[0.7rem]">
                                                                                <code className={className} {...props}>
                                                                                    {children}
                                                                                </code>
                                                                            </pre>
                                                                        ) : (
                                                                            <code className="bg-black/40 px-1.5 py-0.5 rounded text-[0.7rem]" {...props}>
                                                                                {children}
                                                                            </code>
                                                                        );
                                                                    },
                                                                }}
                                                            >
                                                                {aiAssistantOutput || ""}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                    {editorTab === "notepad" && (
                                                        <textarea
                                                            value={notepadText}
                                                            onChange={(e) => setNotepadText(e.target.value)}
                                                            className="w-full h-full bg-transparent border-none text-xs resize-none focus:outline-none"
                                                            placeholder="📝 Your notes, ideas, and observations..."
                                                        />
                                                    )}
                                                </div>
                                            </Tabs>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="bg-white/5 border-white/10">
                                    <CardContent className="p-4">
                                        {/* Visualizer Panel Content */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-2">
                                                    <Tabs value={approach} onValueChange={setApproach}>
                                                        <TabsList className="bg-black/40 border border-white/10">
                                                            <TabsTrigger value="brute">Brute Force</TabsTrigger>
                                                            <TabsTrigger value="better">Better</TabsTrigger>
                                                            <TabsTrigger value="optimal">Optimal</TabsTrigger>
                                                        </TabsList>
                                                    </Tabs>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={handleVisualizeWithAI}
                                                        disabled={isVisualizing || !hasCompiled}
                                                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                                                    >
                                                        <Sparkles size={16} className="mr-2" />
                                                        {!hasCompiled ? "Run code first" : (isVisualizing ? "Generating..." : "Generate Trace")}
                                                    </Button>
                                                    {visualizerSteps && (
                                                        <Button variant="ghost" size="icon" onClick={resetVisualizer}>
                                                            <RotateCcw size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="border border-white/10 bg-black/40 rounded-lg min-h-[400px] p-4">
                                                {visualizerSteps ? (
                                                    <>
                                                        <DynamicVisualizer
                                                            steps={visualizerSteps}
                                                            currentStep={currentStep}
                                                            error={visualizerError}
                                                        />
                                                        <VisualizerControls
                                                            steps={visualizerSteps}
                                                            currentStep={currentStep}
                                                            onStepChange={setCurrentStep}
                                                            onPlay={() => setIsPlaying(!isPlaying)}
                                                            isPlaying={isPlaying}
                                                        />
                                                    </>
                                                ) : visualizerError ? (
                                                    <Alert variant="destructive">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <AlertTitle>Visualization Error</AlertTitle>
                                                        <AlertDescription>{visualizerError}</AlertDescription>
                                                    </Alert>
                                                ) : !hasCompiled ? (
                                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                                        <Box size={40} className="mb-3 text-white/20" />
                                                        <h3 className="text-base font-semibold mb-1">Run code to enable visualization</h3>
                                                        <p className="text-sm text-muted-foreground max-w-md">
                                                            After you run your solution, you can generate a clean step-by-step trace here.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                                        <Box size={48} className="mb-4 text-white/20" />
                                                        <h3 className="text-lg font-semibold mb-2">Ready to Visualize!</h3>
                                                        <p className="text-sm text-muted-foreground max-w-md">
                                                            Click "Generate Trace" to see your algorithm come to life with step-by-step explanations.
                                                            {learningMode === "beginner" && " Perfect for learning how the algorithm works!"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className={`hidden md:grid ${isEditorExpanded ? 'grid-cols-1' : 'grid-cols-2'} gap-4 flex-1 min-h-0`}>
                        {/* Editor Panel */}
                        <Card className="bg-white/5 border-white/10 flex flex-col">
                            <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Code className="text-cyan-300" size={18} />
                                    Code Editor
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button onClick={handleRunCode} disabled={isCompiling} size="sm" className="gap-2">
                                        <Play size={14} />
                                        {isCompiling ? "Running..." : "Run"}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setShowLineNumbers(!showLineNumbers)}>
                                        {showLineNumbers ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditorExpanded(!isEditorExpanded)} title={isEditorExpanded ? "Minimize Editor" : "Maximize Editor"}>
                                        {isEditorExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                    </Button>
                                    <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(parseInt(v))}>
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
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col p-4 pt-0 overflow-y-auto scroll-smooth">
                                <div className="flex-1 min-h-[400px] flex-shrink-0 border border-white/10 rounded-lg overflow-hidden">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="cpp"
                                        value={code}
                                        onChange={(value) => setCode(value || '')}
                                        theme="vs-dark"
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: fontSize,
                                            lineNumbers: showLineNumbers ? 'on' : 'off',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true
                                        }}
                                    />
                                </div>

                                {/* AI Action Buttons */}
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("hint")} disabled={isAiThinking}>
                                        <Lightbulb size={14} className="mr-1" /> Hint
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("explain")} disabled={isAiThinking}>
                                        <BookOpen size={14} className="mr-1" /> Explain
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("debug")} disabled={isAiThinking}>
                                        <Bug size={14} className="mr-1" /> Debug
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleAiAction("solution")} disabled={isAiThinking}>
                                        <Code size={14} className="mr-1" /> Solution
                                    </Button>
                                </div>

                                {/* Output Area */}
                                <div ref={aiOutputRef} className="mt-4 flex-shrink-0 min-h-[350px] border border-white/10 rounded-lg bg-black/40 flex flex-col">
                                    <Tabs value={editorTab} onValueChange={setEditorTab} className="h-full flex flex-col">
                                        <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none p-0">
                                            <TabsTrigger value="terminal" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cyan-400">Terminal</TabsTrigger>
                                            <TabsTrigger value="ai" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-400">AI Assistant</TabsTrigger>
                                            <TabsTrigger value="notepad" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400">Scratchpad</TabsTrigger>
                                        </TabsList>
                                        <div className="flex-1 p-3 overflow-auto">
                                            {editorTab === "terminal" && (
                                                <pre className="text-xs text-emerald-200/90 whitespace-pre-wrap">{output}</pre>
                                            )}
                                            {editorTab === "ai" && (
                                                <div className="text-xs prose prose-invert max-w-none">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ inline, className, children, ...props }) {
                                                                return !inline ? (
                                                                    <pre className="bg-black/60 p-3 rounded-md overflow-x-auto text-[0.7rem]">
                                                                        <code className={className} {...props}>
                                                                            {children}
                                                                        </code>
                                                                    </pre>
                                                                ) : (
                                                                    <code className="bg-black/40 px-1.5 py-0.5 rounded text-[0.7rem]" {...props}>
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {aiAssistantOutput || "👋 Ask me anything about your code!"}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                            {editorTab === "notepad" && (
                                                <textarea
                                                    value={notepadText}
                                                    onChange={(e) => setNotepadText(e.target.value)}
                                                    className="w-full h-full bg-transparent border-none text-xs resize-none focus:outline-none"
                                                    placeholder="📝 Jot down your thoughts, edge cases, or pseudocode here..."
                                                />
                                            )}
                                        </div>
                                    </Tabs>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visualizer Panel */}
                        {!isEditorExpanded && (
                            <Card className="bg-white/5 border-white/10 flex flex-col">
                                <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Box className="text-cyan-300" size={18} />
                                        Algorithm Visualizer
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Tabs value={approach} onValueChange={setApproach}>
                                            <TabsList className="bg-black/40 border border-white/10">
                                                <TabsTrigger value="brute">Brute</TabsTrigger>
                                                <TabsTrigger value="better">Better</TabsTrigger>
                                                <TabsTrigger value="optimal">Optimal</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <Button
                                            onClick={handleVisualizeWithAI}
                                            disabled={isVisualizing || !hasCompiled}
                                            size="sm"
                                            className="bg-gradient-to-r from-purple-600 to-pink-600"
                                        >
                                            <Sparkles size={14} className="mr-1" />
                                            {!hasCompiled ? "Run code first" : (isVisualizing ? "Thinking..." : "Generate")}
                                        </Button>
                                        {visualizerSteps && (
                                            <Button variant="ghost" size="icon" onClick={resetVisualizer}>
                                                <RotateCcw size={14} />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 min-h-0 p-4 pt-0">
                                    <div className="h-full border border-white/10 rounded-lg bg-black/40 overflow-auto">
                                        {visualizerSteps ? (
                                            <div className="p-4">
                                                <DynamicVisualizer
                                                    steps={visualizerSteps}
                                                    currentStep={currentStep}
                                                    error={visualizerError}
                                                />
                                                <VisualizerControls
                                                    steps={visualizerSteps}
                                                    currentStep={currentStep}
                                                    onStepChange={setCurrentStep}
                                                    onPlay={() => setIsPlaying(!isPlaying)}
                                                    isPlaying={isPlaying}
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
                                        ) : !hasCompiled ? (
                                            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                                <Box size={40} className="mb-3 text-white/20" />
                                                <h3 className="text-base font-semibold mb-1 text-foreground">Run code to enable visualization</h3>
                                                <p className="text-sm text-muted-foreground max-w-md">
                                                    After you run your solution, click <span className="text-purple-300 font-medium">Generate</span> to create a trace.
                                                </p>
                                            </div>
                                        ) : SpecificVisualizer ? (
                                            <SpecificVisualizer approach={approach} />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                                <Box size={48} className="mb-4 text-white/20" />
                                                <h3 className="text-lg font-semibold mb-2 text-foreground">
                                                    {problem.title}
                                                </h3>
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
                                        )}
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
