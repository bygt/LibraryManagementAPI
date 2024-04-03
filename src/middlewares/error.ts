import { NextFunction, Request, Response } from "express";
import ApiError from "../models/ApiError";

const errorMiddleware = (
	err: ApiError,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Handle the error here
	console.error(err);

	if (err.statusCode) {
		res.status(err.statusCode);
		return res.json({
			error: err.message,
		});
	}

	// Set the appropriate status code
	res.status(500);

	// Send the error response
	res.json({
		error: "Internal Server Error",
		message: "An unexpected error occurred",
	});
};

export default errorMiddleware;
