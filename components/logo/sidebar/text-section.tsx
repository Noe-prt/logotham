"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildLinearGradientCss } from "@/lib/color-utils";
import { googleFonts } from "@/lib/fonts";
import { LogoText } from "@/lib/logo-types";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { SidebarSectionProps, getValue } from "./types";

export function TextSection({
  config,
  updateConfig,
  saveHistorySnapshot,
}: SidebarSectionProps) {
  const maxTextOffset = React.useMemo(
    () => Math.round(getValue(config.size) / 2),
    [config.size]
  );
  const [openTextId, setOpenTextId] = React.useState<string | null>(
    config.texts?.[0]?.id ?? null
  );

  React.useEffect(() => {
    if (!openTextId) {
      return;
    }
    const exists = config.texts?.some((text) => text.id === openTextId);
    if (!exists) {
      setOpenTextId(config.texts?.[0]?.id ?? null);
    }
  }, [config.texts, openTextId]);

  const addText = () => {
    saveHistorySnapshot();
    const newText: LogoText = {
      id: Date.now().toString(),
      text: "Brand",
      x: 0,
      y: 80,
      fontSize: 128,
      color: config.iconColor,
      colorMode: "solid",
      gradientStart: config.iconColor,
      gradientEnd: config.iconColor,
      gradientAngle: 90,
      fontWeight: "700",
      fontFamily: "Inter",
    };
    updateConfig({ texts: [...(config.texts || []), newText] });
    setOpenTextId(newText.id);
  };

  const updateText = (id: string, partial: Partial<LogoText>) => {
    const newTexts = config.texts?.map((t) =>
      t.id === id ? { ...t, ...partial } : t
    );
    updateConfig({ texts: newTexts });
  };

  const removeText = (id: string) => {
    saveHistorySnapshot();
    const newTexts = config.texts?.filter((t) => t.id !== id);
    updateConfig({ texts: newTexts });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
          Text Elements
        </Label>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1"
          onClick={addText}
        >
          <Plus className="size-3" />
          Add Text
        </Button>
      </div>

      <div className="space-y-6">
        {config.texts?.map((textItem) => {
          const isOpen = openTextId === textItem.id;
          return (
            <Collapsible
              key={textItem.id}
              open={isOpen}
              onOpenChange={(open) => setOpenTextId(open ? textItem.id : null)}
            >
              <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-start gap-2">
                  <CollapsibleTrigger className="flex flex-1 items-center justify-between rounded-md px-2 py-1 text-left transition hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium line-clamp-1">
                        {textItem.text || "Text"}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {textItem.fontFamily} · {Math.round(textItem.fontSize)}
                        px
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isOpen ? "-rotate-180" : "rotate-0"
                      )}
                      aria-hidden="true"
                    />
                  </CollapsibleTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeText(textItem.id)}
                  >
                    <Trash2 className="size-3" />
                    <span className="sr-only">Remove text</span>
                  </Button>
                </div>

                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Content
                    </Label>
                    <Input
                      value={textItem.text}
                      onChange={(e) =>
                        updateText(textItem.id, { text: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Font
                    </Label>
                    <Select
                      value={textItem.fontFamily}
                      onValueChange={(val) =>
                        val && updateText(textItem.id, { fontFamily: val })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {googleFonts.map((font) => (
                          <SelectItem
                            key={font}
                            value={font}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Color
                        </Label>
                        <Tabs
                          value={textItem.colorMode ?? "solid"}
                          onValueChange={(mode) => {
                            saveHistorySnapshot();
                            updateText(textItem.id, {
                              colorMode: mode as LogoText["colorMode"],
                            });
                          }}
                          className="w-28"
                        >
                          <TabsList className="grid grid-cols-2 h-7">
                            <TabsTrigger value="solid" className="text-[10px]">
                              Solid
                            </TabsTrigger>
                            <TabsTrigger
                              value="gradient"
                              className="text-[10px]"
                            >
                              Gradient
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      {(textItem.colorMode ?? "solid") === "solid" ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="relative size-8 cursor-pointer overflow-hidden rounded-md border shadow-sm"
                            onClick={saveHistorySnapshot}
                          >
                            <input
                              type="color"
                              value={textItem.color}
                              onChange={(e) =>
                                updateText(textItem.id, {
                                  color: e.target.value,
                                })
                              }
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{ backgroundColor: textItem.color }}
                            />
                          </div>
                          <Input
                            value={textItem.color}
                            onChange={(e) =>
                              updateText(textItem.id, { color: e.target.value })
                            }
                            className="h-8 font-mono uppercase text-[10px] px-2"
                            maxLength={7}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="relative size-8 cursor-pointer overflow-hidden rounded-md border shadow-sm"
                              onClick={saveHistorySnapshot}
                            >
                              <input
                                type="color"
                                value={textItem.gradientStart ?? textItem.color}
                                onChange={(e) =>
                                  updateText(textItem.id, {
                                    gradientStart: e.target.value,
                                  })
                                }
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              />
                              <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  backgroundColor:
                                    textItem.gradientStart ?? textItem.color,
                                }}
                              />
                            </div>
                            <div
                              className="relative size-8 cursor-pointer overflow-hidden rounded-md border shadow-sm"
                              onClick={saveHistorySnapshot}
                            >
                              <input
                                type="color"
                                value={textItem.gradientEnd ?? textItem.color}
                                onChange={(e) =>
                                  updateText(textItem.id, {
                                    gradientEnd: e.target.value,
                                  })
                                }
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              />
                              <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  backgroundColor:
                                    textItem.gradientEnd ?? textItem.color,
                                }}
                              />
                            </div>
                            <div
                              className="h-8 flex-1 rounded border"
                              style={{
                                backgroundImage: buildLinearGradientCss(
                                  textItem.gradientStart ?? textItem.color,
                                  textItem.gradientEnd ?? textItem.color,
                                  textItem.gradientAngle ?? 90
                                ),
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Angle</span>
                              <span>
                                {Math.round(textItem.gradientAngle ?? 90)}°
                              </span>
                            </div>
                            <div onPointerDown={saveHistorySnapshot}>
                              <Slider
                                value={[textItem.gradientAngle ?? 90]}
                                onValueChange={(v) =>
                                  updateText(textItem.id, {
                                    gradientAngle: Array.isArray(v) ? v[0] : v,
                                  })
                                }
                                min={0}
                                max={360}
                                step={1}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-xs text-muted-foreground">
                        Weight
                      </Label>
                      <Select
                        value={textItem.fontWeight}
                        onValueChange={(val) =>
                          val && updateText(textItem.id, { fontWeight: val })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="400">Regular</SelectItem>
                          <SelectItem value="500">Medium</SelectItem>
                          <SelectItem value="600">Semibold</SelectItem>
                          <SelectItem value="700">Bold</SelectItem>
                          <SelectItem value="800">Extra Bold</SelectItem>
                          <SelectItem value="900">Black</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Size
                      </Label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {textItem.fontSize}px
                      </span>
                    </div>
                    <div onPointerDown={saveHistorySnapshot}>
                      <Slider
                        value={[textItem.fontSize]}
                        onValueChange={(v) =>
                          updateText(textItem.id, {
                            fontSize: Array.isArray(v) ? v[0] : v,
                          })
                        }
                        min={8}
                        max={360}
                        step={1}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Spacing
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
                          {textItem.letterSpacing ?? 0}px
                        </span>
                      </div>
                      <div onPointerDown={saveHistorySnapshot}>
                        <Slider
                          value={[textItem.letterSpacing ?? 0]}
                          onValueChange={(v) =>
                            updateText(textItem.id, {
                              letterSpacing: Array.isArray(v) ? v[0] : v,
                            })
                          }
                          min={-10}
                          max={20}
                          step={0.5}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Line Height
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
                          {textItem.lineHeight ?? 1}
                        </span>
                      </div>
                      <div onPointerDown={saveHistorySnapshot}>
                        <Slider
                          value={[textItem.lineHeight ?? 1]}
                          onValueChange={(v) =>
                            updateText(textItem.id, {
                              lineHeight: Array.isArray(v) ? v[0] : v,
                            })
                          }
                          min={0.5}
                          max={3}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Outline
                      </Label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {textItem.textOutlineWidth ?? 0}px
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div
                        className="relative size-8 rounded-md overflow-hidden border shadow-sm cursor-pointer shrink-0"
                        onClick={saveHistorySnapshot}
                      >
                        <input
                          type="color"
                          value={textItem.textOutlineColor ?? "#000000"}
                          onChange={(e) =>
                            updateText(textItem.id, {
                              textOutlineColor: e.target.value,
                            })
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundColor:
                              textItem.textOutlineColor ?? "#000000",
                          }}
                        />
                      </div>
                      <div
                        className="flex-1 pt-1"
                        onPointerDown={saveHistorySnapshot}
                      >
                        <Slider
                          value={[textItem.textOutlineWidth ?? 0]}
                          onValueChange={(v) =>
                            updateText(textItem.id, {
                              textOutlineWidth: Array.isArray(v) ? v[0] : v,
                            })
                          }
                          min={0}
                          max={10}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Curved Text
                      </Label>
                      <Switch
                        checked={textItem.curved ?? false}
                        onCheckedChange={(c) => {
                          saveHistorySnapshot();
                          updateText(textItem.id, {
                            curved: c,
                            curveRadius: textItem.curveRadius ?? 200,
                          });
                        }}
                      />
                    </div>
                    {textItem.curved && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex justify-between">
                          <Label className="text-xs text-muted-foreground">
                            Radius
                          </Label>
                          <span className="text-xs font-mono text-muted-foreground">
                            {textItem.curveRadius ?? 200}px
                          </span>
                        </div>
                        <div onPointerDown={saveHistorySnapshot}>
                          <Slider
                            value={[textItem.curveRadius ?? 200]}
                            onValueChange={(v) =>
                              updateText(textItem.id, {
                                curveRadius: Array.isArray(v) ? v[0] : v,
                              })
                            }
                            min={50}
                            max={500}
                            step={10}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <Label className="text-xs text-muted-foreground">
                            Invert Curve
                          </Label>
                          <Switch
                            checked={textItem.curveInverted ?? false}
                            onCheckedChange={(c) => {
                              saveHistorySnapshot();
                              updateText(textItem.id, {
                                curveInverted: c,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-2 border-t border-border/50">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Horizontal offset
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
                          {Math.round(textItem.x)}px
                        </span>
                      </div>
                      <div onPointerDown={saveHistorySnapshot}>
                        <Slider
                          value={[textItem.x]}
                          onValueChange={(v) =>
                            updateText(textItem.id, {
                              x: Array.isArray(v) ? v[0] : v,
                            })
                          }
                          min={-maxTextOffset}
                          max={maxTextOffset}
                          step={1}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Text baseline
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
                          {Math.round(textItem.y)}px
                        </span>
                      </div>
                      <div onPointerDown={saveHistorySnapshot}>
                        <Slider
                          value={[textItem.y]}
                          onValueChange={(v) =>
                            updateText(textItem.id, {
                              y: Array.isArray(v) ? v[0] : v,
                            })
                          }
                          min={-maxTextOffset}
                          max={maxTextOffset}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    Use these sliders (or drag text on the canvas) to fine-tune placement.
                  </p>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
        {(!config.texts || config.texts.length === 0) && (
          <div className="text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            No text elements added yet.
          </div>
        )}
      </div>
    </section>
  );
}
