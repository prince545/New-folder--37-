import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Code2, Search } from "lucide-react";

import problems from "../data/problems.json";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

const difficultyOptions = [
  { value: "all", label: "All" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

function DifficultyBadge({ difficulty }) {
  if (difficulty === "Easy") return <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/20">Easy</Badge>;
  if (difficulty === "Medium") return <Badge className="bg-yellow-500/15 text-yellow-300 border-yellow-500/20">Medium</Badge>;
  if (difficulty === "Hard") return <Badge className="bg-red-500/15 text-red-300 border-red-500/20">Hard</Badge>;
  return <Badge variant="secondary">{difficulty}</Badge>;
}

export default function LearningHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const filteredProblems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return problems.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.id).includes(q);
      const matchesDifficulty = difficulty === "all" || p.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficulty]);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Top 30 DSA Concepts{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Focus
          </span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          High-yield problems asked in 2025–2026. Pick one to solve in C++ or generate an AI trace.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="mx-auto w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by id, name, or category…"
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <div className="mt-3 flex items-center justify-center">
            <Tabs value={difficulty} onValueChange={setDifficulty}>
              <TabsList className="bg-white/5 border border-white/10">
                {difficultyOptions.map((d) => (
                  <TabsTrigger key={d.value} value={d.value}>
                    {d.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="bg-white/5 border-white/10 hover:border-cyan-400/30 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-lg leading-snug">
                      <span className="text-cyan-300">#{problem.id}</span>{" "}
                      {problem.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <span className="text-purple-200/80 font-medium">
                        {problem.category}
                      </span>
                    </CardDescription>
                  </div>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground italic min-h-[44px]">
                  “{problem.note}”
                </p>
                <div className="mt-5 flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10"
                    onClick={() => navigate(`/workspace?problem=${problem.id}`)}
                  >
                    <Code2 />
                    Solve C++
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                    onClick={() =>
                      navigate(`/workspace?problem=${problem.id}&tab=visualizer`)
                    }
                  >
                    <Play />
                    Visualize
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            No problems match your search.
          </div>
        )}
      </div>
    </div>
  );
}
