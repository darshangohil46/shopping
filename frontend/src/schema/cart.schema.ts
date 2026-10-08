import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().trim().min(1, { message: 'Product ID is required' }),
  quantity: z
    .number()
    .int({ message: 'Quantity must be an integer' })
    .min(1, { message: 'Invalid quantity: must be at least 1' })
    .default(1),
});

export const updateQuantitySchema = z.object({
  quantity: z
    .number()
    .int({ message: 'Quantity must be an integer' })
    .min(0, { message: 'Invalid quantity: must be 0 or greater' }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>;
