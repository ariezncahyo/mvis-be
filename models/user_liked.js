const UserLiked = (sequelize, Sequelize) =>
    sequelize.define(
        'user_liked',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            public_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
        },
    )

module.exports = UserLiked;
