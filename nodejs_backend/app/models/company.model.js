module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("Company", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      selected: {
        type: Sequelize.TINYINT(1),
      },
    }, {
      timestamps: true,
      freezeTableName: true,
    });
  
    return Company;
  };