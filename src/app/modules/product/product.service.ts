import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { productSearchableFields } from './product.constants';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const addProductIntoDB = async (payload: TProduct) => {
  // check if product already exists
  const product = await Product.findOne({ name: payload.name });

  if (product) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This product already exists. Please update if required',
    );
  }

  const result = await Product.create(payload);

  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder<TProduct>(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await productQuery.modelQuery;
  const pagination = await productQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found');
  }
  return product;
};

const updateProductIntoDB = async (
  productId: string,
  payload: Partial<TProduct>,
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found');
  }

  const result = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteProductFromDB = async (productId: string) => {
  return { productId };
};

export const ProductServices = {
  addProductIntoDB,
  getAllProductsFromDB,
  getProductFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
