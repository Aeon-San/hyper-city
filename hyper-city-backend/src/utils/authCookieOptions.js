/**
 * Auth cookie flags for httpOnly JWT cookie.
 * - On http:// (e.g. VPS IP), Secure must be false or the browser drops the cookie.
 * - sameSite "none" requires Secure; use "lax" for same-origin /api behind nginx.
 */
export function getAuthCookieOptions() {
    const explicit = process.env.COOKIE_SECURE;
    let secure;
    if (explicit === "true") {
        secure = true;
    } else if (explicit === "false") {
        secure = false;
    } else {
        secure = (process.env.CLIENT_URL || "").toLowerCase().startsWith("https://");
    }

    let sameSite = "lax";
    if (process.env.COOKIE_SAMESITE === "none" && secure) {
        sameSite = "none";
    } else if (process.env.COOKIE_SAMESITE === "strict") {
        sameSite = "strict";
    }

    return { secure, sameSite, path: "/" };
}
