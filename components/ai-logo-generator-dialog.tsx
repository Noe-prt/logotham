"use client";

import { generateLogos } from "@/app/actions/generate-logo";
import { MiniLogoPreview } from "@/components/mini-logo-preview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { LogoConfig, initialConfig } from "@/lib/logo-types";
import { cn } from "@/lib/utils";
import { IconCircleCheck, IconLoader2, IconWand } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

const SIGN_IN_REQUIRED_MESSAGE =
  "Sign in to generate AI logos with your credits.";
const AI_GENERATOR_STORAGE_KEY = "logotham:ai-generator-results";

interface AILogoGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (config: LogoConfig) => void;
}

export function AILogoGeneratorDialog({
  open,
  onOpenChange,
  onSelect,
}: AILogoGeneratorDialogProps) {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const isAuthenticated = Boolean(session?.user);
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedLogos, setGeneratedLogos] = React.useState<LogoConfig[]>([]);
  const [baseLogos, setBaseLogos] = React.useState<LogoConfig[]>([]);
  const [generationStep, setGenerationStep] = React.useState<
    "idle" | "choosing" | "designing" | "done"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fillIcons, setFillIcons] = React.useState(false);

  const applyFillToLogos = React.useCallback(
    (logos: LogoConfig[], fill: boolean) => {
      return logos.map((logo) => {
        const fillSupported = !(
          logo.iconType === "boxicons" ||
          logo.iconType === "flaticon" ||
          logo.iconType === "fontawesome"
        );

        const shouldFill = fill && fillSupported;

        return {
          ...logo,
          iconFillOpacity: shouldFill ? [100] : [0],
          iconFillColor: shouldFill ? logo.iconColor : logo.iconFillColor,
        };
      });
    },
    []
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!isAuthenticated) {
      setErrorMessage(SIGN_IN_REQUIRED_MESSAGE);
      toast.error(SIGN_IN_REQUIRED_MESSAGE);
      return;
    }

    setIsGenerating(true);
    setGeneratedLogos([]);
    setGenerationStep("choosing");
    setErrorMessage(null);

    try {
      const response = await generateLogos(prompt);

      if (!response.success) {
        throw new Error(response.error);
      }

      const fullConfigs = response.logos.map(
        (result) =>
          ({
            ...initialConfig,
            ...result,
            texts: [],
            extraIcons: [],
          } as LogoConfig)
      );

      setBaseLogos(fullConfigs);
      setGeneratedLogos(applyFillToLogos(fullConfigs, fillIcons));
    } catch (error) {
      console.error(error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (config: LogoConfig) => {
    onSelect(config);
    onOpenChange(false);
    toast.success("Logo applied!");
  };

  React.useEffect(() => {
    if (!isGenerating) {
      if (generatedLogos.length > 0) {
        setGenerationStep("done");
      } else if (generationStep !== "idle") {
        setGenerationStep("idle");
      }
      return;
    }

    if (generationStep === "choosing") {
      const timer = setTimeout(() => {
        setGenerationStep((current) =>
          isGenerating && current === "choosing" ? "designing" : current
        );
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, generatedLogos.length, generationStep]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(AI_GENERATOR_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as {
        baseLogos?: LogoConfig[];
        generatedLogos?: LogoConfig[];
        fillIcons?: boolean;
      };
      if (Array.isArray(parsed.baseLogos) && parsed.baseLogos.length > 0) {
        setBaseLogos(parsed.baseLogos);
        const initialFill = Boolean(parsed.fillIcons);
        setFillIcons(initialFill);
        const nextGenerated = parsed.generatedLogos ?? parsed.baseLogos;
        setGeneratedLogos(applyFillToLogos(nextGenerated, initialFill));
        setGenerationStep("done");
      }
    } catch (error) {
      console.warn("Failed to parse stored AI logos", error);
      window.localStorage.removeItem(AI_GENERATOR_STORAGE_KEY);
    }
  }, [applyFillToLogos]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!baseLogos.length && !generatedLogos.length) {
      window.localStorage.removeItem(AI_GENERATOR_STORAGE_KEY);
      return;
    }
    try {
      window.localStorage.setItem(
        AI_GENERATOR_STORAGE_KEY,
        JSON.stringify({
          baseLogos,
          generatedLogos,
          fillIcons,
        })
      );
    } catch (error) {
      console.warn("Failed to persist AI logos", error);
    }
  }, [baseLogos, generatedLogos, fillIcons]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(AI_GENERATOR_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as {
        baseLogos?: LogoConfig[];
        generatedLogos?: LogoConfig[];
        fillIcons?: boolean;
      };
      if (Array.isArray(parsed.baseLogos) && parsed.baseLogos.length > 0) {
        setBaseLogos(parsed.baseLogos);
        const initialFill = Boolean(parsed.fillIcons);
        setFillIcons(initialFill);
        const nextGenerated = parsed.generatedLogos ?? parsed.baseLogos;
        setGeneratedLogos(applyFillToLogos(nextGenerated, initialFill));
        setGenerationStep("done");
      }
    } catch (error) {
      console.warn("Failed to parse stored AI logos", error);
      window.localStorage.removeItem(AI_GENERATOR_STORAGE_KEY);
    }
  }, [applyFillToLogos]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!baseLogos.length && !generatedLogos.length) {
      window.localStorage.removeItem(AI_GENERATOR_STORAGE_KEY);
      return;
    }
    try {
      window.localStorage.setItem(
        AI_GENERATOR_STORAGE_KEY,
        JSON.stringify({
          baseLogos,
          generatedLogos,
          fillIcons,
        })
      );
    } catch (error) {
      console.warn("Failed to persist AI logos", error);
    }
  }, [baseLogos, generatedLogos, fillIcons]);

  const progressSteps = [
    {
      key: "choosing",
      title: "Choosing icons",
      description: "Scanning the library for matching glyphs.",
    },
    {
      key: "designing",
      title: "Designing logos",
      description: "Applying your palette and layout to each icon.",
    },
  ] as const;

  const resolveStepStatus = (
    key: (typeof progressSteps)[number]["key"]
  ): "pending" | "active" | "done" => {
    if (generationStep === "idle") return "pending";
    if (generationStep === "choosing") {
      return key === "choosing" ? "active" : "pending";
    }
    if (generationStep === "designing") {
      if (key === "choosing") return "done";
      return "active";
    }
    if (generationStep === "done") {
      return "done";
    }
    return "pending";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-5 max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            AI Logo Generator
          </DialogTitle>
          <DialogDescription>
            Describe your logo idea, and our AI will generate 3 unique concepts
            using the app&apos;s icon library.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4 overflow-y-auto">
          {errorMessage ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-destructive">
                  {errorMessage}
                </p>
                <p className="text-xs text-muted-foreground">
                  Each AI prompt costs one credit. Upgrade for more headroom.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {errorMessage.toLowerCase().includes("sign in") ? (
                  <Button asChild size="sm">
                    <Link href="/login">Sign in</Link>
                  </Button>
                ) : null}
                {errorMessage.toLowerCase().includes("credit") &&
                !errorMessage.toLowerCase().includes("sign in") ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/settings">Upgrade plan</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {!errorMessage && !isSessionLoading && !isAuthenticated ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-4 space-y-2">
              <p className="text-sm font-medium text-amber-900">
                Sign in to generate AI logos
              </p>
              <p className="text-xs text-amber-800">
                You need an account with credits before running the AI
                generator.
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link href="/login">Go to login</Link>
              </Button>
            </div>
          ) : null}

          <form
            onSubmit={handleGenerate}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="prompt" className="sr-only">
                Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="E.g., A minimalist fox head, orange gradient, dark background..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                className="min-h-[100px] resize-none"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isGenerating || !prompt.trim() || !isAuthenticated}
              className={cn(
                "h-12 px-6 sm:w-auto w-full border-0 text-primary-foreground shadow-[0_15px_45px_rgba(247,189,0,0.35)] transition duration-200",
                "bg-gradient-to-r from-[#ffe66d] via-[#ffd23f] to-[#ffb347]",
                "hover:brightness-105 focus-visible:ring-offset-2",
                "disabled:opacity-70"
              )}
            >
              {isGenerating ? (
                <>
                  <IconLoader2
                    className="mr-2 h-4 w-4 animate-spin"
                    stroke={1.7}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <IconWand className="mr-2 h-4 w-4" stroke={1.7} />
                  Generate
                </>
              )}
            </Button>
          </form>

          {(generationStep === "choosing" ||
            generationStep === "designing") && (
            <div className="rounded-xl border bg-muted/40 p-4 space-y-4 animate-in fade-in">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                AI progress
              </p>
              <div className="space-y-3">
                {progressSteps.map((step) => {
                  const status = resolveStepStatus(step.key);
                  return (
                    <div key={step.key} className="flex items-start gap-3">
                      <div className="mt-1">
                        {status === "done" ? (
                          <IconCircleCheck
                            className="h-4 w-4 text-emerald-500"
                            stroke={1.7}
                          />
                        ) : status === "active" ? (
                          <IconLoader2
                            className="h-4 w-4 animate-spin text-primary"
                            stroke={1.7}
                          />
                        ) : (
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {generatedLogos.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {generatedLogos.map((logo, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors overflow-hidden cursor-pointer"
                    onClick={() => handleSelect(logo)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <MiniLogoPreview config={logo} size={180} />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-background/90 text-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        Click to Edit
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground border rounded-xl px-3 py-2">
                <Checkbox
                  checked={fillIcons}
                  onCheckedChange={(value) => {
                    const next = Boolean(value);
                    setFillIcons(next);
            setGeneratedLogos(applyFillToLogos(baseLogos, next));
            if (typeof window !== "undefined") {
              try {
                window.localStorage.setItem(
                  AI_GENERATOR_STORAGE_KEY,
                  JSON.stringify({
                    baseLogos,
                    generatedLogos: applyFillToLogos(baseLogos, next),
                    fillIcons: next,
                  })
                );
              } catch (error) {
                console.warn("Failed to persist AI logos", error);
              }
            }
          }}
        />
                Fill icons with color
              </label>
            </>
          )}

          {generatedLogos.length === 0 && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
              <p className="text-sm">Enter a prompt above to get started.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function extractErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Failed to generate logos. Please try again.";
}
