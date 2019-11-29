const Sequelize = require('sequelize');
const config = require('../../config/config');

function createConnection() {
  const mode = config.env;

  let sequelize;
  if (mode === 'production') {
    sequelize = new Sequelize(config.production.database, config.production.username, config.production.password, {
      host     : config.production.host,
      port     : config.production.port,
      dialect  : config.production.dialect,
      timezone : '+09:00',
      define   : { timestamps: false },
      logging  : false,
      pool     : { max: 50, min: 0 }
    });
  } else {
    sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
      host        : config.development.host,
      port        : config.development.port,
      dialect     : config.development.dialect,
      timezone    : '+09:00',
      dateStrings : true,
      define      : { timestamps: false },
      pool        : { max: 50, min: 0 }
    });
  }

  return sequelize;
}

module.exports = { createConnection };
