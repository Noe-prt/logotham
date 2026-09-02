import type { LogoConfig } from "@/lib/logo-types";
import { initialConfig } from "@/lib/logo-constants";

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
  slug: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  config: Partial<LogoConfig>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
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

export const logoTemplates: LogoTemplate[] = [
  // ============== FOOD & DRINK ==============
  {
    slug: "coffee-shop-logo",
    name: "Coffee Shop",
    description: "Warm and inviting logo perfect for cafes and coffee houses",
    category: "food-drink",
    tags: ["coffee", "cafe", "espresso", "barista", "roastery"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Coffee Shop Logo Template | Free Logo Maker",
      description:
        "Create a beautiful coffee shop logo in minutes. Perfect for cafes, roasteries, and espresso bars. Customize colors, fonts, and icons.",
      keywords: [
        "coffee shop logo",
        "cafe logo",
        "coffee logo maker",
        "barista logo",
        "coffee brand",
      ],
    },
  },
  {
    slug: "bakery-logo",
    name: "Bakery",
    description: "Sweet and classic design for bakeries and pastry shops",
    category: "food-drink",
    tags: ["bakery", "pastry", "bread", "cake", "dessert"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Bakery Logo Template | Free Logo Maker",
      description:
        "Design a delicious bakery logo for your pastry shop, bread store, or cake business. Easy customization with our free logo maker.",
      keywords: [
        "bakery logo",
        "pastry logo",
        "bread logo",
        "cake shop logo",
        "dessert brand",
      ],
    },
  },
  {
    slug: "restaurant-logo",
    name: "Restaurant",
    description: "Elegant dining logo for restaurants and eateries",
    category: "food-drink",
    tags: ["restaurant", "dining", "food", "chef", "kitchen"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Restaurant Logo Template | Free Logo Maker",
      description:
        "Create an elegant restaurant logo that captures your dining experience. Perfect for fine dining, bistros, and casual eateries.",
      keywords: [
        "restaurant logo",
        "dining logo",
        "food logo",
        "chef logo",
        "eatery brand",
      ],
    },
  },
  {
    slug: "pizza-logo",
    name: "Pizza Place",
    description: "Fun and appetizing logo for pizzerias",
    category: "food-drink",
    tags: ["pizza", "italian", "pizzeria", "fast food", "delivery"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Pizza Logo Template | Free Logo Maker",
      description:
        "Design a mouth-watering pizza logo for your pizzeria or Italian restaurant. Customize easily with our free logo maker.",
      keywords: [
        "pizza logo",
        "pizzeria logo",
        "italian restaurant logo",
        "pizza shop brand",
      ],
    },
  },
  {
    slug: "beer-brewery-logo",
    name: "Craft Brewery",
    description: "Rustic logo for craft breweries and beer brands",
    category: "food-drink",
    tags: ["beer", "brewery", "craft", "ale", "pub"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Brewery Logo Template | Craft Beer Logo Maker",
      description:
        "Create a distinctive craft brewery logo. Perfect for microbreweries, beer brands, and pubs.",
      keywords: [
        "brewery logo",
        "craft beer logo",
        "beer brand",
        "pub logo",
        "ale logo",
      ],
    },
  },

  // ============== TECH & STARTUP ==============
  {
    slug: "tech-startup-logo",
    name: "Tech Startup",
    description: "Modern and innovative logo for tech companies",
    category: "tech-startup",
    tags: ["tech", "startup", "innovation", "software", "app"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Tech Startup Logo Template | Free Logo Maker",
      description:
        "Launch your tech startup with a professional logo. Modern designs perfect for SaaS, apps, and innovative companies.",
      keywords: [
        "tech startup logo",
        "startup logo",
        "tech company logo",
        "saas logo",
        "app logo",
      ],
    },
  },
  {
    slug: "saas-logo",
    name: "SaaS Platform",
    description: "Clean and professional logo for SaaS products",
    category: "tech-startup",
    tags: ["saas", "software", "cloud", "platform", "b2b"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "SaaS Logo Template | Software Company Logo Maker",
      description:
        "Design a professional SaaS logo for your software platform. Clean, modern designs that build trust.",
      keywords: [
        "saas logo",
        "software logo",
        "cloud logo",
        "platform logo",
        "b2b logo",
      ],
    },
  },
  {
    slug: "ai-company-logo",
    name: "AI Company",
    description: "Futuristic logo for AI and machine learning companies",
    category: "tech-startup",
    tags: ["ai", "artificial intelligence", "machine learning", "neural", "bot"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "AI Company Logo Template | Artificial Intelligence Logo Maker",
      description:
        "Create a cutting-edge AI company logo. Perfect for machine learning startups and tech innovators.",
      keywords: [
        "ai logo",
        "artificial intelligence logo",
        "machine learning logo",
        "neural network logo",
      ],
    },
  },
  {
    slug: "developer-tools-logo",
    name: "Developer Tools",
    description: "Technical logo for dev tools and coding platforms",
    category: "tech-startup",
    tags: ["developer", "code", "programming", "api", "devtools"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Developer Tools Logo Template | Coding Logo Maker",
      description:
        "Design a technical logo for your developer tools, API, or programming platform.",
      keywords: [
        "developer logo",
        "coding logo",
        "programming logo",
        "api logo",
        "devtools logo",
      ],
    },
  },
  {
    slug: "mobile-app-logo",
    name: "Mobile App",
    description: "App icon style logo for mobile applications",
    category: "tech-startup",
    tags: ["app", "mobile", "ios", "android", "smartphone"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Mobile App Logo Template | App Icon Maker",
      description:
        "Create a stunning mobile app logo and icon. Perfect for iOS and Android applications.",
      keywords: [
        "app logo",
        "mobile app logo",
        "app icon",
        "ios logo",
        "android logo",
      ],
    },
  },

  // ============== HEALTH & FITNESS ==============
  {
    slug: "gym-logo",
    name: "Gym & Fitness",
    description: "Powerful logo for gyms and fitness centers",
    category: "health-fitness",
    tags: ["gym", "fitness", "workout", "training", "muscle"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Gym Logo Template | Fitness Logo Maker",
      description:
        "Create a powerful gym logo that motivates. Perfect for fitness centers, personal trainers, and workout apps.",
      keywords: [
        "gym logo",
        "fitness logo",
        "workout logo",
        "personal trainer logo",
        "fitness brand",
      ],
    },
  },
  {
    slug: "yoga-studio-logo",
    name: "Yoga Studio",
    description: "Peaceful and balanced logo for yoga and wellness",
    category: "health-fitness",
    tags: ["yoga", "wellness", "meditation", "zen", "mindfulness"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Yoga Studio Logo Template | Wellness Logo Maker",
      description:
        "Design a serene yoga studio logo. Perfect for meditation centers, wellness retreats, and mindfulness apps.",
      keywords: [
        "yoga logo",
        "wellness logo",
        "meditation logo",
        "zen logo",
        "mindfulness brand",
      ],
    },
  },
  {
    slug: "health-clinic-logo",
    name: "Health Clinic",
    description: "Trustworthy logo for medical and health services",
    category: "health-fitness",
    tags: ["health", "medical", "clinic", "hospital", "doctor"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Health Clinic Logo Template | Medical Logo Maker",
      description:
        "Create a professional health clinic logo. Perfect for doctors, hospitals, and medical practices.",
      keywords: [
        "health logo",
        "medical logo",
        "clinic logo",
        "hospital logo",
        "doctor logo",
      ],
    },
  },
  {
    slug: "nutrition-logo",
    name: "Nutrition & Diet",
    description: "Fresh logo for nutritionists and diet coaches",
    category: "health-fitness",
    tags: ["nutrition", "diet", "healthy", "food", "wellness"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Nutrition Logo Template | Diet Coach Logo Maker",
      description:
        "Design a fresh nutrition logo for dietitians and health coaches. Clean and professional designs.",
      keywords: [
        "nutrition logo",
        "diet logo",
        "dietitian logo",
        "health coach logo",
        "wellness brand",
      ],
    },
  },

  // ============== CREATIVE AGENCY ==============
  {
    slug: "design-studio-logo",
    name: "Design Studio",
    description: "Creative logo for design agencies and studios",
    category: "creative-agency",
    tags: ["design", "studio", "creative", "agency", "art"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Design Studio Logo Template | Creative Agency Logo Maker",
      description:
        "Create an artistic design studio logo. Perfect for creative agencies, graphic designers, and art studios.",
      keywords: [
        "design studio logo",
        "creative agency logo",
        "design agency logo",
        "graphic design logo",
      ],
    },
  },
  {
    slug: "marketing-agency-logo",
    name: "Marketing Agency",
    description: "Bold logo for marketing and advertising agencies",
    category: "creative-agency",
    tags: ["marketing", "advertising", "agency", "digital", "growth"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Marketing Agency Logo Template | Advertising Logo Maker",
      description:
        "Design a bold marketing agency logo. Perfect for digital marketing, advertising, and growth agencies.",
      keywords: [
        "marketing agency logo",
        "advertising logo",
        "digital marketing logo",
        "growth agency logo",
      ],
    },
  },
  {
    slug: "video-production-logo",
    name: "Video Production",
    description: "Dynamic logo for video and film production",
    category: "creative-agency",
    tags: ["video", "film", "production", "cinema", "media"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "Clapperboard",
      bgMode: "solid",
      bgColor: "#1c1917",
      iconColor: "#fbbf24",
      radius: [16],
      strokeWidth: [2],
    },
    seo: {
      title: "Video Production Logo Template | Film Logo Maker",
      description:
        "Create a dynamic video production logo. Perfect for filmmakers, YouTubers, and media companies.",
      keywords: [
        "video production logo",
        "film logo",
        "cinema logo",
        "media company logo",
        "youtube logo",
      ],
    },
  },

  // ============== ECOMMERCE ==============
  {
    slug: "online-store-logo",
    name: "Online Store",
    description: "Modern logo for e-commerce and online shops",
    category: "ecommerce",
    tags: ["ecommerce", "shop", "store", "retail", "online"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Online Store Logo Template | E-commerce Logo Maker",
      description:
        "Design a professional online store logo. Perfect for Shopify stores, Amazon sellers, and e-commerce brands.",
      keywords: [
        "online store logo",
        "ecommerce logo",
        "shop logo",
        "retail logo",
        "shopify logo",
      ],
    },
  },
  {
    slug: "fashion-brand-logo",
    name: "Fashion Brand",
    description: "Elegant logo for fashion and clothing brands",
    category: "fashion-beauty",
    tags: ["fashion", "clothing", "apparel", "style", "boutique"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "Shirt",
      bgMode: "solid",
      bgColor: "#000000",
      iconColor: "#ffffff",
      radius: [0],
      strokeWidth: [1],
    },
    seo: {
      title: "Fashion Brand Logo Template | Clothing Logo Maker",
      description:
        "Create an elegant fashion brand logo. Perfect for clothing lines, boutiques, and apparel brands.",
      keywords: [
        "fashion logo",
        "clothing brand logo",
        "apparel logo",
        "boutique logo",
        "style brand",
      ],
    },
  },

  // ============== EDUCATION ==============
  {
    slug: "online-course-logo",
    name: "Online Course",
    description: "Professional logo for e-learning and online courses",
    category: "education",
    tags: ["education", "course", "learning", "online", "school"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Online Course Logo Template | Education Logo Maker",
      description:
        "Design a professional online course logo. Perfect for e-learning platforms, educators, and training programs.",
      keywords: [
        "online course logo",
        "education logo",
        "e-learning logo",
        "school logo",
        "training logo",
      ],
    },
  },
  {
    slug: "tutoring-logo",
    name: "Tutoring Service",
    description: "Friendly logo for tutors and educational services",
    category: "education",
    tags: ["tutoring", "teacher", "education", "learning", "study"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "BookOpen",
      bgMode: "solid",
      bgColor: "#fef3c7",
      iconColor: "#d97706",
      radius: [40],
      strokeWidth: [2],
    },
    seo: {
      title: "Tutoring Logo Template | Education Logo Maker",
      description:
        "Create a friendly tutoring service logo. Perfect for private tutors, learning centers, and educational services.",
      keywords: [
        "tutoring logo",
        "teacher logo",
        "education logo",
        "learning center logo",
      ],
    },
  },

  // ============== FINANCE ==============
  {
    slug: "fintech-logo",
    name: "Fintech",
    description: "Modern logo for fintech and financial technology",
    category: "finance",
    tags: ["fintech", "finance", "banking", "money", "payment"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Fintech Logo Template | Financial Technology Logo Maker",
      description:
        "Design a modern fintech logo. Perfect for payment apps, banking startups, and financial services.",
      keywords: [
        "fintech logo",
        "finance logo",
        "banking logo",
        "payment app logo",
        "financial services logo",
      ],
    },
  },
  {
    slug: "accounting-logo",
    name: "Accounting Firm",
    description: "Professional logo for accountants and bookkeepers",
    category: "finance",
    tags: ["accounting", "bookkeeping", "finance", "tax", "cpa"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "Calculator",
      bgMode: "solid",
      bgColor: "#1e3a5f",
      iconColor: "#ffffff",
      radius: [12],
      strokeWidth: [1.5],
    },
    seo: {
      title: "Accounting Firm Logo Template | CPA Logo Maker",
      description:
        "Create a professional accounting firm logo. Perfect for CPAs, bookkeepers, and tax services.",
      keywords: [
        "accounting logo",
        "cpa logo",
        "bookkeeper logo",
        "tax service logo",
        "finance logo",
      ],
    },
  },
  {
    slug: "crypto-logo",
    name: "Crypto & Blockchain",
    description: "Futuristic logo for cryptocurrency and blockchain",
    category: "finance",
    tags: ["crypto", "blockchain", "bitcoin", "web3", "defi"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Crypto Logo Template | Blockchain Logo Maker",
      description:
        "Design a futuristic crypto logo. Perfect for blockchain projects, DeFi platforms, and Web3 startups.",
      keywords: [
        "crypto logo",
        "blockchain logo",
        "bitcoin logo",
        "web3 logo",
        "defi logo",
      ],
    },
  },

  // ============== TRAVEL ==============
  {
    slug: "travel-agency-logo",
    name: "Travel Agency",
    description: "Adventurous logo for travel and tourism",
    category: "travel",
    tags: ["travel", "tourism", "vacation", "adventure", "explore"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Travel Agency Logo Template | Tourism Logo Maker",
      description:
        "Create an adventurous travel agency logo. Perfect for tour operators, travel blogs, and tourism businesses.",
      keywords: [
        "travel agency logo",
        "tourism logo",
        "vacation logo",
        "adventure logo",
        "travel brand",
      ],
    },
  },
  {
    slug: "hotel-logo",
    name: "Hotel & Resort",
    description: "Luxurious logo for hotels and resorts",
    category: "travel",
    tags: ["hotel", "resort", "hospitality", "accommodation", "luxury"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Hotel Logo Template | Resort Logo Maker",
      description:
        "Design a luxurious hotel logo. Perfect for resorts, boutique hotels, and hospitality brands.",
      keywords: [
        "hotel logo",
        "resort logo",
        "hospitality logo",
        "accommodation logo",
        "luxury hotel brand",
      ],
    },
  },

  // ============== MUSIC & ENTERTAINMENT ==============
  {
    slug: "music-producer-logo",
    name: "Music Producer",
    description: "Creative logo for music producers and DJs",
    category: "music-entertainment",
    tags: ["music", "producer", "dj", "audio", "beats"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Music Producer Logo Template | DJ Logo Maker",
      description:
        "Create a creative music producer logo. Perfect for DJs, beat makers, and audio engineers.",
      keywords: [
        "music producer logo",
        "dj logo",
        "music logo",
        "audio logo",
        "beats logo",
      ],
    },
  },
  {
    slug: "podcast-logo",
    name: "Podcast",
    description: "Modern logo for podcasts and audio shows",
    category: "music-entertainment",
    tags: ["podcast", "audio", "show", "radio", "streaming"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Podcast Logo Template | Audio Show Logo Maker",
      description:
        "Design a modern podcast logo. Perfect for audio shows, streaming channels, and content creators.",
      keywords: [
        "podcast logo",
        "audio show logo",
        "radio logo",
        "streaming logo",
        "microphone logo",
      ],
    },
  },

  // ============== NATURE & ECO ==============
  {
    slug: "eco-friendly-logo",
    name: "Eco-Friendly Brand",
    description: "Green logo for sustainable and eco-friendly brands",
    category: "nature-eco",
    tags: ["eco", "green", "sustainable", "nature", "environment"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Eco-Friendly Logo Template | Green Brand Logo Maker",
      description:
        "Create a sustainable eco-friendly logo. Perfect for green businesses, environmental projects, and organic brands.",
      keywords: [
        "eco-friendly logo",
        "green logo",
        "sustainable logo",
        "environmental logo",
        "nature logo",
      ],
    },
  },
  {
    slug: "organic-farm-logo",
    name: "Organic Farm",
    description: "Natural logo for farms and organic products",
    category: "nature-eco",
    tags: ["organic", "farm", "agriculture", "natural", "produce"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Organic Farm Logo Template | Agriculture Logo Maker",
      description:
        "Design a natural organic farm logo. Perfect for farmers markets, organic products, and agriculture businesses.",
      keywords: [
        "organic farm logo",
        "agriculture logo",
        "farm logo",
        "natural products logo",
      ],
    },
  },

  // ============== GAMING ==============
  {
    slug: "gaming-logo",
    name: "Gaming Studio",
    description: "Bold logo for gaming studios and esports",
    category: "gaming",
    tags: ["gaming", "esports", "game", "studio", "streamer"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Gaming Logo Template | Esports Logo Maker",
      description:
        "Create a bold gaming studio logo. Perfect for esports teams, game developers, and streamers.",
      keywords: [
        "gaming logo",
        "esports logo",
        "game studio logo",
        "streamer logo",
        "gamer brand",
      ],
    },
  },
  {
    slug: "twitch-streamer-logo",
    name: "Twitch Streamer",
    description: "Eye-catching logo for streamers and content creators",
    category: "gaming",
    tags: ["twitch", "streamer", "youtube", "content", "creator"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Twitch Streamer Logo Template | Content Creator Logo Maker",
      description:
        "Design an eye-catching streamer logo. Perfect for Twitch, YouTube, and content creators.",
      keywords: [
        "twitch logo",
        "streamer logo",
        "youtube logo",
        "content creator logo",
        "gaming channel logo",
      ],
    },
  },

  // ============== SPORTS ==============
  {
    slug: "sports-team-logo",
    name: "Sports Team",
    description: "Dynamic logo for sports teams and clubs",
    category: "sports",
    tags: ["sports", "team", "club", "athletic", "league"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Sports Team Logo Template | Athletic Club Logo Maker",
      description:
        "Create a dynamic sports team logo. Perfect for clubs, leagues, and athletic organizations.",
      keywords: [
        "sports team logo",
        "athletic logo",
        "club logo",
        "league logo",
        "team brand",
      ],
    },
  },
  {
    slug: "running-club-logo",
    name: "Running Club",
    description: "Energetic logo for running clubs and marathons",
    category: "sports",
    tags: ["running", "marathon", "fitness", "track", "athletic"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "Footprints",
      bgMode: "solid",
      bgColor: "#dc2626",
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [2],
    },
    seo: {
      title: "Running Club Logo Template | Marathon Logo Maker",
      description:
        "Design an energetic running club logo. Perfect for marathons, track clubs, and fitness groups.",
      keywords: [
        "running club logo",
        "marathon logo",
        "track logo",
        "fitness logo",
        "athletic brand",
      ],
    },
  },

  // ============== PETS ==============
  {
    slug: "pet-shop-logo",
    name: "Pet Shop",
    description: "Friendly logo for pet stores and animal services",
    category: "pets",
    tags: ["pets", "shop", "animal", "dog", "cat"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Pet Shop Logo Template | Animal Services Logo Maker",
      description:
        "Create a friendly pet shop logo. Perfect for pet stores, groomers, and veterinary clinics.",
      keywords: [
        "pet shop logo",
        "animal logo",
        "dog logo",
        "cat logo",
        "pet services logo",
      ],
    },
  },
  {
    slug: "veterinary-logo",
    name: "Veterinary Clinic",
    description: "Caring logo for veterinarians and animal hospitals",
    category: "pets",
    tags: ["veterinary", "vet", "animal", "clinic", "hospital"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Veterinary Logo Template | Animal Clinic Logo Maker",
      description:
        "Design a caring veterinary clinic logo. Perfect for vets, animal hospitals, and pet care services.",
      keywords: [
        "veterinary logo",
        "vet logo",
        "animal clinic logo",
        "pet hospital logo",
      ],
    },
  },

  // ============== PHOTOGRAPHY ==============
  {
    slug: "photography-studio-logo",
    name: "Photography Studio",
    description: "Artistic logo for photographers and studios",
    category: "photography",
    tags: ["photography", "camera", "studio", "photo", "portrait"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "Camera",
      bgMode: "solid",
      bgColor: "#000000",
      iconColor: "#ffffff",
      radius: [100],
      strokeWidth: [1.5],
    },
    seo: {
      title: "Photography Studio Logo Template | Camera Logo Maker",
      description:
        "Create an artistic photography studio logo. Perfect for photographers, portrait studios, and visual artists.",
      keywords: [
        "photography logo",
        "camera logo",
        "studio logo",
        "photographer brand",
        "portrait logo",
      ],
    },
  },
  {
    slug: "wedding-photographer-logo",
    name: "Wedding Photography",
    description: "Elegant logo for wedding photographers",
    category: "photography",
    tags: ["wedding", "photography", "romance", "love", "elegant"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Wedding Photography Logo Template | Elegant Logo Maker",
      description:
        "Design an elegant wedding photography logo. Perfect for wedding photographers and event studios.",
      keywords: [
        "wedding photography logo",
        "wedding logo",
        "photographer logo",
        "elegant logo",
        "romance brand",
      ],
    },
  },

  // ============== REAL ESTATE ==============
  {
    slug: "real-estate-logo",
    name: "Real Estate Agency",
    description: "Professional logo for real estate and property",
    category: "real-estate",
    tags: ["real estate", "property", "home", "house", "realtor"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "Home",
      bgMode: "solid",
      bgColor: "#1e3a5f",
      iconColor: "#ffffff",
      radius: [16],
      strokeWidth: [2],
    },
    seo: {
      title: "Real Estate Logo Template | Property Logo Maker",
      description:
        "Create a professional real estate logo. Perfect for realtors, property agencies, and home builders.",
      keywords: [
        "real estate logo",
        "property logo",
        "realtor logo",
        "home logo",
        "house logo",
      ],
    },
  },
  {
    slug: "construction-company-logo",
    name: "Construction Company",
    description: "Strong logo for construction and building companies",
    category: "construction",
    tags: ["construction", "building", "contractor", "architecture", "builder"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "HardHat",
      bgMode: "solid",
      bgColor: "#fbbf24",
      iconColor: "#1c1917",
      radius: [12],
      strokeWidth: [2.5],
    },
    seo: {
      title: "Construction Logo Template | Building Company Logo Maker",
      description:
        "Design a strong construction company logo. Perfect for contractors, builders, and architecture firms.",
      keywords: [
        "construction logo",
        "building logo",
        "contractor logo",
        "builder logo",
        "architecture logo",
      ],
    },
  },

  // ============== LEGAL ==============
  {
    slug: "law-firm-logo",
    name: "Law Firm",
    description: "Authoritative logo for law firms and legal services",
    category: "legal",
    tags: ["law", "legal", "attorney", "lawyer", "firm"],
    config: {
      ...initialConfig,
      iconType: "lucide",
      iconName: "Scale",
      bgMode: "solid",
      bgColor: "#1c1917",
      iconColor: "#d4af37",
      radius: [0],
      strokeWidth: [1.5],
    },
    seo: {
      title: "Law Firm Logo Template | Legal Services Logo Maker",
      description:
        "Create an authoritative law firm logo. Perfect for attorneys, lawyers, and legal practices.",
      keywords: [
        "law firm logo",
        "legal logo",
        "attorney logo",
        "lawyer logo",
        "legal services logo",
      ],
    },
  },

  // ============== AUTOMOTIVE ==============
  {
    slug: "auto-shop-logo",
    name: "Auto Shop",
    description: "Rugged logo for auto shops and garages",
    category: "automotive",
    tags: ["auto", "car", "garage", "mechanic", "repair"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Auto Shop Logo Template | Garage Logo Maker",
      description:
        "Design a rugged auto shop logo. Perfect for mechanics, car garages, and auto repair services.",
      keywords: [
        "auto shop logo",
        "garage logo",
        "mechanic logo",
        "car repair logo",
        "automotive logo",
      ],
    },
  },

  // ============== NONPROFIT ==============
  {
    slug: "nonprofit-logo",
    name: "Nonprofit Organization",
    description: "Inspiring logo for charities and nonprofits",
    category: "nonprofit",
    tags: ["nonprofit", "charity", "ngo", "community", "giving"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Nonprofit Logo Template | Charity Logo Maker",
      description:
        "Create an inspiring nonprofit logo. Perfect for charities, NGOs, and community organizations.",
      keywords: [
        "nonprofit logo",
        "charity logo",
        "ngo logo",
        "community logo",
        "giving logo",
      ],
    },
  },

  // ============== BEAUTY ==============
  {
    slug: "beauty-salon-logo",
    name: "Beauty Salon",
    description: "Glamorous logo for beauty salons and spas",
    category: "fashion-beauty",
    tags: ["beauty", "salon", "spa", "cosmetics", "makeup"],
    config: {
      ...initialConfig,
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
    seo: {
      title: "Beauty Salon Logo Template | Spa Logo Maker",
      description:
        "Design a glamorous beauty salon logo. Perfect for spas, cosmetics brands, and makeup artists.",
      keywords: [
        "beauty salon logo",
        "spa logo",
        "cosmetics logo",
        "makeup logo",
        "beauty brand",
      ],
    },
  },
];

export function getTemplateBySlug(slug: string): LogoTemplate | undefined {
  return logoTemplates.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(category: TemplateCategory): LogoTemplate[] {
  return logoTemplates.filter((t) => t.category === category);
}

export function getAllCategories(): TemplateCategory[] {
  return Object.keys(CATEGORY_INFO) as TemplateCategory[];
}

export function searchTemplates(query: string): LogoTemplate[] {
  const lowerQuery = query.toLowerCase();
  return logoTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.includes(lowerQuery))
  );
}
