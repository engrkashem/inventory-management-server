import catchAsyncRequest from '../../utils/catchAsyncRequest';
import { ProductServices } from './product.service';

const addProduct = catchAsyncRequest(async (req, res) => {
  const result = await ProductServices.addProductIntoDB(req.body);

  res.json(result);
});

export const ProductControllers = {
  addProduct,
};
