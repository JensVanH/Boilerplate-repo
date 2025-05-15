module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define("Booking", {
      bookingID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      info: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    }, {
      timestamps: true,
      freezeTableName: true,
    });
    return Booking;
  };