module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("Notification", {
      notificationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('new transaction', 'cancellation', 'payment confirmation', 'reviewable'),
        allowNull: false,
      },
      viewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
      },
      activeAt: {
        type: Sequelize.DATE
      }
    }, {
        timestamps: true,
        freezeTableName: true,
    });
    
    return Notification;
}
