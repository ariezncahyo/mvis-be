const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');

const ssl = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      dialectOptions: {
        ssl: {
          require: true,
        },
      },
    };
  }
  return {};
};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  timezone: '+07:00',
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  dialectOptions: ssl().dialectOptions,
  operatorsAlises: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  define: {
    underscoredAll: true,
    underscored: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user')(sequelize, Sequelize);
db.post = require('./post')(sequelize, Sequelize);
db.user_like = require('./user_liked')(sequelize, Sequelize);

db.user.hasMany(db.post, { foreignKey: 'user_id' });
db.post.belongsTo(db.user, { foreignKey: 'user_id' });

db.post.hasMany(db.user_like, { foreignKey: 'post_id'});
db.user_like.belongsTo(db.post, { foreignKey: 'post_id'});

db.user.hasMany(db.user_like, { foreignKey: 'user_id'});
db.user_like.belongsTo(db.user, { foreignKey: 'user_id'});

module.exports = db;
