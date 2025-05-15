module.exports = (sequelize, Sequelize) => {
    const Registration = sequelize.define("Registration", {
      userID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      company: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
    }, {
        timestamp: false,
      freezeTableName: true,
    });
    return Registration;
  };