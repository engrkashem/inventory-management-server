import { z } from 'zod';

const makePaymentToConfirmOrderValidationSchema = z.object({
  body: z.object({
    order: z.string({
      required_error: 'Order id is required',
      invalid_type_error: 'Order id must be ObjectId',
    }),
  }),
});

export const SalesValidations = {
  makePaymentToConfirmOrderValidationSchema,
};
