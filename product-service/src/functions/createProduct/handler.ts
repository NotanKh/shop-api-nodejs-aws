import { formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createProduct } from '@services/products';
import ProductSchema from './ProductSchema';
import { CreateProductDTO } from '../../dto/createProductDTO';

const createProductFn: ValidatedEventAPIGatewayProxyEvent<typeof ProductSchema> = async (event) => {
  try {
    const product = event.body as CreateProductDTO;
    const createdItem = await createProduct(product);
    return formatJSONResponse(createdItem);
  } catch (error) {
    return formatErrorResponse(400);
  }
};
export const main = middyfy(createProductFn);
