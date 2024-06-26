/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // search query implementation
  search(searchableFields: string[]) {
    const searchTerm = this.query?.search;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  // filter query implementation
  filter() {
    const queryObj = { ...this.query };

    const excludeFieldsFromQuery = [
      'search',
      'sort',
      'limit',
      'page',
      'fields',
      'minPrice',
      'maxPrice',
    ];

    // remove  fields from query object that matches excludeFieldsFromQuery
    excludeFieldsFromQuery.forEach((item) => delete queryObj[item]);

    // Handle price range filtering
    this.handlePriceFiltering(queryObj);

    // Handle date range filtering
    this.handleDateFiltering(queryObj);

    // send filter query
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  // sort query implementation
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',').join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  // pagination query implementation
  pagination() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // fields/project/fields that need to send only query implementation
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // query implementation for getting meta data
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  // filtering on start and end date implementation
  handleDateFiltering(queryObj: Record<string, any>) {
    const startDate = this.query?.startDate as string;
    const endDate = this.query?.endDate as string;

    if (startDate || endDate) {
      queryObj['createdAt'] = {};
      if (startDate) {
        queryObj['createdAt'].$gte = new Date(startDate);
      }
      if (endDate) {
        queryObj['createdAt'].$lte = new Date(endDate);
      }
    }
  }

  // filtering on price based on start and end price implementation
  handlePriceFiltering(queryObj: Record<string, any>) {
    const minPrice = this.query?.minPrice;
    const maxPrice = this.query?.maxPrice;

    if (minPrice || maxPrice) {
      queryObj['price'] = {};
      if (minPrice) {
        queryObj['price'].$gte = Number(minPrice);
      }
      if (maxPrice) {
        queryObj['createdAt'].$lte = Number(maxPrice);
      }
    }
  }
}

export default QueryBuilder;

/**
 
// const priceQuery: Record<string, unknown> = {};

    // if (this.query?.minPrice) {
    //   priceQuery.$gte = Number(this.query.minPrice);
    // }
    // if (this.query?.maxPrice) {
    //   priceQuery.$lte = Number(this.query.maxPrice);
    // }

    // if (Object.keys(priceQuery).length > 0) {
    //   queryObj['price'] = priceQuery;
    // }
 */
