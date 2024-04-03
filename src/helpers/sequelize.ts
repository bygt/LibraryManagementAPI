import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("invent_case", "databuse", "77yyuu", {
	host: "localhost",
	dialect: "mysql",
});


