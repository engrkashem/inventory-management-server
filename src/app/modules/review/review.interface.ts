import { Types } from 'mongoose';

export type TReview = {
  _id: string;
  review: string;
  rating: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
  isDeleted: boolean;
};
