import { DataTypes, Model } from "sequelize";
import { sequelize } from "../helpers/sequelize";

export class Rating extends Model {
	// Model attributes are defined here
	declare rating_id: number;
	declare user_id: number;
	declare book_id: number;
	declare rating: number;
}

Rating.init(
	{
		rating_id: {
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
		score: {
			type: DataTypes.INTEGER,
		},
	},
	{
		sequelize,
		modelName: "Rating",
		tableName: "ratings",
		timestamps: false,
		freezeTableName: true,
	},
);