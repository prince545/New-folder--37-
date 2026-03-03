import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Code2, PlayCircle, BarChart, BookOpen, Users,
    ChevronRight, Github, Twitter, Linkedin, Zap,
    Shield, Cpu, Globe, Rocket, Trophy, Layers, GitBranch, Box,
    Terminal, Library, CheckCircle2
} from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count}{suffix}</span>;
};

// Testimonial carousel
const Testimonials = () => {
    const testimonials = [
        {
            name: "Alex Chen",
            role: "Software Engineer",
            content: "The visualizer helped me understand complex pointer logic in a way textbooks never could. Essential for interview prep.",
            avatar: "AC"
        },
        {
            name: "Sarah Johnson",
            role: "Frontend Developer",
            content: "A sleek, no-nonsense environment for practicing DSA. The step-by-step execution view is incredibly helpful.",
            avatar: "SJ"
        },
        {
            name: "Mike Rodriguez",
            role: "CS Student",
            content: "Finally, a tool that lets me write real code and instantly see the memory and state changes. Highly recommended.",
            avatar: "MR"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {testimonials.map((t, i) => (
                <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-all rounded-xl shadow-none">
                    <CardContent className="p-8">
                        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">"{t.content}"</p>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 bg-zinc-800 border border-zinc-700">
                                <AvatarFallback className="text-zinc-300 text-xs font-semibold">{t.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                                <p className="text-xs text-zinc-500">{t.role}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Feature showcase with interactive tabs
const FeatureShowcase = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState("visualize");

    const features = {
        visualize: {
            title: "Algorithm Visualization",
            description: "Step through array accesses, pointer movements, and structural changes in real-time to debug and understand deep logic.",
            icon: <PlayCircle className="w-5 h-5 text-zinc-100" />,
            stats: ["30+ Built-in Algorithms", "2D Grid Support", "Pointer Tracking"]
        },
        code: {
            title: "Professional Workspace",
            description: "A robust editor equipped with syntax highlighting, auto-complete, and an isolated execution environment.",
            icon: <Terminal className="w-5 h-5 text-zinc-100" />,
            stats: ["Real C++ Compilation", "Error Highlighting", "No Sandbox Limitations"]
        },
        analytics: {
            title: "Performance Insights",
            description: "Track your problem-solving speed, success rate, and algorithmic complexity tradeoffs across your learning journey.",
            icon: <BarChart className="w-5 h-5 text-zinc-100" />,
            stats: ["Time/Space Tracking", "Progress Metrics", "Difficulty Curves"]
        }
    };

    return (
        <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-none">
            <CardContent className="p-0">
                <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full flex flex-col md:flex-row min-h-[350px]">
                    <div className="md:w-1/3 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-2">
                        <TabsList className="flex flex-col h-auto bg-transparent items-start space-y-2 p-0">
                            {Object.entries(features).map(([key, feature]) => (
                                <TabsTrigger
                                    key={key}
                                    value={key}
                                    className="w-full justify-start gap-3 px-4 py-3 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all font-medium"
                                >
                                    {feature.icon} {feature.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                        <div className="max-w-xl">
                            <h3 className="text-2xl font-bold text-zinc-100 mb-3">{features[activeFeature].title}</h3>
                            <p className="text-zinc-400 mb-8 leading-relaxed text-base">{features[activeFeature].description}</p>

                            <div className="flex flex-col gap-3 mb-8">
                                {features[activeFeature].stats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                        <CheckCircle2 size={16} className="text-zinc-500" />
                                        {stat}
                                    </div>
                                ))}
                            </div>

                            <Button onClick={() => navigate("/hub")} className="gap-2 bg-zinc-100 text-zinc-950 hover:bg-white rounded-md font-medium px-6">
                                Try it now <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

// Stats section
const Stats = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
                <Users className="w-6 h-6 mx-auto mb-3 text-zinc-400" />
                <div className="text-3xl font-bold text-zinc-100 tracking-tight">
                    <AnimatedCounter end={5000} suffix="+" />
                </div>
                <p className="text-sm text-zinc-500 mt-1 font-medium">Active Engineers</p>
            </div>

            <div className="text-center p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
                <Library className="w-6 h-6 mx-auto mb-3 text-zinc-400" />
                <div className="text-3xl font-bold text-zinc-100 tracking-tight">
                    <AnimatedCounter end={30} suffix="+" />
                </div>
                <p className="text-sm text-zinc-500 mt-1 font-medium">Core Problems</p>
            </div>

            <div className="text-center p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
                <PlayCircle className="w-6 h-6 mx-auto mb-3 text-zinc-400" />
                <div className="text-3xl font-bold text-zinc-100 tracking-tight">
                    <AnimatedCounter end={10} suffix="k+" />
                </div>
                <p className="text-sm text-zinc-500 mt-1 font-medium">Visualizations Run</p>
            </div>

            <div className="text-center p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
                <Trophy className="w-6 h-6 mx-auto mb-3 text-zinc-400" />
                <div className="text-3xl font-bold text-zinc-100 tracking-tight">
                    <AnimatedCounter end={94} suffix="%" />
                </div>
                <p className="text-sm text-zinc-500 mt-1 font-medium">Completion Rate</p>
            </div>
        </div>
    );
};

// Problem categories preview
const CategoryPreview = () => {
    const categories = [
        { name: "Arrays & Strings", count: 8, icon: <Layers size={18} /> },
        { name: "Dynamic Programming", count: 6, icon: <Box size={18} /> },
        { name: "Trees & Graphs", count: 9, icon: <GitBranch size={18} /> },
        { name: "Advanced Algorithms", count: 7, icon: <Terminal size={18} /> },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {categories.map((cat, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition-colors p-5 rounded-xl cursor-pointer group flex flex-col justify-between h-32 text-left">
                    <div className="text-zinc-400 group-hover:text-zinc-100 transition-colors">
                        {cat.icon}
                    </div>
                    <div>
                        <h4 className="font-semibold text-zinc-200 text-sm tracking-wide">{cat.name}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{cat.count} problems</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main component
export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white pb-20">
            {/* Extremely subtle grid background */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container max-w-6xl mx-auto px-6 py-16 md:py-24">
                {/* Hero section */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
                    <Badge
                        variant="outline"
                        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-semibold tracking-wide text-zinc-300 uppercase"
                    >
                        <Code2 size={14} className="text-zinc-400" />
                        Professional DSA Environment
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
                        Master Algorithms via <br />
                        <span className="text-zinc-400">Real-Time Visualization</span>
                    </h1>

                    <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-2xl">
                        A clean, structured workspace tailored for engineers. Write C++ solutions, completely isolate execution logic, and step through every array transformation and pointer swap visually.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button
                            size="lg"
                            onClick={() => navigate("/hub")}
                            className="bg-white hover:bg-zinc-200 text-zinc-950 px-8 h-12 rounded-lg font-bold text-sm tracking-wide"
                        >
                            Open the Hub
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-white px-8 h-12 rounded-lg font-semibold text-sm tracking-wide text-zinc-300"
                            onClick={() => {
                                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Explore Features
                        </Button>
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-2">
                            <Zap size={14} /> Zero setup required
                        </span>
                        <span className="flex items-center gap-2">
                            <Shield size={14} /> Enterprise-grade editor
                        </span>
                        <span className="flex items-center gap-2">
                            <Cpu size={14} /> Native execution engine
                        </span>
                    </div>
                </div>

                {/* Dashboard Preview UI */}
                <div className="relative mx-auto max-w-5xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden mb-24">
                    <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                        </div>
                        <div className="mx-auto text-xs font-medium text-zinc-500 font-mono tracking-widest uppercase">
                            Workspace · workspace.cpp
                        </div>
                    </div>
                    <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-zinc-800 min-h-[300px]">
                        <div className="p-6 bg-zinc-950">
                            <div className="font-mono text-sm text-zinc-400">
                                <span className="text-pink-500">int</span> <span className="text-blue-400">lengthOfLongestSubstring</span>(<span className="text-pink-500">string</span> s) {'{'}
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">vector</span>{'<'}int{'>'} last(<span className="text-purple-400">256</span>, -<span className="text-purple-400">1</span>);
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">int</span> left = <span className="text-purple-400">0</span>, best = <span className="text-purple-400">0</span>;
                                <br /><br />&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">for</span> (<span className="text-pink-500">int</span> right = <span className="text-purple-400">0</span>; right {'<'} s.size(); right++) {'{'}
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">if</span> (last[s[right]] {'>='} left)
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left = last[s[right]] + <span className="text-purple-400">1</span>;
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last[s[right]] = right;
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;best = <span className="text-blue-400">max</span>(best, right - left + <span className="text-purple-400">1</span>);
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;{'}'}
                                <br />&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">return</span> best;
                                <br />{'}'}
                            </div>
                        </div>
                        <div className="p-6 bg-zinc-900/50 flex flex-col justify-center gap-6">
                            <div className="flex justify-between items-center text-xs text-zinc-500 font-medium tracking-wide uppercase">
                                <span>Array State (Step 4)</span>
                                <span>O(N) Time</span>
                            </div>
                            <div className="flex gap-2 text-sm font-mono font-bold">
                                {["a", "b", "c", "a", "b", "b"].map((ch, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded py-3 text-center border ${i === 1 || i === 2 || i === 3
                                                ? "border-zinc-300 bg-zinc-800 text-white"
                                                : "border-zinc-800 text-zinc-600"
                                            }`}
                                    >
                                        {ch}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-zinc-400 bg-zinc-950 border border-zinc-800 rounded p-4">
                                <span className="text-white font-semibold flex items-center gap-2 mb-1"><PlayCircle size={14} /> Execution Logs</span>
                                Array window extended. Pointers: left=1, right=3. Max length updated to 3.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats section */}
                <Stats />

                {/* Feature showcase */}
                <div id="features" className="mt-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">Platform Capabilities</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">Everything you need to deeply understand data structures, integrated into one seamless workflow.</p>
                    </div>
                    <FeatureShowcase />
                </div>

                {/* Category preview */}
                <div className="mt-32">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Curated Problem Set</h2>
                            <p className="text-zinc-400">The definitive list of fundamental algorithms.</p>
                        </div>
                        <Button variant="ghost" onClick={() => navigate("/hub")} className="text-zinc-300 hover:text-white hover:bg-zinc-900 hidden md:flex gap-2">
                            View Curriculum <ChevronRight size={16} />
                        </Button>
                    </div>
                    <CategoryPreview />
                </div>

                {/* Testimonials */}
                <div className="mt-32">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">Peer Reviews</h2>
                        <p className="text-zinc-400">Feedback from software engineers relying on our platform.</p>
                    </div>
                    <Testimonials />
                </div>

                {/* Footer CTA */}
                <div className="mt-32 border-t border-zinc-900 pt-20 pb-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-6">Begin your technical prep.</h2>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" onClick={() => navigate("/hub")} className="gap-2 bg-white text-black hover:bg-zinc-200 rounded-lg px-8 py-6 text-base font-bold shadow-none">
                                Goto Workspace
                            </Button>
                        </div>
                    </div>

                    <div className="mt-24 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500 font-medium">
                        <div className="flex items-center gap-2">
                            <Code2 className="text-zinc-400 w-5 h-5" />
                            <span className="text-zinc-300 tracking-wide font-bold uppercase">DSA Vis</span>
                        </div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-zinc-300 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-zinc-300 transition-colors">Support</a>
                            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
                        </div>
                        <div className="flex gap-4">
                            <Github size={18} className="hover:text-zinc-300 cursor-pointer transition-colors" />
                            <Twitter size={18} className="hover:text-zinc-300 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
