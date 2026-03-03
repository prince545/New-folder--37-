import React from "react";
import { Badge } from "../components/ui/badge";

export const DIFFICULTY_BADGES = {
    Easy: (
        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/20">
            Easy 🌱
        </Badge>
    ),
    Medium: (
        <Badge className="bg-yellow-500/15 text-yellow-300 border-yellow-500/20">
            Medium ⚡
        </Badge>
    ),
    Hard: (
        <Badge className="bg-red-500/15 text-red-300 border-red-500/20">
            Hard 🎯
        </Badge>
    ),
};

export const LEARNING_TIPS = {
    brute: [
        "Start with the simplest working solution",
        "Focus on correctness first, optimization later",
        "Brute force helps understand the problem deeply",
    ],
    better: [
        "Look for repeated work to optimize",
        "Consider using hash maps for O(1) lookup",
        "Try to reduce nested loops",
    ],
    optimal: [
        "Think about the theoretical minimum complexity",
        "Use two-pointer technique when possible",
        "Consider sliding window for subarray problems",
    ],
};

export const AI_ACTION_BUTTONS = [
    { id: "hint", label: "Hint", icon: "Lightbulb" },
    { id: "explain", label: "Explain", icon: "BookOpen" },
    { id: "debug", label: "Debug", icon: "Bug" },
    { id: "solution", label: "Solution", icon: "Code" },
];
