"use client";

import { FeedbackDialog } from "@/components/feedback-dialog";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function FeedbackPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    let frame: number | null = null;
    frame = requestAnimationFrame(() => {
      const dismissed = localStorage.getItem("logotham-feedback-dismissed");
      if (!dismissed) {
        setIsDismissed(false);
      }
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (isDismissed) return;

    const handleInteraction = () => {
      setIsVisible(true);
      window.removeEventListener("click", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("logotham-feedback-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{
            opacity: 1,
            y: [0, -10, 0],
            scale: 1,
            transition: {
              y: {
                delay: 2,
                duration: 0.4,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 2.6,
              },
              type: "spring",
              bounce: 0.5,
            },
          }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative flex flex-col gap-3 rounded-xl border bg-popover p-4 shadow-lg shadow-black/5 dark:shadow-white/5 w-64">
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </button>

            <div className="pr-6">
              <h3 className="font-medium text-sm">Enjoying Logotham?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Help us improve by sharing your thoughts!
              </p>
            </div>

            <div className="flex gap-2">
              <FeedbackDialog onSuccess={handleDismiss}>
                <Button size="sm" className="w-full cursor-pointer">
                  Give Feedback
                </Button>
              </FeedbackDialog>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
