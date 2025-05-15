module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("Transaction", {
      transactionID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numberOfAssets: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DOUBLE
      },
      date: {
        type: Sequelize.DATEONLY
      },
      time: {
        type: Sequelize.TIME,
      },
      status: {
        type: Sequelize.ENUM('payed', 'reserved', 'cancelled')
      },
      sendAddress: {
        type: Sequelize.TEXT
      }
    }, {
      timestamps: true,
      freezeTableName: true,
    });
    return Transaction;
  };