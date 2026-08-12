import { AuthParams } from "./auth-parser";

export type SchemeType = "mobile" | "fluffwalks" | "exp";

export function generateDeepLink(scheme: SchemeType, params: AuthParams): string {
  const query = new URLSearchParams();

  if (params.accessToken) query.set("access_token", params.accessToken);
  if (params.refreshToken) query.set("refresh_token", params.refreshToken);
  if (params.expiresIn) query.set("expires_in", params.expiresIn);
  if (params.tokenType) query.set("token_type", params.tokenType);
  if (params.type) query.set("type", params.type);
  if (params.code) query.set("code", params.code);
  if (params.error) query.set("error", params.error);
  if (params.errorDescription) query.set("error_description", params.errorDescription);

  const queryString = query.toString();
  const searchPart = queryString ? `?${queryString}` : "";

  // If a dynamic app_redirect deep link was passed from the app client (e.g. exp:// or mobile://), use it directly
  if (params.appRedirect) {
    try {
      const url = new URL(params.appRedirect);
      query.forEach((val, key) => {
        url.searchParams.set(key, val);
      });
      return url.toString();
    } catch (e) {
      // If URL parsing fails (e.g. custom scheme like mobile:// doesn't parse well by standard browser URL class),
      // do a manual query string merge.
      const separator = params.appRedirect.includes("?") ? "&" : "?";
      return `${params.appRedirect}${queryString ? `${separator}${queryString}` : ""}`;
    }
  }

  switch (scheme) {
    case "fluffwalks":
      return `fluffwalks://auth/callback${searchPart}`;
    case "exp":
      return `exp://auth/callback${searchPart}`;
    case "mobile":
    default:
      return `mobile://auth/callback${searchPart}`;
  }
}
