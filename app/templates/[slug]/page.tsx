import { MiniLogoPreview } from "@/components/mini-logo-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_INFO,
  getAllTemplates,
  getTemplateBySlug,
  getTemplatesByCategory,
  type TemplateCategory,
} from "@/lib/template-queries";
import { initialConfig } from "@/lib/logo-constants";
import type { LogoConfig } from "@/lib/logo-types";
import { encodeConfigToUrl } from "@/lib/logo-helpers";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Allow dynamic params - pages will be generated on-demand when templates exist in DB
export const dynamicParams = true;

// Return empty array to skip build-time static generation
// Templates will be fetched dynamically at request time
export async function generateStaticParams() {
  // Skip static generation - templates are loaded from DB at runtime
  // This prevents build failures when DB is empty or inaccessible
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    return {
      title: "Template Not Found | Logotham",
    };
  }

  return {
    title: template.seoTitle,
    description: template.seoDescription,
    keywords: template.seoKeywords,
    openGraph: {
      title: template.seoTitle,
      description: template.seoDescription,
      type: "website",
    },
  };
}

export default async function TemplatePage({ params }: PageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const fullConfig = { ...initialConfig, ...template.config } as LogoConfig;
  const categoryInfo = CATEGORY_INFO[template.category as TemplateCategory];

  // Get related templates from same category
  const categoryTemplates = await getTemplatesByCategory(template.category as TemplateCategory);
  const relatedTemplates = categoryTemplates
    .filter((t) => t.slug !== slug)
    .slice(0, 4);

  // Create editor URL with template config
  const editorUrl = `/?${encodeConfigToUrl(fullConfig)}`;

  // Get all templates for prev/next navigation
  const allTemplates = await getAllTemplates();
  const currentIndex = allTemplates.findIndex((t) => t.slug === slug);
  const prevTemplate = currentIndex > 0 ? allTemplates[currentIndex - 1] : null;
  const nextTemplate =
    currentIndex < allTemplates.length - 1
      ? allTemplates[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/templates" className="hover:text-foreground">
              Templates
            </Link>
            <span>/</span>
            <Link
              href={`/templates#${template.category}`}
              className="hover:text-foreground"
            >
              {categoryInfo?.label || template.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{template.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border-2 border-border/60 bg-muted/30 p-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <MiniLogoPreview config={fullConfig} size={320} />
              </div>
            </div>

            {/* Color palette preview */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Colors:</span>
              <div className="flex gap-1">
                {[
                  fullConfig.bgMode === "gradient"
                    ? fullConfig.gradientStart
                    : fullConfig.bgColor,
                  fullConfig.bgMode === "gradient"
                    ? fullConfig.gradientEnd
                    : null,
                  fullConfig.iconColor,
                  fullConfig.borderWidth?.[0] > 0
                    ? fullConfig.borderColor
                    : null,
                ]
                  .filter(Boolean)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: color as string }}
                      title={color as string}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{categoryInfo?.label || template.category}</Badge>
              {template.featured && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              {template.name} Logo Template
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              {template.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href={editorUrl}>
                  <Sparkles className="h-4 w-4" />
                  Customize This Template
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/templates">Browse All Templates</Link>
              </Button>
            </div>

            {/* Features */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-card p-4">
                <h3 className="font-medium">Free to Use</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Customize unlimited times with our free editor
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <h3 className="font-medium">High Resolution</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Export PNG up to 4096px or scalable SVG
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <h3 className="font-medium">24,000+ Icons</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Swap the icon with any from our massive library
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <h3 className="font-medium">AI-Powered</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate variations with our AI assistant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Templates */}
        {relatedTemplates.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-2xl font-semibold">
              More {categoryInfo?.label || template.category} Templates
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedTemplates.map((related) => {
                const relatedConfig = {
                  ...initialConfig,
                  ...related.config,
                } as LogoConfig;
                return (
                  <Link
                    key={related.slug}
                    href={`/templates/${related.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-muted/30 p-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MiniLogoPreview config={relatedConfig} size={100} />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{related.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Prev/Next Navigation */}
        <div className="mt-16 flex items-center justify-between border-t pt-8">
          {prevTemplate ? (
            <Link
              href={`/templates/${prevTemplate.slug}`}
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>{prevTemplate.name}</span>
            </Link>
          ) : (
            <div />
          )}
          {nextTemplate ? (
            <Link
              href={`/templates/${nextTemplate.slug}`}
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <span>{nextTemplate.name}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* SEO Content */}
      <div className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="mb-4 text-xl font-semibold">
            About This {template.name} Logo Template
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
            <p>
              This {template.name.toLowerCase()} logo template is perfect for{" "}
              {template.tags.slice(0, 3).join(", ")} businesses. The design
              features a modern aesthetic that communicates professionalism and
              trust.
            </p>
            <p>
              Customize this template by changing the icon, colors, fonts, and
              layout in our free logo editor. Add your business name, adjust the
              background gradient, or swap the icon from our library of 24,000+
              icons.
            </p>
            <p>
              Download your finished logo in multiple formats including PNG for
              web use, SVG for scalable graphics, and complete brand kits with
              multiple sizes for social media, favicons, and print.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
