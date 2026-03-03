import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play, Code2, Search, Filter, Star, TrendingUp, Clock,
  BarChart, BookOpen, Award, Target, Zap, Shield, ChevronRight,
  Sparkles, Brain, Layers, GitBranch, Hash, TrendingUp as Trending,
  Flame, GraduationCap, Lightbulb, Rocket, BookmarkPlus, Cpu
} from "lucide-react";

import problems from "../data/problems.json";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/ui/hover-card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

// Enhanced problem data with learning metrics
const enhancedProblems = problems.map(problem => ({
  ...problem,
  concepts: problem.concepts || getDefaultConcepts(problem.category),
  popularity: problem.popularity || Math.floor(Math.random() * 30) + 70, // 70-100
  learningTime: problem.learningTime || Math.floor(Math.random() * 20) + 15, // 15-35 mins
  masteryLevel: problem.masteryLevel || 0,
  prerequisites: problem.prerequisites || [],
  companies: problem.companies || getDefaultCompanies(problem.category),
  leetcodeLink: problem.leetcodeLink || `https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}`,
  youtubeTutorials: problem.youtubeTutorials || [],
  commonMistakes: problem.commonMistakes || getDefaultMistakes(problem.category),
  visualExplanation: problem.visualExplanation || false,
  hasSolution: problem.hasSolution || true
}));

// Helper functions for default data
function getDefaultConcepts(category) {
  const conceptMap = {
    "Arrays": ["Two Pointers", "Sliding Window", "Prefix Sum"],
    "Strings": ["String Manipulation", "Pattern Matching", "Parsing"],
    "Hash Table": ["HashMap", "HashSet", "Collision Resolution"],
    "Dynamic Programming": ["Memoization", "Tabulation", "State Transition"],
    "Tree": ["DFS", "BFS", "Binary Tree", "BST"],
    "Graph": ["BFS", "DFS", "Topological Sort", "Union Find"],
    "Stack": ["Monotonic Stack", "Parentheses", "Expression Evaluation"],
    "Queue": ["Deque", "Circular Queue", "Priority Queue"],
    "Heap": ["Min Heap", "Max Heap", "Heapify"],
    "Sorting": ["Quick Sort", "Merge Sort", "Counting Sort"],
    "Binary Search": ["Binary Search", "Binary Search on Answer"],
    "Recursion": ["Backtracking", "Divide and Conquer"],
    "Greedy": ["Interval Scheduling", "Huffman Coding"],
    "Math": ["Number Theory", "Combinatorics", "Geometry"],
    "Bit Manipulation": ["Bitwise Operations", "Bit Masks"]
  };
  return conceptMap[category] || ["Core Concepts", "Algorithms", "Data Structures"];
}

function getDefaultCompanies(category) {
  const companies = {
    "Arrays": ["Google", "Amazon", "Microsoft", "Meta"],
    "Strings": ["Apple", "Adobe", "Uber", "Spotify"],
    "Hash Table": ["Amazon", "Oracle", "Salesforce", "Twitter"],
    "Dynamic Programming": ["Google", "Microsoft", "Bloomberg", "Goldman Sachs"],
    "Tree": ["Amazon", "Microsoft", "LinkedIn", "VMware"],
    "Graph": ["Google", "Facebook", "Uber", "Lyft"],
    "Stack": ["Twitter", "Snapchat", "Pinterest", "Reddit"],
    "Queue": ["Apple", "Intel", "Cisco", "eBay"],
    "Heap": ["Amazon", "Microsoft", "Uber", "Yelp"],
    "Sorting": ["Google", "Apple", "Intel", "Qualcomm"]
  };
  return companies[category] || ["FAANG", "Startups", "Tech Giants"];
}

function getDefaultMistakes(category) {
  const mistakes = {
    "Arrays": ["Off-by-one errors", "Not handling empty arrays", "Index out of bounds"],
    "Strings": ["Case sensitivity", "Empty string handling", "Unicode characters"],
    "Hash Table": ["Hash collision issues", "Memory overhead", "Null key handling"],
    "Dynamic Programming": ["Wrong base cases", "Incorrect state definition", "Optimization order"],
    "Tree": ["Null node handling", "Recursion depth", "Memory leaks"],
    "Graph": ["Cycle detection", "Infinite loops", "Visited node tracking"],
    "Stack": ["Stack overflow", "Empty stack pops", "Order of operations"]
  };
  return mistakes[category] || ["Edge cases", "Complexity analysis", "Input validation"];
}

// Enhanced difficulty badge with tooltips
function DifficultyBadge({ difficulty, showTooltip = true }) {
  const badgeConfig = {
    Easy: {
      color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
      icon: <Zap size={12} className="mr-1" />,
      tooltip: "Beginner friendly. Great for learning fundamentals!"
    },
    Medium: {
      color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
      icon: <Trending size={12} className="mr-1" />,
      tooltip: "Intermediate. Requires problem-solving skills."
    },
    Hard: {
      color: "bg-red-500/15 text-red-300 border-red-500/20",
      icon: <Target size={12} className="mr-1" />,
      tooltip: "Advanced. Tests optimization and edge cases."
    }
  };

  const config = badgeConfig[difficulty] || badgeConfig.Medium;

  const badge = (
    <Badge className={`${config.color} flex items-center`}>
      {config.icon}
      {difficulty}
    </Badge>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{badge}</TooltipTrigger>
          <TooltipContent>
            <p>{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

// Category icon mapping
const CategoryIcon = ({ category }) => {
  const iconMap = {
    "Arrays": <Layers size={16} />,
    "Strings": <Hash size={16} />,
    "Hash Table": <BookOpen size={16} />,
    "Dynamic Programming": <Brain size={16} />,
    "Tree": <GitBranch size={16} />,
    "Graph": <GitBranch size={16} />,
    "Stack": <Layers size={16} />,
    "Queue": <Layers size={16} />,
    "Heap": <BarChart size={16} />,
    "Sorting": <BarChart size={16} />,
    "Binary Search": <Search size={16} />,
    "Recursion": <GitBranch size={16} />,
    "Greedy": <Zap size={16} />,
    "Math": <Brain size={16} />,
    "Bit Manipulation": <Cpu size={16} />
  };

  return iconMap[category] || <Code2 size={16} />;
};

// Learning path visualization
const LearningPath = ({ problem, userProgress }) => {
  const prerequisites = problem.prerequisites || [];
  const nextProblems = problem.nextProblems || [];

  return (
    <div className="space-y-2">
      {prerequisites.length > 0 && (
        <div className="text-xs">
          <span className="text-muted-foreground">Prerequisites:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {prerequisites.map(pre => (
              <Badge key={pre} variant="outline" className="text-[10px] border-purple-500/30">
                {pre}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {userProgress?.masteryLevel > 70 && nextProblems.length > 0 && (
        <div className="text-xs">
          <span className="text-muted-foreground">Next in path:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {nextProblems.map(next => (
              <Badge key={next} variant="outline" className="text-[10px] border-green-500/30">
                {next}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Company tag component
const CompanyTags = ({ companies }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {companies.slice(0, 3).map(company => (
        <Badge key={company} variant="outline" className="text-[10px] border-cyan-500/30">
          {company}
        </Badge>
      ))}
      {companies.length > 3 && (
        <Badge variant="outline" className="text-[10px] border-cyan-500/30">
          +{companies.length - 3}
        </Badge>
      )}
    </div>
  );
};

// Mastery progress component
const MasteryProgress = ({ level, onUpdate }) => {
  const getMasteryColor = (level) => {
    if (level < 30) return "bg-red-500";
    if (level < 60) return "bg-yellow-500";
    if (level < 80) return "bg-green-500";
    return "bg-purple-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Mastery</span>
        <span className="font-mono">{level}%</span>
      </div>
      <Progress value={level} className="h-1" indicatorClassName={getMasteryColor(level)} />
    </div>
  );
};

// Stats card component
const StatsCard = ({ icon, label, value, tooltip }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {icon}
          <span>{label}:</span>
          <span className="text-foreground font-medium">{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Main component
export default function LearningHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorite_problems");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem("user_progress");
    return saved ? JSON.parse(saved) : {};
  });
  const [learningMode, setLearningMode] = useState("explore");
  const [experience, setExperience] = useState(() => {
    const saved = localStorage.getItem("user_xp");
    return saved ? parseInt(saved) : 0;
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(enhancedProblems.map(p => p.category))];
    return cats;
  }, []);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let filtered = enhancedProblems;

    // Search filter
    if (search) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        p.concepts?.some(c => c.toLowerCase().includes(q))
      );
    }

    // Difficulty filter
    if (difficulty !== "all") {
      filtered = filtered.filter(p => p.difficulty === difficulty);
    }

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter(p => p.category === category);
    }

    // Favorites filter
    if (showFavorites) {
      filtered = filtered.filter(p => favorites.has(p.id));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "difficulty":
          const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        case "learningTime":
          return (a.learningTime || 0) - (b.learningTime || 0);
        case "mastery":
          return (userProgress[b.id]?.masteryLevel || 0) - (userProgress[a.id]?.masteryLevel || 0);
        default:
          return a.id - b.id;
      }
    });

    return filtered;
  }, [search, difficulty, category, sortBy, showFavorites, favorites, userProgress]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorite_problems", JSON.stringify([...favorites]));
  }, [favorites]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("user_progress", JSON.stringify(userProgress));
  }, [userProgress]);

  // Save XP to localStorage
  useEffect(() => {
    localStorage.setItem("user_xp", experience.toString());
  }, [experience]);

  // Toggle favorite
  const toggleFavorite = (problemId) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(problemId)) {
        newFavs.delete(problemId);
      } else {
        newFavs.add(problemId);
        // Award XP for favoriting
        setExperience(prev => prev + 5);
      }
      return newFavs;
    });
  };

  // Update mastery level
  const updateMastery = (problemId, newLevel) => {
    setUserProgress(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        masteryLevel: newLevel,
        lastPracticed: new Date().toISOString()
      }
    }));
    // Award XP for progress
    setExperience(prev => prev + 2);
  };

  // Get user level based on XP
  const getUserLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  // Get next level XP
  const getNextLevelXP = (xp) => {
    return (Math.floor(xp / 100) + 1) * 100;
  };

  const userLevel = getUserLevel(experience);
  const nextLevelXP = getNextLevelXP(experience);
  const xpProgress = (experience % 100) / 100 * 100;

  // Learning mode suggestions
  const getSuggestions = () => {
    if (userLevel === 1) {
      return enhancedProblems.filter(p => p.difficulty === "Easy").slice(0, 3);
    }
    if (experience > 500) {
      return enhancedProblems.filter(p => p.difficulty === "Hard").slice(0, 3);
    }
    return enhancedProblems.filter(p => !userProgress[p.id]?.masteryLevel).slice(0, 3);
  };

  const suggestions = useMemo(getSuggestions, [userLevel, experience, userProgress]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container py-8">
        {/* Header with user stats */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              DSA Learning Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Master 30 essential concepts with AI-powered visualization
            </p>
          </div>

          {/* User progress card */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600">
                  <AvatarFallback>LVL{userLevel}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Level {userLevel} Coder</span>
                    <Badge variant="outline" className="border-yellow-500/30">
                      <Flame size={12} className="mr-1 text-yellow-400" />
                      {experience} XP
                    </Badge>
                  </div>
                  <Progress value={xpProgress} className="h-1.5 w-40" />
                  <p className="text-xs text-muted-foreground">
                    {nextLevelXP - experience} XP to next level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning mode toggle */}
        <div className="mb-6 flex items-center justify-between">
          <Tabs value={learningMode} onValueChange={setLearningMode} className="w-full">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="explore" className="gap-2">
                <Search size={14} /> Explore
              </TabsTrigger>
              <TabsTrigger value="learn" className="gap-2">
                <GraduationCap size={14} /> Learning Path
              </TabsTrigger>
              <TabsTrigger value="practice" className="gap-2">
                <Target size={14} /> Practice Mode
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Switch
              checked={showFavorites}
              onCheckedChange={setShowFavorites}
              id="favorites-mode"
            />
            <label htmlFor="favorites-mode" className="text-sm cursor-pointer">
              {showFavorites ? "❤️ Favorites" : "All Problems"}
            </label>
          </div>
        </div>

        {/* Learning path suggestions */}
        {learningMode === "learn" && suggestions.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Rocket size={16} className="text-cyan-400" />
                Recommended for you
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.map(problem => (
                  <div key={problem.id} className="flex items-center gap-2">
                    <Badge variant="outline" className="border-cyan-500/30">
                      #{problem.id}
                    </Badge>
                    <span className="text-sm flex-1">{problem.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/workspace?problem=${problem.id}`)}
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, category, concept..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                  <Filter size={14} className="mr-2" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                  <BookOpen size={14} className="mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                  <BarChart size={14} className="mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="learningTime">Learning Time</SelectItem>
                  <SelectItem value="mastery">Mastery Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters display */}
          <div className="flex flex-wrap gap-2">
            {difficulty !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Difficulty: {difficulty}
                <button onClick={() => setDifficulty("all")} className="ml-1 hover:text-red-400">×</button>
              </Badge>
            )}
            {category !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {category}
                <button onClick={() => setCategory("all")} className="ml-1 hover:text-red-400">×</button>
              </Badge>
            )}
            {search && (
              <Badge variant="secondary" className="gap-1">
                Search: "{search}"
                <button onClick={() => setSearch("")} className="ml-1 hover:text-red-400">×</button>
              </Badge>
            )}
          </div>
        </div>

        {/* Problems grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <HoverCard key={problem.id} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Card className="bg-white/5 border-white/10 hover:border-cyan-400/30 transition-all hover:shadow-lg hover:shadow-cyan-500/5 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CategoryIcon category={problem.category} />
                          <span className="text-xs text-muted-foreground">{problem.category}</span>
                        </div>
                        <CardTitle className="text-base leading-snug flex items-center gap-2">
                          <span className="text-cyan-300 font-mono">#{problem.id}</span>
                          <span className="truncate">{problem.title}</span>
                        </CardTitle>
                      </div>
                      <div className="flex items-start gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(problem.id);
                          }}
                        >
                          <Star
                            size={14}
                            className={favorites.has(problem.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                          />
                        </Button>
                        <DifficultyBadge difficulty={problem.difficulty} />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <StatsCard
                        icon={<TrendingUp size={12} />}
                        label="Popular"
                        value={`${problem.popularity}%`}
                        tooltip="How often this problem appears in interviews"
                      />
                      <StatsCard
                        icon={<Clock size={12} />}
                        label="Est. time"
                        value={`${problem.learningTime}m`}
                        tooltip="Average time to understand and solve"
                      />
                      {userProgress[problem.id]?.masteryLevel && (
                        <StatsCard
                          icon={<Brain size={12} />}
                          label="Mastery"
                          value={`${userProgress[problem.id].masteryLevel}%`}
                          tooltip="Your current mastery level"
                        />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-3">
                    <CardDescription className="text-xs italic mb-3 line-clamp-2">
                      “{problem.note}”
                    </CardDescription>

                    {/* Concepts chips */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {problem.concepts.slice(0, 3).map(concept => (
                        <Badge key={concept} variant="outline" className="text-[10px] border-purple-500/30">
                          {concept}
                        </Badge>
                      ))}
                      {problem.concepts.length > 3 && (
                        <Badge variant="outline" className="text-[10px] border-purple-500/30">
                          +{problem.concepts.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Company tags */}
                    <CompanyTags companies={problem.companies} />

                    {/* Learning path */}
                    <LearningPath problem={problem} userProgress={userProgress[problem.id]} />
                  </CardContent>

                  <CardFooter className="pt-0 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10"
                      onClick={() => navigate(`/workspace?problem=${problem.id}`)}
                    >
                      <Code2 size={14} className="mr-1" />
                      Code
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                      onClick={() => navigate(`/workspace?problem=${problem.id}&tab=visualizer`)}
                    >
                      <Play size={14} className="mr-1" />
                      Visualize
                    </Button>
                    {problem.visualExplanation && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Sparkles size={14} className="text-yellow-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Has visual explanation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardFooter>

                  {/* Mastery slider for practice mode */}
                  {learningMode === "practice" && (
                    <div className="px-6 pb-4">
                      <Slider
                        value={[userProgress[problem.id]?.masteryLevel || 0]}
                        onValueChange={([value]) => updateMastery(problem.id, value)}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  )}
                </Card>
              </HoverCardTrigger>

              <HoverCardContent className="w-80 bg-slate-800 border-white/10">
                <div className="space-y-3">
                  <h4 className="font-semibold">{problem.title}</h4>

                  {/* Key concepts */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Key Concepts:</p>
                    <div className="flex flex-wrap gap-1">
                      {problem.concepts.map(concept => (
                        <Badge key={concept} variant="secondary" className="text-[10px]">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Common mistakes */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Common Mistakes:</p>
                    <ul className="text-xs list-disc list-inside">
                      {problem.commonMistakes.slice(0, 3).map(mistake => (
                        <li key={mistake} className="text-red-400/80">{mistake}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Learning resources */}
                  <div className="flex gap-2 text-xs">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={problem.leetcodeLink} target="_blank" rel="noopener noreferrer">
                        LeetCode
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Tutorial
                    </Button>
                  </div>

                  {/* Practice stats */}
                  {userProgress[problem.id] && (
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <p className="text-xs text-muted-foreground">
                        Last practiced: {new Date(userProgress[problem.id].lastPracticed).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>

        {/* Empty state */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No problems found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setDifficulty("all");
                setCategory("all");
                setShowFavorites(false);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination or load more */}
        {filteredProblems.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredProblems.length} of {enhancedProblems.length} problems
          </div>
        )}
      </div>
    </div>
  );
}
