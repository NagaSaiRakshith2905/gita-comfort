
function getAllowedFeedbackFormDomains(): string[] {
  const rawDomains = process.env.FEEDBACK_FORM_ALLOWED_DOMAINS?.trim();

  if (!rawDomains) {
    return [];
  }

  return rawDomains
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedFeedbackFormDomain(hostname: string): boolean {
  const normalizedHost = hostname.trim().toLowerCase();
  const allowedDomains = getAllowedFeedbackFormDomains();

  return allowedDomains.some(
    (allowedDomain) =>
      normalizedHost === allowedDomain ||
      normalizedHost.endsWith(`.${allowedDomain}`)
  );
}

export function getFeedbackFormUrl(): string | null {
  const rawUrl = process.env.FEEDBACK_FORM_URL?.trim();

  if (!rawUrl) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (!isAllowedFeedbackFormDomain(parsed.hostname)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}