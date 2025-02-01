export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

// Verify the environment variable is loaded
console.log('App URL:', config.appUrl);
