import serverless from 'serverless-http';
import app from '../../server.js';

const expressHandler = serverless(app);

export const handler = async (event, context) => {
  const originalPath = event.path || '';
  const apiIndex = originalPath.indexOf('/api');

  if (apiIndex >= 0) {
    event.path = originalPath.slice(apiIndex);
  } else {
    event.path = `/api${originalPath.startsWith('/') ? originalPath : `/${originalPath}`}`;
  }

  return expressHandler(event, context);
};