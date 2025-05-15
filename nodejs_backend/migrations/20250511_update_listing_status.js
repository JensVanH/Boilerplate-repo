// Migration script (e.g., 20250520_update_listing_status.js)
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Listing', 'status', {
            type: Sequelize.ENUM('active', 'pending', 'rejected', 'cancelled', 'sold'),
            allowNull: false,
            defaultValue: 'active'
        });

        await queryInterface.removeColumn('Listing', 'verified');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Listing', 'verified', {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            allowNull: true,
            defaultValue: 'pending'
        });

        await queryInterface.changeColumn('Listing', 'status', {
            type: Sequelize.ENUM('active', 'cancelled', 'sold'),
            allowNull: false,
            defaultValue: 'active'
        });
    }
};
