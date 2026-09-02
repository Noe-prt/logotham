"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LogoConfig } from "@/lib/logo-types";
import {
  BorderSection,
  ColorSection,
  ContainerSection,
  IconSection,
  ShadowSection,
  TextSection,
} from "./sidebar/index";

export type SidebarTab = "icon" | "text" | "color" | "container" | "effects";

interface LogoSidebarProps {
  config: LogoConfig;
  updateConfig: (partial: Partial<LogoConfig>, saveHistory?: boolean) => void;
  saveHistorySnapshot: () => void;
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
  activeTab?: SidebarTab;
  onTabChange?: (tab: SidebarTab) => void;
}

export function LogoSidebar({
  config,
  updateConfig,
  saveHistorySnapshot,
  activeLayerId,
  setActiveLayerId,
  activeTab,
  onTabChange,
}: LogoSidebarProps) {
  // Use internal state if not controlled
  const [internalTab, setInternalTab] = React.useState<SidebarTab>("icon");
  const currentTab = activeTab ?? internalTab;

  const handleTabChange = (value: string) => {
    const tab = value as SidebarTab;
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  return (
    <div className="w-full flex flex-col overflow-hidden bg-background h-full pb-5">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2">
          <TabsList className="w-full flex items-center">
            <TabsTrigger value="icon" className="flex-1 text-xs px-2">
              Icon
            </TabsTrigger>
            <Separator orientation="vertical" className="h-5 mx-0.5" />
            <TabsTrigger value="text" className="flex-1 text-xs px-2">
              Text
            </TabsTrigger>
            <Separator orientation="vertical" className="h-5 mx-0.5" />
            <TabsTrigger value="color" className="flex-1 text-xs px-2">
              Color
            </TabsTrigger>
            <Separator orientation="vertical" className="h-5 mx-0.5" />
            <TabsTrigger value="container" className="flex-1 text-xs px-2">
              Shape
            </TabsTrigger>
            <Separator orientation="vertical" className="h-5 mx-0.5" />
            <TabsTrigger value="effects" className="flex-1 text-xs px-2">
              Effects
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 pb-6">
            <TabsContent value="icon" className="mt-0 space-y-6">
              <IconSection
                config={config}
                updateConfig={updateConfig}
                saveHistorySnapshot={saveHistorySnapshot}
                activeLayerId={activeLayerId}
                setActiveLayerId={setActiveLayerId}
              />
            </TabsContent>

            <TabsContent value="text" className="mt-0 space-y-6">
              <TextSection
                config={config}
                updateConfig={updateConfig}
                saveHistorySnapshot={saveHistorySnapshot}
              />
            </TabsContent>

            <TabsContent value="color" className="mt-0 space-y-6">
              <ColorSection
                config={config}
                updateConfig={updateConfig}
                saveHistorySnapshot={saveHistorySnapshot}
                activeLayerId={activeLayerId}
              />
            </TabsContent>

            <TabsContent value="container" className="mt-0 space-y-6">
              <ContainerSection
                config={config}
                updateConfig={updateConfig}
                saveHistorySnapshot={saveHistorySnapshot}
              />
            </TabsContent>

            <TabsContent value="effects" className="mt-0 space-y-8">
              <div>
                <BorderSection
                  config={config}
                  updateConfig={updateConfig}
                  saveHistorySnapshot={saveHistorySnapshot}
                />
              </div>
              <div className="h-px bg-border" />
              <div>
                <ShadowSection
                  config={config}
                  updateConfig={updateConfig}
                  saveHistorySnapshot={saveHistorySnapshot}
                />
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
