const FileJobStatuses = require("../constants/enums/FileJobStatuses");


module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'File',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_uri: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      environment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: FileJobStatuses.PENDING,
      },
      error_message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uploader_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'file',
      timestamps: true,
    }
  );
}; 