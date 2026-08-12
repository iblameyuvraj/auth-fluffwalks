export interface AuthParams {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
  tokenType?: string;
  type?: string; // 'signup' | 'recovery' | 'magiclink' | 'invite' | 'email_change'
  error?: string;
  errorCode?: string;
  errorDescription?: string;
  code?: string;
  email?: string;
  appRedirect?: string;
}

export function parseAuthParams(): AuthParams {
  if (typeof window === "undefined") return {};

  const params: AuthParams = {};

  // Parse Hash Fragment (#access_token=...&refresh_token=...&type=signup)
  const hash = window.location.hash.substring(1);
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    if (hashParams.has("access_token")) params.accessToken = hashParams.get("access_token")!;
    if (hashParams.has("refresh_token")) params.refreshToken = hashParams.get("refresh_token")!;
    if (hashParams.has("expires_in")) params.expiresIn = hashParams.get("expires_in")!;
    if (hashParams.has("token_type")) params.tokenType = hashParams.get("token_type")!;
    if (hashParams.has("type")) params.type = hashParams.get("type")!;
    if (hashParams.has("error")) params.error = hashParams.get("error")!;
    if (hashParams.has("error_code")) params.errorCode = hashParams.get("error_code")!;
    if (hashParams.has("error_description")) params.errorDescription = hashParams.get("error_description")!;
  }

  // Parse Query Parameters (?error=...&type=...&code=...)
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has("error")) params.error = params.error || queryParams.get("error")!;
  if (queryParams.has("error_code")) params.errorCode = params.errorCode || queryParams.get("error_code")!;
  if (queryParams.has("error_description")) params.errorDescription = params.errorDescription || queryParams.get("error_description")!;
  if (queryParams.has("type")) params.type = params.type || queryParams.get("type")!;
  if (queryParams.has("code")) params.code = params.code || queryParams.get("code")!;
  if (queryParams.has("app_redirect")) params.appRedirect = queryParams.get("app_redirect")!;

  // Decode user email from JWT access token if available
  if (params.accessToken) {
    const extractedEmail = extractEmailFromJWT(params.accessToken);
    if (extractedEmail) {
      params.email = extractedEmail;
    }
  }

  return params;
}

export function extractEmailFromJWT(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // Base64Url decode payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.email || parsed.user_metadata?.email || null;
  } catch (e) {
    console.warn("Could not decode JWT email payload", e);
    return null;
  }
}
