import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

/*** Product Schema ***/
const productSchema = new Schema<TProduct>({
  name: {
    type: String,
    required: [true, 'Your product name is required.'],
    trim: true,
    unique: true,
  },
  qty: { type: Number, required: [true, 'Product stock quantity is required'] },
  price: { type: Number, required: [true, 'Product price is required'] },
  img: {
    type: String,
    default:
      'https://res.cloudinary.com/djn7wzals/image/upload/v1703391369/cld-sample.jpg',
  },
  description: {
    type: String,
    required: [true, 'Your product description is required.'],
    trim: true,
  },
  manufacturer: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false },
});

/*** Product Model ***/
export const Product = model<TProduct>('Product', productSchema);
