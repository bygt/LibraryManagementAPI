import { DataTypes, Model } from "sequelize";
import { sequelize } from "../helpers/sequelize";

export class User extends Model {
	// Model attributes are defined here
	declare user_id: number;
	declare username: string;
}

User.init(
	{
		user_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: "User",
		tableName: "users",
		timestamps: false,
		freezeTableName: true,
	},
);






