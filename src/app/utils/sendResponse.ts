import { Response } from 'express';

type TPagination = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TLinks = {
  [key: string]: string | null;
};

type TResponse<T> = {
  status: number;
  success: boolean;
  message?: string;
  pagination?: TPagination;
  links?: TLinks;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.status).json({
    status: data?.status,
    success: data?.success,
    message: data?.message,
    data: data?.data,
    pagination: data?.pagination || {},
    links: data?.links,
  });
};

export default sendResponse;
