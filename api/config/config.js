const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV : Joi.string()
    .allow([ 'development', 'production', 'test', 'provision' ])
    .default('development'),
  PORT : Joi.number()
    .default(4040),
  // MONGOOSE_DEBUG: Joi.boolean()
  //   .when('NODE_ENV', {
  //     is: Joi.string().equal('development'),
  //     then: Joi.boolean().default(true),
  //     otherwise: Joi.boolean().default(false)
  //   }),
  JWT_SECRET : Joi.string().required()
    .description('JWT Secret required to sign'),
  // MONGO_HOST: Joi.string().required()
  //   .description('Mongo DB host url'),
  // MONGO_PORT: Joi.number()
  //   .default(27017)
  DB_USERNAME : Joi.string().required()
    .description('DB Username required'),
  DB_PASSWORD : Joi.string().required()
    .description('DB Password required'),
  DB_NAME : Joi.string().required()
    .description('DB Name required'),
  DB_HOST : Joi.string().required()
    .description('DB Host required'),
  DB_PORT : Joi.string().required()
    .description('DB Port required')
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env           : envVars.NODE_ENV,
  port          : envVars.PORT,
  mongooseDebug : envVars.MONGOOSE_DEBUG,
  jwtSecret     : envVars.JWT_SECRET,
  mongo         : {
    host : envVars.MONGO_HOST,
    port : envVars.MONGO_PORT
  },
  development : {
    username : 'kiki',
    password : 'kiki@db',
    database : 'linking_db',
    host     : 'gamekiki.duckdns.org',
    port     : '3306',
    dialect  : 'mysql'
  },
  production : {
    username       : envVars.DB_USERNAME,
    password       : envVars.DB_PASSWORD,
    database       : envVars.DB_NAME,
    host           : envVars.DB_HOST,
    port           : envVars.DB_PORT,
    dialect        : 'mysql',
    dialectOptions : { ssl: {} }
  }
};

module.exports = config;
