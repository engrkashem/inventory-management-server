import { Types } from 'mongoose';

export type TReview = {
  review: string;
  rating: number;
  user: Types.ObjectId;
  isDeleted: boolean;
};
