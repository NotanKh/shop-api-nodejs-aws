import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { logger } from '@libs/logger';
import { handleError } from '@libs/error-handler';
import { ErrorCodes } from '@libs/constants';
import { ddbDocClient } from './index';
import ProductModel from './models/ProductModel';

const { PRODUCTS_TABLE_NAME } = process.env;

export const getProductsListData = async (): Promise<ProductModel[]> => {
  try {
    const commandOptions = {
      TableName: PRODUCTS_TABLE_NAME,
    };

    const command = new ScanCommand(commandOptions);
    const data = await ddbDocClient.send(command);
    logger.debug('Products list: ', JSON.stringify(data));
    return data.Items as ProductModel[];
  } catch (error) {
    throw handleError(error, logger, ErrorCodes.DATABASE_ERROR);
  }
};

export const getProductByIdData = async (product_id: string): Promise<ProductModel> => {
  try {
    const commandOptions = {
      TableName: PRODUCTS_TABLE_NAME,
      Key: {
        id: product_id,
      },
    };

    const command = new GetCommand(commandOptions);
    const data = await ddbDocClient.send(command);
    logger.debug('Product by ID: ', JSON.stringify(data));
    return data.Item as ProductModel;
  } catch (error) {
    throw handleError(error, logger, ErrorCodes.DATABASE_ERROR);
  }
};

export const putProductData = async (item: ProductModel): Promise<void> => {
  try {
    const commandOptions = {
      TableName: PRODUCTS_TABLE_NAME,
      Item: item,
    };
    const command = new PutCommand(commandOptions);
    const data = await ddbDocClient.send(command);
    logger.debug('New product created: ', JSON.stringify(data));
  } catch (error) {
    throw handleError(error, logger, ErrorCodes.DATABASE_ERROR);
  }
};
