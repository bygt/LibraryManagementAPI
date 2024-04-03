import { DataTypes, Model } from "sequelize";
import { sequelize } from "../helpers/sequelize";

export class Book extends Model {
	// Model attributes are defined here
	declare book_id: number;
	declare book_name: string;
	declare current_owner_id: number;
	declare avg_rating: number;
	declare is_available: number;
}
Book.init(
	{
		book_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		book_name: {
			type: DataTypes.STRING,
		},
		current_owner_id: {
			type: DataTypes.INTEGER,
		},
		avg_rating: {
			type: DataTypes.DECIMAL(3, 2),
		},
		is_available: {
			type: DataTypes.TINYINT,
		},
	},
	{
		sequelize,
		modelName: "Book",
		tableName: "books",
		timestamps: false,
		freezeTableName: true,
	},
);