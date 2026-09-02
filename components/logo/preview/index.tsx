"use client";

import { incrementLogoDownloadCount } from "@/app/actions/stats";
import type { ExportFormat } from "@/app/actions/exports";
import { useIsMobile } from "@/hooks/use-mobile";
import { AutoExportVariant } from "@/lib/auto-export-options";
import { ensureReadableColor } from "@/lib/color-utils";
import { pngToIco } from "@/lib/ico-utils";
import { LogoConfig } from "@/lib/logo-types";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { LogoCanvas } from "./logo-canvas";
import { LogoPreviewWorkspace } from "./logo-preview-workspace";
import { buildRenderValues } from "./render-utils";
import { LogoPreviewProps } from "./types";
import {
  cloneConfig,
  createDataUrl,
  downloadDataUrl,
  enhanceSvgWithFallback,
  getValue,
  parseDataUrl,
  prepareWebfontIconForExport,
  scaleConfigForExport,
} from "./utils";
import { createFaviconConfig } from "./favicon-utils";
import {
  applyWatermarkToPng,
  applyWatermarkToSvg,
} from "./watermark-utils";

type ExportRequestMetaOptions = {
  autoBundleVariants?: AutoExportVariant[];
};

type DownloadOptions = {
  watermark?: boolean;
};

export const LogoPreview = React.forwardRef<
  {
    handleDownload: (
      format?: "png" | "svg" | "bundle" | "brand" | "favicon" | "json",
      options?: DownloadOptions
    ) => void;
    handleAutoBundle: (
      variants: AutoExportVariant[],
      options?: DownloadOptions
    ) => Promise<void>;
    getExportRequestMeta: (
      format: ExportFormat,
      options?: ExportRequestMetaOptions
    ) => { maxDimension: number | null };
  },
  LogoPreviewProps
>(({
  config,
  onUpdateConfig,
  activeLayerId,
  onLayerSelect,
  maxExportSize,
}, ref) => {
  const isMobile = useIsMobile();
  const captureRef = React.useRef<HTMLDivElement>(null);
  const notifyDownload = React.useCallback(async () => {
    try {
      await incrementLogoDownloadCount();
    } catch (error) {
      console.error("Failed to increment logo counter", error);
    }
  }, []);

  const renderValues = React.useMemo(() => buildRenderValues(config), [config]);
  const {
    currentSize,
    currentRadius,
    backgroundStyle,
    borderStyle,
    gradientBorder,
    shadowStyle,
    iconStrokePaint,
    iconFillPaint,
    glyphPaint,
    showIconFill,
    iconLayers,
  } = renderValues;

  const handleTextMove = React.useCallback(
    (id: string, x: number, y: number) => {
      if (!onUpdateConfig) return;

      const newTexts = config.texts?.map((t) => {
        if (t.id === id) {
          return { ...t, x, y };
        }
        return t;
      });

      onUpdateConfig({ texts: newTexts });
    },
    [config.texts, onUpdateConfig]
  );

  const handleIconMove = React.useCallback(
    (x: number, y: number) => {
      if (!onUpdateConfig) return;
      onUpdateConfig({ iconPosition: { x, y } });
    },
    [onUpdateConfig]
  );

  const handleExtraIconMove = React.useCallback(
    (id: string, x: number, y: number) => {
      if (!onUpdateConfig) return;
      const layers = config.extraIcons ?? [];
      const updatedLayers = layers.map((layer) =>
        layer.id === id ? { ...layer, position: { x, y } } : layer
      );
      onUpdateConfig({ extraIcons: updatedLayers });
    },
    [config.extraIcons, onUpdateConfig]
  );

  const handleDragStart = React.useCallback(() => {
    if (onUpdateConfig) {
      onUpdateConfig({}, true);
    }
  }, [onUpdateConfig]);
  const handleDragEnd = React.useCallback(() => {
    if (onUpdateConfig) {
      onUpdateConfig({}, false);
    }
  }, [onUpdateConfig]);
  const basePreviewSize = React.useMemo(
    () => getValue(config.size),
    [config.size]
  );
  const baseExportSize = React.useMemo(
    () => getValue(config.exportSize ?? config.size),
    [config.exportSize, config.size]
  );
  const [selectedExportSize, setSelectedExportSize] =
    React.useState<number>(baseExportSize);

  React.useEffect(() => {
    setSelectedExportSize(baseExportSize);
  }, [baseExportSize]);

  React.useEffect(() => {
    if (!maxExportSize) return;
    if (selectedExportSize > maxExportSize) {
      setSelectedExportSize(maxExportSize);
      onUpdateConfig?.({ exportSize: [maxExportSize] });
    }
  }, [maxExportSize, onUpdateConfig, selectedExportSize]);

  const handleSizeChange = React.useCallback(
    (targetSize: number) => {
      setSelectedExportSize(targetSize);
      onUpdateConfig?.({ exportSize: [targetSize] });
    },
    [onUpdateConfig]
  );

  const getExportReadyConfig = React.useCallback(() => {
    if (selectedExportSize && selectedExportSize !== basePreviewSize) {
      return scaleConfigForExport(config, selectedExportSize);
    }
    return config;
  }, [config, selectedExportSize, basePreviewSize]);

  React.useEffect(() => {
    if (!config.texts?.length) return;

    const fonts = Array.from(
      new Set(config.texts.map((t) => t.fontFamily))
    ).filter(Boolean);
    if (fonts.length === 0) return;

    const fontQuery = fonts
      .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;500;700;900`)
      .join("&");
    const url = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

    let active = true;
    const fetchFonts = async () => {
      try {
        const response = await fetch(url);
        const css = await response.text();
        if (!active) return;

        const style = document.createElement("style");
        style.setAttribute("data-logotham-fonts", "true");
        style.textContent = css;
        document.head.appendChild(style);

        return () => {
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        };
      } catch (e) {
        console.error("Failed to load fonts", e);
      }
    };

    const cleanupPromise = fetchFonts();

    return () => {
      active = false;
      cleanupPromise.then((cleanup) => cleanup && cleanup());
    };
  }, [config.texts]);

  const renderExportElement = React.useCallback(
    async (targetConfig: LogoConfig) => {
      const targetValues = buildRenderValues(targetConfig);

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);

      let exportNode: HTMLDivElement | null = null;
      const root = createRoot(container);

      root.render(
        <LogoCanvas
          ref={(node) => {
            exportNode = node;
          }}
          config={targetConfig}
          {...targetValues}
        />
      );

      const resolvedNode = await (async () => {
        for (let attempt = 0; attempt < 60; attempt++) {
          await new Promise<void>((resolve) => setTimeout(resolve, 16));
          if (exportNode) {
            return exportNode;
          }
        }
        return exportNode;
      })();

      if (!resolvedNode) {
        root.unmount();
        document.body.removeChild(container);
        throw new Error("Failed to render export node");
      }

      return {
        exportElement: resolvedNode,
        renderValues: targetValues,
        cleanup: () => {
          root.unmount();
          document.body.removeChild(container);
        },
      };
    },
    []
  );

  const exportSingleAsset = React.useCallback(
    async (
      targetConfig: LogoConfig,
      targetFormat: "png" | "svg",
      options?: { pixelRatio?: number; watermark?: boolean }
    ) => {
      const { exportElement, renderValues, cleanup } =
        await renderExportElement(targetConfig);

      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready.catch(() => undefined);
        }

        if (["flaticon", "boxicons"].includes(targetConfig.iconType)) {
          prepareWebfontIconForExport(exportElement, {
            iconColor: targetConfig.iconColor,
          });
        }

        if (targetFormat === "svg") {
          const [svgDataUrl, pngFallback] = await Promise.all([
            createDataUrl("svg", exportElement, renderValues.currentSize),
            createDataUrl("png", exportElement, renderValues.currentSize),
          ]);
          let finalSvg = enhanceSvgWithFallback(
            svgDataUrl,
            pngFallback,
            renderValues.currentSize
          );
          // Apply watermark to SVG if requested
          if (options?.watermark) {
            finalSvg = applyWatermarkToSvg(finalSvg, renderValues.currentSize);
          }
          return finalSvg;
        }

        let pngDataUrl = await createDataUrl(
          "png",
          exportElement,
          renderValues.currentSize,
          { pixelRatio: options?.pixelRatio }
        );

        // Apply watermark to PNG if requested
        if (options?.watermark) {
          pngDataUrl = await applyWatermarkToPng(
            pngDataUrl,
            renderValues.currentSize
          );
        }

        return pngDataUrl;
      } finally {
        cleanup();
      }
    },
    [renderExportElement]
  );

  const buildBrandKitReadme = React.useCallback(
    (
      baseName: string,
      baseConfig: LogoConfig,
      files: { filename: string; description: string }[]
    ) => {
      const nameTitle =
        baseName
          .split("-")
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(" ") || "Logotham";

      const bgDescription =
        baseConfig.bgMode === "gradient"
          ? `Background gradient: ${baseConfig.gradientStart} -> ${
              baseConfig.gradientEnd
            } (${getValue(baseConfig.gradientAngle)}deg)`
          : `Background color: ${baseConfig.bgColor}`;

      const borderWidth = getValue(baseConfig.borderWidth);
      const borderDescription =
        borderWidth > 0
          ? baseConfig.borderColorMode === "gradient"
            ? `Border: ${borderWidth}px gradient ${
                baseConfig.borderGradientStart
              } -> ${baseConfig.borderGradientEnd} (${getValue(
                baseConfig.borderGradientAngle ?? [90]
              )}deg)`
            : `Border: ${borderWidth}px solid ${baseConfig.borderColor}`
          : "Border: none";

      const shadowDescription = baseConfig.shadowEnabled
        ? `Shadow: ${baseConfig.shadowColor}, blur ${getValue(
            baseConfig.shadowBlur
          )}px, opacity ${Math.round(
            getValue(baseConfig.shadowOpacity) * 100
          )}%`
        : "Shadow: none";

      const readmeLines = [
        `# ${nameTitle} Brand Kit`,
        "",
        `Generated with Logotham on ${new Date().toLocaleDateString()}.`,
        "",
        "## Colors",
        bgDescription,
        `Icon color: ${baseConfig.iconColor}`,
        borderDescription,
        shadowDescription,
        "",
        "## Files",
        ...files.map((file) => `- ${file.filename} - ${file.description}`),
        "",
        "## Tips",
        "- Use the SVG for infinite scaling and print outputs.",
        "- Use the large PNGs (1024px) when dropping into pitch decks or hero sections.",
        "- The avatar/favicon PNG is perfect for social icons or app favicons.",
      ];

      return readmeLines.join("\n");
    },
    []
  );

  const handleDownload = React.useCallback(
    async (
      format: "png" | "svg" | "bundle" | "brand" | "favicon" | "json" = "png",
      options?: DownloadOptions
    ) => {
      if (captureRef.current === null) {
        return;
      }

      const exportConfig = getExportReadyConfig();
      const fileBase = exportConfig.iconName.toLowerCase().replace(/\s+/g, "-");
      const shouldWatermark = options?.watermark ?? false;
      void notifyDownload();

      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (format === "json") {
          const jsonString = JSON.stringify(exportConfig, null, 2);
          const blob = new Blob([jsonString], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          downloadDataUrl(url, `${fileBase}-config.json`);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          return;
        }

        if (format === "favicon") {
          // Favicons are too small for watermarks
          const faviconConfig = createFaviconConfig(exportConfig, 256);

          const dataUrl = await exportSingleAsset(faviconConfig, "png");
          try {
            const icoBlob = await pngToIco(dataUrl);
            const icoUrl = URL.createObjectURL(icoBlob);
            downloadDataUrl(icoUrl, "favicon.ico");
            setTimeout(() => URL.revokeObjectURL(icoUrl), 1000);
          } catch (err) {
            console.error("Failed to convert PNG to ICO", err);
            downloadDataUrl(dataUrl, "favicon.png");
          }
          return;
        }

        if (format === "brand") {
          const brandVariants: {
            id: string;
            label: string;
            format: "png" | "svg" | "ico";
            overrides?: Partial<LogoConfig>;
            contrastBackground?: string;
          }[] = [
            {
              id: "primary-svg",
              label: "Primary logo (SVG)",
              format: "svg",
            },
            {
              id: "primary-1024",
              label: "Primary logo 1024px PNG",
              format: "png",
              overrides: { size: [1024] },
            },
            {
              id: "primary-512",
              label: "Primary logo 512px PNG",
              format: "png",
              overrides: { size: [512] },
            },
            {
              id: "primary-128",
              label: "Primary logo 128px PNG",
              format: "png",
              overrides: { size: [128] },
            },
            {
              id: "light-512",
              label: "Light background 512px PNG",
              format: "png",
              overrides: {
                size: [512],
                bgMode: "solid",
                bgColor: "#ffffff",
                gradientStart: "#ffffff",
                gradientEnd: "#ffffff",
                borderWidth: [0],
              },
              contrastBackground: "#ffffff",
            },
            {
              id: "dark-512",
              label: "Dark background 512px PNG",
              format: "png",
              overrides: {
                size: [512],
                bgMode: "solid",
                bgColor: "#0f172a",
                gradientStart: "#0f172a",
                gradientEnd: "#0f172a",
                borderWidth: [0],
              },
              contrastBackground: "#0f172a",
            },
            {
              id: "avatar-256",
              label: "Rounded avatar / favicon 256px PNG",
              format: "png",
              overrides: {
                size: [256],
                radius: [256],
                borderWidth: [0],
                shadowEnabled: false,
              },
            },
            {
              id: "favicon-ico",
              label: "Favicon (ICO)",
              format: "ico",
              overrides: {
                size: [256],
                radius: [256],
                shadowEnabled: false,
              },
            },
          ];

          const kitZip = new JSZip();
          const manifest: { filename: string; description: string }[] = [];

          for (const variant of brandVariants) {
            let variantConfig = cloneConfig(exportConfig);
            const isFaviconVariant =
              variant.id === "avatar-256" || variant.id === "favicon-ico";

            if (isFaviconVariant) {
              const targetSize = variant.overrides?.size
                ? getValue(variant.overrides.size)
                : 256;
              variantConfig = createFaviconConfig(exportConfig, targetSize);
              if (variant.overrides) {
                Object.assign(variantConfig, variant.overrides);
              }
            } else {
              if (variant.overrides?.size) {
                const targetSize = getValue(variant.overrides.size);
                variantConfig = scaleConfigForExport(exportConfig, targetSize);
              }

              if (variant.overrides) {
                Object.assign(variantConfig, variant.overrides);
              }
            }

            if (variant.contrastBackground) {
              const contrastOptions = {
                fallbackDark: "#0f172a",
                fallbackLight: "#f8fafc",
              } as const;
              variantConfig.iconColor = ensureReadableColor(
                variantConfig.iconColor,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.iconColorGradientStart = ensureReadableColor(
                variantConfig.iconColorGradientStart,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.iconColorGradientEnd = ensureReadableColor(
                variantConfig.iconColorGradientEnd,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.iconFillColor = ensureReadableColor(
                variantConfig.iconFillColor,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.iconFillGradientStart = ensureReadableColor(
                variantConfig.iconFillGradientStart,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.iconFillGradientEnd = ensureReadableColor(
                variantConfig.iconFillGradientEnd,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.borderColor = ensureReadableColor(
                variantConfig.borderColor,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.borderGradientStart = ensureReadableColor(
                variantConfig.borderGradientStart,
                variant.contrastBackground,
                contrastOptions
              );
              variantConfig.borderGradientEnd = ensureReadableColor(
                variantConfig.borderGradientEnd,
                variant.contrastBackground,
                contrastOptions
              );
              if (
                Array.isArray(variantConfig.texts) &&
                variantConfig.texts.length > 0
              ) {
                variantConfig.texts = variantConfig.texts.map((text) => {
                  const adjustedColor = ensureReadableColor(
                    text.color,
                    variant.contrastBackground,
                    contrastOptions
                  );
                  const adjustedStart = ensureReadableColor(
                    text.gradientStart,
                    variant.contrastBackground,
                    contrastOptions
                  );
                  const adjustedEnd = ensureReadableColor(
                    text.gradientEnd,
                    variant.contrastBackground,
                    contrastOptions
                  );
                  return {
                    ...text,
                    color: adjustedColor,
                    gradientStart: adjustedStart,
                    gradientEnd: adjustedEnd,
                  };
                });
              }
            }

            // Apply watermark to brand kit assets (except favicon variants)
            const applyWatermarkToVariant =
              shouldWatermark && !isFaviconVariant;

            const dataUrl = await exportSingleAsset(
              variantConfig,
              variant.format === "ico" ? "png" : variant.format,
              {
                pixelRatio:
                  variant.format === "png" || variant.format === "ico"
                    ? 1
                    : undefined,
                watermark: applyWatermarkToVariant,
              }
            );

            if (variant.format === "ico") {
              const icoBlob = await pngToIco(dataUrl);
              const filename = `${fileBase}-${variant.id}.ico`;
              kitZip.file(filename, icoBlob);
              manifest.push({ filename, description: variant.label });
            } else {
              const parsed = parseDataUrl(dataUrl);
              const filename = `${fileBase}-${variant.id}.${variant.format}`;

              kitZip.file(filename, parsed.data, {
                base64: parsed.base64,
              });
              manifest.push({ filename, description: variant.label });
            }
          }

          const readmeContent = buildBrandKitReadme(
            fileBase,
            exportConfig,
            manifest
          );
          kitZip.file("README.txt", readmeContent);

          const jsonString = JSON.stringify(exportConfig, null, 2);
          kitZip.file(`${fileBase}-config.json`, jsonString);

          const zipBlob = await kitZip.generateAsync({ type: "blob" });
          const zipUrl = URL.createObjectURL(zipBlob);
          const link = document.createElement("a");
          link.download = `${fileBase}-brand-kit.zip`;
          link.href = zipUrl;
          link.click();
          setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
          return;
        }

        if (format === "bundle") {
          const [pngDataUrl, svgDataUrl] = await Promise.all([
            exportSingleAsset(exportConfig, "png", { watermark: shouldWatermark }),
            exportSingleAsset(exportConfig, "svg", { watermark: shouldWatermark }),
          ]);

          const pngContent = parseDataUrl(pngDataUrl);
          const svgContent = parseDataUrl(svgDataUrl);

          const zip = new JSZip();
          zip.file(`${fileBase}-logo.png`, pngContent.data, {
            base64: pngContent.base64,
          });
          zip.file(`${fileBase}-logo.svg`, svgContent.data, {
            base64: svgContent.base64,
          });

          const zipBlob = await zip.generateAsync({ type: "blob" });
          const zipUrl = URL.createObjectURL(zipBlob);
          const link = document.createElement("a");
          link.download = `${fileBase}-logo-assets.zip`;
          link.href = zipUrl;
          link.click();
          setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
          return;
        }

        const singleDataUrl = await exportSingleAsset(exportConfig, format, {
          watermark: shouldWatermark,
        });
        downloadDataUrl(singleDataUrl, `${fileBase}-logo.${format}`);
      } catch (err) {
        console.error("Failed to download image", err);

        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const dataUrl = await toPng(captureRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            width: currentSize,
            height: currentSize,
            backgroundColor: undefined,
          });

          const link = document.createElement("a");
          link.download = `${fileBase}-logo-fallback.png`;
          link.href = dataUrl;
          link.click();
        } catch (fallbackErr) {
          console.error("Fallback export also failed:", fallbackErr);
          alert("Export failed. Please try again or use a different browser.");
        }
      }
    },
    [
      exportSingleAsset,
      notifyDownload,
      buildBrandKitReadme,
      currentSize,
      getExportReadyConfig,
    ]
  );

  const runAutoBundle = React.useCallback(
    async (variants: AutoExportVariant[], options?: DownloadOptions) => {
      if (!variants.length) return;

      const bundleZip = new JSZip();
      const exportConfig = getExportReadyConfig();
      const fileBase = exportConfig.iconName.toLowerCase().replace(/\s+/g, "-");
      const shouldWatermark = options?.watermark ?? false;

      await incrementLogoDownloadCount();

      for (const variant of variants) {
        let variantConfig = cloneConfig(exportConfig);
        if (variant.size) {
          variantConfig = scaleConfigForExport(exportConfig, variant.size);
        }

        const dataUrl = await exportSingleAsset(variantConfig, variant.format, {
          pixelRatio: 1,
          watermark: shouldWatermark,
        });
        const parsed = parseDataUrl(dataUrl);
        const filename = `${fileBase}-${variant.id}.${variant.format}`;
        bundleZip.file(filename, parsed.data, { base64: parsed.base64 });
      }

      const zipBlob = await bundleZip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.download = `${fileBase}-auto-bundle.zip`;
      link.href = zipUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
    },
    [exportSingleAsset, getExportReadyConfig]
  );
  const defaultExportDimension = React.useMemo(
    () => selectedExportSize || basePreviewSize,
    [selectedExportSize, basePreviewSize]
  );

  const getMaxDimensionForFormat = React.useCallback(
    (format: ExportFormat, options?: ExportRequestMetaOptions) => {
      const variantSizes =
        options?.autoBundleVariants
          ?.map((variant) => variant.size)
          .filter((size): size is number => typeof size === "number") ?? [];
      const bundleMax = variantSizes.length
        ? Math.max(...variantSizes)
        : null;

      switch (format) {
        case "png":
        case "svg":
        case "mockup":
          return defaultExportDimension;
        case "bundle":
          return bundleMax ?? defaultExportDimension;
        case "brand":
          return 1024;
        case "favicon":
          return 256;
        case "json":
          return 0;
        default:
          return defaultExportDimension;
      }
    },
    [defaultExportDimension]
  );

  React.useImperativeHandle(ref, () => ({
    handleDownload,
    handleAutoBundle: runAutoBundle,
    getExportRequestMeta: (format: ExportFormat, options?: ExportRequestMetaOptions) => ({
      maxDimension: getMaxDimensionForFormat(format, options),
    }),
  }));

  return (
    <LogoPreviewWorkspace
      config={config}
      captureRef={captureRef as React.RefObject<HTMLDivElement>}
      renderValues={{
        currentSize,
        currentRadius,
        backgroundStyle,
        borderStyle,
        gradientBorder,
        shadowStyle,
        iconStrokePaint,
        iconFillPaint,
        glyphPaint,
        showIconFill,
        iconLayers,
      }}
      selectedExportSize={selectedExportSize}
      onSizeChange={handleSizeChange}
      maxExportSize={maxExportSize}
      isMobile={isMobile}
      onUpdateConfig={onUpdateConfig}
      onTextMove={handleTextMove}
      onIconMove={handleIconMove}
      onExtraIconMove={handleExtraIconMove}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      activeLayerId={activeLayerId}
      onLayerSelect={onLayerSelect}
    />
  );
});

LogoPreview.displayName = "LogoPreview";
