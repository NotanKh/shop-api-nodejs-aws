import { formatErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createProduct } from '@services/products';
import ProductSchema from './ProductSchema';

const createProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof ProductSchema> = async (event) => {
  try {
    const product = event.body;
    await createProduct(product);
    return formatJSONResponse({});
  } catch (error) {
    return formatErrorResponse(400);
  }
};

export const main = middyfy(createProductHandler);
