import { handlerPath } from "@libs/handler-resolver";


export const getProductsFunction = {
    handler: `${handlerPath(__dirname)}/handler.getProductsListHandler`,
    events: [
        {
            http: {
                method: 'get',
                path: 'product/available',
                cors: true
            },
        },
    ],
}

export const getProductByIdFunction = {
    handler: `${handlerPath(__dirname)}/handler.getProductByIdHandler`,
    events: [
        {
            http: {
                method: 'get',
                path: 'product/{id}',
                cors: true
            },
        },
    ],
}
