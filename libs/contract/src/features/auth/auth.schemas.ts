import { z } from 'zod';

export const TokenResponse = z.object({
  accessToken: z.string()
});
export type TokenResponse = z.infer<typeof TokenResponse>;
