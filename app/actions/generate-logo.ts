"use server";

import { auth } from "@/lib/auth";
import { consumeCredits } from "@/lib/credits";
import { iconOptions } from "@/lib/icon-metadata";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Experimental_Agent as Agent, stepCountIs, tool } from "ai";
import { headers } from "next/headers";
import { z } from "zod";

const openrouter = createOpenRouter({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const LogoConfigSchema = z.object({
  iconName: z
    .string()
    .describe('The exact name of the icon to use (e.g., "Activity", "User")'),
  iconType: z
    .enum([
      "lucide",
      "tabler",
      "hugeicons",
      "lineicons",
      "flaticon",
      "feather",
      "iconoir",
      "boxicons",
      "heroicons",
      "fontawesome",
      "custom",
      "none",
    ])
    .describe("The library the icon belongs to"),
  bgColor: z.string().describe("Background color in hex"),
  bgMode: z.enum(["solid", "gradient"]).default("solid"),
  gradientStart: z
    .string()
    .optional()
    .describe("Gradient start color if bgMode is gradient"),
  gradientEnd: z
    .string()
    .optional()
    .describe("Gradient end color if bgMode is gradient"),
  gradientAngle: z.array(z.number()).default([135]).describe("Gradient angle"),
  iconColor: z.string().describe("Icon color in hex"),
  iconOpacity: z
    .array(z.number())
    .default([100])
    .describe("Icon opacity percentage (0-100)"),
  iconFillColor: z.string().optional().describe("Icon fill color (optional)"),
  iconFillOpacity: z.array(z.number()).default([0]),
  size: z.array(z.number()).default([512]),
  radius: z.array(z.number()).default([0]).describe("Border radius"),
  padding: z
    .array(z.number())
    .default([64])
    .describe("Padding around the icon"),
  borderWidth: z.array(z.number()).default([0]),
  borderColor: z.string().default("#000000"),
  shadowEnabled: z.boolean().default(false),
  shadowColor: z.string().default("#000000"),
  shadowBlur: z.array(z.number()).default([0]),
  shadowOpacity: z.array(z.number()).default([0.2]),
  shape: z
    .enum(["square", "circle", "rounded"])
    .describe("General shape of the logo container"),
});

export type GeneratedLogo = z.infer<typeof LogoConfigSchema>;
const LogoArraySchema = z.object({
  logos: z.array(LogoConfigSchema).length(3),
});

const LOGO_SCHEMA_PROMPT = `{
  "logos": [
    {
      "iconName": "Exact label from the searchIcons tool",
      "iconType": "lucide | tabler | hugeicons | lineicons | flaticon | feather | iconoir | boxicons | heroicons | fontawesome | custom | none",
      "bgColor": "#RRGGBB",
      "bgMode": "solid | gradient",
      "gradientStart": "#RRGGBB or omit when bgMode is solid",
      "gradientEnd": "#RRGGBB or omit when bgMode is solid",
      "gradientAngle": [135],
      "iconColor": "#RRGGBB",
      "iconOpacity": [100],
      "iconFillColor": "#RRGGBB (ignored when iconFillOpacity is 0)",
      "iconFillOpacity": [0],
      "size": [512],
      "radius": [0-256],
      "padding": [0-256],
      "borderWidth": [0-64],
      "borderColor": "#RRGGBB",
      "shadowEnabled": false,
      "shadowColor": "#RRGGBB",
      "shadowBlur": [0-200],
      "shadowOpacity": [0-1],
      "shape": "square | circle | rounded"
    }
  ]
}`;

const SINGLE_ICON_SEARCH_RULE = `CRITICAL: The searchIcons tool is a one-time operation. You cannot search again.
- If results are poor or irrelevant, you MUST select the best 3 available options anyway.
- NEVER stop to ask the user for clarification.
- NEVER apologize or explain why the icons don't match.
- Just proceed with the available tools to generate the JSON.`;

const EXACT_LOGO_COUNT_RULE = `You must ALWAYS produce exactly three (3) logo concepts.
- Never output less than 3.
- Never output more than 3.
- Do not mention this constraint, just satisfy it.`;

const LOGO_AGENT_STEPS = `Execution Protocol:
1. Call 'searchIcons' exactly once with the user's prompt.
2. Silently analyze the returned icons.
3. Call 'chooseIcon' exactly three times to lock 3 distinct icons from the list.
   - If no good matches exist, pick the 3 most abstract or generic icons available.
   - DO NOT OUTPUT TEXT EXPLAINING YOUR CHOICE.
4. Call 'submitLogos' exactly once with the final JSON.`;

const buildSystemPrompt = () => {
  return [
    "You are a headless API endpoint generating logo configurations.",
    "You have NO capacity to converse, ask questions, or provide feedback to the user.",
    "Your ONLY output must be tool calls.",
    "CONTEXT: The user wants a set of logos based on their prompt. They cannot reply to you.",
    "FAILURE HANDLING: If the icon search yields poor results, you must NOT fail or stop. You must creatively interpret the available icons to fulfill the request as best as possible.",
    "-----",
    EXACT_LOGO_COUNT_RULE,
    LOGO_AGENT_STEPS,
    SINGLE_ICON_SEARCH_RULE,
    "-----",
    "DESIGN RULES:",
    "- Honor color preferences strictly.",
    "- Use 'iconOpacity': [100] and 'iconFillOpacity': [0] for all logos (outline style).",
    "- Lean into the requested style (Scandinavian, minimalist, etc.) via color and spacing, even if icons are imperfect.",
    "FINAL JSON SCHEMA:",
    LOGO_SCHEMA_PROMPT,
  ].join("\n");
};

const SearchIconsSchema = z.object({
  query: z.string().describe("The search query for the icon"),
});

type IconSearchMatch = Pick<
  (typeof iconOptions)[number],
  "name" | "library" | "label" | "searchValue"
>;

const toIconMatch = ({
  name,
  library,
  label,
  searchValue,
}: (typeof iconOptions)[number]) => ({
  name,
  library,
  label,
  searchValue,
});

const iconIdentifier = (icon: IconSearchMatch) =>
  `${icon.library}:${icon.name}`.toLowerCase();

const ensureMinimumIcons = (
  icons: IconSearchMatch[],
  desiredCount = 3
): IconSearchMatch[] => {
  const selected: IconSearchMatch[] = [];
  const seen = new Set<string>();

  icons.forEach((icon) => {
    if (selected.length >= desiredCount) {
      return;
    }
    const key = iconIdentifier(icon);
    if (seen.has(key)) {
      return;
    }
    selected.push(icon);
    seen.add(key);
  });

  if (selected.length >= desiredCount) {
    return selected;
  }

  for (const candidate of iconOptions) {
    const match = toIconMatch(candidate);
    const key = iconIdentifier(match);
    if (seen.has(key)) {
      continue;
    }
    selected.push(match);
    seen.add(key);
    if (selected.length >= desiredCount) {
      break;
    }
  }

  return selected.slice(0, desiredCount);
};

const SYNONYM_MAP: Record<string, string[]> = {
  heartbeat: [
    "activity",
    "pulse",
    "heart",
    "monitor",
    "ecg",
    "waveform",
    "cardiogram",
  ],
  fitness: [
    "dumbbell",
    "activity",
    "biceps",
    "gym",
    "weight",
    "run",
    "shoe",
    "sneaker",
  ],
  running: ["run", "sprint", "shoe", "sneaker", "footwear", "fast", "motion"],
  shoe: ["footwear", "sneaker", "boot", "footprint", "steps"],
  health: ["heart", "plus", "cross", "medical", "stethoscope", "activity"],
  tech: ["cpu", "chip", "code", "terminal", "network", "server", "database"],
  nature: ["leaf", "tree", "flower", "plant", "mountain", "sun", "cloud"],
  finance: [
    "dollar",
    "money",
    "coin",
    "wallet",
    "chart",
    "graph",
    "credit-card",
  ],
  education: ["book", "graduation", "school", "pencil", "pen", "brain"],
  food: [
    "utensils",
    "restaurant",
    "chef",
    "pizza",
    "burger",
    "coffee",
    "drink",
  ],
  travel: ["plane", "globe", "map", "compass", "luggage", "ticket"],
  music: ["note", "guitar", "mic", "headphone", "speaker", "play"],
  art: ["brush", "palette", "pen", "feather", "edit", "image", "camera"],
  security: ["lock", "shield", "key", "safe", "guard", "check"],
  business: [
    "briefcase",
    "building",
    "chart",
    "presentation",
    "users",
    "shake",
  ],
};

const tokenizeQuery = (query: string): string[] => {
  const rawTokens = Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[^a-z0-9]+/i)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2)
    )
  );

  const expandedTokens = new Set<string>(rawTokens);

  rawTokens.forEach((token) => {
    if (SYNONYM_MAP[token]) {
      SYNONYM_MAP[token].forEach((syn) => expandedTokens.add(syn));
    }

    Object.entries(SYNONYM_MAP).forEach(([key, values]) => {
      if (values.includes(token)) {
        expandedTokens.add(key);
      }
    });
  });

  return Array.from(expandedTokens);
};

const findIconMatches = (query: string): IconSearchMatch[] => {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return [];
  }

  const scored = iconOptions
    .map((icon) => {
      const name = icon.name.toLowerCase();
      const label = icon.label?.toLowerCase() ?? "";
      const searchVal = icon.searchValue?.toLowerCase() ?? "";

      let score = 0;

      if (tokens.some((t) => t === name)) score += 100;
      if (tokens.some((t) => t === label)) score += 50;

      tokens.forEach((token) => {
        if (name.includes(token)) score += 10;
        else if (label.includes(token)) score += 5;
        else if (searchVal.includes(token)) score += 3;
      });

      return { icon, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name))
    .slice(0, 50)
    .map(({ icon }) => toIconMatch(icon));

  return scored;
};

const ensureReadableOpacities = (logo: GeneratedLogo): GeneratedLogo => {
  return {
    ...logo,
    iconOpacity: [100],
    iconFillOpacity: [0],
    size: [1024],
  };
};

const getRandomIcons = (count: number): IconSearchMatch[] => {
  const shuffled = [...iconOptions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(toIconMatch);
};

export type GenerateLogoResult =
  | { success: true; logos: GeneratedLogo[] }
  | { success: false; error: string };

export async function generateLogos(
  prompt: string
): Promise<GenerateLogoResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return {
        success: false,
        error: "Sign in to generate AI logos with your credits.",
      };
    }
    await consumeCredits(session.user.id, 1);

    const searchState: {
      performed: boolean;
      results: IconSearchMatch[];
    } = {
      performed: false,
      results: [],
    };

    const chosenIcons = new Map<string, IconSearchMatch>();
    let submittedLogos: GeneratedLogo[] | null = null;

    const searchIconsTool = tool({
      description:
        "Finds candidate icons based on the user's prompt (call once).",
      inputSchema: SearchIconsSchema,
      execute: async ({ query }): Promise<IconSearchMatch[]> => {
        if (searchState.performed) {
          throw new Error("searchIcons can only be called once.");
        }

        let matches = findIconMatches(query);

        if (matches.length === 0) {
          if (query !== prompt) {
            matches = findIconMatches(prompt);
          }
        }

        if (matches.length === 0) {
          matches = getRandomIcons(12);
        }

        searchState.performed = true;
        searchState.results = ensureMinimumIcons(matches, 12);
        return searchState.results;
      },
    });

    const chooseIconTool = tool({
      description:
        "Lock one icon (name + library) from the searchIcons results.",
      inputSchema: z.object({
        iconName: z
          .string()
          .describe("Exact icon name from the search results"),
        iconType: LogoConfigSchema.shape.iconType.describe(
          "Icon library from the search results"
        ),
      }),
      execute: async ({ iconName, iconType }) => {
        if (!searchState.performed) {
          throw new Error("Call searchIcons before locking icons.");
        }
        if (chosenIcons.size >= 3) {
          throw new Error("Exactly three icons can be locked.");
        }

        const keyInput = `${iconType}:${iconName}`.toLowerCase();
        const match = searchState.results.find(
          (icon) => iconIdentifier(icon) === keyInput
        );

        if (!match) {
          throw new Error(
            "Only icons from the searchIcons response can be used."
          );
        }

        if (chosenIcons.has(keyInput)) {
          throw new Error("That icon is already locked.");
        }

        chosenIcons.set(keyInput, match);
        return match;
      },
    });

    const submitLogosTool = tool({
      description:
        "Submit the final JSON payload for exactly three locked icons (call only once).",
      inputSchema: LogoArraySchema,
      execute: async ({ logos }) => {
        if (chosenIcons.size !== 3) {
          throw new Error("Lock three icons before submitting logos.");
        }

        const usedKeys = new Set<string>();
        logos.forEach((logo) => {
          const key = `${logo.iconType}:${logo.iconName}`.toLowerCase();
          if (!chosenIcons.has(key)) {
            throw new Error(
              `Logo uses ${logo.iconType}:${logo.iconName}, which was not locked.`
            );
          }
          usedKeys.add(key);
        });

        if (usedKeys.size !== chosenIcons.size) {
          throw new Error(
            "Each locked icon must be used exactly once. Duplicate or missing icons detected."
          );
        }

        submittedLogos = logos.map(ensureReadableOpacities);
        return {
          status: "accepted",
          iconsUsed: Array.from(usedKeys),
        };
      },
    });

    const logoAgent = new Agent({
      model: openrouter.chat("google/gemini-3-flash-preview"),
      system: buildSystemPrompt(),
      tools: {
        searchIcons: searchIconsTool,
        chooseIcon: chooseIconTool,
        submitLogos: submitLogosTool,
      },
      stopWhen: stepCountIs(18),
    });

    await logoAgent.generate({
      prompt: `User brief:\n${prompt}`,
    });

    if (!submittedLogos) {
      return {
        success: false,
        error: "Agent finished without submitting logos.",
      };
    }

    return { success: true, logos: submittedLogos };
  } catch (error) {
    console.error("AI Logo Generation Error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Failed to generate logos. Please try again.",
    };
  }
}
