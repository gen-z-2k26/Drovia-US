"use client";

import { useState, type FormEvent } from "react";
import { loginAdminAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin({
  storeName,
  ready,
}: {
  storeName: string;
  ready: boolean;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await loginAdminAction(password);
    } catch (submitError) {
      const digest =
        typeof submitError === "object" && submitError && "digest" in submitError
          ? String((submitError as { digest?: unknown }).digest)
          : "";
      if (digest.includes("NEXT_REDIRECT")) throw submitError;
      const message =
        submitError instanceof Error ? submitError.message : "Invalid credentials.";
      setError(message.includes("Too many") ? message : "Invalid credentials.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[380px] rounded-2xl border border-border bg-card p-8"
      >
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {storeName}
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight">Admin</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sign in to choose which payment accounts checkout uses.
        </p>
        {ready ? (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET on the server before signing in.
          </p>
        )}
      </form>
    </div>
  );
}
