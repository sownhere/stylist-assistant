"use strict";
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    protocol: process.env.DEV_DB_PROTOCOL,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    dbName: process.env.DEV_DB_NAME,
  },
};

const production = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    protocol: process.env.PROD_DB_PROTOCOL,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    dbName: process.env.PROD_DB_NAME,
  },
};

const config = { dev, production };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
/*
"use strict";
// eslint-disable-line

// level 0

const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};

// level 1

const pro = {
  app: {
    port: process.env.PRO_APP_PORT,
  },
  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME,
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
console.log(`Current environment: ${env}`, config[env]);
module.exports = config[env];
*/
