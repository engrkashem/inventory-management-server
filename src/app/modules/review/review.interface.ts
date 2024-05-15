import { Types } from 'mongoose';

export type TReview = {
  review: string;
  rating: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
  isDeleted: boolean;
};
