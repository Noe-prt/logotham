"use client";

import * as React from "react";
import { LogoConfig, initialConfig } from "@/lib/logo-types";
import {
  decodeUrlToConfig,
  encodeConfigToUrl,
  sanitizeLogoConfig,
} from "@/lib/logo-helpers";

const STORAGE_KEY = "lucide-logo-config";

export function useLogoHistory() {
  const [config, setConfig] = React.useState<LogoConfig>(() =>
    sanitizeLogoConfig(initialConfig)
  );
  const [history, setHistory] = React.useState<{
    past: LogoConfig[];
    future: LogoConfig[];
  }>({ past: [], future: [] });
  const [isLoaded, setIsLoaded] = React.useState(false);

  const saveHistorySnapshot = React.useCallback(() => {
    setHistory((h) => ({
      past: [...h.past, config],
      future: [],
    }));
  }, [config]);

  const updateConfig = React.useCallback(
    (partial: Partial<LogoConfig>, saveHistory = false) => {
      setConfig((prev) => {
        if (saveHistory) {
          setHistory((h) => ({
            past: [...h.past, prev],
            future: [],
          }));
        }
        return sanitizeLogoConfig({ ...prev, ...partial }, prev);
      });
    },
    []
  );

  const undo = React.useCallback(() => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    setHistory({
      past: newPast,
      future: [config, ...history.future],
    });
    setConfig(sanitizeLogoConfig(previous));
  }, [config, history]);

  const redo = React.useCallback(() => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);

    setHistory({
      past: [...history.past, config],
      future: newFuture,
    });
    setConfig(sanitizeLogoConfig(next));
  }, [config, history]);

  const reset = React.useCallback(() => {
    saveHistorySnapshot();
    setConfig(sanitizeLogoConfig(initialConfig));
  }, [saveHistorySnapshot]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlConfig = decodeUrlToConfig(params);

    if (Object.keys(urlConfig).length > 0) {
      setConfig(sanitizeLogoConfig({ ...initialConfig, ...urlConfig }));
      setIsLoaded(true);
      return;
    }

    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(sanitizeLogoConfig({ ...initialConfig, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

    const timeoutId = setTimeout(() => {
      const queryString = encodeConfigToUrl(config);
      const url = `${window.location.pathname}${queryString}`;
      window.history.replaceState(null, "", url);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isLoaded, config]);

  return {
    config,
    setConfig,
    updateConfig,
    saveHistorySnapshot,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    isLoaded,
  };
}
