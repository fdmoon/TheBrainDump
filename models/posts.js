module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    },
    file_location: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    timeout: {
      type:DataTypes.NOW,
      allowNull: false,
    },
    shared: {
      type:DataTypes.BOOLEAN,
      allowNull: false,
    },
    like_count: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    dislike_count: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    userid {

    },
  });

  Post.associate = function(models) {
    // We're saying that a Post should belong to an User
    // A Post can't be created without an User due to the foreign key constraint
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Post;
};
