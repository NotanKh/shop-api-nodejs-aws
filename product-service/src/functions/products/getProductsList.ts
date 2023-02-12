import { APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getProductsList } from "../../services/products";

export const getProductsListHandler = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const productsList = getProductsList();
    return formatJSONResponse(productsList)
})
