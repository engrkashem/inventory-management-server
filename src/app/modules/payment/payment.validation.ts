import { z } from 'zod';

const makePaymentValidationSchema = z.object({
  body: z.object({
    orders: z.array(z.string()),
  }),
});

export const PaymentValidations = {
  makePaymentValidationSchema,
};
