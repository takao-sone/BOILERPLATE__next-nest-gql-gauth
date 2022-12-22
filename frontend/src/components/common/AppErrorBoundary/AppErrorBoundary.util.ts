import { ClientError } from 'graphql-request';
import { ApiError } from 'next/dist/server/api-utils';
import { AppGraphQLErrorExtensions } from './AppErrorBoundary';

export const convertClientErrorToAPIError = (e: ClientError) => {
  const { errors } = e.response;
  if (errors && errors[0]) {
    const extensions = errors[0].extensions as AppGraphQLErrorExtensions;
    return new ApiError(extensions.response.statusCode, extensions.response.message);
  }
  return new ApiError(500, 'ClientError: fail to convert to APIErrro.');
};
