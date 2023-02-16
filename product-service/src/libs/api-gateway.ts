import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return AddOriginHeaders({
    statusCode: 200,
    body: JSON.stringify(response)
  })
}

const AddOriginHeaders = (response) => ({
  ...response,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
})

export const formatErrorResponse = (statusCode: number = 500, message?: string) => {
  const res = { statusCode, body: message ? JSON.stringify(message) : 'Something went wrong' };

  return AddOriginHeaders(res)
}
