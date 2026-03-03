import React from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Code2, PlayCircle } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(192,132,252,0.16),transparent_55%)]" />
      <div className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mx-auto mb-6 w-fit bg-white/5 text-muted-foreground border-white/10"
          >
            New: Interactive Visualizations
          </Badge>
          <h1 className="font-[Outfit] text-4xl md:text-6xl font-extrabold tracking-tight">
            Master DSA with{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Experience algorithms like never before. Visualize execution step-by-step,
            write C++ in the built-in editor, and get AI-powered explanations of your logic.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button size="lg" onClick={() => navigate("/hub")}>
              Browse 30 Problems <PlayCircle />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => navigate("/workspace?problem=560")}
            >
              Open Editor <Code2 />
            </Button>
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="text-pink-300" />
                Step-by-step execution
              </CardTitle>
              <CardDescription>
                See how algorithms transform arrays, matrices, and pointers in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Generated overlays highlight key variables and indices so you can build intuition fast.
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="text-cyan-300" />
                Integrated C++ workspace
              </CardTitle>
              <CardDescription>
                Write and iterate quickly with a focused editor + terminal output panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Perfect for interview-style problem solving without switching tools.
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="text-purple-300" />
                AI explanations
              </CardTitle>
              <CardDescription>
                Ask for a trace and get an educational, structured step sequence.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Great for understanding edge cases and bridging the gap from code to reasoning.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
