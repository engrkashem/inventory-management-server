import { Schema, model } from 'mongoose';
import { ProductModel, TProduct } from './product.interface';

/*** Product Schema ***/
const productSchema = new Schema<TProduct, ProductModel>(
  {
    name: {
      type: String,
      required: [true, 'Your product name is required.'],
      trim: true,
      unique: true,
    },
    qty: {
      type: Number,
      required: [true, 'Product stock quantity is required'],
    },
    price: { type: Number, required: [true, 'Product price is required'] },
    img: {
      type: String,
      default:
        'https://res.cloudinary.com/djn7wzals/image/upload/v1703391369/cld-sample.jpg',
    },
    description: {
      type: String,
      required: [true, 'Your product description is required.'],
      trim: true,
    },
    manufacturer: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

/*** Query Middlewares ***/
// pre find middlewares/hooks
productSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } }); // this means current user requested query (In this case, find)

  next();
});
productSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: false });

  next();
});

/*** Custom static methods ***/
productSchema.statics.isProductExists = async function (id: string) {
  return await Product.findById(id);
};

/*** Product Model ***/
export const Product = model<TProduct, ProductModel>('Product', productSchema);
