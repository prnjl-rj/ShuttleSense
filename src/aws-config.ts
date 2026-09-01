import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    },
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_APPSYNC_GRAPHQL_ENDPOINT,
      region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
      defaultAuthMode: 'apiKey',
      apiKey: import.meta.env.VITE_APPSYNC_API_KEY,
    },
  },
});

export default Amplify;