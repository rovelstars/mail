"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type User = {
  email: string;
  password: string;
  name?: string;
};

export function SettingsDialog({
  open,
  onOpenChange,
  onSaved,
  userData,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
  userData: User | null;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [encryptionLevel, setEncryptionLevel] = useState(1);

  useEffect(() => {
    console.log("Skibidi", userData);
    if (!open) return;
    if (userData) {
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email);
    }
  }, [open, userData]);

  const handleSave = () => {
    if (!user) return;
    const next: User = { ...user, name, email };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    // If email changed, refresh session
    localStorage.setItem(SESSION_KEY, next.email);
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
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
          <div className="grid gap-2 my-8">
            <Label htmlFor="labels-range-input">Level of Encryption</Label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[encryptionLevel]}
              onValueChange={(v) => setEncryptionLevel(v[0])}
              id="labels-range-input"
            />
            <div className="flex flex-row justify-between text-xs px-1 select-none">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              {encryptionLevel === 1 && "Quantum Secure (One Time Pad)"}
              {encryptionLevel === 2 && "Quantum-aided AES"}
              {encryptionLevel === 3 && "Post-Quantum Cryptography"}
              {encryptionLevel === 4 && "Classical Encryption (AES)"}
              {encryptionLevel === 5 && "No Encryption (Plaintext)"}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
