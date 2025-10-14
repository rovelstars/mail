"use client";

import type React from "react";

import { useState } from "react";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  onAuthSuccess: (user: {
    email: string;
    password: string;
    name?: string;
  }) => void;
};

export function AuthForm({ onAuthSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (mode === "register" && !name)) {
      toast("Missing info", {
        description: "All fields are required.",
      });
      return;
    }
    console.log(import.meta.env);
    const endpoint = `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/accounts/${mode}`;

    const payload =
      mode === "login" ? { email, password } : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.token) {
        Cookies.set("token", data.token, { expires: 7 });
        toast("Success", {
          description: "Authentication successful.",
        });
        onAuthSuccess(data);
      } else if (data.error) {
        toast("Error", {
          description: data.error,
        });
      } else {
        toast("Unknown response", {
          description: "Unexpected server response.",
        });
      }
    } catch (err) {
      toast("Network error", {
        description: "Could not connect to server.",
      });
    }
  };

  return (
    <Card className="">
      <CardHeader className="space-y-1">
        <CardTitle className="text-balance">
          {mode === "login" ? "Login" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-pretty">
          {mode === "login"
            ? "Enter your credentials to continue."
            : "Register to start sending and receiving emails."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {mode === "register" && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="flex-1">
              {mode === "login" ? "Login" : "Register"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setMode((m) => (m === "login" ? "register" : "login"))
              }
              aria-label={
                mode === "login" ? "Switch to register" : "Switch to login"
              }
            >
              {mode === "login" ? "Register" : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
