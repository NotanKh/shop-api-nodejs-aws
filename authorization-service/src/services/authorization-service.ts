import { PolicyDocument } from 'aws-lambda';
import { generatePolicy } from '@libs/api-gateway';

enum PolicyEffects {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

export const authorize = (encodedCreds, methodArn): PolicyDocument => {
  const buff = Buffer.from(encodedCreds, 'base64');
  const [username, password] = buff.toString('utf-8').split('=');
  const [storedUsername, storedPassword] = process.env.ACCOUNT_CREDENTIALS.split('=');
  const storedUserAuthData = new Map([[storedUsername, storedPassword]]);

  const effect = (storedUserAuthData.has(username) && storedUserAuthData.get(username) === password) ? PolicyEffects.ALLOW : PolicyEffects.DENY;
  return generatePolicy(methodArn, effect);
};
