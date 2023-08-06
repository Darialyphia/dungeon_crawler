import { z } from 'zod';

export const UserResponse = z.object({
  id: z.string().cuid(),
  email: z.string().email().optional(),
  name: z.string().min(4).nullable()
});

export type UserResponse = z.infer<typeof UserResponse>;
