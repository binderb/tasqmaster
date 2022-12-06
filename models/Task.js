const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Task extends Model {}

Project.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label_id: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: "label_id:",
      autoIncrement: true,
    },
    status_id: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: "status_id",
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: "user_id",
      autoIncrement: true,
    },
    assignee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: "assignee_id",
      autoIncrement: true,
    },
    parent_id: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: "parent_id",
      autoIncrement: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "tasks",
  }
);

module.exports = Tasks;
