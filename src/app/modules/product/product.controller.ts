import httpStatus from 'http-status';
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
    status: 201,
    success: true,
    message: 'Product is created successfully',
    data: result,
    links,
  });
});

const getAllProducts = catchAsyncRequest(async (req, res) => {
  const { data, pagination } = await ProductServices.getAllProductsFromDB(
    req.query,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Products are retrieved successfully',
    data,
    pagination,
    links: {},
  });
});

const getProduct = catchAsyncRequest(async (req, res) => {
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Product is retrieved successfully',
    data: {},
    pagination: {},
    links: {},
  });
});

const updateProduct = catchAsyncRequest(async (req, res) => {
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Product is updated successfully',
    data: {},
    pagination: {},
    links: {},
  });
});

const deleteProduct = catchAsyncRequest(async (req, res) => {
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Product is deleted successfully',
    data: {},
    pagination: {},
    links: {},
  });
});

export const ProductControllers = {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
