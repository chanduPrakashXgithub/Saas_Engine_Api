import dotenv from 'dotenv';
dotenv.config({ path: 'src/config/.env' });
export const env = {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL
};