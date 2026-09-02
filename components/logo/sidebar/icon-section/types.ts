import {
  LogoConfig,
  LogoExtraIcon,
} from "@/lib/logo-types";

export interface IconComponentProps {
  config: LogoConfig;
  updateConfig: (
    partial: Partial<LogoConfig>,
    saveHistory?: boolean | undefined
  ) => void;
  saveHistorySnapshot: () => void;
  activeLayerId: string;
  updateExtraIcon: (id: string, partial: Partial<LogoExtraIcon>) => void;
  currentIconType: string;
  disableCustomIconPreserve: (layerId: string) => void;
}
