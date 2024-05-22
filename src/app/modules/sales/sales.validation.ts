import { z } from 'zod';

const confirmOrderValidationSchema = z.object({
  body: z.object({
    order: z.string({
      required_error: 'Order id is required',
      invalid_type_error: 'Order id must be ObjectId',
    }),
  }),
});

export const SalesValidations = {
  confirmOrderValidationSchema,
};
