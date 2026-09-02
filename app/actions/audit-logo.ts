"use server";

import { auth } from "@/lib/auth";
import { consumeCredits } from "@/lib/credits";
import type { LogoConfig } from "@/lib/logo-types";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Experimental_Agent as Agent, stepCountIs, tool } from "ai";
import { headers } from "next/headers";
import { z } from "zod";

const openrouter = createOpenRouter({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const AuditResultSchema = z.object({
  score: z.number().min(0).max(100).describe("Design quality score from 0-100"),
  critique: z.object({
    colorHarmony: z
      .string()
      .describe("Analysis of color coordination and harmony"),
    scalability: z
      .string()
      .describe("Assessment of how well the logo scales at different sizes"),
    uniqueness: z
      .string()
      .describe("Evaluation of originality and memorability"),
  }),
  improvements: z
    .array(z.string())
    .describe("Actionable suggestions for improving the design"),
});

export type AuditResult = z.infer<typeof AuditResultSchema>;


const buildAuditPrompt = (config: LogoConfig): string => {
  const {
    iconName,
    iconType,
    bgColor,
    bgMode,
    gradientStart,
    gradientEnd,
    gradientAngle,
    iconColor,
    iconColorMode,
    iconColorGradientStart,
    iconColorGradientEnd,
    iconColorGradientAngle,
    iconFillColor,
    iconFillOpacity,
    iconOpacity,
    size,
    radius,
    padding,
    borderWidth,
    borderColor,
    shadowEnabled,
    shadowColor,
    shadowBlur,
    texts,
  } = config;

  return `You are an expert brand identity designer conducting a professional design audit of a logo configuration.

LOGO CONFIGURATION:
- Icon: ${iconName} from ${iconType} library
- Background Mode: ${bgMode}
- Background Colors: ${
    bgMode === "gradient"
      ? `${gradientStart} → ${gradientEnd} (${gradientAngle}°)`
      : bgColor
  }
- Icon Colors: ${
    iconColorMode === "gradient"
      ? `${iconColorGradientStart} → ${iconColorGradientEnd} (${iconColorGradientAngle}°)`
      : iconColor
  }
- Icon Fill Color: ${iconFillOpacity?.[0] > 0 ? iconFillColor : "None"}
- Icon Opacity: ${iconOpacity?.[0]}%
- Border Width: ${borderWidth?.[0]}px
- Border Color: ${borderColor}
- Shadow: ${
    shadowEnabled
      ? `Enabled (${shadowColor}, blur: ${shadowBlur?.[0]})`
      : "Disabled"
  }
- Container Size: ${size?.[0]}x${size?.[0]}px
- Border Radius: ${radius?.[0]}px
- Padding: ${padding?.[0]}px
- Text Elements: ${texts?.length || 0} text(s) ${
    texts?.map((t) => `"${t.text}"`).join(", ") || "None"
  }

AUDIT PROTOCOL:
1. Call 'analyzeColors' to evaluate color harmony, contrast, and emotional impact
2. Call 'analyzeScalability' to assess performance at different sizes
3. Call 'analyzeUniqueness' to judge originality and competitive distinction
4. Call 'submitAudit' with your final evaluation and score

SCORING GUIDELINES:
- 90-100: Exceptional professional design
- 80-89: Strong design with minor improvements needed
- 70-79: Good design with moderate improvements needed
- 60-69: Fair design requiring significant improvements
- Below 60: Major design flaws requiring redesign

Be constructive, specific, and professional. Focus on actionable advice.`;
};

export type AuditLogoResult =
  | { success: true; result: AuditResult }
  | { success: false; error: string };

export async function auditLogo(config: LogoConfig): Promise<AuditLogoResult> {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Sign in to audit your logo with AI credits.",
      };
    }

    // Consume 1 credit for the audit
    await consumeCredits(session.user.id, 1);

    const auditState: {
      colorAnalysis?: {
        harmony: string;
        contrast: string;
        emotional: string;
      };
      scalabilityAnalysis?: {
        smallSize: string;
        largeSize: string;
        complexity: string;
      };
      uniquenessAnalysis?: {
        originality: string;
        memorability: string;
        distinction: string;
      };
      submitted?: boolean;
    } = {};

    let finalResult: AuditResult | null = null;

    const analyzeColorsTool = tool({
      description:
        "Analyze the color harmony, contrast, and emotional impact of the logo",
      inputSchema: z.object({
        harmony: z
          .string()
          .describe("Analysis of color coordination and harmony"),
        contrast: z.string().describe("Assessment of contrast and readability"),
        emotional: z
          .string()
          .describe("Emotional impact and appropriateness of colors"),
      }),
      execute: async (input) => {
        auditState.colorAnalysis = input;
        return input;
      },
    });

    const analyzeScalabilityTool = tool({
      description: "Evaluate how well the logo scales at different sizes",
      inputSchema: z.object({
        smallSize: z.string().describe("Legibility and clarity at small sizes"),
        largeSize: z.string().describe("Impact and presence at large sizes"),
        complexity: z.string().describe("Assessment of design complexity"),
      }),
      execute: async (input) => {
        auditState.scalabilityAnalysis = input;
        return input;
      },
    });

    const analyzeUniquenessTool = tool({
      description:
        "Judge the originality, memorability, and competitive distinction",
      inputSchema: z.object({
        originality: z
          .string()
          .describe("Assessment of originality and creativity"),
        memorability: z
          .string()
          .describe("How memorable and distinctive the logo is"),
        distinction: z.string().describe("How it stands out from competitors"),
      }),
      execute: async (input) => {
        auditState.uniquenessAnalysis = input;
        return input;
      },
    });

    const submitAuditTool = tool({
      description:
        "Submit the final audit results with overall score and recommendations",
      inputSchema: AuditResultSchema,
      execute: async (result) => {
        if (
          !auditState.colorAnalysis ||
          !auditState.scalabilityAnalysis ||
          !auditState.uniquenessAnalysis
        ) {
          throw new Error("Complete all analyses before submitting audit");
        }
        auditState.submitted = true;
        finalResult = result;
        return { status: "accepted", score: result.score };
      },
    });

    const auditAgent = new Agent({
      model: openrouter.chat("google/gemini-3-flash-preview"),
      system:
        "You are a professional brand identity designer conducting structured logo audits. Always use all analysis tools before submitting your final audit.",
      tools: {
        analyzeColors: analyzeColorsTool,
        analyzeScalability: analyzeScalabilityTool,
        analyzeUniqueness: analyzeUniquenessTool,
        submitAudit: submitAuditTool,
      },
      stopWhen: stepCountIs(12),
    });

    const prompt = buildAuditPrompt(config);

    await auditAgent.generate({
      prompt,
    });

    if (!finalResult) {
      return {
        success: false,
        error: "Agent finished without submitting audit results.",
      };
    }

    // Validate the response structure
    const validatedResult = AuditResultSchema.parse(finalResult);

    return { success: true, result: validatedResult };
  } catch (error) {
    console.error("AI Logo Audit Error:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    // Return a fallback result for AI service errors
    return {
      success: false,
      error: "Failed to generate logo audit. Please try again.",
    };
  }
}
