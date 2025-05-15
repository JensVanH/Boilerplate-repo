module.exports = (sequelize, Sequelize) => {
    const PropertyCompany = sequelize.define("PropertyCompany", {
      property: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
    }, {
      timestamps: true,
      freezeTableName: true,
    });
  
    return PropertyCompany;
  };