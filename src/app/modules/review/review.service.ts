import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { TReview } from './review.interface';
import { Review } from './review.model';

const addReviewIntoDB = async (payload: TReview, userId: string) => {
  payload.user = userId;
  const result = await Review.create(payload);

  return result;
};

const getSingleProductReviewsFromDB = async (productId: string) => {
  // check if product exists or productId is valid
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND.toFixed, 'Product is not found.');
  }

  const pipeline = [
    {
      $match: {
        product: product?._id,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        reviews: { $push: '$$ROOT' },
      },
    },
    {
      $lookup: {
        from: 'products', // Name of the Product collection in DB
        localField: '_id', // Field from the Review collection
        foreignField: '_id', // Field from the Product collection
        as: 'productDetails', // naming as productDetails
      },
    },
    {
      $unwind: '$productDetails', // Unwind the productDetails array to get a single document
    },
    {
      $project: {
        _id: 0,
        product: '$productDetails',
        avgRating: 1,
        reviews: 1,
      },
    },
  ];

  const result = await Review.aggregate(pipeline);

  return result;
};

export const ReviewServices = {
  addReviewIntoDB,
  getSingleProductReviewsFromDB,
};
