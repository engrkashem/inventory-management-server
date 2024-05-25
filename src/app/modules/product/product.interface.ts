/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model } from 'mongoose';

export type TProduct = {
  _id: string;
  name: string;
  category: string;
  qty: number;
  price: number;
  img: string;
  description: string;
  manufacturer: string;
  isDeleted: boolean;
};

export interface ProductModel extends Model<TProduct> {
  isProductExists(id: string): Promise<TProduct | null>;
}
