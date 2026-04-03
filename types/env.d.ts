declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_APP_URL: string

    // General backend
    readonly NEXT_PUBLIC_API_BASE_URL: string

    // Strapi CMS
    readonly NEXT_PUBLIC_STRAPI_URL?: string
    readonly NEXT_PUBLIC_CONTACT_PATH?: string

    // Auth service (separate port / host)
    readonly NEXT_PUBLIC_AUTH_API_BASE_URL?: string
    readonly NEXT_PUBLIC_AUTH_SIGNUP_PATH?: string
    readonly NEXT_PUBLIC_AUTH_LOGIN_PATH?: string
    readonly NEXT_PUBLIC_AUTH_LOGOUT_PATH?: string
    readonly NEXT_PUBLIC_AUTH_REFRESH_PATH?: string
    readonly NEXT_PUBLIC_AUTH_ME_PATH?: string

    // Server-side only (Next rewrites — see next.config.mjs)
    readonly AUTH_SERVICE_URL?: string
    readonly API_SECRET_KEY?: string

    // Optional: NewsAPI for /api/tech-news (Dev.to + HN work without a key)
    readonly NEWS_API_KEY?: string
  }
}
