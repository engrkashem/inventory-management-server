import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const productRootUrl = `${config.BASE_URL}/products`;

const addProduct = catchAsyncRequest(async (req, res) => {
  const result = await ProductServices.addProductIntoDB(req.body);

  const links = {
    self: `POST: ${productRootUrl}`,
    product: `GET: ${productRootUrl}/${result?._id}`,
  };

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Product is created successfully',
    data: result,
    links,
  });
});

export const ProductControllers = {
  addProduct,
};
