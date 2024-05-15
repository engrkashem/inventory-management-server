import { Product } from './product.model';

const addProductIntoDB = async (productData) => {
  const result = await Product.create(productData);

  return result;
};

export const ProductServices = {
  addProductIntoDB,
};
