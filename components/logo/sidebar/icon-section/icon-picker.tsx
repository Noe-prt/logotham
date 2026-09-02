"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { type IconOption } from "@/lib/logo-types";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { IconPreview, LibraryFilter } from "./helpers";

export interface IconPickerProps {
  isPickerOpen: boolean;
  setIsPickerOpen: (open: boolean) => void;
  selectedLibrary: LibraryFilter;
  setSelectedLibrary: (library: LibraryFilter) => void;
  pickerSearch: string;
  setPickerSearch: (search: string) => void;
  filteredIcons: IconOption[];
  visibleIcons: IconOption[];
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  currentIconType: string;
  currentIconName: string;
  currentIconLabel: string;
  handleIconSelect: (icon: IconOption) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function IconPicker({
  isPickerOpen,
  setIsPickerOpen,
  selectedLibrary,
  setSelectedLibrary,
  pickerSearch,
  setPickerSearch,
  filteredIcons,
  visibleIcons,
  handleScroll,
  currentIconType,
  currentIconName,
  currentIconLabel,
  handleIconSelect,
  handleFileUpload,
  fileInputRef,
}: IconPickerProps) {
  return (
    <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between h-10 px-3 font-normal bg-background"
        )}
      >
        <div className="flex items-center gap-2 text-left">
          <div className="h-4 w-4 flex items-center justify-center">
            <IconPreview
              type={currentIconType}
              name={currentIconName}
              className="h-4 w-4"
            />
          </div>
          <span className="truncate text-sm font-medium">
            {currentIconLabel}
          </span>
        </div>
        <SearchIcon className="h-4 w-4 opacity-50" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between p-3">
            <DialogTitle>Select Icon</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload SVG
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".svg"
              onChange={handleFileUpload}
            />
          </div>
          <DialogDescription>
            Browse {filteredIcons.length} icons from Lucide, Tabler, Hugeicons,
            Lineicons, Feather, Iconoir, Boxicons, Heroicons, Font Awesome and
            Flaticon.
          </DialogDescription>
          <Tabs
            value={selectedLibrary}
            onValueChange={(v) => setSelectedLibrary(v as LibraryFilter)}
            className="w-full pt-4"
          >
            <TabsList className="w-full flex-wrap h-auto">
              <TabsTrigger value="all" className="text-[10px] sm:text-sm px-2">All</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="lucide" className="text-[10px] sm:text-sm px-2">Lucide</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="tabler" className="text-[10px] sm:text-sm px-2">Tabler</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="hugeicons" className="text-[10px] sm:text-sm px-2">Hugeicons</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="lineicons" className="text-[10px] sm:text-sm px-2">Lineicons</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="feather" className="text-[10px] sm:text-sm px-2">Feather</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="iconoir" className="text-[10px] sm:text-sm px-2">Iconoir</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="boxicons" className="text-[10px] sm:text-sm px-2">Boxicons</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="heroicons" className="text-[10px] sm:text-sm px-2">Heroicons</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="fontawesome" className="text-[10px] sm:text-sm px-2">FontAwesome</TabsTrigger>
              <Separator orientation="vertical" className="h-6" />
              <TabsTrigger value="flaticon" className="text-[10px] sm:text-sm px-2">Flaticon</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="pt-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6" onScroll={handleScroll}>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {visibleIcons.map((icon) => {
              const isActive =
                currentIconType === icon.library &&
                currentIconName === icon.name;

              return (
                <DialogClose
                  key={`${icon.library}-${icon.name}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex flex-col gap-2 h-28 w-full hover:bg-accent hover:text-accent-foreground px-2 py-3",
                    isActive && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleIconSelect(icon)}
                >
                  <div className="flex h-10 items-center justify-center">
                    <div className="h-6 w-6 flex items-center justify-center">
                      <IconPreview
                        type={icon.library}
                        name={icon.name}
                        className="h-6 w-6"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground text-center truncate w-full">
                    {icon.label}
                  </span>
                  <span className="text-[8px] uppercase tracking-wide text-muted-foreground">
                    {icon.library === "lucide"
                      ? "Lucide"
                      : icon.library === "tabler"
                      ? "Tabler"
                      : icon.library === "hugeicons"
                      ? "Hugeicons"
                      : icon.library === "lineicons"
                      ? "Lineicons"
                      : icon.library === "feather"
                      ? "Feather"
                      : icon.library === "iconoir"
                      ? "Iconoir"
                      : icon.library === "boxicons"
                      ? "Boxicons"
                      : icon.library === "heroicons"
                      ? "Heroicons"
                      : icon.library === "fontawesome"
                      ? "Font Awesome"
                      : "Flaticon"}
                  </span>
                </DialogClose>
              );
            })}
          </div>
          {visibleIcons.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No icons found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
