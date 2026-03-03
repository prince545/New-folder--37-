import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    BrainCircuit, Code2, PlayCircle, Sparkles, TrendingUp,
    BookOpen, Target, Users, Star, Award, ChevronRight,
    Github, Twitter, Linkedin, Zap, Shield, Cpu, Globe,
    Rocket, GraduationCap, Trophy, BarChart, Layers, GitBranch
} from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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
            role: "CS Student",
            content: "The visualizer helped me understand recursion in a way textbooks never could. Got into Google summer internship!",
            avatar: "AC",
            rating: 5
        },
        {
            name: "Sarah Johnson",
            role: "Self-taught Developer",
            content: "From zero to passing Amazon interviews in 4 months. The AI explanations are pure gold.",
            avatar: "SJ",
            rating: 5
        },
        {
            name: "Mike Rodriguez",
            role: "Bootcamp Graduate",
            content: "Finally, a tool that doesn't just give answers but teaches the 'why'. Landed my first dev job!",
            avatar: "MR",
            rating: 5
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {testimonials.map((t, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-300 mb-4">"{t.content}"</p>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600">
                                <AvatarFallback>{t.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.role}</p>
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
            title: "Watch algorithms come alive",
            description: "Step through every array access, pointer move, and variable change in real-time",
            icon: <PlayCircle className="w-6 h-6 text-pink-400" />,
            image: "/visualizer-demo.gif",
            stats: ["30+ algorithms", "2D/1D support", "Color-coded pointers"]
        },
        code: {
            title: "Professional C++ environment",
            description: "VS Code-like editor with syntax highlighting, auto-complete, and real compilation",
            icon: <Code2 className="w-6 h-6 text-cyan-400" />,
            image: "/editor-demo.gif",
            stats: ["Judge0 integration", "Error highlighting", "Multiple tabs"]
        },
        ai: {
            title: "AI tutor in your pocket",
            description: "Get hints, explanations, and full solutions with context-aware AI assistance",
            icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
            image: "/ai-demo.gif",
            stats: ["Gemini AI", "Step-by-step", "Learning mode"]
        }
    };

    return (
        <Card className="bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 border-white/10">
            <CardContent className="p-8">
                <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
                    <TabsList className="w-full bg-white/5 border border-white/10 mb-6">
                        <TabsTrigger value="visualize" className="flex-1 gap-2">
                            <PlayCircle size={16} /> Visualize
                        </TabsTrigger>
                        <TabsTrigger value="code" className="flex-1 gap-2">
                            <Code2 size={16} /> Code
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="flex-1 gap-2">
                            <BrainCircuit size={16} /> AI Learn
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                {features[activeFeature].icon}
                                <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                            </div>
                            <p className="text-muted-foreground mb-6">{features[activeFeature].description}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {features[activeFeature].stats.map((stat, i) => (
                                    <Badge key={i} variant="outline" className="border-cyan-500/30">
                                        {stat}
                                    </Badge>
                                ))}
                            </div>
                            <Button onClick={() => navigate("/hub")} className="gap-2">
                                Try it now <ChevronRight size={16} />
                            </Button>
                        </div>
                        <div className="bg-black/40 rounded-lg p-4 border border-white/10 h-48 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Interactive demo preview</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                    <div className="text-2xl font-bold">
                        <AnimatedCounter end={5000} suffix="+" />
                    </div>
                    <p className="text-xs text-muted-foreground">Active Learners</p>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold">
                        <AnimatedCounter end={30} suffix="+" />
                    </div>
                    <p className="text-xs text-muted-foreground">DSA Problems</p>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                    <Rocket className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                    <div className="text-2xl font-bold">
                        <AnimatedCounter end={10000} suffix="+" />
                    </div>
                    <p className="text-xs text-muted-foreground">Visualizations</p>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold">
                        <AnimatedCounter end={89} suffix="%" />
                    </div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                </CardContent>
            </Card>
        </div>
    );
};

// Problem categories preview
const CategoryPreview = () => {
    const categories = [
        { name: "Arrays", count: 8, color: "from-cyan-500 to-blue-500", icon: <Layers size={20} /> },
        { name: "Dynamic Programming", count: 6, color: "from-purple-500 to-pink-500", icon: <BrainCircuit size={20} /> },
        { name: "Trees", count: 5, color: "from-green-500 to-emerald-500", icon: <GitBranch size={20} /> },
        { name: "Graphs", count: 4, color: "from-yellow-500 to-orange-500", icon: <Globe size={20} /> },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {categories.map((cat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer group">
                    <CardContent className="p-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${cat.color} mb-3 flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                            {cat.icon}
                        </div>
                        <h4 className="font-medium">{cat.name}</h4>
                        <p className="text-xs text-muted-foreground">{cat.count} problems</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Main component
export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-black">
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.18),transparent_55%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.16),transparent_55%)]" />

                {/* Animated grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="container py-10 md:py-16">
                {/* Hero section */}
                <div className="mx-auto max-w-4xl text-center relative">
                    {/* Beta badge */}
                    <Badge
                        variant="secondary"
                        className="mx-auto mb-6 w-fit bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 border-white/10 animate-pulse"
                    >
                        <Sparkles size={14} className="mr-1 text-yellow-400" />
                        New: AI-Powered Visual Learning
                    </Badge>

                    {/* Main heading */}
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 mt-16 font-[Outfit]">
                        Master DSA with{" "}
                        <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            AI
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-10">
                        Stop watching tutorials, start <span className="text-cyan-300">understanding</span>.
                        Visualize algorithms step-by-step, write real C++ code, and get AI-powered explanations.
                    </p>

                    {/* CTA buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            size="lg"
                            onClick={() => navigate("/hub")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg px-8 py-6 h-auto group text-white rounded-full font-bold shadow-[0_0_20px_rgba(192,132,252,0.4)]"
                        >
                            Start Learning Free
                            <Rocket size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/10 bg-white/5 hover:bg-white/10 text-lg px-8 py-6 h-auto rounded-full font-bold backdrop-blur-md text-white"
                            onClick={() => {
                                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            See How It Works
                            <ChevronRight size={20} className="ml-2" />
                        </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> No credit card</span>
                        <span className="flex items-center gap-1"><Shield size={14} className="text-green-400" /> Free forever</span>
                        <span className="flex items-center gap-1"><Cpu size={14} className="text-cyan-400" /> Judge0 powered</span>
                    </div>
                </div>

                {/* Stats section */}
                <Stats />

                {/* Feature showcase */}
                <div id="features" className="mt-24">
                    <FeatureShowcase />
                </div>

                {/* Category preview */}
                <div className="mt-24">
                    <div className="text-center mb-8">
                        <Badge variant="outline" className="border-cyan-500/30">Curriculum</Badge>
                        <h2 className="text-3xl font-bold mt-3 font-[Outfit]">Top 30 DSA Problems</h2>
                        <p className="text-muted-foreground mt-2">Most asked in 2025-2026 interviews</p>
                    </div>
                    <CategoryPreview />
                    <div className="text-center mt-6">
                        <Button variant="link" onClick={() => navigate("/hub")} className="text-cyan-400 font-semibold gap-1">
                            View all problems <ChevronRight size={14} className="inline" />
                        </Button>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mt-24">
                    <div className="text-center mb-8">
                        <Badge variant="outline" className="border-purple-500/30">Success Stories</Badge>
                        <h2 className="text-3xl font-bold mt-3 font-[Outfit]">Loved by learners</h2>
                        <p className="text-muted-foreground mt-2">Join 5000+ developers who leveled up</p>
                    </div>
                    <Testimonials />
                </div>

                {/* Learning path preview */}
                <div className="mt-24">
                    <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-lg rounded-2xl">
                        <CardContent className="p-8 text-center pt-10 pb-12">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                            <h2 className="text-3xl font-bold mb-3 font-[Outfit]">Ready to master DSA?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-base">
                                Join thousands of developers who've used our platform to ace their interviews.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" onClick={() => navigate("/hub")} className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold shadow-[0_0_20px_rgba(192,132,252,0.4)] text-white hover:from-purple-500 hover:to-pink-500">
                                    <BookOpen size={18} /> Browse Problems
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate("/workspace?problem=1")} className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-full font-bold backdrop-blur-md">
                                    <PlayCircle size={18} /> Try Visualizer
                                </Button>
                            </div>

                            {/* Progress preview */}
                            <div className="max-w-md mx-auto mt-10">
                                <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium">
                                    <span>Your progress</span>
                                    <span className="text-cyan-400">65% complete</span>
                                </div>
                                <Progress value={65} className="h-2 bg-gray-800" indicatorClassName="bg-gradient-to-r from-cyan-400 to-purple-500" />
                                <p className="text-xs text-muted-foreground mt-3">Continue where you left off</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="mt-24 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="text-purple-400 w-6 h-6" />
                            <span className="font-bold font-[Outfit] text-lg">DSA Visualizer</span>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground font-medium">
                            <a href="#" className="hover:text-white transition-colors">About</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
                                <Github size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
                                <Twitter size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
                                <Linkedin size={16} />
                            </Button>
                        </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-8 mb-4">
                        © 2026 DSA Visualizer. Open source and free forever.
                    </p>
                </div>
            </div>
        </div>
    );
}
