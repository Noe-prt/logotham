import type { LogoConfig } from "@/lib/logo-types";

export interface SidebarSectionProps {
  config: LogoConfig;
  updateConfig: (partial: Partial<LogoConfig>, saveHistory?: boolean) => void;
  saveHistorySnapshot: () => void;
}

export const getValue = (val: number[] | number) => {
  if (Array.isArray(val)) return val[0];
  return val;
};
