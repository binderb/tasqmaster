const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Status extends Model {}

Project.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "status",
  }
);

module.exports = Status;
