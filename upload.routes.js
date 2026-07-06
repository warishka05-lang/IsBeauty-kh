import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4100),
  jwtSecret: process.env.JWT_SECRET || 'change_this_to_a_long_random_secret',
  adminLogin: process.env.ADMIN_LOGIN || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  clientOrigin: process.env.CLIENT_ORIGIN || '*'
};
