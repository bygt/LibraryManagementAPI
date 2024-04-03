import express, { Request, Response } from "express";
import Joi, { ValidationResult } from "joi";
import { Sequelize } from "sequelize";
const router = express.Router();
import { Op } from "sequelize";
import { User } from "../models/User";
import { Ownership } from "../models/Ownership";
import { Book } from "../models/Book";
import { Rating } from "../models/Rating";
import catchAsync from "../helpers/catchAsync";
import ApiError from "../models/ApiError";

// //borrow book
router.post(  "/users/:user_id/borrow/:book_id",catchAsync(  async (req: Request, res: Response, next) => {
    const schema = Joi.object({
      user_id: Joi.number().integer().min(1).required(),
      book_id: Joi.number().integer().min(1).required(),
    });
    const { user_id, book_id } = req.params;
    const { error } = schema.validate(req.params);
    if (error) return res.status(400).send({ error: error.details[0].message });

      //find user
      const user = await User.findOne({ where: { user_id } });
	  if (!user) throw new ApiError(400, "User not found !");
      // find book
      const book = await Book.findOne({ where: { book_id } });
	  if (!book) throw new ApiError(400, "Book not found !");						
      //find Ownership
      const ownershipControl = await Ownership.findOne({
		where: { user_id, book_id },
	  });

      if (ownershipControl && ownershipControl.status == 1) {
		throw new ApiError(400, "User has already borrowed this book");
        
      } else if (ownershipControl && ownershipControl.status == 0) {
        const updatedOwnership = await Ownership.update(
          { status: 1 },
          { where: { user_id, book_id } }
        );
      } else if (!ownershipControl) {
        //ownerhip status 1: borrowed
        const ownership = await Ownership.create({
          user_id,
          book_id,
          status: 1,
        });
      }

      if (book.is_available == 0) throw new ApiError(400, "Book is not available");

      const updateBook = await Book.update(
        { current_owner_id: user_id, is_available: 0 },
        { where: { book_id } }
      );

      if (!updateBook) throw new ApiError(400, "Error while borrowing book, try again");

      return res.status(200).send({
        error: false,
        message: `User ${user.username} borrowed book ${book.book_name} successfully.`,
      });
    
  }
));

// //return book
router.post( "/users/:user_id/return/:book_id",catchAsync(  async (req: Request, res: Response, next) => {
    const schema = Joi.object({
      user_id: Joi.number().integer().min(1).required(),
      book_id: Joi.number().integer().min(1).required(),
    });
    const { user_id, book_id } = req.params;
    const { error } = schema.validate(req.params);

    if (error) return res.status(400).send({ error: error.details[0].message });


      //find user
      const user = await User.findOne({ where: { user_id } });

	  if (!user) throw new ApiError(400, "User not found !");

      // find book
      const book = await Book.findOne({ where: { book_id } });

	  if (!book) throw new ApiError(400, "Book not found !");

      //update ownership and book
      //ownerhip status 1: returned
      const check_ownership = await Ownership.findOne({
        where: { user_id, book_id },
      });

      if (!check_ownership || check_ownership.status == 0) throw new ApiError(400, "User has not borrowed this book");

      const ownership = await Ownership.update(
        { status: 0 },
        { where: { user_id, book_id } }
      );

      const updateBook = await Book.update(
        { current_owner_id: null, is_available: 1 },
        { where: { book_id } }
      );

      if (!ownership || !updateBook) throw new Error("Error while returning book, try again");
	  

      return res.status(200).send({
        error: false,
        message: `User ${user.username} returned book ${book.book_name} successfully.`,
      });
    
  }
));

//rate book

router.post("/users/:user_id/rate/:book_id/score/:score",catchAsync (async (req: Request, res: Response, next) => {
    const schema = Joi.object({
      user_id: Joi.number().integer().min(1).required(),
      book_id: Joi.number().integer().min(1).required(),
      score: Joi.number().integer().min(1).max(5).required(),
    });
    const { user_id, book_id, score } = req.params;
    const { error } = schema.validate(req.params);

    if (error) return res.status(400).send({ error: error.details[0].message });

   
      //check user
      const user = await User.findOne({ where: { user_id } });
	  if (!user) throw new ApiError(400, "User not found !");
      // check book
      const book = await Book.findOne({ where: { book_id } });
	  if (!book) throw new ApiError(400, "Book not found !");


      // find book's total score
      const totalScore = await Rating.findAndCountAll({
        where: { book_id },
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("score")), "total_score"],
        ],
      });

      const book_totalscore = totalScore.rows[0].dataValues.total_score;


      //find users rating
      const rating = await Rating.findOne({
        where: {
          user_id,
          book_id,
        },
      });

      if (rating) {
        //update rating
        const body = await Rating.update(
          { score },
          { where: { user_id, book_id } }
        );

        const newScore =  parseInt(book_totalscore) - rating.dataValues.score + parseInt(score);
		const newAvg = newScore / totalScore.count;

        const updateBook = await Book.update(
          { avg_rating: newAvg },
          { where: { book_id } }
        );

        return res.status(200).send({ error: false, newAvg, body });
      } 
	else {
        //create rating
        const body = await Rating.create({
          user_id,
          book_id,
          score,
        });

		console.log("totalScore", parseInt(book_totalscore));
		console.log("yeni verilen score", parseInt(score));
        const newScore = parseInt(book_totalscore) + parseInt(score);
	
		console.log("newScore", newScore)

        const newAvg = newScore / (totalScore.count + 1);
		console.log("totalScore count ", totalScore.count);
		console.log("newAvg", newAvg);

		const updateBook = await Book.update(
		  { avg_rating: newAvg },
		  { where: { book_id } }
		);
		if (!updateBook) throw new ApiError(400, "Error while rating book, try again");

        return res.status(200).send({ error: false, newAvg });
      }
  

  }
));
module.exports = router;
