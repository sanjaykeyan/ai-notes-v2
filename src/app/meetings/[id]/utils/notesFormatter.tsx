interface FormattedSummary {
  keyInsights: string[];
  overview: string;
  keyPoints: string[];
  actionItems: string[];
  decisions: string[];
  nextSteps: string[];
}

const sectionEmojis = {
  keyInsights: "🎯",
  overview: "📋",
  keyPoints: "💡",
  actionItems: "✅",
  decisions: "🎯",
  nextSteps: "⏭️",
};

const sectionColors = {
  keyInsights: "text-rose-800",
  overview: "text-indigo-900",
  keyPoints: "text-blue-800",
  actionItems: "text-emerald-800",
  decisions: "text-purple-800",
  nextSteps: "text-orange-800",
};

const sectionBgs = {
  keyInsights: "bg-rose-50",
  overview: "bg-indigo-50",
  keyPoints: "bg-blue-50",
  actionItems: "bg-emerald-50",
  decisions: "bg-purple-50",
  nextSteps: "bg-orange-50",
};

export const formatSummary = (rawSummary: string): FormattedSummary | null => {
  try {
    const parsed = JSON.parse(rawSummary);
    return {
      keyInsights: parsed.keyInsights || [],
      overview: parsed.overview || "No overview available",
      keyPoints: parsed.keyPoints || [],
      actionItems: parsed.actionItems || [],
      decisions: parsed.decisions || [],
      nextSteps: parsed.nextSteps || [],
    };
  } catch {
    return null;
  }
};

export const getSectionEmoji = (section: keyof FormattedSummary) =>
  sectionEmojis[section];
export const getSectionColor = (section: keyof FormattedSummary) =>
  sectionColors[section];
export const getSectionBg = (section: keyof FormattedSummary) =>
  sectionBgs[section];
