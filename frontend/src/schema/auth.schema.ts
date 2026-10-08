import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
