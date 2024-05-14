import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    review: {
      type: String,
      required: [true, 'Your review message is required.'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Review rating is required.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User's id/reference id is required."],
      ref: 'User',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

/*** Review Model ***/
export const Review = model<TReview>('Review', reviewSchema);
