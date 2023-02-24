import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { formatErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductById } from '@services/products';

export const main = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters.id;
    const product = await getProductById(productId);
    return formatJSONResponse(product);
  } catch (error) {
    return formatErrorResponse(400);
  }
});
