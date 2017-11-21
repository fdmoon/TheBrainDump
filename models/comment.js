module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define("Comment", {
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }, 
        author: {
            type: DataTypes.STRING,
            defaultValue: "Anonymous"
        }       
    });

    Comment.associate = function(models) {
        Comment.belongsTo(models.Post, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Comment;
};

