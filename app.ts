import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import errorMiddleware from "./src/middlewares/error";

dotenv.config();
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./src/routers/userRoutes");
const bookRoutes = require("./src/routers/bookRoutes.ts");
const proccessRoutes = require("./src/routers/proccessRoutes.ts");

app.use(userRoutes);
app.use(bookRoutes);
app.use(proccessRoutes);
app.use(errorMiddleware);

app.get("/", async (req: Request, res: Response) => {
	try {
		return res.send({ message: "Welcome to the API" });
	} catch (error) {}
});

app.listen(port, () => {
	console.log("Server is running on port ", port);
});
