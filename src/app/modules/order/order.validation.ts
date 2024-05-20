import { z } from 'zod';

const addOrderValidationSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: 'Product id is required',
      invalid_type_error: 'Product id must be ObjectId',
    }),
    buyer: z.string({
      required_error: 'User id is required',
      invalid_type_error: 'User id must be ObjectId',
    }),
    orderQty: z.number({
      required_error: 'Order quantity is required',
      invalid_type_error: 'Order quantity must be number',
    }),
    discount: z
      .number({
        invalid_type_error: 'Order price must be number',
      })
      .optional(),
  }),
});

export const OrderValidations = {
  addOrderValidationSchema,
};
