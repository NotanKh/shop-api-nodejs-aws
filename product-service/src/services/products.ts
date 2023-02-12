const data = require('./mockData.json');

export const getProductsList = () => {
    return data;
}

export const getProductById = (id) => {
    const product = data.find(item => item.id === id);
    return product;
}
