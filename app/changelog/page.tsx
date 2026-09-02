export default function ChangelogPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
        <p className="text-muted-foreground">
          Quick log of notable improvements to Logotham.
        </p>
        <div className="space-y-8">
          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Jan 21 2026
            </div>
            <h2 className="text-lg font-semibold">
              Sidebar UX Improvements
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>New Effects Tab:</strong> Border and Shadow controls now live in a dedicated &quot;Effects&quot; tab, making them easier to find. The former &quot;Container&quot; tab is now &quot;Shape&quot; and focuses purely on dimensions.
              </li>
              <li>
                <strong>Smarter Layer Selection:</strong> When you click an icon layer in the preview canvas, the sidebar now automatically switches to the &quot;Icon&quot; tab so you can immediately edit that layer&apos;s properties.
              </li>
            </ul>
          </article>

          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Dec 18 2025
            </div>
            <h2 className="text-lg font-semibold">
              Gemini-Powered AI Logo Generator & Enhanced Typography
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>AI Assistant:</strong> New Gemini-powered AI that generates 3 logo concepts from simple text prompts. Perfect when you need inspiration or a starting point to iterate on.
              </li>
              <li>
                <strong>Craft Across 24k+ Icons:</strong> Access icons from Lucide, Flaticon, Feather, Iconoir, Boxicons, Heroicons, Tabler, Hugeicons, Lineicons, and Font Awesome. All searchable and ready to use.
              </li>
              <li>
                <strong>Layered Text Rendering:</strong> Fixed outline rendering for cleaner text effects without artifacts on complex letters.
              </li>
              <li>
                <strong>Credit System:</strong> AI generation uses credits from your plan. Free users get trial credits, paid plans include monthly allocations.
              </li>
            </ul>
          </article>
          
          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Dec 8 2025
            </div>
            <h2 className="text-lg font-semibold">
              Mobile Responsiveness & Font Awesome Support
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Font Awesome Support:</strong> Integrated the massive{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Font Awesome
                </span>{" "}
                library, giving you access to thousands of high-quality solid
                icons for your logos.
              </li>
              <li>
                <strong>Optimized Mobile Preview:</strong> The logo preview area
                now intelligently scales down on smaller screens, ensuring your
                entire design is visible without excessive scrolling.
              </li>
              <li>
                <strong>Better Layout:</strong> Reduced unnecessary vertical
                spacing and padding on mobile devices for a more compact and
                user-friendly editing experience.
              </li>
            </ul>
          </article>
          
          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Dec 7 2025
            </div>
            <h2 className="text-lg font-semibold">
              Custom SVG Uploads & Advanced Typography
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Custom SVG Support:</strong> You can now upload your own
                SVGs to use as icons. The generator handles custom icons while
                maintaining aspect ratios and allowing full styling integration.
              </li>
              <li>
                <strong>Advanced Text Controls:</strong> New typography settings
                allow you to adjust letter spacing, line height, and add text
                outlines (stroke) for bolder designs.
              </li>
              <li>
                <strong>Layout Precision:</strong> Added a dedicated padding
                control to the sidebar, giving you more space around your logo
                elements.
              </li>
              <li>
                <strong>Enhanced Sharing:</strong> Custom icons and new layout
                settings are now fully preserved when sharing logo URLs.
              </li>
            </ul>
          </article>
          
          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Dec 6 2025
            </div>
            <h2 className="text-lg font-semibold">
              Advanced Layering, Typography Presets & UI Polish
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Advanced Layering:</strong> You can now layer multiple
                icons inside one logo with full styling independence. Each layer
                gets its own controls for stroke width, fill color, opacity, and
                gradients - not just position and size.
              </li>
              <li>
                <strong>Preset Browser & Expansion:</strong> Added over 20 new
                presets including dedicated text-based layouts (Studio, Social,
                Heavy). Organized presets into &quot;Icons&quot; and
                &quot;Typography&quot; tabs with a new grid-view browser that
                visually highlights your active selection.
              </li>
              <li>
                <strong>Smart Randomizer:</strong> The &quot;Surprise Me&quot;
                feature&apos;s &quot;Keep Icon&quot; option now strictly
                preserves all visual properties (including complex gradients and
                fill opacity), ensuring your brand mark stays consistent while
                you cycle through backgrounds.
              </li>
              <li>
                Background palette buttons stop overriding your icon stroke
                choices. Switching themes keeps existing icon gradients intact,
                letting you try new canvases without rebuilding foreground
                styles.
              </li>
              <li>
                Border controls ship with ready-made presets (solid + gradient)
                that set width and colors in one tap - perfect for testing
                accent outlines or neon shells.
              </li>
              <li>
                Fixed SVG gradient rendering for Lucide/other libraries so every
                stroke segment stays visible when you enable gradient fills (no
                more missing Sparkles arms).
              </li>
            </ul>
          </article>
          
          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Dec 4 2025
            </div>
            <h2 className="text-lg font-semibold">
              Interactive Canvas & Text Support
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Added support for multiple{" "}
                <span className="font-bold text-foreground">text elements</span>{" "}
                with customizable fonts (Google Fonts), colors, and weights.
              </li>
              <li>
                Made the entire canvas interactive:{" "}
                <span className="font-bold text-foreground">Drag and drop</span>{" "}
                your icon and text to position them exactly where you want.
              </li>
              <li>
                Implemented a{" "}
                <span className="font-bold text-foreground">Waitlist</span> for
                future AI generation features.
              </li>
              <li>
                Fixed export scaling issues and added a{" "}
                <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                  128px
                </span>{" "}
                variant to the Brand Kit.
              </li>
            </ul>
          </article>
          
          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Dec 3 2025
            </div>
            <h2 className="text-lg font-semibold">Icon library expansion</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Expanded icon library with{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Feather
                </span>
                ,{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Iconoir
                </span>
                ,{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Boxicons
                </span>
                , and{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Heroicons
                </span>{" "}
                support.
              </li>
              <li>
                Improved fill color and opacity handling for all icon types.
              </li>
              <li>Added download statistics tracking.</li>
            </ul>
          </article>
          
          <article className="space-y-2 rounded-2xl border bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Dec 2 2025
            </div>
            <h2 className="text-lg font-semibold">Initial release</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Icon library powered by{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Lucide
                </span>
                ,{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Lucide Lab
                </span>
                , and{" "}
                <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
                  Flaticon
                </span>
                , including the new Bat preset.
              </li>
              <li>
                Live logo customizer with gradients, background shapes, shadows,
                and palette presets.
              </li>
              <li>
                One-click PNG/SVG exports plus full brand kit .zip bundles for
                designers.
              </li>
              <li>
                Shareable permalink button, undo/redo functionality, and
                responsive UI.
              </li>
              <li>Light/dark theme toggle built into the navbar.</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
}
