const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    port: config.PORT,
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// load models
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Listing = require("./listing.model.js")(sequelize, Sequelize);
db.Transaction = require("./transaction.model.js")(sequelize, Sequelize);
db.Category = require("./category.model.js")(sequelize, Sequelize);
db.Notification = require("./notification.model.js")(sequelize, Sequelize);
db.Review = require("./review.model.js")(sequelize, Sequelize);
db.Company = require("./company.model.js")(sequelize, Sequelize);
db.PropertyCompany = require("./propertycompany.model.js")(sequelize, Sequelize);
db.Registration = require("./registration.model.js")(sequelize, Sequelize);
db.Message = require("./message.model.js")(sequelize, Sequelize);
db.Booking = require("./booking.model.js")(sequelize, Sequelize);
db.Dimension = require("./dimension.model.js")(sequelize, Sequelize);
db.DimensionValue = require("./dimensionvalue.model.js")(sequelize, Sequelize);
db.ConstraintValue = require("./constraintsvalue.model.js")(sequelize, Sequelize);

// New: load organization model
db.Organization = require("./organization.model.js")(sequelize, Sequelize);




// add foreign keys
db.Listing.belongsTo(db.User, {
  foreignKey: 'userID',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Transaction.belongsTo(db.Listing, {
  foreignKey: 'listingID',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

db.Transaction.belongsTo(db.User, {
  foreignKey: 'customerID',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

db.Notification.belongsTo(db.User, {
  foreignKey: 'userID',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Notification.belongsTo(db.Transaction, {
  foreignKey: 'transactionID',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Review.belongsTo(db.Transaction, {
  foreignKey: 'transactionID',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

db.PropertyCompany.belongsTo(db.Company, {
  foreignKey: 'company',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.PropertyCompany.belongsTo(db.DimensionValue, {
  foreignKey: 'property',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Listing.belongsTo(db.Company, {
  foreignKey: 'company',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

db.Registration.belongsTo(db.Company, {
  foreignKey: 'company',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Registration.belongsTo(db.User, {
  foreignKey: 'userID',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.Message.belongsTo(db.User, {
  foreignKey: 'senderID',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

db.Message.belongsTo(db.User, {
  foreignKey: 'receiverID',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

db.Booking.belongsTo(db.Transaction, {
  foreignKey: 'transactionID',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

db.DimensionValue.belongsTo(db.Dimension, {
  foreignKey: 'dimension',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// New: foreign keys
db.Listing.belongsTo(db.User, {
    foreignKey: 'verifierId',
    as: 'verifier',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

db.Organization.hasMany(db.User, {
    foreignKey: 'organizationID',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

db.User.belongsTo(db.Organization, {
    foreignKey: 'organizationID',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

db.User.hasMany(db.Listing, {
    foreignKey: 'userID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Verifier 
db.User.hasMany(db.Listing, {
  foreignKey: 'verifierId',
  as: 'verifications',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = db;