import { DataTypes, Model } from "sequelize";
import { sequelize } from "../helpers/sequelize";

export class Ownership extends Model {
	// Model attributes are defined here
	declare ownership_id: number;
	declare user_id: number;
	declare book_id: number;
	declare status: number;
}

Ownership.init(
	{
		ownership_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
		},
		book_id: {
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.TINYINT,
		},
	},
	{
		sequelize,
		modelName: "Ownership",
		tableName: "ownership",
		timestamps: false,
		freezeTableName: true,
	},
);