export const port = process.env.PORT || 3000;
export const db = {
  user: process.env.DB_USER || 'admin',
  pwd: process.env.DB_PWD || 'Od5Z524CmNoq',
  host: process.env.DB_HOST || 'ds243285.mlab.com',
  port: process.env.DB_PORT || '43285',
  db: process.env.DB_NAME || 'almundo',
  prod: true,
};
