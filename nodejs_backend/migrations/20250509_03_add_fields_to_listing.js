// migrations/20250509_add_fields_to_listing.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Listing', 'verifierId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'User',
                key: 'userID'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        await queryInterface.addColumn('Listing', 'verified', {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            allowNull: true,
            defaultValue: 'pending'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Listing', 'verifierId');
        await queryInterface.removeColumn('Listing', 'verified');
    }
};