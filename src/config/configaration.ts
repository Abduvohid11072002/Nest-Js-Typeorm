export default () => ({
  port: parseInt(process.env.PORT, 10),
  salt: process.env.BCRYPT_SALT,
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USERNAME,
    pass: process.env.POSTGRES_PASSWORD,
  },
  jwt: {
    secret: process.env.TOKEN_SALT,
  },
  nodemail: {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: Number(process.env.MAIL_PORT),
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
  },
});
