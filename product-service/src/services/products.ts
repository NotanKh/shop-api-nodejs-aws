import { logger } from '@libs/logger';
import { getProductsListData } from '../database/products';

const data = require('../database/seeds/products.json');

export const getProductsList = async () => {
  try {
    return await getProductsListData();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const getProductById = (id) => {
  const product = data.find((item) => item.id === id);
  return product;
};
