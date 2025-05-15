module.exports = (sequelize, Sequelize) => {
    const DimensionValue = sequelize.define("DimensionValue", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      orderNr: {
        type: Sequelize.INTEGER,
      },
      dimension: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      exclusive: {
        type: Sequelize.BOOLEAN,
      },
    }, {
      timestamps: true,
      freezeTableName: true,
    });

    return DimensionValue};