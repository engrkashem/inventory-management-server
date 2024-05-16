import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { GENDER, ROLE } from './user.constants';
import { TUser, TUserName } from './user.interface';

const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [
        20,
        'First name length must be less than or equal to 20 character',
      ],
    },
    middleName: { type: String, trim: true },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [3, 'Last name must contains at least 3 characters'],
    },
  },
  {
    _id: false,
  },
);

const addressSchema = new Schema<TUserName>(
  {
    street: { type: String, trim: true },
    district: { type: String, trim: true },
    division: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  {
    _id: false,
  },
);

const userSchema = new Schema<TUser>(
  {
    name: { type: userNameSchema },
    email: {
      type: String,
      required: [true, "User's email is required"],
      trim: true,
      unique: true,
    },
    password: { type: String, default: '' },
    gender: {
      type: String,
      enum: {
        values: GENDER,
        message:
          "'{VALUE}' is not supported. Gender can only be 'male', 'female' or 'other'",
      },
    },
    address: { type: addressSchema },
    contactNo: { type: String, trim: true },
    profilePic: { type: String, default: '' },
    role: {
      type: String,
      enum: ROLE,
      default: 'user',
    },
    isDeleted: { type: Boolean, default: false },
    isGoogleAuthenticated: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

/*** Document Middleware ***/
//pre save middleware/hook to encrypt password
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  // hash the password before passing to next
  user.password = await bcrypt.hash(
    user.password,
    Number(config.BCRYPT_SALT_ROUNDS),
  );

  next();
});

/*** Virtual Field addition ***/
userSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

/*** model creation ***/
export const User = model<TUser>('User', userSchema); // it will create a collection named users
