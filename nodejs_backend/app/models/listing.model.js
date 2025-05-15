module.exports = (sequelize, Sequelize) => {
    const Listing = sequelize.define("Listing", {
      listingID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userID: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      availableAssets: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      price: {
        type: Sequelize.DOUBLE
      },
      picture: { // base64 string
        type: Sequelize.TEXT('long')
      },
      file: { // base64 string
        type: Sequelize.TEXT('long')
      },
      link: {
        type: Sequelize.TEXT('long')
      },
      location: {
        type: Sequelize.STRING
      },
      // store categories as string (separated by ;)
      categories: {
        type: Sequelize.STRING,
        get() {
          let v = this.getDataValue('categories');
          return v ? v.split(';') : []
        },
        set(val=[]) {
          this.setDataValue('categories', val ? val.join(';'): []);
        },
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'active', 'cancelled', 'sold', 'draft'),
        allowNull: false,
        defaultValue: 'active'
      },

      company: {
        type: Sequelize.STRING,
      },
      verifierId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'User',
                key: 'userID'
            }
        }
    }, {
      timestamps: true,
      freezeTableName: true,
    });
    

    return Listing;
  };