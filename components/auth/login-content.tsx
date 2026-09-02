"use client";

import Link from "next/link";

import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { EmailLoginForm } from "@/components/auth/email-login-form";

export function LoginContent() {
  return (
    <div className="w-full max-w-md rounded-2xl border bg-background/70 backdrop-blur-sm shadow-lg p-6 space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
          Welcome back
        </p>
        <h1 className="text-2xl font-semibold">Sign in to continue</h1>
        <p className="text-sm text-muted-foreground">
          Choose your preferred sign-in method.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <SocialLoginButtons />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <EmailLoginForm />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        By signing in you agree to our
        <Link href="/about" className="font-medium text-foreground underline">
          {" "}
          terms
        </Link>
        .
      </p>
    </div>
  );
}