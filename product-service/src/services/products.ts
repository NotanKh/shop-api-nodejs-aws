import { logger } from '@libs/logger';
import { handleError } from '@libs/error-handler';
import { v4 as uuid } from 'uuid';
import { NO_STOCK_COUNT } from '@libs/constants';
import { getProductByIdData, getProductsListData, putProductData } from '../database/products';
import { getStockListData, putStockData } from '../database/stock';
import ProductModel from '../database/models/ProductModel';
import StockModel from '../database/models/StockModel';
import ProductStockModel from '../database/models/ProductStockModel';
import { CreateProductDTO } from '../dto/createProductDTO';

const joinProductsStock = (productsList: ProductModel[], stockList: StockModel[]): ProductStockModel[] => {
  const stockMap = new Map();
  stockList.forEach(({ product_id, count }) => {
    stockMap.set(product_id, count);
  });
  const joinedList = productsList.map((product) => {
    const count = stockMap.has(product.id) ? stockMap.get(product.id) : NO_STOCK_COUNT;
    if (count === NO_STOCK_COUNT)logger.warn(`Product with id: ${product.id} has no stock`);
    return { ...product, count };
  });

  return joinedList.filter(({ count }) => count >= 0);
};

export const getProductsList = async (): Promise<ProductStockModel[]> => {
  try {
    const [productsList, stockList] = await Promise.all([await getProductsListData(), await getStockListData()]);
    return joinProductsStock(productsList, stockList);
  } catch (error) {
    throw handleError(error, logger);
  }
};

export const getProductById = async (id: string): Promise<ProductModel> => {
  try {
    return await getProductByIdData(id);
  } catch (error) {
    throw handleError(error, logger);
  }
};

export const createProduct = async ({ count, ...product }: CreateProductDTO): Promise<void> => {
  try {
    const id = uuid();
    const productData: ProductModel = { ...product, id };
    const stockData: StockModel = { product_id: id, count };
    await Promise.all([putProductData(productData), putStockData(stockData)]);
    // TODO remove items, if one of operations was failed
  } catch (error) {
    throw handleError(error, logger);
  }
};

export const butchCreateProducts = async (products: CreateProductDTO[]): Promise<{ createdProducts: CreateProductDTO[], failedProducts: CreateProductDTO[] }> => {
  try {
    const createdProducts = [];
    const failedProducts = [];
    const creatingPromises = products.map(async (product) => {
      try {
        await createProduct(product);
        createdProducts.push(product);
      } catch (error) {
        failedProducts.push({ data: product, error });
      }
    });
    await Promise.all(creatingPromises);
    return { createdProducts, failedProducts };
  } catch (error) {
    throw handleError(error, logger);
  }
};
