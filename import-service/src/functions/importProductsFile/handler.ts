import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatErrorResponse, formatApiResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { uploadObject } from '@services/bucketService';
import { logger } from '@libs/logger';

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { name } = event.queryStringParameters;
    if (!name) {
      return formatErrorResponse(400, '\'name\' is required parameter');
    }
    const signedUrl = await uploadObject(name);
    return formatApiResponse({
      statusCode: 200,
      body: signedUrl,
    });
  } catch (error) {
    logger.error(error);
    return formatErrorResponse(error);
  }
};

export const main = middyfy(handler);
