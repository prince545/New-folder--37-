import React from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Code, Sparkles } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

function NavButton({ to, icon: Icon, children }) {
  return (
    <NavLink to={to} className="block">
      {({ isActive }) => (
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "justify-start",
            isActive && "border border-border/60 bg-secondary/80"
          )}
        >
          <Icon className="mr-2" />
          {children}
        </Button>
      )}
    </NavLink>
  );
}

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400/20 to-purple-500/20 ring-1 ring-white/10">
            <Sparkles className="text-cyan-300" />
          </span>
          <span className="font-semibold tracking-tight">
            AI DSA{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Visualizer
            </span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-2">
          <NavButton to="/" icon={Sparkles}>
            Home
          </NavButton>
          <NavButton to="/hub" icon={BookOpen}>
            Learning Hub
          </NavButton>
          <NavButton to="/workspace" icon={Code}>
            Workspace
          </NavButton>
        </nav>
      </div>
    </header>
  );
}

