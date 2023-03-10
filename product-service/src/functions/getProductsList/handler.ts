import { APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductsList } from '@services/products';

export const main = middyfy(async (): Promise<APIGatewayProxyResult> => {
  const productsList = await getProductsList();
  return formatJSONResponse(productsList);
});
