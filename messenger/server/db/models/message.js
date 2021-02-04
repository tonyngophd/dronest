'use strict';
module.exports = (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define('DirectMessage', {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    viewStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});
  DirectMessage.associate = function(models) {
    // associations can be defined here
    DirectMessage.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId'});
    DirectMessage.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId'});
  };
  return DirectMessage;
};