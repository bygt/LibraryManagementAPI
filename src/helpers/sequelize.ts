import { Sequelize } from "sequelize";
require("dotenv").config({ path: ".env" });

export const sequelize = new Sequelize({
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: "mysql",
});
