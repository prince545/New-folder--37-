import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">404 — Page not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The page you’re looking for doesn’t exist (or was moved).
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/hub">Open Learning Hub</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                <Link to="/workspace">Open Workspace</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
