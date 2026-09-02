import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { logoTemplates } from "@/db/schema";
import { eq, ilike, or, sql, desc, asc } from "drizzle-orm";
import type { LogoConfig } from "./logo-types";

export type TemplateCategory =
  | "food-drink"
  | "tech-startup"
  | "health-fitness"
  | "creative-agency"
  | "ecommerce"
  | "education"
  | "finance"
  | "travel"
  | "music-entertainment"
  | "nature-eco"
  | "fashion-beauty"
  | "real-estate"
  | "gaming"
  | "sports"
  | "pets"
  | "legal"
  | "construction"
  | "automotive"
  | "nonprofit"
  | "photography";

export type LogoTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: Partial<LogoConfig>;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export const CATEGORY_INFO: Record<
  TemplateCategory,
  { label: string; description: string }
> = {
  "food-drink": {
    label: "Food & Drink",
    description: "Logos for restaurants, cafes, bakeries, and food brands",
  },
  "tech-startup": {
    label: "Tech & Startup",
    description: "Modern logos for tech companies, SaaS, and startups",
  },
  "health-fitness": {
    label: "Health & Fitness",
    description: "Logos for gyms, wellness centers, and health brands",
  },
  "creative-agency": {
    label: "Creative Agency",
    description: "Logos for design studios, marketing agencies, and creatives",
  },
  ecommerce: {
    label: "E-commerce",
    description: "Logos for online stores and retail brands",
  },
  education: {
    label: "Education",
    description: "Logos for schools, courses, and learning platforms",
  },
  finance: {
    label: "Finance",
    description: "Logos for banks, fintech, and financial services",
  },
  travel: {
    label: "Travel",
    description: "Logos for travel agencies, hotels, and tourism",
  },
  "music-entertainment": {
    label: "Music & Entertainment",
    description: "Logos for musicians, podcasts, and entertainment brands",
  },
  "nature-eco": {
    label: "Nature & Eco",
    description: "Logos for eco-friendly brands and environmental projects",
  },
  "fashion-beauty": {
    label: "Fashion & Beauty",
    description: "Logos for fashion brands, salons, and beauty products",
  },
  "real-estate": {
    label: "Real Estate",
    description: "Logos for real estate agencies and property businesses",
  },
  gaming: {
    label: "Gaming",
    description: "Logos for gaming studios, esports, and game streamers",
  },
  sports: {
    label: "Sports",
    description: "Logos for sports teams, clubs, and athletic brands",
  },
  pets: {
    label: "Pets",
    description: "Logos for pet shops, veterinarians, and pet services",
  },
  legal: {
    label: "Legal",
    description: "Logos for law firms and legal services",
  },
  construction: {
    label: "Construction",
    description: "Logos for construction companies and contractors",
  },
  automotive: {
    label: "Automotive",
    description: "Logos for car dealerships, garages, and auto services",
  },
  nonprofit: {
    label: "Nonprofit",
    description: "Logos for charities, NGOs, and community organizations",
  },
  photography: {
    label: "Photography",
    description: "Logos for photographers and visual artists",
  },
};

// Cache tag for revalidation
const TEMPLATES_CACHE_TAG = "templates";

/**
 * Get all templates from the database
 * Cached for 1 hour with revalidation on demand
 */
export const getAllTemplates = unstable_cache(
  async (): Promise<LogoTemplate[]> => {
    const results = await db
      .select()
      .from(logoTemplates)
      .orderBy(desc(logoTemplates.featured), asc(logoTemplates.sortOrder), asc(logoTemplates.name));

    return results.map((row) => ({
      ...row,
      config: row.config as Partial<LogoConfig>,
    }));
  },
  ["all-templates"],
  { revalidate: 3600, tags: [TEMPLATES_CACHE_TAG] }
);

/**
 * Get a single template by slug
 * Cached for 1 hour with revalidation on demand
 */
export const getTemplateBySlug = unstable_cache(
  async (slug: string): Promise<LogoTemplate | null> => {
    const results = await db
      .select()
      .from(logoTemplates)
      .where(eq(logoTemplates.slug, slug))
      .limit(1);

    if (results.length === 0) return null;

    return {
      ...results[0],
      config: results[0].config as Partial<LogoConfig>,
    };
  },
  ["template-by-slug"],
  { revalidate: 3600, tags: [TEMPLATES_CACHE_TAG] }
);

/**
 * Get templates by category
 * Cached for 1 hour with revalidation on demand
 */
export const getTemplatesByCategory = unstable_cache(
  async (category: TemplateCategory): Promise<LogoTemplate[]> => {
    const results = await db
      .select()
      .from(logoTemplates)
      .where(eq(logoTemplates.category, category))
      .orderBy(desc(logoTemplates.featured), asc(logoTemplates.sortOrder), asc(logoTemplates.name));

    return results.map((row) => ({
      ...row,
      config: row.config as Partial<LogoConfig>,
    }));
  },
  ["templates-by-category"],
  { revalidate: 3600, tags: [TEMPLATES_CACHE_TAG] }
);

/**
 * Get featured templates
 * Cached for 1 hour with revalidation on demand
 */
export const getFeaturedTemplates = unstable_cache(
  async (limit = 12): Promise<LogoTemplate[]> => {
    const results = await db
      .select()
      .from(logoTemplates)
      .where(eq(logoTemplates.featured, true))
      .orderBy(asc(logoTemplates.sortOrder), asc(logoTemplates.name))
      .limit(limit);

    return results.map((row) => ({
      ...row,
      config: row.config as Partial<LogoConfig>,
    }));
  },
  ["featured-templates"],
  { revalidate: 3600, tags: [TEMPLATES_CACHE_TAG] }
);

/**
 * Search templates by query
 * Searches name, description, and tags
 */
export const searchTemplates = unstable_cache(
  async (query: string): Promise<LogoTemplate[]> => {
    const searchPattern = `%${query}%`;

    const results = await db
      .select()
      .from(logoTemplates)
      .where(
        or(
          ilike(logoTemplates.name, searchPattern),
          ilike(logoTemplates.description, searchPattern),
          sql`EXISTS (SELECT 1 FROM unnest(${logoTemplates.tags}) AS tag WHERE tag ILIKE ${searchPattern})`
        )
      )
      .orderBy(desc(logoTemplates.featured), asc(logoTemplates.sortOrder));

    return results.map((row) => ({
      ...row,
      config: row.config as Partial<LogoConfig>,
    }));
  },
  ["search-templates"],
  { revalidate: 3600, tags: [TEMPLATES_CACHE_TAG] }
);

/**
 * Get all template slugs for static generation
 * Used for generateStaticParams in dynamic routes
 */
export const getAllTemplateSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const results = await db
      .select({ slug: logoTemplates.slug })
      .from(logoTemplates);

    return results.map((row) => row.slug);
  },
  ["all-template-slugs"],
  { revalidate: 3600, tags: [TEMPLATES_CACHE_TAG] }
);

/**
 * Get all categories that have templates
 */
export function getAllCategories(): TemplateCategory[] {
  return Object.keys(CATEGORY_INFO) as TemplateCategory[];
}

/**
 * Get category info by slug
 */
export function getCategoryInfo(category: TemplateCategory) {
  return CATEGORY_INFO[category];
}

/**
 * Get template count by category (uncached - for admin use)
 */
export async function getTemplateCounts(): Promise<Record<string, number>> {
  const results = await db
    .select({
      category: logoTemplates.category,
      count: sql<number>`count(*)::int`,
    })
    .from(logoTemplates)
    .groupBy(logoTemplates.category);

  return results.reduce(
    (acc, row) => {
      acc[row.category] = row.count;
      return acc;
    },
    {} as Record<string, number>
  );
}
