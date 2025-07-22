// Configuration for the application
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  PUSHER_APP_KEY: import.meta.env.VITE_PUSHER_APP_KEY || '7e6ca79ec16b6e86811c',
  PUSHER_APP_CLUSTER: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap2',
  BROADCASTING_AUTH_URL: import.meta.env.VITE_BROADCASTING_AUTH_URL || 'http://localhost:8000/broadcasting/auth',
} as const;

// Validate required environment variables
if (typeof window !== 'undefined') {
  const requiredEnvVars = ['VITE_PUSHER_APP_KEY'] as const;
  
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingEnvVars.join(', ')}\n` +
      'Real-time features may not work properly. Please check your .env file.'
    );
  }
}