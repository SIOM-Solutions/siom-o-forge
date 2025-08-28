/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_EXCELSIOR_URL?: string
  readonly VITE_EXCELSIOR_AGENT_ID?: string
  readonly VITE_OPENAI_REALTIME_ENDPOINT?: string
  readonly VITE_CONSOLE_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
