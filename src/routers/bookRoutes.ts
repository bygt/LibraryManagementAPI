import express, { Request, Response } from "express";
import Joi, { ValidationResult } from "joi";
const router = express.Router();
import catchAsync from "../helpers/catchAsync";
import { Book } from "../models/Book";
import ApiError from "../models/ApiError";

//get all books
router.get(	"/books",	catchAsync(async (req: Request, res: Response, next) => {
		const body = await Book.findAll();

		if (!body) {
			throw new ApiError(400, "Book not found !");
		}

		return res.status(200).send({ error: false, body });
	}),
);

//get one book

router.get("/books/:book_id",catchAsync( async (req: Request, res: Response, next) => {
	const schema = Joi.object({
		book_id: Joi.number().integer().min(1).required(),
	});
	const { book_id } = req.params;
	const { error } = schema.validate(req.params);
	if (error) return res.status(400).send({ error: error.details[0].message });

	
		//find book
		const book = await Book.findOne({ where: { book_id } });

		if (!book) {
			throw new ApiError(400, "Book not found !");
		}
 
		return res.status(200).send({ error: false, book });
	
}));

//create a book
router.post("/books", catchAsync (async (req: Request, res: Response) => {
	const schema = Joi.object({
		book_name: Joi.string().min(3).max(30).required(),
	});

	const { book_name } = req.body;
	const { error } = schema.validate(req.body);

	if (error) return res.status(400).send({ error: error.details[0].message });


		const book = await Book.create({
			book_name: book_name,
			current_owner: null,
			avg_rating: 0,
			is_available: true,
		});

    if (!book) {
      throw new ApiError(400, "Error while creating book, try again");                      
    }

	return res.status(200).send({ error: false, book });
	
}));

module.exports = router;
