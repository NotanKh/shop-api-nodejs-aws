const data = require('./mockData.json');

export const getProductsList = () => data;

export const getProductById = (id) => {
  const product = data.find((item) => item.id === id);
  return product;
};
