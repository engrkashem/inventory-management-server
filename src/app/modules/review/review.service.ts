import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { TReview } from './review.interface';
import { Review } from './review.model';

const addReviewIntoDB = async (payload: TReview, userId: string) => {
  payload.user = new Types.ObjectId(userId);
  const result = await Review.create(payload);

  return result;
};

const getSingleProductReviewsFromDB = async (
  productId: string,
  query: Record<string, unknown>,
) => {
  // check if product exists or productId is valid
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found.');
  }

  // pagination setup
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

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
        totalCount: { $sum: 1 },
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
      $facet: {
        data: [
          {
            $project: {
              _id: 0,
              product: '$productDetails',
              avgRating: 1,
              totalCount: 1,
              reviews: { $slice: ['$reviews', skip, limit] },
            },
          },
        ],
      },
    },
    {
      $unwind: '$data',
    },
  ];

  const resultData = await Review.aggregate(pipeline);

  const result = { ...resultData[0].data };

  const total = result?.totalCount;
  const totalPage = Math.ceil(total / limit);

  delete result.totalCount;

  return {
    pagination: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

export const ReviewServices = {
  addReviewIntoDB,
  getSingleProductReviewsFromDB,
};
