import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product name is required',
      invalid_type_error: 'Product name must be string',
    }),
    qty: z.number({
      required_error: 'Product quantity is required',
      invalid_type_error: 'Product quantity must be number',
    }),
    price: z.number({
      required_error: 'Product price is required',
      invalid_type_error: 'Product price must be number',
    }),
    img: z.string().optional(),
    description: z.string({
      required_error: 'Product description is required',
      invalid_type_error: 'Product description must be string',
    }),
    manufacturer: z.string({
      required_error: 'Product manufacturer name is required',
      invalid_type_error: 'Product manufacturer name must be string',
    }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Product name is required',
        invalid_type_error: 'Product name must be string',
      })
      .optional(),
    qty: z
      .number({
        required_error: 'Product quantity is required',
        invalid_type_error: 'Product quantity must be number',
      })
      .optional(),
    price: z
      .number({
        required_error: 'Product price is required',
        invalid_type_error: 'Product price must be number',
      })
      .optional(),
    img: z.string().optional(),
    description: z
      .string({
        required_error: 'Product description is required',
        invalid_type_error: 'Product description must be string',
      })
      .optional(),
    manufacturer: z
      .string({
        required_error: 'Product manufacturer name is required',
        invalid_type_error: 'Product manufacturer name must be string',
      })
      .optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
