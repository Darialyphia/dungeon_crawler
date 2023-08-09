import { z } from 'zod';
import { USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH } from './user.constants';

export const UserPassword = z
  .string()
  .nonempty()
  .min(USER_PASSWORD_MIN_LENGTH)
  .max(USER_PASSWORD_MAX_LENGTH);

export const UserResponse = z.object({
  id: z.string().cuid(),
  email: z.string().email().optional(),
  name: z.string().min(4).nullable()
});

export type UserResponse = z.infer<typeof UserResponse>;
