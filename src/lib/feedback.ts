export function getFeedbackFormUrl(): string | null {
  const rawUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL?.trim();

  if (!rawUrl) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}