import { z } from 'zod';

const envSchema = z.object({
  apiUrl: z.string(),
});

function parseEnv() {
  const env = {
    apiUrl: import.meta.env.VITE_API_URL,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  console.log("Found: ", result.data.apiUrl)

  return result.data;
}

// Export validated config
export const env = parseEnv();
