import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import middyJsonBodyParser from '@middy/http-json-body-parser';

export const middyfy = (handler) => middy(handler).use(httpHeaderNormalizer()).use(middyJsonBodyParser());
