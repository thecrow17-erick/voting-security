

export const envConfig = () => ({
  enviroment : process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  database_url: process.env.DATABASE_URL
})