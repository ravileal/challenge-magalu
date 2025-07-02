import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export const clientParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateClientSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email cannot be empty.' }).email(),
});

export const addFavoriteSchema = z.object({
  productId: z.string().min(1, { message: 'productId cannot be empty.' }),
});
