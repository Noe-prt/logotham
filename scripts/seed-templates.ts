/**
 * Seed script for logo templates
 *
 * Run with: bun run scripts/seed-templates.ts
 *
 * This script populates the logo_templates table with 150+ templates
 * covering various industries and SEO-optimized keywords.
 */

import { db } from "@/db";
import { logoTemplates } from "@/db/schema";
import { initialConfig } from "@/lib/logo-constants";
import type { LogoConfig } from "@/lib/logo-types";

type TemplateInsert = {
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
};

function createTemplate(
  slug: string,
  name: string,
  description: string,
  category: string,
  tags: string[],
  config: Partial<LogoConfig>,
  seo: { title: string; description: string; keywords: string[] },
  featured = false,
  sortOrder = 0
): TemplateInsert {
  return {
    id: crypto.randomUUID(),
    slug,
    name,
    description,
    category,
    tags,
    config: { ...initialConfig, ...config },
    seoTitle: seo.title,
    seoDescription: seo.description,
    seoKeywords: seo.keywords,
    featured,
    sortOrder,
  };
}

// ============== FOOD & DRINK TEMPLATES ==============
const foodDrinkTemplates: TemplateInsert[] = [
  createTemplate(
    "coffee-shop-logo",
    "Coffee Shop",
    "Warm and inviting logo perfect for cafes and coffee houses",
    "food-drink",
    ["coffee", "cafe", "espresso", "barista", "roastery"],
    {
      iconType: "lucide",
      iconName: "Coffee",
      bgMode: "gradient",
      gradientStart: "#78350f",
      gradientEnd: "#451a03",
      gradientAngle: [180],
      iconColor: "#fef3c7",
      radius: [40],
      strokeWidth: [2],
    },
    {
      title: "Coffee Shop Logo Template | Free Logo Maker",
      description:
        "Create a beautiful coffee shop logo in minutes. Perfect for cafes, roasteries, and espresso bars.",
      keywords: ["coffee shop logo", "cafe logo", "coffee logo maker", "barista logo"],
    },
    true,
    1
  ),
  createTemplate(
    "minimalist-coffee-logo",
    "Minimalist Coffee",
    "Clean, modern coffee logo with minimal design",
    "food-drink",
    ["coffee", "minimalist", "modern", "clean", "simple"],
    {
      iconType: "lucide",
      iconName: "Coffee",
      bgMode: "solid",
      bgColor: "#ffffff",
      iconColor: "#1c1917",
      radius: [0],
      strokeWidth: [1.5],
      borderWidth: [2],
      borderColor: "#1c1917",
    },
    {
      title: "Minimalist Coffee Logo | Clean Cafe Branding",
      description: "Design a minimalist coffee logo. Perfect for modern cafes and specialty roasters.",
      keywords: ["minimalist coffee logo", "modern cafe logo", "clean coffee branding"],
    }
  ),
  createTemplate(
    "vintage-coffee-logo",
    "Vintage Coffee",
    "Retro-inspired coffee shop logo with classic appeal",
    "food-drink",
    ["coffee", "vintage", "retro", "classic", "artisan"],
    {
      iconType: "lucide",
      iconName: "Coffee",
      bgMode: "solid",
      bgColor: "#44403c",
      iconColor: "#d6d3d1",
      radius: [100],
      strokeWidth: [2],
      borderWidth: [3],
      borderColor: "#d6d3d1",
    },
    {
      title: "Vintage Coffee Logo | Retro Cafe Design",
      description: "Create a vintage coffee shop logo with classic retro aesthetics.",
      keywords: ["vintage coffee logo", "retro cafe logo", "classic coffee branding"],
    }
  ),
  createTemplate(
    "bakery-logo",
    "Bakery",
    "Sweet and classic design for bakeries and pastry shops",
    "food-drink",
    ["bakery", "pastry", "bread", "cake", "dessert"],
    {
      iconType: "lucide",
      iconName: "Croissant",
      bgMode: "solid",
      bgColor: "#fef3c7",
      iconColor: "#92400e",
      radius: [100],
      strokeWidth: [2],
      borderWidth: [3],
      borderColor: "#92400e",
    },
    {
      title: "Bakery Logo Template | Free Logo Maker",
      description: "Design a delicious bakery logo for your pastry shop or bread store.",
      keywords: ["bakery logo", "pastry logo", "bread logo", "cake shop logo"],
    },
    true,
    2
  ),
  createTemplate(
    "artisan-bakery-logo",
    "Artisan Bakery",
    "Handcrafted style logo for artisan bakeries",
    "food-drink",
    ["bakery", "artisan", "handcrafted", "sourdough", "boulangerie"],
    {
      iconType: "lucide",
      iconName: "Wheat",
      bgMode: "solid",
      bgColor: "#fefce8",
      iconColor: "#854d0e",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Artisan Bakery Logo | Handcrafted Bread Branding",
      description: "Create an artisan bakery logo that showcases handcrafted quality.",
      keywords: ["artisan bakery logo", "sourdough logo", "handcrafted bread logo"],
    }
  ),
  createTemplate(
    "restaurant-logo",
    "Restaurant",
    "Elegant dining logo for restaurants and eateries",
    "food-drink",
    ["restaurant", "dining", "food", "chef", "kitchen"],
    {
      iconType: "lucide",
      iconName: "UtensilsCrossed",
      bgMode: "solid",
      bgColor: "#1c1917",
      iconColor: "#fbbf24",
      radius: [16],
      strokeWidth: [1.5],
      borderWidth: [2],
      borderColor: "#fbbf24",
    },
    {
      title: "Restaurant Logo Template | Free Logo Maker",
      description: "Create an elegant restaurant logo for fine dining or casual eateries.",
      keywords: ["restaurant logo", "dining logo", "food logo", "chef logo"],
    },
    true,
    3
  ),
  createTemplate(
    "fine-dining-logo",
    "Fine Dining",
    "Luxurious logo for upscale restaurants",
    "food-drink",
    ["fine dining", "luxury", "gourmet", "upscale", "michelin"],
    {
      iconType: "lucide",
      iconName: "ChefHat",
      bgMode: "solid",
      bgColor: "#0c0a09",
      iconColor: "#d4af37",
      radius: [0],
      strokeWidth: [1],
    },
    {
      title: "Fine Dining Logo | Luxury Restaurant Branding",
      description: "Design a sophisticated fine dining logo for upscale restaurants.",
      keywords: ["fine dining logo", "luxury restaurant logo", "gourmet logo"],
    }
  ),
  createTemplate(
    "pizza-logo",
    "Pizza Place",
    "Fun and appetizing logo for pizzerias",
    "food-drink",
    ["pizza", "italian", "pizzeria", "fast food", "delivery"],
    {
      iconType: "lucide",
      iconName: "Pizza",
      bgMode: "gradient",
      gradientStart: "#dc2626",
      gradientEnd: "#991b1b",
      gradientAngle: [135],
      iconColor: "#fef3c7",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Pizza Logo Template | Free Logo Maker",
      description: "Design a mouth-watering pizza logo for your pizzeria.",
      keywords: ["pizza logo", "pizzeria logo", "italian restaurant logo"],
    }
  ),
  createTemplate(
    "beer-brewery-logo",
    "Craft Brewery",
    "Rustic logo for craft breweries and beer brands",
    "food-drink",
    ["beer", "brewery", "craft", "ale", "pub"],
    {
      iconType: "lucide",
      iconName: "Beer",
      bgMode: "solid",
      bgColor: "#422006",
      iconColor: "#fbbf24",
      radius: [20],
      strokeWidth: [2],
      borderWidth: [3],
      borderColor: "#fbbf24",
    },
    {
      title: "Brewery Logo Template | Craft Beer Logo Maker",
      description: "Create a distinctive craft brewery logo for microbreweries and pubs.",
      keywords: ["brewery logo", "craft beer logo", "beer brand", "pub logo"],
    }
  ),
  createTemplate(
    "wine-bar-logo",
    "Wine Bar",
    "Sophisticated logo for wine bars and vineyards",
    "food-drink",
    ["wine", "vineyard", "winery", "sommelier", "bar"],
    {
      iconType: "lucide",
      iconName: "Wine",
      bgMode: "gradient",
      gradientStart: "#7f1d1d",
      gradientEnd: "#450a0a",
      gradientAngle: [180],
      iconColor: "#fef2f2",
      radius: [24],
      strokeWidth: [1.5],
    },
    {
      title: "Wine Bar Logo | Vineyard Branding",
      description: "Design an elegant wine bar logo for wineries and wine merchants.",
      keywords: ["wine bar logo", "vineyard logo", "winery logo", "wine brand"],
    }
  ),
  createTemplate(
    "juice-bar-logo",
    "Juice Bar",
    "Fresh and vibrant logo for juice bars and smoothie shops",
    "food-drink",
    ["juice", "smoothie", "fresh", "healthy", "organic"],
    {
      iconType: "lucide",
      iconName: "Citrus",
      bgMode: "gradient",
      gradientStart: "#fbbf24",
      gradientEnd: "#f97316",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Juice Bar Logo | Smoothie Shop Branding",
      description: "Create a fresh juice bar logo for healthy beverage businesses.",
      keywords: ["juice bar logo", "smoothie logo", "fresh juice branding"],
    }
  ),
  createTemplate(
    "ice-cream-logo",
    "Ice Cream Shop",
    "Sweet and playful logo for ice cream parlors",
    "food-drink",
    ["ice cream", "gelato", "dessert", "sweet", "parlor"],
    {
      iconType: "lucide",
      iconName: "IceCream",
      bgMode: "gradient",
      gradientStart: "#f472b6",
      gradientEnd: "#ec4899",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Ice Cream Shop Logo | Gelato Parlor Branding",
      description: "Design a sweet ice cream shop logo for gelato and dessert businesses.",
      keywords: ["ice cream logo", "gelato logo", "dessert shop logo"],
    }
  ),
  createTemplate(
    "food-truck-logo",
    "Food Truck",
    "Bold and mobile-friendly food truck logo",
    "food-drink",
    ["food truck", "street food", "mobile", "vendor", "catering"],
    {
      iconType: "lucide",
      iconName: "Truck",
      bgMode: "solid",
      bgColor: "#ea580c",
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2.5],
    },
    {
      title: "Food Truck Logo | Street Food Branding",
      description: "Create a bold food truck logo for mobile food vendors.",
      keywords: ["food truck logo", "street food logo", "mobile food vendor"],
    }
  ),
  createTemplate(
    "sushi-restaurant-logo",
    "Sushi Restaurant",
    "Elegant Japanese-inspired logo for sushi restaurants",
    "food-drink",
    ["sushi", "japanese", "asian", "seafood", "ramen"],
    {
      iconType: "lucide",
      iconName: "Fish",
      bgMode: "solid",
      bgColor: "#0c0a09",
      iconColor: "#ef4444",
      radius: [12],
      strokeWidth: [1.5],
    },
    {
      title: "Sushi Restaurant Logo | Japanese Food Branding",
      description: "Design an elegant sushi restaurant logo with Japanese aesthetics.",
      keywords: ["sushi logo", "japanese restaurant logo", "asian food logo"],
    }
  ),
  createTemplate(
    "tea-house-logo",
    "Tea House",
    "Calm and refined logo for tea houses and tea shops",
    "food-drink",
    ["tea", "tea house", "herbal", "chai", "matcha"],
    {
      iconType: "lucide",
      iconName: "Leaf",
      bgMode: "gradient",
      gradientStart: "#166534",
      gradientEnd: "#14532d",
      gradientAngle: [180],
      iconColor: "#dcfce7",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Tea House Logo | Tea Shop Branding",
      description: "Create a refined tea house logo for specialty tea businesses.",
      keywords: ["tea house logo", "tea shop logo", "herbal tea branding"],
    }
  ),
];

// ============== TECH & STARTUP TEMPLATES ==============
const techStartupTemplates: TemplateInsert[] = [
  createTemplate(
    "tech-startup-logo",
    "Tech Startup",
    "Modern and innovative logo for tech companies",
    "tech-startup",
    ["tech", "startup", "innovation", "software", "app"],
    {
      iconType: "lucide",
      iconName: "Rocket",
      bgMode: "gradient",
      gradientStart: "#6366f1",
      gradientEnd: "#8b5cf6",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Tech Startup Logo Template | Free Logo Maker",
      description: "Launch your tech startup with a professional logo for SaaS and apps.",
      keywords: ["tech startup logo", "startup logo", "tech company logo", "saas logo"],
    },
    true,
    1
  ),
  createTemplate(
    "saas-logo",
    "SaaS Platform",
    "Clean and professional logo for SaaS products",
    "tech-startup",
    ["saas", "software", "cloud", "platform", "b2b"],
    {
      iconType: "lucide",
      iconName: "Cloud",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#38bdf8",
      radius: [16],
      strokeWidth: [2],
      shadowColor: "#38bdf8",
      shadowBlur: [30],
      shadowOpacity: [0.3],
    },
    {
      title: "SaaS Logo Template | Software Company Logo Maker",
      description: "Design a professional SaaS logo for your software platform.",
      keywords: ["saas logo", "software logo", "cloud logo", "platform logo"],
    },
    true,
    2
  ),
  createTemplate(
    "ai-company-logo",
    "AI Company",
    "Futuristic logo for AI and machine learning companies",
    "tech-startup",
    ["ai", "artificial intelligence", "machine learning", "neural", "bot"],
    {
      iconType: "lucide",
      iconName: "Brain",
      bgMode: "solid",
      bgColor: "#09090b",
      iconColorMode: "gradient",
      iconColorGradientStart: "#06b6d4",
      iconColorGradientEnd: "#d946ef",
      iconColorGradientAngle: [45],
      radius: [32],
      strokeWidth: [1.5],
    },
    {
      title: "AI Company Logo Template | Machine Learning Logo Maker",
      description: "Create a cutting-edge AI company logo for ML startups.",
      keywords: ["ai logo", "artificial intelligence logo", "machine learning logo"],
    },
    true,
    3
  ),
  createTemplate(
    "developer-tools-logo",
    "Developer Tools",
    "Technical logo for dev tools and coding platforms",
    "tech-startup",
    ["developer", "code", "programming", "api", "devtools"],
    {
      iconType: "lucide",
      iconName: "Terminal",
      bgMode: "solid",
      bgColor: "#18181b",
      iconColor: "#4ade80",
      radius: [12],
      strokeWidth: [2],
      borderWidth: [1],
      borderColor: "#27272a",
    },
    {
      title: "Developer Tools Logo Template | Coding Logo Maker",
      description: "Design a technical logo for your developer tools or API.",
      keywords: ["developer logo", "coding logo", "programming logo", "api logo"],
    }
  ),
  createTemplate(
    "mobile-app-logo",
    "Mobile App",
    "App icon style logo for mobile applications",
    "tech-startup",
    ["app", "mobile", "ios", "android", "smartphone"],
    {
      iconType: "lucide",
      iconName: "Smartphone",
      bgMode: "gradient",
      gradientStart: "#f472b6",
      gradientEnd: "#fb923c",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [64],
      strokeWidth: [2],
    },
    {
      title: "Mobile App Logo Template | App Icon Maker",
      description: "Create a stunning mobile app logo for iOS and Android.",
      keywords: ["app logo", "mobile app logo", "app icon", "ios logo"],
    }
  ),
  createTemplate(
    "cybersecurity-logo",
    "Cybersecurity",
    "Secure and trustworthy logo for security companies",
    "tech-startup",
    ["security", "cybersecurity", "protection", "shield", "privacy"],
    {
      iconType: "lucide",
      iconName: "Shield",
      bgMode: "gradient",
      gradientStart: "#1e40af",
      gradientEnd: "#1e3a8a",
      gradientAngle: [180],
      iconColor: "#60a5fa",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Cybersecurity Logo | Security Company Branding",
      description: "Design a trustworthy cybersecurity logo for protection services.",
      keywords: ["cybersecurity logo", "security logo", "protection logo"],
    }
  ),
  createTemplate(
    "data-analytics-logo",
    "Data Analytics",
    "Insightful logo for data and analytics platforms",
    "tech-startup",
    ["data", "analytics", "insights", "dashboard", "bi"],
    {
      iconType: "lucide",
      iconName: "BarChart3",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#22d3ee",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "Data Analytics Logo | Business Intelligence Branding",
      description: "Create an insightful data analytics logo for BI platforms.",
      keywords: ["data analytics logo", "analytics logo", "dashboard logo"],
    }
  ),
  createTemplate(
    "automation-logo",
    "Automation Platform",
    "Efficient logo for automation and workflow tools",
    "tech-startup",
    ["automation", "workflow", "zapier", "integration", "productivity"],
    {
      iconType: "lucide",
      iconName: "Zap",
      bgMode: "gradient",
      gradientStart: "#facc15",
      gradientEnd: "#eab308",
      gradientAngle: [135],
      iconColor: "#1c1917",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Automation Logo | Workflow Platform Branding",
      description: "Design an efficient automation logo for workflow tools.",
      keywords: ["automation logo", "workflow logo", "integration logo"],
    }
  ),
  createTemplate(
    "iot-logo",
    "IoT Platform",
    "Connected logo for Internet of Things products",
    "tech-startup",
    ["iot", "connected", "smart", "devices", "sensors"],
    {
      iconType: "lucide",
      iconName: "Wifi",
      bgMode: "solid",
      bgColor: "#0e7490",
      iconColor: "#ffffff",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "IoT Logo | Smart Device Branding",
      description: "Create a connected IoT logo for smart device platforms.",
      keywords: ["iot logo", "smart device logo", "connected logo"],
    }
  ),
  createTemplate(
    "devops-logo",
    "DevOps Platform",
    "Streamlined logo for DevOps and CI/CD tools",
    "tech-startup",
    ["devops", "cicd", "deployment", "infrastructure", "kubernetes"],
    {
      iconType: "lucide",
      iconName: "GitBranch",
      bgMode: "solid",
      bgColor: "#1e1b4b",
      iconColor: "#a5b4fc",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "DevOps Logo | CI/CD Platform Branding",
      description: "Design a streamlined DevOps logo for deployment tools.",
      keywords: ["devops logo", "cicd logo", "kubernetes logo"],
    }
  ),
  createTemplate(
    "api-platform-logo",
    "API Platform",
    "Technical logo for API-first companies",
    "tech-startup",
    ["api", "rest", "graphql", "backend", "endpoints"],
    {
      iconType: "lucide",
      iconName: "Plug",
      bgMode: "gradient",
      gradientStart: "#7c3aed",
      gradientEnd: "#6366f1",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "API Platform Logo | Backend Service Branding",
      description: "Create a technical API platform logo for backend services.",
      keywords: ["api logo", "backend logo", "graphql logo"],
    }
  ),
  createTemplate(
    "blockchain-tech-logo",
    "Blockchain Tech",
    "Decentralized logo for blockchain technology companies",
    "tech-startup",
    ["blockchain", "distributed", "ledger", "nodes", "consensus"],
    {
      iconType: "lucide",
      iconName: "Boxes",
      bgMode: "solid",
      bgColor: "#09090b",
      iconColorMode: "gradient",
      iconColorGradientStart: "#3b82f6",
      iconColorGradientEnd: "#8b5cf6",
      iconColorGradientAngle: [90],
      radius: [24],
      strokeWidth: [1.5],
    },
    {
      title: "Blockchain Logo | Distributed Technology Branding",
      description: "Design a decentralized blockchain logo for tech companies.",
      keywords: ["blockchain logo", "distributed ledger logo", "tech logo"],
    }
  ),
  createTemplate(
    "no-code-logo",
    "No-Code Platform",
    "Accessible logo for no-code and low-code tools",
    "tech-startup",
    ["no-code", "low-code", "visual", "builder", "drag-drop"],
    {
      iconType: "lucide",
      iconName: "LayoutGrid",
      bgMode: "gradient",
      gradientStart: "#ec4899",
      gradientEnd: "#8b5cf6",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "No-Code Logo | Visual Builder Branding",
      description: "Create an accessible no-code platform logo for visual builders.",
      keywords: ["no-code logo", "low-code logo", "visual builder logo"],
    }
  ),
  createTemplate(
    "productivity-app-logo",
    "Productivity App",
    "Clean logo for productivity and task management apps",
    "tech-startup",
    ["productivity", "tasks", "todo", "organization", "planning"],
    {
      iconType: "lucide",
      iconName: "CheckSquare",
      bgMode: "solid",
      bgColor: "#ffffff",
      iconColor: "#0f172a",
      radius: [20],
      strokeWidth: [2],
      borderWidth: [2],
      borderColor: "#e2e8f0",
    },
    {
      title: "Productivity App Logo | Task Management Branding",
      description: "Design a clean productivity app logo for task management.",
      keywords: ["productivity logo", "task app logo", "todo logo"],
    }
  ),
  createTemplate(
    "video-conferencing-logo",
    "Video Conferencing",
    "Connected logo for video meeting platforms",
    "tech-startup",
    ["video", "conferencing", "meeting", "zoom", "collaboration"],
    {
      iconType: "lucide",
      iconName: "Video",
      bgMode: "gradient",
      gradientStart: "#2563eb",
      gradientEnd: "#1d4ed8",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Video Conferencing Logo | Meeting Platform Branding",
      description: "Create a connected video conferencing logo for meeting platforms.",
      keywords: ["video conferencing logo", "meeting logo", "zoom logo"],
    }
  ),
];

// ============== HEALTH & FITNESS TEMPLATES ==============
const healthFitnessTemplates: TemplateInsert[] = [
  createTemplate(
    "gym-logo",
    "Gym & Fitness",
    "Powerful logo for gyms and fitness centers",
    "health-fitness",
    ["gym", "fitness", "workout", "training", "muscle"],
    {
      iconType: "lucide",
      iconName: "Dumbbell",
      bgMode: "solid",
      bgColor: "#171717",
      iconColor: "#ef4444",
      radius: [16],
      strokeWidth: [2.5],
      borderWidth: [3],
      borderColor: "#ef4444",
    },
    {
      title: "Gym Logo Template | Fitness Logo Maker",
      description: "Create a powerful gym logo for fitness centers and trainers.",
      keywords: ["gym logo", "fitness logo", "workout logo", "trainer logo"],
    },
    true,
    1
  ),
  createTemplate(
    "crossfit-logo",
    "CrossFit Gym",
    "Intense logo for CrossFit and functional fitness",
    "health-fitness",
    ["crossfit", "functional", "wod", "box", "intense"],
    {
      iconType: "lucide",
      iconName: "Flame",
      bgMode: "solid",
      bgColor: "#0c0a09",
      iconColor: "#f97316",
      radius: [24],
      strokeWidth: [2.5],
    },
    {
      title: "CrossFit Logo | Functional Fitness Branding",
      description: "Design an intense CrossFit logo for functional fitness gyms.",
      keywords: ["crossfit logo", "functional fitness logo", "wod logo"],
    }
  ),
  createTemplate(
    "yoga-studio-logo",
    "Yoga Studio",
    "Peaceful and balanced logo for yoga and wellness",
    "health-fitness",
    ["yoga", "wellness", "meditation", "zen", "mindfulness"],
    {
      iconType: "lucide",
      iconName: "Flower2",
      bgMode: "gradient",
      gradientStart: "#fce7f3",
      gradientEnd: "#ddd6fe",
      gradientAngle: [135],
      iconColor: "#7c3aed",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Yoga Studio Logo Template | Wellness Logo Maker",
      description: "Design a serene yoga studio logo for meditation centers.",
      keywords: ["yoga logo", "wellness logo", "meditation logo", "zen logo"],
    },
    true,
    2
  ),
  createTemplate(
    "pilates-studio-logo",
    "Pilates Studio",
    "Elegant logo for pilates and body conditioning",
    "health-fitness",
    ["pilates", "conditioning", "core", "flexibility", "studio"],
    {
      iconType: "lucide",
      iconName: "Waves",
      bgMode: "solid",
      bgColor: "#faf5ff",
      iconColor: "#9333ea",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Pilates Studio Logo | Body Conditioning Branding",
      description: "Create an elegant pilates studio logo for body conditioning.",
      keywords: ["pilates logo", "conditioning logo", "studio logo"],
    }
  ),
  createTemplate(
    "health-clinic-logo",
    "Health Clinic",
    "Trustworthy logo for medical and health services",
    "health-fitness",
    ["health", "medical", "clinic", "hospital", "doctor"],
    {
      iconType: "lucide",
      iconName: "HeartPulse",
      bgMode: "solid",
      bgColor: "#ffffff",
      iconColor: "#dc2626",
      radius: [20],
      strokeWidth: [2],
      borderWidth: [2],
      borderColor: "#fecaca",
    },
    {
      title: "Health Clinic Logo Template | Medical Logo Maker",
      description: "Create a professional health clinic logo for medical practices.",
      keywords: ["health logo", "medical logo", "clinic logo", "doctor logo"],
    }
  ),
  createTemplate(
    "dental-clinic-logo",
    "Dental Clinic",
    "Clean and friendly logo for dental practices",
    "health-fitness",
    ["dental", "dentist", "teeth", "smile", "oral"],
    {
      iconType: "lucide",
      iconName: "SmilePlus",
      bgMode: "gradient",
      gradientStart: "#67e8f9",
      gradientEnd: "#22d3ee",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Dental Clinic Logo | Dentist Branding",
      description: "Design a friendly dental clinic logo for dentist practices.",
      keywords: ["dental logo", "dentist logo", "teeth logo", "smile logo"],
    }
  ),
  createTemplate(
    "nutrition-logo",
    "Nutrition & Diet",
    "Fresh logo for nutritionists and diet coaches",
    "health-fitness",
    ["nutrition", "diet", "healthy", "food", "wellness"],
    {
      iconType: "lucide",
      iconName: "Apple",
      bgMode: "gradient",
      gradientStart: "#4ade80",
      gradientEnd: "#22c55e",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Nutrition Logo Template | Diet Coach Logo Maker",
      description: "Design a fresh nutrition logo for dietitians and health coaches.",
      keywords: ["nutrition logo", "diet logo", "dietitian logo", "health coach logo"],
    }
  ),
  createTemplate(
    "mental-health-logo",
    "Mental Health",
    "Supportive logo for mental health services",
    "health-fitness",
    ["mental health", "therapy", "counseling", "psychology", "mindset"],
    {
      iconType: "lucide",
      iconName: "Brain",
      bgMode: "solid",
      bgColor: "#dbeafe",
      iconColor: "#2563eb",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Mental Health Logo | Therapy Branding",
      description: "Create a supportive mental health logo for therapy services.",
      keywords: ["mental health logo", "therapy logo", "counseling logo"],
    }
  ),
  createTemplate(
    "personal-trainer-logo",
    "Personal Trainer",
    "Motivational logo for personal trainers",
    "health-fitness",
    ["personal trainer", "coach", "fitness", "motivation", "training"],
    {
      iconType: "lucide",
      iconName: "Target",
      bgMode: "gradient",
      gradientStart: "#f97316",
      gradientEnd: "#ea580c",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [20],
      strokeWidth: [2.5],
    },
    {
      title: "Personal Trainer Logo | Fitness Coach Branding",
      description: "Design a motivational personal trainer logo for fitness coaches.",
      keywords: ["personal trainer logo", "coach logo", "fitness logo"],
    }
  ),
  createTemplate(
    "spa-wellness-logo",
    "Spa & Wellness",
    "Relaxing logo for spas and wellness centers",
    "health-fitness",
    ["spa", "wellness", "relaxation", "massage", "retreat"],
    {
      iconType: "lucide",
      iconName: "Droplets",
      bgMode: "gradient",
      gradientStart: "#5eead4",
      gradientEnd: "#2dd4bf",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Spa Logo | Wellness Center Branding",
      description: "Create a relaxing spa logo for wellness and massage centers.",
      keywords: ["spa logo", "wellness logo", "massage logo", "retreat logo"],
    }
  ),
  createTemplate(
    "pharmacy-logo",
    "Pharmacy",
    "Professional logo for pharmacies and drugstores",
    "health-fitness",
    ["pharmacy", "drugstore", "medicine", "prescription", "health"],
    {
      iconType: "lucide",
      iconName: "Pill",
      bgMode: "solid",
      bgColor: "#ffffff",
      iconColor: "#16a34a",
      radius: [24],
      strokeWidth: [2],
      borderWidth: [2],
      borderColor: "#16a34a",
    },
    {
      title: "Pharmacy Logo | Drugstore Branding",
      description: "Design a professional pharmacy logo for drugstores.",
      keywords: ["pharmacy logo", "drugstore logo", "medicine logo"],
    }
  ),
];

// ============== CREATIVE AGENCY TEMPLATES ==============
const creativeAgencyTemplates: TemplateInsert[] = [
  createTemplate(
    "design-studio-logo",
    "Design Studio",
    "Creative logo for design agencies and studios",
    "creative-agency",
    ["design", "studio", "creative", "agency", "art"],
    {
      iconType: "lucide",
      iconName: "Palette",
      bgMode: "solid",
      bgColor: "#ffffff",
      iconColor: "#000000",
      radius: [0],
      strokeWidth: [1.5],
      borderWidth: [2],
      borderColor: "#000000",
    },
    {
      title: "Design Studio Logo Template | Creative Agency Logo Maker",
      description: "Create an artistic design studio logo for creative agencies.",
      keywords: ["design studio logo", "creative agency logo", "graphic design logo"],
    },
    true,
    1
  ),
  createTemplate(
    "marketing-agency-logo",
    "Marketing Agency",
    "Bold logo for marketing and advertising agencies",
    "creative-agency",
    ["marketing", "advertising", "agency", "digital", "growth"],
    {
      iconType: "lucide",
      iconName: "TrendingUp",
      bgMode: "gradient",
      gradientStart: "#f97316",
      gradientEnd: "#ea580c",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2.5],
    },
    {
      title: "Marketing Agency Logo Template | Advertising Logo Maker",
      description: "Design a bold marketing agency logo for digital marketing.",
      keywords: ["marketing agency logo", "advertising logo", "digital marketing logo"],
    },
    true,
    2
  ),
  createTemplate(
    "video-production-logo",
    "Video Production",
    "Dynamic logo for video and film production",
    "creative-agency",
    ["video", "film", "production", "cinema", "media"],
    {
      iconType: "lucide",
      iconName: "Clapperboard",
      bgMode: "solid",
      bgColor: "#1c1917",
      iconColor: "#fbbf24",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "Video Production Logo Template | Film Logo Maker",
      description: "Create a dynamic video production logo for filmmakers.",
      keywords: ["video production logo", "film logo", "cinema logo", "media logo"],
    }
  ),
  createTemplate(
    "branding-agency-logo",
    "Branding Agency",
    "Strategic logo for brand strategy agencies",
    "creative-agency",
    ["branding", "brand", "strategy", "identity", "consulting"],
    {
      iconType: "lucide",
      iconName: "Layers",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#f8fafc",
      radius: [20],
      strokeWidth: [1.5],
    },
    {
      title: "Branding Agency Logo | Brand Strategy Branding",
      description: "Design a strategic branding agency logo for identity consultants.",
      keywords: ["branding agency logo", "brand strategy logo", "identity logo"],
    }
  ),
  createTemplate(
    "web-design-logo",
    "Web Design Agency",
    "Modern logo for web design and development agencies",
    "creative-agency",
    ["web design", "development", "website", "ui", "ux"],
    {
      iconType: "lucide",
      iconName: "Layout",
      bgMode: "gradient",
      gradientStart: "#3b82f6",
      gradientEnd: "#6366f1",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Web Design Logo | Website Agency Branding",
      description: "Create a modern web design agency logo for developers.",
      keywords: ["web design logo", "development logo", "website logo"],
    }
  ),
  createTemplate(
    "content-agency-logo",
    "Content Agency",
    "Creative logo for content creation agencies",
    "creative-agency",
    ["content", "copywriting", "blog", "social media", "creator"],
    {
      iconType: "lucide",
      iconName: "PenTool",
      bgMode: "solid",
      bgColor: "#fef3c7",
      iconColor: "#92400e",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Content Agency Logo | Copywriting Branding",
      description: "Design a creative content agency logo for writers and creators.",
      keywords: ["content agency logo", "copywriting logo", "blog logo"],
    }
  ),
  createTemplate(
    "animation-studio-logo",
    "Animation Studio",
    "Playful logo for animation and motion graphics",
    "creative-agency",
    ["animation", "motion", "graphics", "3d", "vfx"],
    {
      iconType: "lucide",
      iconName: "Sparkles",
      bgMode: "gradient",
      gradientStart: "#a855f7",
      gradientEnd: "#ec4899",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Animation Studio Logo | Motion Graphics Branding",
      description: "Create a playful animation studio logo for motion graphics.",
      keywords: ["animation logo", "motion graphics logo", "3d logo", "vfx logo"],
    }
  ),
  createTemplate(
    "illustration-studio-logo",
    "Illustration Studio",
    "Artistic logo for illustrators and artists",
    "creative-agency",
    ["illustration", "art", "drawing", "artist", "creative"],
    {
      iconType: "lucide",
      iconName: "Brush",
      bgMode: "solid",
      bgColor: "#fae8ff",
      iconColor: "#a855f7",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Illustration Studio Logo | Artist Branding",
      description: "Design an artistic illustration studio logo for artists.",
      keywords: ["illustration logo", "artist logo", "drawing logo"],
    }
  ),
  createTemplate(
    "social-media-agency-logo",
    "Social Media Agency",
    "Trendy logo for social media marketing agencies",
    "creative-agency",
    ["social media", "instagram", "tiktok", "influencer", "viral"],
    {
      iconType: "lucide",
      iconName: "Share2",
      bgMode: "gradient",
      gradientStart: "#f472b6",
      gradientEnd: "#8b5cf6",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Social Media Agency Logo | Marketing Branding",
      description: "Create a trendy social media agency logo for marketers.",
      keywords: ["social media logo", "instagram logo", "marketing logo"],
    }
  ),
  createTemplate(
    "pr-agency-logo",
    "PR Agency",
    "Professional logo for public relations agencies",
    "creative-agency",
    ["pr", "public relations", "communications", "media", "press"],
    {
      iconType: "lucide",
      iconName: "Megaphone",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#60a5fa",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "PR Agency Logo | Communications Branding",
      description: "Design a professional PR agency logo for communications firms.",
      keywords: ["pr agency logo", "public relations logo", "communications logo"],
    }
  ),
];

// Continue with more categories...
// ============== FINANCE TEMPLATES ==============
const financeTemplates: TemplateInsert[] = [
  createTemplate(
    "fintech-logo",
    "Fintech",
    "Modern logo for fintech and financial technology",
    "finance",
    ["fintech", "finance", "banking", "money", "payment"],
    {
      iconType: "lucide",
      iconName: "Wallet",
      bgMode: "gradient",
      gradientStart: "#10b981",
      gradientEnd: "#059669",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Fintech Logo Template | Financial Technology Logo Maker",
      description: "Design a modern fintech logo for payment apps and banking.",
      keywords: ["fintech logo", "finance logo", "banking logo", "payment logo"],
    },
    true,
    1
  ),
  createTemplate(
    "accounting-logo",
    "Accounting Firm",
    "Professional logo for accountants and bookkeepers",
    "finance",
    ["accounting", "bookkeeping", "finance", "tax", "cpa"],
    {
      iconType: "lucide",
      iconName: "Calculator",
      bgMode: "solid",
      bgColor: "#1e3a5f",
      iconColor: "#ffffff",
      radius: [12],
      strokeWidth: [1.5],
    },
    {
      title: "Accounting Firm Logo Template | CPA Logo Maker",
      description: "Create a professional accounting firm logo for CPAs.",
      keywords: ["accounting logo", "cpa logo", "bookkeeper logo", "tax logo"],
    }
  ),
  createTemplate(
    "crypto-logo",
    "Crypto & Blockchain",
    "Futuristic logo for cryptocurrency and blockchain",
    "finance",
    ["crypto", "blockchain", "bitcoin", "web3", "defi"],
    {
      iconType: "lucide",
      iconName: "Coins",
      bgMode: "solid",
      bgColor: "#09090b",
      iconColorMode: "gradient",
      iconColorGradientStart: "#f59e0b",
      iconColorGradientEnd: "#f97316",
      iconColorGradientAngle: [45],
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Crypto Logo Template | Blockchain Logo Maker",
      description: "Design a futuristic crypto logo for blockchain projects.",
      keywords: ["crypto logo", "blockchain logo", "bitcoin logo", "web3 logo"],
    },
    true,
    2
  ),
  createTemplate(
    "investment-logo",
    "Investment Firm",
    "Trustworthy logo for investment and wealth management",
    "finance",
    ["investment", "wealth", "portfolio", "assets", "management"],
    {
      iconType: "lucide",
      iconName: "LineChart",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#22c55e",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "Investment Firm Logo | Wealth Management Branding",
      description: "Create a trustworthy investment firm logo for wealth managers.",
      keywords: ["investment logo", "wealth management logo", "portfolio logo"],
    }
  ),
  createTemplate(
    "insurance-logo",
    "Insurance Company",
    "Reliable logo for insurance providers",
    "finance",
    ["insurance", "coverage", "protection", "policy", "claims"],
    {
      iconType: "lucide",
      iconName: "Umbrella",
      bgMode: "gradient",
      gradientStart: "#2563eb",
      gradientEnd: "#1d4ed8",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Insurance Logo | Coverage Provider Branding",
      description: "Design a reliable insurance company logo for coverage providers.",
      keywords: ["insurance logo", "coverage logo", "protection logo"],
    }
  ),
  createTemplate(
    "banking-logo",
    "Banking",
    "Secure logo for banks and credit unions",
    "finance",
    ["banking", "bank", "credit union", "savings", "deposits"],
    {
      iconType: "lucide",
      iconName: "Landmark",
      bgMode: "solid",
      bgColor: "#1e3a8a",
      iconColor: "#ffffff",
      radius: [12],
      strokeWidth: [1.5],
    },
    {
      title: "Banking Logo | Bank Branding",
      description: "Create a secure banking logo for financial institutions.",
      keywords: ["banking logo", "bank logo", "credit union logo"],
    }
  ),
  createTemplate(
    "trading-platform-logo",
    "Trading Platform",
    "Dynamic logo for stock trading platforms",
    "finance",
    ["trading", "stocks", "market", "exchange", "broker"],
    {
      iconType: "lucide",
      iconName: "CandlestickChart",
      bgMode: "solid",
      bgColor: "#09090b",
      iconColor: "#4ade80",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Trading Platform Logo | Stock Market Branding",
      description: "Design a dynamic trading platform logo for stock exchanges.",
      keywords: ["trading logo", "stocks logo", "market logo", "broker logo"],
    }
  ),
  createTemplate(
    "mortgage-logo",
    "Mortgage Company",
    "Home-focused logo for mortgage lenders",
    "finance",
    ["mortgage", "home loan", "lending", "real estate", "housing"],
    {
      iconType: "lucide",
      iconName: "Home",
      bgMode: "gradient",
      gradientStart: "#0ea5e9",
      gradientEnd: "#0284c7",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Mortgage Logo | Home Loan Branding",
      description: "Create a home-focused mortgage logo for lending companies.",
      keywords: ["mortgage logo", "home loan logo", "lending logo"],
    }
  ),
];

// ============== ECOMMERCE TEMPLATES ==============
const ecommerceTemplates: TemplateInsert[] = [
  createTemplate(
    "online-store-logo",
    "Online Store",
    "Modern logo for e-commerce and online shops",
    "ecommerce",
    ["ecommerce", "shop", "store", "retail", "online"],
    {
      iconType: "lucide",
      iconName: "ShoppingBag",
      bgMode: "gradient",
      gradientStart: "#8b5cf6",
      gradientEnd: "#6366f1",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Online Store Logo Template | E-commerce Logo Maker",
      description: "Design a professional online store logo for Shopify and retail.",
      keywords: ["online store logo", "ecommerce logo", "shop logo", "retail logo"],
    },
    true,
    1
  ),
  createTemplate(
    "marketplace-logo",
    "Marketplace",
    "Connected logo for online marketplaces",
    "ecommerce",
    ["marketplace", "platform", "vendors", "sellers", "buyers"],
    {
      iconType: "lucide",
      iconName: "Store",
      bgMode: "gradient",
      gradientStart: "#f97316",
      gradientEnd: "#ea580c",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Marketplace Logo | Multi-Vendor Platform Branding",
      description: "Create a connected marketplace logo for multi-vendor platforms.",
      keywords: ["marketplace logo", "platform logo", "vendor logo"],
    }
  ),
  createTemplate(
    "subscription-box-logo",
    "Subscription Box",
    "Exciting logo for subscription box services",
    "ecommerce",
    ["subscription", "box", "curated", "monthly", "delivery"],
    {
      iconType: "lucide",
      iconName: "Gift",
      bgMode: "gradient",
      gradientStart: "#ec4899",
      gradientEnd: "#f472b6",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Subscription Box Logo | Curated Delivery Branding",
      description: "Design an exciting subscription box logo for delivery services.",
      keywords: ["subscription box logo", "curated logo", "monthly box logo"],
    }
  ),
  createTemplate(
    "dropshipping-logo",
    "Dropshipping Store",
    "Efficient logo for dropshipping businesses",
    "ecommerce",
    ["dropshipping", "fulfillment", "supplier", "wholesale", "import"],
    {
      iconType: "lucide",
      iconName: "Package",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#38bdf8",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Dropshipping Logo | E-commerce Fulfillment Branding",
      description: "Create an efficient dropshipping logo for online retailers.",
      keywords: ["dropshipping logo", "fulfillment logo", "ecommerce logo"],
    }
  ),
  createTemplate(
    "handmade-shop-logo",
    "Handmade Shop",
    "Artisan logo for handmade and craft shops",
    "ecommerce",
    ["handmade", "craft", "artisan", "homemade", "etsy"],
    {
      iconType: "lucide",
      iconName: "Scissors",
      bgMode: "solid",
      bgColor: "#fef3c7",
      iconColor: "#92400e",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Handmade Shop Logo | Artisan Craft Branding",
      description: "Design an artisan handmade shop logo for craft sellers.",
      keywords: ["handmade logo", "craft logo", "artisan logo", "etsy logo"],
    }
  ),
  createTemplate(
    "luxury-brand-logo",
    "Luxury Brand",
    "Premium logo for luxury and high-end products",
    "ecommerce",
    ["luxury", "premium", "high-end", "exclusive", "designer"],
    {
      iconType: "lucide",
      iconName: "Crown",
      bgMode: "solid",
      bgColor: "#0c0a09",
      iconColor: "#d4af37",
      radius: [0],
      strokeWidth: [1],
    },
    {
      title: "Luxury Brand Logo | Premium Product Branding",
      description: "Create a premium luxury brand logo for high-end products.",
      keywords: ["luxury logo", "premium logo", "high-end logo", "designer logo"],
    }
  ),
];

// ============== EDUCATION TEMPLATES ==============
const educationTemplates: TemplateInsert[] = [
  createTemplate(
    "online-course-logo",
    "Online Course",
    "Professional logo for e-learning and online courses",
    "education",
    ["education", "course", "learning", "online", "school"],
    {
      iconType: "lucide",
      iconName: "GraduationCap",
      bgMode: "gradient",
      gradientStart: "#3b82f6",
      gradientEnd: "#1d4ed8",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Online Course Logo Template | Education Logo Maker",
      description: "Design a professional online course logo for e-learning.",
      keywords: ["online course logo", "education logo", "e-learning logo", "school logo"],
    },
    true,
    1
  ),
  createTemplate(
    "tutoring-logo",
    "Tutoring Service",
    "Friendly logo for tutors and educational services",
    "education",
    ["tutoring", "teacher", "education", "learning", "study"],
    {
      iconType: "lucide",
      iconName: "BookOpen",
      bgMode: "solid",
      bgColor: "#fef3c7",
      iconColor: "#d97706",
      radius: [40],
      strokeWidth: [2],
    },
    {
      title: "Tutoring Logo Template | Education Logo Maker",
      description: "Create a friendly tutoring service logo for educators.",
      keywords: ["tutoring logo", "teacher logo", "education logo"],
    }
  ),
  createTemplate(
    "coding-bootcamp-logo",
    "Coding Bootcamp",
    "Tech-focused logo for coding schools",
    "education",
    ["coding", "bootcamp", "programming", "developer", "tech"],
    {
      iconType: "lucide",
      iconName: "Code",
      bgMode: "solid",
      bgColor: "#18181b",
      iconColor: "#22d3ee",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "Coding Bootcamp Logo | Programming School Branding",
      description: "Design a tech-focused coding bootcamp logo for developers.",
      keywords: ["coding bootcamp logo", "programming logo", "developer school logo"],
    }
  ),
  createTemplate(
    "language-school-logo",
    "Language School",
    "Global logo for language learning centers",
    "education",
    ["language", "school", "learning", "translation", "linguistics"],
    {
      iconType: "lucide",
      iconName: "Globe",
      bgMode: "gradient",
      gradientStart: "#8b5cf6",
      gradientEnd: "#6366f1",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Language School Logo | Learning Center Branding",
      description: "Create a global language school logo for education centers.",
      keywords: ["language school logo", "learning logo", "translation logo"],
    }
  ),
  createTemplate(
    "kids-education-logo",
    "Kids Education",
    "Playful logo for children's educational services",
    "education",
    ["kids", "children", "preschool", "daycare", "learning"],
    {
      iconType: "lucide",
      iconName: "Baby",
      bgMode: "gradient",
      gradientStart: "#fbbf24",
      gradientEnd: "#f97316",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Kids Education Logo | Children's Learning Branding",
      description: "Design a playful kids education logo for preschools.",
      keywords: ["kids education logo", "children logo", "preschool logo"],
    }
  ),
  createTemplate(
    "university-logo",
    "University",
    "Academic logo for universities and colleges",
    "education",
    ["university", "college", "academic", "higher education", "campus"],
    {
      iconType: "lucide",
      iconName: "Building",
      bgMode: "solid",
      bgColor: "#1e3a8a",
      iconColor: "#fbbf24",
      radius: [12],
      strokeWidth: [1.5],
    },
    {
      title: "University Logo | Academic Branding",
      description: "Create an academic university logo for higher education.",
      keywords: ["university logo", "college logo", "academic logo"],
    }
  ),
];

// ============== ADDITIONAL CATEGORY TEMPLATES ==============
const travelTemplates: TemplateInsert[] = [
  createTemplate(
    "travel-agency-logo",
    "Travel Agency",
    "Adventurous logo for travel and tourism",
    "travel",
    ["travel", "tourism", "vacation", "adventure", "explore"],
    {
      iconType: "lucide",
      iconName: "Plane",
      bgMode: "gradient",
      gradientStart: "#0ea5e9",
      gradientEnd: "#0284c7",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [40],
      strokeWidth: [2],
    },
    {
      title: "Travel Agency Logo Template | Tourism Logo Maker",
      description: "Create an adventurous travel agency logo for tour operators.",
      keywords: ["travel agency logo", "tourism logo", "vacation logo"],
    },
    true,
    1
  ),
  createTemplate(
    "hotel-logo",
    "Hotel & Resort",
    "Luxurious logo for hotels and resorts",
    "travel",
    ["hotel", "resort", "hospitality", "accommodation", "luxury"],
    {
      iconType: "lucide",
      iconName: "Building2",
      bgMode: "solid",
      bgColor: "#1c1917",
      iconColor: "#d4af37",
      radius: [0],
      strokeWidth: [1.5],
      borderWidth: [2],
      borderColor: "#d4af37",
    },
    {
      title: "Hotel Logo Template | Resort Logo Maker",
      description: "Design a luxurious hotel logo for resorts and hospitality.",
      keywords: ["hotel logo", "resort logo", "hospitality logo"],
    }
  ),
  createTemplate(
    "camping-logo",
    "Camping & Outdoors",
    "Adventure logo for camping and outdoor activities",
    "travel",
    ["camping", "outdoors", "hiking", "nature", "adventure"],
    {
      iconType: "lucide",
      iconName: "Tent",
      bgMode: "solid",
      bgColor: "#166534",
      iconColor: "#ffffff",
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Camping Logo | Outdoor Adventure Branding",
      description: "Create an adventure camping logo for outdoor activities.",
      keywords: ["camping logo", "outdoors logo", "hiking logo", "adventure logo"],
    }
  ),
  createTemplate(
    "airline-logo",
    "Airline",
    "Sleek logo for airlines and aviation",
    "travel",
    ["airline", "aviation", "flights", "travel", "airport"],
    {
      iconType: "lucide",
      iconName: "PlaneTakeoff",
      bgMode: "gradient",
      gradientStart: "#1e40af",
      gradientEnd: "#1e3a8a",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "Airline Logo | Aviation Branding",
      description: "Design a sleek airline logo for aviation companies.",
      keywords: ["airline logo", "aviation logo", "flights logo"],
    }
  ),
];

const gamingTemplates: TemplateInsert[] = [
  createTemplate(
    "gaming-logo",
    "Gaming Studio",
    "Bold logo for gaming studios and esports",
    "gaming",
    ["gaming", "esports", "game", "studio", "streamer"],
    {
      iconType: "lucide",
      iconName: "Gamepad2",
      bgMode: "solid",
      bgColor: "#171717",
      iconColor: "#ef4444",
      radius: [24],
      strokeWidth: [2],
      borderWidth: [2],
      borderColor: "#ef4444",
      shadowColor: "#ef4444",
      shadowOpacity: [0.5],
      shadowBlur: [20],
    },
    {
      title: "Gaming Logo Template | Esports Logo Maker",
      description: "Create a bold gaming studio logo for esports teams.",
      keywords: ["gaming logo", "esports logo", "game studio logo", "streamer logo"],
    },
    true,
    1
  ),
  createTemplate(
    "twitch-streamer-logo",
    "Twitch Streamer",
    "Eye-catching logo for streamers and content creators",
    "gaming",
    ["twitch", "streamer", "youtube", "content", "creator"],
    {
      iconType: "lucide",
      iconName: "Play",
      bgMode: "gradient",
      gradientStart: "#9333ea",
      gradientEnd: "#6366f1",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2.5],
      iconFillColor: "#ffffff",
      iconFillOpacity: [30],
    },
    {
      title: "Twitch Streamer Logo | Content Creator Logo Maker",
      description: "Design an eye-catching streamer logo for Twitch and YouTube.",
      keywords: ["twitch logo", "streamer logo", "youtube logo", "creator logo"],
    }
  ),
  createTemplate(
    "mobile-game-logo",
    "Mobile Game",
    "Fun logo for mobile game developers",
    "gaming",
    ["mobile game", "app game", "casual", "puzzle", "arcade"],
    {
      iconType: "lucide",
      iconName: "Joystick",
      bgMode: "gradient",
      gradientStart: "#f472b6",
      gradientEnd: "#a855f7",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [40],
      strokeWidth: [2],
    },
    {
      title: "Mobile Game Logo | App Game Branding",
      description: "Create a fun mobile game logo for app developers.",
      keywords: ["mobile game logo", "app game logo", "casual game logo"],
    }
  ),
  createTemplate(
    "indie-game-logo",
    "Indie Game Studio",
    "Creative logo for independent game developers",
    "gaming",
    ["indie", "game dev", "independent", "creative", "studio"],
    {
      iconType: "lucide",
      iconName: "Dices",
      bgMode: "solid",
      bgColor: "#1e1b4b",
      iconColor: "#c4b5fd",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Indie Game Logo | Independent Studio Branding",
      description: "Design a creative indie game logo for independent developers.",
      keywords: ["indie game logo", "game dev logo", "independent studio logo"],
    }
  ),
];

const photographyTemplates: TemplateInsert[] = [
  createTemplate(
    "photography-studio-logo",
    "Photography Studio",
    "Artistic logo for photographers and studios",
    "photography",
    ["photography", "camera", "studio", "photo", "portrait"],
    {
      iconType: "lucide",
      iconName: "Camera",
      bgMode: "solid",
      bgColor: "#000000",
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Photography Studio Logo | Camera Logo Maker",
      description: "Create an artistic photography studio logo for photographers.",
      keywords: ["photography logo", "camera logo", "studio logo", "portrait logo"],
    },
    true,
    1
  ),
  createTemplate(
    "wedding-photographer-logo",
    "Wedding Photography",
    "Elegant logo for wedding photographers",
    "photography",
    ["wedding", "photography", "romance", "love", "elegant"],
    {
      iconType: "lucide",
      iconName: "Heart",
      bgMode: "gradient",
      gradientStart: "#fdf2f8",
      gradientEnd: "#fce7f3",
      gradientAngle: [180],
      iconColor: "#be185d",
      radius: [100],
      strokeWidth: [1.5],
      borderWidth: [1],
      borderColor: "#fbcfe8",
    },
    {
      title: "Wedding Photography Logo | Elegant Logo Maker",
      description: "Design an elegant wedding photography logo.",
      keywords: ["wedding photography logo", "wedding logo", "elegant logo"],
    }
  ),
  createTemplate(
    "product-photography-logo",
    "Product Photography",
    "Commercial logo for product photographers",
    "photography",
    ["product", "commercial", "ecommerce", "catalog", "professional"],
    {
      iconType: "lucide",
      iconName: "Focus",
      bgMode: "solid",
      bgColor: "#f8fafc",
      iconColor: "#0f172a",
      radius: [16],
      strokeWidth: [2],
      borderWidth: [2],
      borderColor: "#e2e8f0",
    },
    {
      title: "Product Photography Logo | Commercial Photo Branding",
      description: "Create a commercial product photography logo.",
      keywords: ["product photography logo", "commercial photo logo"],
    }
  ),
];

const petTemplates: TemplateInsert[] = [
  createTemplate(
    "pet-shop-logo",
    "Pet Shop",
    "Friendly logo for pet stores and animal services",
    "pets",
    ["pets", "shop", "animal", "dog", "cat"],
    {
      iconType: "lucide",
      iconName: "PawPrint",
      bgMode: "gradient",
      gradientStart: "#f472b6",
      gradientEnd: "#ec4899",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [40],
      strokeWidth: [2],
    },
    {
      title: "Pet Shop Logo Template | Animal Services Logo Maker",
      description: "Create a friendly pet shop logo for animal services.",
      keywords: ["pet shop logo", "animal logo", "dog logo", "cat logo"],
    },
    true,
    1
  ),
  createTemplate(
    "veterinary-logo",
    "Veterinary Clinic",
    "Caring logo for veterinarians and animal hospitals",
    "pets",
    ["veterinary", "vet", "animal", "clinic", "hospital"],
    {
      iconType: "lucide",
      iconName: "Stethoscope",
      bgMode: "solid",
      bgColor: "#ecfdf5",
      iconColor: "#059669",
      radius: [24],
      strokeWidth: [2],
      borderWidth: [2],
      borderColor: "#a7f3d0",
    },
    {
      title: "Veterinary Logo Template | Animal Clinic Logo Maker",
      description: "Design a caring veterinary clinic logo.",
      keywords: ["veterinary logo", "vet logo", "animal clinic logo"],
    }
  ),
  createTemplate(
    "dog-grooming-logo",
    "Dog Grooming",
    "Clean logo for pet grooming services",
    "pets",
    ["grooming", "dog", "pet care", "salon", "wash"],
    {
      iconType: "lucide",
      iconName: "Dog",
      bgMode: "gradient",
      gradientStart: "#67e8f9",
      gradientEnd: "#22d3ee",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Dog Grooming Logo | Pet Salon Branding",
      description: "Create a clean dog grooming logo for pet salons.",
      keywords: ["dog grooming logo", "pet salon logo", "pet care logo"],
    }
  ),
];

const realEstateTemplates: TemplateInsert[] = [
  createTemplate(
    "real-estate-logo",
    "Real Estate Agency",
    "Professional logo for real estate and property",
    "real-estate",
    ["real estate", "property", "home", "house", "realtor"],
    {
      iconType: "lucide",
      iconName: "Home",
      bgMode: "solid",
      bgColor: "#1e3a5f",
      iconColor: "#ffffff",
      radius: [16],
      strokeWidth: [2],
    },
    {
      title: "Real Estate Logo Template | Property Logo Maker",
      description: "Create a professional real estate logo for realtors.",
      keywords: ["real estate logo", "property logo", "realtor logo", "home logo"],
    },
    true,
    1
  ),
  createTemplate(
    "property-management-logo",
    "Property Management",
    "Organized logo for property management companies",
    "real-estate",
    ["property management", "rental", "landlord", "tenant", "leasing"],
    {
      iconType: "lucide",
      iconName: "Key",
      bgMode: "gradient",
      gradientStart: "#0ea5e9",
      gradientEnd: "#0284c7",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Property Management Logo | Rental Branding",
      description: "Design an organized property management logo.",
      keywords: ["property management logo", "rental logo", "leasing logo"],
    }
  ),
  createTemplate(
    "home-builder-logo",
    "Home Builder",
    "Constructive logo for home builders and developers",
    "real-estate",
    ["home builder", "construction", "developer", "residential", "new homes"],
    {
      iconType: "lucide",
      iconName: "Hammer",
      bgMode: "solid",
      bgColor: "#fbbf24",
      iconColor: "#1c1917",
      radius: [16],
      strokeWidth: [2.5],
    },
    {
      title: "Home Builder Logo | Construction Branding",
      description: "Create a constructive home builder logo for developers.",
      keywords: ["home builder logo", "construction logo", "developer logo"],
    }
  ),
];

const nonprofitTemplates: TemplateInsert[] = [
  createTemplate(
    "nonprofit-logo",
    "Nonprofit Organization",
    "Inspiring logo for charities and nonprofits",
    "nonprofit",
    ["nonprofit", "charity", "ngo", "community", "giving"],
    {
      iconType: "lucide",
      iconName: "HandHeart",
      bgMode: "gradient",
      gradientStart: "#60a5fa",
      gradientEnd: "#3b82f6",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Nonprofit Logo Template | Charity Logo Maker",
      description: "Create an inspiring nonprofit logo for charities.",
      keywords: ["nonprofit logo", "charity logo", "ngo logo", "community logo"],
    },
    true,
    1
  ),
  createTemplate(
    "environmental-ngo-logo",
    "Environmental NGO",
    "Green logo for environmental organizations",
    "nonprofit",
    ["environmental", "green", "earth", "conservation", "climate"],
    {
      iconType: "lucide",
      iconName: "TreeDeciduous",
      bgMode: "gradient",
      gradientStart: "#22c55e",
      gradientEnd: "#16a34a",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Environmental NGO Logo | Conservation Branding",
      description: "Design a green environmental NGO logo for conservation.",
      keywords: ["environmental logo", "ngo logo", "conservation logo", "green logo"],
    }
  ),
  createTemplate(
    "community-center-logo",
    "Community Center",
    "Welcoming logo for community organizations",
    "nonprofit",
    ["community", "center", "local", "neighborhood", "social"],
    {
      iconType: "lucide",
      iconName: "Users",
      bgMode: "solid",
      bgColor: "#fef3c7",
      iconColor: "#d97706",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Community Center Logo | Local Organization Branding",
      description: "Create a welcoming community center logo.",
      keywords: ["community logo", "center logo", "neighborhood logo"],
    }
  ),
];

const legalTemplates: TemplateInsert[] = [
  createTemplate(
    "law-firm-logo",
    "Law Firm",
    "Authoritative logo for law firms and legal services",
    "legal",
    ["law", "legal", "attorney", "lawyer", "firm"],
    {
      iconType: "lucide",
      iconName: "Scale",
      bgMode: "solid",
      bgColor: "#1c1917",
      iconColor: "#d4af37",
      radius: [0],
      strokeWidth: [1.5],
    },
    {
      title: "Law Firm Logo Template | Legal Services Logo Maker",
      description: "Create an authoritative law firm logo for attorneys.",
      keywords: ["law firm logo", "legal logo", "attorney logo", "lawyer logo"],
    },
    true,
    1
  ),
  createTemplate(
    "corporate-law-logo",
    "Corporate Law",
    "Professional logo for corporate law firms",
    "legal",
    ["corporate law", "business law", "commercial", "litigation", "counsel"],
    {
      iconType: "lucide",
      iconName: "Briefcase",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#94a3b8",
      radius: [12],
      strokeWidth: [1.5],
    },
    {
      title: "Corporate Law Logo | Business Law Branding",
      description: "Design a professional corporate law logo.",
      keywords: ["corporate law logo", "business law logo", "commercial law logo"],
    }
  ),
];

const constructionTemplates: TemplateInsert[] = [
  createTemplate(
    "construction-company-logo",
    "Construction Company",
    "Strong logo for construction and building companies",
    "construction",
    ["construction", "building", "contractor", "architecture", "builder"],
    {
      iconType: "lucide",
      iconName: "HardHat",
      bgMode: "solid",
      bgColor: "#fbbf24",
      iconColor: "#1c1917",
      radius: [12],
      strokeWidth: [2.5],
    },
    {
      title: "Construction Logo Template | Building Company Logo Maker",
      description: "Design a strong construction company logo.",
      keywords: ["construction logo", "building logo", "contractor logo"],
    },
    true,
    1
  ),
  createTemplate(
    "roofing-logo",
    "Roofing Company",
    "Protective logo for roofing contractors",
    "construction",
    ["roofing", "roof", "contractor", "repair", "installation"],
    {
      iconType: "lucide",
      iconName: "Home",
      bgMode: "gradient",
      gradientStart: "#dc2626",
      gradientEnd: "#b91c1c",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Roofing Logo | Contractor Branding",
      description: "Create a protective roofing company logo.",
      keywords: ["roofing logo", "roof logo", "contractor logo"],
    }
  ),
  createTemplate(
    "electrician-logo",
    "Electrician",
    "Electric logo for electrical contractors",
    "construction",
    ["electrician", "electrical", "power", "wiring", "contractor"],
    {
      iconType: "lucide",
      iconName: "Zap",
      bgMode: "solid",
      bgColor: "#0f172a",
      iconColor: "#fbbf24",
      radius: [24],
      strokeWidth: [2.5],
    },
    {
      title: "Electrician Logo | Electrical Contractor Branding",
      description: "Design an electric logo for electrical services.",
      keywords: ["electrician logo", "electrical logo", "power logo"],
    }
  ),
  createTemplate(
    "plumbing-logo",
    "Plumbing Services",
    "Reliable logo for plumbing contractors",
    "construction",
    ["plumbing", "plumber", "pipes", "water", "repair"],
    {
      iconType: "lucide",
      iconName: "Droplet",
      bgMode: "gradient",
      gradientStart: "#0ea5e9",
      gradientEnd: "#0284c7",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Plumbing Logo | Plumber Branding",
      description: "Create a reliable plumbing services logo.",
      keywords: ["plumbing logo", "plumber logo", "pipes logo"],
    }
  ),
];

const automotiveTemplates: TemplateInsert[] = [
  createTemplate(
    "auto-shop-logo",
    "Auto Shop",
    "Rugged logo for auto shops and garages",
    "automotive",
    ["auto", "car", "garage", "mechanic", "repair"],
    {
      iconType: "lucide",
      iconName: "Wrench",
      bgMode: "solid",
      bgColor: "#27272a",
      iconColor: "#ef4444",
      radius: [16],
      strokeWidth: [2.5],
      borderWidth: [3],
      borderColor: "#ef4444",
    },
    {
      title: "Auto Shop Logo Template | Garage Logo Maker",
      description: "Design a rugged auto shop logo for mechanics.",
      keywords: ["auto shop logo", "garage logo", "mechanic logo", "car repair logo"],
    },
    true,
    1
  ),
  createTemplate(
    "car-dealership-logo",
    "Car Dealership",
    "Sleek logo for car dealerships",
    "automotive",
    ["car dealership", "auto sales", "vehicles", "showroom", "dealer"],
    {
      iconType: "lucide",
      iconName: "Car",
      bgMode: "gradient",
      gradientStart: "#0f172a",
      gradientEnd: "#1e293b",
      gradientAngle: [180],
      iconColor: "#60a5fa",
      radius: [20],
      strokeWidth: [2],
    },
    {
      title: "Car Dealership Logo | Auto Sales Branding",
      description: "Create a sleek car dealership logo.",
      keywords: ["car dealership logo", "auto sales logo", "dealer logo"],
    }
  ),
  createTemplate(
    "car-wash-logo",
    "Car Wash",
    "Clean logo for car wash services",
    "automotive",
    ["car wash", "detailing", "auto cleaning", "wash", "shine"],
    {
      iconType: "lucide",
      iconName: "Droplets",
      bgMode: "gradient",
      gradientStart: "#06b6d4",
      gradientEnd: "#0891b2",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [40],
      strokeWidth: [2],
    },
    {
      title: "Car Wash Logo | Auto Detailing Branding",
      description: "Design a clean car wash logo for detailing services.",
      keywords: ["car wash logo", "detailing logo", "auto cleaning logo"],
    }
  ),
];

const musicEntertainmentTemplates: TemplateInsert[] = [
  createTemplate(
    "music-producer-logo",
    "Music Producer",
    "Creative logo for music producers and DJs",
    "music-entertainment",
    ["music", "producer", "dj", "audio", "beats"],
    {
      iconType: "lucide",
      iconName: "Music",
      bgMode: "solid",
      bgColor: "#18181b",
      iconColorMode: "gradient",
      iconColorGradientStart: "#c084fc",
      iconColorGradientEnd: "#22d3ee",
      iconColorGradientAngle: [90],
      radius: [24],
      strokeWidth: [2],
    },
    {
      title: "Music Producer Logo Template | DJ Logo Maker",
      description: "Create a creative music producer logo for DJs.",
      keywords: ["music producer logo", "dj logo", "music logo", "beats logo"],
    },
    true,
    1
  ),
  createTemplate(
    "podcast-logo",
    "Podcast",
    "Modern logo for podcasts and audio shows",
    "music-entertainment",
    ["podcast", "audio", "show", "radio", "streaming"],
    {
      iconType: "lucide",
      iconName: "Mic",
      bgMode: "gradient",
      gradientStart: "#7c3aed",
      gradientEnd: "#a855f7",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Podcast Logo Template | Audio Show Logo Maker",
      description: "Design a modern podcast logo for audio shows.",
      keywords: ["podcast logo", "audio show logo", "radio logo"],
    }
  ),
  createTemplate(
    "record-label-logo",
    "Record Label",
    "Industry logo for record labels and music companies",
    "music-entertainment",
    ["record label", "music", "vinyl", "album", "artist"],
    {
      iconType: "lucide",
      iconName: "Disc3",
      bgMode: "solid",
      bgColor: "#0c0a09",
      iconColor: "#fbbf24",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Record Label Logo | Music Industry Branding",
      description: "Create an industry record label logo.",
      keywords: ["record label logo", "music label logo", "vinyl logo"],
    }
  ),
  createTemplate(
    "band-logo",
    "Band",
    "Bold logo for bands and musical groups",
    "music-entertainment",
    ["band", "rock", "music", "group", "concert"],
    {
      iconType: "lucide",
      iconName: "Guitar",
      bgMode: "solid",
      bgColor: "#171717",
      iconColor: "#ef4444",
      radius: [20],
      strokeWidth: [2.5],
    },
    {
      title: "Band Logo | Music Group Branding",
      description: "Design a bold band logo for musical groups.",
      keywords: ["band logo", "rock logo", "music group logo"],
    }
  ),
];

const natureEcoTemplates: TemplateInsert[] = [
  createTemplate(
    "eco-friendly-logo",
    "Eco-Friendly Brand",
    "Green logo for sustainable and eco-friendly brands",
    "nature-eco",
    ["eco", "green", "sustainable", "nature", "environment"],
    {
      iconType: "lucide",
      iconName: "Leaf",
      bgMode: "gradient",
      gradientStart: "#4ade80",
      gradientEnd: "#16a34a",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Eco-Friendly Logo Template | Green Brand Logo Maker",
      description: "Create a sustainable eco-friendly logo.",
      keywords: ["eco-friendly logo", "green logo", "sustainable logo", "nature logo"],
    },
    true,
    1
  ),
  createTemplate(
    "organic-farm-logo",
    "Organic Farm",
    "Natural logo for farms and organic products",
    "nature-eco",
    ["organic", "farm", "agriculture", "natural", "produce"],
    {
      iconType: "lucide",
      iconName: "Sprout",
      bgMode: "solid",
      bgColor: "#fef9c3",
      iconColor: "#65a30d",
      radius: [40],
      strokeWidth: [2],
      borderWidth: [2],
      borderColor: "#65a30d",
    },
    {
      title: "Organic Farm Logo | Agriculture Logo Maker",
      description: "Design a natural organic farm logo.",
      keywords: ["organic farm logo", "agriculture logo", "farm logo"],
    }
  ),
  createTemplate(
    "renewable-energy-logo",
    "Renewable Energy",
    "Clean energy logo for solar and wind companies",
    "nature-eco",
    ["renewable", "solar", "wind", "energy", "clean"],
    {
      iconType: "lucide",
      iconName: "Sun",
      bgMode: "gradient",
      gradientStart: "#fbbf24",
      gradientEnd: "#f59e0b",
      gradientAngle: [180],
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Renewable Energy Logo | Clean Energy Branding",
      description: "Create a clean renewable energy logo.",
      keywords: ["renewable energy logo", "solar logo", "wind logo", "clean energy logo"],
    }
  ),
  createTemplate(
    "recycling-logo",
    "Recycling Company",
    "Circular logo for recycling and waste management",
    "nature-eco",
    ["recycling", "waste", "management", "circular", "green"],
    {
      iconType: "lucide",
      iconName: "Recycle",
      bgMode: "solid",
      bgColor: "#166534",
      iconColor: "#dcfce7",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Recycling Logo | Waste Management Branding",
      description: "Design a circular recycling company logo.",
      keywords: ["recycling logo", "waste management logo", "green logo"],
    }
  ),
];

const sportsTemplates: TemplateInsert[] = [
  createTemplate(
    "sports-team-logo",
    "Sports Team",
    "Dynamic logo for sports teams and clubs",
    "sports",
    ["sports", "team", "club", "athletic", "league"],
    {
      iconType: "lucide",
      iconName: "Trophy",
      bgMode: "gradient",
      gradientStart: "#fbbf24",
      gradientEnd: "#f59e0b",
      gradientAngle: [180],
      iconColor: "#1c1917",
      radius: [20],
      strokeWidth: [2.5],
    },
    {
      title: "Sports Team Logo Template | Athletic Club Logo Maker",
      description: "Create a dynamic sports team logo.",
      keywords: ["sports team logo", "athletic logo", "club logo", "league logo"],
    },
    true,
    1
  ),
  createTemplate(
    "running-club-logo",
    "Running Club",
    "Energetic logo for running clubs and marathons",
    "sports",
    ["running", "marathon", "fitness", "track", "athletic"],
    {
      iconType: "lucide",
      iconName: "Footprints",
      bgMode: "solid",
      bgColor: "#dc2626",
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    {
      title: "Running Club Logo | Marathon Logo Maker",
      description: "Design an energetic running club logo.",
      keywords: ["running club logo", "marathon logo", "track logo"],
    }
  ),
  createTemplate(
    "boxing-gym-logo",
    "Boxing Gym",
    "Powerful logo for boxing and martial arts",
    "sports",
    ["boxing", "mma", "martial arts", "fighting", "gym"],
    {
      iconType: "lucide",
      iconName: "Swords",
      bgMode: "solid",
      bgColor: "#0c0a09",
      iconColor: "#ef4444",
      radius: [24],
      strokeWidth: [2.5],
    },
    {
      title: "Boxing Gym Logo | Martial Arts Branding",
      description: "Create a powerful boxing gym logo.",
      keywords: ["boxing logo", "mma logo", "martial arts logo"],
    }
  ),
  createTemplate(
    "golf-club-logo",
    "Golf Club",
    "Elegant logo for golf courses and clubs",
    "sports",
    ["golf", "club", "course", "country club", "sports"],
    {
      iconType: "lucide",
      iconName: "Target",
      bgMode: "solid",
      bgColor: "#166534",
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Golf Club Logo | Country Club Branding",
      description: "Design an elegant golf club logo.",
      keywords: ["golf logo", "golf club logo", "country club logo"],
    }
  ),
];

const fashionBeautyTemplates: TemplateInsert[] = [
  createTemplate(
    "fashion-brand-logo",
    "Fashion Brand",
    "Elegant logo for fashion and clothing brands",
    "fashion-beauty",
    ["fashion", "clothing", "apparel", "style", "boutique"],
    {
      iconType: "lucide",
      iconName: "Shirt",
      bgMode: "solid",
      bgColor: "#000000",
      iconColor: "#ffffff",
      radius: [0],
      strokeWidth: [1],
    },
    {
      title: "Fashion Brand Logo Template | Clothing Logo Maker",
      description: "Create an elegant fashion brand logo.",
      keywords: ["fashion logo", "clothing brand logo", "apparel logo", "boutique logo"],
    },
    true,
    1
  ),
  createTemplate(
    "beauty-salon-logo",
    "Beauty Salon",
    "Glamorous logo for beauty salons and spas",
    "fashion-beauty",
    ["beauty", "salon", "spa", "cosmetics", "makeup"],
    {
      iconType: "lucide",
      iconName: "Sparkles",
      bgMode: "gradient",
      gradientStart: "#fdf2f8",
      gradientEnd: "#fce7f3",
      gradientAngle: [135],
      iconColor: "#be185d",
      radius: [100],
      strokeWidth: [1.5],
    },
    {
      title: "Beauty Salon Logo Template | Spa Logo Maker",
      description: "Design a glamorous beauty salon logo.",
      keywords: ["beauty salon logo", "spa logo", "cosmetics logo", "makeup logo"],
    }
  ),
  createTemplate(
    "jewelry-logo",
    "Jewelry Brand",
    "Luxurious logo for jewelry and accessories",
    "fashion-beauty",
    ["jewelry", "accessories", "gems", "luxury", "diamonds"],
    {
      iconType: "lucide",
      iconName: "Gem",
      bgMode: "solid",
      bgColor: "#0c0a09",
      iconColor: "#d4af37",
      radius: [0],
      strokeWidth: [1],
    },
    {
      title: "Jewelry Logo | Accessories Brand Branding",
      description: "Create a luxurious jewelry brand logo.",
      keywords: ["jewelry logo", "accessories logo", "gem logo", "diamond logo"],
    }
  ),
  createTemplate(
    "hair-salon-logo",
    "Hair Salon",
    "Stylish logo for hair salons and stylists",
    "fashion-beauty",
    ["hair", "salon", "stylist", "barber", "hairdresser"],
    {
      iconType: "lucide",
      iconName: "Scissors",
      bgMode: "gradient",
      gradientStart: "#ec4899",
      gradientEnd: "#f472b6",
      gradientAngle: [135],
      iconColor: "#ffffff",
      radius: [32],
      strokeWidth: [2],
    },
    {
      title: "Hair Salon Logo | Stylist Branding",
      description: "Design a stylish hair salon logo.",
      keywords: ["hair salon logo", "stylist logo", "barber logo"],
    }
  ),
];

// Combine all templates
const allTemplates: TemplateInsert[] = [
  ...foodDrinkTemplates,
  ...techStartupTemplates,
  ...healthFitnessTemplates,
  ...creativeAgencyTemplates,
  ...financeTemplates,
  ...ecommerceTemplates,
  ...educationTemplates,
  ...travelTemplates,
  ...gamingTemplates,
  ...photographyTemplates,
  ...petTemplates,
  ...realEstateTemplates,
  ...nonprofitTemplates,
  ...legalTemplates,
  ...constructionTemplates,
  ...automotiveTemplates,
  ...musicEntertainmentTemplates,
  ...natureEcoTemplates,
  ...sportsTemplates,
  ...fashionBeautyTemplates,
];

async function seed() {
  console.log(`🌱 Seeding ${allTemplates.length} logo templates...`);

  try {
    // Clear existing templates
    await db.delete(logoTemplates);
    console.log("✅ Cleared existing templates");

    // Insert all templates
    await db.insert(logoTemplates).values(allTemplates);
    console.log(`✅ Inserted ${allTemplates.length} templates`);

    // Log category breakdown
    const categories = new Map<string, number>();
    for (const template of allTemplates) {
      categories.set(template.category, (categories.get(template.category) || 0) + 1);
    }
    console.log("\n📊 Templates by category:");
    for (const [category, count] of categories.entries()) {
      console.log(`   ${category}: ${count}`);
    }

    console.log("\n✨ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
