import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@libs/handler-resolver';
/* eslint-disable no-template-curly-in-string */

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    ACCOUNT_CREDENTIALS: process.env.ACCOUNT_CREDENTIALS,
  },
} as AWS['functions']['function'];
