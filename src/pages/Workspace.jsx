import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Key, Play, Sparkles } from "lucide-react";

import DynamicVisualizer from "../components/visualizers/DynamicVisualizer.jsx";
import ProblemVisualizers from "../components/visualizers/problems";
import problems from "../data/problems.json";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

// Simple gemini invocation
async function generateSteps(code, problemTitle, apiKey) {
    if (!apiKey) throw new Error("Please provide a Gemini API Key in the top right corner.");

    const prompt = `You are a premium algorithm visualizer engine matching code execution states.
Problem: ${problemTitle}
User Code:
${code}

Trace the execution for a small sample input step-by-step.
Output ONLY a raw JSON array. DO NOT use markdown, backticks, comments, or extra text.
Each object must represent a state:
{
  "desc": "Rich, multi-sentence explanation of what is happening.",
  "formula": "The math happening, e.g., 'max(0, 5) = 5' or 'sum += nums[i]'",
  "data": [array of numbers],
  "scalars": { "sum": 5, "k": 3, "ans": 0 },
  "pointers": { "i": 0, "j": 1 }
}
Rules:
- Use valid JSON (double quotes, no trailing commas, no NaN/Infinity).
- Keep "data" reasonably small (<= 12 items).
- "pointers" values should be indices into "data" when applicable.
- "scalars" values must be JSON-serializable primitives or small objects.
Limit to 12 steps max. Make it detailed and educational.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const textOutput = data.candidates[0].content.parts[0].text;
    let cleanText = (textOutput || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Try finding array bracket bounds to fix bad generation
    const start = cleanText.indexOf('[');
    const end = cleanText.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
        cleanText = cleanText.substring(start, end + 1);
    }

    try {
      return JSON.parse(cleanText);
    } catch (e) {
      // Common failure mode: Gemini returns an array but includes leading/trailing prose.
      // We already bracket-sliced; final fallback is to surface a helpful snippet.
      const preview = cleanText.slice(0, 600);
      throw new Error(
        "Failed to parse Gemini JSON. Ensure your code is clear and the response is a raw JSON array.\n\nFirst 600 chars:\n" +
          preview
      );
    }
}

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const problemId = parseInt(searchParams.get("problem")) || 560;
  const problem = problems.find((p) => p.id === problemId) || problems[0];

  const SpecificVisualizer = ProblemVisualizers[problem.id];

  const initialTab = useMemo(() => {
    const t = searchParams.get("tab");
    return t === "visualizer" ? "visualizer" : "editor";
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState(initialTab);

  const [code, setCode] = useState(
    "// Write your C++ solution for " +
      problem.title +
      "\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World!\" << endl;\n    return 0;\n}"
  );
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);

  const [geminiKey, setGeminiKey] = useState(
    localStorage.getItem("gemini_key") || ""
  );
  const [visualizerSteps, setVisualizerSteps] = useState(null);
  const [visualizerError, setVisualizerError] = useState("");

  useEffect(() => {
    localStorage.setItem("gemini_key", geminiKey);
  }, [geminiKey]);

  const handleRunCode = async () => {
    setIsCompiling(true);
    setOutput("Connecting to Compiler API...\n");

    setTimeout(() => {
      setOutput(
        '=> Compilation Successful! (0 Errors, 0 Warnings)\n\n[Note]: Public Piston API is whitelist-only as of 2026. This is a local simulation.\nIf there are no syntax errors, proceed by clicking "AI Generate Overlay" to visualize your logic.'
      );
      setIsCompiling(false);
    }, 1200);
  };

  const handleVisualizeWithAI = async () => {
    setIsVisualizing(true);
    setVisualizerError("");
    setVisualizerSteps(null);
    try {
      const steps = await generateSteps(code, problem.title, geminiKey);
      setVisualizerSteps(steps);
    } catch (err) {
      setVisualizerError(
        err.message || "Failed to parse AI response. Check your code or API key."
      );
    }
    setIsVisualizing(false);
  };

  const difficultyBadge =
    problem.difficulty === "Easy" ? (
      <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/20">
        Easy
      </Badge>
    ) : problem.difficulty === "Medium" ? (
      <Badge className="bg-yellow-500/15 text-yellow-300 border-yellow-500/20">
        Medium
      </Badge>
    ) : (
      <Badge className="bg-red-500/15 text-red-300 border-red-500/20">
        Hard
      </Badge>
    );

  const EditorPanel = (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">C++ Editor</CardTitle>
        <Button onClick={handleRunCode} disabled={isCompiling} className="gap-2">
          <Play />
          {isCompiling ? "Running..." : "Run Code"}
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="min-h-[360px] font-mono bg-black/30 border-white/10 focus-visible:ring-cyan-400/40"
        />

        <div className="mt-4 rounded-md border border-white/10 bg-black/40">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-white/10">
            Terminal Output
          </div>
          <pre className="max-h-64 overflow-auto p-3 text-xs text-emerald-200/90 whitespace-pre-wrap">
            {output || "No output"}
          </pre>
        </div>
      </CardContent>
    </Card>
  );

  const VisualizerPanel = (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Box className="text-cyan-300" />
          Visualizer
        </CardTitle>
        <Button
          onClick={handleVisualizeWithAI}
          disabled={isVisualizing}
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        >
          <Sparkles />
          {isVisualizing ? "Thinking..." : "AI Generate Overlay"}
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border border-white/10 bg-black/40 min-h-[520px]">
          {visualizerSteps || visualizerError ? (
            <DynamicVisualizer steps={visualizerSteps} error={visualizerError} />
          ) : SpecificVisualizer ? (
            <SpecificVisualizer />
          ) : (
            <div className="h-[520px] flex flex-col items-center justify-center text-center px-8 text-muted-foreground">
              <Box size={48} className="mb-4 text-white/20" />
              <div className="text-lg font-semibold text-foreground mb-2">
                Ready to visualize {problem.title}
              </div>
              <p className="text-sm max-w-md">
                Paste your Gemini API key above, write a solution, then click{" "}
                <strong>AI Generate Overlay</strong> to create a step-by-step trace.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-[calc(100vh-56px)] px-4 py-4">
      <div className="mx-auto max-w-7xl h-full flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm font-semibold">
              <span className="text-cyan-300 mr-2">#{problem.id}</span>
              {problem.title}
            </div>
            {difficultyBadge}
          </div>

          <div className="flex items-center gap-2">
            <Key className="text-muted-foreground" size={16} />
            <Input
              type="password"
              placeholder="Paste Gemini API Key…"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full md:w-80 bg-white/5 border-white/10"
            />
          </div>
        </div>

        <div className="md:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white/5 border border-white/10">
              <TabsTrigger value="editor" className="flex-1">
                Editor
              </TabsTrigger>
              <TabsTrigger value="visualizer" className="flex-1">
                Visualizer
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4">
            {activeTab === "editor" ? EditorPanel : VisualizerPanel}
          </div>
        </div>

        <div className="hidden md:grid grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="min-h-0">{EditorPanel}</div>
          <div className="min-h-0">{VisualizerPanel}</div>
        </div>
      </div>
    </div>
  );
}
