const Post = (sequelize, Sequelize) =>
    sequelize.define(
        'post',
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
            caption: {
                type: Sequelize.STRING,
            },
            tags: {
                type: Sequelize.STRING,
            },
            likes: {
                type: Sequelize.INTEGER,
            },
            image: {
                type: Sequelize.STRING,
            },
        },
    )

module.exports = Post;
