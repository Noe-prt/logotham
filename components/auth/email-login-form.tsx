"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function EmailLoginForm() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL: "/",
      });

      if (error) {
        console.error("Email sign in error:", error);
        toast.error(error.message || "Failed to send magic link");
        return;
      }

      toast.success("Magic link sent! Check your email.");
    } catch (err) {
      console.error("Email sign in error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          required
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">
          We&apos;ll send you a magic link to sign in. No password required.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !email.trim()}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending magic link…
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send magic link
          </>
        )}
      </Button>
    </form>
  );
}