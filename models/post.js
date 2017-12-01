module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        file_location: {
            type: DataTypes.STRING,
        },
        timeout: {
            type: DataTypes.INTEGER,
            defaultValue: 24
        },
        shared: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        like_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislike_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        extended: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Post.associate = function(models) {
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    Post.associate = function(models) {
        Post.hasMany(models.Comment, {
            onDelete: "cascade"
        });
    };

    return Post;
};
