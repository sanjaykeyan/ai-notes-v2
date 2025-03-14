export interface FormattedSentiment {
  overallTone: {
    tone: "Professional" | "Casual" | "Tense" | "Friendly" | "Formal";
    description: string;
  };
  keyMoments: Array<{
    moment: string;
    sentiment: string;
  }>;
  participantEngagement: Array<{
    observation: string;
    level: "High" | "Medium" | "Low";
  }>;
  agreementAreas: Array<string>;
  disagreementAreas: Array<string>;
  communicationDynamics: {
    patterns: Array<string>;
    suggestions: Array<string>;
  };
}

interface KeyMoment {
  moment?: string;
  sentiment?: string;
}

interface ParticipantEngagement {
  observation?: string;
  level?: string;
}

export const formatSentimentAnalysis = (
  rawAnalysis: string
): FormattedSentiment => {
  if (!rawAnalysis) {
    console.error("Empty analysis received");
    return getDefaultAnalysis();
  }

  try {
    // Clean up the input string
    const cleanedAnalysis = rawAnalysis
      .replace(/^\uFEFF/, "") // Remove BOM
      .replace(/```json\n?|\n?```/g, "") // Remove markdown
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, ""); // Remove zero-width spaces

    // If the string starts with a quote, try to parse it as a JSON string
    if (cleanedAnalysis.startsWith('"') && cleanedAnalysis.endsWith('"')) {
      try {
        const unescaped = JSON.parse(cleanedAnalysis);
        if (typeof unescaped === "string") {
          return formatSentimentAnalysis(unescaped); // Recursive call with unescaped string
        }
      } catch (e) {
        console.error("Failed to parse JSON string:", e);
      }
    }

    const parsed = JSON.parse(cleanedAnalysis);

    // Strict validation of the parsed data
    if (!isValidSentimentAnalysis(parsed)) {
      console.error("Invalid analysis structure:", parsed);
      return getDefaultAnalysis();
    }

    return {
      overallTone: {
        tone: validateTone(parsed.overallTone.tone),
        description: String(parsed.overallTone.description || "").trim(),
      },
      keyMoments: Array.isArray(parsed.keyMoments)
        ? parsed.keyMoments.map((km: KeyMoment) => ({
            moment: String(km.moment || "").trim(),
            sentiment: String(km.sentiment || "").trim(),
          }))
        : getDefaultAnalysis().keyMoments,
      participantEngagement: Array.isArray(parsed.participantEngagement)
        ? parsed.participantEngagement.map((pe: ParticipantEngagement) => ({
            observation: String(pe.observation || "").trim(),
            level: validateEngagementLevel(pe.level || "Medium"),
          }))
        : getDefaultAnalysis().participantEngagement,
      agreementAreas: Array.isArray(parsed.agreementAreas)
        ? parsed.agreementAreas.map(String)
        : getDefaultAnalysis().agreementAreas,
      disagreementAreas: Array.isArray(parsed.disagreementAreas)
        ? parsed.disagreementAreas.map(String)
        : getDefaultAnalysis().disagreementAreas,
      communicationDynamics:
        parsed.communicationDynamics &&
        typeof parsed.communicationDynamics === "object"
          ? {
              patterns: Array.isArray(parsed.communicationDynamics.patterns)
                ? parsed.communicationDynamics.patterns.map(String)
                : getDefaultAnalysis().communicationDynamics.patterns,
              suggestions: Array.isArray(
                parsed.communicationDynamics.suggestions
              )
                ? parsed.communicationDynamics.suggestions.map(String)
                : getDefaultAnalysis().communicationDynamics.suggestions,
            }
          : getDefaultAnalysis().communicationDynamics,
    };
  } catch (e) {
    console.error("Error parsing sentiment analysis:", e, "Raw:", rawAnalysis);
    return getDefaultAnalysis();
  }
};

// Add this validation function
function isValidSentimentAnalysis(data: any): boolean {
  return (
    data &&
    typeof data === "object" &&
    data.overallTone &&
    typeof data.overallTone === "object" &&
    typeof data.overallTone.tone === "string" &&
    typeof data.overallTone.description === "string" &&
    Array.isArray(data.keyMoments) &&
    Array.isArray(data.participantEngagement) &&
    Array.isArray(data.agreementAreas) &&
    Array.isArray(data.disagreementAreas) &&
    data.communicationDynamics &&
    Array.isArray(data.communicationDynamics.patterns) &&
    Array.isArray(data.communicationDynamics.suggestions)
  );
}

function validateTone(tone: string): FormattedSentiment["overallTone"]["tone"] {
  const validTones = ["Professional", "Casual", "Tense", "Friendly", "Formal"];
  return validTones.includes(tone)
    ? (tone as FormattedSentiment["overallTone"]["tone"])
    : "Formal";
}

function validateEngagementLevel(level: string): "High" | "Medium" | "Low" {
  const validLevels = ["High", "Medium", "Low"];
  return validLevels.includes(level)
    ? (level as "High" | "Medium" | "Low")
    : "Medium";
}

function getDefaultAnalysis(): FormattedSentiment {
  return {
    overallTone: {
      tone: "Formal",
      description: "Unable to analyze meeting tone",
    },
    keyMoments: [
      {
        moment: "No key moments identified",
        sentiment: "Neutral",
      },
    ],
    participantEngagement: [
      {
        observation: "Unable to analyze engagement",
        level: "Medium",
      },
    ],
    agreementAreas: ["No agreement areas identified"],
    disagreementAreas: ["No disagreement areas identified"],
    communicationDynamics: {
      patterns: ["No patterns identified"],
      suggestions: ["No suggestions available"],
    },
  };
}
