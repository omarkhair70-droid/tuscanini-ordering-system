const requiredEnvVarError = (name: string): Error =>
  new Error(`Missing required environment variable: ${name}`);

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw requiredEnvVarError(name);
  }

  return value;
};

export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

export const getSupabasePublicEnv = (): SupabasePublicEnv => ({
  url: getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
});

export const getSupabaseServiceRoleKey = (): string => {
  if (typeof window !== "undefined") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is server-only and cannot be read in the browser.");
  }

  return getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
};
