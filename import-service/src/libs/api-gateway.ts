import type { APIGatewayProxyResult } from 'aws-lambda';

const AddOriginHeaders = (response): APIGatewayProxyResult => ({
  ...response,
  headers: {
    ...response.headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
});

export const formatApiResponse = ({
  body,
  statusCode = 200,
  headers = {},
}) => AddOriginHeaders({
  statusCode, body, headers,
});

export const formatErrorResponse = (statusCode: number = 500, message?: string) => {
  const res = { statusCode, body: message ? JSON.stringify(message) : 'Something went wrong' };

  return formatApiResponse(res);
};
