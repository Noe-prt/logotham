import { MiniLogoPreview } from "@/components/mini-logo-preview";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_INFO,
  getAllCategories,
  getAllTemplates,
  getTemplatesByCategory,
  type LogoTemplate,
  type TemplateCategory,
} from "@/lib/template-queries";
import { initialConfig } from "@/lib/logo-constants";
import type { LogoConfig } from "@/lib/logo-types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Logo Templates | 100+ Professional Designs | Logotham",
  description:
    "Browse 100+ free logo templates for every industry. Coffee shops, tech startups, fitness brands, and more. Customize and download in seconds.",
  keywords: [
    "logo templates",
    "free logo maker",
    "logo design templates",
    "business logo templates",
    "professional logo templates",
  ],
  openGraph: {
    title: "Free Logo Templates | 100+ Professional Designs",
    description:
      "Browse 100+ free logo templates for every industry. Customize and download in seconds.",
    type: "website",
  },
};

function TemplateCard({ template }: { template: LogoTemplate }) {
  const fullConfig = { ...initialConfig, ...template.config } as LogoConfig;

  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-square bg-muted/30 p-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <MiniLogoPreview config={fullConfig} size={160} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm">
            Use Template
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-semibold text-foreground">{template.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}

async function CategorySection({ category }: { category: TemplateCategory }) {
  const templates = await getTemplatesByCategory(category);
  const info = CATEGORY_INFO[category];

  if (templates.length === 0) return null;

  return (
    <section id={category} className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{info.label}</h2>
        <p className="text-muted-foreground">{info.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {templates.map((template) => (
          <TemplateCard key={template.slug} template={template} />
        ))}
      </div>
    </section>
  );
}

export default async function TemplatesPage() {
  const allTemplates = await getAllTemplates();
  const categories = getAllCategories();

  // Get categories that have templates
  const templatesByCategory = new Map<string, number>();
  for (const template of allTemplates) {
    const count = templatesByCategory.get(template.category) || 0;
    templatesByCategory.set(template.category, count + 1);
  }

  const categoriesWithTemplates = categories.filter(
    (cat) => (templatesByCategory.get(cat) || 0) > 0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Logo Templates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Browse {allTemplates.length}+ professional logo templates.
            Click any template to customize it with your brand colors and text.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categoriesWithTemplates.map((category) => (
              <a
                key={category}
                href={`#${category}`}
                className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {CATEGORY_INFO[category].label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="space-y-16">
          {categoriesWithTemplates.map((category) => (
            <CategorySection key={category} category={category} />
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="mb-6 text-2xl font-semibold">
            Free Logo Templates for Every Business
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Whether you&apos;re launching a coffee shop, tech startup, fitness
              brand, or creative agency, Logotham has the perfect logo template
              for you. Our collection of {allTemplates.length}+ professionally
              designed templates covers every industry.
            </p>
            <h3>How to Use Our Logo Templates</h3>
            <ol>
              <li>Browse templates by category or use the search</li>
              <li>Click on any template to open it in the editor</li>
              <li>Customize colors, icons, fonts, and layout</li>
              <li>Download your logo in PNG, SVG, or full brand kit</li>
            </ol>
            <h3>Why Choose Logotham Templates?</h3>
            <ul>
              <li>
                <strong>100% Free Editor:</strong> Create unlimited logos with
                our powerful editor
              </li>
              <li>
                <strong>24,000+ Icons:</strong> Access icons from Lucide,
                Tabler, Font Awesome, and more
              </li>
              <li>
                <strong>AI-Powered:</strong> Generate unique concepts with our
                AI assistant
              </li>
              <li>
                <strong>Production Ready:</strong> Export high-resolution PNG,
                SVG, and favicon bundles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
