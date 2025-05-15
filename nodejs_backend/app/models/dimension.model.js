module.exports = (sequelize, Sequelize) => {
    const Dimension = sequelize.define("Dimension", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      orderNr: {
        type: Sequelize.INTEGER,
      },
      mandatory: {
        type: Sequelize.BOOLEAN,
      },
      description: {
        type: Sequelize.TEXT,
      },
    }, {
      timestamps: true,
      freezeTableName: true,
    });
  
    return Dimension;
  };