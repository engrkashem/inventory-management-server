import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { GENDER, ROLE } from './user.constants';
import { TUser, TUserName, UserModel } from './user.interface';

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
    street: { type: String, require: [true, 'Street is required'], trim: true },
    district: {
      type: String,
      require: [true, 'District is required'],
      trim: true,
    },
    division: {
      type: String,
      require: [true, 'Division is required'],
      trim: true,
    },
    country: {
      type: String,
      require: [true, 'Country is required'],
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: userNameSchema },
    email: {
      type: String,
      required: [true, "User's email is required"],
      trim: true,
      unique: true,
    },
    password: { type: String, default: '', select: false },
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
      transform(doc, ret) {
        delete ret.password;
      },
    },
  },
);

/*** Document Middlewares ***/
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

/*** Custom static methods ***/
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.isUserExists = async function (id: string) {
  return await User.findById(id).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
};

/*** Virtual Field addition ***/
userSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

/*** Model creation ***/
export const User = model<TUser, UserModel>('User', userSchema); // it will create a collection named users
