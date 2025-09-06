import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'mnada_user',
  password: process.env.DB_PASSWORD || 'mnada_password',
  database: process.env.DB_NAME || 'mnada_db',
}));

export const supabaseConfig = registerAs('supabase', () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
}));

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  environment: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
}));

export const paymentConfig = registerAs('payment', () => ({
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    shortcode: process.env.MPESA_SHORTCODE,
    passkey: process.env.MPESA_PASSKEY,
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  useMockPayments: process.env.USE_MOCK_PAYMENTS === 'true',
}));

export const searchConfig = registerAs('search', () => ({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  masterKey: process.env.MEILISEARCH_MASTER_KEY || 'mnada_search_master_key_2025',
}));

export const storageConfig = registerAs('storage', () => ({
  bucket: process.env.SUPABASE_STORAGE_BUCKET || 'mnada-uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
}));

export const rateLimitConfig = registerAs('rateLimit', () => ({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
}));

export const notificationConfig = registerAs('notification', () => ({
  firebase: {
    serverKey: process.env.FIREBASE_SERVER_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
}));
