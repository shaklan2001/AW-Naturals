const GENERIC_MESSAGE = "Something went wrong. Please try again later.";

function looksLikeInternalError(message: string): boolean {
  return (
    message.includes("Invalid `prisma.") ||
    message.includes("invocation in") ||
    message.includes("denied access on the database") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Can't reach database") ||
    /\/(?:var\/www|backend\/src)\//.test(message) ||
    /\b\d{1,3}(?:\.\d{1,3}){3}\b/.test(message)
  );
}

/** User-safe text for failed API calls — never show raw server/DB errors in the UI. */
export function getUserFacingErrorMessage(message?: string): string {
  if (!message?.trim()) return GENERIC_MESSAGE;
  if (looksLikeInternalError(message)) return GENERIC_MESSAGE;
  return message;
}
